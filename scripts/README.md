# Scripts del flux de creació d'informes Criteri ESG

Pipeline de 7 passos: GLM + Gemini + Paolo. Veure `../TASQUES.md` (P4) i `../04-WEB.md` per al detall.

## Configuració inicial

1. **Python venv** (ja creat):
   ```bash
   python3 -m venv scripts/.venv
   scripts/.venv/bin/pip install -r scripts/requirements.txt
   ```

2. **Variables d'entorn** a `assets/web/.env.local`:
   - `GEMINI_API_KEY` — API key de Google AI Studio
   - `GCP_SERVICE_ACCOUNT_PATH` — path al JSON del Service Account
   - `DRIVE_ROOT_FOLDER_ID` (opcional) — ID de la carpeta pare

3. **Google Drive**: carpeta `Criteri ESG/informes/` compartida amb el Service Account, amb 7 subcarpetes (`0-originals` a `6-publicats`).

4. **Test de configuració**:
   ```bash
   scripts/.venv/bin/python scripts/test-setup.py
   ```
   Ha de dir ✓ tant per Gemini com per Drive.

## Scripts

| Script | Pas | Què fa |
|--------|-----|--------|
| `01-glm-detecta.py` | 1 | GLM detecta nous informes a les fonts → Drive `/0-originals/` |
| `02-glm-distilla.py` | 2 | GLM destil·la els 8 apartats → `/1-distilats/` |
| `03-gemini-revisa.py` | 3 | Gemini fa propostes + advocat del diable → `/2-aportacions-gemini/` |
| `04-glm-redacta.py` | 4 | GLM redacta l'informe integrant les aportacions → `/3-fets/` |
| `05-gemini-ortografia.py` | 5 | Gemini corregeix ortografia CA+ES → `/4-revisats-ortografia/` |
| (manual) | 6 | Paolo valida, mou a `/5-validats-paolo/` |
| `07-glm-puja.py` | 7 | GLM puja els validats a la web → `/6-publicats/` |

## Orquestració

```bash
bash scripts/run-flux.sh
```

Encadena els passos 1-5 i s'atura al pas 6 esperant validació humana.
