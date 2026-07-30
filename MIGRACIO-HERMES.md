# Guia de migració a Hermes Agent

> Aquest document permet que qualsevol agent d'IA (Hermes o altre) entengui el projecte Criteri ESG i pugui començar a treballar immediatament.

---

## 1. Què és Criteri ESG

Criteri ESG és un servei d'intel·ligència ESG que sintetitza informes institucionals europeus sobre sostenibilitat en 8 blocs accionables per a directors de sostenibilitat i consultories.

**Eslògan**: «5 minuts per criteri clar»

**Equip**: Paolo (CEO, estratègia, decisions) + GLM/Z.ai-bot (assistència tècnica, codi, continguts) + Roser (disseny, tech lead)

---

## 2. On és tot

### Repositori GitHub
```
https://github.com/PaoloGLM/criteri-esg-lab
```
Token amb permís workflow: `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`

### Estructura del repo
```
criteri-esg-lab/
├── assets/web/           # Web Next.js (deploy a Vercel)
│   ├── src/app/          # Pàgines i API routes
│   ├── src/lib/          # i18n, auth, supabase
│   ├── src/components/   # Components React
│   └── .env.local        # Credencials locals (NO al git)
├── scripts/              # Scripts Python del flux d'informes
│   ├── setup.sh          # Arrencada automàtica del workspace
│   ├── 02-glm-distilla.py    # Pas 2: GLM destil·la
│   ├── 03-gemini-revisa.py   # Pas 3: Gemini crític
│   ├── 04-glm-redacta.py     # Pas 4: GLM redacta
│   ├── 05-gemini-ortografia.py # Pas 5: Gemini ortografia
│   ├── newsletter-generator.py  # Genera newsletter
│   ├── brevo_client.py    # Client API Brevo (newsletter)
│   ├── gemini_client.py   # Client Vertex AI europe-west1
│   ├── glm_client.py      # Client GLM via subprocess Node
│   ├── drive_user_client.py # Client Google Drive (OAuth usuari)
│   ├── corrector.py       # Corrector ortogràfic amb Gemini
│   └── config.py          # Config central
├── data/informes/        # Dades del flux d'informes (al git)
│   ├── 0-originals/       # PDFs originals
│   ├── 1-distilats/       # JSON destil·lats
│   ├── 2-aportacions-gemini/ # Aportacions crítiques
│   ├── 3-fets/            # Markdown redactats
│   ├── 4-revisats-ortografia/ # Corregits + PDF
│   ├── 5-validats-paolo/  # Validats per Paolo
│   └── 6-publicats/       # Pujats a la web
├── .github/workflows/    # GitHub Actions (newsletter + informes)
├── certifications/        # Documents de certificacions ESG
├── CONTEXT.md            # Document mestre (LLEGIR PRIMER)
├── TASQUES.md            # Pendents i completades
├── worklog.md            # Log de canvis per sessió
├── METODOLOGIA.md        # Com es processa cada informe
├── DESIGN_SYSTEM.md      # Sistema visual de la web
└── 07-DECISIONS.md       # Decisions editorials
```

---

## 3. Documents que cal llegir (en ordre)

1. **`CONTEXT.md`** — context complet del projecte, regles, decisions
2. **`TASQUES.md`** — què està pendent i què està fet
3. **`worklog.md`** — què s'ha fet les últimes sessions
4. **`scripts/FLUX-INFORMES.md`** — el flux de 7 passos (GLM + Gemini + Paolo)
5. **`METODOLOGIA.md`** — com es construeix cada bloc dels informes
6. **`DESIGN_SYSTEM.md`** — paleta, tipografies, components

---

## 4. Arrencada del workspace

```bash
# 1. Clonar o actualitzar el repo
cd /home/z/my-project/criteri-esg-lab
git fetch origin && git reset --hard origin/main

# 2. Arrencada automàtica (crea venv, .env.local, descarrega PDFs)
bash scripts/setup.sh
```

### Credencials necessàries

