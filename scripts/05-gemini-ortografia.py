"""
Pas 5 del flux: Gemini corregeix ortografia i estil (CA + ES).

Per cada .md a /data/informes/3-fets/:
1. Llegeix el Markdown (CA i ES)
2. Crida Gemini 2.5 Flash per corregir ortografia, gramàtica, anglicismes
3. Guarda la versió corregida a /data/informes/4-revisats-ortografia/

Ús:
    scripts/.venv/bin/python scripts/05-gemini-ortografia.py [slug]
"""
import sys
import time
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from gemini_client import call_gemini

FETS_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes/3-fets")
REVISATS_DIR = Path("/home/z/my-project/criteri-esg-lab/data/informes/4-revisats-ortografia")
REVISATS_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """Ets un corrector ortogràfic i d'estil expert en català i castellà.

Rebs un informe en format Markdown i l'has de RETORNAR CORREGIT — no llistar les correccions.

CORREGEIX directament sobre el text:
1. **Errors ortogràfics** (majúscules, accents, dièresis, etc.)
2. **Errors gramaticals** (concordança, temps verbals, etc.)
3. **Anglicismes innecessaris** — substitueix per equivalents naturals (ex: "datapoints" → "punts de dades", "value chain cap" → "límit de la cadena de valor", "disclosure" → "divulgació", "reporting" → "presentació d'informes")
4. **Errors de traducció** (compara les dues versions si pot inferir coherència)
5. **Puntuació** (comes, punts, comes entre clàusules)

REGLA CRÍTICA:
- **NO modifiquis el contingut ni l'estructura**. Només corregeixes ortografia/estil.
- **Conserves el front-matter YAML intacte**.
- **NO tornis un JSON ni una llista de correccions**. Torna el Markdown sencer corregit.

La teva resposta ha de ser EXACTAMENT el Markdown corregit, començant pel `---` del front-matter. Sense comentaris, sense explicacions, sense "Aquí tens la versió corregida:"."""


def correct_one(md_path: Path) -> bool:
    """Corregeix un fitxer Markdown."""
    slug_with_lang = md_path.stem  # ex: eu-taxonomy-delegated-act.ca
    output_path = REVISATS_DIR / md_path.name

    if output_path.exists():
        # Refem sempre (idempotent per al test, però no es salta)
        pass

    print(f"  → Corregint {md_path.name}...")
    content = md_path.read_text(encoding="utf-8")

    # Determinar idioma pel sufix o pel front-matter
    lang = "es" if ".es." in md_path.name else "ca"

    user_prompt = f"""Corregeix aquest informe en {"castellà" if lang == "es" else "català"}.

=== INFORME ===
{content}
=== FI ===

Torna el Markdown corregit (començant per ---)."""

    corrected = call_gemini(SYSTEM_PROMPT, user_prompt, temperature=0.2, max_tokens=16000, force_text=True)

    # Netejar: si Gemini ha afegit text abans del ---
    if "---" in corrected:
        idx = corrected.index("---")
        if idx > 0:
            corrected = corrected[idx:]

    output_path.write_text(corrected, encoding="utf-8")
    print(f"  ✓ Guardat: {output_path.name} ({len(corrected)} chars)")
    return True


def process_slug(slug: str) -> bool:
    """Processa un slug (versions CA + ES)."""
    ca_path = FETS_DIR / f"{slug}.ca.md"
    es_path = FETS_DIR / f"{slug}.es.md"

    if not ca_path.exists() or not es_path.exists():
        print(f"  ✗ Falten versions (CA o ES) per {slug}")
        return False

    print(f"\n=== Corregint: {slug} ===")
    ok = True
    if not correct_one(ca_path):
        ok = False
    time.sleep(1)
    if not correct_one(es_path):
        ok = False
    return ok


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 5: Gemini corregeix ortografia (CA + ES) ===\n")
    print(f"Model: gemini-2.5-flash\n")
    print(f"Fets: {FETS_DIR}")
    print(f"Destinació: {REVISATS_DIR}\n")

    # Llistar slugs (treure .ca.md / .es.md)
    md_files = sorted(FETS_DIR.glob("*.md"))
    slugs = sorted({p.name.rsplit(".", 2)[0] for p in md_files})
    print(f"Informes redactats: {len(slugs)}\n")

    if target:
        slugs = [s for s in slugs if target.lower() in s.lower()]
        if not slugs:
            print(f"✗ No s'ha trobat cap informe que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(slugs)} informe(s)")

    ok = 0
    failed = 0
    for slug in slugs:
        try:
            if process_slug(slug):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Corregits: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()
