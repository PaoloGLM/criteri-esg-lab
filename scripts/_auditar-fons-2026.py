"""
_auditar-fons-2026.py - Auditoria Qwen 3.8 Flash v2: informes ESG REALS de 2026
que ens falten, detectats per connexio (series anuals + temes 2026) i verificats
per HTTP abans de proposar-los.

FASE 1 (Qwen, per lots dentitats): doble sonda per entitat -
  (a) series anuals que lentitat publica cada any i que encara no tenim;
  (b) informes 2026 no-periodics sobre temes ESG de 2026 que el model recordi.
Omissio prioritzada sobre invencio: no incloure res es CORRECTE i ESPERAT.
FASE 2 (determinista, sense LLM): verifica cada URL proposada amb requests;
  si la pagina es HTML, en extreu els enllacos PDF reals (ceguesa de nivell-2);
  baixa els candidats OK a pendents-revisio/. Cap fitxer entra a 0-originals/
  sense el GATE del Paolo.
"""
import json
import re
import sys
from pathlib import Path

import requests

sys.path.insert(0, str(Path(__file__).parent))
from config import get_openrouter_client

MODEL = "qwen/qwen3.8-flash"
ARXIU_SORTIDA = Path(__file__).parent / "state" / "audit-fonts-2026-qwen.json"
ARXIU_VERIFICAT = Path(__file__).parent / "state" / "audit-fonts-2026-verificat.json"
CUA_REVISIO = Path(__file__).parent.parent / "data" / "informes" / "pendents-revisio"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36"
}

