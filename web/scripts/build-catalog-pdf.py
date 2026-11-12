"""Build public/angel-cables-catalog.pdf using the backend's own PDF layout.

Hosting the PDF on the website makes "Download PDF" instant (the API server
sleeps when idle and took ~1 minute to respond). Re-run after editing
PRODUCTS_DATA in backend/server.py:

    pip install "fpdf2>=2.8.0" requests
    python3 -I scripts/build-catalog-pdf.py

The layout functions are read straight out of backend/server.py (without
importing it, since that needs MongoDB) so there is a single source of truth.
"""
import ast
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Optional

import requests

ROOT = Path(__file__).resolve().parent.parent
SERVER = ROOT.parent / "backend" / "server.py"
OUT = ROOT / "public" / "angel-cables-catalog.pdf"
SITE_IMAGES = "https://angelcables.com/images/"

WANTED = {"_PDF_CHAR_MAP", "_pdf_safe", "_fetch_image", "_build_catalog_pdf", "_draw_placeholder", "PRODUCTS_DATA"}


def main() -> None:
    tree = ast.parse(SERVER.read_text())
    nodes = [
        n for n in tree.body
        if (isinstance(n, ast.FunctionDef) and n.name in WANTED)
        or (isinstance(n, ast.Assign) and getattr(n.targets[0], "id", None) in WANTED)
    ]
    ns = {"datetime": datetime, "BytesIO": BytesIO, "Optional": Optional, "req_lib": requests}
    exec(compile(ast.Module(body=nodes, type_ignores=[]), str(SERVER), "exec"), ns)

    # Site-hosted product photos are read from this build's public/images
    # (480px versions) so the PDF never depends on what is currently deployed.
    remote_fetch = ns["_fetch_image"]

    def fetch_image(url):
        if url.startswith(SITE_IMAGES):
            local = ROOT / "public" / "images" / f"{Path(url).stem}-480.webp"
            if not local.exists():
                return None
            # FPDF stores WebP losslessly (~4x bigger); JPEG is embedded as-is.
            from PIL import Image
            out = BytesIO()
            Image.open(local).convert("RGB").save(out, "JPEG", quality=80)
            out.seek(0)
            return out
        return remote_fetch(url)

    ns["_fetch_image"] = fetch_image

    pdf = ns["_build_catalog_pdf"](ns["PRODUCTS_DATA"])
    OUT.write_bytes(pdf)
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(pdf) / 1024:.0f} KB, {len(ns['PRODUCTS_DATA'])} products)")


if __name__ == "__main__":
    main()