| Servei | Fitxer/Variable | On és |
|--------|----------------|-------|
| Google Cloud (Service Account) | `/home/z/my-project/.gcp-service-account.json` | Ja al workspace |
| Google Cloud (OAuth usuari) | `/home/z/my-project/.gcp-oauth-tokens.json` | **CADUCAT** — cal reautenticar |
| Google Cloud (OAuth client) | `/home/z/my-project/.gcp-oauth-client.json` | Ja al workspace |
| Brevo | `BREVO_API_KEY` al `.env.local` | `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` |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Al Vercel dashboard |
| Supabase (service role) | `SUPABASE_SERVICE_ROLE_KEY` | Al Vercel dashboard |
| GitHub (workflow) | Token `github_pat_11CGZPKUQ00YwXoRgEAKqD_...` | Al repo com a secret |
| Vercel deploy hook | `VERCEL_DEPLOY_HOOK` | Al `.env` (pendent configurar) |

### Secrets de GitHub (per als workflows)

| Secret | Valor |
|--------|-------|
| `GEMINI_API_KEY` | `AQ.Ab8RN6LqweS2U-2sD_1_TMkoNtq1fU2GtyzgCNUs09W6yLAMIg` |
| `GCP_SERVICE_ACCOUNT` | Contingut JSON del service account (base64 o directe) |
| `GCP_OAUTH_TOKENS` | Contingut JSON dels OAuth tokens (base64) |
| `GCP_OAUTH_CLIENT` | Contingut JSON del OAuth client (base64) |
| `BREVO_API_KEY` | `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` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://zecoacfysdwtjiszruir.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Al dashboard de Supabase → Settings → API) |

---

## 5. Serveis i configuració

### Web (Next.js)
- **Host**: Vercel (auto-deploy amb git push a main)
- **URL**: https://criteriesg.com (darrere basic auth: `criteri:esg2026` en dev)
- **Stack**: Next.js 16, React 19, Tailwind CSS 4, Supabase Auth, Prisma
- **Build**: `cd assets/web && bun run build`
- **Dev**: `cd assets/web && bun run dev` (port 3000)

### Supabase
- **URL**: `https://zecoacfysdwtjiszruir.supabase.co`
- **Taules**: `profiles`, `subscriptions`, `documents_fiscals`, `newsletter_subscribers`, `report_views`, `payments_fiare`
- **Auth**: email+password, Google OAuth, magic link
- **Storage**: bucket `justificants-fiare` (per justificants de pagament)

