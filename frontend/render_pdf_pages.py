import fitz # PyMuPDF
import os

pdf_path = r"C:\Users\sathi\.gemini\antigravity-ide\brain\fa4469c2-44c3-469c-b3f7-1ea594ee87d7\.user_uploaded\media_1789745413972.pdf"
pages_out = r"r:\Production\ZeniTEK\frontend\public\pdf-pages"
os.makedirs(pages_out, exist_ok=True)

doc = fitz.open(pdf_path)
print(f"Total pages in doc: {len(doc)}")

for i in range(len(doc)):
    page = doc[i]
    # Render at 2x resolution (144 dpi) for crystal-clear visuals
    mat = fitz.Matrix(2.0, 2.0)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    out_filename = f"brochure_page_{i+1}.png"
    out_path = os.path.join(pages_out, out_filename)
    pix.save(out_path)
    print(f"Rendered: {out_filename} ({pix.width}x{pix.height})")

print("All brochure pages rendered successfully!")
