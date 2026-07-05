#!/usr/bin/env python3
"""
Genera un informe pilot complet amb:
- Bloc 0: Semàfor Metodològic (Format A) avaluant Forética
- Blocs 1-7: contingut existent de Forética
- Subbloc "Més enllà del Checkbox" dins del Bloc 4

L'objectiu és veure el format real en context, no només aïllat.

REGRA: ABANS de guardar el HTML final, passa el corrector LanguageTool
i guarda el log al costat del fitxer generat.
"""
import sys
sys.path.insert(0, '/home/z/my-project/scripts')
from pathlib import Path
from corrector_wrapper import check_html

# ============ DADES INFORME FORÉTICA ============
REPORT = {
    "title": "Tendencias ESG 2026: cinco claves para la década decisiva",
    "institution": "Forética",
    "date": "Febrer 2026",
    "pages": "10",
    "type": "Informe de tendències",
    "url": "foretica.org",
    "missatge_clau": "La sostenibilitat deixa de ser compliance i esdevé estratègia de competitivitat en una dècada decisiva"
}

# ============ BLOC 0: SEMÀFOR METODOLÒGIC ============
# Avaluació crítica de l'informe Forética amb els 5 indicadors
SEMAFOR = [
    {
        "name": "Cobertura Scope 3",
        "status": "groc",
        "label": "Esmentat",
        "detail": "Esmenta cadenes de subministrament, però no quantifica emissions Scope 3"
    },
    {
        "name": "Termes temporals",
        "status": "verd",
        "label": "Concret",
        "detail": "Dècada decisiva, 1.5°C, 3°C projectat — horitzó temporal definit"
    },
    {
        "name": "Fonts independents",
        "status": "groc",
        "label": "Mixte",
        "detail": "Cita WEF, IEA, IPCC; però algunes dades són pròpies no verificables"
    },
    {
        "name": "Granularitat",
        "status": "groc",
        "label": "Per regió",
        "detail": "Perspectiva espanyola i europea; no desglossa per sector"
    },
    {
        "name": "Verificació externa",
        "status": "vermell",
        "label": "Self-declared",
        "detail": "Sense auditoria externa; Forética és autor i promotor de l'informe"
    },
]
SEMAFOR_GRADE = "C"
SEMAFOR_GRADE_LABEL = "Feble metodològicament"
SEMAFOR_RESUME = "2 grocs + 1 verd + 2 grocs. Tendències ben argumentades, però sense verificació externa i granularitat limitada. Útil com a雷达 estratègic, no com a font única de dades."

# ============ BLOC 4: IMPLICACIONS + MÉS ENLLÀ DEL CHECKBOX ============
IMPLICATIONS = [
    {
        "actor": "Empreses",
        "body": "La sostenibilitat ha de passar de càrrega de compliance a plataforma de competitivitat. Les empreses han d'orientar la sostenibilitat cap a la creació de valor, reforçar models de negoci de baix impacte i energia independent, i minimitzar la vulnerabilitat geopolítica a les cadenes de subministrament. L'aigua ha de passar de preocupació operativa a factor d'risc estratègic."
    },
    {
        "actor": "Reguladors",
        "body": "La 'deflació regulatoria' europea necessita estabilitzar-se. La incertesa entre cicles polítics i cicles d'implementació corporativa és el principal problema. Cal alinear la pressió reguladora amb la capacitat real d'implementació de les pimes."
    },
    {
        "actor": "Ciutadans",
        "body": "Les fractures socials (joves, habitatge, pobresa infantil) s'agreugen. L'1.5°C ja no és assolible i els impactes del canvi climàtic (especialment relacionats amb l'aigua) afectaran directament la salut, infraestructures i activitat econòmica."
    },
]

