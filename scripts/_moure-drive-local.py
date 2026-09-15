# -*- coding: utf-8 -*-
"""Mou (copia) els fitxers de Drive a local, verifica duplicates per sha256 i genera informe.
Un cop verificat, --trash posa els duplicats confirmats a la paperera de Drive (30 dies recuperable).
"""
import argparse
import hashlib
import io
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from drive_helper import _get_drive_service

DRIVE_ROOT = "1nSgtu2pcourGRMrS1KIspgVarlRldbnS"
LOCAL_BASE = Path("data/informes")
# Mapping carpeta Drive -> on baixar-ho a local (per nom de fitxer lliure)
DESTINACIONS = {
    "0-originals": LOCAL_BASE / "0-originals",
    "1-distilats": LOCAL_BASE / "1-distilats",
    "2-aportacions-gemini": LOCAL_BASE / "2-aportacions-gemini",
    "3-fets": LOCAL_BASE / "3-fets",
    "4-revisats-ortografia": LOCAL_BASE / "4-revisats-ortografia",
    "5-validats-paolo": LOCAL_BASE / "5-validats-paolo",
    "6-publicats": LOCAL_BASE / "6-publicats",
    "pendents-revisio": LOCAL_BASE / "pendents-revisio",
}


def walk(service, fid, rel=""):
    out = []
    r = service.files().list(q=f"'{fid}' in parents and trashed=false",
                             fields="files(id,name,mimeType,size)", pageSize=1000).execute()
    for f in sorted(r["files"], key=lambda x: x["name"].lower()):
        p = f"{rel}/{f['name']}" if rel else f["name"]
        if f["mimeType"] == "application/vnd.google-apps.folder":
            out.extend(walk(service, f["id"], p))
        else:
            out.append({"id": f["id"], "nom": f["name"], "rel": p, "size": int(f.get("size", 0))})
    return out


def download(service, fid):
    buf = io.BytesIO()
    service.files().get_media(fileId=fid).execute(num_retries=3)  # ping
    from googleapiclient.http import MediaIoBaseDownload
    fh = io.BytesIO()
    req = service.files().get_media(fileId=fid)
    downloader = MediaIoBaseDownload(fh, req)
    done = False
    while not done:
        _, done = downloader.next_chunk()
    return fh.getvalue()


def sha(b):
    return hashlib.sha256(b).hexdigest()


def find_local(nom, mida):
    """Cerca per nom a tot data/informes; retorna (ruta, sha) si mida coincideix."""
    for p in LOCAL_BASE.rglob(nom):
        if p.stat().st_size == mida:
            return p, sha(p.read_bytes())
    return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--trash", action="store_true", help="Paperera Drive per als confirmats duplicats")
    args = ap.parse_args()
    svc = _get_drive_service()
    files = walk(svc, DRIVE_ROOT)
    print(f"Fitxers a Drive: {len(files)}\n")

    movits, iguals, diferents = [], [], []
    for f in files:
        nom = f["nom"]
        local_p, local_sha = find_local(nom, f["size"])
        data = None
        top = f["rel"].split("/")[0]
        destino = DESTINACIONS.get(top, LOCAL_BASE / "_des-drive")
        if local_p:
            data = download(svc, f["id"])
            if sha(data) == local_sha:
                iguals.append((f["rel"], str(local_p)))
                print(f"  = {f['rel']}  == {local_p}")
                if args.trash:
                    svc.files().update(fileId=f["id"], body={"trashed": True}).execute()
                    print(f"    -> a la paperera Drive")
                continue
        # no local o contingut diferent: baixar
        if data is None:
            data = download(svc, f["id"])
        if local_p:  #同名 pero sha diferent
            destino.mkdir(parents=True, exist_ok=True)
            dest = destino / (nom + ".des-drive")
            dest.write_bytes(data)
            diferents.append((f["rel"], str(local_p), str(dest)))
            print(f"  ! {f['rel']}  Diferent de {local_p} -> copia a {dest}")
        else:
            destino.mkdir(parents=True, exist_ok=True)
            dest = destino / nom
            n = 2
            while dest.exists():
                dest = destino / f"{Path(nom).stem}-{n}{Path(nom).suffix}"; n += 1
            dest.write_bytes(data)
            movits.append((f["rel"], str(dest)))
            print(f"  + {f['rel']}  NO era local -> baixat a {dest}")

    print(f"\n=== RESUM ===\nIdèntics (duplicats Drive): {len(iguals)}")
    print(f"Moguts de Drive a local (eren absents): {len(movits)}")
    for r, d in movits:
        print(f"   {r} -> {d}")
    print(f"Diferents (mateix nom, contingut diferent): {len(diferents)}")
    for r, l, d in diferents:
        print(f"   {r} vs {l} (revisa {d})")


if __name__ == "__main__":
    main()
