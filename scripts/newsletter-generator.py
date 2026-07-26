"""
Genera una newsletter Criteri ESG i la puja com a draft a Beehiiv.

Flux:
1. Selecciona els 3-4 informes destacats del període (de /data/informes/5-validats-paolo/)
2. Cerca notícies ESG (fonts El País, Expansión, El Economista, Cinco Días, El Confidencial — màx 7 dies)
3. Cerca articles d'inversió ESG (Sustainalytics, Morningstar, ESMA, Banc d'Espanya, Ropes & Gray, Funds Society — màx 20 dies)
4. Genera la connexió de la setmana (anàlisi transversal)
5. Genera la nota editorial
6. Aplica la plantilla HTML estil A v2
7. Crea draft a Beehiiv via API
8. Avisa Paolo per email (pendent d'integrar Resend)

Ús:
    scripts/.venv/bin/python scripts/newsletter-generator.py [edition_number]
    scripts/.venv/bin/python scripts/newsletter-generator.py 1
"""
import os
import sys
import json
import time
import re
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, "/home/z/my-project/criteri-esg-lab/scripts")
from dotenv import load_dotenv
load_dotenv(Path("/home/z/my-project/criteri-esg-lab/assets/web/.env.local"))

from beehiiv_client import create_draft, PUBLICATION_ID

# === Plantilla HTML estil A v2 ===
# Simplificada per Beehiiv (sense @page, sense A4 — Beehiiv no suporta CSS de print)
# Adaptada per ser responsive dins de clients d'email

