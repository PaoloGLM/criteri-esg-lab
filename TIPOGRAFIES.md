# ✒️ Tipografies oficials — Criteri ESG

> **Declarades per**: Roser Pascual (Tech Lead) · 2 d'agost de 2026
> **Document de referència**: `assets/redisseny-web/mockup-homepage-paleta-salvia.html` (v7)
> Aquest document és la font de veritat per a qualsevol ús de marca (web, informes, newsletter, xarxes).
> Paleta associada: vegeu `PALETA-COLORS.md`.

---

## 1. Les tres famílies

| Família | Classe | Rol | Pesos carregats |
|---|---|---|---|
| **Newsreader** | `--font-display` | Títols, capçalera, textos curts i números decoratius (serif editorial) | 400, 500, 600 + itàliques 400, 500 |
| **DM Sans** | `--font-body` | Textos llargs (cos: paràgrafs, blocs de l'informe) | 300, 400, 500, 600, 700 |
| **JetBrains Mono** | `--font-mono` | Labels tècnics (eyebrows, meta, tags, xips, bloc-nums) | 400, 500, 600 |

**URL de càrrega (Google Fonts):**

```
https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap
```

---

## 2. Assignació per element

### Newsreader (serif editorial)
- Títols (`h1`–`h4`) i blockquotes
- Marca: `C` del logotip i "Criteri ESG"
- Navegació i botons
- Subtítol del hero, banner
- **Números decoratius**: tesis (01/02/03), dades clau (01–05), cercles d'accions (1/2/3)
- Nota del semàfor (C · Dèbil), atribució de la cita, peu del footer

### DM Sans (cos)
- Paràgrafs del manifest i descripcions de tesis
- Els 8 blocs de l'informe (dades clau, resum executiu, implicacions, connexions, accions)
- Cita interior del bloc 4, peu de l'informe, descripció del footer

### JetBrains Mono (labels tècnics)
- Eyebrows ("EL QUE CREIEM", "COM HO RESOLEM", "ÚLTIM INFORME PUBLICAT"...)
- Tag "Regulació · Gratuït" i meta de l'informe
- Labels dels blocs (BLOC 0 – BLOC 7)
- Noms de dimensió del semàfor (Scope 3, Terminis...)
- Xips del cross-reference (GRI, EcoVadis...), títols de columna del footer

---

## 3. Regles tipogràfiques

1. **Jerarquia per mida i pes, no per família**: la família marca el *rol* (display/cos/tècnic); la mida i el pes creen la jerarquia dins de cada rol.
2. **Números decoratius → sempre Newsreader** (mateixa família que els títols), en color `--verd-clar` (`#AAC9B6`).
3. **Text llarg → sempre DM Sans** (llegibilitat en paràgrafs).
4. **Labels tècnics → sempre JetBrains Mono**, amb majúscules i `letter-spacing` ample (0.18em–0.28em).
5. **No fer servir faux-bold**: si una família no té el pes demanat (ex. JetBrains Mono 700), no sintetitzar-lo — usar el pes màxim disponible i la mida per a la jerarquia.
6. **Itàliques de Newsreader** (400/500) reservades per a èmfasi editorial.

---

## 4. Historial

| Versió | Canvi |
|---|---|
| v1–v3 | Monomakh (display) + Lexend Deca (cos) |
| v4 | Canvi a **Newsreader + DM Sans + JetBrains Mono** (3 famílies) |
| v5 | Números passen a Newsreader (com els títols) |
| v6 | Números amb DM Sans (decisió revertida) |
| **v7** | **Números definitivament en Newsreader (serif) amb verd clar — VIGENT** |

---

## 5. Notes

- La tipografia anterior de referència era Monomakh + Lexend Deca; aquesta combinació la substitueix com a direcció oficial declarada per la Roser. Qualsevol canvi de marca requereix confirmació d'en Paolo (CEO).
- Les famílies s'han de carregar amb `preconnect` a `fonts.googleapis.com` i `fonts.gstatic.com` per rendiment.
