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

    async def generate_pdf(self, html_file: str, lang: str = 'en'):
        """Genera el PDF a partir del archivo HTML para un idioma."""
        try:
            # Cargar el archivo HTML (todos los assets son locales)
            file_url = f"file://{html_file}?lang={lang}"
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
            pdf_file_path = OUTPUT_DIR / f'mario_faundez_cv.{lang}.pdf'
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