ENTITATS = [
    ("ESMA", "Autoritat Europea de Valors i Mercats: informes de riscos i tendencies (TRV), sostenibilitat financera"),
    ("OECD", "OCDE: Economic Outlook ( nomes edicio Mon o Europa), Revision on Aligning Finance with Climate, estudis de goveranca i PISA"),
    ("EFRAG", "Grup Assessor Europeu dInformacio Financera: projectos ESRS, opinions, State of Play"),
    ("Comissio Europea (DG FISMA/GROW/ENV/CLIMA)", "Comunicacions i estudis preparatoris: taxonomia, Omnibus, CSRD, industria sostenible"),
    ("EEA", "Agencia Europea de Medi Ambient: GEO, avaluacions climatiques, qualitat de laire, economia circular, soroll"),
    ("BCE", "Banc Central Europeu: Financial Stability Review, climate stress tests, working papers, Bulletin"),
    ("ABE", "Autoritat Bancaria Europea: EU Risk Assessment, supervisory reports"),
    ("EIOPA", "Autoritat Europea dAssegurances i Pensions: Risk & Stress Test Report, pensions occupational"),
    ("ESRB", "Comite Europeu de Riesgo Sistemico: Annual Report, reports de risc climatic"),
    ("IPCC/GIEC", "Panell Intergovernamental sobre Canvi Climatic: informes davaluacio i especials"),
    ("IEA", "Agencia Internacional dEnergia: World Energy Outlook, Renewables, World Energy Investment, Energy and Gender, Net Zero Roadmap"),
    ("IRENA", "Agencia Internacional dEnergies Renovables: Renewable Capacity Statistics, World Energy Transitions Outlook"),
    ("Banc Mundial", "World Bank: Poverty and Shared Prosperity, Carbon Pricing, Global Financial Development, Business Ready"),
    ("FMI", "Fonds Monetari Internacional: World Economic Outlook, Fiscal Monitor, Global Financial Stability Report"),
    ("UNEP FI", "Alianca financera PNUMA: Financial System Sustainability Report, marcs net zero, work programme"),
    ("UN Global Compact", "Pacte Mundial ONU: informes i guies de sostenibilitat empresarial"),
    ("PNUMA/UNEP", "Programa Medi Ambient ONU: Emissions Gap Report, Global 500, Adaptation Gap"),
    ("OHCHR", "Alt Comissariat Drets Humans ONU: informes empreses i drets humans"),
    ("UNCTAD", "Conferencia Comercio i Desenvolupament ONU: World Investment Report, informes deute climatic"),
    ("FSB", "Consell destabilitat Financera: informes clima-financa, transicio, pressio deute"),
    ("TNFD", "Taskforce Nature-related Financial Disclosures: informes davanc, guies de beta natural"),
    ("GHG Protocol", "Estandard comptable GEH (WRI/WBCSD): novetats i revisions destandars"),
    ("SBTi", "Science Based Targets: Corporate Net Zero Standard revisions, trend reports, dades d'aven"),
    ("CDP", "Carbon Disclosure Project: Global Report, State of Sustainability Reports, informes sectorials"),
    ("WBCSD", "Consell Empresarial Mundial Desenvolupament Sostenible: visió, guies de transicio sectorials"),
    ("WMO/OMM", "Organitzacio Meteorologica Mundial: Statement on the Global Climate, Greenhouse Gas Bulletin"),
    ("Carbon Tracker", "Carbon Tracker: Regulating Unburnable Carbon i altres informes dactius varallts"),
    ("InfluenceMap", "InfluenceMap: Carbon Neutral Policy Report, Briefing sectorials (steel, oil&gas, auto)"),
    ("Oxfam", "Oxfam: informes de desigualtat global, clima i deute, Commitment Yearbook"),
    ("GRI", "Global Reporting Initiative: estandars, Global Sustainability Barometer"),
    ("IFRS/ISSB", "Fundacio IFRS: normes S1/S2, informes dimplementacio i avenc"),
    ("WEF", "Forum Economic Mundial: Global Risks Report, Future of Jobs, First Movers"),
    ("NewClimate Institute", "NewClimate: financa climatica, NDCs, transicio"),
    ("Bruegel", "Bruegel: notes de politica energetica i climatica europea"),
    ("Agora Energiewende", "Agora Energiewende: analisi mercats electric, instruments climatics"),
    ("Agora Verkehrswende", "Agora Verkehrswende: descarbonitzacio del transport"),
    ("Transport & Environment", "T&E: informes de transport net zero, aviacio, maritim, batteries"),
    ("Ellen MacArthur Foundation", "Ellen MacArthur: Circularity Gap, noves economies"),
    ("E3G", "E3G: geopolitica de la transicio, estrategies climatiques"),
    ("Wuppertal Institute", "Wuppertal: Global Solutions Report, recerca sostenibilitat"),
    ("Chatham House", "Chatham House: economia i societat, energia i clima"),
    ("WWF", "WWF: Living Planet Report"),
    ("Energy Institute", "Energy Institute: Statistical Review of World Energy"),
    ("World Benchmarking Alliance", "WBA: Accounting for People/Oceans/Food, system transformations"),
    ("Transparency International", "Transparency International: Corruption Perceptions Index, clima i anticorrupcio"),
    ("Business & Human Rights Resource Centre", "BHRRC: informes anuals drets humans i empreses"),
    ("PRI", "Principles for Responsible Investment: informes anuals, marcs ESG"),
    ("BCBS", "Basel Committee: revisions del marcs Basel,-risk management climatic"),
    ("IOSCO", "IOSCO: antifrustracio ESG, derivats climatics, reports"),
    ("BIS", "BIS: Annual Economic Report, papers de clima i financa"),
    ("WTO", "OMC: World Trade Report, subsidis i clima"),
    ("ILO/OIT", "Organitzacio Internacional de la Feina: World Employment and Social Outlook, just transition"),
    ("Eurostat", "Eurostat: SDGs report, comptes mediambientals, estadistiques verdes UE"),
    ("Banco de Espanya", "Banco de Espana: informe anual i articles destabilitat climatica"),
    ("CNMV", "CNMV: notes destabilitat, informes de sostenibilitat dels mercats"),
    ("CES Espana", "Consejo Economico y Social: informes dinformacio no financera"),
    ("INE Espanya", "INE espanyol: estadistiques mediambientals i socials oficials"),
    ("EcoVadis", "EcoVadis: methodology reports i insight"),
    ("Sustainalytics", "Sustainalytics (Morningstar): risk ratings, ESG controversies research"),
    ("KPMG", "KPMG recerca ESG: Global Trends, Trust in Sustainability"),
    ("Deloitte", "Deloitte: State of the Sustainability Report i recerca similar"),
    ("PwC", "PwC: Global Sustainability and Net Zero surveys"),
    ("EY", "EY: informes de sostenibilitat i atactivitat empresarial"),
    ("COTEC", "Fundacio COTEC: bioeconomia circular i clima"),
    ("CEOE", "CEOE: informes ESG de lempresa espanyola"),
    ("Cambres de Comercio", "Cambres de Comercio Espanya: estudis de sostenibilitat"),
    ("Fundacio Biodiversitat", "Fundacio Biodiversitat: informes de biodiversitat empresarial"),
    ("IDESCAT", "IDESCAT: indicadors de sostenibilitat de Catalunya"),
    ("Sindicatura de Comptes", "Sindicatura de Comptes Catalunya: informes de sostenibilitat del sector public"),
    ("Foment del Treball", "Foment: informes economics i ESG"),
    ("World Inequality Lab", "WIL: World Inequality Report i Climate Inequality Report"),
]


