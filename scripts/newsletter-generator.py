"""
Genera DUES versions de la newsletter Criteri ESG (Premium + Free) i les puja a Drive.

Diferències vs versió anterior:
1. Aplica disseny coherent amb DESIGN_SYSTEM.md (web)
2. Estructura d'apartats redissenyada (veure REFLEXIO-NEWSLETTER.md)
3. Genera dues versions: premium.html (completa) i free.html (reduïda)
4. Pujada a Drive /Criteri ESG/newsletters/

Ús:
    scripts/.venv/bin/python scripts/newsletter-generator.py [edition_number]
"""
import os
import sys
import json
import re
from pathlib import Path

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from dotenv import load_dotenv
load_dotenv(Path("/home/z/my-project/criteri-esg-lab/assets/web/.env.local"))

from beehiiv_client import create_draft, PUBLICATION_ID
from drive_user_client import get_user_drive_service, get_criteri_subfolder_id, upload_file


# === CSS compartida (basada en DESIGN_SYSTEM.md) ===
# Tokens idèntics als de la web per coherència visual
CSS = """
  /* Reset mínim per email */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F5EFE6;  /* --background */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #2C1810;  /* --foreground */
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
  }
  /* Container ampliat: 680px, padding intern mínim per aprofitar espai */
  .container {
    max-width: 680px;
    margin: 0 auto;
    padding: 0;
  }
  /* Seccions full-width dins del container (marró fort a les vores) */
  .section-full {
    padding: 28px 32px;
  }
  .section-narrow {
    padding: 0 32px;
  }

  /* === Tipografia === */
  .serif { font-family: 'Fraunces', Georgia, serif; }
  .mono { font-family: 'JetBrains Mono', 'Courier New', monospace; }

  /* Eyebrow (.eyebrow del DESIGN_SYSTEM) */
  .eyebrow {
    font-family: 'Inter', sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #8A5526;  /* --accent-deep */
  }

  /* Rule accent (filet coure 48px) */
  .rule-accent { height: 2px; background: #B87333; border: none; width: 48px; margin: 12px 0; }
  .rule { height: 1px; background: #C9B89A; border: none; width: 100%; margin: 16px 0; }

  /* === Masthead === */
  .masthead {
    padding-bottom: 12px;
    border-bottom: 2px solid #2C1810;
    margin-bottom: 24px;
  }
  .masthead-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 8px;
  }
  .masthead-brand {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 24px;
    font-weight: 700;
    color: #2C1810;
    letter-spacing: -0.02em;
  }
  .masthead-brand .dot { color: #B87333; }
  .masthead-tagline {
    font-family: 'Fraunces', serif;
    font-size: 12px;
    font-style: italic;
    color: #5C3A1E;
    margin-left: 8px;
    font-weight: 400;
  }
  .masthead-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #5C3A1E;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }
  .masthead-meta strong { color: #B87333; font-weight: 600; }

  /* === Editorial d'obertura (terra clara amb filet coure) === */
  .editorial-open {
    padding: 22px 24px;
    background: #FFFFFF;
    color: #2C1810;
    border-left: 3px solid #B87333;
    border-radius: 0 4px 4px 0;
    margin-bottom: 24px;
  }
  .editorial-open-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8A5526;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .editorial-open-text {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 15px;
    line-height: 1.6;
    color: #2C1810;
  }
  .editorial-open-sign {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8B7355;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-top: 10px;
  }

  /* === Section header (anatomia canònica) === */
  .section-header {
    margin: 24px 0 14px 0;
  }
  .section-header h2 {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 600;
    color: #2C1810;
    line-height: 1.2;
    margin-top: 4px;
  }
  .section-subtitle {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 14px;
    color: #5C3A1E;
    margin-top: 8px;
  }

  /* === Hero / Informe destacat (MARRÓ FORT com hero homepage) === */
  .hero {
    padding: 32px 24px;
    background: #2C1810;
    color: #F5EFE6;
    border-bottom: 4px solid #B87333;
    border-radius: 4px;
    margin-bottom: 24px;
  }
  .hero-eyebrow {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #2C1810;
    background: #D9A574;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    padding: 4px 12px;
    margin-bottom: 14px;
  }
  .hero-title {
    font-family: 'Fraunces', serif;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.1;
    color: #F5EFE6;
    margin-bottom: 14px;
    letter-spacing: -0.018em;
  }
  .hero-title em { font-style: italic; color: #D9A574; font-weight: 500; }
  .hero-deck {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-style: italic;
    line-height: 1.5;
    color: rgba(245, 239, 230, 0.75);
    margin-bottom: 18px;
  }
  .hero-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(245, 239, 230, 0.6);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .hero-meta .sep { color: rgba(217, 165, 116, 0.5); margin: 0 8px; }
  .hero-meta strong { color: #D9A574; }

  /* Semàfor inline a l'hero (sobre marró fort) */
  .semafor-inline {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 18px;
    padding: 12px 16px;
    background: rgba(245, 239, 230, 0.06);
    border-left: 3px solid #B87333;
    border-radius: 0 4px 4px 0;
  }
  .semafor-grade {
    font-family: 'Fraunces', serif;
    font-size: 26px;
    font-weight: 700;
    color: #D9A574;
  }
  .semafor-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #D9A574;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-weight: 600;
  }
  .semafor-dots {
    display: flex;
    gap: 6px;
    margin-left: auto;
  }
  .semafor-dot {
    width: 12px; height: 12px; border-radius: 50%;
  }
  .semafor-dot.verd { background: #5C8A5C; }
  .semafor-dot.groc { background: #C9A961; }
  .semafor-dot.vermell { background: #A0522D; }

  /* === Articles secundaris (grid 3 col, igual que reports-preview) === */
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 14px 0 24px 0;
  }
  @media (max-width: 540px) { .articles-grid { grid-template-columns: 1fr; } }
  .article-card {
    background: #FFFFFF;
    border: 1px solid #C9B89A;
    border-top: 2px solid #B87333;
    border-radius: 4px;
    padding: 14px;
    transition: border-color 0.2s;
  }
  .article-source {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #8A5526;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    margin-bottom: 6px;
    font-weight: 600;
  }
  .article-title {
    font-family: 'Fraunces', serif;
    font-size: 15px;
    font-weight: 600;
    color: #2C1810;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .article-summary {
    font-size: 12px;
    color: #2C1810;
    line-height: 1.5;
    margin-bottom: 10px;
    opacity: 0.85;
  }
  .article-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #B87333;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 600;
  }
  .article-xref {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #8B7355;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #E5DDD0;
  }
  .article-xref strong { color: #8A5526; }

  /* === Connexió de la setmana === */
  .connection-week {
    background: #2C1810;
    color: #F5EFE6;
    padding: 24px;
    border-radius: 4px;
    margin: 24px 0;
  }
  .connection-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #D9A574;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    margin-bottom: 12px;
  }
  .connection-title {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    font-weight: 600;
    color: #F5EFE6;
    margin-bottom: 14px;
    line-height: 1.25;
  }
  .connection-body {
    font-size: 14px;
    line-height: 1.65;
    color: rgba(245, 239, 230, 0.9);
    margin-bottom: 12px;
  }
  .connection-body strong { color: #D9A574; }

  /* === Més enllà del Checkbox (diferencial competitiu) === */
  .mes-enlla {
    background: rgba(184, 115, 51, 0.10);
    border: 1px solid #B87333;
    border-radius: 4px;
    padding: 20px;
    margin: 24px 0;
  }
  .mes-enlla-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #B87333;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .mes-enlla-criteri {
    font-family: 'Fraunces', serif;
    font-size: 13px;
    font-style: italic;
    color: #5C3A1E;
    margin-bottom: 10px;
  }
  .mes-enlla-body {
    font-size: 14px;
    line-height: 1.65;
    color: #2C1810;
  }
  .mes-enlla-body strong { color: #B87333; }

  /* === Acció recomanada (MARRÓ FORT amb detall verd, com a la web) === */
  .accio {
    background: #2C1810;
    color: #F5EFE6;
    border-left: 4px solid #5C8A5C;
    border-radius: 4px;
    padding: 22px 24px;
    margin: 24px 0;
  }
  .accio-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #5C8A5C;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .accio-title {
    font-family: 'Fraunces', serif;
    font-size: 18px;
    font-weight: 600;
    color: #F5EFE6;
    margin-bottom: 10px;
    line-height: 1.3;
  }
  .accio-desc {
    font-size: 13px;
    color: rgba(245, 239, 230, 0.85);
    line-height: 1.6;
  }
  .accio-tags {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
  .accio-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    padding: 3px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
  .tag-esforc-baix { background: rgba(92, 138, 92, 0.20); color: #7FB47F; }
  .tag-esforc-mitja { background: rgba(201, 169, 97, 0.25); color: #D9A574; }
  .tag-esforc-alt { background: rgba(160, 82, 45, 0.30); color: #C9704F; }

  /* === CTA Premium (coure fort amb botó blanc, com a la web) === */
  .cta-block {
    background: #B87333;
    color: #FFFFFF;
    padding: 28px 24px;
    border-radius: 4px;
    margin: 24px 0;
    text-align: center;
  }
  .cta-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.75);
    text-transform: uppercase;
    letter-spacing: 0.3em;
    font-weight: 600;
    margin-bottom: 12px;
  }
  .cta-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 500;
    color: #FFFFFF;
    margin-bottom: 12px;
    line-height: 1.25;
    letter-spacing: -0.015em;
  }
  .cta-title em { font-style: italic; color: #2C1810; font-weight: 500; }
  .cta-text {
    font-family: 'Fraunces', serif;
    font-style: italic;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.5;
    margin-bottom: 20px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }
  .cta-button {
    display: inline-block;
    background: #FFFFFF;
    color: #B87333;
    padding: 14px 28px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    border-radius: 2px;
  }

  /* === Lock per versió Free (els apartats Premium bloquejats) === */
  .locked-section {
    background: rgba(139, 115, 85, 0.08);
    border: 1px dashed #C9B89A;
    border-radius: 4px;
    padding: 20px;
    margin: 24px 0;
    text-align: center;
  }
  .locked-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8B7355;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .locked-title {
    font-family: 'Fraunces', serif;
    font-size: 17px;
    font-style: italic;
    color: #5C3A1E;
    margin-bottom: 8px;
    line-height: 1.4;
  }
  .locked-desc {
    font-size: 12px;
    color: #8B7355;
    margin-bottom: 14px;
    line-height: 1.5;
  }
  .locked-cta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #B87333;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 700;
  }

  /* === Footer (MARRÓ FORT com footer web) === */
  .news-footer {
    text-align: center;
    padding: 28px 20px;
    background: #2C1810;
    color: rgba(245, 239, 230, 0.7);
    border-radius: 4px;
    margin-top: 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
  }
  .news-footer-brand {
    font-family: 'Fraunces', serif;
    font-size: 20px;
    color: #F5EFE6;
    font-weight: 600;
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }
  .news-footer-brand .dot { color: #D9A574; }
  .news-footer-meta a { color: #D9A574; text-decoration: none; }
  .news-footer-meta a:hover { text-decoration: underline; }
"""


