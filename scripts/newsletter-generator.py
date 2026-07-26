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
  .container { max-width: 640px; margin: 0 auto; padding: 24px 20px; }

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
    """Renderitza els articles secundaris amb cross-reference."""
    html = ""
    for a in articles[:3]:
        xref_html = ""
        if a.get("xref"):
            xref_html = f'<div class="article-xref">↔ <strong>Cross-ref:</strong> {a["xref"]}</div>'
        html += f"""
    <div class="article-card">
      <div class="article-source">{a['source']}</div>
      <h3 class="article-title">{a['title']}</h3>
      <p class="article-summary">{a['summary']}</p>
      <a href="{a.get('url', '#')}" class="article-link">Llegir resum complet →</a>
      {xref_html}
    </div>"""
    return html


def render_semafor_dots(statuses: list) -> str:
    """Renderitza els 5 punts del semàfor."""
    html = '<div class="semafor-dots">'
    for s in statuses:
        html += f'<span class="semafor-dot {s}"></span>'
    html += '</div>'
    return html


def build_premium_html(data: dict) -> str:
    """Construeix l'HTML de la versió Premium (completa)."""
    edition = data["edition"]
    date = data["date"]
    lang = data["lang"]

    hero = data["hero"]
    articles = data["secondary_articles"]
    connection = data["connection_week"]
    mes_enlla = data["mes_enlla_checkbox"]
    accio = data["accio_recomanada"]

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Criteri ESG — Newsletter #{edition} (Premium)</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<div class="container">

  <!-- Masthead -->
  <div class="masthead">
    <div class="masthead-row">
      <div class="masthead-brand">Criteri<span class="dot">.</span> ESG<span class="masthead-tagline">Intel·ligència ESG per a decisions ètiques</span></div>
      <div class="masthead-meta">
        <strong>EDICIÓ #{edition}</strong> · {date} · BARCELONA · PREMIUM
      </div>
    </div>
  </div>

  <!-- Editorial d'obertura -->
  <div class="editorial-open">
    <div class="editorial-open-label">▸ Editorial</div>
    <p class="editorial-open-text">{data['editorial_open']}</p>
    <div class="editorial-open-sign">— Paolo, Criteri ESG</div>
  </div>

  <!-- Informe destacat -->
  <div class="section-header">
    <p class="eyebrow">Informe destacat</p>
    <hr class="rule-accent">
  </div>

  <div class="hero">
    <div class="hero-eyebrow">▸ {hero['source']}</div>
    <h1 class="hero-title">{hero['title']}</h1>
    <p class="hero-deck">{hero['deck']}</p>
    <div class="hero-meta">
      <span><strong>Sintetitzat per</strong> Criteri ESG</span>
      <span class="sep">·</span>
      <span>{hero['read_time']} minuts de lectura</span>
      <span class="sep">·</span>
      <span>{hero['pages']} pàgines originals</span>
    </div>
    <div class="semafor-inline">
      <span class="semafor-grade">{hero['semafor_grade']}</span>
      <span class="semafor-label">{hero['semafor_label']}</span>
      {render_semafor_dots(hero['semafor_statuses'])}
    </div>
  </div>

  <!-- També aquesta setmana -->
  <div class="section-header">
    <p class="eyebrow">També aquesta setmana</p>
    <h2 class="serif" style="font-size: 22px; font-weight: 600; color: #2C1810; margin-top: 4px;">Informes que has de conèixer</h2>
    <hr class="rule-accent">
  </div>

  <div class="articles-grid">
    {render_articles(articles)}
  </div>

  <!-- Connexió de la setmana -->
  <div class="section-header">
    <p class="eyebrow">Connexió de la setmana</p>
    <hr class="rule-accent">
  </div>

  <div class="connection-week">
    <div class="connection-eyebrow">◆ Anàlisi transversal</div>
    <h2 class="connection-title">{connection['title']}</h2>
    <p class="connection-body">{connection['body_1']}</p>
    <p class="connection-body">{connection['body_2']}</p>
  </div>

  <!-- Més enllà del Checkbox (diferencial) -->
  <div class="section-header">
    <p class="eyebrow">Més enllà del Checkbox</p>
    <hr class="rule-accent">
  </div>

  <div class="mes-enlla">
    <div class="mes-enlla-eyebrow">◆ Lens ètica Criteri</div>
    <p class="mes-enlla-criteri">Criteri aplicat: <strong>{mes_enlla['criteri']}</strong></p>
    <p class="mes-enlla-body">{mes_enlla['body']}</p>
  </div>

  <!-- Acció recomanada -->
  <div class="section-header">
    <p class="eyebrow">Acció recomanada</p>
    <hr class="rule-accent">
  </div>

  <div class="accio">
    <div class="accio-eyebrow">▸ Operativa per a aquesta setmana</div>
    <h3 class="accio-title">{accio['title']}</h3>
    <p class="accio-desc">{accio['desc']}</p>
    <div class="accio-tags">
      <span class="accio-tag tag-esforc-{accio['effort'].lower()}">Esforç: {accio['effort']}</span>
      <span class="accio-tag tag-esforc-{accio['impact'].lower()}">Impacte: {accio['impact']}</span>
    </div>
  </div>

  <!-- CTA Premium (a la versió Premium convida a convidar amics) -->
  <div class="cta-block">
    <div class="cta-eyebrow">▸ Criteri ESG</div>
    <h2 class="cta-title">Criteri només funciona <em>si es comparteix</em></h2>
    <p class="cta-text">Si aquesta newsletter t'ha estat útil, comparteix-la amb un company que treballi en sostenibilitat. Cada subscriptor ens ajuda a mantenir la veu editorial independent.</p>
    <a href="https://criteriesg.com" class="cta-button">Comparteix Criteri ESG →</a>
  </div>

  <!-- Footer -->
  <div class="news-footer">
    <div class="news-footer-brand">Criteri<span class="dot">.</span> ESG</div>
    <div class="news-footer-meta">
      <a href="https://criteriesg.com">criteriesg.com</a> · Barcelona · Rep aquesta newsletter perquè ets subscriptor Premium · <a href="{{{{UNSUBSCRIBE_URL}}}}">Cancel·lar</a> · <a href="{{{{PREFERENCES_URL}}}}">Preferències</a>
    </div>
  </div>