def preguntar_qwen(client, lot, tenim):
    prompt = (
        "Estas fent una auditoria de buits documental per a un mitja especialitzat en ESG a Catalunya/Europa.\n\n"
        "Aquests son els fitxers que JA tenim:\n"
        + "\n".join("- " + t for t in tenim)
        + "\n\n"
        "Per a CADA entitat del lot seguent fes una DOBLE SONDA:\n"
        "  (A) SERIES ANUALS: quines publicacions periodiques conegudes daquesta entitat sha publicat durant 2026 "
        "(gen-set 2026) i NO es a la meva llista? Ex: IEA publica World Energy Outlook cada octubre; WEF publica "
        "Global Risks cada gener.\n"
        "  (B) NO-PERIODICS: quins informes o estudis amb dades o analisi propia publicats el 2026 sobre temes ESG "
        "(clima, energia, biodiversitat, social, governanca, regulacio, finances sostenibles) recordes especificament "
        "daquesta entitat?\n\n"
        "REGLA DOR - PRIORITAT DOMISSIO SOBRE LA INVENCIO:\n"
        "  - Nomes incloeu el que recordis amb certesa (has vist el titol o el document). Es mil vegades preferible "
        "ometre que inventar. No incloure res per una entitat es CORRECTE i ESPERAT.\n"
        "  - Si no estas segur del titol exacte o de lany de publicacio, posa confidence menor o igual que 0.4 o "
        "omet-lo. Si lultima edicio coneguda daquesta serie era anterior a 2026 i no recordes edicio 2026, NO linventis.\n\n"
        "CRITERIS DEXCLUSIO (aftermes dels rebujos del meu propi repositori):\n"
        "  - EXCLOSES: noticies, notes de premsa, events, landing pages, butlletins autopromocionals, pagines dinscripcio.\n"
        "  - EXCLOSES: presentacions de consultories o material de marketing (llistes visuals de tendencies).\n"
        "  - EXCLOSES: resumens at a glance/in brief/explainer duna norma: nomes vale ledicio completa si existeix.\n"
        "  - EXCLOSES: edicions regionals (Llatinoamerica, Asia) quan existeix ledicio Mon o Europa: cobrim Mon/Europa/Espanya/Catalunya.\n"
        "  - EXCLOSES: declaracions de constituencies dels consells (Banc Mundial, FMI).\n"
        "  - EXCLOSES: documents merament tecnics o annexos reguladors sense narrativa analisi (tipus decisions tecniques ACER).\n"
        "  - INCLOSOS: informes analitics amb dades, plans estrategics dlorganismes influents, estudis amb metodologia documentada.\n\n"
        "FORMAT DE SORTIDA: array JSON valid, sense cap text fora del JSON. Cada objecte amb claus:\n"
        "  entitat, titol (textual exacte), data_publicacio (YYYY-MM), cobertura (Mon o Europa o Espanya o Catalunya o altra),\n"
        "  tipus_contingut (informe-analitic o pla-estrategic o dades o recerca), base (serie-anual o record-concret),\n"
        "  url_probable (URL directe del PDF o pagina oficial dlentitat; si no la recordes, el domini base),\n"
        "  confidence (0.0-1.0), motiu (una frase: per que ens serveix).\n\n"
        "ENTITATS DEL LOT:\n"
        + "\n".join("- " + nom + ": " + desc for nom, desc in lot)
    )
    r = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "Ets un analista de fonts documentals ESG amb rigor absolut: zero invencions, "
                                          "prioritzes ometre sobre arriscar. Respons nomes JSON valid."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.1,
        max_tokens=8000,
    )
    txt = r.choices[0].message.content or ""
    i, j = txt.find("["), txt.rfind("]")
    if i >= 0 and j > i:
        try:
            return json.loads(txt[i:j + 1])
        except Exception:
            pass
    out = []
    for p in re.findall(r"\{[^{}]*\}", txt):
        try:
            out.append(json.loads(p))
        except Exception:
            continue
    return out