### Gemini (Vertex AI)
- **Projecte**: `criteri-esg`
- **Regió**: `europe-west1` (Bèlgica, GDPR compliant)
- **Model actual**: `gemini-2.5-flash` (pendent migrar a 3.5/3.6 Flash abans d'octubre 2026)
- **Ús**: pas 3 (crític + advocat del diable), pas 5 (ortografia), validació justificants Fiare, corrector ortogràfic
- **Auth**: Service Account `criteri-bot@criteri-esg.iam.gserviceaccount.com` (rol: Vertex AI User)

### GLM (Z.ai)
- **Ús**: pas 2 (destil·lació), pas 4 (redacció), codi, conversa
- **SDK**: `z-ai-web-dev-sdk` (Node, via subprocess des de Python)
- **Limitació**: servidors a Hong Kong (GDPR pendent)

### Brevo (newsletter)
- **Empresa**: francesa, GDPR compliant
- **Sender**: `info@criteriesg.com`
- **Llista**: "Criteri ESG Newsletter" (ID: 3)
- **API**: free plan, 300 emails/dia
- **Flux**: `create_campaign_draft()` → Paolo revisa → `send_campaign()` o des del dashboard

### Google Drive
- **2 carpetes arrel**:
  - `Criteri ESG` — newsletters, assets, documents (no informes)
  - `Criteri ESG Informes` — flux d'informes (7 subcarpetes 0-6)
- **Pujada**: OAuth d'usuari (NO Service Account, que no té quota)
- **OAuth**: **CADUCAT** — cal reautenticar

### GitHub Actions
- **Workflow 1**: `newsletter.yml` — dijous 12:00 UTC, genera newsletter + drafts Brevo
- **Workflow 2**: `process-informes.yml` — dilluns+dijous 8:00 UTC, processa informes (PENDENT arreglar: cal Node + z-ai-web-dev-sdk)
- **Cost**: 0€ (free, 2000 min/mes)

---

## 6. Flux de creació d'informes (7 passos)

```
1. GLM detecta  →  PDFs a Drive /0-originals/
2. GLM destil·la  →  JSON a /1-distilats/
3. Gemini revisa  →  JSON a /2-aportacions-gemini/ (crític + advocat del diable)
4. GLM redacta  →  Markdown a /3-fets/ (integra aportacions)
5. Gemini ortografia  →  Markdown corregit + PDF a /4-revisats-ortografia/
6. Paolo valida  →  mou a /5-validats-paolo/
7. GLM puja a la web  →  mou a /6-publicats/
```

**Principis**:
- Cap informe publicat sense validació humana
- Gemini té doble rol: crític (pas 3) i corrector (pas 5)
- GLM no publica mai sol

---

## 7. Regles importants

1. **Llengua**: respondre sempre en l'idioma de Paolo (català o castellà)
2. **Web per defecte en castellà** (decisió editorial 14)
3. **Newsletter per defecte en castellà** (decisió editorial 12)
4. **Commit immediat** després de cada canvi (no perdre feina per reset)
5. **No canviar la paleta de colors** sense permís explícit (paleta terra+coure)
6. **Logo**: NO tocar (Paolo va dir explícitament que no)
7. **5 minuts per criteri clar** — eslògan oficial (no "7 minuts")
8. **Màxim 1.100 paraules** per informe (regla absoluta)
9. **Veus ètiques**: els 5 criteris (dignitat, justícia distributiva, sostenibilitat absoluta, co-decisió, arrelament) s'inspiren en Economia del Bé Comú i Economia Ciutadana — **MAI** esmentar aquests marcs públicament
10. **Corrector ortogràfic obligatori** abans de publicar qualsevol text

---

## 8. Pendents actuals (juliol 2026)

Veure `TASQUES.md` per la llista completa. Els més urgents:

1. **OAuth Drive caducat** — cal reautenticar per pujar fitxers a Drive
2. **Workflow informes** — cal afegir Node + z-ai-web-dev-sdk al workflow de GitHub Actions
3. **Disseny PDF dels informes** — pendent de tancar amb la Roser
4. **Migració Gemini 2.5 → 3.5/3.6 Flash** — abans d'octubre 2026
5. **Compte Stripe** — per pagament amb targeta
6. **Política de privacitat** — revisió legal abans del llançament (setembre 2026)

---

## 9. Com cridar GLM via API des d'Hermes

### Opció A: z-ai-web-dev-sdk (Node)

```javascript
const ZAI = require('z-ai-web-dev-sdk').default;

async function callGLM(systemPrompt, userPrompt) {
    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
    });
    return completion.choices[0]?.message?.content;
}
```

### Opció B: Python via subprocess (com fan els scripts actuals)

```python
import subprocess, json, tempfile

NODE_SCRIPT = """
const ZAI = require('z-ai-web-dev-sdk').default;
async function main() {
    const input = JSON.parse(require('fs').readFileSync(process.argv[2], 'utf-8'));
    const zai = await ZAI.create();
    const c = await zai.chat.completions.create({
        messages: [
            { role: 'system', content: input.system },
            { role: 'user', content: input.user },
        ],
        temperature: input.temperature || 0.4,
    });
    process.stdout.write(c.choices[0]?.message?.content || '');
}
main();
""";

def call_glm(system_prompt, user_prompt, temperature=0.4):
    payload = json.dumps({"system": system_prompt, "user": user_prompt, "temperature": temperature})
    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        f.write(payload)
        path = f.name
    with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
        f.write(NODE_SCRIPT)
        script = f.name
    result = subprocess.run(['node', script, path], capture_output=True, text=True, timeout=600,
        cwd='/home/z/my-project', env={'PATH': '/usr/local/bin:/usr/bin:/bin', 'NODE_PATH': '/home/z/my-project/node_modules'})
    return result.stdout
```

### Opció C: HTTP directa (si Z.ai exposa una API REST)

```python
import requests
# Depèn de l'endpoint que Z.ai ofereixi per a crides directes
# Consultar https://z.ai/docs per més info
```

---

## 10. Procediment per començar amb Hermes

1. **Llegir aquest document** i després `CONTEXT.md`
2. **Executar `bash scripts/setup.sh`** per preparar el workspace
3. **Provar una tasca simple**: generar una newsletter amb `python scripts/newsletter-generator.py 1`
4. **Provar una crida a Gemini**: `python scripts/gemini_client.py` (test de connexió)
5. **Provar una crida a Brevo**: `python scripts/brevo_client.py` (test de connexió)
6. **Reautenticar OAuth de Drive**: cal fer el flux OAuth de nou (ves a https://console.cloud.google.com/apis/credentials → OAuth consent screen → crea nou token)
7. **Començar a treballar** seguint `TASQUES.md`