TEMPLATE_HTML = """<!DOCTYPE html>
<html lang="{{LANG}}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Criteri ESG — Newsletter #{{EDITION}}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #F5EFE6;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    color: #2C1810;
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
  }
  .container { max-width: 640px; margin: 0 auto; padding: 20px; }

  /* Masthead */
  .masthead {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding-bottom: 10px;
    border-bottom: 2px solid #2C1810;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .masthead-brand {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 22px;
    font-weight: 700;
    color: #2C1810;
    letter-spacing: -0.02em;
  }
  .masthead-brand .dot { color: #B87333; }
  .masthead-meta {
    font-family: 'JetBrains Mono', 'Courier New', monospace;
    font-size: 9px;
    color: #5C3A24;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  .masthead-meta strong { color: #B87333; }

  /* Hero */
  .hero {
    margin-bottom: 24px;
    padding-bottom: 20px;
    border-bottom: 1px solid #C9B89A;
  }
  .hero-eyebrow {
    display: inline-block;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #FFFFFF;
    background: #B87333;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    padding: 3px 10px;
    margin-bottom: 12px;
  }
  .hero-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 26px;
    font-weight: 600;
    line-height: 1.15;
    color: #2C1810;
    margin-bottom: 12px;
    letter-spacing: -0.015em;
  }
  .hero-title em { font-style: italic; color: #B87333; font-weight: 500; }
  .hero-deck {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 14px;
    font-style: italic;
    line-height: 1.5;
    color: #5C3A24;
    margin-bottom: 12px;
  }
  .hero-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #5C3A24;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .hero-meta .sep { color: #C9B89A; margin: 0 6px; }
  .hero-meta strong { color: #2C1810; }

  /* Section header */
  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 24px 0 14px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid #2C1810;
    flex-wrap: wrap;
  }
  .section-header .num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #FFFFFF;
    background: #2C1810;
    padding: 3px 8px;
    font-weight: 700;
  }
  .section-header .title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 17px;
    font-weight: 600;
    color: #2C1810;
  }
  .section-header .subtitle {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 12px;
    font-style: italic;
    color: #5C3A24;
    margin-left: auto;
  }

  /* 3-col articles */
  .three-col {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
    margin: 14px 0;
  }
  @media (max-width: 540px) { .three-col { grid-template-columns: 1fr; } }
  .article-card {
    border-top: 2px solid #B87333;
    padding-top: 8px;
  }
  .article-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #B87333;
    font-weight: 700;
    margin-bottom: 4px;
  }
  .article-source {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    color: #8A5526;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 4px;
  }
  .article-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 15px;
    font-weight: 600;
    color: #2C1810;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .article-summary {
    font-size: 12px;
    color: #5C3A24;
    line-height: 1.5;
    margin-bottom: 8px;
  }
  .article-link {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #B87333;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }

  /* News items (llista) */
  .news-item {
    display: flex;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 16px;
    border-bottom: 1px solid #E5DDD0;
  }
  .news-item:last-child { border-bottom: none; }
  .news-marker {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    color: #B87333;
    font-weight: 700;
    flex-shrink: 0;
  }
  .news-content { flex: 1; }
  .news-content h3 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 16px;
    font-weight: 600;
    color: #2C1810;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .news-summary {
    font-size: 13px;
    color: #2C1810;
    line-height: 1.6;
    margin-bottom: 6px;
  }
  .news-source {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8A5526;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .news-source strong { color: #2C1810; }

  /* Connexió de la setmana */
  .connection-week {
    background: rgba(184,115,51,0.06);
    border: 1px solid #B87333;
    border-radius: 4px;
    padding: 20px;
    margin: 24px 0;
  }
  .connection-week-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #B87333;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .connection-week-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 19px;
    font-weight: 600;
    color: #2C1810;
    margin-bottom: 12px;
    line-height: 1.25;
  }
  .connection-week-body {
    font-size: 13px;
    line-height: 1.65;
    color: #2C1810;
    margin-bottom: 10px;
  }
  .connection-week-body strong { color: #B87333; }

  /* Editorial note */
  .editorial-note {
    background: #2C1810;
    color: #F5EFE6;
    padding: 20px;
    margin: 24px 0;
    border-radius: 4px;
  }
  .editorial-note-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #D9A574;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 700;
    margin-bottom: 10px;
  }
  .editorial-note-text {
    font-family: 'Fraunces', Georgia, serif;
    font-style: italic;
    font-size: 14px;
    line-height: 1.6;
  }
  .editorial-note-text strong { color: #D9A574; font-style: normal; }

  /* CTA */
  .cta-block {
    background: #B87333;
    color: #FFFFFF;
    padding: 20px;
    border-radius: 4px;
    margin: 24px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
  .cta-title {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .cta-text { font-size: 12px; opacity: 0.9; line-height: 1.5; }
  .cta-button {
    display: inline-block;
    background: #FFFFFF;
    color: #B87333;
    padding: 12px 24px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 2px;
  }

  /* Footer */
  .news-footer {
    text-align: center;
    padding: 24px 0;
    border-top: 1px solid #C9B89A;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    color: #8B7355;
  }
  .news-footer-brand {
    font-family: 'Fraunces', Georgia, serif;
    font-size: 16px;
    color: #2C1810;
    font-weight: 600;
    margin-bottom: 6px;
  }
  .news-footer-brand .dot { color: #B87333; }
  .news-footer-meta a {
    color: #8A5526;
    text-decoration: none;
  }
</style>
</head>
<body>
<div class="container">

  <!-- Masthead -->
  <div class="masthead">
    <div class="masthead-brand">Criteri<span class="dot">.</span> ESG <span style="font-family: 'Fraunces', serif; font-size: 11px; font-style: italic; color: #5C3A24; margin-left: 10px; font-weight: 400;">Intel·ligència ESG per a decisions ètiques</span></div>
    <div class="masthead-meta">
      <span><strong>EDICIÓ #{{EDITION}}</strong></span>
      <span> · </span>
      <span>{{DATE}}</span>
      <span> · </span>
      <span>BARCELONA</span>
    </div>
  </div>

  <!-- Hero / Informe destacat -->
  <div class="hero">
    <div class="hero-eyebrow">▸ INFORME DESTACAT · {{HERO_SOURCE}}</div>
    <h1 class="hero-title">{{HERO_TITLE}}</h1>
    <p class="hero-deck">{{HERO_DECK}}</p>
    <div class="hero-meta">
      <span><strong>Sintetitzat per</strong> Criteri ESG</span>
      <span class="sep">·</span>
      <span>{{HERO_READ_TIME}} minuts de lectura</span>
      <span class="sep">·</span>
      <span>{{HERO_PAGES}} pàgines originals</span>
    </div>
  </div>

  <!-- També aquesta setmana -->
  <div class="section-header">
    <span class="num">02</span>
    <span class="title">També aquesta setmana</span>
    <span class="subtitle">Tres informes més que has de conèixer</span>
  </div>

  <div class="three-col">
    {{SECONDARY_ARTICLES}}
  </div>

  <!-- Notícies ESG -->
  <div class="section-header">
    <span class="num">06</span>
    <span class="title">Notícies ESG</span>
    <span class="subtitle">El què passa al món, amb perspectiva</span>
  </div>

  <div class="news-list">
    {{NEWS_ESG}}
  </div>

  <!-- Connexió de la setmana -->
  <div class="connection-week">
    <div class="connection-week-eyebrow">◆ CONNEXIÓ DE LA SETMANA</div>
    <h2 class="connection-week-title">{{CONNECTION_TITLE}}</h2>
    <p class="connection-week-body">{{CONNECTION_BODY_1}}</p>
    <p class="connection-week-body">{{CONNECTION_BODY_2}}</p>
  </div>

  <!-- Inversió ESG -->
  <div class="section-header">
    <span class="num">07</span>
    <span class="title">Inversió ESG</span>
    <span class="subtitle">Anàlisi sectorial i regulació</span>
  </div>

  <div class="news-list">
    {{INVESTMENT_ESG}}
  </div>

  <!-- Nota editorial -->
  <div class="editorial-note">
    <div class="editorial-note-eyebrow">▸ NOTA EDITORIAL</div>
    <p class="editorial-note-text">{{EDITORIAL_NOTE}}</p>
  </div>

  <!-- CTA Premium -->
  <div class="cta-block">
    <div>
      <div class="cta-title">Accedeix als {{TOTAL_REPORTS}} informes complets</div>
      <p class="cta-text">7 blocs estructurats, cross-reference amb EcoVadis/B Corp/MSCI/GRI, accions recomanades. Disponible per a subscriptors Premium.</p>
    </div>
    <a href="https://criteriesg.com/preus" class="cta-button">Prova 7 dies →</a>
  </div>

  <!-- Footer -->
  <div class="news-footer">
    <div class="news-footer-brand">Criteri<span class="dot">.</span> ESG</div>
    <div class="news-footer-meta">
      <a href="https://criteriesg.com">criteriesg.com</a> · Barcelona · Rep aquesta newsletter perquè t'hi vas subscriure · <a href="{{UNSUBSCRIBE_URL}}">Cancel·lar</a> · <a href="{{PREFERENCES_URL}}">Preferències</a>
    </div>
  </div>

</div>
</body>
</html>"""


