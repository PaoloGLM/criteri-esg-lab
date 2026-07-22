# log.md — Registre cronològic d'operacions

> Registre **append-only** de totes les operacions de mantenance del projecte Criteri ESG: ingests d'informes, lints, querys destacades, decisions operatives. Cada entrada comença amb `## [YYYY-MM-DD] tip | Títol` per poder-la parsejar amb `grep "^## \[" log.md | tail -10`.
>
> **No confondre amb**:
> - [`06-INFORMES-PILOTO.md`](06-INFORMES-PILOTO.md): llistat de quins informes hi ha (catàleg estàtic)
> - [`07-DECISIONS.md`](07-DECISIONS.md): log de decisions estratègiques (data + raonament)
> - Aquest `log.md`: registre cronològic d'**operacions** (ingests, lints, querys destacades)
>
> **Tipus d'entrada vàlids**:
> - `ingest` — processem un informe nou amb 7 blocs
> - `lint` — health-check del sistema (contradiccions, orphans, claims desactualitzats)
> - `query` — pregunta destacada que ha aportat coneixement reutilitzable
> - `wiki-update` — actualització de pàgines wiki (connexions, cross-ref, temes)
> - `ops` — operació de mantenance (Drive, fonts, scripts, etc.)

---

## [2026-07-04] ops | Actualització CONTEXT.md amb incorporació de la Roser

Registre de la incorporació de la Roser (Tech Lead, GitHub: roserpasc) amb tractament femení. Actualitzades regles de tractament per a ella i en Paolo.

---

## [2026-07-04] ops | Creació log.md i index.md (patró Karpathy, fase mìnima)

Implementació de la fase mínima del patró LLM Wiki (Andrej Karpathy, https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f). S'han creat dos fitxers nous:
- `log.md` (aquest) — registre cronològic d'operacions
- `index.md` — catàleg de pàgines wiki intel·lectuals (connexions, contradiccions, temes transversals)

Decisió estratègica registrada a `07-DECISIONS.md`: la implementació completa (wiki de connexions automatitzada + wiki de certificacions + lint mensual) queda **Phase 2 (post-llançament, oct/nov 2026)** quan la biblioteca arribi a 20+ informes. Durant juliol-agost només es manté aquesta fase mínima (log + index) com a traçabilitat.

---

## [2026-07-04] ingest | Pilot Forética Tendencias ESG 2026 amb Format A + Més enllà del Checkbox

Processem l'informe Forética Tendencias ESG 2026 aplicant per primer cop el Format A del Semàfor Metodològic i la subsecció "Més enllà del Checkbox".

**Semàfor resultant**: C — Feble metodològicament (2 grocs + 1 verd + 2 grocs)
- Sense verificació externa (Forética és autor i promotor)
- Granularitat només regional, no per sector
- Scope 3 mencionat però no quantificat

**Criteris del "Més enllà del Checkbox"** triats: Justícia distributiva + Arrelament territorial
- Es qüestiona la "creació de valor" abstracta sense tocar la ràtio salarial CEO/treballador
- Es critica que l'aigua es presenti com a xifra global sense mapejar conques o comunitats
- Veu editorial sense mencions públiques als marcs teòrics (Felber/Sasia)

**Fitxers generats**:
- `assets/proves-format/semafor-format-A-compacte.{html,png}` (prova aïllada del format)
- `/home/z/my-project/download/pilot-informe-foretica-amb-semafor-i-mes-enlla.{html,pdf,png}` (informe complet pilot)
- 5 captures per secció: `pilot-01-semafor.png` fins `pilot-05-xref-final.png`
- Pujat al Drive (carpeta `pilot-informe-foretica`)

---

## [2026-07-03] wiki-update | Confirmació Format A del Semàfor + marcs teòrics com a criteris interns

Decisió: Format A (targeta compacta vertical) confirmat com a model oficial del Semàfor. Format B (barra horitzontal) descartat però disponible a `assets/proves-format/`.

Els marcs teòrics (Economia del Bé Comú de Felber + Economia Ciutadana de Sasia) passen a ser **criteris interns no públics**. Mencions eliminades del storytelling de marca i de l'exemple de "Més enllà del Checkbox". La veu editorial parla sempre en nom de Criteri directament.

---

## [2026-07-03] ingest | Creació Carta del Director mensual