# MÉS ENLLÀ DEL CHECKBOX (sense mencions teòriques)
# Criteris triats: Justícia distributiva + Arrelament territorial
MES_ENLLA = {
    "criteria": "Justícia distributiva + Arrelament territorial",
    "body": (
        "L'informe diagnostica les fractures socials (joves, habitatge, pobresa infantil) com a tendència clau, "
        "però no aprofundeix en com les empreses haurien de redistribuir la riquesa que generen. "
        "Es parla de 'creació de valor' en abstracte, però no es qüestiona la ràtio salarial CEO/trabajador mitjà, "
        "ni es proposen mecanismes concrets de repartiment de beneficis amb treballadors i comunitats d'origen. "
        "La crisi d'habitatge que s'esmenta té causes estructurals —especulació, financerització— que els marcs ESG "
        "habituals no toquen perquè queden fora del 'material' per a l'empresa.<br><br>"
        "Pel que fa a l'arrelament territorial, l'informe té perspectiva espanyola i europea, però no demana "
        "a les empreses que reportin impacte per centre operatiu o per comunitat local. "
        "L'aigua com a risc estratègic (Trend #5) es presenta com a xifra global —2.000 milions sense accés segur— "
        "sense mapejar quines conques o quines comunitats específiques són vulnerables a la cadena de valor de cada empresa. "
        "Aquesta mancança no és exclusiva de Forética; és estructural dels informes ESG hegemònics, "
        "que operen amb aggregates globals i perden la dimensió del territori on les empreses realment operen."
    )
}

# ============ BLOC 1: FITXA TÈCNICA ============
FITXA = "Institució: Forética | Data: febrer 2026 | Tipus: Informe de tendències | Pàgines: 10 | Llengua: anglès (traduït de l'espanyol) | URL: foretica.org"

# ============ BLOC 2: 5 DADES CLAU ============
DADES = [
    {"value": "85%", "label": "dels fons sostenibles globals (AUM) són europeus", "page": "Trend #2"},
    {"value": "+17%", "label": "volum d'actius sostenibles respecte fa un any, malgrat les sortides", "page": "Trend #2"},
    {"value": "3°C", "label": "escalfament projectat amb polítiques actuals (vs 1.5°C objectiu)", "page": "Trend #4"},
    {"value": "2.000M", "label": "persones sense accés a aigua potable segura", "page": "Trend #5"},
    {"value": "91%", "label": "de pèrdues per desastres naturals el 2024 relacionades amb l'aigua", "page": "Trend #5"},
]

# ============ BLOC 3: RESUM EXECUTIU ============
RESUM = (
    "Forética analitza 5 tendències ESG que marcaran l'agenda 2026 i la resta de la dècada. "
    "(1) Europa arriba al final d'un procés de 'deflació regulatoria' en sostenibilitat: la UE ha recalibrat el marc regulador "
    "per reduir complexitat, però la incertesa ha creat polarització entre maximalistes i reduccionistes. "
    "(2) Els mercats financers ESG han patit tres cops: inseguretat geopolítica, hostilitat política (MAGA anti-ESG als EUA) "
    "i el boom energètic de la IA. Tot i això, els fons sostenibles europeus mantenen el 85% de l'AUM global. "
    "(3) Les fractures socials s'agreugen: creixement a la meitat del ritme dels 60s, desigualtat intergeneracional, crisi d'habitatge. "
    "Espanya n'és un exemple paradigmàtic. "
    "(4) L'objectiu d'1.5°C és ja inassolible; amb polítiques actuals anem cap a 3°C. "
    "(5) L'aigua emergeix com a risc central: 2.000 milions sense accés segur, el 91% de pèrdues per desastres naturals el 2024 "
    "van ser relacionades amb l'aigua."
)

# ============ BLOC 5: CONNEXIONS ============
CONNEXIONS = [
    {"type": "Evolució", "target": "Revisió ESRS (maig 2026)", "desc": "La 'deflació regulatoria' que Forética identifica com a Trend #1 es materialitza en la revisió dels ESRS que redueix un 61% dels datapoints obligatoris."},
    {"type": "Complement", "target": "WEF Global Risks Report 2026", "desc": "El WEF identifica els mateixos riscos estructurals (geopolítica, clima, desigualtat) des d'una perspectiva global, mentre Forética ho fa des de la perspectiva empresarial espanyola."},
    {"type": "Contradicció", "target": "Boom IA i transició energètica", "desc": "L'informe assenyala que el boom de la IA està desviant capital d'inversió verda cap a centres de dades i semiconductors, creant tensió entre dues prioritats ESG."},
]