def render_template(replacements: dict) -> str:
    """Aplica les substitucions al template."""
    html = TEMPLATE_HTML
    for key, value in replacements.items():
        html = html.replace(f"{{{{{key}}}}}", value)
    return html


def render_secondary_articles(articles: list) -> str:
    """Renderitza els 3 articles secundaris en grid."""
    html = ""
    for i, a in enumerate(articles[:3], start=3):
        html += f"""
    <div class="article-card">
      <div class="article-num">{i:02d}</div>
      <div class="article-source">{a['source']}</div>
      <h3 class="article-title">{a['title']}</h3>
      <p class="article-summary">{a['summary']}</p>
      <a href="{a.get('url', '#')}" class="article-link">Llegir resum complet →</a>
    </div>"""
    return html


def render_news_items(items: list, marker: str = "▸") -> str:
    """Renderitza una llista de notícies."""
    html = ""
    for item in items:
        sources = " · ".join(f"<strong>{s}</strong>" if i == 0 else s for i, s in enumerate(item.get("sources", [])))
        html += f"""
    <div class="news-item">
      <div class="news-marker">{marker}</div>
      <div class="news-content">
        <h3>{item['title']}</h3>
        <p class="news-summary">{item['summary']}</p>
        <p class="news-source">Fonts: {sources}</p>
      </div>
    </div>"""
    return html


# === Exemple de dades per al primer test ===
# En producció, aquestes dades vindran de:
# - informes publicats (Drive /5-validats-paolo/)
# - search de notícies via web_search (El País, Expansión, etc.)
# - search d'inversió ESG via web_search (Sustainalytics, ESMA, etc.)

