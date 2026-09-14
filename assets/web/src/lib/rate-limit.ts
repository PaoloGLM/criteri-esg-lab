/**
 * Rate limit compart en memòria (per instància serverless).
 *
 * Suficient per al volum actual (beta tancada, pocs usuaris). Limitació
 * coneguda: cada instància de Vercel té el seu propi Map, així que el límit
 * efectiu es multiplica pel nombre d'instàncies actives. Per a producció amb
 * volum, migrar a Upstash Redis (mateixa interfície).
 *
 * Ús:
 *   if (isRateLimited(req, "admin", { max: 30, windowMs: 60_000 }))
 *     return errorJson(ERR.RATE_LIMIT, "Massa peticions", 429);
 */

const store = new Map<string, { count: number; resetAt: number }>();

// Neteja periòdica per no accumular claus velles indefinidament.
let lastSweep = Date.now();

export interface RateRule {
  /** Peticions màximes per finestra. */
  max: number;
  /** Finestra en mil·lisegons. */
  windowMs: number;
}

export function isRateLimited(
  req: Request,
  bucket: string,
  rule: RateRule
): boolean {
  const now = Date.now();
  if (now - lastSweep > 10 * 60_000) {
    lastSweep = now;
    store.forEach((v, k) => {
      if (v.resetAt < now) store.delete(k);
    });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const key = `${bucket}:${ip}`;
  const entry = store.get(key);
  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + rule.windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > rule.max;
}