# ============ BLOC 6: ACCIONS RECOMANADES ============
ACCIONS = [
    {"num": "01", "title": "Reorientar la sostenibilitat cap a la competitivitat", "desc": "Passar de veure la sostenibilitat com a compliance a veure-la com a plataforma de creació de valor. Auditar quines inversions ESG generen avantatge competitiu real.", "effort": "Mitjà", "impact": "Alt"},
    {"num": "02", "title": "Reassessir la materialitat de l'aigua", "desc": "L'aigua ha de passar de preocupació operativa a factor d'risc estratègic. Mapejar la cadena de valor completa i desenvolupar plans de contingència per a escenarios extrems.", "effort": "Alt", "impact": "Alt"},
    {"num": "03", "title": "Prioritzar adaptació climàtica", "desc": "Amb 3°C projectats, l'adaptació ha de ser pilar central. Assegurances, infraestructures resilients i preparació per a esdeveniments extrems són prioritaris abans que els costos escalin.", "effort": "Alt", "impact": "Alt"},
    {"num": "04", "title": "Invertir en reskilling i joventut", "desc": "Les fractures socials (especialment la desigualtat intergeneracional) amenacen la cohesió. Les empreses han d'invertir en formació a gran escala i prioritzar joventut, habitatge i pobresa infantil.", "effort": "Mitjà", "impact": "Mitjà"},
]

# ============ BLOC 7: CROSS-REFERENCE ============
XREFS = [
    {"framework": "SGE 21", "criterion": "Gestió ètica i socialment responsable", "impact": "Forética és l'organització darrere l'SGE 21. Aquest informe reforça la necessitat d'integrar la sostenibilitat com a estratègia competitiva, alineat amb el capítol de governança de l'SGE 21."},
    {"framework": "CSRD/ESRS", "criterion": "Materialitat doble", "impact": "La Trend #1 (deflació regulatoria) afecta directament com les empreses implementen la CSRD. La incertesa reguladora fa més difícil el double materiality assessment."},
    {"framework": "SFDR", "criterion": "Fons Article 8/9", "impact": "La Trend #2 (reajustament financer ESG) afecta la classificació de fons Article 8/9. La sortida de fons i la politització anti-ESG redueixen l'AUM dels fons 9."},
    {"framework": "TCFD", "criterion": "Riscos físics i de transició", "impact": "La Trend #4 (acomiadament a 1.5°C) i la Trend #5 (aigua) són riscos físics que TCFD demana reportar. L'adaptació ha de ser pilar estratègic."},
]

# ============ COLORS CRITERI ESG ============
COLORS = {
    "bg": "#F5EFE6", "text": "#2C1810", "coure": "#B87333",
    "verd": "#5C8A5C", "groc": "#C9A961", "vermell": "#A0522D",
    "gris": "#9C8B7A", "border": "#E5DDD0",
}

def status_color(s): return {"verd": COLORS["verd"], "groc": COLORS["groc"], "vermell": COLORS["vermell"]}[s]
def status_dot(s):
    return f'<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:{status_color(s)};vertical-align:middle;"></span>'

