import sys
sys.path.insert(0, 'scripts')
from nemotron_client import call_nemotron

prompt = """Ets un expert en B Corp (B Lab). Genera el fitxer `standards/b-corp.md` basant-te EN el PDF `certifications/b-corp-bia-v6.pdf` (BIA v6).

REGLAS ESTRICTES:
1. Mateixa estructura: 8 seccions + META (plantilla v3 - igual que gri.md, csrd-esrs.md, etc.)
2. Secció 1: Què és + abast + a qui obliga
3. Secció 2: Estructura (components clau) + 2b. MAPA TEMÀTIC amb taula: tema | requisits concrets (criteris BIA v6) + documents a certifications/
3. Secció 3: Interoperabilitat (GRI, CSRD/ESRS, SASB, MSCI, ISSB/IFRS S2, TCFD, CDP, TNFD, ISO 26000...)
4. Secció 4: VIGILÀNCIA DE CANVIS amb dates i enllaços VERIFICABLES. Inclou: BIA v6 (2024), BIA v7 (en desenvolupament), B Lab Standards v2.2 (2026-02-20), B Corp Certification requirements
4. Secció 5: Punts d'impacte típics
5. Secció 6: Accions tipus que s'en deriven
6. Secció 7: CRITERIS D'INTENSITAT (Alt/Mitjà/Baix)
7. Secció 8: META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)
8. MAI inventis enllaços ni dades. Si no està al doc, posa "[pendent de verificar al PDF B Corp]"
9. Idioma: català. Capçalera "DOCUMENT INTERN — NO PÚBLIC"
9. Font única: PDF `certifications/b-corp-bia-v6.pdf` (BIA v6, 7.8 MB)

ESTRUCTURA PLANTILLA V3 (8 seccions + META):
1. RESUM EXECUTIU
2. ESTRUCTURA (inclou 2b. MAPA TEMÀTIC)
3. INTEROPERABILITAT
4. VIGILÀNCIA DE CANVIS
5. PUNTS D'IMPACTE TÍPICS
6. ACCIONS TÍPIQUES QUE S'EN DERIVEN
7. CRITERIS D'INTENSITAT
8. META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

COBRIR (segons BIA v6 / B Lab Standards v2.2):
- 5 àrees d'impacte: Governança, Treballadors, Comunitat, Medi Ambient, Clients
- Requisits legals (Legal Requirement), BIA, Disclosure Questionnaire
- Minimum Safeguards, Risk Profile
- B Corp Certification process, recertification (3 anys)
- B Lab Standards v2.2 (2026-02-20) - 7 Impact Topics
- Document a certifications/: b-corp-bia-v6.pdf

Genera el fitxer COMPLET en MARKDOWN. Català, sols contingut markdown."""

print("Generant b-corp.md (fitxa expert estàndard)...")

from nemotron_client import call_nemotron

result = call_nemotron(
    system_prompt="Ets un expert en B Corp. Genera el fitxer `standards/b-corp.md` seguint la plantilla v3 (8 seccions + META). Català. No inventis dades. Si no està al PDF: [pendent de verificar al PDF B Corp]. Retorna MARKDOWN pur, no JSON.",
    user_prompt="""Genera el fitxer COMPLET `standards/b-corp.md` seguint la plantilla v3 (8 seccions + META).

1. RESUM EXECUTIU: Què és B Corp, abast, a qui obliga
2. ESTRUCTURA: components clau + 2b. MAPA TEMÀTIC (taula: tema | requisits concrets BIA v6 | documents certifications/)
3. INTEROPERABILITAT (GRI, CSRD/ESRS, SASB, MSCI, ISSB/IFRS S2, TCFD, CDP, TNFD, ISO 26000)
4. VIGILÀNCIA DE CANVIS (dates/enllaços verificables: BIA v6 2024, BIA v7 desenvolupament, B Lab Standards v2.2 2026-02-20, Certification requirements)
5. PUNTS D'IMPACTE TÍPICS
6. ACCIONS TÍPIQUES QUE S'EN DERIVEN
7. CRITERIS D'INTENSITAT (Alt/Mitjà/Baix)
8. META (⏳ PENDENT DE VALIDACIÓ DE PAOLO)

COBRIR: 5 àrees impacte (Governança, Treballadors, Comunitat, Medi Ambient, Clients), Requisits legals, BIA, Disclosure Questionnaire, Minimum Safeguards, Risk Profile, Certificació/recertificació 3 anys, B Lab Standards v2.2 (7 Impact Topics).
Font única: PDF `certifications/b-corp-bia-v6.pdf` (BIA v6).
Català. No inventis. [pendent de verificar al PDF B Corp] si no està.
Capçalera: DOCUMENT INTERN — NO PÚBLIC

Retorna MARKDOWN pur, no JSON.""",
    temperature=0.2, max_tokens=16000
)

if result:
    with open("standards/b-corp.md", "w", encoding="utf-8") as f:
        f.write(result)
    print(f"✅ Completat ({len(result)} chars)")
else:
    print("❌ Fallat")