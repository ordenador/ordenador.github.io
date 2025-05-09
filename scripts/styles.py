"""
Módulo para manejar los estilos CSS del PDF.
"""
from .config import EXCLUDED_JOBS, FONT_IMPORT

def generate_excluded_jobs_css():
    """Genera el CSS para ocultar trabajos específicos en el PDF."""
    return "\n".join([
        f'.experience-item:has(.institution-name:contains("{job["company"]}")):has(.entry-title:contains("{job["title"]}")) {{ display: none !important; }}'
        for job in EXCLUDED_JOBS
    ])

def get_pdf_styles():
    """Retorna los estilos CSS completos para el PDF."""
    excluded_jobs_css = generate_excluded_jobs_css()
    
    return f"""
        {FONT_IMPORT}

        @media print {{
            body {{
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                font-family: 'Poppins', sans-serif !important;
                color: #384347 !important;
            }}
            #root {{
                padding: 0 !important;
                margin: 0 !important;
                background: white !important;
            }}
            #downloadPdfBtnContainer {{
                display: none !important;
            }}
            #resumeContent {{
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                background: white !important;
            }}
            header {{
                display: flex !important;
                justify-content: space-between !important;
                align-items: flex-start !important;
                text-align: left !important;
                margin-bottom: 28pt !important;
            }}
            header > div:first-child {{
                text-align: left !important;
            }}
            header > div:last-child {{
                text-align: right !important;
            }}
            header .contact-info {{
                text-align: right !important;
            }}
            header .contact-info > div {{
                justify-content: flex-end !important;
            }}
            header .contact-info i {{
                margin-right: 0.5rem !important;
            }}
            /* Estilos de tipografía específicos */
            h1 {{
                font-size: 26pt !important;
                font-weight: 700 !important;
                color: #002878 !important;
                line-height: 1.2 !important;
                margin-bottom: 4pt !important;
            }}
            h2 {{
                font-size: 14pt !important;
                font-weight: 700 !important;
                color: #ff6e1b !important;
                line-height: 1.2 !important;
            }}
            .section-title {{
                font-size: 14pt !important;
                font-weight: 700 !important;
                color: #002878 !important;
                line-height: 1.2 !important;
                margin-bottom: 14pt !important;
                margin-top: 10pt !important;
            }}
            .entry-title {{
                font-size: 11pt !important;
                font-weight: 400 !important;
                color: #002878 !important;
                line-height: 1.2 !important;
                margin-bottom: 4pt !important;
            }}
            .institution-name {{
                font-size: 11pt !important;
                font-weight: 700 !important;
                color: #ff6e1b !important;
                line-height: 1.2 !important;
                margin-bottom: 4pt !important;
            }}
            .meta-info {{
                font-size: 9.5pt !important;
                font-weight: 400 !important;
                color: #6B7280 !important;
                line-height: 1.25 !important;
                margin-bottom: 8pt !important;
                display: flex !important;
                align-items: center !important;
            }}
            .meta-info i {{
                color: #6B7280 !important;
                margin-right: 0.5rem !important;
            }}
            .meta-info .mx-2 {{
                margin: 0 0.5rem !important;
                color: #6B7280 !important;
            }}
            .description-list {{
                font-size: 9.5pt !important;
                font-weight: 400 !important;
                color: #384347 !important;
                line-height: 1.1 !important;
                margin-bottom: 8pt !important;
                padding-left: 0 !important;
                list-style-type: none !important;
            }}
            .description-list li {{
                margin-bottom: 4pt !important;
            }}
            /* Trabajos a excluir en el PDF */
            {excluded_jobs_css}
            /* Estilos específicos para el perfil */
            .profile-section .text-gray-600 {{
                font-size: 9.5pt !important;
                line-height: 1.1 !important;
                color: #384347 !important;
            }}
            /* Ajustes para las líneas divisorias */
            hr.border-dashed {{
                margin-top: 4pt !important;
                margin-bottom: 4pt !important;
                border-top: 1px dashed #e5e7eb !important;
            }}
            .education-item, .experience-item {{
                margin-bottom: 8pt !important;
                padding: 0 !important;
            }}
            .education-item:last-child, .experience-item:last-child {{
                margin-bottom: 0 !important;
            }}
            .main-content-grid {{
                display: grid !important;
                grid-template-columns: 1.8fr 1.2fr !important;
                gap: 32pt !important;
                width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
            }}
            .left-column {{
                order: 1 !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }}
            .right-column {{
                order: 2 !important;
                width: 100% !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
            }}
            .profile-column {{
                order: 2 !important;
            }}
            section {{
                margin-bottom: 28pt !important;
            }}
            section:last-child {{
                margin-bottom: 0 !important;
            }}
            * {{
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }}
        }}
    """ 