def render_articles(articles: list) -> str:
    """Renderitza els articles secundaris amb cross-reference (table-based per email)."""
    html = ""
    for a in articles[:3]:
        xref_html = ""
        if a.get("xref"):
            xref_html = f'<tr><td style="padding-top:8px;border-top:1px solid #E5DDD0;font-family:\'JetBrains Mono\',monospace;font-size:9px;color:#8B7355;text-transform:uppercase;letter-spacing:0.1em;">↔ <strong style="color:#8A5526;">Cross-ref:</strong> {a["xref"]}</td></tr>'
        html += f"""
      <td valign="top" width="33%" style="padding:14px;background:#FFFFFF;border:1px solid #C9B89A;border-top:2px solid #B87333;border-radius:4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#8A5526;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;margin-bottom:6px;padding-bottom:6px;">{a['source']}</td></tr>
          <tr><td style="font-family:'Fraunces',Georgia,serif;font-size:15px;font-weight:600;color:#2C1810;line-height:1.3;padding-bottom:8px;">{a['title']}</td></tr>
          <tr><td style="font-size:12px;color:#2C1810;line-height:1.5;padding-bottom:10px;opacity:0.85;">{a['summary']}</td></tr>
          <tr><td><a href="{a.get('url', '#')}" style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#B87333;text-decoration:none;text-transform:uppercase;letter-spacing:0.12em;font-weight:600;">Llegir resum complet →</a></td></tr>
          {xref_html}
        </table>
      </td>"""
    return html


