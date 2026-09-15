# -*- coding: utf-8 -*-
"""Posa a la paperera de Drive (recuperable 30 dies) els documents REBUTJATS per en Paolo.
Llista blanca EXPLiCITA: només toca fitxers dins 0-originals/ o 0-originals/pendents/ amb
aquestos noms exactes. Abans de trashar, verifica que la còpia local ja NO existeix
(esborrada local el 15-set), o que si existeix és idèntica a la descartada.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from drive_user_client import get_user_drive_service
from importlib import import_module
moure = import_module("_moure-drive-local")  # té walk()

DRIVE_ROOT = "1nSgtu2pcourGRMrS1KIspgVarlRldbnS"
LOCAL_ORIG = Path("data/informes/0-originals")

# 13 rebutjats per Paolo el 14-15 set (revisió manual) + captures/landings
REBUTJATS = [
    "2026-06-30_wir-2026-spanish.pdf",
    "carbon-tracker-regulating-2026.pdf",
    "cop30-outcomes-2025.pdf",
    "csddd-omnibus-finalised.pdf",
    "eca-sustainability-reporting.pdf",
    "ecb-climate-risk-2026.pdf",
    "eea-publications-2026.pdf",
    "entsoe-summer-outlook-2026.pdf",
    "eu-taxonomy-delegated-act.pdf",
    "foretica-tendencias-esg-2026.pdf",
    "influencemap-corporate-footprint-2026.pdf",
    "oecd-economic-outlook-jun2026.pdf",
    "worldbank-afg-interim-2026.pdf",
]

def main():
    svc = get_user_drive_service()
    all_files = moure.walk(svc, DRIVE_ROOT)
    targets = [f for f in all_files
               if f["rel"].startswith("0-originals") and f["nom"] in REBUTJATS]
    print(f"Coincidències a Drive: {len(targets)}/{len(REBUTJATS)}")
    moved = 0
    for f in targets:
        local = LOCAL_ORIG / f["nom"]
        if local.exists():
            print(f"  [SALTE] encara existeix local: {f['nom']}")
            continue
        svc.files().update(fileId=f["id"], body={"trashed": True}).execute()
        print(f"  [PAPERERA] {f['rel']}")
        moved += 1
    faltants = set(REBUTJATS) - {f["nom"] for f in targets}
    print(f"Ttrashats: {moved}. No trobats a Drive: {sorted(faltants) if faltants else 'cap'}")

if __name__ == "__main__":
    main()
