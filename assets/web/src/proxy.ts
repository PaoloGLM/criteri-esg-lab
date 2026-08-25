import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware d'autenticació Basic HTTP.
 *
 * És PROVISIONAL — serveix per amagar la web mentre es desenvolupa (fins al
 * llançament al setembre 2026). Un cop la web sigui pública, aquest middleware
 * s'ha d'eliminar.
 *
 * SEGURETAT:
 * - Mai fa fallback a valors per defecte. Si SITE_USERNAME o SITE_PASSWORD
 *   no estan definides, el middleware rebutja TOTA petició amb 500.
 *   Això evita que un error de configuració deixi la web amb credencials
 *   hardcoded (que estarien al repo públic).
 * - Les credencials es comparen amb timing-safe comparison per evitar
 *   atacs de timing.
 * - En desenvolupament (NODE_ENV !== 'production'), es permet un fallback
 *   a credencials per defecte per conveniència, però es logueja un warning.
 */

const USERNAME = process.env.SITE_USERNAME;
const PASSWORD = process.env.SITE_PASSWORD;
const IS_PROD = process.env.NODE_ENV === "production";

// En dev, si no hi ha env vars, fem servir valors per defecte per conveniència.
// En producció, mai.
const DEV_USERNAME = "criteri";
const DEV_PASSWORD = "esg2026";

function getEffectiveCredentials(): { username: string; password: string } | null {
  if (USERNAME && PASSWORD) {
    return { username: USERNAME, password: PASSWORD };
  }
  if (!IS_PROD) {
    console.warn(
      "[proxy] SITE_USERNAME/SITE_PASSWORD no definides. Utilitzant credencials de dev per defecte. NO usar en producció."
    );
    return { username: DEV_USERNAME, password: DEV_PASSWORD };
  }
  return null;
}

/**
 * Comparació timing-safe per evitar atacs de timing.
 * Si les longituds diferents, fem una comparació dummy per mantenir el temps constant.
 */
function safeCompare(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) {
    // Longitud diferent — retornem false sense fer res més.
    // No és possible fer timing-safe perfecte amb longituds diferents sense
    // comparar primer els hash, però per al nostre cas d'ús (Basic Auth)
    // és suficient: un atacant no pot extreure informació útil del timing.
    return false;
  }
  // Comparació constant-time: XOR bit a bit, OR acumulatiu.
  // Si tots els bytes són iguals, el resultat és 0.
  let result = 0;
  for (let i = 0; i < bufA.length; i++) {
    result |= bufA[i] ^ bufB[i];
  }
  return result === 0;
}

export function proxy(request: NextRequest) {
  // En desenvolupament local (next dev), la web és oberta: és el entorn de
  // treball de Paolo/Roser. La protecció Basic Auth només aplica a producció.
  if (!IS_PROD) {
    return NextResponse.next();
  }

  const creds = getEffectiveCredentials();

  // En producció sense credencials configurades, error 500.
  // Això és intencional: mai volem deixar la web oberta per error.
  if (!creds) {
    console.error(
      "[proxy] PRODUCCIÓ sense SITE_USERNAME/SITE_PASSWORD configurades. Rebutjant tot el tràfic."
    );
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const [type, credentials] = authHeader.split(" ");
    if (type === "Basic" && credentials) {
      try {
        const decoded = Buffer.from(credentials, "base64").toString("utf-8");
        const colonIdx = decoded.indexOf(":");
        if (colonIdx === -1) {
          return unauthorizedResponse();
        }
        const user = decoded.slice(0, colonIdx);
        const pass = decoded.slice(colonIdx + 1);
        if (safeCompare(user, creds.username) && safeCompare(pass, creds.password)) {
          return NextResponse.next();
        }
      } catch {
        // base64 invàlid — tractar com a no autenticat
      }
    }
  }

  return unauthorizedResponse();
}

function unauthorizedResponse() {
  return new NextResponse("Autenticacio necessaria", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Criteri ESG"',
    },
  });
}

export const config = {
  // Aplicar a totes les rutes excepte arxius estàtics, mockups HTML i les
  // rutes PÚBLIQUES per producte: el registre d'usuaris i el seu check de
  // contrasenyes han de ser accessibles sense Basic Auth (si no, ningú no
  // es pot registrar). /api/password-check té rate limit propi.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.svg|robots.txt|llms.txt|fiare-form-mockup.html|registro-mockup.html|upgrade-contextual-mockup.html|cuenta-mockup.html|cuenta-mockup-todas.html|privacidad.html|newsletter-mockup.html|registro|api/password-check).*)"],
};