def verificar(candit):
    """HTTP a la URL; si es HTML, extreu enllacos .pdf de la pagina (nivell-2)."""
    url = (candit.get("url_probable") or "").strip()
    if not url.startswith("http"):
        return {"ok": False, "motiu": "sense url"}
    res = {"ok": False, "url_final": url}
    try:
        r = requests.get(url, headers=HEADERS, timeout=25, stream=True, allow_redirects=True)
        res["status"] = r.status_code
        ctype = (r.headers.get("content-type") or "").lower()
        res["content_type"] = ctype.split(";")[0]
        if "pdf" in ctype:
            res["ok"] = True
            res["descarregable"] = r.url
        elif "html" in ctype:
            body = r.content[:2_000_000].decode("utf-8", errors="ignore")
            pat = "href=[\x22\x27]?([^\x22\x27<> ]+\.pdf)"
            pdfs = [m.group(1) for m in re.finditer(pat, body, re.I)]
            pdfs = [p if p.startswith("http") else requests.compat.urljoin(r.url, p) for p in pdfs]
            res["pdfs_pagina"] = list(dict.fromkeys(pdfs))[:6]
            res["descarregable"] = res["pdfs_pagina"][0] if res["pdfs_pagina"] else ""
        else:
            res["motiu"] = "tipus " + res["content_type"]
    except Exception as e:
        res["motiu"] = ("error " + str(e))[:80]
    return res


def baixar(candit, dest):
    url = candit.get("_verificacio", {}).get("descarregable") or ""
    if not url:
        return None
    try:
        with requests.get(url, headers=HEADERS, timeout=90, stream=True) as r:
            if r.status_code != 200:
                return None
            data = r.content
        if len(data) < 50000 or data[:4] != b"%PDF":
            return None
        dest.write_bytes(data)
        return len(data)
    except Exception:
        return None


def main():
    originals = Path(__file__).parent.parent / "data" / "informes" / "0-originals"
    tenim = sorted(p.name for p in originals.glob("*.pdf"))
    print("[info] tenim %d PDFs a 0-originals" % len(tenim))
    CUA_REVISIO.mkdir(parents=True, exist_ok=True)
    client = get_openrouter_client()

    tots = []
    BATCH = 16
    nlots = (len(ENTITATS) + BATCH - 1) // BATCH
    for k in range(0, len(ENTITATS), BATCH):
        lot = ENTITATS[k:k + BATCH]
        print("[Qwen] lot %d/%d: %s..." % (k // BATCH + 1, nlots, ", ".join(n for n, _ in lot)[:80]))
        try:
            res = preguntar_qwen(client, lot, tenim)
            print("    -> %d candidats" % len(res))
            tots.extend(res)
        except Exception as e:
            print("    ERROR %s" % e)

    vistos = set()
    dedup = []
    for c in tots:
        t = re.sub(r"\W+", "", str(c.get("titol", "")).lower())[:70]
        if not t or t in vistos:
            continue
        vistos.add(t)
        dedup.append(c)
    print("[info] %d candidats -> %d unics" % (len(tots), len(dedup)))
    ARXIU_SORTIDA.write_text(json.dumps(dedup, ensure_ascii=False, indent=1), encoding="utf-8")

    verificats = []
    for c in dedup:
        if float(c.get("confidence") or 0) < 0.4:
            continue
        v = verificar(c)
        c["_verificacio"] = v
        if v.get("ok"):
            est = "OK-PDF"
        elif v.get("pdfs_pagina"):
            est = "HTML+PDF"
        else:
            est = "NO"
        print("  [%s] %s :: %s" % (est, c.get("entitat", "?"), str(c.get("titol", "?"))[:80]))
        verificats.append(c)

    ARXIU_VERIFICAT.write_text(json.dumps(verificats, ensure_ascii=False, indent=1), encoding="utf-8")

    baixats = 0
    for c in verificats:
        v = c.get("_verificacio", {})
        if not (v.get("ok") or v.get("pdfs_pagina")):
            continue
        base = (str(c.get("titol", "informe")) + "-" + str(c.get("entitat", ""))).lower()
        slug = re.sub(r"[^a-z0-9]+", "-", base)[:60].strip("-")
        dest = CUA_REVISIO / ("cua_" + slug + ".pdf")
        if dest.exists():
            continue
        mida = baixar(c, dest)
        if mida:
            baixats += 1
            print("  [baixat] %s (%d KB)" % (dest.name, mida // 1024))
    print("")
    print("[fi] %d candidats unics | %d verificats | %d baixats a %s" % (len(dedup), len(verificats), baixats, CUA_REVISIO))
    print("JSON: %s, %s" % (ARXIU_SORTIDA.name, ARXIU_VERIFICAT.name))


if __name__ == "__main__":
    main()