def render_articles_table(articles: list) -> str:
    """Envoltori table-based pels 3 articles (grid 3 col → table 3 col)."""
    cells = render_articles(articles)
    # Per mobile: cada article en una fila (table responsive)
    return f"""
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:14px 0;">
      <tr>{cells}</tr>
    </table>
    <!--[if mso]></td></tr></table><![endif]-->"""


def render_semafor_dots(statuses: list) -> str:
    """Renderitza els 5 punts del semàfor (table-based)."""
    html = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-left:auto;"><tr>'
    color_map = {"verd": "#5C8A5C", "groc": "#C9A961", "vermell": "#A0522D"}
    for s in statuses:
        color = color_map.get(s, "#C9A961")
        html += f'<td style="padding:0 3px;"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:{color};"></span></td>'
    html += '</tr></table>'
    return html


def build_premium_html(data: dict) -> str:
    """Construeix l'HTML de la versió Premium (completa).
    HTML 100% table-based + inline CSS per compatibilitat màxima amb Gmail, Outlook, Hotmail.
    """
    edition = data["edition"]
    date = data["date"]
    lang = data["lang"]

    hero = data["hero"]
    articles = data["secondary_articles"]
    connection = data["connection_week"]
    mes_enlla = data["mes_enlla_checkbox"]
    accio = data["accio_recomanada"]

    # Color per esforç/impacte
    def tag_color(val):
        v = val.lower()
        if "baix" in v: return "#5C8A5C"
        if "mitj" in v: return "#8a7340"
        return "#A0522D"
    def tag_bg(val):
        v = val.lower()
        if "baix" in v: return "rgba(92,138,92,0.20)"
        if "mitj" in v: return "rgba(201,169,97,0.25)"
        return "rgba(160,82,45,0.30)"

    return f"""<!DOCTYPE html>
<html lang="{lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Criteri ESG — Newsletter #{edition} (Premium)</title>
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  /* Reset mínim per clients de correu */
  body {{ margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
  table {{ border-collapse: collapse; }}
  img {{ border: 0; max-width: 100%; height: auto; display: block; }}
  a {{ text-decoration: none; }}
  /* Responsive: a mobile, les taules s'adapten */
  @media only screen and (max-width: 600px) {{
    .container {{ width: 100% !important; }}
    .articles-row td {{ display: block !important; width: 100% !important; box-sizing: border-box; padding-bottom: 14px; }}
    .hero-title {{ font-size: 22px !important; }}
    .connection-title {{ font-size: 17px !important; }}
  }}
</style>
</head>
<body style="margin:0;padding:0;background:#F5EFE6;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#2C1810;line-height:1.5;">

<!-- Wrapper outer table (fons terra) -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5EFE6;">
<tr><td align="center" style="padding:0;">

<!-- Container 680px -->
<table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" class="container" style="width:680px;max-width:680px;background:#F5EFE6;">

  <!-- ============ MASTHEAD (apilat verticalment, una sola columna) ============ -->
  <tr>
    <td style="background:#F5EFE6;padding:28px 32px 20px 32px;border-bottom:2px solid #2C1810;">
      <!-- Fila 1: Logo Criteri. ESG (centrat) -->
      <p style="font-family:'Fraunces',Georgia,serif;font-size:28px;font-weight:700;color:#2C1810;letter-spacing:-0.02em;margin:0 0 6px 0;text-align:center;white-space:nowrap;">
        Criteri<span style="color:#B87333;">.</span>&nbsp;ESG
      </p>
      <!-- Fila 2: Tagline (centrat) -->
      <p style="font-family:'Fraunces',serif;font-size:13px;font-style:italic;color:#5C3A1E;font-weight:400;margin:0 0 10px 0;text-align:center;">
        Intel·ligència ESG per a decisions ètiques
      </p>
      <!-- Fila 3: Meta (centrada) -->
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#5C3A1E;text-transform:uppercase;letter-spacing:0.16em;margin:0;text-align:center;">
        <strong style="color:#B87333;font-weight:600;">EDICIÓ #{edition}</strong> · {date} · BARCELONA · PREMIUM
      </p>
    </td>
  </tr>

  <!-- ============ EDITORIAL D'OBERTURA (card blanca amb filet coure) ============ -->
  <tr><td style="padding:24px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-left:3px solid #B87333;border-radius:0 4px 4px 0;">
      <tr><td style="padding:22px 24px;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8A5526;text-transform:uppercase;letter-spacing:0.18em;font-weight:600;margin:0 0 10px 0;">▸ Editorial</p>
        <p style="font-family:'Fraunces',serif;font-style:italic;font-size:15px;line-height:1.6;color:#2C1810;margin:0;">{data['editorial_open']}</p>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8B7355;text-transform:uppercase;letter-spacing:0.14em;margin:10px 0 0 0;">— Paolo, Criteri ESG</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============ SECTION HEADER: Informe destacat ============ -->
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Informe destacat</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>

  <!-- ============ HERO (marró fort full-width) ============ -->
  <tr>
    <td style="background:#2C1810;color:#F5EFE6;padding:32px 32px;border-bottom:4px solid #B87333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td>
          <p style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:#2C1810;background:#D9A574;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;padding:4px 12px;margin:0 0 14px 0;">▸ {hero['source']}</p>
        </td></tr>
        <tr><td style="font-family:'Fraunces',serif;font-size:28px;font-weight:500;line-height:1.1;color:#F5EFE6;margin:0 0 14px 0;letter-spacing:-0.018em;padding-bottom:14px;" class="hero-title">
          {hero['title']}
        </td></tr>
        <tr><td style="font-family:'Fraunces',serif;font-size:15px;font-style:italic;line-height:1.5;color:rgba(245,239,230,0.75);padding-bottom:18px;">
          {hero['deck']}
        </td></tr>
        <tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(245,239,230,0.6);text-transform:uppercase;letter-spacing:0.12em;padding-bottom:18px;">
          <strong style="color:#D9A574;">Sintetitzat per</strong> Criteri ESG · {hero['read_time']} minuts de lectura · {hero['pages']} pàgines originals
        </td></tr>
        <!-- Semàfor inline -->
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(245,239,230,0.06);border-left:3px solid #B87333;border-radius:0 4px 4px 0;">
            <tr><td style="padding:12px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:#D9A574;vertical-align:middle;">{hero['semafor_grade']}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D9A574;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;vertical-align:middle;padding-left:12px;">{hero['semafor_label']}</td>
                <td align="right" style="vertical-align:middle;">
                  {render_semafor_dots(hero['semafor_statuses'])}
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- ============ SECTION HEADER + ARTICLES (3 col table) ============ -->
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 4px 0;">També aquesta setmana</p>
    <p style="font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#2C1810;margin:4px 0 8px 0;">Informes que has de conèixer</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>
  <tr><td style="padding:14px 32px 24px 32px;">
    <!--[if mso]><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><![endif]-->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="articles-row" style="border-collapse:separate;border-spacing:7px 0;">
      <tr>{render_articles(articles)}</tr>
    </table>
  </td></tr>

  <!-- ============ SECTION HEADER: Connexió de la setmana ============ -->
  <tr><td style="padding:0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Connexió de la setmana</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>

  <!-- ============ CONNEXIÓ SETMANA (marró fort full-width) ============ -->
  <tr>
    <td style="background:#2C1810;color:#F5EFE6;padding:24px 32px;">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D9A574;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;margin:0 0 12px 0;">◆ Anàlisi transversal</p>
      <p style="font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#F5EFE6;margin:0 0 14px 0;line-height:1.25;" class="connection-title">{connection['title']}</p>
      <p style="font-size:14px;line-height:1.65;color:rgba(245,239,230,0.9);margin:0 0 12px 0;">{connection['body_1']}</p>
      <p style="font-size:14px;line-height:1.65;color:rgba(245,239,230,0.9);margin:0;">{connection['body_2']}</p>
    </td>
  </tr>

  <!-- ============ SECTION HEADER: Més enllà del Checkbox ============ -->
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Més enllà del Checkbox</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>

  <!-- ============ MÉS ENLLÀ DEL CHECKBOX (coure suau) ============ -->
  <tr><td style="padding:14px 32px 24px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(184,115,51,0.10);border:1px solid #B87333;border-radius:4px;">
      <tr><td style="padding:20px;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#B87333;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;margin:0 0 8px 0;">◆ Lens ètica Criteri</p>
        <p style="font-family:'Fraunces',serif;font-size:13px;font-style:italic;color:#5C3A1E;margin:0 0 10px 0;">Criteri aplicat: <strong style="color:#2C1810;">{mes_enlla['criteri']}</strong></p>
        <p style="font-size:14px;line-height:1.65;color:#2C1810;margin:0;">{mes_enlla['body']}</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- ============ SECTION HEADER: Acció recomanada ============ -->
  <tr><td style="padding:0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Acció recomanada</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>

  <!-- ============ ACCIÓ RECOMANADA (marró fort amb vora verda) ============ -->
  <tr>
    <td style="background:#2C1810;color:#F5EFE6;border-left:4px solid #5C8A5C;padding:22px 32px;">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#5C8A5C;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;margin:0 0 10px 0;">▸ Operativa per a aquesta setmana</p>
      <p style="font-family:'Fraunces',serif;font-size:18px;font-weight:600;color:#F5EFE6;margin:0 0 10px 0;line-height:1.3;">{accio['title']}</p>
      <p style="font-size:13px;color:rgba(245,239,230,0.85);line-height:1.6;margin:0 0 12px 0;">{accio['desc']}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background:{tag_bg(accio['effort'])};font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 8px;border-radius:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;color:{tag_color(accio['effort'])};">Esforç: {accio['effort']}</td>
        <td style="width:8px;">&nbsp;</td>
        <td style="background:{tag_bg(accio['impact'])};font-family:'JetBrains Mono',monospace;font-size:9px;padding:3px 8px;border-radius:8px;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;color:{tag_color(accio['impact'])};">Impacte: {accio['impact']}</td>
      </tr></table>
    </td>
  </tr>

  <!-- ============ CTA PREMIUM (coure fort) ============ -->
  <tr>
    <td style="background:#B87333;color:#FFFFFF;padding:28px 32px;text-align:center;">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.3em;font-weight:600;margin:0 0 12px 0;">▸ Criteri ESG</p>
      <p style="font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:#FFFFFF;margin:0 0 12px 0;line-height:1.25;letter-spacing:-0.015em;">Criteri només funciona <em style="font-style:italic;color:#2C1810;font-weight:500;">si es comparteix</em></p>
      <p style="font-family:'Fraunces',serif;font-style:italic;font-size:14px;color:rgba(255,255,255,0.9);line-height:1.5;margin:0 0 20px 0;">Si aquesta newsletter t'ha estat útil, comparteix-la amb un company que treballi en sostenibilitat. Cada subscriptor ens ajuda a mantenir la veu editorial independent.</p>
      <a href="https://criteriesg.com" style="display:inline-block;background:#FFFFFF;color:#B87333;padding:14px 28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:0.14em;border-radius:2px;">Comparteix Criteri ESG →</a>
    </td>
  </tr>

  <!-- ============ FOOTER (marró fort full-width) ============ -->
  <tr>
    <td style="background:#2C1810;color:rgba(245,239,230,0.7);padding:28px 32px;text-align:center;">
      <p style="font-family:'Fraunces',serif;font-size:20px;color:#F5EFE6;font-weight:600;margin:0 0 10px 0;letter-spacing:-0.01em;">Criteri<span style="color:#D9A574;">.</span> ESG</p>
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(245,239,230,0.7);margin:0;">
        <a href="https://criteriesg.com" style="color:#D9A574;text-decoration:none;">criteriesg.com</a> · Barcelona · Rep aquesta newsletter perquè ets subscriptor Premium · <a href="{{{{UNSUBSCRIBE_URL}}}}" style="color:#D9A574;text-decoration:none;">Cancel·lar</a> · <a href="{{{{PREFERENCES_URL}}}}" style="color:#D9A574;text-decoration:none;">Preferències</a>
      </p>
    </td>
  </tr>

</table>
<!-- /Container -->

</td></tr>
</table>
<!-- /Wrapper -->

</body>
</html>"""


