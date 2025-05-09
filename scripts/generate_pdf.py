import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def generate_cv_pdf():
    """
    Genera un PDF de un CV renderizado por React, sirviendo la aplicación localmente.
    """
    pw_instance = None
    browser = None

    try:
        # --- Configuración de Rutas de Salida ---
        script_dir = Path(__file__).resolve().parent
        output_dir = (script_dir / '../dist').resolve()
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Ajustar las rutas en el HTML
        html_file = output_dir / 'index.html'
        if not html_file.exists():
            raise Exception(f"No se encontró el archivo HTML en {html_file}")
        
        # Leer el contenido del HTML
        with open(html_file, 'r', encoding='utf-8') as f:
            html_content = f.read()
        
        # Ajustar las rutas de los assets
        html_content = html_content.replace('src="/assets/', f'src="file://{output_dir}/assets/')
        html_content = html_content.replace('href="/assets/', f'href="file://{output_dir}/assets/')
        
        # Guardar el HTML modificado
        temp_html = output_dir / 'temp_index.html'
        with open(temp_html, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print("Iniciando Playwright...")
        pw_instance = await async_playwright().start()
        browser = await pw_instance.chromium.launch(
            headless=True,
            args=[
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--force-device-scale-factor=1',
                '--allow-file-access-from-files',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process',
            ]
        )
        context = await browser.new_context(
            viewport={'width': 1280, 'height': 2260},
            device_scale_factor=1,
            is_mobile=False,
            has_touch=False,
            locale='es-ES',
            timezone_id='America/Santiago',
            color_scheme='light',
            forced_colors='none',
            reduced_motion='no-preference'
        )
        page = await context.new_page()
        print("Nueva página creada en Chromium con configuración optimizada para PDF.")

        # --- Configuración de Listeners para Depuración ---
        page.on('console', lambda msg: print(f"PAGE CONSOLE: [{msg.type}] {msg.text}"))
        page.on('pageerror', lambda exc: print(f"PAGE ERROR (uncaught exception): {exc}"))

        async def handle_route(route):
            url = route.request.url
            print(f"Interceptando request a: {url}")
            
            # Manejar archivos locales
            if url.startswith('file://'):
                try:
                    # Extraer la ruta del archivo
                    file_path = url.replace('file://', '')
                    print(f"Intentando cargar archivo local: {file_path}")
                    
                    # Determinar el tipo de contenido basado en la extensión
                    content_type = 'text/html'
                    if file_path.endswith('.css'):
                        content_type = 'text/css'
                    elif file_path.endswith('.js'):
                        content_type = 'application/javascript'
                    elif file_path.endswith('.json'):
                        content_type = 'application/json'
                    elif file_path.endswith('.png'):
                        content_type = 'image/png'
                    elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
                        content_type = 'image/jpeg'
                    elif file_path.endswith('.svg'):
                        content_type = 'image/svg+xml'
                    
                    # Leer el archivo
                    with open(file_path, 'rb') as f:
                        content = f.read()
                    
                    # Responder con el contenido del archivo
                    await route.fulfill(
                        status=200,
                        content_type=content_type,
                        body=content
                    )
                    print(f"Archivo cargado exitosamente: {file_path}")
                except Exception as e:
                    print(f"Error al cargar archivo local {url}: {str(e)}")
                    await route.continue_()
            # Permitir recursos externos específicos
            elif any(ext in url for ext in ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com']):
                await route.continue_()
            else:
                print(f"Bloqueando request a: {url}")
                await route.abort()

        # Configurar el interceptor de requests
        await page.route("**/*", handle_route)
        print("Interceptor de requests configurado.")

        # Define un viewport consistente para el renderizado
        await page.set_viewport_size({"width": 1280, "height": 2260})
        print(f"Viewport configurado a: {page.viewport_size}")

        # --- Cargar el archivo HTML local ---
        file_url = f"file://{temp_html.absolute()}"
        print(f"Cargando archivo local: {file_url}")
        
        try:
            # Esperar a que se carguen todos los recursos
            await page.goto(file_url, wait_until='networkidle')
            print("Archivo HTML cargado, red mayormente inactiva.")
            
            # Verificar que los estilos se cargaron
            styles = await page.evaluate("""() => {
                const styles = Array.from(document.styleSheets);
                return styles.map(sheet => {
                    try {
                        return sheet.href || 'inline';
                    } catch (e) {
                        return 'error';
                    }
                });
            }""")
            print("Hojas de estilo cargadas:", styles)
            
        except Exception as e_goto:
            print(f"Error CRÍTICO al cargar el archivo HTML: {e_goto}")
            return

        # Inyectar CSS para forzar el layout correcto
        await page.add_style_tag(content="""
            @media print {
                body {
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    background: white !important;
                }
                #root {
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                }
                #downloadPdfBtnContainer {
                    display: none !important;
                }
                #resumeContent {
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 10px !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    background: white !important;
                }
                header {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: flex-start !important;
                    text-align: left !important;
                    margin-bottom: 1.5rem !important;
                }
                header > div:first-child {
                    text-align: left !important;
                }
                header > div:last-child {
                    text-align: right !important;
                }
                header .contact-info {
                    text-align: right !important;
                }
                header .contact-info > div {
                    justify-content: flex-end !important;
                }
                header .contact-info i {
                    margin-right: 0.5rem !important;
                }
                .main-content-grid {
                    display: grid !important;
                    grid-template-columns: 2fr 1fr !important;
                    gap: 1.5rem !important;
                    width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .left-column {
                    order: 1 !important;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .right-column {
                    order: 2 !important;
                    width: 100% !important;
                    max-width: none !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                .profile-column {
                    order: 2 !important;
                }
                * {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
            }
        """)

        # Esperar a que el contenido esté listo
        await page.wait_for_selector('#resumeContent', state='visible')
        print("El contenedor principal '#resumeContent' está visible.")
        
        # Esperar a que las fuentes estén cargadas
        await page.evaluate("document.fonts.ready")
        print("Las fuentes están cargadas.")

        # Generar PDF
        pdf_file_path = output_dir / 'CV_Mario_Faundez_Playwright.pdf'
        print(f"Generando PDF en: {pdf_file_path}...")
        try:
            await page.pdf(
                path=str(pdf_file_path),
                format='A4',
                print_background=True,
                margin={
                    'top': '10mm',
                    'right': '10mm',
                    'bottom': '10mm',
                    'left': '10mm'
                },
                scale=0.95,
                prefer_css_page_size=True,
                display_header_footer=False,
            )
            print(f"PDF generado exitosamente: {pdf_file_path}")
        except Exception as e_pdf:
            print(f"Error CRÍTICO al generar el PDF: {e_pdf}")

    except Exception as e_general:
        print(f"Ocurrió un error general no controlado: {e_general}")
    finally:
        if browser:
            print("Cerrando el navegador...")
            await browser.close()
        if pw_instance:
            print("Deteniendo la instancia de Playwright...")
            await pw_instance.stop()
        print("Script finalizado.")

if __name__ == '__main__':
    print("Ejecutando el script de generación de PDF para el CV...")
    asyncio.run(generate_cv_pdf())
