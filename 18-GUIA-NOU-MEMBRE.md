# Guia d'incorporació per al nou membre de l'equip

> **Benvingut/da a Criteri ESG!** Aquesta guia t'explica com començar a treballar amb el projecte i amb Z.ai-bot (l'assistent d'IA que ens ajuda).

---

## 1. Què és Criteri ESG (resum ràpid)

Criteri ESG és un servei d'intel·ligència ESG que converteix informes institucionals, frameworks i certificacions europees en accions concretes. Cada informe es processa seguint una estructura de **1 targeta + 7 blocs narratius** (8 elements en total).

- **Llançament oficial**: setembre 2026
- **Model**: freemium progressiu amb early bird de 2 mesos
- **Newsletter**: bimensual (dijous a les 15:00h)
- **Preus**: Premium 39€/mes (29€ early bird), Ultra 89€/mes (a partir d'abril 2027)

**El teu rol**: Tech Lead (disseny web, programació Next.js, base de dades, integracions tècniques). També validaràs decisions visuals i de marca.

### Darrers canvis (juliol 2026) que has de conèixer

1. **Bloc 0 — Semàfor Metodològic**: targeta visual amb 5 indicadors que evalua la qualitat metodològica de cada informe (nota A-D). **Format A (targeta compacta vertical)** confirmat com a model oficial. Prova real aplicada a Forética: [`assets/proves-format/`](assets/proves-format/) i [`assets/pilot-informe-foretica/`](../download/) (aquest últim només local, pujat al Drive)
2. **Subsecció "Més enllà del Checkbox"** dins del bloc 4 (Implicacions): 100-150 paraules amb veu editorial crítica. Basada en 5 criteris interns (no públics): dignitat humana, justícia distributiva, sostenibilitat absoluta, co-decisió democràtica, arrelament territorial. **Els marcs teòrics (Felber/Sasia) no s'esmenten públicament** — la veu és de Criteri directament
3. **Carta del Director mensual**: 400-600 paraules escrites per Paolo, a l'inici de l'última newsletter del mes. Empremta ètica personal
4. **17 propostes de logo** ja pujades a `assets/logos/` i al Drive. Finalista v6: Criteri negre + punt coure + hexàgon coure ESG blanc + fons crema. **Pendents de la teva validació** de la tipografia definitiva entre 5 variants (Didot/Garamond/Playfair/Baskerville/Canela)
5. **Estratègies per al nom "Criteri"** en mercats no-catalans: tagline ancorador multilingüe (CAT/ES/IT/EN) + storytelling a "Sobre nosaltres". **Pendents de la teva validació**

### Què et demanem que validis primer

- **Logo v6**: tria tipografia entre les 5 variants disponibles (`assets/logos/logo-v6-a.png` fins a `logo-v6-e.png`)
- **Format A del Semàfor**: obre `assets/proves-format/semafor-format-A-compacte.png` i valida si encaixa amb l'estètica general de la web
- **Storytelling del nom**: llegeix la proposta a `03-BRANDING.md` secció "Naming" i dona la teva opinió sobre com percebràs "Criteri" al mercat espanyol no-català

---

## 2. El teu compte de GitHub

Paolo t'ha donat accés al repositori privat `PaoloGLM/criteri-esg-lab`. Allà hi ha tota la documentació del projecte (17 documents + codi web + scripts).

### Què has de fer

1. **Accepta la invitació** de GitHub (t'ha d'haver arribat per email)
2. **Clona el repositori** al teu ordinador:
   ```bash
   git clone https://github.com/PaoloGLM/criteri-esg-lab.git
   ```
3. **Llegeix el README.md** per veure l'índex complet de documents
4. **Llegeix el CONTEXT.md** — és el document més important. Conté totes les regles d'or, el branding, l'estat del projecte i les decisions editorials
5. **Llegeix els documents 02 (Producte), 03 (Branding), 04 (Web) i 15 (Codi web)** — són els més rellevants per al teu rol

---

## 3. Com parlar amb Z.ai-bot

Z.ai-bot és l'assistent d'IA que ajuda amb:
- Generar continguts (informes, newsletter, HTML, CSS)
- Recerques de mercat i fonts
- Documentació al GitHub
- Codi web (Next.js, components, estils)

### Com començar una sessió amb Z.ai-bot

Cada vegada que obris el xat amb Z.ai-bot (sobretot si és una sessió nova), la primera frase que li has de dir és:

> **"Llegeix el repositori PaoloGLM/criteri-esg-lab. Fes git pull i llegeix el README i el CONTEXT.md abans de respondre."**

Z.ai-bot necessita aquesta instrucció perquè **no recorda el que ha parlat amb Paolo** ni amb tu entre sessions. L'únic cervell compartit és el repositori GitHub.

### Crear el teu token de GitHub per a Z.ai-bot

Perquè Z.ai-bot pugui llegir el repositori des del teu xat, necessita un token de GitHub teu (no el de Paolo). Passos:

1. Ves a https://github.com/settings/tokens?type=beta
2. Clica **Generate new token**
3. **Nom**: `criteri-bot-t-tech`
4. **Expiration**: 1 any
5. **Repository access**: **Only select repositories** → tria `PaoloGLM/criteri-esg-lab`
6. **Repository permissions**:
   - Contents → **Read and write** ✅
   - Issues → **Read and write** ✅
   - Pull requests → **Read and write** ✅
   - Metadata → **Read-only** ✅ (automàtic)
7. Clica **Generate token**
8. **Copia el token** (comença per `github_pat_...`)
9. **Passa'l a Z.ai-bot** al xat la primera vegada que hi parlis (juntament amb la instrucció de llegir el repositori)

Z.ai-bot el guardarà localment i el farà servir per accedir al repositori. Si algun dia vols tallar-li l'accés, només has de revocar el token a la mateixa pàgina de GitHub.

---

## 4. Regles d'or (del CONTEXT.md)

Z.ai-bot té 17 regles d'or permanents. Les més importants per a tu:

1. **To cordial però crític**: Z.ai-bot no et donarà la raó per donar-la. Només estarà d'acord si les idees encaixen.
2. **Advocat del diable obligatori**: en temes complexos, Z.ai-bot afegirà una crítica legítima + possible solució.
3. **No fer res automàticament sense consentiment previ**: si Z.ai-bot vol fer una proposta nova, primer et demanarà permís.
4. **Corrector ortogràfic obligatori**: abans d'enviar qualsevol text en català o castellà, Z.ai-bot el passa per LanguageTool.
5. **Tot al GitHub**: cada decisió, cada codi, cada document. Si no està al GitHub, no existeix.
6. **Mai credencials al xat ni al repositori**: tokens, API keys, contrasenyes van a fitxers locals gitignored.
7. **Commits amb descripcions clares**: en català o castellà.

---

## 5. Què pots demanar a Z.ai-bot

### Tasques tècniques (el teu rol)
- Implementar components React/Next.js
- Crear pàgines web noves
- Integrar Supabase (auth + base de dades)
- Integrar Stripe (pagaments)
- Integrar Beehiiv API (newsletter)
- Corregir bugs
- Optimitzar SEO, rendiment, accessibility
- Crear scripts Python/Node

### Tasques de contingut
- Generar informes amb els 7 blocs
- Crear esborranys de newsletter
- Fer recerques de fonts
- Redactar documentació

### Què NO ha de fer Z.ai-bot sense consultar Paolo
- Canviar preus
- Canviar dates de llançament
- Modificar relacions amb tercers (clústers, consultories, universitats)
- Pujar codi a producció sense revisió

---

## 6. El codi web

El codi complet de la web està al repositori a `assets/web/src/`. Per treballar-hi:

1. **Inicialitzar el projecte Next.js**:
   ```bash
   curl -s https://z-cdn.chatglm.cn/fullstack/init-fullstack.sh | bash
   ```

2. **Copiar el codi existent**:
   ```bash
   cp -r assets/web/src/* /home/z/my-project/src/
   ```

3. **Verificar**: obrir http://localhost:3000

El stack és: **Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui**. Tots els components shadcn/ui ja estan instal·lats.

### Estructura del codi

```
src/
├── app/
│   ├── layout.tsx              # Layout + fonts + LanguageProvider
│   ├── globals.css             # Paleta terra+coure + tipografia
│   └── page.tsx                # Homepage principal
├── components/
│   ├── language-provider.tsx   # Context bilingüe CAT/ES
│   ├── site-header.tsx         # Header sticky + nav + toggle idioma
│   ├── site-footer.tsx         # Footer
│   ├── register-dialog.tsx     # Modal de registre
│   ├── report-dialog.tsx       # Modal amb 7 blocs de l'informe
│   └── sections/
│       ├── hero.tsx            # Hero + 4 cards seccions
│       ├── mid-sections.tsx    # Speed + Format + Autodiagnòstic + FAQ
│       ├── certifications.tsx  # Grid 6 certificacions
│       ├── reports-library.tsx # Biblioteca informes + filtres
│       └── final-cta.tsx       # Doble CTA
└── lib/
    ├── i18n.ts                 # Traduccions CAT/ES (80+ claus)
    └── reports.ts              # Catàleg 10 informes reals 2026
```

### Paleta de colors

| Element | Color |
|---------|-------|
| Fons | `#F5EFE6` (terra clara) |
| Text principal | `#2C1810` (marró fosc) |
| Accent | `#B87333` (coure) |
| Accent fons | `#8A5526` (coure fosc) |
| Línies/separadors | `#C9B89A` (sorra) |

### Tipografia

- **Titulars**: Fraunces (serif)
- **Cos**: Inter (sans-serif)
- **Dades/mono**: JetBrains Mono

---

## 7. Branding

- **Nom**: Criteri ESG
- **Logo (provisional)**: `Criteri.` amb punt en coure (Fraunces 24px, weight 600)
- **Eslògan**: "5 minuts per obtenir un criteri clar d'un informe." (Eslògan antic "7 minuts per estalviar 5 hores" OBSOLET — veure decisió editorial 17 del CONTEXT.md)
- **Llengua**: bilingüe català/castellà (toggle al header). Traducció a euskera i gallec en fase posterior.

---

## 8. Tasques pendents prioritàries (juliol 2026)

### Validacions que et demanem (primeres 48h)
1. **Logo v6**: tria la tipografia definitiva entre les 5 variants (`assets/logos/logo-v6-a.png` fins `logo-v6-e.png`)
2. **Format A del Semàfor Metodològic**: valida si encaixa amb l'estètica web (`assets/proves-format/semafor-format-A-compacte.png`)
3. **Storytelling del nom "Criteri"** per mercats no-catalans (llegeix `03-BRANDING.md` secció "Naming")

### Desenvolupament web (juliol-agost 2026)
1. Tancar disseny final de la homepage (iterar sobre la versió actual)
2. Implementar pàgines internes: `/informes/[slug]`, `/sobre-nosaltres`, `/faq`, `/preus`, `/carta-director`
3. Implementar el component **Semàfor Metodològic** (Format A) per mostrar-lo a la pàgina de cada informe i al PDF
4. Implementar la subsecció **"Més enllà del Checkbox"** dins del bloc 4 amb estil visual diferenciat (capçalera coure)
5. Implementar Supabase (auth + PostgreSQL + Prisma)
6. Integrar Stripe (sense activar pagaments encara)
7. Implementar autenticació (Supabase Auth)
8. Optimitzar SEO (meta tags, sitemap, structured data)
9. Provar la web amb beta testers (agost)

### Pagaments, facturació i operacions (juliol-agost 2026)

**Crawler + automatització d'informes** (veure `04-WEB.md` secció "Arquitectura d'automatització"):
1. Implementar crawler automàtic (Vercel Cron, dilluns + dijous matí) — Scrapy + BeautifulSoup
2. Integrar Z.ai-bot API al backend per processar informes nous (8 blocs automàtics + corrector)
3. Implementar mini dashboard admin per en Paolo (veure usuaris, validar informes, canviar status subscrípits)

**Sistema de pagament** (veure `07-DECISIONS.md` decisió 5 juliol 2026 "Stripe + Fiare"):
4. Configurar Stripe (compte + webhooks + facturació automàtica)
5. Implementar formulari Fiare real (mockup a `assets/web/public/fiare-form-mockup.html`) amb Supabase Storage per comprovants
6. Obrir compte a Fiare Banca Ètica (en Paolo ho fa, tu esperes IBAN real per substituir al formulari)
7. Implementar mini dashboard admin per en Paolo (veure usuaris, canviar status Premium → Free si problema amb Fiare)

**Generació automàtica de rebuts i factures** (veure `02-PRODUCTE.md` secció "Generació automàtica de rebuts i factures"):
8. Crear plantilla PDF rebut simplificat (pdfkit o jsPDF)
9. Crear plantilla PDF factura completa (amb dades fiscals + IVA desglossat)
10. Implementar generació automàtica al flux de pagament (Fiare + Stripe)
11. Implementar enviament per email (Resend — servei d'email transaccional)
12. Crear taula `documents_fiscals` a Supabase (id, user_id, tipus, número, data, import, iva, concepte, metode_pagament, pdf_path)
13. Crear bucket privat `documents-fiscals` a Supabase Storage
14. Implementar àrea d'usuari `/compte/documents` per descarregar històric
15. Implementar exportació CSV per a declaracions trimestrals d'en Paolo
16. Implementar nota d'abonament (si en Paolo reverteix a Free per problema)

**Crons de subscripcions**:
17. Implementar cron d'avís 30 i 7 dies abans de caducar subscrípits Fiare
18. Implementar cron de caducitat automàtica (si no renova → Free)

---

## 9. Comunicació amb Paolo

- **Decisions estratègiques** (preus, dates, col·laboracions): parla primer amb Paolo. Després ell consulta amb Z.ai-bot si cal.
- **Decisions tècniques** (stack, arquitectura, disseny): pots parlar directament amb Z.ai-bot.
- **GitHub**: totes les decisions queden registrades al repositori. Fes commits sovint amb missatges descriptius.

---

## 10. Resum en 5 passos

1. **Accepta la invitació** de GitHub
2. **Clona el repositori** i llegeix README.md + CONTEXT.md
3. **Crea el teu token** de GitHub i passa'l a Z.ai-bot
4. **Cada vegada que parlis amb Z.ai-bot**, comença amb: "Llegeix el repositori PaoloGLM/criteri-esg-lab. Fes git pull i llegeix el README i el CONTEXT.md."
5. **Treballa**: disseny, programació, base de dades. Tot el que facis, commit al GitHub.

---

## Dubtes?

Si tens qualsevol dubte sobre el projecte, el codi, o com treballar amb Z.ai-bot, pregunta sense problema. Paolo i Z.ai-bot estan per ajudar-te.

**Benvingut/da a l'equip!**
