import os
from pypdf import PdfReader
from PIL import Image

pdf_path = r"C:\Users\sathi\.gemini\antigravity-ide\brain\fa4469c2-44c3-469c-b3f7-1ea594ee87d7\.user_uploaded\media_1789745413972.pdf"
out_dir = r"r:\Production\ZeniTEK\frontend\public\pdf-assets"
os.makedirs(out_dir, exist_ok=True)

reader = PdfReader(pdf_path)
print(f"Total pages: {len(reader.pages)}")

extracted = []
for page_num, page in enumerate(reader.pages):
    for img_idx, img in enumerate(page.images):
        name = f"page_{page_num+1}_img_{img_idx+1}_{img.name}"
        save_path = os.path.join(out_dir, name)
        with open(save_path, "wb") as fp:
            fp.write(img.data)
        file_size = os.path.getsize(save_path)
        extracted.append((page_num + 1, name, file_size))
        print(f"Saved: {name} ({file_size} bytes)")

print(f"Total extracted images: {len(extracted)}")
