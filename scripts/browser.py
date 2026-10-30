"""Render the built CV over loopback HTTP with normal browser security."""
import asyncio
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from threading import Thread

from playwright.async_api import async_playwright
from scripts.config import BROWSER_CONFIG, PDF_CONFIG, OUTPUT_DIR
from scripts.styles import get_pdf_styles


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, *_args):
        pass


class BrowserManager:
    def __init__(self):
        self.pw_instance = None
        self.browser = None
        self.server = None
        self.server_thread = None

    async def setup(self):
        self.server = ThreadingHTTPServer(
            ('127.0.0.1', 0), partial(QuietHandler, directory=str(OUTPUT_DIR))
        )
        self.server_thread = Thread(target=self.server.serve_forever, daemon=True)
        self.server_thread.start()
        self.origin = f'http://127.0.0.1:{self.server.server_port}'
        self.pw_instance = await async_playwright().start()
        self.browser = await self.pw_instance.chromium.launch(headless=True)

    async def generate_pdf(self, html_file: str, query: str, output: str):
        # html_file remains part of the existing generator API. The build is
        # served over HTTP so prerendered /en/ assets keep their root URLs.
        if not html_file:
            raise ValueError('Missing HTML file')
        context = await self.browser.new_context(**BROWSER_CONFIG)
        errors = []
        page = await context.new_page()
        page.on('pageerror', lambda error: errors.append(str(error)))
        try:
            await page.goto(f'{self.origin}/?{query}', wait_until='networkidle')
            await page.wait_for_selector('#resumeContent')
            await page.evaluate('document.fonts.ready')
            await page.locator('.career-history').evaluate('(element) => element.open = true')
            await page.add_style_tag(content=get_pdf_styles())
            if errors:
                raise RuntimeError(f'Browser errors during PDF generation: {errors}')
            actual_roles = await page.locator('.experience-item').count()
            expected_roles = int(await page.locator('#resumeContent').get_attribute('data-experience-count'))
            if not expected_roles or actual_roles != expected_roles:
                raise RuntimeError(f'Expected {expected_roles} experience entries, found {actual_roles}')
            pdf_file_path = OUTPUT_DIR / output
            pdf_file_path.parent.mkdir(parents=True, exist_ok=True)
            await page.pdf(path=str(pdf_file_path), **PDF_CONFIG)
            print(f'Generated {output} ({actual_roles} roles, all pages)')
        finally:
            await context.close()

    async def cleanup(self):
        if self.browser:
            await self.browser.close()
        if self.pw_instance:
            await self.pw_instance.stop()
        if self.server:
            await asyncio.to_thread(self.server.shutdown)
            self.server.server_close()
            self.server_thread.join(timeout=5)
