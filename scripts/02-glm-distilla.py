"""
Pas 2 del flux: GLM 5.3 Flash destil·la.

Per cada PDF a /data/informes/0-originals/:
1. Llegeix el PDF localment
2. Extreu el text amb pdfplumber
3. Crida GLM 5.3 Flash Free (OpenRouter)
4. Guarda el ReportBlock JSON a /data/informes/1-distilats/

Ús:
    scripts/.venv/bin/python scripts/02-glm-distilla.py [slug_o_filename]

Si no es passa argument, processa tots els PDFs pendents.
"""
import sys
import os
import json
import time
from pathlib import Path

sys.path.insert(0, "./scripts")
from nemotron_client import call_nemotron
import pdfplumber

DATA_DIR = Path("./data/informes")
ORIGINALS_DIR = DATA_DIR / "0-originals"
DISTILATS_DIR = DATA_DIR / "1-distilats"
DISTILATS_DIR.mkdir(parents=True, exist_ok=True)

CATALEG_PATH = Path(__file__).resolve().parent / "cataleg-estandards.json"


def load_cataleg() -> list:
    """Carrega el catàleg oficial dels 16 estàndards ESG (font única de veritat)."""
    return json.loads(CATALEG_PATH.read_text(encoding="utf-8"))


def cataleg_as_prompt() -> str:
    """Retorna el catàleg formatat per al prompt (slug + nom)."""
    lines = []
    for e in load_cataleg():
        lines.append(f"- {e['slug']} ({e['name']})")
    return "\n".join(lines)


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extreu TOT el text d'un PDF amb pdfplumber (sense truncar).

    Abans limitava a 30.000 caràcters (límit històric dels models de context
    curt). Els models actuals (GLM 5.3 Flash, Nemotron) tenen 1M de
    tokens de context, així que un PDF de 100 pàgines hi cap sencer.
    """
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text += page_text + "\n\n"
    return text


def slugify(filename: str) -> str:
    """Converteix '2026-04-22_europe-sustainable-development-report-2026.pdf' -> 'europe-sustainable-development-report-2026'."""
    base = filename.rsplit(".", 1)[0]
    if len(base) > 11 and base[:11].endswith("_") and base[:4].isdigit():
        base = base[11:]
    return base


def get_metadata_from_filename(filename: str) -> dict:
    """Extreu títol i institució del nom del fitxer."""
    slug = slugify(filename)
    parts = slug.split("-", 1)
    if len(parts) > 1:
        institution_raw = parts[0]
        title_raw = parts[1].replace("-", " ").capitalize()
    else:
        institution_raw = slug
        title_raw = slug.replace("-", " ").capitalize()

    institutions = {
        "cnmv": "CNMV (Comisión Nacional del Mercado de Valores)",
        "unepfi": "UNEP FI (UN Environment Programme Finance Initiative)",
        "wef": "World Economic Forum",
        "ecb": "European Central Bank",
        "ecovadis": "EcoVadis",
        "efrag": "EFRAG",
        "esma": "ESMA (European Securities and Markets Authority)",
        "eba": "European Banking Authority",
        "eiopa": "EIOPA",
        "eca": "European Court of Auditors",
        "eea": "European Environment Agency",
        "entsoe": "ENTSO-E",
        "oecd": "OECD",
        "oxfam": "Oxfam",
        "sbti": "Science Based Targets initiative (SBTi)",
        "un": "United Nations",
        "unep": "UNEP",
        "wri": "World Resources Institute",
        "foretica": "Forética",
        "cdp": "CDP",
        "csddd": "Comissió Europea (CSDDD)",
        "eu": "Comissió Europea",
        "agora": "Agora Energiewende",
        "carbon": "Carbon Tracker",
        "cop30": "COP30",
        "influencemap": "InfluenceMap",
        "worldbank": "World Bank",
        "2026": "United Nations",  # per "2026-04-22_europe-..." prefix
    }
    institution = institutions.get(institution_raw.lower(), institution_raw.upper())

    return {"slug": slug, "title": title_raw, "institution": institution}


def process_one_pdf(pdf_path: Path) -> bool:
    """Processa un PDF. Retorna True si tot ha anat bé."""
    name = pdf_path.name
    slug = slugify(name)
    output_filename = f"{slug}.json"
    output_path = DISTILATS_DIR / output_filename

    # Comprovar si ja està destil·lat
    if output_path.exists():
        print(f"  ✓ Ja destil·lat: {output_filename}")
        return True

    meta = get_metadata_from_filename(name)
    print(f"\n=== Processant: {name} ({pdf_path.stat().st_size/1024/1024:.1f} MB) ===")
    print(f"  Slug: {meta['slug']}")
    print(f"  Títol: {meta['title']}")
    print(f"  Institució: {meta['institution']}")

    # 1. Extreure text
    print(f"  → Extraient text...")
    text = extract_text_from_pdf(pdf_path)
    if len(text) < 500:
        print(f"  ✗ Text massa curt ({len(text)} chars). Probablement és un PDF escanejat. Saltant.")
        return False
    print(f"  ✓ Text extret ({len(text)} chars)")

    # 2. Cridar GLM 5.3 Flash (català i castellà)
    print(f"  → Generant versió catalana amb GLM 5.3 Flash...")
    report_ca = call_glm_flash_json(
        system_prompt=(
            "Ets un analista ESG expert de Criteri ESG. Sintetitza informes institucionals ESG en 8 blocs accionables.\n\n"
            "Genera EXCLUSIVAMENT un objecte JSON vàlid amb aquesta estructura (sense markdown, sense text fora del JSON):\n"
            '{"semafor":{"grade":"A"|"B"|"C"|"D","gradeLabel":"...","indicators":[{"name":"Cobertura Scope 3","status":"verd"|"groc"|"vermell","label":"...","note":"..."},...]},'
            '"dadesClau":[{"value":"...","label":"...","page":"..."}],'
            '"resumExecutiu":"...","implicacions":{"empreses":"...","reguladors":"...","ciutadans":"..."},'
            '"mesEnllaCheckbox":{"criteri":"...","body":"..."},'
            '"connexions":[{"type":"Evolució"|"Complement"|"Contradicció","target":"...","desc":"..."}],'
            '"accions":[{"num":"01","title":"...","desc":"...","effort":"Baix"|"Mitjà"|"Alt","impact":"Baix"|"Mitjà"|"Alt"}],'
            '"crossRefs":[{"framework":"...","criterion":"...","coverage":"compleix"|"parcial"|"no-cobert",'
            '"evidence":{"page":42,"section":"3.2","table":"T-3"},"nature":"quantitatiu"|"qualitatiu"|"compromis",'
            '"impact":"alt"|"mitja"|"baixa","action":"..."}]}'
            "\n\nCriteris semàfor: verd=Quantificat, groc=Esmentat, vermell=Ignorat. "
            "grade: A=5v, B=4v+1g, C≤1r, D=2+r.\n"
            "Llargàries: resumExecutiu ~300p, implicacions ~150p cadascun, mesEnllaCheckbox ~150p, "
            "dadesClau 5, accions 4-5, connexions 2-3, crossRefs 2-3.\n"
            'Veu editorial mediterrània. "Més enllà del Checkbox": actua com a analista d\'ètica. Analitza l\'informe seguint aquestes passes:\n\n'
            "1. FETS: resumeix les decisions, accions i dades principals (sense valorar).\n"
            "2. PARTS INTERESSADES: qui actua, qui és afectat, qui té responsabilitat.\n"
            "3. ANÀLISI KANTIANA: per cada acció clau, la màxima és universalitzable? Es tracten les persones com a fi i no només com a mitjà? Hi ha conflicte entre deure i interès?\n"
            "4. ANÀLISI DEL BÉ COMÚ: avalua segons dignitat, solidaritat, sostenibilitat, justícia social, democràcia i transparència.\n"
            "5. IMPACTES MAJORITARIS: quins efectes distributius, ecològics i institucionals dominen? Qui guanya i qui perd?\n"
            "6. TENSIONS: mesura els impactes de l\'informe amb d\'altres citats en el text o d\'altres dels últims 3 mesos publicats a Criteri ESG\n\n"
            "Amb tot això, elabora una conclusió ètica que tingui en compte un o dos punts de l\'economia del bé comú de màxim 120 caràcters. "
            "MAI esmentar Economia del Bé Comú ni Economia Ciutadana públicament.\n\n"
            "ENTORN TANCAT (regles de verificació de fonts):\n"
            "1. Totes les dades, xifres i afirmacions han de provenir EXCLUSIVAMENT del text "
            "entre === TEXT === i === FI ===.\n"
            "2. Cada dada del bloc dadesClau ha d'incloure el camp 'page' amb el número de pàgina "
            "on apareix al document original (o 'p. X' si no hi ha paginació clara).\n"
            "3. MAI utilitzis coneixement extern per omplir buits. MAI especulis ni dedueixis "
            "dades que no apareguin al text.\n"
            "4. Si una dada del document és ambigua, reflecteix-la com a tal; no la resolguis "
            "amb suposicions.\n"
            "5. Si el document no conté informació per a un bloc, deixa'l amb contingut mínim "
            "honest en lloc d'inventar-lo.\n\n"
            "CROSS-REFERENCES (Bloc crossRefs): tria NOMÉS d'aquest catàleg oficial, "
            "posant el nom exacte a 'framework'. No inventis frameworks fora d'aquesta llista.\n"
            "Regles dels camps crossRefs:\n"
            "- criterion: requisit CONCRET de l'estàndard (ex. 'GRI 305-1 Direct GHG emissions'), NO el tema genèric.\n"
            "- coverage: fins a quin punt L'INFORME cobreix el requisit — 'compleix' (el tracta amb dades/contingut), "
            "'parcial' (el menciona sense profunditat), 'no-cobert' (no el tracta).\n"
            "- evidence: pàgina i secció de l'informe original on apareix. Si el requisit es tracta, page és OBLIGATÒRIA "
            "i ha de ser real (número de pàgina del document); si no es pot localitzar, posa page null — MAI inventar.\n"
            "- nature: 'quantitatiu' (dada numèrica), 'qualitatiu' (narrativa/política), 'compromis' (objectiu declarat).\n"
            "- impact: rellevància per a la UI (alt|mitja|baixa); en cas de dubte, tria la més baixa.\n"
            "- action: acció concreta per a l'empresa que llegeix (ex. 'Auditar les emissions directes abans del Q4').\n"
            f"{cataleg_as_prompt()}\n"),
        user_prompt=f"Analitza el següent informe i genera el ReportBlock JSON.\n\n"
            f"TÍTOL: {meta['title']}\nINSTITUCIÓ: {meta['institution']}\nEscriu tot el contingut en català.\n\n"
            f"=== TEXT ===\n{text}\n=== FI ===\n\nGenera el JSON ara.",
        temperature=0.2, max_tokens=16000
    )

    # Castellà
    print(f"  → Generant versió castellana amb GLM 5.3 Flash...")
    report_es = call_glm_flash_json(
        system_prompt=(
            "Ets un analista ESG expert de Criteri ESG. Sintetitza informes institucionals ESG en 8 blocs accionables.\n\n"
            "Genera EXCLUSIVAMENT un objecte JSON vàlid amb aquesta estructura (sense markdown, sense text fora del JSON):\n"
            '{"semafor":{"grade":"A"|"B"|"C"|"D","gradeLabel":"...","indicators":[{"name":"Cobertura Scope 3","status":"verd"|"groc"|"rojo","label":"...","note":"..."},...]},'
            '"dadesClau":[{"value":"...","label":"...","page":"..."}],'
            '"resumExecutiu":"...","implicaciones":{"empresas":"...","reguladores":"...","ciudadanos":"..."},'
            '"masAllaCheckbox":{"criterio":"...","body":"..."},'
            '"conexiones":[{"type":"Evolución"|"Complemento"|"Contradicción","target":"...","desc":"..."}],'
            '"acciones":[{"num":"01","title":"...","desc":"...","esfuerzo":"Bajo"|"Medio"|"Alto","impacto":"Bajo"|"Medio"|"Alto"}],'
            '"crossRefs":[{"framework":"...","criterio":"...","coverage":"cumple"|"parcial"|"no-cubierto",'
            '"evidence":{"page":42,"section":"3.2","table":"T-3"},"nature":"cuantitativo"|"cualitativo"|"compromiso",'
            '"impact":"alto"|"medio"|"bajo","action":"..."}]}'
            "\n\nCriterios semáforo: verde=Cuantificado, amarillo=Mencionado, rojo=Ignorado. "
            "grade: A=5v, B=4v+1a, C≤1r, D=2+r.\n"
            "Extensiones: resumenEjecutivo ~300p, implicaciones ~150p cada, masAllaCheckbox ~150p, "
            "datosClave 5, acciones 4-5, conexiones 2-3, crossRefs 2-3.\n"
            'Voz editorial mediterránea. "Más allá del Checkbox" usa 1-2 criterios éticos '
            '(dignidad, justicia, sostenibilidad, co-decisión, arraigo). '
            "NUNCA mencionar Economía del Bien Común ni Economía Ciudadana públicamente.\n\n"
            "ENTORNO CERRADO (reglas de verificación de fuentes):\n"
            "1. Todos los datos, cifras y afirmaciones deben provenir EXCLUSIVAMENTE del texto "
            "entre === TEXT === y === FIN ===.\n"
            "2. Cada dato del bloque datosClave debe incluir el campo 'page' con el número de página "
            "donde aparece en el documento original (o 'p. X' si no hay paginación clara).\n"
            "3. NUNCA uses conocimiento externo para rellenar huecos. NUNCA especules ni deduzcas "
            "datos que no aparezcan en el texto.\n"
            "4. Si un dato del documento es ambiguo, refléjalo como tal; no lo resuelvas "
            "con suposiciones.\n"
            "5. Si el documento NO contiene información para un bloque, déjalo con contenido mínimo "
            "honesto en lugar de inventarlo.\n\n"
            "CROSS-REFERENCES (Bloque crossRefs): elige SOLO de este catálogo oficial, "
            "poniendo el nombre exacto en 'framework'. No inventes frameworks fuera de esta lista.\n"
            "Reglas de los campos crossRefs:\n"
            "- criterio: requisito CONCRETO del estándar (ej. 'GRI 305-1 Direct GHG emissions'), NO el tema genérico.\n"
            "- coverage: hasta qué punto EL INFORME cubre el requisito — 'cumple' (lo trata con datos/contenido), "
            "'parcial' (lo menciona sin profundidad), 'no-cubierto' (no lo trata).\n"
            "- evidence: página y sección del informe original donde aparece. Si el requisito se trata, page es OBLIGATORIA "
            "y debe ser real (número de página del documento); si no se puede localizar, pon page null — NUNCA inventes.\n"
            "- nature: 'cuantitativo' (dato numérico), 'cualitativo' (narrativa/política), 'compromiso' (objetivo declarado).\n"
            "- impact: relevancia para la UI (alto|medio|bajo); en caso de duda, elige la más baja.\n"
            "- action: acción concreta para la empresa que lee (ej. 'Auditar las emisiones directas antes del Q4').\n"
            f"{cataleg_as_prompt()}\n"),
        user_prompt=f"Analiza el siguiente informe y genera el ReportBlock JSON.\n\n"
            f"TÍTULO: {meta['title']}\nINSTITUCIÓN: {meta['institution']}\nEscribe todo el contenido en castellano.\n\n"
            f"=== TEXT ===\n{text}\n=== FIN ===\n\nGenera el JSON ahora.",
        temperature=0.2, max_tokens=16000
    )

    # 3. Guardar JSON combinat
    output = {
        "slug": meta["slug"],
        "title": meta["title"],
        "institution": meta["institution"],
        "filename_original": name,
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "content_ca": report_ca,
        "content_es": report_es,
    }
    output_path.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"  ✓ Guardat a {output_path}")
    return True


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else None

    print("=== Pas 2: GLM 5.3 Flash destil·la (LOCAL) ===\n")
    print(f"PDFs originals: {ORIGINALS_DIR}")
    print(f"Destinació: {DISTILATS_DIR}\n")

    pdfs = sorted(ORIGINALS_DIR.glob("*.pdf"))
    print(f"PDFs trobats: {len(pdfs)}\n")

    if target:
        pdfs = [p for p in pdfs if target.lower() in p.name.lower()]
        if not pdfs:
            print(f"✗ No s'ha trobat cap PDF que coincideixi amb '{target}'")
            return
        print(f"Filtrat per '{target}': {len(pdfs)} PDF(s)")

    ok = 0
    failed = 0
    for pdf in pdfs:
        try:
            if process_one_pdf(pdf):
                ok += 1
            else:
                failed += 1
        except Exception as e:
            print(f"  ✗ Error processant {pdf.name}: {e}")
            failed += 1

    print(f"\n=== Resum ===")
    print(f"  ✓ Processats: {ok}")
    print(f"  ✗ Fallats: {failed}")


if __name__ == "__main__":
    main()