"""
Auditoria visual de la web Criteri ESG — Fase 1
Genera un PDF professional amb captures + anàlisi + propostes per component.
"""
import os
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image, PageBreak,
    Table, TableStyle, KeepTogether, NextPageTemplate, PageTemplate, Frame, BaseDocTemplate
)
from reportlab.platypus.flowables import HRFlowable, Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from PIL import Image as PILImage

# === Paleta Criteri ESG ===
COLOR_PRIMARY = colors.HexColor("#2C1810")
COLOR_SECONDARY = colors.HexColor("#5C3A1E")
COLOR_ACCENT = colors.HexColor("#B87333")
COLOR_ACCENT_LIGHT = colors.HexColor("#E8C99A")
COLOR_CREAM = colors.HexColor("#F5EFE6")
COLOR_RULE = colors.HexColor("#C9B89A")
COLOR_MUTED = colors.HexColor("#8B7355")
COLOR_HOVER = colors.HexColor("#8A5526")
COLOR_GREEN = colors.HexColor("#5C8A5C")
COLOR_RED = colors.HexColor("#A0522D")
COLOR_YELLOW = colors.HexColor("#C9A961")

# === Fonts ===
# Fem servir fonts del sistema. No es poden carregar Fraunces/Inter directament.
# Fem servir fonts lliures disponibles.
try:
    pdfmetrics.registerFont(TTFont('Inter', '/usr/share/fonts/truetype/english/Tinos-Regular.ttf'))
except:
    pass

# Fem servir Helvetica com a fallback (sempre disponible a ReportLab)
FONT_SERIF = "Times-Roman"
FONT_SANS = "Helvetica"
FONT_MONO = "Courier"

# === Estils ===
styles = getSampleStyleSheet()

style_title = ParagraphStyle(
    'CustomTitle', parent=styles['Title'],
    fontName=FONT_SERIF, fontSize=28, leading=34, textColor=COLOR_PRIMARY,
    alignment=TA_LEFT, spaceAfter=8, spaceBefore=0,
)

style_subtitle = ParagraphStyle(
    'CustomSubtitle', parent=styles['Normal'],
    fontName=FONT_SERIF, fontSize=14, leading=18, textColor=COLOR_HOVER,
    alignment=TA_LEFT, spaceAfter=12, spaceBefore=0, fontName_=FONT_SERIF,
)

style_h1 = ParagraphStyle(
    'CustomH1', parent=styles['Heading1'],
    fontName=FONT_SERIF, fontSize=20, leading=24, textColor=COLOR_PRIMARY,
    alignment=TA_LEFT, spaceAfter=10, spaceBefore=18,
)

style_h2 = ParagraphStyle(
    'CustomH2', parent=styles['Heading2'],
    fontName=FONT_SERIF, fontSize=16, leading=20, textColor=COLOR_PRIMARY,
    alignment=TA_LEFT, spaceAfter=8, spaceBefore=14,
)

style_h3 = ParagraphStyle(
    'CustomH3', parent=styles['Heading3'],
    fontName=FONT_SANS, fontSize=12, leading=15, textColor=COLOR_HOVER,
    alignment=TA_LEFT, spaceAfter=6, spaceBefore=10,
)

style_eyebrow = ParagraphStyle(
    'Eyebrow', parent=styles['Normal'],
    fontName=FONT_MONO, fontSize=8.5, leading=11, textColor=COLOR_HOVER,
    alignment=TA_LEFT, spaceAfter=4, spaceBefore=0,
)

style_body = ParagraphStyle(
    'CustomBody', parent=styles['Normal'],
    fontName=FONT_SANS, fontSize=10.5, leading=15, textColor=COLOR_PRIMARY,
    alignment=TA_LEFT, spaceAfter=8, spaceBefore=0,
)

style_body_italic = ParagraphStyle(
    'BodyItalic', parent=style_body,
    fontName=FONT_SERIF, fontSize=11, leading=16, textColor=COLOR_SECONDARY,
    fontName_=FONT_SERIF,
)

style_meta = ParagraphStyle(
    'Meta', parent=styles['Normal'],
    fontName=FONT_MONO, fontSize=8.5, leading=11, textColor=COLOR_MUTED,
    alignment=TA_LEFT, spaceAfter=4, spaceBefore=0,
)

style_bullet = ParagraphStyle(
    'Bullet', parent=style_body,
    leftIndent=14, bulletIndent=0, fontSize=10, leading=14,
)

style_callout = ParagraphStyle(
    'Callout', parent=style_body,
    fontName=FONT_SERIF, fontSize=11, leading=16, textColor=COLOR_SECONDARY,
    leftIndent=12, rightIndent=12, spaceBefore=8, spaceAfter=8,
    borderColor=COLOR_ACCENT, borderWidth=0, borderPadding=8,
    backColor=COLOR_CREAM,
)

# === Funcions auxiliars ===

def fit_image(path, max_width_cm=16, max_height_cm=20):
    """Carrega una imatge i l'ajusta a la mida màxima mantenint aspect ratio."""
    img = PILImage.open(path)
    w, h = img.size
    aspect = h / w
    target_w = max_width_cm * cm
    target_h = target_w * aspect
    if target_h > max_height_cm * cm:
        target_h = max_height_cm * cm
        target_w = target_h / aspect
    return Image(path, width=target_w, height=target_h)

def horizontal_rule(color=COLOR_ACCENT, thickness=1, space_before=8, space_after=8):
    return HRFlowable(
        width="100%", thickness=thickness, color=color,
        spaceBefore=space_before, spaceAfter=space_after,
        lineCap='square'
    )

def bullet(text):
    return Paragraph(f"• {text}", style_bullet)

