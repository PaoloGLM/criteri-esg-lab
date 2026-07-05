#!/usr/bin/env python3
"""
corrector_wrapper.py — Mòdul integrable per a scripts de generació de contingut.

Aquest mòdul permet que qualsevol script que generi text públic (informes,
newsletters, HTML, etc.) passi automàticament el corrector LanguageTool
i mostri un informe honest dels errors trobats.

Ús bàsic:
    from corrector_wrapper import check_text, check_file, check_html

    # Verificar text abans de guardar-lo
    result = check_text(text, language='ca')
    if result.has_errors:
        print(result.report())
        # Decidir què fer: aplicar correccions automàtiques, abortar, etc.

    # Verificar HTML (extreu només el text visible)
    result = check_html(html_content, language='ca')

    # Verificar fitxer
    result = check_file('/path/to/file.md', language='es')

Sortida:
    - result.ok → True si no hi ha errors
    - result.errors → llista d'errors
    - result.auto_corrections → llista de correccions automàtiques
    - result.manual_corrections → llista de correccions que requereixen revisió
    - result.corrected_text → text amb correccions automàtiques aplicades
    - result.report() → string formatat per mostrar a l'usuari
    - result.save_log(path) → guarda el log a un fitxer

Política:
    - Aquest mòdul NO aborta automàticament la generació. Però el log ha de
      ser visible i guardat al costat del fitxer generat.
    - Si hi ha errors que requereixen revisió manual, l'script hauria de
      avisar clarament i deixar el fitxer .log al costat del fitxer generat.
"""
import json
import re
import urllib.request
import urllib.parse
from dataclasses import dataclass, field
from typing import List, Optional
from pathlib import Path
from html.parser import HTMLParser


# ============ Diccionari d'excepcions (noms propis i acrònims ESG) ============
# Aquests termes NO són errors encara que LanguageTool els marqui
WHITELIST_TERMS = {
    # Acrònims ESG
    'ESG', 'ESRS', 'CSRD', 'CSDDD', 'SFDR', 'TCFD', 'TNFD', 'GRI', 'SASB',
    'CDP', 'UNGC', 'OECD', 'ISO', 'PRI', 'WEF', 'IEA', 'IRENA', 'IPCC',
    'ECB', 'ESMA', 'EFRAG', 'SBTi', 'MSCI', 'ISS',
    # Certificacions / frameworks
    'EcoVadis', 'Forética', 'EcoVadis', 'B Corp', 'B Corps',
    'SGE', 'FTSE4Good', 'ISS ESG', 'Sustainalytics',
    # Noms propis
    'Forética', 'Forética,', 'Forética.',
    'Felber', 'Sasia', 'Deusto', 'Peru', 'Christian',
    'Karpathy', 'Andrej', 'Paolo', 'Roser',
    # Anglicismes acceptats en context ESG (decisió editorial juliol 2026)
    'compliance', 'Compliance', 'reporting', 'Reporting',
    'stakeholders', 'Stakeholders', 'stakeholder',
    'greenwashing', 'Greenwashing', 'greenwashing,',
    'scope', 'Scope', 'Scope 3', 'Scope 1', 'Scope 2',
    'datapoints', 'datapoint',
    'disclosure', 'disclosures', 'Disclosure',
    'framework', 'frameworks', 'Framework',
    'rating', 'ratings', 'Rating',
    'score', 'scores', 'Score',
    'audit', 'auditoria', 'auditable',
    'board', 'Board',
    'CEO', 'CFO', 'CSO', 'CSRD',
    'AUM', 'Article 8', 'Article 9',
    'Trend', 'Trends',  # Forética trends
    'feedback', 'Feedback',
    'checklist', 'checklists',
    'check-in', 'check-in,',
    'newsletter', 'Newsletter',
    'webinar', 'webinars', 'Webinar', 'Webinars',
    'ILO', 'OECD', 'UNGC',
    # Paraules compostes
    'co-decisió', 'co-decisió,',
    'autocorregits', 'auto-corregits', 'auto-correcció',
    'pasaporte',  # castellà per passaport
}

# Regles que volem ignorar (soroll del HTML)
IGNORE_RULES = {
    "Repetició d'espais en blanc (formatació incorrecta)",
    "Espais abans de coma i abans i després dels parèntesis",
    "espai en unitats",  # 3.700M€ — decisió editorial
    "Comprova que hi ha punt en abreviatures: pàg., núm., etc.",
}


