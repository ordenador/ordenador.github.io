"""
Script principal para generar el PDF del CV.
"""
import asyncio
import os
import sys
from pathlib import Path

# Add the project root directory to the Python path
project_root = Path(__file__).resolve().parent.parent
sys.path.append(str(project_root))

from scripts.config import OUTPUT_DIR
from scripts.browser import BrowserManager

async def generate_cv_pdf():
    """
    Genera un PDF de un CV renderizado por React.
    """
    browser_manager = BrowserManager()
    
    try:
        # Crear directorio de salida si no existe
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        # Ajustar las rutas en el HTML
        html_file = OUTPUT_DIR / 'index.html'
        if not html_file.exists():
            raise Exception(f"No se encontró el archivo HTML en {html_file}")
        
        # Leer y ajustar el contenido del HTML
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Ajustar las rutas de los assets para usar rutas absolutas
        dist_path = str(OUTPUT_DIR.absolute())
        html_content = html_content.replace('src="/assets/', f'src="file://{dist_path}/assets/')
        html_content = html_content.replace('href="/assets/', f'href="file://{dist_path}/assets/')
        
        # Guardar el HTML modificado
        temp_html = OUTPUT_DIR / 'temp_index.html'
        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Configurar y usar el navegador
        await browser_manager.setup()
        await browser_manager.generate_pdf(str(temp_html))
        
    except Exception as e:
        print(f"Ocurrió un error general no controlado: {e}")
    finally:
        await browser_manager.cleanup()

if __name__ == '__main__':
    print("Ejecutando el script de generación de PDF para el CV...")
    asyncio.run(generate_cv_pdf())