EXAMPLE_DATA = {
    "edition": "1",
    "date": "29 JULIOL 2026",
    "lang": "ca",
    "hero": {
        "source": "COMISSIÓ EUROPEA",
        "title": "La Comissió Europea <em>simplifica</em> el CSRD: 61% menys de datapoints obligatoris",
        "deck": "Un canvi que estalviarà 3.700 milions d'euros a les empreses europees en cinc anys, però que obliga a reinvertir l'estalvi en qualitat de dades per no perdre reputació davant certificacions com EcoVadis o MSCI.",
        "read_time": "5",
        "pages": "47",
    },
    "secondary_articles": [
        {
            "source": "EcoVadis",
            "title": "Actualització de criteris EcoVadis 2026",
            "summary": "Revisió anual dels criteris amb canvis en Environment i Procurement. Les empreses que renoven al Q4 han d'adaptar la documentació.",
            "url": "https://criteriesg.com/informes/ecovadis-methodology-q1-2026",
        },
        {
            "source": "Banc Central Europeu",
            "title": "Climate risk in EU banking",
            "summary": "Stress test climàtic anual del sistema bancari europeu. 110 bancs avaluats, focus en risc físic i de transició. Resultats preocupants per al sector immobiliari.",
            "url": "https://criteriesg.com/informes/ecb-climate-risk-2026",
        },
        {
            "source": "EFRAG",
            "title": "Esborrany ESRS S4 sobre drets humans",
            "summary": "Consulta pública sobre l'estàndard sectorial de drets humans a la cadena de suministre. 47 pàgines, 18 requisits de disclosure. Termini: 15 gener 2027.",
            "url": "https://criteriesg.com/informes/efrag-work-programme-2026",
        },
    ],
    "news_esg": [
        {
            "title": "L'onada de calor que afecta Europa hauria estat \"impossible\" fa 50 anys segons un estudi de World Weather Attribution",
            "summary": "L'onada de calor extrema que afecta Europa occidental és 200 vegades més probable avui per les emissions d'origen humà, segons l'anàlisi de World Weather Attribution. L'estudi conclou que hauria estat \"virtualment impossible\" sense el canvi climàtic.",
            "sources": ["El País (29 juliol 2026)", "World Weather Attribution", "CNN Español"],
        },
        {
            "title": "Obligació legal de calcular la huella de carboni a Espanya: el Reial Decret 214/2025 entra en vigor per a grans empreses",
            "summary": "Des del 12 de juny de 2025, les empreses espanyoles que elaboraven l'Estat d'Informació No Financera (EINF) estan obligades a calcular, publicar i elaborar un pla de reducció d'emissions al Registre Oficial de Huella de Carboni.",
            "sources": ["El Economista", "MITECO (RD 214/2025)", "Pacto Mundial ONU Espanya"],
        },
        {
            "title": "El 23% dels fons Article 8 i el 3% dels Article 9 exposats a risc de greenwashing segons l'ESMA",
            "summary": "L'European Securities and Markets Authority (ESMA) manté la lluita contra el greenwashing com a objectiu clau 2026-2028. Un informe de Funds Society sobre dades ESMA revela que el 23% dels fons Article 8 i el 3% dels Article 9 estan exposats a risc de pràctiques enganyoses.",
            "sources": ["El Economista", "Funds Society", "ESMA (informe temàtic 2026-2028)"],
        },
    ],
    "connection_week": {
        "title": "Onada de calor + ESMA greenwashing + RD 214/2025: tres senyals que conflueixen en risc climàtic",
        "body_1": "Aquesta setmana s'ha vist clarament com el reporting ESG no és papereria. L'onada de calor mostra el cost humà del canvi climàtic. L'ESMA adverteix que molts fons \"sostenibles\" no ho són realment. I el RD 214/2025 obliga les empreses espanyoles a tenir plans de reducció d'emissions verificats.",
        "body_2": "Per a les empreses: <strong>la doble materialitat és ara evident</strong>. El risc físic (operacions, treballadors, supply chain) i el risc regulatori (sancions, pèrdua d'accés a finançament Article 9) estan connectats. Les que no adaptin ràpidament els seus plans es trobaran amb ambdós alhora.",
    },
    "investment_esg": [
        {
            "title": "SFDR 2.0: la proposta de la Comissió reclassificarà el 40% dels fons Article 9 actuals",
            "summary": "La proposta SFDR 2.0 (publicada el novembre 2025) elimina les categories Article 8/9 i les substitueix per tres: \"Sustainable\", \"Sustainable Focus\" i \"ESG Collection\". Segons l'anàlisi independent de Sustainalytics, el 40% dels fons Article 9 actuals no superarien els nous criteris d'exclusió.",
            "sources": ["Sustainalytics (anàlisi d'impacte 2026)", "Morningstar (estimació de fluxos)", "Comissió Europea (proposta novembre 2025)"],
        },
        {
            "title": "ESMA publica 4 principis contra greenwashing; els fons amb terminis \"ESG\" al nom han de tenir 80% d'inversions sostenibles",
            "summary": "L'ESMA manté la lluita contra el greenwashing com a prioritat estratègica 2026-2028. Ha publicat quatre principis perquè les declaracions de sostenibilitat siguin \"clares, justes i no enganyoses\": precisió, prova, comparabilitat i actualització.",
            "sources": ["ESMA (thematic note 2026-2028)", "Ropes & Gray (anàlisi legal)", "Paul Hastings (client alert)"],
        },
        {
            "title": "El Banc d'Espanya adverteix sobre riscos de greenwashing en green bonds i demana millora en estàndards de verificació",
            "summary": "El Banc d'Espanya ha publicat una anàlisi sobre els riscos de greenwashing en el mercat de green bonds. L'informe, elaborat en col·laboració amb l'ESMA, identifica les àrees més exposades al risc de pràctiques enganyoses al llarg de la cadena de valor.",
            "sources": ["Banc d'Espanya (informe preliminar)", "ESMA (informe final 2024)", "ICMA (market integrity report)"],
        },
    ],
    "editorial_note": "Aquesta setmana hem vist com el clima real (onada de calor) i la regulació europea (SFDR 2.0, ESMA, RD 214/2025) convergeixen en un mateix missatge: <strong>la sostenibilitat ja no és reputacional, és operativa i financera</strong>. Les empreses que no adaptin ràpidament els seus plans es trobaran amb dos problemes simultanis: risc físic i pèrdua d'accés a finançament Article 9. Aquesta és la tasca de Criteri ESG: ajudar-te a veure ambdues cares alhora.",
    "total_reports": "5",
    "unsubscribe_url": "*|UNSUB:http://criteriesg.com/unsubscribe|*",
    "preferences_url": "*|UPDATE_PROFILE|*",
}


