"""
Genera PDF d'informe Criteri ESG amb la plantilla HTML oficial.

Fa servir la mateixa plantilla que pilot-informe-foretica-amb-semafor-i-mes-enlla.html
i la converteix a PDF via weasyprint.

Ús:
    scripts/.venv/bin/python scripts/genera-pdf-informe.py <slug>
"""
import sys
import json
import re
import subprocess
import tempfile
from pathlib import Path

DATA_DIR = Path("./data/informes")
REVISATS_DIR = DATA_DIR / "4-revisats-ortografia"

# === Plantilla HTML (basada en pilot-informe-foretica) ===
# Es genera dinàmicament a partir del ReportBlock

CSS = """
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body {
    background: #F5EFE6; padding: 40px 20px;
    font-family: 'Inter', sans-serif; color: #2C1810; line-height: 1.6;
}
.page { max-width: 800px; margin: 0 auto; background: transparent; }

/* Header */
.report-header { margin-bottom: 28px; padding-bottom: 18px; border-bottom: 2px solid #B87333; }
.kicker { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #B87333; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.report-header h1 { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; margin: 8px 0 4px 0; line-height: 1.2; color: #2C1810; }
.meta { font-size: 13px; color: #9C8B7A; }
.missatge-clau { margin-top: 12px; padding: 10px 14px; background: rgba(184,115,51,0.08); border-left: 3px solid #B87333; font-size: 14px; font-style: italic; font-family: 'Fraunces', serif; }

/* Semàfor */
.semafor-card {
    background: white; border: 1px solid #E5DDD0;
    border-left: 4px solid #B87333;
    padding: 20px 24px; border-radius: 4px; margin-bottom: 32px;
}
.semafor-head {
    display: flex; justify-content: space-between; align-items: baseline;
    border-bottom: 1px solid #E5DDD0; padding-bottom: 10px; margin-bottom: 12px;
}
.semafor-title { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.grade-pill {
    display: inline-block; padding: 4px 14px; border-radius: 12px; color: white;
    font-family: 'Fraunces', serif; font-weight: 600; font-size: 13px;
}
.grade-pill .grade-letter { font-size: 20px; margin-right: 6px; font-weight: 700; }
table { width: 100%; border-collapse: collapse; }
td { padding: 7px 0; vertical-align: middle; font-size: 13px; }
td.ind-name { font-weight: 500; width: 26%; }
td.ind-dot { width: 22px; text-align: center; }
td.ind-label { font-weight: 700; width: 18%; text-transform: uppercase; letter-spacing: 0.3px; font-size: 11px; }
td.ind-detail { color: #9C8B7A; font-style: italic; }
tr + tr td { border-top: 1px solid #F0EBE0; }

/* Blocs */
.bloc { margin-bottom: 28px; }
.bloc h2 {
    font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600;
    color: #2C1810; margin: 0 0 12px 0;
    padding-bottom: 6px; border-bottom: 1px solid #E5DDD0;
    display: flex; align-items: baseline; gap: 10px;
}
.bloc-num { color: #B87333; font-weight: 700; font-size: 14px; }
.bloc-content { font-size: 14px; }
.bloc-content p { margin-bottom: 8px; }

/* Dades */
.dades-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.dato { background: white; padding: 14px 16px; border-left: 3px solid #B87333; border-radius: 2px; }
.dato-value { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 700; color: #B87333; line-height: 1; margin-bottom: 4px; }
.dato-label { font-size: 12px; color: #2C1810; }
.dato-page { font-size: 10px; color: #9C8B7A; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; font-family: 'JetBrains Mono', monospace; }

/* Implicacions */
.implicacio { margin-bottom: 12px; padding: 12px 16px; background: white; border-radius: 2px; border-left: 3px solid #9C8B7A; }
.implicacio-actor { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #B87333; font-weight: 700; margin-bottom: 4px; font-family: 'JetBrains Mono', monospace; }
.implicacio-body { font-size: 13px; }

/* Més enllà del Checkbox */
.mes-enlla {
    margin-top: 18px; padding: 16px 18px; background: rgba(184,115,51,0.06);
    border: 1px solid #B87333; border-radius: 4px;
}
.mes-enlla-title { font-family: 'Fraunces', serif; font-size: 13px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #B87333; margin-bottom: 8px; }
.mes-enalla-criteri { font-size: 12px; color: #2C1810; margin-bottom: 8px; font-style: italic; }
.mes-enlla-body { font-size: 13px; line-height: 1.7; }

/* Connexions */
.connexio { display: flex; gap: 12px; margin-bottom: 10px; padding: 10px 14px; background: white; border-radius: 2px; }
.connexio-type { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: white; background: #B87333; padding: 3px 8px; border-radius: 10px; height: fit-content; font-weight: 600; white-space: nowrap; }
.connexio-target { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.connexio-desc { font-size: 12px; color: #9C8B7A; }

/* Accions */
.accio { display: flex; gap: 14px; margin-bottom: 10px; padding: 12px 14px; background: white; border-radius: 2px; border-left: 3px solid #5C8A5C; }
.accio-num { font-family: 'Fraunces', serif; font-size: 22px; font-weight: 700; color: #B87333; line-height: 1; min-width: 32px; }
.accio-title { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.accio-desc { font-size: 12px; color: #9C8B7A; margin-bottom: 6px; }
.accio-tags { display: flex; gap: 8px; }
.accio-tag { font-size: 10px; padding: 2px 8px; border-radius: 8px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; font-family: 'JetBrains Mono', monospace; }
.tag-alt { background: rgba(160,82,45,0.15); color: #A0522D; }
.tag-mitja { background: rgba(201,169,97,0.2); color: #8a7340; }
.tag-baix { background: rgba(92,138,92,0.15); color: #5C8A5C; }

/* Xref */
.xref { margin-bottom: 10px; padding: 12px 14px; background: white; border-radius: 2px; border-left: 3px solid #B87333; }
.xref-framework { font-family: 'Fraunces', serif; font-size: 14px; font-weight: 700; color: #B87333; margin-bottom: 2px; }
.xref-criterion { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9C8B7A; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; }
.xref-impact { font-size: 12px; }

/* Disclaimer */
.disclaimer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #E5DDD0; font-size: 10px; color: #9C8B7A; text-align: center; font-style: italic; }
"""

