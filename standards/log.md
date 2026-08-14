# Log del coneixement d'estàndards ESG (INTERN)

> Historial cronològic de canvis al sistema de fitxes d'expert.
> Append-only: cada entrada comença amb `## [DATA] tipus | descripció`.

## [2026-08-14] ingest | Fitxa GRI creada (plantilla definitiva)
- Creada `standards/gri.md` amb l'estructura de 7 seccions:
  1. Què és + abast + a qui obliga
  2. Estructura (components clau)
  3. Interoperabilitat
  4. ⚠️ Vigilància de canvis (dates + enllaços oficials)
  5. Punts d'impacte típics
  6. Accions tipus
  7. Meta (última revisió / propera / validada per)
- Creada `standards/README.md` amb la plantilla i la llista dels 16 estàndards
- Creada `standards/index.md` amb el catàleg i les relacions entre estàndards
- Fitxes pendents: 15 (totes excepte GRI)
- Pendent de validació de Paolo: fitxa GRI (abans d'usar-la en producció)

## [2026-08-14] schema | Catàleg oficial a scripts/cataleg-estandards.json
- 16 estàndards amb slug, name, type, issuer
- El pas 2 del pipeline el carrega i genera crossRefs només contra aquest catàleg
- Prova real: destil·lació ECB → crossRefs amb slugs exactes (csrd-esrs, tcfd, csddd, tnfd)
