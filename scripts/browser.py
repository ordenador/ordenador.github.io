"""
Módulo para manejar la lógica del navegador y la generación del PDF.
"""
from playwright.async_api import async_playwright, Browser, Page
from scripts.config import BROWSER_CONFIG, PDF_CONFIG, OUTPUT_DIR
from scripts.styles import get_pdf_styles

class BrowserManager:
    """Clase para manejar la instancia del navegador y la generación del PDF."""
    
    def __init__(self):
        self.pw_instance = None
        self.browser = None
        self.context = None
        self.page = None

    async def setup(self):
        """Configura el navegador y crea una nueva página."""
        self.pw_instance = await async_playwright().start()
        self.browser = await self.pw_instance.chromium.launch(
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
        self.context = await self.browser.new_context(**BROWSER_CONFIG)
        self.page = await self.context.new_page()
        
        # Configurar listeners para depuración
        self.page.on('console', lambda msg: print(f"PAGE CONSOLE: [{msg.type}] {msg.text}"))
        self.page.on('pageerror', lambda exc: print(f"PAGE ERROR (uncaught exception): {exc}"))

    async def handle_route(self, route):
        """Maneja las solicitudes de recursos durante la carga de la página."""
        url = route.request.url
        print(f"Interceptando request a: {url}")
        
        if url.startswith('file://'):
            try:
                file_path = url.replace('file://', '')
                print(f"Intentando cargar archivo local: {file_path}")
                
                # Si la ruta es relativa, buscar en el directorio dist
                if file_path.startswith('/assets/'):
                    file_path = str(OUTPUT_DIR / file_path[1:])
                
                content_type = self._get_content_type(file_path)
                
                with open(file_path, 'rb') as f:
                    content = f.read()
                
                await route.fulfill(
                    status=200,
                    content_type=content_type,
                    body=content
                )
                print(f"Archivo cargado exitosamente: {file_path}")
            except Exception as e:
                print(f"Error al cargar archivo local {url}: {str(e)}")
                await route.continue_()
        elif any(ext in url for ext in ['cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com']):
            await route.continue_()
        else:
            print(f"Bloqueando request a: {url}")
            await route.abort()

    def _get_content_type(self, file_path: str) -> str:
        """Determina el tipo de contenido basado en la extensión del archivo."""
        if file_path.endswith('.css'):
            return 'text/css'
        elif file_path.endswith('.js'):
            return 'application/javascript'
        elif file_path.endswith('.json'):
            return 'application/json'
        elif file_path.endswith('.png'):
            return 'image/png'
        elif file_path.endswith('.jpg') or file_path.endswith('.jpeg'):
            return 'image/jpeg'
        elif file_path.endswith('.svg'):
            return 'image/svg+xml'
        return 'text/html'

    async def generate_pdf(self, html_file: str):
        """Genera el PDF a partir del archivo HTML."""
        try:
            # Configurar el interceptor de requests
            await self.page.route("**/*", self.handle_route)
            print("Interceptor de requests configurado.")

            # Cargar el archivo HTML
            file_url = f"file://{html_file}"
            print(f"Cargando archivo local: {file_url}")
            
            await self.page.goto(file_url, wait_until='networkidle')
            print("Archivo HTML cargado, red mayormente inactiva.")
            
            # Verificar que los estilos se cargaron
            styles = await self.page.evaluate("""() => {
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

            # Inyectar estilos CSS
            await self.page.add_style_tag(content=get_pdf_styles())

            # Esperar a que el contenido esté listo
            await self.page.wait_for_selector('#resumeContent', state='visible')
            print("El contenedor principal '#resumeContent' está visible.")
            
            # Esperar a que las fuentes estén cargadas
            await self.page.evaluate("document.fonts.ready")
            print("Las fuentes están cargadas.")

            # Generar PDF
            pdf_file_path = OUTPUT_DIR / 'CV_Mario_Faundez_Playwright.pdf'
            print(f"Generando PDF en: {pdf_file_path}...")
            
            await self.page.pdf(
                path=str(pdf_file_path),
                **PDF_CONFIG
            )
            print(f"PDF generado exitosamente: {pdf_file_path}")

        except Exception as e:
            print(f"Error CRÍTICO al generar el PDF: {e}")
            raise

    async def cleanup(self):
        """Limpia los recursos del navegador."""
        if self.browser:
            print("Cerrando el navegador...")
            await self.browser.close()
        if self.pw_instance:
            print("Deteniendo la instancia de Playwright...")
            await self.pw_instance.stop()
        print("Script finalizado.") 