def build_free_html(data: dict) -> str:
    """Construeix l'HTML de la versió Free (reduïda).
    HTML 100% table-based + inline CSS.
    Manté: masthead, editorial obertura, hero, articles secundaris.
    Bloqueja: connexió setmana, més enllà checkbox, acció recomanada.
    """
    edition = data["edition"]
    date = data["date"]
    lang = data["lang"]

    hero = data["hero"]
    articles = data["secondary_articles"]
    connection = data["connection_week"]
    mes_enlla = data["mes_enlla_checkbox"]

    # Helper per locked sections
    def locked_section(title: str, desc: str) -> str:
        return f"""
  <tr><td style="padding:14px 32px 24px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(139,115,85,0.08);border:1px dashed #C9B89A;border-radius:4px;">
      <tr><td style="padding:20px;text-align:center;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8B7355;text-transform:uppercase;letter-spacing:0.18em;font-weight:600;margin:0 0 8px 0;">◆ Contingut Premium</p>
        <p style="font-family:'Fraunces',serif;font-size:17px;font-style:italic;color:#5C3A1E;margin:0 0 8px 0;line-height:1.4;">{title}</p>
        <p style="font-size:12px;color:#8B7355;margin:0 0 14px 0;line-height:1.5;">{desc}</p>
        <a href="https://criteriesg.com/preus" style="font-family:'JetBrains Mono',monospace;font-size:11px;color:#B87333;text-decoration:none;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;">Desbloqueja amb Premium →</a>
      </td></tr>
    </table>
  </td></tr>"""

    return f"""<!DOCTYPE html>
<html lang="{lang}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Criteri ESG — Newsletter #{edition}</title>
<!--[if mso]>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
<![endif]-->
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  body {{ margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }}
  table {{ border-collapse: collapse; }}
  img {{ border: 0; max-width: 100%; height: auto; display: block; }}
  a {{ text-decoration: none; }}
  @media only screen and (max-width: 600px) {{
    .container {{ width: 100% !important; }}
    .articles-row td {{ display: block !important; width: 100% !important; box-sizing: border-box; padding-bottom: 14px; }}
    .hero-title {{ font-size: 22px !important; }}
  }}
</style>
</head>
<body style="margin:0;padding:0;background:#F5EFE6;font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;color:#2C1810;line-height:1.5;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F5EFE6;">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="680" cellpadding="0" cellspacing="0" border="0" class="container" style="width:680px;max-width:680px;background:#F5EFE6;">

  <!-- MASTHEAD (apilat verticalment, una sola columna) -->
  <tr>
    <td style="background:#F5EFE6;padding:28px 32px 20px 32px;border-bottom:2px solid #2C1810;">
      <p style="font-family:'Fraunces',Georgia,serif;font-size:28px;font-weight:700;color:#2C1810;letter-spacing:-0.02em;margin:0 0 6px 0;text-align:center;white-space:nowrap;">
        Criteri<span style="color:#B87333;">.</span>&nbsp;ESG
      </p>
      <p style="font-family:'Fraunces',serif;font-size:13px;font-style:italic;color:#5C3A1E;font-weight:400;margin:0 0 10px 0;text-align:center;">
        Intel·ligència ESG per a decisions ètiques
      </p>
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#5C3A1E;text-transform:uppercase;letter-spacing:0.16em;margin:0;text-align:center;">
        <strong style="color:#B87333;font-weight:600;">EDICIÓ #{edition}</strong> · {date} · BARCELONA
      </p>
    </td>
  </tr>

  <!-- EDITORIAL D'OBERTURA -->
  <tr><td style="padding:24px 32px 0 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-left:3px solid #B87333;border-radius:0 4px 4px 0;">
      <tr><td style="padding:22px 24px;">
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8A5526;text-transform:uppercase;letter-spacing:0.18em;font-weight:600;margin:0 0 10px 0;">▸ Editorial</p>
        <p style="font-family:'Fraunces',serif;font-style:italic;font-size:15px;line-height:1.6;color:#2C1810;margin:0;">{data['editorial_open']}</p>
        <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#8B7355;text-transform:uppercase;letter-spacing:0.14em;margin:10px 0 0 0;">— Paolo, Criteri ESG</p>
      </td></tr>
    </table>
  </td></tr>

  <!-- SECTION HEADER: Informe destacat -->
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Informe destacat</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>

  <!-- HERO -->
  <tr>
    <td style="background:#2C1810;color:#F5EFE6;padding:32px 32px;border-bottom:4px solid #B87333;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td>
          <p style="display:inline-block;font-family:'JetBrains Mono',monospace;font-size:10px;color:#2C1810;background:#D9A574;text-transform:uppercase;letter-spacing:0.18em;font-weight:700;padding:4px 12px;margin:0 0 14px 0;">▸ {hero['source']}</p>
        </td></tr>
        <tr><td style="font-family:'Fraunces',serif;font-size:28px;font-weight:500;line-height:1.1;color:#F5EFE6;letter-spacing:-0.018em;padding-bottom:14px;" class="hero-title">
          {hero['title']}
        </td></tr>
        <tr><td style="font-family:'Fraunces',serif;font-size:15px;font-style:italic;line-height:1.5;color:rgba(245,239,230,0.75);padding-bottom:18px;">
          {hero['deck']}
        </td></tr>
        <tr><td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(245,239,230,0.6);text-transform:uppercase;letter-spacing:0.12em;padding-bottom:18px;">
          <strong style="color:#D9A574;">Sintetitzat per</strong> Criteri ESG · {hero['read_time']} minuts de lectura · {hero['pages']} pàgines originals
        </td></tr>
        <tr><td>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(245,239,230,0.06);border-left:3px solid #B87333;border-radius:0 4px 4px 0;">
            <tr><td style="padding:12px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                <td style="font-family:'Fraunces',serif;font-size:26px;font-weight:700;color:#D9A574;vertical-align:middle;">{hero['semafor_grade']}</td>
                <td style="font-family:'JetBrains Mono',monospace;font-size:10px;color:#D9A574;text-transform:uppercase;letter-spacing:0.14em;font-weight:600;vertical-align:middle;padding-left:12px;">{hero['semafor_label']}</td>
                <td align="right" style="vertical-align:middle;">
                  {render_semafor_dots(hero['semafor_statuses'])}
                </td>
              </tr></table>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- SECTION HEADER + ARTICLES -->
  <tr><td style="padding:24px 32px 0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 4px 0;">També aquesta setmana</p>
    <p style="font-family:'Fraunces',serif;font-size:22px;font-weight:600;color:#2C1810;margin:4px 0 8px 0;">Informes que has de conèixer</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>
  <tr><td style="padding:14px 32px 24px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="articles-row" style="border-collapse:separate;border-spacing:7px 0;">
      <tr>{render_articles(articles)}</tr>
    </table>
  </td></tr>

  <!-- CONNEXIÓ DE LA SETMANA (LOCKED) -->
  <tr><td style="padding:0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Connexió de la setmana</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>
  {locked_section(connection['title'], "Criteri ESG creua els informes d'aquesta setmana per identificar patrons i riscos transversals. La connexió d'aquesta setmana relaciona els 4 informes destacats amb el marc regulador europeu.")}

  <!-- MÉS ENLLÀ DEL CHECKBOX (LOCKED) -->
  <tr><td style="padding:0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Més enllà del Checkbox</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>
  {locked_section(f"Anàlisi ètica: {mes_enlla['criteri']}", "Criteri ESG aplica un dels 5 criteris ètics propis (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament) a un dels informes de la setmana. Una lent diferent dels marcs ESG anglosaxons.")}

  <!-- ACCIÓ RECOMANADA (LOCKED) -->
  <tr><td style="padding:0 32px;">
    <p style="font-family:'Inter',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:#8A5526;margin:0 0 8px 0;">Acció recomanada</p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:48px;height:2px;background:#B87333;"><tr><td style="font-size:0;line-height:0;">&nbsp;</td></tr></table>
  </td></tr>
  {locked_section("Una acció operativa per aquesta setmana", "Cada setmana, Criteri ESG extreu una acció concreta dels informes sintetitzats. Esforç i impacte estimats per ajudar-te a prioritzar.")}

  <!-- CTA PREMIUM FINAL -->
  <tr>
    <td style="background:#B87333;color:#FFFFFF;padding:28px 32px;text-align:center;">
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(255,255,255,0.75);text-transform:uppercase;letter-spacing:0.3em;font-weight:600;margin:0 0 12px 0;">▸ Fes-te Premium</p>
      <p style="font-family:'Fraunces',serif;font-size:22px;font-weight:500;color:#FFFFFF;margin:0 0 12px 0;line-height:1.25;letter-spacing:-0.015em;">290€/any per <em style="font-style:italic;color:#2C1810;font-weight:500;">criteri clar</em> cada setmana</p>
      <p style="font-family:'Fraunces',serif;font-style:italic;font-size:14px;color:rgba(255,255,255,0.9);line-height:1.5;margin:0 0 20px 0;">Accés als informes complets, cross-reference amb EcoVadis/B Corp/MSCI/GRI, accions recomanades, connexions setmanals i la lent ètica "Més enllà del Checkbox". 50 places early bird disponibles.</p>
      <a href="https://criteriesg.com/preus" style="display:inline-block;background:#FFFFFF;color:#B87333;padding:14px 28px;font-family:'JetBrains Mono',monospace;font-size:12px;font-weight:700;text-decoration:none;text-transform:uppercase;letter-spacing:0.14em;border-radius:2px;">Veure preus →</a>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="background:#2C1810;color:rgba(245,239,230,0.7);padding:28px 32px;text-align:center;">
      <p style="font-family:'Fraunces',serif;font-size:20px;color:#F5EFE6;font-weight:600;margin:0 0 10px 0;letter-spacing:-0.01em;">Criteri<span style="color:#D9A574;">.</span> ESG</p>
      <p style="font-family:'JetBrains Mono',monospace;font-size:10px;color:rgba(245,239,230,0.7);margin:0;">
        <a href="https://criteriesg.com" style="color:#D9A574;text-decoration:none;">criteriesg.com</a> · Barcelona · Rep aquesta newsletter perquè t'hi vas subscriure · <a href="{{{{UNSUBSCRIBE_URL}}}}" style="color:#D9A574;text-decoration:none;">Cancel·lar</a> · <a href="{{{{PREFERENCES_URL}}}}" style="color:#D9A574;text-decoration:none;">Preferències</a>
      </p>
    </td>
  </tr>

</table>

</td></tr>
</table>

</body>
</html>"""


