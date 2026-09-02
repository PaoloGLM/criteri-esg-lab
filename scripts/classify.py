"""
classify.py — Classificador d'informes reals vs documents de menor valor.

3 capes:
- Capa 1 (a scrape.py): filtres tècnics URL/format/any — ja implementada
- Capa 2 (aquest fitxer): validació de PDF descarregat:
    * pàgines >= 8 (requisit de Paolo)
    * classificació Nemotron: INFORME vs NOTICIA/RESUM_EVENT/LLISTAT/...
    * extracció de metadades: títol, autors (individuals o institució), data
- Veredicte: APROVAT | REBUTJAT | DUBTE (dubte -> cua pendents-revisio/)

Ús:
    from classify import classify_pdf
    result = classify_pdf(Path("informe.pdf"), url="https://...")
"""
import json
import re
import sys
from pathlib import Path

MIN_PAGINES = 8  # requisit Paolo: informes a partir de 8 pàgines


def extract_pdf_info(pdf_path: Path) -> dict:
    """Extreu núm. pàgines, text de les primeres pàgines i metadades."""
    info = {"pages": 0, "first_pages_text": "", "meta_title": "", "meta_author": ""}
    try:
        import pdfplumber
        with pdfplumber.open(str(pdf_path)) as pdf:
            info["pages"] = len(pdf.pages)
            # Text de les 3 primeres pàgines (suficient per classificar)
            texts = []
            for page in pdf.pages[:3]:
                t = page.extract_text() or ""
                texts.append(t)
            info["first_pages_text"] = "\n".join(texts)[:4000]
            # Metadades del PDF
            meta = pdf.metadata or {}
            info["meta_title"] = (meta.get("Title") or "").strip()
            info["meta_author"] = (meta.get("Author") or "").strip()
    except Exception as e:
        info["error"] = str(e)
    return info


def _call_nemotron(system: str, user: str) -> str:
    """Crida Nemotron amb 3 reintents (free tier de OpenRouter deixa anar errors transitoris)."""
    import time
    sys.path.insert(0, str(Path(__file__).parent))
    from nemotron_client import call_nemotron

    last_err = None
    for attempt in range(3):
        try:
            return call_nemotron(system, user, temperature=0.1, max_tokens=1500)
        except Exception as e:
            last_err = e
            time.sleep(3 * (attempt + 1))
    return f"__ERROR__{last_err}"