class _TextExtractor(HTMLParser):
    """Extractor de text visible d'HTML (sense tags, sense scripts/styles)."""
    def __init__(self):
        super().__init__()
        self.text_parts = []
        self._skip = False
    def handle_starttag(self, tag, attrs):
        if tag in ('script', 'style', 'head'):
            self._skip = True
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'head'):
            self._skip = False
        elif tag in ('p', 'div', 'br', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'tr'):
            self.text_parts.append(' ')
    def handle_data(self, data):
        if not self._skip:
            self.text_parts.append(data)
    def get_text(self):
        return ' '.join(self.text_parts)


@dataclass
class Correction:
    word: str
    replacement: str
    message: str
    rule: str
    context: str
    auto: bool
    offset: int = 0
    length: int = 0
    ignored: bool = False  # True si és whitelist o ignore-rule


@dataclass
class CheckResult:
    language: str
    original_text: str
    corrected_text: str
    corrections: List[Correction] = field(default_factory=list)
    source: str = ''  # path o descripció

    @property
    def ok(self) -> bool:
        """True si no hi ha errors (ignorant whitelist)."""
        return len([c for c in self.corrections if not c.ignored]) == 0

    @property
    def has_errors(self) -> bool:
        return not self.ok

    @property
    def auto_corrections(self) -> List[Correction]:
        return [c for c in self.corrections if c.auto and not c.ignored]

    @property
    def manual_corrections(self) -> List[Correction]:
        return [c for c in self.corrections if not c.auto and not c.ignored]

    @property
    def ignored_corrections(self) -> List[Correction]:
        return [c for c in self.corrections if c.ignored]

    def report(self) -> str:
        """Genera un informe llegible per mostrar a l'usuari."""
        lines = []
        lines.append(f"=== AUDITORIA CORRECTOROR — {self.source or 'text'} ===")
        lines.append(f"Idioma: {self.language}")
        lines.append(f"Text: {len(self.original_text)} caràcters")
        lines.append(f"Total deteccions: {len(self.corrections)} "
                     f"({len(self.auto_corrections)} errors reals auto, "
                     f"{len(self.manual_corrections)} errors reals manual, "
                     f"{len(self.ignored_corrections)} ignorats per whitelist)")
        lines.append('')

        real_errors = [c for c in self.corrections if not c.ignored]
        if not real_errors:
            lines.append("✓ No s'han trobat errors reals. Text llest per publicar.")
            return '\n'.join(lines)

        for i, c in enumerate(real_errors, 1):
            tag = "✓ AUTO" if c.auto else "✗ MANUAL"
            lines.append(f"{i:2d}. [{tag}] '{c.word}' → '{c.replacement}'")
            lines.append(f"    Regla: {c.rule}")
            lines.append(f"    Missatge: {c.message}")
            lines.append(f"    Context: ...{c.context}...")
            lines.append('')

        lines.append(f"Resum: {len(self.auto_corrections)} auto-corregits, "
                     f"{len(self.manual_corrections)} requereixen revisió manual")
        if self.manual_corrections:
            lines.append("")
            lines.append("⚠ ATENCIÓ: Hi ha correccions que requereixen revisió manual.")
            lines.append("  Revisa el text abans de publicar-lo.")
        return '\n'.join(lines)

    def save_log(self, path) -> None:
        """Guarda el log en format JSON al costat del fitxer generat."""
        log_path = Path(str(path) + '.corrector.log')
        log_data = {
            'source': self.source,
            'language': self.language,
            'total_detections': len(self.corrections),
            'auto_corrections_real': len(self.auto_corrections),
            'manual_corrections_real': len(self.manual_corrections),
            'ignored_whitelist': len(self.ignored_corrections),
            'corrections_real': [
                {
                    'word': c.word,
                    'replacement': c.replacement,
                    'message': c.message,
                    'rule': c.rule,
                    'context': c.context,
                    'auto': c.auto,
                } for c in self.corrections if not c.ignored
            ],
        }
        log_path.write_text(json.dumps(log_data, indent=2, ensure_ascii=False), encoding='utf-8')


def _normalize_language(language: str) -> str:
    """Converteix 'ca' → 'ca-ES', 'es' → 'es', etc."""
    if language == 'ca':
        return 'ca-ES'
    if language == 'es':
        return 'es'
    return language


def _is_whitelisted(word: str, rule: str) -> bool:
    """Verifica si un error està a la whitelist (paraula o regla)."""
    # Per paraula
    cleaned = word.strip('.,;:!?()«»""\'')
    if cleaned in WHITELIST_TERMS:
        return True
    # Per prefix de paraula (per ex. "ESG," o "Forética.")
    for term in WHITELIST_TERMS:
        if cleaned.startswith(term):
            return True
    # Per regla
    if rule in IGNORE_RULES:
        return True
    return False