# === Dades d'exemple per a la primera newsletter ===
# En producció, aquestes dades vindran de:
# - informes publicats (Drive /5-validats-paolo/)
# - cerca web per fonts ESG
# - redacció per GLM dels apartats editorials (editorial obertura, connexió, més enllà)

EXAMPLE_DATA = {
    "edition": "1",
    "date": "29 JULIOL 2026",
    "lang": "ca",
    "editorial_open": "Aquesta setmana la Comissió Europea ha simplificat el CSRD i l'ESMA ha publicat els seus principis contra el greenwashing. Tots dos moviments van en la mateixa direcció: menys càrrega administrativa, però més rigor en allò que es publica. La pregunta és si les empreses estaran a l'alçada.",
    "hero": {
        "source": "COMISSIÓ EUROPEA",
        "title": "La Comissió Europea <em>simplifica</em> el CSRD: 61% menys de datapoints obligatoris",
        "deck": "Un canvi que estalviarà 3.700 milions d'euros a les empreses europees en cinc anys, però que obliga a reinvertir l'estalvi en qualitat de dades per no perdre reputació davant certificacions com EcoVadis o MSCI.",
        "read_time": "5",
        "pages": "47",
        "semafor_grade": "C",
        "semafor_label": "Feble metodològicament",
        "semafor_statuses": ["groc", "groc", "verd", "vermell", "groc"],
    },
    "secondary_articles": [
        {
            "source": "ESMA",
            "title": "ESMA publica 4 principis contra greenwashing en fons ESG",
            "summary": "Els fons amb 'ESG' al nom han de tenir mínim 80% d'inversions alineades. Precisió, prova, comparabilitat i actualització són els 4 principis.",
            "url": "https://criteriesg.com/informes/esma-work-programme-2026",
            "xref": "ESMA → SFDR Article 8/9",
        },
        {
            "source": "EcoVadis",
            "title": "Actualització de criteris EcoVadis 2026",
            "summary": "Revisió anual amb canvis en Environment i Procurement. Les empreses que renoven al Q4 han d'adaptar la documentació.",
            "url": "https://criteriesg.com/informes/ecovadis-methodology-q1-2026",
            "xref": "EcoVadis → GRI Universal 2021",
        },
        {
            "source": "EFRAG",
            "title": "Esborrany ESRS S4 sobre drets humans",
            "summary": "Consulta pública sobre l'estàndard sectorial de drets humans a la cadena de subministrament. 47 pàgines, 18 requisits de disclosure. Termini: 15 gener 2027.",
            "url": "https://criteriesg.com/informes/efrag-work-programme-2026",
            "xref": "ESRS S4 → CSDDD due diligence",
        },
    ],
    "connection_week": {
        "title": "Simplificació CSRD + 4 principis ESMA + ESRS S4: el triangle regulador europeu es tanca",
        "body_1": "Aquesta setmana s'ha vist clarament com la regulació europea ESG es tanca en un triangle: <strong>menys dades obligatòries</strong> (revisió ESRS), <strong>més rigor en allò que es publica</strong> (principis ESMA), i <strong>més profunditat sectorial</strong> (ESRS S4 drets humans). Les empreses que s'ho mirin com a càrrega administrativa perdran; les que ho vegin com a oportunitat per estructurar la sostenibilitat, guanyaran.",
        "body_2": "El missatge operatiu: <strong>dedica menys recursos a recollir dades que no usaràs, i més a interpretar les que sí</strong>. La diferència competitiva ja no és qui té més dades, sinó qui les sap llegir.",
    },
    "mes_enlla_checkbox": {
        "criteri": "Justícia distributiva",
        "body": "La simplificació del CSRD reparteix els beneficis de manera asimètrica: les grans corporacions amb capacitat de lobbying guanyen alleugeriment; les comunitats afectades pels seus impactes perden informació verificable per exercir drets. Eliminar granularitat sectorial converteix la sostenibilitat en variable relativa ('miller que l'any passat') en lloc d'absoluta ('compatible amb els límits planetaris'). Sense referents absoluts, el reporting esdevé exercici de millora contínua sense sostre, insuficient per aturar la deterioració ecològica real.",
    },
    "accio_recomanada": {
        "title": "Audita la teva matriu de materialitat abans del tancament anual",
        "desc": "Identifica quins datapoints eliminats pel CSRD revisat eren realment materials per al teu sector i mantén-los de forma voluntària amb documentació interna. Així conservaràs la comparabilitat amb anys anteriors i la traçabilitat per a auditories EcoVadis i MSCI, que encara esperen granularitat.",
        "effort": "Mitjà",
        "impact": "Alt",
    },
}