def severity_badge(level):
    """Badge de severitat: high, medium, low"""
    colors_map = {
        'high': (COLOR_RED, "CRÍTIC"),
        'medium': (COLOR_YELLOW, "MITJÀ"),
        'low': (COLOR_GREEN, "BAIX"),
    }
    bg, label = colors_map.get(level, (COLOR_MUTED, level.upper()))
    p = Paragraph(f'<font color="white"><b>{label}</b></font>', ParagraphStyle(
        'Badge', parent=styles['Normal'],
        fontName=FONT_SANS, fontSize=8, leading=11, alignment=TA_CENTER,
        backColor=bg, borderPadding=4,
    ))
    return p

def issue_table(issues):
    """Taula de problemes amb severitat"""
    data = [["Severitat", "Problema", "Proposta de millora"]]
    for sev, problem, proposal in issues:
        data.append([
            severity_badge(sev),
            Paragraph(problem, ParagraphStyle('Cell', fontName=FONT_SANS, fontSize=9, leading=12, textColor=COLOR_PRIMARY)),
            Paragraph(proposal, ParagraphStyle('Cell', fontName=FONT_SANS, fontSize=9, leading=12, textColor=COLOR_SECONDARY)),
        ])

    t = Table(data, colWidths=[2*cm, 6*cm, 8*cm], repeatRows=1)
    t.setStyle(TableStyle([
        # Header
        ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), FONT_SANS),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
        ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 0), (-1, 0), 8),
        # Body
        ('VALIGN', (0, 1), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('LEFTPADDING', (0, 1), (-1, -1), 6),
        ('RIGHTPADDING', (0, 1), (-1, -1), 6),
        # Alternating rows
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, COLOR_CREAM]),
        # Border
        ('LINEBELOW', (0, 0), (-1, 0), 1, COLOR_ACCENT),
        ('LINEBELOW', (0, 1), (-1, -2), 0.3, COLOR_RULE),
        ('LINEABOVE', (0, -1), (-1, -1), 0.3, COLOR_RULE),
    ]))
    return t

# === Page templates amb capçalera i peu ===
def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4

    # Capçalera
    canvas.setStrokeColor(COLOR_ACCENT)
    canvas.setLineWidth(1.5)
    canvas.line(2*cm, height - 1.5*cm, width - 2*cm, height - 1.5*cm)

    canvas.setFont(FONT_MONO, 8)
    canvas.setFillColor(COLOR_HOVER)
    canvas.drawString(2*cm, height - 1.2*cm, "CRITERI ESG · AUDITORIA VISUAL FASE 1")
    canvas.setFillColor(COLOR_MUTED)
    canvas.drawRightString(width - 2*cm, height - 1.2*cm, "juliol 2026 · v1.0")

    # Peu
    canvas.setStrokeColor(COLOR_RULE)
    canvas.setLineWidth(0.3)
    canvas.line(2*cm, 1.5*cm, width - 2*cm, 1.5*cm)

    canvas.setFont(FONT_MONO, 8)
    canvas.setFillColor(COLOR_MUTED)
    canvas.drawString(2*cm, 1.1*cm, "Z.ai · per a Criteri ESG")
    canvas.drawRightString(width - 2*cm, 1.1*cm, f"Pàgina {doc.page}")

    canvas.restoreState()

# === Document ===
output_path = "/home/z/my-project/download/auditoria-web-criteri-esg-fase-1.pdf"
doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    topMargin=2*cm,
    bottomMargin=2*cm,
    leftMargin=2*cm,
    rightMargin=2*cm,
    title="Auditoria visual Criteri ESG — Fase 1",
    author="Z.ai",
    subject="Auditoria de la web i propostes de redisseny",
    creator="Z.ai",
)

story = []

# ========================================
# PORTADA
# ========================================
story.append(Spacer(1, 4*cm))

# Eyebrow
story.append(Paragraph("AUDITORIA VISUAL · FASE 1 · JULIOL 2026", style_eyebrow))
story.append(Spacer(1, 4))

# Títol gran
story.append(Paragraph("Criteri ESG", ParagraphStyle(
    'CoverTitle', fontName=FONT_SERIF, fontSize=42, leading=46,
    textColor=COLOR_PRIMARY, alignment=TA_LEFT, spaceAfter=4,
)))
story.append(Paragraph("Auditoria visual de la web i propostes de redisseny", ParagraphStyle(
    'CoverSub', fontName=FONT_SERIF, fontSize=20, leading=24,
    textColor=COLOR_HOVER, alignment=TA_LEFT, spaceAfter=20, fontName_=FONT_SERIF,
)))

# Línia accent
story.append(horizontal_rule(COLOR_ACCENT, 2, 0, 20))

# Meta bloc
story.append(Paragraph("Document", style_eyebrow))
story.append(Paragraph("Aquest document audita visualment l'estat actual de la web criteriesg.com i proposa millores per cada component, al nivell de qualitat Stripe Press / Bain & Company.", style_body))
story.append(Spacer(1, 12))

story.append(Paragraph("Abast", style_eyebrow))
story.append(Paragraph("8 pàgines audidades (homepage, /que-fem, /qui-som, /informes, /informes/[slug], /estandares-esg, /estandares-esg/[slug], /cuenta) + disseny de l'informe de 8 blocs.", style_body))
story.append(Spacer(1, 12))

story.append(Paragraph("Metodologia", style_eyebrow))
story.append(Paragraph("Per cada pàgina: capture desktop i mobile, anàlisi crític d'art direction vs. referències (Stripe Press, Bain, Aesop, MIT Tech Review), identificació de problemes concrets per nivell de severitat, proposta de redisseny aplicant el sistema visual consolidat de Criteri ESG.", style_body))
story.append(Spacer(1, 12))

story.append(Paragraph("Sistema visual de referència", style_eyebrow))
story.append(Paragraph("Paleta terra+coure (#2C1810 / #5C3A1E / #B87333 / #E8C99A / #F5EFE6), tipografia Fraunces + Inter + JetBrains Mono, layout amb border-top 3px + eyebrow + title + big-number + body + footer amb llegenda i cita italic. Numeració visible en items. Badge Premium amb fons coure sòlid.", style_body))
story.append(Spacer(1, 20))

