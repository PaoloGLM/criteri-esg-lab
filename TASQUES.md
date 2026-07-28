# TASQUES — Gestió de feines Criteri ESG

> **Únic document de tasques**. Actualitzat per GLM en cada sessió.
> Paolo llegeix això a l'inici de cada sessió per veure on som.
> Format: 3 seccions — Pendents, En curs, Completades.

---

## Pendents

### P1 — Disseny PDF dels informes (tancar amb la Roser)
- La plantilla actual serveix com a base però no és el disseny final
- Passos 1-4 del flux funcionen; cal tancar el disseny del PDF del pas 5
- Veure `scripts/PENDENT-DISSENY-INFORME.md`

### P1 — Compte Stripe
- Crear compte i configurar per pagaments amb targeta
- El botó Stripe del formulari /pagament encara no funciona

### P1 — Política de privacitat (revisió legal)
- Revisió específica abans del llançament (setembre 2026)
- Cal cobrir: IA al processament, transferències internacionals, 3 mètodes de login
- Pressupost: 200-400€ amb advocat digital

### P2 — GDPR compliance del flux d'informes
- GLM (Hong Kong) processa text als passos 2 i 4
- Decisió de Paolo: GLM es manté per als passos 2 i 4, Gemini només per contrast i revisió
- Cal documentar-ho a la política de privacitat de forma transparent
- Veure `scripts/PENDENT-GDPR-COMPLIANCE.md`

### P2 — 24 informes pendents de processar
- 29 PDFs originals a Drive, 5 processats (passos 2-3 fets)
- Pendents de disseny PDF per continuar

### P2 — Cron newsletter (Vercel)
- Dijous 12:00h: generar HTML + crear drafts a Brevo automàticament
- Paolo revisa i envia

### P3 — Formulari newsletter independent a la web
- Ara els subscriptors s'apunten via registre d'usuari
- Cal un formulari independent (només email) a la homepage que cridi /api/brevo-subscribe

### P3 — Pla de comunicació LinkedIn
- 10 assets redissenyats a Drive, pendents de publicar

---

## En curs

_(cap)_

---

## Completades (juliol 2026)

- ✅ Newsletter redissenyada (HTML table-based, 2 versions Premium/Free)
- ✅ Migració Beehiiv → Brevo (flux 2 passos: draft + send)
- ✅ Disclaimer IA al footer dels informes
- ✅ Secció "Com processem cada informe" a /que-fem
- ✅ Pàgina /preus com a pàgina independent (no popup)
- ✅ Pàgina /pagament (Stripe + Fiare amb validació OCR Gemini)
- ✅ Validació automàtica de justificants Fiare (Gemini OCR, 4/5 camps)
- ✅ Registre d'usuaris integrat amb Brevo (email + Google OAuth)
- ✅ Flux d'informes passos 1-4 funcionant (GLM + Gemini + Drive)
- ✅ Semàfor metodològic amb popup integrat
- ✅ Generador d'informes /eines/avaluador (Premium)
- ✅ Corrector ortogràfic automatitzat (scripts/corrector.py)
- ✅ Pàgina /mas-alla-del-checkbox (preguntes ètiques)
- ✅ Supabase configurat (auth + BD)
- ✅ Deploy a Vercel via git push