def main():
    edition = sys.argv[1] if len(sys.argv) > 1 else "1"
    data = EXAMPLE_DATA
    data["edition"] = edition

    print(f"=== Generant newsletter #{{edition}} ===")
    print(f"Data: {data['date']}")
    print(f"Hero: {data['hero']['title'][:80]}...")
    print()

    # Renderitzar HTML
    replacements = {
        "EDITION": data["edition"],
        "DATE": data["date"],
        "LANG": data["lang"],
        "HERO_SOURCE": data["hero"]["source"],
        "HERO_TITLE": data["hero"]["title"],
        "HERO_DECK": data["hero"]["deck"],
        "HERO_READ_TIME": data["hero"]["read_time"],
        "HERO_PAGES": data["hero"]["pages"],
        "SECONDARY_ARTICLES": render_secondary_articles(data["secondary_articles"]),
        "NEWS_ESG": render_news_items(data["news_esg"], "▸"),
        "CONNECTION_TITLE": data["connection_week"]["title"],
        "CONNECTION_BODY_1": data["connection_week"]["body_1"],
        "CONNECTION_BODY_2": data["connection_week"]["body_2"],
        "INVESTMENT_ESG": render_news_items(data["investment_esg"], "€"),
        "EDITORIAL_NOTE": data["editorial_note"],
        "TOTAL_REPORTS": data["total_reports"],
        "UNSUBSCRIBE_URL": data["unsubscribe_url"],
        "PREFERENCES_URL": data["preferences_url"],
    }

    html = render_template(replacements)

    # Guardar HTML local per preview
    output_path = Path(f"/home/z/my-project/criteri-esg-lab/data/newsletter-{edition}.html")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"  ✓ HTML guardat: {output_path} ({len(html)/1024:.1f} KB)")

    # Crear draft a Beehiiv
    subject = f"Criteri ESG — Newsletter #{edition} · {data['date'].title()}"
    preview = data["hero"]["title"].replace("<em>", "").replace("</em>", "")[:140]

    print(f"\n  → Creant draft a Beehiiv...")
    print(f"    Subject: {subject}")
    print(f"    Preview: {preview[:80]}...")

    try:
        result = create_draft(
            title=f"Newsletter Criteri ESG #{edition} ({data['date']})",
            subject_line=subject,
            preview_text=preview,
            subtitle=f"Edició #{edition} · {data['date']}",
            html_content=html,
        )
        print(f"  ✓ Draft creat a Beehiiv!")
        print(f"  → Paolo: obre Beehiiv, revisa l'esborrany i clica 'Send'")
    except Exception as e:
        print(f"  ✗ Error creant draft: {e}")


if __name__ == "__main__":
    main()
