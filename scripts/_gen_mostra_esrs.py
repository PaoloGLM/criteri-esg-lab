# -*- coding: utf-8 -*-
"""Genera el PDF mostra de l'informe ESRS amb la plantilla web v7 replicada."""
import sys, subprocess, tempfile, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
import importlib.util
_spec = importlib.util.spec_from_file_location("genera_pdf_informe", Path(__file__).parent / "genera-pdf-informe.py")
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
generate_html = _mod.generate_html

# ReportBlock literal de assets/web/src/lib/reports-content.ts (revisioEsrs_ca)
report = {
    "title": "Revisió dels ESRS: simplificació del CSRD",
    "institution": "Comissió Europea (DG FISMA)",
    "date": "6 de maig 2026",
    "pages": 47,
    "type": "regulatory",
    "url": "https://finance.ec.europa.eu/news/commission-seeks-feedback-revised-sustainability-reporting-2026-05-06_en",
    "lang": "ca",
    "fitxa": "",
    "semafor": {
        "grade": "C",
        "gradeLabel": "Feble metodològicament",
        "indicators": [
            {"name": "Materialitat de l'impacte principal", "status": "groc", "label": "Esmentat",
             "note": "Es manté l'obligació de reporting sobre impactes materials (doble materialitat), però es simplifica la granularitat de categories upstream i downstream."},
            {"name": "Termes temporals", "status": "groc", "label": "Esmentat",
             "note": "Aplicació per fases, però sense comparabilitat retroactiva garantida amb exercicis anteriors."},
            {"name": "Fonts independents", "status": "verd", "label": "Quantificat",
             "note": "Comissió Europea amb auditories d'impacte, consultes públiques i avaluació del Better Regulation Toolbox."},
            {"name": "Granularitat", "status": "vermell", "label": "Ignorat",
             "note": "La reducció del 61% de datapoints elimina granularitat sectorial i comparabilitat entre parells."},
            {"name": "Verificació externa", "status": "groc", "label": "Esmentat",
             "note": "Es manté l'assurance limitat; no es passa a assurance raonable com demanaven els inversors."},
        ],
    },
    "dadesClau": [
        {"value": "61%", "label": "reducció de datapoints obligatoris", "page": "p. 12"},
        {"value": "3.700M€", "label": "estalvi estimat en 5 anys per a les empreses", "page": "p. 8"},
        {"value": "1.144", "label": "datapoints eliminats del total original", "page": "p. 14"},
        {"value": "2027", "label": "any d'aplicació per a les primeres empreses afectades", "page": "p. 21"},
        {"value": "5 anys", "label": "període de transició addicional per a pimes", "page": "p. 27"},
    ],
    "resumExecutiu": "La Comissió Europea publica la revisió dels European Sustainability Reporting Standards (ESRS) com a peça central de l'Omnibus I de simplificació. La proposta redueix un 61% els datapoints obligatoris —prop de 1.144 sobre el total— i modular la doble materialitat per fer-la més operativa per a les empreses de mida mitjana. L'executiu comunitari estima un estalvi acumulat de 3.700 milions d'euros en cinc anys, principalment en costos de recollida de dades, assurance extern i sistemes de reporting. La revisió manté l'arquitectura de dotze estàndards (dos transversals i deu temàtics) però elimina exigències considerades redundants amb altres marcs europeus (Taxonomia UE, SFDR) i amb GRI. S'introdueix un sistema de 'datapoints voluntaris' per a aquells que vulguin mantenir la granularitat anterior, però sense cap incentiu regulador associat. La cronologia preveu aplicació progressiva a partir de l'exercici 2027 per a les grans empreses de l'article 19a, amb una transició allargada fins al 2032 per a les de l'article 19b. Els inversors institucionals i la societat civil han advertit que la simplificació pot comprometre la comparabilitat entre parells i la traçabilitat de la informació Scope 3. L'EFRAG, per la seva banda, es queda sense mandat per desenvolupar els sectoral standards previstos. En resum: menys càrrega administrativa, però també menys profunditat per detectar riscos materials de sostenibilitat.",
    "implicacions": {
        "empreses": "Per a les empreses, la revisió alleuja la càrrega operativa i permet reorientar recursos cap a acció real en lloc de reporting. Però elimina un diagnòstic compartit: sense datapoints sectorials comparables, les empreses grans perdren pal de paller per pressionar els seus proveïdors. El risc és que cada organització torni a construir el seu propi qüestionari ad hoc, reproduint el fragmentament que el CSRD volia resoldre.",
        "reguladors": "Els reguladors nacionals (CNMV, AMF, BaFin) perden eina de supervisió basada en dades estandarditzades. L'autoritat europea (ESMA) haurà de reconstruir comparabilitat agregada amb menys inputs. La Comissió es queda amb un instrument políticament venible com a 'simplificació' però metodològicament més feble. La pressure per retrocedir més en properes revisions queda oberta.",
        "ciutadans": "Per a la ciutadania, la promesa és transparència més accessible i menys costos traslladats a preus. En canvi, es redueix la capacitat de comparar impactes reals entre empreses del mateix sector. La societat civil organitzada perd eina per denunciar rentat verd: amb menys dades obligatòries, més espai per al relat auto-declaratiu.",
    },
    "mesEnllaCheckbox": {
        "criteri": "Justícia distributiva + Sostenibilitat absoluta",
        "body": "La simplificació es presenta com a neutra, però distribueix els beneficis i els costos de manera asimètrica. Les grans corporacions amb capacitat de lobbying han guanyat alleugeriment; les comunitats afectades pels seus impactes perden informació verificable per exercir drets. Alhora, eliminar granularitat sectorial converteix la sostenibilitat en variable relativa —'miller que l'any passat'— en lloc d'absoluta —'compatible amb els límits planetaris'. Sense referents absoluts, el reporting esdevé exercici de millora contínua sense sostre, insuficient per aturar la deterioració ecològica real que pateixen territoris concrets.",
    },
    "connexions": [
        {"type": "Evolució", "target": "EFRAG Sustainability Reporting Work Programme 2026",
         "desc": "L'EFRAG tenia previst desplegar sectoral standards al 2026; la revisió congela el roadmap i el converteix en prioritat secundària."},
        {"type": "Complement", "target": "EU Taxonomy: Delegated Act de simplificació",
         "desc": "Ambdós actes formen part de l'Omnibus I i comparteixen la lògica de reducció de càrregues per als mateixos obligats."},
        {"type": "Contradicció", "target": "CSDDD: modificacions Omnibus I definitives",
         "desc": "Mentre el CSRD alleuja el reporting, el CSDDD estreny la due diligence; les empreses hauran de fer més amb menys informació estructurada."},
    ],
    "accions": [
        {"num": "01", "title": "Auditar la matriu de materialitat vigent",
         "desc": "Identificar quins datapoints eliminats eren realment materials per al vostre sector i mantenir-los de forma voluntària amb documentació interna.",
         "effort": "Baix", "impact": "Mitjà"},
        {"num": "02", "title": "Renegociar el contracte d'assurance extern",
         "desc": "Aprofitar la reducció de datapoints per baixar cost, però pactar assurance raonable sobre els datapoints materials que es conservin.",
         "effort": "Mitjà", "impact": "Alt"},
        {"num": "03", "title": "Construir un dataset voluntari intern",
         "desc": "Mantenir una capa de dades 'gold standard' per als stakeholders qualificats (inversors, ONG, sindicats) que vulguin granularitat completa.",
         "effort": "Mitjà", "impact": "Mitjà"},
        {"num": "04", "title": "Formar el comitè d'auditoria en doble materialitat reduïda",
         "desc": "Sessions curtes per alinear criteris entre financer, jurídic i sostenibilitat sobre què entra i què surt del nou perimeter.",
         "effort": "Baix", "impact": "Baix"},
    ],
    "crossRefs": [
        {"framework": "GRI", "criterion": "Universal Standards 2021 (compatibilitat declarada)", "impact": "Alt"},
        {"framework": "EcoVadis", "criterion": "Score de Environment i Sustainable Procurement", "impact": "Mitjà"},
        {"framework": "MSCI ESG", "criterion": "Data coverage i controversy screening", "impact": "Mitjà"},
        {"framework": "B Corp", "criterion": "Standards V2.1 — convergència parcial en indicadors", "impact": "Baix"},
    ],
}

html = generate_html(report)
Path('_tmp_mostra.html').write_text(html, encoding='utf-8')

browser = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
if not Path(browser).exists():
    browser = r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
pdf = 'mostra-plantilla-v7-esrs.pdf'
subprocess.run([browser, '--headless', '--disable-gpu', '--no-pdf-header-footer',
                f'--user-data-dir={tempfile.mkdtemp(prefix="pdfprof-")}',
                f'--print-to-pdf={Path(pdf).resolve()}', Path('_tmp_mostra.html').resolve().as_uri()],
               capture_output=True, text=True, timeout=120)
ok = Path(pdf).exists()
print("PDF:", pdf, f"{Path(pdf).stat().st_size//1024} KB" if ok else "FALLA")
Path('_tmp_mostra.html').unlink(missing_ok=True)
