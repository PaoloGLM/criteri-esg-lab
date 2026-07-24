# TASQUES — Recordatoris ràpids per Z.ai-bot

> Quan Paolo vol deixar una feina ràpida, escriu una línia aquí.
> Quan vol deixar una feina gran, crea un GitHub Issue.
> Z.ai-bot llegeix aquest fitxer a l'inici de cada sessió.

---

## Pendents

### P1 — Repensar la newsletter perquè sigui diferencial (gratis + Premium)
- Versió gratis: resum executiu + 1 connexió + CTA Premium
- Versió Premium: informe complet + cross-reference + accions + notícies ESG + inversió ESG
- Plataforma: Beehiiv
- Freqüència: bimensual, dijous 15:00h

### P2 — Preguntes ètiques per treballar en equip
- Definir format concret (quantitat, periodicitat, format de resposta)
- Decidir si és apartat de newsletter Premium o eina independent
- Redactar primeres preguntes (Paolo lidera el contingut ètic)

### P3 — Implementar pàgina /estandares-esg
- Pàgina principal: grid de 12 estàndards amb 3 colors (regulacions, frameworks, certificacions)
- Pàgina de detall /[slug]: taula cross-reference + filtres + accions recomanades
- Mockup aprovat: /home/z/my-project/download/estandares-mockup.png
- Esquema al CONTEXT.md (P3)

### P4 — Flux de creació d'informes (GLM + Gemini + Paolo)

**7 passos** (decidit 24 juliol 2026, substitueix la versió anterior de P4):

1. **GLM detecta** informes nous a les fonts i els posa a una carpeta de Google Drive
2. **GLM destil·la** la informació dels 8 apartats (segons METODOLOGIA.md) i els posa a una altra carpeta de Drive
3. **Gemini revisa** l'informe original + el destil·lat de GLM, fa propostes de valor per afegir o modificar i fa d'advocat del diable. Ho posa a la carpeta
4. **GLM llegeix** les aportacions de Gemini, decideix què és rellevant i què no, i elabora l'informe final. El posa a una altra carpeta d'informes fets
5. **Gemini revisa** ortogràficament l'informe (català i castellà) i canvia el que calgui
6. **Paolo llegeix** els informes creats i els valida
7. **GLM puja** els informes validats a la web

**Estructura de carpetes a Drive**:
- `informes/0-originals/` — PDFs descarregats per GLM al pas 1
- `informes/1-distilats/` — destil·lats dels 8 apartats (pas 2)
- `informes/2-aportacions-gemini/` — propostes + advocat del diable (pas 3)
- `informes/3-fets/` — informes redactats per GLM (pas 4)
- `informes/4-revisats-ortografia/` — informes amb ortografia corregida per Gemini (pas 5)
- `informes/5-validats-paolo/` — informes que Paolo ha validat (pas 6), pendents de pujar
- `informes/6-publicats/` — informes ja pujats a la web (pas 7)

**Pendents per implementar**:
- Paolo: crear API key de Gemini a Google AI Studio (variable `GEMINI_API_KEY`)
- GLM: scripts `glm-detecta.py`, `glm-distil·la.py`, `gemini-revisa.py`, `glm-redacta.py`, `gemini-ortografia.py`, `glm-puja.py`
- GLM: estructura de carpetes a Google Drive

### P5 — Descarregar B Corp B Impact Assessment
- La web de B Corp bloqueja la descàrrega automàtica (403)
- Paolo ha de descarregar-lo manualment des de https://www.bcorporation.net/en-us/standards/
- Guardar a /criteri-esg-lab/certifications/b-impact-assessment.pdf

### P6 — Processar 5 informes pilot amb 8 blocs complets
- Els blocs 3 i 5 tenen placeholder en alguns informes
- Seguir METODOLOGIA.md rigorosament
- Passar corrector LanguageTool
- Paolo farà validació final

---

## Completades

_(buida)_