# Colors segons status
STATUS_COLORS = {
    "verd": "#5C8A5C",
    "groc": "#C9A961",
    "vermell": "#A0522D",
}

# Colors segons grade
GRADE_BG = {
    "A": "#5C8A5C",
    "B": "#C9A961",
    "C": "#A0522D",
    "D": "#7a3a1a",
}


def esc(s):
    """Escape HTML."""
    if not s:
        return ""
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def md_to_html(text):
    """Converteix Markdown bàsic a HTML (per als textos de GLM que venen en MD)."""
    if not text:
        return ""
    # Headers
    text = re.sub(r"^### (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    text = re.sub(r"^## (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    text = re.sub(r"^# (.+)$", r"<strong>\1</strong><br>", text, flags=re.MULTILINE)
    # Bold
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", text)
    # Paràgrafs
    paragraphs = text.strip().split("\n\n")
    return "".join(f"<p>{p.strip()}</p>" for p in paragraphs if p.strip())


def parse_md_to_reportblock(md_text: str, lang: str = "ca") -> dict:
    """Parseja un Markdown del pas 4/5 a una estructura ReportBlock."""
    # Treure front-matter
    if md_text.startswith("---"):
        end = md_text.find("---", 3)
        if end > 0:
            front = md_text[3:end].strip()
            md_text = md_text[end+3:].strip()
            # Extreure camps del front-matter
            meta = {}
            for line in front.split("\n"):
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip()
        else:
            meta = {}
    else:
        meta = {}

    # Heuristic: extreure blocs per headers
    sections = re.split(r"^## ", md_text, flags=re.MULTILINE)
    result = {
        "title": meta.get("title", ""),
        "institution": meta.get("institution", ""),
        "date": meta.get("date", ""),
        "lang": lang,
        "semafor": {"grade": "C", "gradeLabel": "", "indicators": []},
        "dadesClau": [],
        "resumExecutiu": "",
        "implicacions": {"empreses": "", "reguladors": "", "ciutadans": ""},
        "mesEnllaCheckbox": {"criteri": "", "body": ""},
        "connexions": [],
        "accions": [],
        "crossRefs": [],
    }

    for section in sections[1:]:  # skip primer (abans del primer ##)
        lines = section.strip().split("\n")
        title = lines[0].strip()
        body = "\n".join(lines[1:]).strip()

        if title.startswith("Bloc 0") or "Semàfor" in title:
            # Nota global
            m = re.search(r"(?:Nota global|Global)[:\s]*([A-D])\s*[·-]?\s*(.+?)(?:\n|$)", body)
            if m:
                result["semafor"]["grade"] = m.group(1)
                result["semafor"]["gradeLabel"] = m.group(2).strip()
            # Indicators
            for line in body.split("\n"):
                m = re.match(r"-\s*\*\*([^*]+)\*\*:\s*(\w+)\s*[—-]\s*(.+)", line)
                if m:
                    name = m.group(1).strip()
                    status_str = m.group(2).strip().lower()
                    note = m.group(3).strip()
                    # Mapejar status
                    status_map = {"verd": "verd", "groc": "groc", "vermell": "vermell", "verda": "verd", "groga": "groc", "vermella": "vermell"}
                    status = status_map.get(status_str, "groc")
                    label_map = {"verd": "Quantificat", "groc": "Esmentat", "vermell": "Ignorat"}
                    result["semafor"]["indicators"].append({
                        "name": name,
                        "status": status,
                        "label": label_map.get(status, "Esmentat"),
                        "note": note,
                    })

        elif title.startswith("Bloc 1") or "Fitxa" in title:
            result["fitxa"] = body

        elif title.startswith("Bloc 2") or "dades clau" in title.lower():
            # Buscar entrades "1. **valor** — label (p. X)"
            for line in body.split("\n"):
                m = re.match(r"\d+\.\s*\*\*([^*]+)\*\*\s*[—-]\s*(.+?)(?:\s*\(p\.\s*([^)]+)\))?$", line)
                if m:
                    result["dadesClau"].append({
                        "value": m.group(1).strip(),
                        "label": m.group(2).strip(),
                        "page": m.group(3) or "",
                    })

        elif title.startswith("Bloc 3") or "Resum" in title:
            result["resumExecutiu"] = body

        elif title.startswith("Bloc 4") or "Implicacions" in title:
            # Subseccions
            for sub in re.split(r"^### ", body, flags=re.MULTILINE)[1:]:
                sub_lines = sub.split("\n")
                sub_title = sub_lines[0].strip().lower()
                sub_body = "\n".join(sub_lines[1:]).strip()
                if "empresa" in sub_title:
                    result["implicacions"]["empreses"] = sub_body
                elif "regulador" in sub_title:
                    result["implicacions"]["reguladors"] = sub_body
                elif "ciutada" in sub_title:
                    result["implicacions"]["ciutadans"] = sub_body
                elif "checkbox" in sub_title or "enll" in sub_title:
                    # Més enllà del checkbox
                    m = re.search(r"Criteri:\s*(.+?)(?:\n|$)", sub_body)
                    if m:
                        result["mesEnllaCheckbox"]["criteri"] = m.group(1).strip()
                        sub_body = re.sub(r"Criteri:\s*.+?\n", "", sub_body, count=1)
                    result["mesEnllaCheckbox"]["body"] = sub_body.strip()

        elif title.startswith("Bloc 5") or "Connexions" in title:
            for line in body.split("\n"):
                m = re.match(r"-\s*\*\*([^*]+)\*\*\s*[—-]\s*([^:]+):\s*(.+)", line)
                if m:
                    result["connexions"].append({
                        "type": m.group(1).strip(),
                        "target": m.group(2).strip(),
                        "desc": m.group(3).strip(),
                    })

        elif title.startswith("Bloc 6") or "Accions" in title:
            # Format: 01. **títol** — desc\n   - Esforç: X · Impacte: Y
            blocks = re.split(r"\n(?=\d+\.)", body)
            for block in blocks:
                m = re.match(r"(\d+)\.\s*\*\*([^*]+)\*\*\s*[—-]\s*(.+?)(?:\n\s*-\s*Esfor[:ç]c?\s*:\s*(\w+)\s*[·-]\s*Impacte?\s*:\s*(\w+))?", block.strip())
                if m:
                    result["accions"].append({
                        "num": m.group(1),
                        "title": m.group(2).strip(),
                        "desc": m.group(3).strip(),
                        "effort": m.group(4) or "Mitjà",
                        "impact": m.group(5) or "Mitjà",
                    })

        elif title.startswith("Bloc 7") or "Cross" in title or "cross" in title:
            for line in body.split("\n"):
                m = re.match(r"-\s*\*\*([^*]+)\*\*\s*[—-]\s*([^:]+):\s*(.+)", line)
                if m:
                    result["crossRefs"].append({
                        "framework": m.group(1).strip(),
                        "criterion": m.group(2).strip(),
                        "impact": m.group(3).strip(),
                    })

    return result


def generate_html(report: dict) -> str:
    """Genera HTML a partir d'un ReportBlock."""
    lang = report.get("lang", "ca")
    is_ca = lang == "ca"

    # Textos segons idioma
    t = {
        "kicker": "CRITERI ESG · Informe processat" if is_ca else "CRITERI ESG · Informe procesado",
        "semafor_title": "⬢ Semàfor Metodològic" if is_ca else "⬢ Semáforo Metodológico",
        "bloc1": "Fitxa tècnica" if is_ca else "Ficha técnica",
        "bloc2": "Cinc dades clau" if is_ca else "Cinco datos clave",
        "bloc3": "Resum executiu" if is_ca else "Resumen ejecutivo",
        "bloc4": "Implicacions" if is_ca else "Implicaciones",
        "empreses": "Empreses" if is_ca else "Empresas",
        "reguladors": "Reguladors" if is_ca else "Reguladores",
        "ciutadans": "Ciutadans" if is_ca else "Ciudadanos",
        "mes_enlla": "Més enllà del Checkbox" if is_ca else "Más allá del Checkbox",
        "bloc5": "Connexions" if is_ca else "Conexiones",
        "bloc6": "Accions recomanades" if is_ca else "Acciones recomendadas",
        "bloc7": "Cross-reference",
        "missatge_clau_label": "Missatge clau" if is_ca else "Mensaje clave",
        "disclaimer": "Aquest informe ha estat processat amb assistència d'IA (GLM + Gemini) i està pendent de validació per l'equip Criteri ESG." if is_ca else "Este informe ha sido procesado con asistencia de IA (GLM + Gemini) y está pendiente de validación por el equipo Criteri ESG.",
    }

    sem = report.get("semafor", {})
    grade = sem.get("grade", "C")
    grade_label = sem.get("gradeLabel", "")
    grade_bg = GRADE_BG.get(grade, "#A0522D")

    # Indicators
    indicators_html = ""
    for ind in sem.get("indicators", []):
        color = STATUS_COLORS.get(ind.get("status"), "#C9A961")
        label = ind.get("label", "")
        note = ind.get("note", "")
        indicators_html += f"""
        <tr>
          <td class="ind-name">{esc(ind.get('name', ''))}</td>
          <td class="ind-dot"><span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:{color};vertical-align:middle;"></span></td>
          <td class="ind-label" style="color: {color}">{esc(label)}</td>
          <td class="ind-detail">{esc(note)}</td>
        </tr>"""

    # Dades clau
    dades_html = ""
    for d in report.get("dadesClau", []):
        dades_html += f"""
        <div class="dato">
          <div class="dato-value">{esc(d.get('value', ''))}</div>
          <div class="dato-label">{esc(d.get('label', ''))}</div>
          {f'<div class="dato-page">{esc(d.get("page", ""))}</div>' if d.get('page') else ''}
        </div>"""

    # Implicacions
    impl = report.get("implicacions", {})
    impl_html = ""
    for key, label in [("empreses", t["empreses"]), ("reguladors", t["reguladors"]), ("ciutadans", t["ciutadans"])]:
        body = impl.get(key, "")
        if body:
            impl_html += f"""
        <div class="implicacio">
          <div class="implicacio-actor">{label}</div>
          <div class="implicacio-body">{md_to_html(body)}</div>
        </div>"""

    # Més enllà
    mes_enlla = report.get("mesEnllaCheckbox", {})
    mes_enlla_html = ""
    if mes_enlla.get("body") or mes_enlla.get("criteri"):
        mes_enlla_html = f"""
    <div class="mes-enlla">
      <div class="mes-enlla-title">{t['mes_enlla']}</div>
      {f'<div class="mes-enalla-criteri">{esc(mes_enlla.get("criteri", ""))}</div>' if mes_enlla.get('criteri') else ''}
      <div class="mes-enlla-body">{md_to_html(mes_enlla.get('body', ''))}</div>
    </div>"""

    # Connexions
    conn_html = ""
    for c in report.get("connexions", []):
        conn_html += f"""
        <div class="connexio">
          <div class="connexio-type">{esc(c.get('type', ''))}</div>
          <div>
            <div class="connexio-target">{esc(c.get('target', ''))}</div>
            <div class="connexio-desc">{esc(c.get('desc', ''))}</div>
          </div>
        </div>"""

    # Accions
    accions_html = ""
    for a in report.get("accions", []):
        effort = a.get("effort", "Mitjà")
        impact = a.get("impact", "Mitjà")
        effort_class = "tag-baix" if "Baix" in effort else "tag-mitja" if "Mitj" in effort else "tag-alt"
        impact_class = "tag-baix" if "Baix" in impact else "tag-mitja" if "Mitj" in impact else "tag-alt"
        accions_html += f"""
        <div class="accio">
          <div class="accio-num">{esc(a.get('num', ''))}</div>
          <div>
            <div class="accio-title">{esc(a.get('title', ''))}</div>
            <div class="accio-desc">{esc(a.get('desc', ''))}</div>
            <div class="accio-tags">
              <span class="accio-tag {effort_class}">{t.get('esfor', 'Esforç') if is_ca else 'Esfuerzo'}: {esc(effort)}</span>
              <span class="accio-tag {impact_class}">Impacte: {esc(impact)}</span>
            </div>
          </div>
        </div>"""

    # Cross-references
    xref_html = ""
    for x in report.get("crossRefs", []):
        xref_html += f"""
        <div class="xref">
          <div class="xref-framework">{esc(x.get('framework', ''))}</div>
          <div class="xref-criterion">{esc(x.get('criterion', ''))}</div>
          <div class="xref-impact">{esc(x.get('impact', ''))}</div>
        </div>"""

    # Fitxa tècnica
    fitxa = report.get("fitxa", "")

    html = f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>{esc(report.get('title', ''))} — Criteri ESG</title>
<style>{CSS}</style>
</head>
<body>
<div class="page">

  <div class="report-header">
    <div class="kicker">{t['kicker']}</div>
    <h1>{esc(report.get('title', ''))}</h1>
    <div class="meta">{esc(report.get('institution', ''))} · {esc(report.get('date', ''))}</div>
  </div>

  <div class="semafor-card">
    <div class="semafor-head">
      <div class="semafor-title">{t['semafor_title']}</div>
      <div class="grade-pill" style="background: {grade_bg}">
        <span class="grade-letter">{esc(grade)}</span>{esc(grade_label)}
      </div>
    </div>
    <table>
      {indicators_html}
    </table>
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">01</span>{t['bloc1']}</h2>
    <div class="bloc-content">{md_to_html(fitxa)}</div>
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">02</span>{t['bloc2']}</h2>
    <div class="dades-grid">{dades_html}</div>
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">03</span>{t['bloc3']}</h2>
    <div class="bloc-content">{md_to_html(report.get('resumExecutiu', ''))}</div>
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">04</span>{t['bloc4']}</h2>
    {impl_html}
    {mes_enlla_html}
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">05</span>{t['bloc5']}</h2>
    {conn_html}
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">06</span>{t['bloc6']}</h2>
    {accions_html}
  </div>

  <div class="bloc">
    <h2><span class="bloc-num">07</span>{t['bloc7']}</h2>
    {xref_html}
  </div>

  <div class="disclaimer">{t['disclaimer']}</div>

</div>
</body>
</html>"""
    return html


def html_to_pdf(html: str, pdf_path: Path):
    """Converteix HTML a PDF.

    Backend preferit a Windows: Edge/Chrome headless (weasyprint falla
    per libgobject-2.0-0 absent). Detecta el navegador disponible.
    """
    import shutil

    # Possibles ubicacions del navegador (Windows) — Chrome primer (verificat 13-agost-2026)
    browsers = [
        shutil.which("chrome"),
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        shutil.which("msedge"),
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    ]
    browser = next((b for b in browsers if b and Path(b).exists()), None)
    if not browser:
        raise Exception(
            "Cap navegador (Edge/Chrome) disponible per generar PDF. "
            "Instal·la Microsoft Edge o Chrome."
        )

    with tempfile.NamedTemporaryFile(mode="w", suffix=".html", delete=False, encoding="utf-8") as f:
        f.write(html)
        html_path = f.name
    profile_dir = tempfile.mkdtemp(prefix="hermes-pdf-profile-")

    try:
        result = subprocess.run(
            [
                browser, "--headless", "--disable-gpu", "--no-pdf-header-footer",
                f"--user-data-dir={profile_dir}",
                f"--print-to-pdf={str(pdf_path.resolve())}",
                Path(html_path).as_uri(),
            ],
            capture_output=True,
            text=True,
            timeout=120,
        )
        if result.returncode != 0 or not pdf_path.exists():
            raise Exception(f"Error navegador: {result.stderr[:300]}")
    finally:
        Path(html_path).unlink(missing_ok=True)
        import shutil as _shutil
        _shutil.rmtree(profile_dir, ignore_errors=True)


def main():
    if len(sys.argv) < 2:
        print("Ús: genera-pdf-informe.py <slug>")
        sys.exit(1)

    slug = sys.argv[1]
    lang = sys.argv[2] if len(sys.argv) > 2 else "ca"

    md_path = REVISATS_DIR / f"{slug}.{lang}.md"
    if not md_path.exists():
        print(f"✗ No s'ha trobat {md_path}")
        sys.exit(1)

    print(f"=== Generant PDF per {slug} ({lang}) ===")
    md_text = md_path.read_text(encoding="utf-8")
    print(f"  → Parsejant Markdown...")
    report = parse_md_to_reportblock(md_text, lang)
    print(f"  ✓ {len(report.get('dadesClau', []))} dades clau, {len(report.get('accions', []))} accions")

    print(f"  → Generant HTML...")
    html = generate_html(report)

    pdf_path = REVISATS_DIR / f"{slug}.{lang}.pdf"
    print(f"  → Convertint a PDF...")
    html_to_pdf(html, pdf_path)
    print(f"  ✓ PDF generat: {pdf_path} ({pdf_path.stat().st_size/1024:.1f} KB)")


if __name__ == "__main__":
    main()
