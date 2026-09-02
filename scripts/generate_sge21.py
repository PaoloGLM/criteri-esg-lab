"""Genera standards/sge-21.md amb Nemotron 3 Ultra, basat en la Norma SGE 21 2024 oficial."""
import sys
sys.path.insert(0, 'scripts')
from nemotron_client import call_nemotron
from pathlib import Path
import pdfplumber

# Extreure text de la norma (32 pàgines — passen totes, en blocs)
pdf_path = Path('certifications/sge21-norma-2024.pdf')
texts = []
with pdfplumber.open(str(pdf_path)) as pdf:
    for page in pdf.pages:
        t = page.extract_text() or ""
        texts.append(t)
full_text = "\n\n".join(texts)
print(f"Text extret: {len(full_text)} chars, {len(texts)} pàgines")

system = """Ets un expert en sistemes de gestió ètica i sostenible (SGE 21, Forética). Generes fitxes internes d'expert en català per a Criteri ESG. Respon NOMÉS amb el contingut markdown de la fitxa, sense explicacions addicionals."""

user = f"""Genera la fitxa d'expert `standards/sge-21.md` per a l'estàndard SGE 21, basant-te EXCLUSIVAMENT en el text oficial de la Norma SGE 21 (edició 2024) que et passo a continuació.

REQUISITS DE LA FITXA (plantilla v3, document INTERN — primera línia "# DOCUMENT INTERN — NO PÚBLIC"):

# SGE 21 — Fitxa d'expert (Sistema de Gestión Ética y Sostenible — Forética)
## 1. Què és + abast + a qui aplica (amb dades exactes de la norma 2024: organisme, edició, àmbit, entitats elegibles)
## 2. Estructura (criteris/àrees exactes de la norma 2024, amb el nom EXACTE que fa servir la norma)
### 2b. MAPA TEMÀTIC (taula: criteri SGE 21 → requisits concrets → indicadors/documents — extrets del text oficial)
## 3. Interoperabilitat (clau per al cross-reference): SGE 21 ↔ CSRD/ESRS, ISO 26000, GRI, ISO 9001/14001, Agenda 2030/ODS, B Corp, SGE 21 vs altres (taula amb nivell d'alineació)
## 4. ⚠️ VIGILÀNCIA DE CANVIS (històric de versions SGE 21 — 2008, 2014, 2017, 2024...; canal oficial de vigilància: Forética)
## 5. Punts d'impacte típics (quan un informe institucional toca SGE 21)
## 6. Accions tipus que se'n deriven (per a una entitat que s'implanta SGE 21 — taula ID/acció/responsable/KPI)
## 7. CRITERIS D'INTENSITAT (com assignar Alt/Mitjà/Baix a cada crossRef amb SGE 21)
## 8. META (taula: Versió=SGE 21 edició 2024, Organisme=Forética, Font=certifications/sge21-norma-2024.pdf, Estat=⏳ PENDENT DE VALIDACIÓ DE PAOLO, Darrera actualització=2026-09-02, Plantilla v3)

REGLES:
- CATALÀ, formal, concís
- Els noms dels criteris EXACTES com apareixen a la norma 2024
- Si una dada no surt al text, escriu [pendent de verificar al PDF SGE 21 2024] — NO inventis
- Taules markdown completes
- Màxim ~200 línies

TEXT OFICIAL NORMA SGE 21 (2024):
---
{full_text[:28000]}
---"""

print("Cridant Nemotron 3 Ultra...")
result = call_nemotron(system, user, temperature=0.2, max_tokens=8000)

if result.startswith("__ERROR__"):
    print(f"ERROR: {result}")
    sys.exit(1)

out = Path('standards/sge-21.md')
out.write_text(result, encoding='utf-8')
print(f"✅ Fitxa generada: {out} ({len(result)} chars, {result.count(chr(10))+1} línias)")