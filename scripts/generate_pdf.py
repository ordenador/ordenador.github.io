"""
Script principal para generar los PDFs del CV.
"""
import asyncio
import shutil
import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from scripts.config import OUTPUT_DIR
from scripts.browser import BrowserManager

# (query string, ruta de salida relativa a dist/)
# Variantes personalizadas: taxonomía /cv/<concepto>/mario_faundez_cv.<lang>.pdf,
# concepto genérico, sin nombres de empresa.
PDF_JOBS = [
    ('lang=en', 'mario_faundez_cv.en.pdf'),
    ('lang=es', 'mario_faundez_cv.es.pdf'),
    ('cv=ia-aplicada', 'cv/ia-aplicada/mario_faundez_cv.es.pdf'),
]

async def generate_cv_pdf():
    """
    Genera los PDFs de un CV renderizado por React.
    """
    html_file = OUTPUT_DIR / 'index.html'
    if not html_file.exists():
        raise Exception(f"No se encontró el archivo HTML en {html_file}")

    browser_manager = BrowserManager()
    try:
        await browser_manager.setup()
        for query, output in PDF_JOBS:
            await browser_manager.generate_pdf(str(html_file), query=query, output=output)
    finally:
        await browser_manager.cleanup()

    # Alias legacy: los enlaces antiguos apuntan a mario_faundez_cv.pdf
    shutil.copyfile(OUTPUT_DIR / 'mario_faundez_cv.en.pdf', OUTPUT_DIR / 'mario_faundez_cv.pdf')

if __name__ == '__main__':
    print("Ejecutando el script de generación de PDF para el CV...")
    asyncio.run(generate_cv_pdf())
