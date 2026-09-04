# 🎨 Guia d'edició de la web — per a Paolo

Aquesta guia explica **on tocar què** per canviar l'aspecte de la web
(colors, lletres, imatges, textos) **sense ajuda tècnica**.

> 📁 Tots els camins comencen a `criteri-esg-lab/assets/web/`

---

## 1. Canviar COLORS de tota la web

**Fitxer:** `src/app/globals.css`

Els colors de marca estan com a **variables CSS** al principi del fitxer.
Busca línies com aquestes:

```css
--salvia: #7a9471;      /* verd salvia corporatiu */
--ink: #1f2937;         /* gris fosc per textos */
--background: #f4f3ef;  /* fons clar */
```

**Com fer-ho:**
1. Obre el fitxer amb VS Code o Notepad++
2. Canvia el codi hexadecimal (`#7a9471`) pel color que vulguis
3. Desa — si el servidor dev està corrent, el canvi és **immediat**

⚠️ **Regla d'or**: canvia només el valor després de `:`, mai el nom de la variable.

---

## 2. Canviar MIDES DE LLETRA i tipografies

**Fonts cargades a:** `src/app/layout.tsx` (via next/font: Newsreader, DM Sans, JetBrains Mono)

**Mides de text globals a:** `src/app/globals.css` — busca `font-size:`.

**Per canviar una secció concreta** (títols d'informes, cards, etc.), els
estils estan als components:
- `src/components/site-header-v1.tsx` → menú superior
- `src/components/site-footer-v1.tsx` → peu de pàgina
- `src/app/informes/page.tsx` → pàgina de llistat d'informes

**Com fer-ho:** busca `fontSize` o `font-size` al fitxer i ajusta el valor.
Els valors són en px (píxels): 14 = text petit, 16 = normal, 24 = títol.

---

## 3. Canviar IMATGES (logo, fotos, icons)

**Carpeta d'imatges:** `public/`

| Imatge | Ubicació | On es fa servir |
|--------|----------|-----------------|
| Logo | `public/logo.png` (o .svg) | capçalera i footer |
| Icons | `public/icons/` | pàgines que-fem, que-es |
| Fotos | `public/images/` | qui-som, home |

**Per substituir una imatge:**
1. Guarda la imatge nova amb **el mateix nom exacte** (ex: `logo.png`)
2. Reemplaça el fitxer a `public/`
3. Refresca el navegador (Ctrl+Shift+R per forçar)

⚠️ Mantén dimensions similars a l'original per no trencar el layout.

---

## 4. Canviar TEXTOS (capçaleres, subtítols, botons)

**Traduccions CA/ES a:** `src/lib/i18n.ts`

És un objecte amb claus per idioma:

```ts
ca: { "hero.titol": "Criteri ESG", ... },
es: { "hero.titol": "Criterio ESG", ... },
```

Canvia el text després de `:` mantenint les cometes i la coma final.

---

## 5. Publicar canvis (deploy)

Els canvis NO surten a la web automàticament. Flux:

1. Fes els canvis localment i comprova-los: `npm run dev` a `assets/web/`
   → obre http://localhost:3000 al navegador
2. Quan estiguin bé:

```bash
git checkout -b canvis-web
git add .
git commit -m "Descripció breu del canvi"
git push -u origin canvis-web
```

3. A GitHub: obre un **Pull Request** → espera el CI verd → **Merge**

Vercel desplegarà automàticament en ~2 minuts després del merge.

---

## 6. Panell d'administració (`/admin`)

URL: **criteriesg.com/admin** (o localhost:3000/admin en dev)

Què pots fer sense tocar codi:
- **Informes**: publicar/despublicar, esborrar, veure estat
- **Usuaris**: veure registrats, canviar pla (free/premium/ultra)
- **Alarmes**: errors del sistema amb identificador (ex: ADM-DB-001) —
  si veus una franja vermella a dalt, alguna cosa falla; clica "Marca
  resolta" quan estigui arreglat o envia'm l'ID

Configuració inicial (només 1 cop):
1. Executa `assets/supabase-admin-fase1.sql` al Supabase Dashboard → SQL Editor
2. Descomenta i executa l'última línia per marcar-te com a admin
3. A Vercel → Settings → Environment Variables: afegeix
   `SUPABASE_SERVICE_ROLE_KEY` (la tens al Supabase Dashboard → Settings → API)
4. Tanca i reobre sessió a la web

---

## 7. Nivells de risc — què tocar sense por

| 🟢 Segur | 🟡 Amb compte | 🔴 No tocar |
|----------|---------------|-------------|
| Valors de colors | Mides i espaiaments | Estructura de components |
| Textos d'i18n.ts | Estils inline nous | auth, API routes, middleware |
| Imatges de public/ | Classes Tailwind | Config de Supabase |
| Afegir informes a /admin | | El disseny validat v7 |

Si no estàs segur: fes servir `npm run dev` i mira el resultat **abans**
de fer push. El desplegament de producció només passa al merge d'un PR
aprovat pel CI.