# ============ CONSTRUIR HTML ============
def build_html():
    # === Capçalera ===
    header = f"""
    <div class="report-header">
      <div class="kicker">CRITERI ESG · Informe processat · Mostra pilot</div>
      <h1>{REPORT['title']}</h1>
      <div class="meta">{REPORT['institution']} · {REPORT['date']} · {REPORT['pages']} pàgines · {REPORT['type']}</div>
      <div class="missatge-clau">⭐ {REPORT['missatge_clau']}</div>
    </div>
    """
    
    # === Bloc 0: Semàfor ===
    semafor_rows = ""
    for ind in SEMAFOR:
        semafor_rows += f"""
        <tr>
          <td class="ind-name">{ind['name']}</td>
          <td class="ind-dot">{status_dot(ind['status'])}</td>
          <td class="ind-label" style="color: {status_color(ind['status'])}">{ind['label']}</td>
          <td class="ind-detail">{ind['detail']}</td>
        </tr>"""
    
    semafor = f"""
    <div class="semafor-card">
      <div class="semafor-head">
        <div class="semafor-title">⬢ Semàfor Metodològic</div>
        <div class="grade-pill" style="background: {status_color('vermell')}">
          <span class="grade-letter">{SEMAFOR_GRADE}</span>{SEMAFOR_GRADE_LABEL}
        </div>
      </div>
      <table>
        {semafor_rows}
      </table>
      <div class="semafor-footer">
        <span class="footer-label">Nota global</span> {SEMAFOR_RESUME}
      </div>
    </div>
    """
    
    # === Bloc 1: Fitxa tècnica ===
    bloc1 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">01</span>Fitxa tècnica</h2>
      <p class="bloc-content">{FITXA}</p>
    </div>
    """
    
    # === Bloc 2: 5 dades clau ===
    dades_html = ""
    for d in DADES:
        dades_html += f"""
        <div class="dato">
          <div class="dato-value">{d['value']}</div>
          <div class="dato-label">{d['label']}</div>
          <div class="dato-page">[{d['page']}]</div>
        </div>"""
    
    bloc2 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">02</span>Cinc dades clau</h2>
      <div class="dades-grid">{dades_html}</div>
    </div>
    """
    
    # === Bloc 3: Resum executiu ===
    bloc3 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">03</span>Resum executiu</h2>
      <p class="bloc-content">{RESUM}</p>
    </div>
    """
    
    # === Bloc 4: Implicacions + Més enllà del Checkbox ===
    implications_html = ""
    for imp in IMPLICATIONS:
        implications_html += f"""
        <div class="implicacio">
          <div class="implicacio-actor">{imp['actor']}</div>
          <div class="implicacio-body">{imp['body']}</div>
        </div>"""
    
    mes_enlla = f"""
    <div class="mes-enlla">
      <div class="mes-enlla-head">
        <span class="mes-enlla-icon">◆</span>
        <span class="mes-enlla-title">MÉS ENLLÀ DEL CHECKBOX</span>
      </div>
      <div class="mes-enalla-criteri">Criteri avaluat: <strong>{MES_ENLLA['criteria']}</strong></div>
      <div class="mes-enlla-body">{MES_ENLLA['body']}</div>
    </div>
    """
    
    bloc4 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">04</span>Implicacions</h2>
      {implications_html}
      {mes_enlla}
    </div>
    """
    
    # === Bloc 5: Connexions ===
    connexions_html = ""
    for c in CONNEXIONS:
        connexions_html += f"""
        <div class="connexio">
          <span class="connexio-type">{c['type']}</span>
          <div class="connexio-content">
            <div class="connexio-target">→ {c['target']}</div>
            <div class="connexio-desc">{c['desc']}</div>
          </div>
        </div>"""
    
    bloc5 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">05</span>Connexions amb altres informes</h2>
      {connexions_html}
    </div>
    """
    
    # === Bloc 6: Accions recomanades ===
    accions_html = ""
    for a in ACCIONS:
        eff_class = "tag-alt" if a["effort"] == "Alt" else "tag-mitja"
        imp_class = "tag-alt" if a["impact"] == "Alt" else "tag-mitja"
        accions_html += f"""
        <div class="accio">
          <div class="accio-num">{a['num']}</div>
          <div class="accio-content">
            <div class="accio-title">{a['title']}</div>
            <div class="accio-desc">{a['desc']}</div>
            <div class="accio-tags">
              <span class="accio-tag {eff_class}">Esforç: {a['effort']}</span>
              <span class="accio-tag {imp_class}">Impacte: {a['impact']}</span>
            </div>
          </div>
        </div>"""
    
    bloc6 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">06</span>Accions recomanades ⭐</h2>
      {accions_html}
    </div>
    """
    
    # === Bloc 7: Cross-reference ===
    xrefs_html = ""
    for x in XREFS:
        xrefs_html += f"""
        <div class="xref">
          <div class="xref-framework">{x['framework']}</div>
          <div class="xref-criterion">{x['criterion']}</div>
          <div class="xref-impact">{x['impact']}</div>
        </div>"""
    
    bloc7 = f"""
    <div class="bloc">
      <h2><span class="bloc-num">07</span>Cross-reference amb certificacions ⭐</h2>
      {xrefs_html}
    </div>
    """
    
    # === Disclaimer ===
    disclaimer = """
    <div class="disclaimer">
      Aquest informe ha estat processat per Criteri ESG seguint l'estructura de 8 blocs (Semàfor Metodològic + 7 blocs narratius). 
      El contingut original és de Forética; l'anàlisi crítica (Semàfor i "Més enllà del Checkbox") és editorial de Criteri.
    </div>
    """
    
    return f"""<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<title>Criteri ESG — Informe pilot Forética</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
  
  body {{
    background: {COLORS['bg']}; margin: 0; padding: 40px 20px;
    font-family: 'Inter', sans-serif; color: {COLORS['text']}; line-height: 1.6;
  }}
  .page {{ max-width: 800px; margin: 0 auto; }}
  
  /* Header */
  .report-header {{ margin-bottom: 28px; padding-bottom: 18px; border-bottom: 2px solid {COLORS['coure']}; }}
  .kicker {{ font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: {COLORS['coure']}; font-weight: 600; }}
  .report-header h1 {{ font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; margin: 8px 0 4px 0; line-height: 1.2; }}
  .meta {{ font-size: 13px; color: {COLORS['gris']}; }}
  .missatge-clau {{ margin-top: 12px; padding: 10px 14px; background: rgba(184,115,51,0.08); border-left: 3px solid {COLORS['coure']}; font-size: 14px; font-style: italic; }}
  
  /* Semàfor */
  .semafor-card {{
    background: white; border: 1px solid {COLORS['border']};
    border-left: 4px solid {COLORS['coure']};
    padding: 20px 24px; border-radius: 4px; margin-bottom: 32px;
  }}
  .semafor-head {{
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid {COLORS['border']}; padding-bottom: 10px; margin-bottom: 12px;
  }}
  .semafor-title {{ font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }}
  .grade-pill {{
    display: inline-block; padding: 4px 14px; border-radius: 12px; color: white;
    font-family: 'Fraunces', serif; font-weight: 600; font-size: 13px;
  }}
  .grade-pill .grade-letter {{ font-size: 20px; margin-right: 6px; font-weight: 700; }}
  table {{ width: 100%; border-collapse: collapse; }}
  td {{ padding: 7px 0; vertical-align: middle; font-size: 13px; }}
  td.ind-name {{ font-weight: 500; width: 26%; }}
  td.ind-dot {{ width: 22px; text-align: center; }}
  td.ind-label {{ font-weight: 700; width: 18%; text-transform: uppercase; letter-spacing: 0.3px; font-size: 11px; }}
  td.ind-detail {{ color: {COLORS['gris']}; font-style: italic; }}
  tr + tr td {{ border-top: 1px solid #F0EBE0; }}
  .semafor-footer {{ margin-top: 12px; padding-top: 10px; border-top: 1px solid {COLORS['border']}; font-size: 11px; color: {COLORS['gris']}; }}
  .footer-label {{ font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: {COLORS['coure']}; font-weight: 700; margin-right: 6px; }}
  
  /* Blocs */
  .bloc {{ margin-bottom: 28px; }}
  .bloc h2 {{
    font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600;
    color: {COLORS['text']}; margin: 0 0 12px 0;
    padding-bottom: 6px; border-bottom: 1px solid {COLORS['border']};
    display: flex; align-items: baseline; gap: 10px;
  }}
  .bloc-num {{ color: {COLORS['coure']}; font-weight: 700; font-size: 14px; }}
  .bloc-content {{ font-size: 14px; margin: 0; }}
  
  /* Dades */
  .dades-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }}
  .dato {{ background: white; padding: 14px 16px; border-left: 3px solid {COLORS['coure']}; border-radius: 2px; }}
  .dato-value {{ font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: {COLORS['coure']}; line-height: 1; margin-bottom: 4px; }}
  .dato-label {{ font-size: 12px; color: {COLORS['text']}; }}
  .dato-page {{ font-size: 10px; color: {COLORS['gris']}; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }}
  
  /* Implicacions */
  .implicacio {{ margin-bottom: 12px; padding: 12px 16px; background: white; border-radius: 2px; border-left: 3px solid {COLORS['gris']}; }}
  .implicacio-actor {{ font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: {COLORS['coure']}; font-weight: 700; margin-bottom: 4px; }}
  .implicacio-body {{ font-size: 13px; }}
  
  /* Més enllà del Checkbox */
  .mes-enlla {{
    margin-top: 18px; padding: 16px 18px; background: rgba(184,115,51,0.06);
    border: 1px solid {COLORS['coure']}; border-radius: 4px;
  }}
  .mes-enlla-head {{ display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }}
  .mes-enlla-icon {{ color: {COLORS['coure']}; font-size: 16px; }}
  .mes-enlla-title {{ font-family: 'Fraunces', serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: {COLORS['coure']}; }}
  .mes-enalla-criteri {{ font-size: 12px; color: {COLORS['text']}; margin-bottom: 8px; font-style: italic; }}
  .mes-enlla-body {{ font-size: 13px; line-height: 1.7; }}
  
  /* Connexions */
  .connexio {{ display: flex; gap: 12px; margin-bottom: 10px; padding: 10px 14px; background: white; border-radius: 2px; }}
  .connexio-type {{ font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: white; background: {COLORS['coure']}; padding: 3px 8px; border-radius: 10px; height: fit-content; font-weight: 600; white-space: nowrap; }}
  .connexio-target {{ font-size: 13px; font-weight: 600; margin-bottom: 4px; }}
  .connexio-desc {{ font-size: 12px; color: {COLORS['gris']}; }}
  
  /* Accions */
  .accio {{ display: flex; gap: 14px; margin-bottom: 10px; padding: 12px 14px; background: white; border-radius: 2px; border-left: 3px solid {COLORS['verd']}; }}
  .accio-num {{ font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: {COLORS['coure']}; line-height: 1; min-width: 32px; }}
  .accio-title {{ font-size: 14px; font-weight: 600; margin-bottom: 4px; }}
  .accio-desc {{ font-size: 12px; color: {COLORS['gris']}; margin-bottom: 6px; }}
  .accio-tags {{ display: flex; gap: 8px; }}
  .accio-tag {{ font-size: 10px; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }}
  .tag-alt {{ background: rgba(160,82,45,0.15); color: {COLORS['vermell']}; }}
  .tag-mitja {{ background: rgba(201,169,97,0.2); color: #8a7340; }}
  
  /* Xref */
  .xref {{ margin-bottom: 10px; padding: 12px 14px; background: white; border-radius: 2px; border-left: 3px solid {COLORS['coure']}; }}
  .xref-framework {{ font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: {COLORS['coure']}; margin-bottom: 2px; }}
  .xref-criterion {{ font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: {COLORS['gris']}; margin-bottom: 6px; }}
  .xref-impact {{ font-size: 12px; }}
  
  /* Disclaimer */
  .disclaimer {{ margin-top: 32px; padding-top: 14px; border-top: 1px solid {COLORS['border']}; font-size: 10px; color: {COLORS['gris']}; text-align: center; font-style: italic; }}
</style>
</head>
<body>
<div class="page">
  {header}
  {semafor}
  {bloc1}
  {bloc2}
  {bloc3}
  {bloc4}
  {bloc5}
  {bloc6}
  {bloc7}
  {disclaimer}
</div>
</body>
</html>"""

def main():
    out = Path("/home/z/my-project/download")
    out.mkdir(parents=True, exist_ok=True)
    f = out / "pilot-informe-foretica-amb-semafor-i-mes-enlla.html"
    html = build_html()
    
    # ============ CORRECTOR OBLIGATORI (regla 17 CONTEXT.md) ============
    print("\n" + "=" * 60)
    print("PASSANT CORRECTOR LANGUAGETOOL...")
    print("=" * 60)
    result = check_html(html, language='ca', source=str(f))
    print(result.report())
    # Guarda el log al costat del fitxer
    result.save_log(f)
    print(f"\nLog guardat a: {f}.corrector.log")
    
    if result.manual_corrections:
        print("\n⚠ ATENCIÓ: Hi ha correccions manuals pendents.")
        print("  El fitxer es guardarà igualment, però revisa el log.")
    
    # Guarda el fitxer (amb correccions automàtiques aplicades si és text pla;
    # en HTML només auditem — les correccions manuals cal fer-les a mà)
    f.write_text(html, encoding="utf-8")
    print(f"\n✓ Generat: {f}")

if __name__ == "__main__":
    main()
