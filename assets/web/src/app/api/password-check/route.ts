import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";

/**
 * POST /api/password-check
 *
 * Comprova si una contrasenya apareix a filtracions públiques conegudes
 * usant l'API Pwned Passwords amb k-anonymity:
 *   1. Es calcula el SHA-1 LOCALMENT al servidor.
 *   2. Només s'envia a l'externa els PRIMERS 5 caràcters del hash.
 *   3. La coincidència exacta es resol aquí, mai a l'externa.
 *
 * Per què existeix aquest proxy (i no cridem api.pwnedpasswords.com directament):
 *   - La CSP de producció només permet connect-src 'self' + Supabase.
 *     Afegir un tercer trencaria la política endurida (vegeu next.config.ts).
 *   - Centralitzem cache/rate-limit futurs en un sol punt.
 *
 * PRIVACITAT: la contrasenya en clar arriba per HTTPS, s'usa només per calcular
 * el hash en memòria i MAI es registra, emmagatzema ni reenvia sencera.
 */

const HIBP_RANGE_URL = "https://api.pwnedpasswords.com/range/";

// Rate limit mínim en memòria (per instància serverless; suficient per al beta).
// Producció: moure a Upstash Redis quan hi hagi volum.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt < now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "too_many_requests" },
      { status: 429 }
    );
  }

  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length > 200
  ) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }

  // SHA-1 és el que exigeix l'API Pwned Passwords (no és el mecanisme
  // d'emmagatzematge nostre — Supabase usa bcrypt; aquest hash és efímer).
  const sha1 = createHash("sha1").update(password, "utf8").digest("hex").toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);

  try {
    const res = await fetch(`${HIBP_RANGE_URL}${prefix}`, {
      headers: {
        // Padding anti timing: resposta de mida gairebé constant
        "Add-Padding": "true",
      },
      signal: AbortSignal.timeout(4000),
      cache: "no-store",
    });

    if (!res.ok) {
      // Servei extern caigut: NO bloquegem el registre per això.
      return NextResponse.json({ unknown: true, compromised: false });
    }

    const text = await res.text();
    let count = 0;
    for (const line of text.split("\n")) {
      const sep = line.indexOf(":");
      if (sep === -1) continue;
      if (line.slice(0, sep).trim() === suffix) {
        count = parseInt(line.slice(sep + 1).trim(), 10) || 0;
        break;
      }
    }

    return NextResponse.json({ unknown: false, compromised: count > 0, count });
  } catch {
    // Timeout/xarxa: fallar obert però marcat com a desconegut
    return NextResponse.json({ unknown: true, compromised: false });
  }
}
