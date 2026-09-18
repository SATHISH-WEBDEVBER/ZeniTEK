import pymupdf
import os

pdf_path = r"C:\Users\sathi\.gemini\antigravity-ide\brain\fa4469c2-44c3-469c-b3f7-1ea594ee87d7\.user_uploaded\media_1789750149575.pdf"
out_dir = r"r:\Production\ZeniTEK\frontend\public\pdf-products\extracted"
os.makedirs(out_dir, exist_ok=True)

doc = pymupdf.open(pdf_path)
print(f"Total pages: {len(doc)}")

for page_idx, page in enumerate(doc):
    image_list = page.get_images(full=True)
    print(f"Page {page_idx+1} has {len(image_list)} images")
    for img_idx, img in enumerate(image_list):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        filename = f"page_{page_idx+1}_img_{img_idx+1}_{xref}.{image_ext}"
        filepath = os.path.join(out_dir, filename)
        with open(filepath, "wb") as f:
            f.write(image_bytes)
        print(f"  Extracted: {filename} ({len(image_bytes)} bytes)")

print("Extracted all images!")