# Taula resum executiu
story.append(Paragraph("Resum executiu", style_h2))
story.append(Paragraph("La web actual té una base sòlida (paleta, tipografia, estructura) però pateix problemes sistemàtics d'art direction que la fan sentir 'beta': jerarquia feble, sobrecàrrega d'informació per pàgina, CTAs que es perden, components sense coherència visual entre ells. Aquests problemes es poden resoldre amb un redisseny component per component sense canviar l'arquitectura.", style_body))

story.append(Spacer(1, 10))

# Taula resum
resum_data = [
    ["Pàgina", "Estat actual", "Acció prioritària"],
    ["Homepage", "Sobrecarregada, sense focus clar", "Redisseny complet ·Prioritat 1"],
    ["/que-fem", "Estructura correcta, execució pobra", "Redisseny complet · Prioritat 1"],
    ["/qui-som", "Poc personal, genèrica", "Redisseny · Prioritat 2"],
    ["/informes (llista)", "Funcional, sense diferenciació", "Redisseny · Prioritat 2"],
    ["/informes/[slug]", "El cor del producte — bona estructura, execució mitjana", "Redisseny detallat · Prioritat 1"],
    ["/estandares-esg", "Bona base, falta polish", "Polish · Prioritat 3"],
    ["/estandares-esg/[slug]", "Detall correcte", "Polish · Prioritat 3"],
    ["/cuenta", "Funcional", "Polish · Prioritat 4"],
]
resum_table = Table(resum_data, colWidths=[5*cm, 6.5*cm, 4.5*cm])
resum_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), FONT_SANS),
    ('FONTSIZE', (0, 0), (-1, 0), 9.5),
    ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
    ('VALIGN', (0, 0), (-1, 0), 'MIDDLE'),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('TOPPADDING', (0, 0), (-1, 0), 8),
    ('VALIGN', (0, 1), (-1, -1), 'TOP'),
    ('FONTNAME', (0, 1), (-1, -1), FONT_SANS),
    ('FONTSIZE', (0, 1), (-1, -1), 9.5),
    ('TEXTCOLOR', (0, 1), (-1, -1), COLOR_PRIMARY),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, COLOR_CREAM]),
    ('LINEBELOW', (0, 0), (-1, 0), 1.5, COLOR_ACCENT),
    ('LINEBELOW', (0, 1), (-1, -2), 0.3, COLOR_RULE),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
    ('TOPPADDING', (0, 1), (-1, -1), 8),
]))
story.append(resum_table)

story.append(PageBreak())

# ========================================
# 1. HOMEPAGE
# ========================================
story.append(Paragraph("01 · HOMEPAGE", style_eyebrow))
story.append(Paragraph("La portada del projecte", style_h1))
story.append(Paragraph("URL: criteriesg.com · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La homepage actual és una paret de text i blocs petits sense un focus visual clar. "
    "Cada secció competeix per l'atenció: '5 minuts' està enterrat sota un paràgraf dens, "
    "l'oferta Early Bird queda aïllada a la part inferior, el comptador '180+ informes' "
    "es perd entre dades similars. No hi ha jerarquia visual: tot té el mateix pes, "
    "per tant res destac. La paleta terra+coure és correcta però mal aplicada — "
    "els colors s'usen per decorar, no per estructurar. "
    "Falta personalitat de marca: sembla un 'producte' més que una 'marca'.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/01-homepage-desktop.png", max_width_cm=16, max_height_cm=18))
story.append(Spacer(1, 12))

