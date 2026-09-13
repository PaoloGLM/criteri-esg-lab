"""
Pas 5 del flux: Gemini corregeix ortografia i estil (CA + ES).

Per cada .md a /data/informes/3-fets/:
1. Llegeix el Markdown (CA i ES)
2. Crida Gemini per corregir ortografia, gramatica, anglicismes
3. Guarda la versio corregida a /data/informes/4-revisats-ortografia/

Us:
    scripts/.venv/bin/python scripts/05-gemini-ortografia.py [slug]

Fallback: Si el model primari falla per quota (429), espera 60 segons i reintenta.
Si el model no existeix, prova amb el següent de la llista.
"""
import sys
import time
import os
import re
from pathlib import Path

sys.path.insert(0, "./scripts")
from gemini_free_client import call_gemini_free
from config import GEMINI_FREE_MODEL

FETS_DIR = Path("./data/informes/3-fets")
REVISATS_DIR = Path("./data/informes/4-revisats-ortografia")
REVISATS_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = """Ets un corrector ortografic i d'estil expert en catala i castellano.

Rebs un informe en format Markdown i l'has de RETORNAR CORREGIT -- no llistar les correccions.

CORREGEIX directament sobre el text:
1. **Errors ortografics** (majuscules, accents, dieresis, etc.)
2. **Errors gramaticals** (concordanca, temps verbals, etc.)
3. **Anglicismes innecessaris** -- substitueix per equivalents naturals (ex: "datapoints" -> "punts de dades", "value chain cap" -> "limit de la cadena de valor", "disclosure" -> "divulgacio", "reporting" -> "presentacio d'informes")
4. **Errors de traduccio** (compara les dues versions si pot inferir coherencia)
5. **Puntuacio** (comes, punts, comes entre clausules)

REGLA CRITICA:
- **NO modifiquis el contingut ni l'estructura**. Només corregeixes ortografia/estil.
- **Conserves el front-matter YAML intacte**.
- **NO tornis un JSON ni una llista de correccions**. Torna el Markdown sencer corregit.

La teva resposta ha de ser EXACTAMENT el Markdown corregit, començant pel `---` del front-matter. Sense comentaris, sense explicacions, sense "Aqui tens la versio corregida:"."""

GEMINI_MODELS = [
    GEMINI_FREE_MODEL,  # gemini-3-flash-preview (gratuït, REST directe)
]

def get_gemini_client_with_fallback():
    """Retorna el model Gemini free actiu (REST directe, no SDK)."""
    return None, GEMINI_FREE_MODEL

def call_gemini_with_fallback(system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 16000) -> str:
    """Crida Gemini per corregir ortografia.

    Per defecte usa el model gratuït (REST directe, espera 60s al 429/503).
    Si la variable d'entorn ORTOGRAFIA_MODEL=paid, usa gemini-3.6-flash (de
    pagament) per desbloquejar quan la quota free està exhaurida.
    """
    import os as _os
    if _os.environ.get("ORTOGRAFIA_MODEL", "free") == "paid":
        from gemini_paid_client import call_gemini_paid
        return call_gemini_paid(
            system_prompt, user_prompt,
            temperature=temperature, max_tokens=max_tokens,
        )
    return call_gemini_free(
        system_prompt, user_prompt,
        temperature=temperature, max_tokens=max_tokens,
    )


def correct_one(md_path: Path) -> bool:
    """Corregeix un fitxer Markdown amb detecció d'idioma i validació d'integritat."""
    output_path = REVISATS_DIR / md_path.name

    print(f"  -> Corregint {md_path.name}...")
    content = md_path.read_text(encoding="utf-8")

    # Detecció d'idioma REAL sobre el contingut (mai pel nom de fitxer:
    # el 13-set-2026 un .es.md mig en català va passar com a ES).
    # El detector de Gemini respon "CA" o "ES"; si no coincideix amb el
    # fitxer, avortem abans de corregir (cal regenerar, no corregir).
    detected = call_gemini_with_fallback(
        "Ets un detector d'idiomes. Respon NOMES amb dues lletres: CA si el text "
        "majoritari és català, ES si és castellà. Cap altra paraula.",
        content[:3000],
        temperature=0.0, max_tokens=2048,
    ).strip().upper()
    if detected not in ("CA", "ES"):
        m = re.search(r"\b(CA|ES)\b", detected)
        detected = m.group(1) if m else "?"
    expected = "es" if ".es." in md_path.name else "ca"
    if detected != expected.upper():
        print(f"  ✗ DETECTAT CANVI D'IDIOMA: el fitxer diu ser .{expected}.md però "
              f"conté text {detected}. NO es corregeix — cal regenerar-lo amb 04-glm-redacta.")
        return False

    lang = expected  # CA o ES confirmats sobre el contingut real

    user_prompt = f"""Corregeix aquest informe en {"castellà" if lang == "es" else "català"}.

=== INFORME ===
{content}
=== FI ===

Retorna el Markdown SENCER corregit, amb tots els blocs i taules (començant per ---). No resumisquis ni eliminis cap secció."""

    corrected = call_gemini_with_fallback(
        SYSTEM_PROMPT, user_prompt, temperature=0.2, max_tokens=16000
    )

    # Validació d'integritat: la sortida ha de tenir tots els blocs de l'entrada
    # i una mida coherent (>=85%). Si falla, NO sobrescrivim el que hi hagi.
    n_in = len(re.findall(r"^##\s+\w+\s+\d", content, re.MULTILINE))
    n_out = len(re.findall(r"^##\s+\w+\s+\d", corrected, re.MULTILINE))
    if n_out < n_in or len(corrected) < 0.85 * len(content):
        print(f"  ✗ SORTIDA INCOMPLETA: {n_out} blocs / {len(corrected)} chars "
              f"(esperat >= {n_in} blocs / >= {int(0.85*len(content))} chars). No es guarda.")
        return False

    # Netejar: si Gemini ha afegit text abans del ---
    if "---" in corrected:
        idx = corrected.index("---")
        if idx > 0:
            corrected = corrected[idx:]

    output_path.write_text(corrected, encoding="utf-8")
    print(f"  Guardat: {output_path.name} ({len(corrected)} chars)")
    return True


def process_slug(slug: str) -> bool:
    """Processa un slug (versions CA + ES)."""
    ca_path = FETS_DIR / f"{slug}.ca.md"
    es_path = FETS_DIR / f"{slug}.es.md"

    if not ca_path.exists() or not es_path.exists():
        print(f"  Error: Falten versions (CA o ES) per {slug}")
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
    print(f"Models: {GEMINI_MODELS[0]} (gratuït) — o gemini-3.6-flash si ORTOGRAFIA_MODEL=paid\n")
    print(f"Fets: {FETS_DIR}")
    print(f"Destinació: {REVISATS_DIR}\n")

    # Llistar slugs (treure .ca.md / .es.md)
    md_files = sorted(FETS_DIR.glob("*.md"))
    slugs = sorted({p.name.rsplit(".", 2)[0] for p in md_files})
    print(f"Informes redactats: {len(slugs)}\n")

    if target:
        slugs = [s for s in slugs if target.lower() in s.lower()]
        if not slugs:
            print(f"Error: No s'ha trobat cap informe que coincideixi amb '{target}'")
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
            print(f"  Error: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  Corregits: {ok}")
    print(f"  Fallats: {failed}")


if __name__ == "__main__":
    main()