def classify_with_llm(pdf_info: dict, url: str, source_name: str) -> dict:
    """Capa 2: Nemotron classifica el document i extreu metadades."""
    text = pdf_info.get("first_pages_text", "")
    if len(text.strip()) < 200:
        return {
            "tipus": "ALTRES",
            "confianca": 0.5,
            "veredicte": "DUBTE",
            "rao": "Text extret insuficient (possible PDF escanejat sense OCR)",
            "titol": pdf_info.get("meta_title", ""),
            "autors": [pdf_info.get("meta_author")] if pdf_info.get("meta_author") else [],
            "data_publicacio": "",
        }

    system = (
        "Ets un classificador expert de documents ESG per a Criteri ESG. "
        "Respon NOMÉS amb un JSON vàlid, sense text addicional."
    )
    user = f"""Analitza aquest document (primeres pàgines) i classifica'l.

FONT: {source_name}
URL: {url}

CRITERIS PER SER "INFORME":
- Metodologia pròpia (explica COM s'ha fet l'anàlisi)
- Dades originals (no només recull de notícies d'altres)
- Autoria identificable (persones O institució)
- No és material comercial promocional

TIPUS POSSIBLES:
- INFORME: estudi complet amb metodologia i dades
- NOTICIA: comunicat de premsa, notícia breu
- RESUM_EVENT: resum de conferència, webinar, keynote
- CANVI_NORMATIU_BREU: avis de canvi regulatori sense desenvolupament
- LLISTAT: llista de recursos, enllaços, dates
- MATERIAL_COMERCIAL: brochure, whitepaper comercial de consultoria
- ALTRES

TEXT DEL DOCUMENT (primeres pàgines):
---
{text[:3500]}
---

Respon EXACTAMENT aquest JSON (sense markdown, sense explicacions):
{{
  "tipus": "INFORME|NOTICIA|RESUM_EVENT|CANVI_NORMATIU_BREU|LLISTAT|MATERIAL_COMERCIAL|ALTRES",
  "confianca": 0.0-1.0,
  "titol": "títol complet del document (el del document, no l'URL)",
  "autors": ["autor individual 1", "autor 2"] o ["nom de la institució"] si no hi ha individus,
  "data_publicacio": "AAAA-MM-DD o cadena buida si no es troba",
  "metodologia_propia": true/false,
  "dades_originals": true/false,
  "rao": "explicació breu de la decisió (1 frase)"
}}"""
    raw = _call_nemotron(system, user)
    if raw.startswith("__ERROR__"):
        return {
            "tipus": "ALTRES", "confianca": 0.5, "veredicte": "DUBTE",
            "rao": f"Error LLM: {raw[:100]}", "titol": "", "autors": [], "data_publicacio": "",
        }

    # Parseig tolerant (el client nemotron ja neteja markdown/frontmatter)
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from nemotron_client import call_nemotron_json
        # call_nemotron_json fa tot el cicle; però ja tenim raw — parsejar directament
        import json as _json
        # intent 1: directe
        try:
            data = _json.loads(raw)
        except Exception:
            # intent 2: primer bloc {...}
            m = re.search(r"\{.*\}", raw, re.DOTALL)
            data = _json.loads(m.group(0)) if m else None
        if not data or not isinstance(data, dict):
            raise ValueError("JSON no dict")
    except Exception as e:
        return {
            "tipus": "ALTRES", "confianca": 0.5, "veredicte": "DUBTE",
            "rao": f"JSON invàlid del LLM: {e}", "titol": "", "autors": [], "data_publicacio": "",
        }

    tipus = str(data.get("tipus", "ALTRES")).upper().strip()
    conf = float(data.get("confianca", 0.5))

    if tipus == "INFORME" and conf >= 0.7:
        veredicte = "APROVAT"
    elif tipus in ("NOTICIA", "RESUM_EVENT", "LLISTAT", "CANVI_NORMATIU_BREU"):
        veredicte = "REBUTJAT"
    else:
        veredicte = "DUBTE"

    return {
        "tipus": tipus,
        "confianca": conf,
        "veredicte": veredicte,
        "titol": str(data.get("titol", "")).strip(),
        "autors": data.get("autors") if isinstance(data.get("autors"), list) else [],
        "data_publicacio": str(data.get("data_publicacio", "")).strip(),
        "metodologia_propia": bool(data.get("metodologia_propia", False)),
        "dades_originals": bool(data.get("dades_originals", False)),
        "rao": str(data.get("rao", "")).strip(),
    }


def classify_pdf(pdf_path: Path, url: str = "", source_name: str = "") -> dict:
    """
    Classificació completa d'un PDF descarregat.
    Retorna dict amb veredicte, metadades i estadístiques.
    """
    result = {
        "url": url,
        "source": source_name,
        "pdf_path": str(pdf_path),
        "pages": 0,
        "passes_pagines": False,
        "llm": None,
        "veredicte": "REBUTJAT",
        "titol": "",
        "autors": [],
        "data_publicacio": "",
    }

    pdf_info = extract_pdf_info(pdf_path)
    result["pages"] = pdf_info.get("pages", 0)

    # FILTRE DUR: mínim 8 pàgines (requisit Paolo)
    if result["pages"] < MIN_PAGINES:
        result["veredicte"] = "REBUTJAT"
        result["rao"] = f"Només {result['pages']} pàgines (mínim {MIN_PAGINES})"
        return result
    result["passes_pagines"] = True

    # Capa 2: classificació LLM
    llm = classify_with_llm(pdf_info, url, source_name)
    result["llm"] = llm
    result["veredicte"] = llm.get("veredicte", "DUBTE")
    result["rao"] = llm.get("rao", "")

    # Metadades: preferim LLM; fallback a meta del PDF
    result["titol"] = llm.get("titol") or pdf_info.get("meta_title", "")
    autors = llm.get("autors") or []
    if not autors and pdf_info.get("meta_author"):
        autors = [pdf_info["meta_author"]]
    result["autors"] = autors
    result["data_publicacio"] = llm.get("data_publicacio", "")

    return result


if __name__ == "__main__":
    # Test ràpid amb un PDF passat per argument
    if len(sys.argv) < 2:
        print("Ús: python classify.py <pdf_path> [url] [source_name]")
        sys.exit(1)
    p = Path(sys.argv[1])
    if not p.exists():
        print(f"Fitxer no trobat: {p}")
        sys.exit(1)
    r = classify_pdf(p, url=sys.argv[2] if len(sys.argv) > 2 else "", source_name=sys.argv[3] if len(sys.argv) > 3 else "test")
    print(json.dumps(r, ensure_ascii=False, indent=2))