story.append(Paragraph("Capture mobile", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/01-homepage-mobile.png", max_width_cm=8, max_height_cm=14))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_homepage = [
    ('high', "Jerarquia visual inexistent. Cap element té el pes per atreure la mirada en menys de 2 segons. El value prop ('5 minuts per 5 hores') està ofegat entre blocs iguals.",
     "Hero editorial amb UN sol missatge: títol Fraunces 64px + subtitular Inter 18px + un sol CTA. Eliminar el segon CTA 'ver muestra'. Màxim 3 elements visuals a la part superior."),

    ('high', "Sobrecàrrega d'informació. La homepage té 12+ seccions que competeixen. Un visitant nou no sap per on començar.",
     "Reduir a 5 seccions màxim: 1) Hero amb tesi clara. 2) 3 tesis del producte (sintetitzar/creuar/decidir). 3) Prova social (1 testimoni real, no 4 genèrics). 4) Mostra d'1 informe real (no mockup, informe actual). 5) CTA final."),

    ('high', "CTAs confusos. 'Suscríbete gratis' (dalt), 'Ver muestra' (mig), 'Early bird 290€' (baix). Tres accions diferents, sense jerarquia, en competència.",
     "Un sol CTA principal: 'Prova Criteri ESG gratis'. Sense esmentar preus a la homepage (preus van a /preus). Sense comptador de places Early Bird a la homepage — queda desesperat."),

    ('medium', "Paleta mal aplicada. El coure #B87333 s'usa per decorar (línies, accents petits) en comptes d'estructurar (categories, jerarquia).",
     "Reservar el coure per a un ús: el CTA principal. Cap altra cosa ha de portar coure a la homepage. Això crearà focus visual automàticament."),

    ('medium', "El logo 'Criteri. ESG' és massa petit al header. Sembla secundari. No hi ha sistema de marca consistent.",
     "Logo més gran (24px mínim) + logomark (símbol geomètric terra+coure, no només text). El logo ha de ser la primera cosa que es vegi i recordi."),

    ('medium', "Tipografia inconsistent. Es barregen serif i sans sense criteri clar. Alguns titulars són sans, altres serif, sense raó aparent.",
     "Sistema rígid: Fraunces NOMÉS per titulars (h1, h2). Inter per body i UI. JetBrains Mono per meta, labels i eyebrow uppercase. Cap excepció."),

    ('medium', "Mobile: les seccions es veuen massa comprimides. Els espais entre blocs són insuficients, sembla tot juny.",
     "Mobile: incrementar padding vertical entre seccions a 80px mínim. Reduir mida de titulars en mobile (h1: 36px). Ocultar elements decoratius a mobile."),

    ('low', "El footer té massa links. Sembla un sitemap, no un footer.",
     "Footer amb 3 columnes màxim: Producte / Empresa / Legal. 4 links per columna. Res més."),
]
story.append(issue_table(issues_homepage))

story.append(Spacer(1, 16))
story.append(Paragraph("Proposta de redisseny (esquema)", style_h2))
story.append(Paragraph(
    "<b>Hero</b>: pantalla sencera. Fons crema #F5EFE6. A l'esquerra: eyebrow 'CRITERI ESG · 2026' + títol Fraunces 72px 'Inteligencia ESG para decisiones éticas' + "
    "subtitular Inter 18px 'No un agregador. Un filtro con criterio.' + CTA coure 'Prova gratis 7 dies'. "
    "A la dreta: big-number '16' gegant (Fraunces 200px, coure) amb label 'estándares ESG' + miniatura del mapa A3.",
    style_body
))

story.append(Paragraph(
    "<b>3 tesis</b>: secció amb border-top 3px marró. Tres columnes amb numeració 01/02/03: "
    "'Sintetitzar', 'Creuar', 'Recomanar'. Cada una amb un verb en Fraunces 28px + descripció Inter 14px. Sense icones.",
    style_body
))

story.append(Paragraph(
    "<b>Prova social</b>: UN sol testimoni real (beta tester) amb foto + cita + link al cas complet. "
    "Sense puntuacions, sense stars, sense '180+ informes' repetit.",
    style_body
))

story.append(Paragraph(
    "<b>Mostra d'informe real</b>: captura de l'informe ESRS maig 2026 amb el semàfor visible. "
    "Text: 'Així és com veuràs cada informe. 7 minuts de lectura. Criteri per decidir.' CTA: 'Veure informe complet'.",
    style_body
))

story.append(Paragraph(
    "<b>CTA final</b>: bloc dark (fons #2C1810, text crema). Una sola frase Fraunces italic 32px: "
    "'Si treballes en sostenibilitat, et perds el 60% del teu temps recopilant informació. "
    "Et el volem retornar.' CTA coure. Sense urgència, sense 'no te'l perdis'.",
    style_body
))

story.append(PageBreak())

# ========================================
# 2. PÀGINA /que-fem
# ========================================
story.append(Paragraph("02 · /que-fem", style_eyebrow))
story.append(Paragraph("Què fem — la proposta de valor", style_h1))
story.append(Paragraph("URL: criteriesg.com/que-fem · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La pàgina /que-fem té l'estructura correcta (explica els 8 blocs, la metodologia, el manifest 'Més enllà del Checkbox') "
    "però l'execució visual és pobra. Els 8 blocs es presenten com una llista monòtona sense jerarquia entre ells. "
    "El bloc Semàfor Metodològic, que hauria de ser la peça estrella (el diferenciador), es mostra igual que els altres. "
    "El manifest ètic queda com un text més, sense el pes editorial que hauria de tenir.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/02-que-fem-desktop.png", max_width_cm=16, max_height_cm=18))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_quefem = [
    ('high', "Els 8 blocs es presenten amb el mateix pes visual. El Semàfor (diferenciador principal) no destaca.",
     "Bloc Semàfor com a hero de la pàgina: captura gran + descripció extensa + exemple real (ESRS). La resta de blocs en grid 2x3 més compacte."),

    ('high', "El manifest 'Més enllà del Checkbox' queda com un apartat més, sense pes.",
     "Secció dark (fons #2C1810, text crema) que trenqui el ritge de la pàgina. Una sola frase gran Fraunces italic 48px. Link a la pàgina /manifest."),

    ('medium', "Massa text per bloc. Cada bloc té 4-5 línies de descripció que podrien ser 1.",
     "Una línia per bloc (max 20 paraules). El detall va a la pàgina de cada bloc o a un popover."),

    ('medium', "Sense exemples visuals. Cada bloc hauria de tenir una captura real d'un informe.",
     "Mini-captura 200x150px per cada bloc mostrant com es veu en un informe real (no mockup, captura real)."),

    ('medium', "Cap cross-reference visual. No s'entén com es connecten els blocs entre si.",
     "Diagrama visual petit mostrant el fluxe: Semàfor → 7 blocs → Cross-reference. Una sola línia amb fletxes."),

    ('low', "El footer té un CTA 'Prova gratis' que sembla afegit al final.",
     "CTA final coherent amb la homepage: bloc dark amb frase + botó. Mateix patró, mateix to."),
]
story.append(issue_table(issues_quefem))

story.append(PageBreak())

# ========================================
# 3. PÀGINA /qui-som
# ========================================
story.append(Paragraph("03 · /qui-som", style_eyebrow))
story.append(Paragraph("Qui som — la historia del projecte", style_h1))
story.append(Paragraph("URL: criteriesg.com/qui-som · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La pàgina /qui-som és genèrica. Presenta Paolo i la Roser amb títols i breus descripcions, però "
    "no hi ha veu personal ni historia. Sembla una pàgina 'About' de qualsevol empresa, "
    "no la historia d'un projecte que vol ser diferencial. Falta el perquè, el moment fundacional, "
    "les conviccions ètiques que sostenen Criteri ESG.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/03-qui-som-desktop.png", max_width_cm=16, max_height_cm=18))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_quisom = [
    ('high', "Sense historia fundacional. No saps per què existeix Criteri ESG ni quin problema va veure Paolo.",
     "Secció 'Per què' al principi: una historia curta (300 paraules) en veu personal de Paolo explicant què el va portar a fundar Criteri. Foto real de Paolo (no avatar)."),

    ('high', "L'equip es presenta com a targes genèrics. Sembla un LinkedIn més.",
     "Format editorial: foto gran B/N (no avatar colorit) + nom + rol + 3 línies de bio en veu personal (no corporativa). Paolo parla en primera persona, la Roser també."),

    ('medium', "No hi ha manifest ètic explícit. La pagina hauria de comunicar les 5 conviccions ètiques del projecte.",
     "Secció 'El que creiem' amb 5 frases curtes (1 línia cadascuna) en Fraunces italic 24px. Una per convicció. Sense explicació, només la frase."),

    ('medium', "Cap menció a la metodologia ètica kantiana / bé comú que és diferencial.",
     "Bloc curt explicant: 'Apliquem el principi kantiana a cada decisió: tractem els usuaris com a fins, no com a mitjans. I el principi del bé comú: el valor ha de ser per a treballadors, comunitat i territori, no només per a accionistes.'"),

    ('low', "Cap CTA al final. La pàgina mor sense cap acció.",
     "CTA suau al final: 'Si vols parlar amb nosaltres: info@criteriesg.com'. Sense formulari, sense CTA de compra."),
]
story.append(issue_table(issues_quisom))

story.append(PageBreak())

# ========================================
# 4. BIBLIOTECA D'INFORMES
# ========================================
story.append(Paragraph("04 · /informes", style_eyebrow))
story.append(Paragraph("Biblioteca d'informes", style_h1))
story.append(Paragraph("URL: criteriesg.com/informes · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La biblioteca és funcional però no té diferenciació. Sembla un blog de WordPress amb targetes "
    "estandardaritzades. No hi ha manera de veure ràpidament quins informes són més rellevants, "
    "què els diferencia, ni quin és el seu semàfor. El sistema de filtres és bàsic i visualment pobre. "
    "És la pàgina on els usuaris haurien de passar més temps, però no convida a explorar.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/04-biblioteca-informes-desktop.png", max_width_cm=16, max_height_cm=18))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_biblioteca = [
    ('high', "Targes d'informe totes iguals, sense jerarquia. No se sap quin és més important.",
     "Destacar 1 informe 'de la setmana' o 'del mes' amb card més gran (2 columnes). La resta en grid 3 columnes estandard."),

    ('high', "Sense semàfor visible a la card. L'usuari ha de clicar per veure'l.",
     "Mini-semàfor a la card: un sol dot de color + nota (A/B/C/D). Com el widget compacte de la newsletter, no més gran."),

    ('high', "Sense filtres per certificació. L'usuari amb EcoVadis no pot filtrar informes que el afecten.",
     "Filtre per certificació: checkboxes per EcoVadis, B Corp, MSCI, GRI, SGE 21, etc. Aquesta és la funció diferencial."),

    ('medium', "Massa text a cada card. Descripcions llargues que ocupen espai.",
     "Descripció màx 30 paraules per card. Títol + font + data + semàfor + 1 línea descripció. El detall va a la pàgina de l'informe."),

    ('medium', "Sense ordenació clara. Sembla random.",
     "Per defecte: ordre cronològic invers. Opctions: 'Per rellevància' (algoritme Criteri), 'Per data', 'Per semàfor' (millors notes primer), 'Per certificació'."),

    ('medium', "Cap indicació de què és Premium vs Gratis fins que clices.",
     "Badge a la card: 'Gratis' (fons subtil) o 'Premium' (fons coure sòlid, text blanc). No el cadenat, és confús."),

    ('low', "Cap opcio de guardar informes per llegir més tard.",
     "Icona bookmark discreta a cada card. Es guarda a /cuenta/memoria."),
]
story.append(issue_table(issues_biblioteca))

story.append(PageBreak())

# ========================================
# 5. INFORME DETALL
# ========================================
story.append(Paragraph("05 · /informes/[slug]", style_eyebrow))
story.append(Paragraph("Informe detall — el cor del producte", style_h1))
story.append(Paragraph("URL: criteriesg.com/informes/revisio-esrs-maig-2026 · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "Aquesta és la pàgina més important del producte — on l'usuari rep el valor. "
    "L'estructura de 8 blocs (Semàfor + 7 blocs narratius) és sòlida i diferencial. "
    "Però l'execució visual no està a l'alçada: els blocs es presenten com a seccions llargues "
    "sense jerarquia visual interna, el Semàfor queda com una targeta petita en comptes de ser "
    "el protagonist, i el Cross-reference — la segona peça diferencial — queda ofegat al final. "
    "És llegible però no memorable.",
    style_body
))

story.append(Paragraph("Capture desktop (ESRS maig 2026)", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/07-informe-detalle-desktop.png", max_width_cm=16, max_height_cm=18))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_informe = [
    ('high', "El Semàfor queda com una card petita al principi. Hauria de ser el protagonist visual de l'informe.",
     "Semàfor com a hero de l'informe: bloc superior gran amb les 5 dimensions + nota final en Fraunces 56px (A/B/C/D) + color de fons que canvia segons la nota (verd/groc/vermell terra, no els típics colors semàfor)."),

    ('high', "Els 7 blocs es presenten com a seccions iguals. Cap destaquem el Bloc 6 (Accions) que és el més operatiu.",
     "Bloc 6 (Accions) destacat visualment: card amb fons coure clar + numeració gran + 3-5 accions amb checkbox visual. És el que l'usuari recorda."),

    ('high', "El Cross-reference queda al final com un apartat més. Hauria de ser la segona peça protagonista.",
     "Cross-reference com a bloc visual destacat: taula amb headers clicables, files amb badges de color per certificació (regulació/framework/certificació), intensitat visual per nivell d'impacte (alto/medio/bajo)."),

    ('medium', "Sense breadcrumb clar. L'usuari no sap on és.",
     "Breadcrumb subtil al header: 'Biblioteca > Informes > Revisió ESRS maig 2026'. Link 'Tornar a la biblioteca' sempre visible."),

    ('medium', "Massa text en alguns blocs (especialment Bloc 4 Implicacions i Bloc 7 Cross-ref).",
     "Llargada màxima per bloc: Bloc 2 (300), Bloc 3 (450), Bloc 4 (450), Bloc 5 (250), Bloc 6 (accions), Bloc 7 (taula). Cap més. Si cal més, link a pàgina auxiliar."),

    ('medium', "Cap apartat 'Més enllà del Checkbox' visible dins del Bloc 4 com diu el CONTEXT.",
     "Subsecció 'Més enllà del Checkbox' dins Bloc 4 amb fons dark (#2C1810 + text crema). Una sola pregunta ètica relacionada amb l'informe. Peça recurrent."),

    ('medium', "Sense navegació entre blocs. L'usuari ha de fer scroll infinit.",
     "Sidebar sticky a l'esquerra (desktop) amb índex dels 8 blocs + semàfor mini + progress bar de lectura. A mobile: topbar amb 'Bloc X de 8'."),

    ('low', "Cap opció de compartir informes concrets.",
     "Botó compartir discret al header de l'informe: copia link, comparteix a LinkedIn, envia per email."),
]
story.append(issue_table(issues_informe))

story.append(PageBreak())

# ========================================
# 6. ESTÀNDARDS ESG
# ========================================
story.append(Paragraph("06 · /estandares-esg", style_eyebrow))
story.append(Paragraph("Estàndards ESG — pàgina principal", style_h1))
story.append(Paragraph("URL: criteriesg.com/estandares-esg · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La pàgina d'estàndards és una de les més aconseguides de la web actual. "
    "El sistema de 3 colors (Regulacions / Frameworks / Certificacions) funciona. "
    "La franja esquerra de color a cada card és elegant. La llegenda és clara. "
    "Però el disseny general és pobre comparat amb el potencial: cards bàsiques, "
    "sense la jerarquia editorial dels assets redissenyats (A3). És com si aquesta pàgina "
    "no hagués rebut el mateix amor que l'asset A3 que la representa.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/05-estandares-esg-desktop.png", max_width_cm=16, max_height_cm=14))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_estandards = [
    ('high', "Les cards són bàsiques. No mostren el valor real: quants informes hi ha cross-ref, quin impacte té l'estàndard.",
     "Card redissenyada: només amb numeració 01-16, franja esquerra 6px del color de categoria, nom en Fraunces 18px, descripció 2 línies, badge 'X informes cross-ref' en mono, badge Premium si aplica. Sense icones. Igual que l'asset A3."),

    ('medium', "Sense manera de veure quins estàndards estan relacionats entre si (ex: GRI ↔ ESRS).",
     "Mapa visual interactiu: clickable, on es vegi els 16 estàndards i les seves relacions. Versió simplificada de l'asset A3."),

    ('medium', "El badge Premium (cadenat) és confusing. No comunica el valor, només el pagament.",
     "Badge Premium sense cadenat: 'Premium' amb fons coure sòlid + text blanc. Cap icona. La paraula és prou clara."),

    ('medium', "Sense cerca. 16 estàndards no és molt, però si creix, caldrà.",
     "Cerca subtil al header: input amb placeholder 'Cerca estàndard...'. Filtre per tipus (3 botons toggle: Regulacions / Frameworks / Certificacions)."),

    ('low', "Llegenda amb els 3 colors sembla afegida al final.",
     "Llegenda integrada al header de la pàgina, no aïllada. Format: 3 botons toggle que serveixen de filtre alhora."),
]
story.append(issue_table(issues_estandards))

story.append(PageBreak())

# ========================================
# 7. ESTÀNDARD DETALL
# ========================================
story.append(Paragraph("07 · /estandares-esg/[slug]", style_eyebrow))
story.append(Paragraph("Estàndard detall", style_h1))
story.append(Paragraph("URL: criteriesg.com/estandares-esg/ecovadis · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La pàgina de detall d'un estàndard té bona informació: descripció, taula cross-reference "
    "amb filtres, accions recomanades. Però visualment sembla una pàgina d'administració "
    "més que una peça editorial. La taula és densa, sense jerarquia visual, i el lock overlay "
    "per a no-Premium (3 files visibles) és intrusiu.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/08-estandar-detalle-desktop.png", max_width_cm=16, max_height_cm=14))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_estandar_detall = [
    ('high', "La taula cross-reference sembla administrativa. Cap jerarquia visual entre files.",
     "Taula redissenyada: headers amb badge de color per categoria de l'informe, files amb separació clara, intensitat visual per nivell d'impacte (alto = fons coure clar, medio = fons crema, bajo = sense fons). Cap grid dens."),

    ('high', "El lock overlay per a no-Premium és intrusiu. Bloqueja amb un panell gris que fa fugir.",
     "Mostra 3 files visibles + les altres 12 amb blur suau (no gris) + un sol CTA discret: 'Premium per veure tota la taula'. Sense missatge comercial."),

    ('medium', "Sense descripció llarga de l'estàndard. La descripció actual és molt curta.",
     "Secció 'Què és' amb 200 paraules explicant l'estàndard: història, qui el gestiona, com s'usa, què mesura. Fonts al final."),

    ('medium', "Cap apartat 'Com et afecta'. L'usuari veu la taula però no sap què fer.",
     "Secció 'Com et afecta' amb 3 accions recomanades específiques per aquest estàndard. Adaptades al pla de l'usuari (gratis veu 1, premium veu 3)."),

    ('medium', "Sense enllaços a informes relacionats. La taula cross-ref hauria de ser clickeable.",
     "Cada fila de la taula cross-ref ha de ser clickeable i portar a l'informe concret. És el cor de la proposta de valor."),

    ('low', "Cap breadcrumb clar.",
     "Breadcrumb: 'Estàndards > EcoVadis'. Link 'Tornar a estàndards' sempre visible."),
]
story.append(issue_table(issues_estandar_detall))

story.append(PageBreak())

# ========================================
# 8. /cuenta
# ========================================
story.append(Paragraph("08 · /cuenta", style_eyebrow))
story.append(Paragraph("El compte d'usuari", style_h1))
story.append(Paragraph("URL: criteriesg.com/cuenta · Capture: desktop 1440×900 (fullPage)", style_meta))
story.append(horizontal_rule())

story.append(Paragraph("Anàlisi de l'estat actual", style_h2))

story.append(Paragraph(
    "La pàgina /cuenta és funcional però sense polish. Té els elements bàsics "
    "(perfil, pla, idioma newsletter, billing) però sembla un formulari genèric "
    "més que una experiència de producte. No hi ha cap element que faci sentir "
    "l'usuari que està en una plataforma premium.",
    style_body
))

story.append(Paragraph("Capture desktop", style_h3))
story.append(fit_image("/home/z/my-project/download/auditoria-web/capturas/06-cuenta-desktop.png", max_width_cm=16, max_height_cm=14))

story.append(PageBreak())

story.append(Paragraph("Problemes detectats i propostes", style_h2))

issues_cuenta = [
    ('medium', "Format formulari genèric. Cap element de marca.",
     "Sidebar esquerra amb logo Criteri ESG + avatar + nom + pla actual. Main area amb targetes per secció (Perfil, Newsletter, Pla, Billing). Cap formulari llarg."),

    ('medium', "Sense dashboard. L'usuari no veu el seu ús (informes llegits, preferides, etc.).",
     "Tarjeta 'La teva activitat' amb: informes llegits aquest mes, informes guardats, certificacions que monitoring. Mètriques útils, no decoratives."),

    ('medium', "El selector d'idioma newsletter és un select bàsic.",
     "Toggle visual CAT/ES amb el seleccionat destacat en coure. Important perquè és una decisió editorial (decisió 12 i 14 del CONTEXT)."),

    ('low', "Sense gestió de certificacions. L'usuari hauria de poder dir quines té i rebre informes cross-ref específics.",
     "Secció 'Les teves certificacions': checkboxes pels 16 estàndards. Sistema recomana informes basats en aquestes seleccions."),

    ('low', "Cap opció de gestionar la CCAA (decisió editorial 2 del CONTEXT).",
     "Selector de CCAA amb mapa visual. Apareixerà com a feature quan s'activi territorialització."),
]
story.append(issue_table(issues_cuenta))

story.append(PageBreak())

# ========================================
# 9. PROPOSTA DE SISTEMA VISUAL UNIFICAT
# ========================================
story.append(Paragraph("09 · SISTEMA", style_eyebrow))
story.append(Paragraph("Sistema visual unificat per la web i els informes", style_h1))
story.append(horizontal_rule())

story.append(Paragraph(
    "Després d'auditar 8 pàgines, és evident que els problemes són sistemàtics, no puntuals. "
    "La solució no és redissenyar cada pàgina per separat, sinó definir un sistema visual "
    "unificat que s'apliqui a tot. Aquest sistema és el que hem consolidat amb els assets "
    "del pla de comunicació (A3, A4, A7, A9, A10, A12, A13, A14, N1, N2, N3 + carousel C1). "
    "A continuació, la documentació del sistema per aplicar-lo a la web i als informes.",
    style_body
))

story.append(Paragraph("9.1 Paleta", style_h2))
palette_data = [
    ["Color", "Hex", "Ús"],
    ["Marró molt fosc", "#2C1810", "Text principal, backgrounds dark, header superior"],
    ["Marró fosc", "#5C3A1E", "Headers de taula, accents foscos, regulacions"],
    ["Coure", "#B87333", "CTAs principals, frameworks, accents diferencials"],
    ["Coure clar", "#E8C99A", "Certificacions, badges suaus, hovers"],
    ["Crema", "#F5EFE6", "Backgrounds clars, targetes"],
    ["Línia", "#C9B89A", "Separadors, borders subtils"],
    ["Muted", "#8B7355", "Text secundari, meta, captions"],
    ["Hover", "#8A5526", "Hover states, èmfasi secundari"],
    ["Coure crema (dark)", "#D9A574", "Text sobre fons dark, eyebrows dark"],
]
ptable = Table(palette_data, colWidths=[5*cm, 3*cm, 8*cm])
ptable.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), COLOR_SECONDARY),
    ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
    ('FONTNAME', (0, 0), (-1, 0), FONT_SANS),
    ('FONTSIZE', (0, 0), (-1, 0), 9.5),
    ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
    ('TOPPADDING', (0, 0), (-1, 0), 8),
    ('VALIGN', (0, 1), (-1, -1), 'MIDDLE'),
    ('FONTNAME', (0, 1), (-1, -1), FONT_SANS),
    ('FONTSIZE', (0, 1), (-1, -1), 9.5),
    ('TEXTCOLOR', (0, 1), (-1, -1), COLOR_PRIMARY),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, COLOR_CREAM]),
    ('LINEBELOW', (0, 0), (-1, 0), 1.5, COLOR_ACCENT),
    ('LINEBELOW', (0, 1), (-1, -2), 0.3, COLOR_RULE),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
    ('TOPPADDING', (0, 1), (-1, -1), 6),
]))
story.append(ptable)