def main():
    edition = sys.argv[1] if len(sys.argv) > 1 else "1"
    data = EXAMPLE_DATA
    data["edition"] = edition

    print(f"=== Generant newsletter #{edition} ===")
    print(f"Data: {data['date']}")
    print(f"Hero: {data['hero']['title'][:80]}...")
    print()

    # Generar versió Premium
    print("→ Generant versió Premium...")
    premium_html = build_premium_html(data)
    premium_path = Path(f"/home/z/my-project/criteri-esg-lab/data/newsletter-{edition}.premium.html")
    premium_path.parent.mkdir(parents=True, exist_ok=True)
    premium_path.write_text(premium_html, encoding="utf-8")
    print(f"  ✓ Premium: {premium_path.name} ({len(premium_html)/1024:.1f} KB)")

    # Generar versió Free
    print("→ Generant versió Free...")
    free_html = build_free_html(data)
    free_path = Path(f"/home/z/my-project/criteri-esg-lab/data/newsletter-{edition}.free.html")
    free_path.write_text(free_html, encoding="utf-8")
    print(f"  ✓ Free: {free_path.name} ({len(free_html)/1024:.1f} KB)")

    # Pujar ambdues a Drive /Criteri ESG/newsletters/
    print("\n→ Pujant a Drive /Criteri ESG/newsletters/...")
    try:
        drive = get_user_drive_service()
        newsletters_folder_id = get_criteri_subfolder_id(drive, "newsletters")
        upload_file(drive, premium_path, f"newsletter-{edition}.premium.html", newsletters_folder_id, mime_type="text/html")
        print(f"  ✓ newsletter-{edition}.premium.html pujat")
        upload_file(drive, free_path, f"newsletter-{edition}.free.html", newsletters_folder_id, mime_type="text/html")
        print(f"  ✓ newsletter-{edition}.free.html pujat")
    except Exception as e:
        print(f"  ⚠ Drive (no crític): {e}")

    # PDFs per preview local
    print("\n→ Generant PDFs de preview...")
    import subprocess
    for path in [premium_path, free_path]:
        pdf_path = path.with_suffix(".pdf")
        try:
            subprocess.run(["weasyprint", str(path), str(pdf_path)], capture_output=True, timeout=60)
            # Copiar a /download perquè Paolo els pugui veure
            dest = Path("/home/z/my-project/download") / pdf_path.name
            dest.parent.mkdir(parents=True, exist_ok=True)
            dest.write_bytes(pdf_path.read_bytes())
            print(f"  ✓ {pdf_path.name} ({pdf_path.stat().st_size/1024:.1f} KB)")
        except Exception as e:
            print(f"  ⚠ PDF {path.name}: {e}")

    print(f"\n=== Resum newsletter #{edition} ===")
    print(f"  Premium (completa): {len(premium_html)/1024:.1f} KB")
    print(f"  Free (reduïda):     {len(free_html)/1024:.1f} KB")
    print(f"  Diferència:         {(len(premium_html)-len(free_html))/1024:.1f} KB")
    print(f"\n→ Paolo: obre Beehiiv → New Post → HTML Snippet → enganxa l'HTML")
    print(f"  Crea 2 esborranys: un per a subscriptors Premium, un per a Free")


if __name__ == "__main__":
    main()
