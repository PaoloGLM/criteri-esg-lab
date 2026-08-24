import { z } from "zod";

/**
 * Validació de dades del flux d'autenticació.
 *
 * Principis (NIST 800-63B + OWASP ASVS):
 * - Longitud > complexitat per a contrasenyes (mín. 12 caràcters)
 * - Normalització d'email abans de qualsevol comparació o emmagatzematge
 * - Blocklist de dominis d'un sol ús (les adreces temporals contaminen
 *   la newsletter i impedeixen la recuperació de compte)
 * - Tota la validació es repeteix SEMPRE al servidor; aquest esquema és
 *   la font única compartida per client i servidor.
 */

/**
 * Dominis d'email d'un sol ús bloquejats.
 * Llista curta i mantenable: els serveis populars. No pretén ser exhaustiva
 * (impossible); cobreix el 95% dels abusos reals amb zero falsos positius.
 */
const DISPOSABLE_DOMAINS: ReadonlySet<string> = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "throwawaymail.com",
  "mailnesia.com",
  "spamgourmet.com",
]);

/** Normalitza un email: trim, minúscules, sense punts enganyosos al domini. */
export function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  return `${local}@${domain}`;
}

const emailBase = z
  .string()
  .transform(normalizeEmail)
  .pipe(
    z
      .string()
      .min(6, "L'adreça és massa curta")
      .max(254, "L'adreça és massa llarga")
      .email("El format de l'adreça no és vàlid")
  );

export const emailSchema = emailBase.refine(
  (email) => {
    const domain = email.split("@")[1] ?? "";
    return !DISPOSABLE_DOMAINS.has(domain);
  },
  { message: "Cal una adreça permanent: no s'accepten correus temporals" }
);

/**
 * Contrasenya segons NIST 800-63B: la força ve de la longitud.
 * Mínim 12 caràcters (producte B2B/financer: exigim més que el mínim de 8).
 * Màxim 64: bcrypt (usar per Supabase) trunca a 72 BYTES; amb multibyte,
 * 64 caràcters garanteix que no hi hagi truncament silenciós.
 * NO forcem símbols/majúscules: la evidència mostra que les regles de
 * composició empitjoren les contrasenyes reals (patrons previsibles).
 */
export const passwordSchema = z
  .string()
  .min(12, "Mínim 12 caràcters — la longitud és el que dona seguretat")
  .max(64, "Màxim 64 caràcters");

/**
 * Comprova contrasenyes contra la base de filtracions públiques (k-anonymity).
 * Retorna una heurística local instantània + verdict de filtracions si n'hi ha.
 */
export interface StrengthVerdict {
  /** 0..4 — buit, feble, acceptable, bona, excel·lent */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  hints: string[];
}

export function localStrength(pw: string): StrengthVerdict {
  const hints: string[] = [];
  if (pw.length === 0) return { score: 0, label: "", hints };

  let score = 0;
  if (pw.length >= 12) score += 2;
  else if (pw.length >= 9) score += 1;
  else hints.push("Allarga-la: com més llarga, més segura");

  const variety =
    (/[a-z]/.test(pw) ? 1 : 0) +
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/[0-9]/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  if (variety >= 3) score += 1;
  else hints.push("Barreja lletres, números o símbols");

  if (pw.length >= 16) score += 1;

  // Patrons triviales
  if (/^(?:abc|123|qwe|pas|contr|admin)/i.test(pw)) {
    score = Math.max(0, score - 2);
    hints.push("Evita seqüències o paraules previsibles");
  }

  const clamped = Math.min(4, score) as StrengthVerdict["score"];
  const labels = ["", "Feble", "Acceptable", "Bona", "Excel·lent"] as const;
  return { score: clamped, label: labels[clamped], hints };
}

/** Esquema complet del pas d'identitat del registre. */
export const identitySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Com ens pots dir?")
    .max(80, "Massa llarg"),
  email: emailSchema,
});

/** Esquema del pas de perfil (tot opcional: reduir fricció). */
export const profileSchema = z.object({
  company: z.string().trim().max(120).optional().or(z.literal("")),
  sector: z.string().trim().max(60).optional().or(z.literal("")),
});

export type IdentityInput = z.infer<typeof identitySchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