story.append(Spacer(1, 16))

story.append(Paragraph("9.2 Tipografia", style_h2))
story.append(Paragraph(
    "<b>Fraunces</b> (display) — NOMÉS per a titulars, h1/h2, cites ètiques, notes de semàfor. Pes 400-500. Èmfasi en italic.",
    style_body
))
story.append(Paragraph(
    "<b>Inter</b> (body) — Cos de text, UI, descripcions, labels. Pes 300-600. La base de tot.",
    style_body
))
story.append(Paragraph(
    "<b>JetBrains Mono</b> (meta) — Eyebrows, labels uppercase, numeració (01-16), URLs, metadades. Pes 400-500. Sempre amb letter-spacing 0.15-0.2em.",
    style_body
))

story.append(Spacer(1, 12))

story.append(Paragraph("9.3 Layout canònic", style_h2))
story.append(Paragraph(
    "Cada pàgina / secció segueix el patró:",
    style_body
))
story.append(bullet("<b>Border-top 3px</b> en color marró fosc #2C1810 (o coure en dark) que marca l'inici de secció."))
story.append(bullet("<b>Eyebrow</b> en mono uppercase letter-spacing 0.2em, color hover #8A5526 (o coure crema en dark)."))
story.append(bullet("<b>Title</b> en Fraunces 32-48px, pes 500, amb èmfasi en italic per a una paraula clau."))
story.append(bullet("<b>Body</b> en Inter 11-14px segons context."))
story.append(bullet("<b>Footer de secció</b> amb llegenda (si aplica) + nota italic en Fraunces + URL en mono."))

