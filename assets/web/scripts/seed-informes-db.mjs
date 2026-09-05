// Seed: puja els 10 informes hard-coded a la taula public.informes de Supabase.
// Ús:  node scripts/seed-informes-db.mjs
// Requereix: assets/web/.env.vercel-pull amb SUPABASE_SERVICE_ROLE_KEY
// Idempotent: fa upsert per slug (no duplica, no esborra res).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const webDir = join(__dirname, "..");

// Carregar env sense imprimir res sensible
const envText = readFileSync(join(webDir, ".env.vercel-pull"), "utf8");
const env = Object.fromEntries(
  envText
    .split(/\r?\n/)
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Falten NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

// Carregar el catàleg TS directament (node 24 el parseja com ESM)
const { reports } = await import(
  new URL("../src/lib/reports.ts", `file://${__dirname.replace(/\\/g, "/")}/`).href
);
console.log(`Carregats ${reports.length} informes del codi font`);

let ok = 0;
for (const r of reports) {
  const row = {
    slug: r.slug,
    title: r.title,
    institution: r.institution,
    date: r.date,
    pages: r.pages ?? 0,
    type: r.type ?? "official",
    scope: r.scope ?? "EU",
    tags: r.tags ?? [],
    certifications: r.certifications ?? [],
    summary: r.summary ?? "",
    url: r.url ?? "",
    content_ca: r.content_ca ?? null,
    content_es: r.content_es ?? null,
    status: "published",
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/informes?on_conflict=slug`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(row),
  });

  if (res.ok) {
    ok++;
    console.log(`  ✓ ${r.slug}`);
  } else {
    const body = await res.text();
    console.error(`  ✗ ${r.slug} → HTTP ${res.status}: ${body.slice(0, 300)}`);
  }
}
console.log(`Fet: ${ok}/${reports.length} informes a la BD`);
process.exit(ok === reports.length ? 0 : 1);
