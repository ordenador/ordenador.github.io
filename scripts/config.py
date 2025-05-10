"""
Configuración centralizada para la generación del PDF del CV.
"""
from pathlib import Path

# Configuración de rutas
SCRIPT_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = (SCRIPT_DIR / '../docs').resolve()

# Configuración del PDF
PDF_CONFIG = {
    'format': 'A4',
    'print_background': True,
    'margin': {
        'top': '10mm',
        'right': '12mm',
        'bottom': '10mm',
        'left': '12mm'
    },
    'scale': 0.95,
    'prefer_css_page_size': True,
    'display_header_footer': False,
    'page_ranges': '1-2'
}

# Configuración del navegador
BROWSER_CONFIG = {
    'viewport': {'width': 1280, 'height': 2260},
    'device_scale_factor': 1,
    'is_mobile': False,
    'has_touch': False,
    'locale': 'es-ES',
    'timezone_id': 'America/Santiago',
    'color_scheme': 'light',
    'forced_colors': 'none',
    'reduced_motion': 'no-preference'
}

# Configuración de trabajos a excluir en el PDF
EXCLUDED_JOBS = [
    {
        "company": "ARS Servicios Profesionales",
        "title": "Support Engineer"
    }
]

# Configuración de fuentes y estilos
FONT_IMPORT = '@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap");' 