story.append(Spacer(1, 12))

story.append(Paragraph("9.4 Components canònics", style_h2))
story.append(Paragraph(
    "<b>Card estàndard</b>: background blanc, border 1px línia, padding 20px, numeració 01-XX visible en mono. Cap icona.",
    style_body
))
story.append(Paragraph(
    "<b>Badge Premium</b>: background coure sòlid #B87333, text blanc, padding 3px 8px, font mono 9px uppercase letter-spacing 0.12em. Cap icona de cadenat.",
    style_body
))
story.append(Paragraph(
    "<b>Semàfor widget</b>: compacte, amb títol 'Semàfor metodològic' + 5 dots (un per dimensió) + nota final visible (A-D). Mai ocupa més de 25% de l'ample.",
    style_body
))
story.append(Paragraph(
    "<b>CTA principal</b>: background coure #B87333, text blanc, padding 10px 24px, font Inter 13px pes 600. Cap icona. Una acció per pàgina.",
    style_body
))
story.append(Paragraph(
    "<b>Cita ètica</b>: bloc dark (fons #2C1810, text crema), Fraunces italic 24-48px segons importància. Sempre acabada amb una pregunta, no amb un CTA.",
    style_body
))

story.append(PageBreak())

# ========================================
# 10. PRIORITZACIÓ I PROPERES FASES
# ========================================
story.append(Paragraph("10 · FULL DE RUTA", style_eyebrow))
story.append(Paragraph("Priorització i properes fases", style_h1))
story.append(horizontal_rule())

