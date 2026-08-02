"""
Pas 5 del flux: Gemini corregeix ortografia i estil (CA + ES).

Per cada .md a /data/informes/3-fets/:
1. Llegeix el Markdown (CA i ES)
2. Crida Gemini per corregir ortografia, gramatica, anglicismes
3. Guarda la versio corregida a /data/informes/4-revisats-ortografia/

Us:
    scripts/.venv/bin/python scripts/05-gemini-ortografia.py [slug]

Fallback: Si Gemini 3.6 flash arriba al seu limit, passa a Gemini 3.5 Flash.
"""
import sys
import time
import os
from pathlib import Path

sys.path.insert(0, "./scripts")
from gemini_client import call_gemini

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
    "gemini-3.6-flash",
    "gemini-3.5-flash",
]

def get_gemini_client_with_fallback():
    """Retorna client Gemini intentant models en ordre de preferencia."""
    from gemini_client import get_gemini_client as get_client_base
    from google import genai
    
    for model in GEMINI_MODELS:
        try:
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            # Test rapid
            _ = client.models.generate_content(model=model, contents="Test")
            print(f"  -> Model Gemini actiu: {model}")
            return genai.Client(api_key=os.environ.get("GEMINI_API_KEY")), model
        except Exception as e:
            print(f"  -> Model {model} no disponible: {e}")
            continue
    
    raise Exception("Cap model Gemini disponible")

def call_gemini_with_fallback(system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 16000) -> str:
    """Crida Gemini amb fallback automatic entre models."""
    from google import genai
    
    for model in GEMINI_MODELS:
        try:
            client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
            response = client.models.generate_content(
                model=model,
                contents=[
                    {"role": "user", "parts": [{"text": system_prompt}]},
                    {"role": "user", "parts": [{"text": user_prompt}]}
                ],
                config={
                    "temperature": temperature,
                    "maxOutputTokens": max_tokens,
                }
            )
            return response.text
        except Exception as e:
            error_str = str(e)
            if "quota" in error_str.lower() or "limit" in error_str.lower() or "429" in error_str:
                print(f"  -> Model {model} al limit, provant següent...")
                continue
            raise
    
    raise Exception("Tots els models Gemini han fallat")


def correct_one(md_path: Path) -> bool:
    """Corregeix un fitxer Markdown."""
    slug_with_lang = md_path.stem  # ex: eu-taxonomy-delegated-act.ca
    output_path = REVISATS_DIR / md_path.name

    if output_path.exists():
        # Refem sempre (idempotent per al test, pero no es salta)
        pass

    print(f"  -> Corregint {md_path.name}...")
    content = md_path.read_text(encoding="utf-8")

    # Determinar idioma pel sufix o pel front-matter
    lang = "es" if ".es." in md_path.name else "ca"

    user_prompt = f"""Corregeix aquest informe en {"castella" if lang == "es" else "catala"}.

=== INFORME ===
{content}
=== FI ===

Torna el Markdown corregit (començant per ---)."""

    corrected = call_gemini_with_fallback(
        SYSTEM_PROMPT, user_prompt, temperature=0.2, max_tokens=16000
    )

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
    print(f"Models: gemini-3.6-flash (primari) -> gemini-3.5-flash (fallback)\n")
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