Afegida nova peça editorial: Carta del Director mensual, escrita per Paolo, 400-600 paraules, a l'inici de l'última newsletter del mes. Complementària al "Més enllà del Checkbox" (que és estructural i a cada informe). La carta és personal, ètica, no neutral.

Roadmap editorial provisional:
- Setembre 2026: "Per què Criteri, per què ara"
- Octubre 2026: "El verdader cost del greenwashing"
- Novembre 2026: "Quan la 'S' deixa de ser social"
- Desembre 2026: "Balanç de l'any i propòsits per al 2027"

---

## [2026-07-03] ingest | Canvi de marc: Economia Civil → Economia del Bé Comú + Economia Ciutadana

Substitució del marc conceptual "Economia Civil" per "Economia del Bé Comú (Felber) + Economia Ciutadana (Sasia, Deusto)". Nous 5 criteris operacionals per "Més enllà del Checkbox":
1. Dignitat humana
2. Justícia distributiva
3. Sostenibilitat absoluta
4. Co-decisió democràtica
5. Arrelament territorial

---

## [2026-07-03] ingest | Bloc 0 — Semàfor Metodològic + "Més enllà del Checkbox"

Diferenciació estratègica adoptada (adaptació de 2 idees de Gemini):
1. **Bloc 0 — Semàfor Metodològic**: targeta visual amb 5 indicadors (Scope 3, terminis, fonts, granularitat, verificació) + nota A-D. Diferenciació principal vs competidors.
2. **Subsecció "Més enllà del Checkbox"** dins del bloc 4 (Implicacions): 100-150 paraules amb veu ètica crítica basada en 5 criteris.

Es descarten 7 idees addicionals de Gemini (pasaporte corporatiu, mapeig de contradiccions, autoavaluació inversa amb dilemes) per càrrega editorial insostenible. Queden al roadmap com a features Ultra 2027.

---

## [2026-07-02] ops | Pujada de 17 logos a Drive i GitHub

17 propostes de logo generades amb IA pujades a:
- Google Drive: carpeta `assets/logos/` (folder ID: `1Q8h8iVC2f2YAuJQEbsVQpUKGgwWfMo_L`)
- GitHub: `assets/logos/`

Finalista v6: Criteri negre + punt coure + hexàgon coure ESG blanc + fons crema (#F5EFE6). 5 variants de tipografia pendents de validació per la Roser.

---

## [2026-06-30] ops | Decisions editorials consolidades

8 decisions editorials clau:
1. Informes genèrics amb part ESG són vàlids
2. Territorialització per CCAA (17 bases de fonts)
3. Registres manuals a MSCI, RE100, etc. (Paolo)
4. Publicació immediata a web (no espera newsletter)
5. Revisió de fonts dilluns i dijous al matí
6. Newsletter bimensual dijous 15:00h
7. Nous tipus de fonts aprovats (acadèmiques, globals, ES, CAT)
8. Google Drive operatiu amb 37 informes de 2026 a `originals/`
9. Horari newsletter definitiu: dijous 15:00h

---

## [2026-06-29] ingest | Primer informe pilot complet: ESRS maig 2026

Primer informe processat amb els 7 blocs complets: Revisió dels ESRS publicada per la Comissió Europea el 6 de maig de 2026. Disponible a `/home/z/my-project/download/Criteri_Informe_Exemple_ESRS.pdf` (4 pàgines, 335 KB).

---

## [2026-06-25] ops | Format Ultra completat

Format Ultra completat amb 4 elements:
1. Podcast d'àudio (5 minuts, via NotebookLM — Paolo genera manualment)
2. Diapositives PowerPoint editables (python-pptx)
3. Dossier mensual temàtic (PDF 15-25 pàgines)
4. Connexió personalitzada mensual (1 petició/mes/empresa Ultra)

Eliminada "sessió consultiva mensual" d'Ultra per decisió de Paolo.

---

## Plantilla per a futures entrades

```markdown
## [YYYY-MM-DD] tip | Títol breu

Descripció de l'operació. Per ingests: incloure Semàfor resultant + criteris
del "Més enllà del Checkbox" triats. Per lints: incloure contradiccions/oportunitats
detectades. Per querys: incloure la pregunta + la pàgina wiki resultant (si s'ha
creat). Per ops: detallar què s'ha fet i on.

**Fitxers generats / afectats**:
- `path/fitxer.ext` — descripció
```