story.append(Paragraph(
    "Aquesta auditoria identifica 50+ problemes visuals a la web actual. No es poden resoldre tots alhora. "
    "Es proposen 4 fases de redisseny, ordenades per impacte en la percepció de marca i en la conversió:",
    style_body
))

story.append(Paragraph("Fase 2A — Hero i homepage (setmana 1-2)", style_h2))
story.append(Paragraph(
    "Redisseny complet de la homepage seguint el patró dels assets A3/N3. "
    "Definir el sistema de marca que es replicarà a la resta. "
    "Produeix el major impacte de percepció amb el menor esforç. "
    "És la fase que valida el sistema visual abans d'aplicar-lo a 30+ pàgines més.",
    style_body
))

story.append(Paragraph("Fase 2B — Informe detall (setmana 3-4)", style_h2))
story.append(Paragraph(
    "Redisseny del layout d'informe de 8 blocs. És el cor del producte. "
    "Semàfor com a hero, Bloc 6 (Accions) destacat, Cross-reference com a segona peça protagonista, "
    "sidebar sticky amb navegació entre blocs. Aplicar el patró a tots els informes existents.",
    style_body
))

story.append(Paragraph("Fase 2C — Biblioteca i estàndards (setmana 5-6)", style_h2))
story.append(Paragraph(
    "Redisseny de la biblioteca d'informes (filtres, mini-semàfor a cards, ordre per defecte) "
    "i de les pàgines d'estàndards (cards redissenyades, llegenda integrada al header, mapa visual interactiu).",
    style_body
))

