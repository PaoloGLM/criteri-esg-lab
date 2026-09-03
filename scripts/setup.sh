#!/bin/bash
# ============================================================
# Criteri ESG — Script d'arrencada automàtica del workspace
# ============================================================
# Executa aquest script quan el workspace s'hagi resetejat.
# Restaura tot l'estat necessari en un sol comando.
#
# Ús:
#   bash scripts/setup.sh
# ============================================================

set -e
cd /home/z/my-project/criteri-esg-lab

echo "=== 1. Sincronitzant amb git ==="
git fetch origin
git reset --hard origin/main
echo "✓ Repositori sincronitzat"

echo ""
echo "=== 2. Recrear venv Python ==="
if [ ! -d "scripts/.venv" ]; then
    python3 -m venv scripts/.venv
fi
scripts/.venv/bin/pip install -q -r scripts/requirements.txt pdfplumber google-auth 2>/dev/null || true
echo "✓ Venv recreat amb dependències"

echo ""
echo "=== 3. Recrear .env.local ==="
# Les claus reals estan a Vercel. Aquestes són per a desenvolupament local.
cat > assets/web/.env.local << 'ENV'
GEMINI_API_KEY=«REDACTED:GEMINI_API_KEY_OLD»
GCP_SERVICE_ACCOUNT_PATH=/home/z/my-project/.gcp-service-account.json
BREVO_API_KEY=«REDACTED:BREVO_API_KEY»
BREVO_SENDER_EMAIL=info@criteriesg.com
BREVO_SENDER_NAME=Criteri ESG
ENV
echo "✓ .env.local recreat (claus de desenvolupament)"

echo ""
echo "=== 4. Verificant connexions ==="
echo "  → Gemini (Vertex AI)..."
scripts/.venv/bin/python -c "
import sys; sys.path.insert(0, 'scripts')
from gemini_client import test_gemini_models
" 2>/dev/null && echo "  ✓ Gemini OK" || echo "  ⚠ Gemini: verifica GCP_SERVICE_ACCOUNT_PATH"

echo "  → Brevo..."
scripts/.venv/bin/python -c "
import sys; sys.path.insert(0, 'scripts')
from brevo_client import test_connection
test_connection()
" 2>/dev/null && echo "  ✓ Brevo OK" || echo "  ⚠ Brevo: verifica BREVO_API_KEY"

echo "  → Google Drive..."
scripts/.venv/bin/python -c "
import sys; sys.path.insert(0, 'scripts')
from drive_user_client import get_user_drive_service
drive = get_user_drive_service()
print('  ✓ Drive OK')
" 2>/dev/null || echo "  ⚠ Drive: verifica OAuth tokens"

echo ""
echo "=== 5. Descarregar PDFs originals si cal ==="
if [ ! -d "data/informes/0-originals" ] || [ -z "$(ls -A data/informes/0-originals 2>/dev/null)" ]; then
    echo "  → Descarregant PDFs de Drive..."
    scripts/.venv/bin/python scripts/download-originals.py 2>/dev/null || echo "  ⚠ No s'han pogut descarregar"
else
    echo "  ✓ PDFs originals ja presents ($(ls data/informes/0-originals/*.pdf 2>/dev/null | wc -l) fitxers)"
fi

echo ""
echo "=== 6. Build de la web ==="
cd assets/web
if [ ! -d "node_modules" ]; then
    echo "  → Instal·lant dependències..."
    bun install 2>/dev/null || npm install 2>/dev/null || true
fi
echo "  → Verificant build..."
bun run build 2>/dev/null && echo "  ✓ Build OK" || echo "  ⚠ Build amb errors (revisa manualment)"

echo ""
echo "========================================"
echo "✅ Workspace llest!"
echo "========================================"
echo ""
echo "Estat actual:"
echo "  - Repo: $(git log --oneline -1)"
echo "  - PDFs: $(ls /home/z/my-project/criteri-esg-lab/data/informes/0-originals/*.pdf 2>/dev/null | wc -l) originals"
echo "  - Destil·lats: $(ls /home/z/my-project/criteri-esg-lab/data/informes/1-distilats/*.json 2>/dev/null | wc -l) JSONs"
echo "  - Informes fets: $(ls /home/z/my-project/criteri-esg-lab/data/informes/4-revisats-ortografia/*.md 2>/dev/null | wc -l) MDs"
echo ""
echo "Per continuar treballant, llegeix TASQUES.md per veure els pendents."
