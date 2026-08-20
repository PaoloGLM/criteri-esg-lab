# 🎨 Paleta de colors oficial — Criteri ESG

> **Declarada per**: Roser Pascual (Tech Lead) · 2 d'agost de 2026
> **Document de referència**: `assets/redisseny-web/mockup-homepage-paleta-salvia.html` (v7)
> Aquest document és la font de veritat per a qualsevol ús de marca (web, informes, newsletter, xarxes).

---

## 1. Colors principals

| Token | Hex | Rol |
|---|---|---|
| `--ink` | `#26312B` | Text principal (títols i cos) · el més fosc |
| `--accent` | `#5E8772` | Accent mig · verd salvia |
| `--highlight` | `#F5E381` | Highlights + logo · **groc pàl·lid (Pantone 12-0640 TCX)** |
| `--verd-clar` | `#AAC9B6` | Verd clar · frase "És el criteri." + números |
| `--bg` | `#F2F5F1` | Fons de la pàgina · el més clar |
| `--bg-paper` | `#FFFFFF` | Paper dels informes (targetes, blocs) |
| `--ink-soft` | `#4A5F53` | Text secundari (derivat de l'ink) |
| `--ink-deep` | `#141B18` | Seccions fosques / footer (derivat de l'ink) |

### Regles lumíniques (obligatòries)

- El **text llarg** (cos) va sempre amb el color **més fosc** (`--ink`).
- El **fons** de la landing és sempre el color **més clar** (`--bg`).
- Els **highlights** són més clars que el text curt (títols).
- Els números decoratius van en `--verd-clar` amb tipografia serif.

---

## 2. Semàfor metodològic (Bloc 0 dels informes)

| Estat | Color | Hex | Ús |
|---|---|---|---|
| 🟢 Verd (g) | Salvia | `#5E8772` | Dimensió correcta / robusta |
| 🟡 Groc (y) | Groc pàl·lid | `#F5E381` | Dimensió parcial / a vigilar |
| 🔴 Vermell (r) | Terrós | `#A0522D` | Dimensió feble / insuficient |

Dots inactius: `opacity 0.18` sobre el mateix color.

---

## 3. Tipografia associada (per a la web)

> Vegeu el document complet: [`TIPOGRAFIES.md`](TIPOGRAFIES.md)

| Família | Rol |
|---|---|
| **Newsreader** (serif, amb itàliques) | Títols, capçalera, textos curts, números decoratius |
| **DM Sans** | Textos llargs (cos, paràgrafs, blocs de l'informe) |
| **JetBrains Mono** | Labels tècnics (eyebrows, meta, tags, xips, bloc-nums) |

---

## 4. Historial de versions

| Versió | Canvi |
|---|---|
| v1 | Base antracita `#26312B` + salvia `#5E8772` + fons `#F2F5F1` |
| v2 | Highlight mostassa `#C2A83C` (substituïa un verd llima rebutjat) |
| v3 | Highlight groc clar `#E3CE58` (menys mostassa) |
| v4 | Frase "És el criteri." + números en verd clar `#AAC9B6` |
| v5 | Números més grans, interliniat reduït, semàfor horitzontal en 2 columnes |
| v6 | Prova òxid `#B85C38` (descartada) |
| **v7** | **Highlight groc pàl·lid `#F5E381` (Pantone 12-0640 TCX) — VIGENT** |

---

## 5. Notes

- La paleta anterior de referència era **terra-coure**; aquesta la substitueix com a direcció oficial declarada per la Roser. Qualsevol canvi de marca requereix confirmació d'en Paolo (CEO).
- Els colors del semàfor (bloc 0) són semàntics i **no han de canviar** amb la paleta de marca: tenen significat propi (verd/groc/vermell) i estan desacoblats dels tokens principals.