story.append(Paragraph("Fase 2D — Pàgines secundàries (setmana 7-8)", style_h2))
story.append(Paragraph(
    "Polish de /que-fem, /qui-som, /cuenta. Aquestes pàgines no són crítiques per la conversió inicial "
    "però sí per la retenció. Aplicar el sistema unificat sense grans canvis estructurals.",
    style_body
))

story.append(Spacer(1, 20))

story.append(Paragraph("Properes passes", style_h2))

story.append(Paragraph(
    "1. <b>Validació</b>: Paolo revisa aquesta auditoria i valida les propostes. "
    "Cal confirmar que la direcció editorial és correcta abans d'iniciar la Fase 2A.",
    style_body
))
story.append(Paragraph(
    "2. <b>Implementació Fase 2A</b>: redisseny de la homepage. "
    "Producció de variants, validació VLM, implementació al codi React/Tailwind, deploy a Vercel. "
    "Caldrà feedback de Paolo abans de passar a la Fase 2B.",
    style_body
))
story.append(Paragraph(
    "3. <b>Iteració</b>: cada fase es valida abans de la següent. "
    "Si la direcció no funciona, es corregeix abans d'aplicar-la a tota la web. "
    "És més lent que fer-ho tot de cop, però evita errors cars de corregir.",
    style_body
))

story.append(Spacer(1, 20))

story.append(horizontal_rule())

story.append(Paragraph(
    "Document viu · juliol 2026 · v1.0 · Z.ai per a Criteri ESG",
    style_meta
))

# === Build amb header/footer ===
doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)

print(f"✓ PDF generat: {output_path}")
print(f"  Mida: {os.path.getsize(output_path) / 1024:.1f} KB")
