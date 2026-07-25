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

### P4 — Flux de creació d'informes (GLM + Gemini + Paolo) — PARCIALMENT IMPLEMENTAT

**Flux oficial**: veure `scripts/FLUX-INFORMES.md` per al detall complet.

**Estat actual (juliol 2026)**:
- ✅ Passos 1-4 funcionen (GLM detecta, GLM destil·la, Gemini revisa, GLM redacta)
- ⏸ **Pendent**: disseny de l'informe PDF — tancar amb la Roser. Veure `scripts/PENDENT-DISSENY-INFORME.md`
- ⏸ Passos 5-7 congelats fins que el disseny estigui tancat

**No processar més informes** fins que el disseny de la plantilla PDF estigui validat per la Roser.

**7 passos** (cada pas escriu a una carpeta de Drive per auditabilitat):

1. **GLM detecta** informes nous → `Drive /informes/0-originals/`
2. **GLM destil·la** (8 apartats segons METODOLOGIA.md) → `/informes/1-distilats/`
3. **Gemini revisa** (crític + advocat del diable) → `/informes/2-aportacions-gemini/`
4. **GLM redacta** (Markdown CA+ES integrant aportacions) → `/informes/3-fets/`
5. **Gemini ortografia** (corregeix Markdown CA+ES) → genera PDF amb plantilla oficial → `/informes/4-revisats-ortografia/`
6. **Paolo valida** (llegeix el PDF, mou els aprovats) → `/informes/5-validats-paolo/`
7. **GLM puja** els validats a la web → `/informes/6-publicats/`

**Actors i eines**:
- GLM (Z.ai-bot) — passos 1, 2, 4, 7 — via `z-ai-web-dev-sdk`
- **Gemini 2.5 Flash** (NO 2.0-flash, retirat per Google) — passos 3, 5 — via **Vertex AI europe-west1** amb Service Account `criteri-bot@criteri-esg.iam.gserviceaccount.com` (rol `Vertex AI User`)
- Paolo — pas 6 (validació humana obligatòria)

**Pujada a Drive**: OAuth d'usuari (no Service Account, que no té quota). Tokens a `/home/z/my-project/.gcp-oauth-tokens.json`, es refresquen automàticament.

**PDFs a carpeta 4**: generats amb la **plantilla HTML oficial** Criteri ESG (paleta terra+coure, fonts Fraunces+Inter+JetBrains Mono). Paolo només ha de obrir el PDF i validar.

**Scripts** (a `/scripts/`):
- `02-glm-distilla.py`, `03-gemini-revisa.py`, `04-glm-redacta.py`, `05-gemini-ortografia.py`
- `genera-pdf-informe.py` (Markdown → HTML oficial → PDF via weasyprint)
- `puja-a-drive.py` (puja PDFs i MDs a Drive carpeta 4)
- `drive_user_client.py` (client OAuth Drive)
- `gemini_client.py` (client Vertex AI)
- `glm_client.py` (client GLM via subprocess Node)

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
