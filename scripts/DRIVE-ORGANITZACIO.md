# Organització de Google Drive

> **Document de referència.** Qualsevol script que pugi o llegeixi de Drive ha de seguir aquesta organització.

## Dues carpetes arrel

### `Criteri ESG` (ID: `1HGRugtsRGDN3su_n_dbd9y1p8VkyuUgG`)
Per **tot el que no sigui el flux d'informes**: newsletters, documents, assets de la web, anàlisi competència, etc.

Subcarpetes:
- `newsletters/` — HTML de cada newsletter generada
- `redisseny-web/` — mockups i HTML del redisseny de la web
- `homepage-redisseny/` — variants de homepage
- `LinkedIn/` — assets per posts LinkedIn
- `ANÀLISI COMPETÈNCIA/` — documents d'anàlisi
- `ADMINISTRACIÓ/` — factures, documents legals
- `assets/` — assets gràfics (logos, paleta, etc.)
- `dossiers/` — dossiers temàtics
- `ultra/` — contingut per Ultra
- `processats/` — informes processats antics (legacy)

### `Criteri ESG Informes` (ID: `1nSgtu2pcourGRMrS1KIspgVarlRldbnS`)
**Vinculada a l'API de Gemini/Vertex AI**. S'utilitza **només** pel flux de producció d'informes (passos 1-7 del flux).

Subcarpetes (les 7 del flux):
- `0-originals/` — PDFs originals descarregats (pas 1)
  - `0-originals/pendents/` — PDFs nous per processar (encara no destil·lats) ⭐
  - `0-originals/processats/` — PDFs que ja han passat tot el flux (publicats) ⭐
- `1-distilats/` — JSON destil·lats (pas 2)
- `2-aportacions-gemini/` — JSON d'aportacions crítiques de Gemini (pas 3)
- `3-fets/` — Markdown CA+ES redactats (pas 4)
- `4-revisats-ortografia/` — Markdown corregits per Gemini + PDF final (pas 5)
- `5-validats-paolo/` — informes validats per Paolo (pas 6)
- `6-publicats/` — informes pujats a la web (pas 7)

### Opció A — Separació pendents / processats (31 juliol 2026)

A la revisió bimensual de fonts, **només cal mirar `0-originals/pendents/`** per veure què falta processar.

Regla operativa:
1. Quan es detecta un PDF nou a una font → es descarrega a `0-originals/pendents/`
2. Passa pel flux (passos 2-6) i es publica (pas 7)
3. Al publicar-se → el PDF original es mou de `pendents/` a `processats/` (script `mou-original-processat.py`)

Així els PDFs processats i els pendents queden sempre ben identificats.

## Funcions al codi (`scripts/drive_user_client.py`)

| Funció | Carpeta arrel | Ús |
|--------|---------------|-----|
| `find_criteri_root(drive)` | `Criteri ESG` | Obtenir ID de l'arrel "no informes" |
| `find_informes_root(drive)` | `Criteri ESG Informes` | Obtenir ID de l'arrel "informes" |
| `get_criteri_subfolder_id(drive, name)` | `Criteri ESG/<name>` | Subcarpeta de "no informes" (ex: `newsletters`) |
| `get_subfolder_id(drive, name)` | `Criteri ESG Informes/<name>` | Subcarpeta del flux d'informes (ex: `4-revisats-ortografia`) |

## Exemples d'ús

```python
# Pujar una newsletter a la carpeta correcta
drive = get_user_drive_service()
folder_id = get_criteri_subfolder_id(drive, "newsletters")
upload_file(drive, html_path, "newsletter-1.html", folder_id, mime_type="text/html")

# Pujar un PDF d'informe (pas 5 del flux)
drive = get_user_drive_service()
folder_id = get_subfolder_id(drive, "4-revisats-ortografia")
upload_file(drive, pdf_path, "eu-taxonomy.ca.pdf", folder_id, mime_type="application/pdf")
```

## Pujada a Drive

**Única via d'accés a Drive: OAuth d'usuari** (`drive_user_client.py`). Tokens a `google_token.json`, es refresquen automàticament.

⚠️ **El Service Account (`criteri-bot@...`) NO s'usa per a Drive** — només té visió parcial (el que se li ha compartit) i no té quota de pujada. Queda reservat exclusivament per a **Gemini/Vertex AI** (`gemini_client.py`). `config.get_drive_service()` està deprecat.

## Scripts de Drive (tots amb OAuth d'usuari)

| Script | Funció |
|--------|--------|
| `drive_user_client.py` | Client central (autenticació, cerca, pujada, llistat) |
| `download-originals.py` | Baixa PDFs de `0-originals/pendents/` a local |
| `llista-originals.py` | Llista pendents + processats + destil·lats |
| `mou-original-processat.py` | Mou un PDF de `pendents/` a `processats/` (pas 7) |
| `puja-a-drive.py` | Puja informes corregits (pas 5) a `4-revisats-ortografia/` |
| `upload-distilats-to-drive.py` | Puja JSONs destil·lats (pas 2) a `1-distilats/` |
| `find-pdfs.py` | Diagnòstic: tots els PDFs accessibles |
| `diagnostic-drive.py` | Diagnòstic: carpetes visibles |