def _call_languagetool(text: str, language: str) -> dict:
    """Crida la API de LanguageTool."""
    data = urllib.parse.urlencode({
        'text': text,
        'language': language,
        'enabledOnly': 'false',
    }).encode('utf-8')
    req = urllib.request.Request(
        'https://api.languagetool.org/v2/check',
        data=data,
        method='POST'
    )
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode('utf-8'))


def check_text(text: str, language: str = 'ca', source: str = '') -> CheckResult:
    """
    Passa el corrector a un text.
    
    :param text: text a corregir
    :param language: 'ca', 'es', o codi LanguageTool complet ('ca-ES', 'es')
    :param source: descripció del text (per al log)
    :return: CheckResult amb correccions i text corregit
    """
    language = _normalize_language(language)
    result = _call_languagetool(text, language)
    matches = result.get('matches', [])

    corrections = []
    corrected_chars = list(text)

    for match in matches:
        offset = match['offset']
        length = match['length']
        message = match['message']
        replacements = match.get('replacements', [])
        context = match['context']['text']
        rule = match['rule']['description']
        word = text[offset:offset+length]

        ignored = _is_whitelisted(word, rule)

        if replacements:
            replacement = replacements[0]['value']
            auto = len(replacements) == 1
            corrections.append(Correction(
                word=word, replacement=replacement,
                message=message, rule=rule, context=context.strip(),
                auto=auto, offset=offset, length=length,
                ignored=ignored,
            ))
        else:
            corrections.append(Correction(
                word=word, replacement='(cap suggeriment)',
                message=message, rule=rule, context=context.strip(),
                auto=False, offset=offset, length=length,
                ignored=ignored,
            ))

    # Aplicar correccions automàtiques en ordre invers (només les no ignorades)
    for c in sorted([c for c in corrections if c.auto and not c.ignored], key=lambda x: -x.offset):
        corrected_chars[c.offset:c.offset + c.length] = list(c.replacement)

    return CheckResult(
        language=language,
        original_text=text,
        corrected_text=''.join(corrected_chars),
        corrections=corrections,
        source=source,
    )


def check_html(html: str, language: str = 'ca', source: str = '') -> CheckResult:
    """
    Passa el corrector a un HTML, extreient només el text visible.
    
    Nota: el text corregit no es pot reinserir directament a l'HTML perquè
    perdem l'estructura de tags. Per tant, aquesta funció serveix per
    AUDITAR però no per AUTOCORREGIR HTML.
    """
    extractor = _TextExtractor()
    extractor.feed(html)
    visible_text = extractor.get_text()
    return check_text(visible_text, language, source)


def check_file(path, language: str = 'auto') -> CheckResult:
    """
    Passa el corrector a un fitxer.
    Detecta automàticament si és HTML o text pla.
    """
    path = Path(path)
    content = path.read_text(encoding='utf-8')
    source = str(path)
    
    if path.suffix == '.html' or '<html' in content.lower()[:200]:
        if language == 'auto':
            lang_match = re.search(r'<html[^>]*lang="([^"]+)"', content, re.IGNORECASE)
            if lang_match:
                lang_code = lang_match.group(1).split('-')[0]
                language = lang_code
            else:
                language = 'ca'
        return check_html(content, language, source)
    else:
        if language == 'auto':
            if 'ñ' in content or '¿' in content:
                language = 'es'
            else:
                language = 'ca'
        return check_text(content, language, source)


# ============ CLI per a ús directe ============
if __name__ == '__main__':
    import sys
    if len(sys.argv) < 2:
        print("Ús: python3 corrector_wrapper.py <fitxer> [ca|es|auto]")
        print("")
        print("Fitxers suportats: .txt, .md, .html")
        print("Per a HTML, s'extreu només el text visible per auditar-lo.")
        print("")
        print("Whitelist: noms propis ESG (EcoVadis, Forética, etc.), acrònims (ESG,")
        print("ESRS, CSRD...), i anglicismes acceptats (compliance, reporting, etc.)")
        print("s'ignoren automàticament.")
        sys.exit(1)

    filepath = sys.argv[1]
    language = sys.argv[2] if len(sys.argv) > 2 else 'auto'

    result = check_file(filepath, language)
    print(result.report())

    if result.has_errors:
        result.save_log(filepath)
        print(f"\nLog guardat a: {filepath}.corrector.log")
