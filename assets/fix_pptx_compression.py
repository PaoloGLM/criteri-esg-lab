#!/usr/bin/env python3
"""Re-pack a .pptx with standard DEFLATE compression.
pptxgenjs uses 'store' (no compression) which some PowerPoint versions reject.
"""
import zipfile
import sys
import os
import shutil
from pathlib import Path

def repack_pptx(input_path: str, output_path: str = None) -> str:
    if output_path is None:
        p = Path(input_path)
        output_path = str(p.with_suffix(p.suffix + ".fixed.pptx"))

    # Read all entries from the source zip and rewrite them with DEFLATE
    with zipfile.ZipFile(input_path, 'r') as src:
        with zipfile.ZipFile(output_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as dst:
            for item in src.infolist():
                data = src.read(item.filename)
                # Create a fresh ZipInfo to reset compression flags
                new_info = zipfile.ZipInfo(filename=item.filename, date_time=item.date_time)
                new_info.compress_type = zipfile.ZIP_DEFLATED
                new_info.external_attr = item.external_attr
                dst.writestr(new_info, data)

    return output_path


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: fix_pptx_compression.py <input.pptx> [output.pptx]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else None

    if output_file is None:
        # In-place: write to temp then move
        tmp = input_file + ".tmp.pptx"
        repack_pptx(input_file, tmp)
        shutil.move(tmp, input_file)
        print(f"Repacked in place: {input_file}")
    else:
        repack_pptx(input_file, output_file)
        print(f"Created: {output_file}")