</div>
</body>
</html>"""


def build_free_html(data: dict) -> str:
    """Construeix l'HTML de la versió Free (reduïda).
    Manté: masthead, editorial obertura, hero, articles secundaris.
    Bloqueja: connexió setmana, més enllà checkbox, acció recomanada.
    Afegeix CTA Premium.
    """
    edition = data["edition"]
    date = data["date"]
    lang = data["lang"]

    hero = data["hero"]
    articles = data["secondary_articles"]
    connection = data["connection_week"]
    mes_enlla = data["mes_enlla_checkbox"]
    accio = data["accio_recomanada"]

    return f"""<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Criteri ESG — Newsletter #{edition}</title>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<div class="container">

  <!-- Masthead -->
  <div class="masthead">
    <div class="masthead-row">
      <div class="masthead-brand">Criteri<span class="dot">.</span> ESG<span class="masthead-tagline">Intel·ligència ESG per a decisions ètiques</span></div>
      <div class="masthead-meta">
        <strong>EDICIÓ #{edition}</strong> · {date} · BARCELONA
      </div>
    </div>
  </div>

  <!-- Editorial d'obertura -->
  <div class="editorial-open">
    <div class="editorial-open-label">▸ Editorial</div>
    <p class="editorial-open-text">{data['editorial_open']}</p>
    <div class="editorial-open-sign">— Paolo, Criteri ESG</div>
  </div>

  <!-- Informe destacat -->
  <div class="section-header">
    <p class="eyebrow">Informe destacat</p>
    <hr class="rule-accent">
  </div>

  <div class="hero">
    <div class="hero-eyebrow">▸ {hero['source']}</div>
    <h1 class="hero-title">{hero['title']}</h1>
    <p class="hero-deck">{hero['deck']}</p>
    <div class="hero-meta">
      <span><strong>Sintetitzat per</strong> Criteri ESG</span>
      <span class="sep">·</span>
      <span>{hero['read_time']} minuts de lectura</span>
      <span class="sep">·</span>
      <span>{hero['pages']} pàgines originals</span>
    </div>
    <div class="semafor-inline">
      <span class="semafor-grade">{hero['semafor_grade']}</span>
      <span class="semafor-label">{hero['semafor_label']}</span>
      {render_semafor_dots(hero['semafor_statuses'])}
    </div>
  </div>

  <!-- També aquesta setmana -->
  <div class="section-header">
    <p class="eyebrow">També aquesta setmana</p>
    <h2 class="serif" style="font-size: 22px; font-weight: 600; color: #2C1810; margin-top: 4px;">Informes que has de conèixer</h2>
    <hr class="rule-accent">
  </div>

  <div class="articles-grid">
    {render_articles(articles)}
  </div>

  <!-- Connexió de la setmana (LOCKED) -->
  <div class="section-header">
    <p class="eyebrow">Connexió de la setmana</p>
    <hr class="rule-accent">
  </div>

  <div class="locked-section">
    <div class="locked-label">◆ Contingut Premium</div>
    <p class="locked-title">{connection['title']}</p>
    <p class="locked-desc">Criteri ESG creua els informes d'aquesta setmana per identificar patrons i riscos transversals. La connexió d'aquesta setmana relaciona els 4 informes destacats amb el marc regulador europeu.</p>
    <a href="https://criteriesg.com/preus" class="locked-cta">Desbloqueja amb Premium →</a>
  </div>

  <!-- Més enllà del Checkbox (LOCKED) -->
  <div class="section-header">
    <p class="eyebrow">Més enllà del Checkbox</p>
    <hr class="rule-accent">
  </div>

  <div class="locked-section">
    <div class="locked-label">◆ Contingut Premium</div>
    <p class="locked-title">Anàlisi ètica: {mes_enlla['criteri']}</p>
    <p class="locked-desc">Criteri ESG aplica un dels 5 criteris ètics propis (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament) a un dels informes de la setmana. Una lent diferent dels marcs ESG anglosaxons.</p>
    <a href="https://criteriesg.com/preus" class="locked-cta">Desbloqueja amb Premium →</a>
  </div>

  <!-- Acció recomanada (LOCKED) -->
  <div class="section-header">
    <p class="eyebrow">Acció recomanada</p>
    <hr class="rule-accent">
  </div>

  <div class="locked-section">
    <div class="locked-label">◆ Contingut Premium</div>
    <p class="locked-title">Una acció operativa per aquesta setmana</p>
    <p class="locked-desc">Cada setmana, Criteri ESG extreu una acció concreta dels informes sintetitzats. Esforç i impacte estimats per ajudar-te a prioritzar.</p>
    <a href="https://criteriesg.com/preus" class="locked-cta">Desbloqueja amb Premium →</a>
  </div>

  <!-- CTA Premium final -->
  <div class="cta-block">
    <div class="cta-eyebrow">▸ Fes-te Premium</div>
    <h2 class="cta-title">290€/any per <em>criteri clar</em> cada setmana</h2>
    <p class="cta-text">Accés als informes complets, cross-reference amb EcoVadis/B Corp/MSCI/GRI, accions recomanades, connexions setmanals i la lent ètica "Més enllà del Checkbox". 50 places early bird disponibles.</p>
    <a href="https://criteriesg.com/preus" class="cta-button">Veure preus →</a>
  </div>

  <!-- Footer -->
  <div class="news-footer">
    <div class="news-footer-brand">Criteri<span class="dot">.</span> ESG</div>
    <div class="news-footer-meta">
      <a href="https://criteriesg.com">criteriesg.com</a> · Barcelona · Rep aquesta newsletter perquè t'hi vas subscriure · <a href="{{{{UNSUBSCRIBE_URL}}}}">Cancel·lar</a> · <a href="{{{{PREFERENCES_URL}}}}">Preferències</a>
    </div>
  </div>

</div>
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
