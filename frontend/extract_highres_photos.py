import pymupdf
import os
import hashlib
import json

pdf_dir = r"C:\Users\sathi\.gemini\antigravity-ide\brain\fa4469c2-44c3-469c-b3f7-1ea594ee87d7\.user_uploaded"
out_dir = r"r:\Production\ZeniTEK\frontend\public\real-photos"
os.makedirs(out_dir, exist_ok=True)

files = [
    ("pdf13", "media_1789750633038.pdf"),
    ("pdf20a", "media_1789750633410.pdf"),
    ("pdf20b", "media_1789750633801.pdf")
]

seen_hashes = {}
photo_records = []

# Index counter
counter = 1

for source_name, fname in files:
    fpath = os.path.join(pdf_dir, fname)
    if not os.path.exists(fpath):
        continue
    doc = pymupdf.open(fpath)
    print(f"Reading {source_name} ({len(doc)} pages)...")
    for page_idx, page in enumerate(doc):
        images = page.get_images(full=True)
        if not images:
            # Fallback render page if no separate image object
            pix = page.get_pixmap(matrix=pymupdf.Matrix(2.0, 2.0))
            img_bytes = pix.tobytes("jpeg")
            ext = "jpg"
            w, h = pix.width, pix.height
        else:
            xref = images[0][0]
            base_img = doc.extract_image(xref)
            img_bytes = base_img["image"]
            ext = base_img["ext"]
            w = base_img["width"]
            h = base_img["height"]

        md5 = hashlib.md5(img_bytes).hexdigest()
        if md5 in seen_hashes:
            print(f"  Skipping duplicate on page {page_idx+1}: matches {seen_hashes[md5]}")
            continue

        filename = f"zenitek_photo_{counter:02d}.{ext}"
        seen_hashes[md5] = filename
        save_path = os.path.join(out_dir, filename)
        with open(save_path, "wb") as f:
            f.write(img_bytes)

        photo_records.append({
            "id": f"zp-{counter}",
            "filename": filename,
            "path": f"/real-photos/{filename}",
            "sourcePdf": source_name,
            "sourcePage": page_idx + 1,
            "width": w,
            "height": h,
            "sizeBytes": len(img_bytes)
        })
        print(f"  Saved #{counter}: {filename} ({w}x{h}, {len(img_bytes)} bytes)")
        counter += 1

print(f"Extracted {len(photo_records)} unique master photographs!")

with open(r"r:\Production\ZeniTEK\frontend\src\data\extractedPhotosMeta.json", "w") as f:
    json.dump(photo_records, f, indent=2)

print("Saved metadata JSON!")
