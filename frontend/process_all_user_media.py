import pymupdf
import os

pdf_dir = r"C:\Users\sathi\.gemini\antigravity-ide\brain\fa4469c2-44c3-469c-b3f7-1ea594ee87d7\.user_uploaded"
gallery_out = r"r:\Production\ZeniTEK\frontend\public\pdf-gallery"
os.makedirs(gallery_out, exist_ok=True)

files = [
    ("gallery_13", "media_1789750633038.pdf"),
    ("gallery_20a", "media_1789750633410.pdf"),
    ("gallery_20b", "media_1789750633801.pdf")
]

for label, fname in files:
    fpath = os.path.join(pdf_dir, fname)
    if not os.path.exists(fpath):
        continue
    doc = pymupdf.open(fpath)
    print(f"Processing {label}: {len(doc)} pages")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5))
        out_name = f"{label}_p{i+1}.jpg"
        pix.save(os.path.join(gallery_out, out_name))
        print(f"  Saved {out_name} ({pix.width}x{pix.height})")

print("Finished processing all user gallery PDFs!")
