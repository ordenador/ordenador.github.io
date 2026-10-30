"""Acceptance checks for a built local preview or an authorized deployment.

No test clicks external contact links or sends data to production analytics.
"""
import argparse
import asyncio
from io import BytesIO
import json
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

from playwright.async_api import async_playwright
from pypdf import PdfReader

ORIGIN = 'https://ordenador.cl'
LOCALES = {'es': '/', 'en': '/en/'}
PDF_PATHS = [
    '/mario_faundez_cv.es.pdf', '/mario_faundez_cv.en.pdf',
    '/mario_faundez_cv.pdf', '/cv/ia-aplicada/mario_faundez_cv.es.pdf',
]


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def pdf_checks(content, path):
    reader = PdfReader(BytesIO(content))
    text = '\n'.join(page.extract_text() for page in reader.pages)
    check(len(reader.pages) >= 2, f'{path}: suspiciously short PDF')
    for value in ['Mario Faúndez', 'Adessa Falabella', 'LATAM Airlines', 'Finalis', 'DevOps Engineer', 'Kairos']:
        check(value in text, f'{path}: missing text {value}')
    check(text.count('Sysadmin Engineer') == 2, f'{path}: old roles omitted')
    check(text.index('Kairos') < text.index('Adessa Falabella'), f'{path}: reading order')
    check('/StructTreeRoot' in reader.trailer['/Root'], f'{path}: untagged PDF')
    links = [a.get_object().get('/A', {}).get('/URI', '') for page in reader.pages for a in page.get('/Annots', [])]
    check(any(link.startswith('mailto:') for link in links), f'{path}: no email link')
    check(any('linkedin.com' in link for link in links), f'{path}: no LinkedIn link')
    check(any('mfaundez.com' in link for link in links), f'{path}: no profile link')
    expected = 'Capacidades' if '.es.pdf' in path else 'Capabilities'
    check(expected in text, f'{path}: wrong language')
    print(f'PASS PDF {path}: {len(reader.pages)} pages, full career, reading order, links, tags')


async def run(args):
    base = args.base_url.rstrip('/')
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        # Browser automation suppresses production analytics; intercept as an
        # additional safeguard and assert the page does not even try to load it.
        context = await browser.new_context(locale='en-US', viewport={'width':1440,'height':1000})
        analytics_requests = []
        await context.route('**/*google-analytics.com/**', lambda route: route.abort())
        await context.route('**/*googletagmanager.com/**', lambda route: route.abort())
        context.on('request', lambda request: analytics_requests.append(request.url) if ('google-analytics.com' in request.url or 'googletagmanager.com' in request.url) else None)
        await context.add_init_script("localStorage.setItem('lang','en')")
        for locale, path in LOCALES.items():
            page = await context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type in ('error','warning') else None)
            await page.goto(base + path + '?utm_source=acceptance#experience', wait_until='networkidle')
            check(await page.locator('html').get_attribute('lang') == locale, 'URL must control locale')
            check(await page.locator('h1').count() == 1, 'One primary heading')
            await page.locator('.skip-link').focus()
            await page.keyboard.press('Enter')
            check(await page.evaluate('document.activeElement.id') == 'resumeContent', 'Keyboard skip link reaches main')
            check(await page.locator('.experience-item').count() == 9, 'All nine roles retained in DOM')
            await page.locator('.career-history summary').click()
            check(await page.locator('.experience-item').last.is_visible(), 'Earlier history must open')
            await page.locator('.career-history summary').click()
            expected_pdf = f'/mario_faundez_cv.{locale}.pdf'
            check(await page.locator('.download-pdf-btn').get_attribute('href') == expected_pdf, 'Absolute PDF link')
            other = 'en' if locale == 'es' else 'es'
            switch = page.locator(f'.language-switcher a[lang="{other}"]')
            await page.wait_for_function("document.querySelector('.language-switcher a').getAttribute('href').includes('#resumeContent')")
            href = await switch.get_attribute('href')
            check(href == LOCALES[other] + '?utm_source=acceptance#resumeContent', 'Language link preserves unrelated query and current hash')
            check(await page.locator('link[rel="canonical"]').get_attribute('href') == ORIGIN + path, 'Canonical per language')
            check(await page.locator('link[hreflang="es"]').get_attribute('href') == ORIGIN + '/', 'ES alternate')
            check(await page.locator('link[hreflang="en"]').get_attribute('href') == ORIGIN + '/en/', 'EN alternate')
            check(await page.locator('link[hreflang="x-default"]').get_attribute('href') == ORIGIN + '/', 'Default alternate')
            for selector in ['meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]','meta[name="twitter:card"]']:
                check(await page.locator(selector).get_attribute('content'), f'Missing {selector}')
            schema = json.loads(await page.locator('script[type="application/ld+json"]').inner_text())
            check(schema['mainEntity']['@id'] == 'https://mfaundez.com/#mario-faundez', 'Person identity across sites')
            check(schema['inLanguage'] == locale, 'Schema language')
            for width in [320,390,768,1440]:
                await page.set_viewport_size({'width':width,'height':900})
                await page.evaluate('window.scrollTo(0,0)')
                metrics = await page.evaluate('''() => ({
                  width: innerWidth, scroll: document.documentElement.scrollWidth,
                  experience: document.querySelector('#experience').getBoundingClientRect().top,
                  skills: document.querySelector('.skills-section').getBoundingClientRect().top,
                  summaryEnd: document.querySelector('.profile-section').getBoundingClientRect().bottom,
                  font: parseFloat(getComputedStyle(document.querySelector('.entry-summary')).fontSize),
                  fonts: performance.getEntriesByType('resource').filter(x=>x.name.includes('.woff')).map(x=>x.name)
                })''')
                check(metrics['scroll'] <= width, f'{locale}/{width}: horizontal overflow')
                check(metrics['font'] >= 16, f'{locale}/{width}: body text too small')
                check(metrics['experience'] > metrics['summaryEnd'] - 1, 'Experience after profile')
                if width <= 800:
                    check(metrics['experience'] < metrics['skills'], 'Mobile experience before capabilities')
                    check(metrics['experience'] < 850, f'{locale}/{width}: experience buried again')
                check(not any('fa-' in name for name in metrics['fonts']), 'No icon font downloads')
            contrast = await page.evaluate(r"""() => {
                const rgb = text => (text.match(/[\d.]+/g) || []).map(Number);
                const luminance = values => values.slice(0,3).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
                const background = element => {
                    let current=element;
                    while(current) {
                        const color=rgb(getComputedStyle(current).backgroundColor);
                        if(color.length===3 || color[3]===1) return color;
                        current=current.parentElement;
                    }
                    return [255,255,255];
                };
                const failures=[]; let count=0; let minimum=Infinity;
                for(const element of document.querySelectorAll('body *')) {
                    if(![...element.childNodes].some(n=>n.nodeType===3 && n.textContent.trim())) continue;
                    const style=getComputedStyle(element);
                    if(!element.getClientRects().length || style.visibility==='hidden' || style.opacity==='0') continue;
                    const fg=luminance(rgb(style.color)), bg=luminance(background(element));
                    const ratio=(Math.max(fg,bg)+.05)/(Math.min(fg,bg)+.05);
                    const large=parseFloat(style.fontSize)>=24 || (parseFloat(style.fontSize)>=18.6667 && parseFloat(style.fontWeight)>=700);
                    const threshold=large?3:4.5;
                    count++; minimum=Math.min(minimum,ratio);
                    if(ratio<threshold) failures.push({tag:element.tagName,className:element.className,ratio,threshold});
                }
                return {count,minimum,failures};
            }""")
            check(contrast['count'] > 40, 'Contrast audit must inspect rendered text')
            check(not contrast['failures'], f"Text contrast failures: {contrast['failures']}")
            print(f"PASS {locale} text contrast: {contrast['count']} elements, minimum {contrast['minimum']:.2f}:1")
            await page.locator('.career-history summary').focus()
            await page.keyboard.press('Enter')
            check(await page.locator('.career-history').get_attribute('open') is not None, 'Keyboard opens history')
            if args.screenshot_dir:
                folder = Path(args.screenshot_dir)
                folder.mkdir(parents=True,exist_ok=True)
                await page.locator('.career-history summary').click()
                await page.set_viewport_size({'width':1440,'height':1000})
                await page.evaluate('document.activeElement.blur()')
                await page.screenshot(path=str(folder/f'{locale}-desktop.png'),full_page=True)
                await page.set_viewport_size({'width':390,'height':844})
                await page.screenshot(path=str(folder/f'{locale}-mobile.png'),full_page=True)
            await page.locator('.career-history').evaluate('(element) => element.open = false')
            await page.emulate_media(media='print')
            check(await page.locator('.experience-item').last.is_visible(), 'All history visible when printing')
            check(not errors, f'{locale}: console/hydration errors: {errors}')
            await page.close()
            print(f'PASS hydrated {locale}: URL/metadata/history/keyboard/print + 4 responsive widths')

            nojs = await browser.new_context(java_script_enabled=False)
            plain = await nojs.new_page()
            response = await plain.goto(base+path)
            check(response.status == 200, 'Static language page serves 200')
            check(await plain.locator('html').get_attribute('lang') == locale, 'Static HTML locale')
            check(await plain.locator('.experience-item').count() == 9, 'Static complete history')
            check('Kairos' in await plain.locator('.profile-section').inner_text(), 'Static profile content')
            await plain.locator('.career-history summary').click()
            check(await plain.locator('.experience-item').last.is_visible(), 'History usable without JS')
            await plain.locator(f'.language-switcher a[lang="{other}"]').click()
            check(await plain.locator('html').get_attribute('lang') == other, 'Language navigation without JS')
            await nojs.close()
            print(f'PASS no-JS {locale}: complete HTML + history + language link')

        page = await context.new_page()
        for locale in LOCALES:
            await page.goto(base + '/?lang=' + locale + '&utm_source=legacy#experience',wait_until='networkidle')
            check(urlsplit(page.url).path == LOCALES[locale], 'Legacy URL normalized')
            check(urlsplit(page.url).query == 'utm_source=legacy', 'Legacy query retained')
            check(urlsplit(page.url).fragment == 'experience', 'Legacy hash retained')
            check(await page.locator('html').get_attribute('lang') == locale, 'Legacy locale')
        await page.goto(base+'/?cv=ia-aplicada&lang=en&utm_source=variant#experience',wait_until='networkidle')
        check(await page.locator('html').get_attribute('lang') == 'es', 'Variant keeps fixed locale')
        check(await page.locator('meta[name="robots"]').get_attribute('content') == 'noindex', 'Variant not promoted to index')
        check(await page.locator('.experience-item').count() == 9, 'Variant still renders')
        href = await page.locator('.language-switcher a[lang="en"]').get_attribute('href')
        check(href == '/en/?utm_source=variant#experience', 'Language switch returns official translated CV explicitly')
        check('cv=ia-aplicada' in page.url, 'Variant query preserved on initial visit')
        for unknown in ['missing-variant', 'constructor', 'toString', '__proto__']:
            await page.goto(base + '/?cv=' + unknown, wait_until='networkidle')
            check(await page.locator('h1').inner_text() == 'Mario Faúndez', 'Unknown/inherited variant uses official CV')
            check(await page.locator('.experience-item').count() == 9, 'Unknown/inherited variant preserves complete career')
            check(await page.locator('html').get_attribute('lang') == 'es', 'Unknown variant uses URL locale')
        print('PASS legacy params, hash, valid and unknown/inherited variants and official language switch')

        request = context.request
        pdf_contents = {}
        for path in PDF_PATHS:
            response = await request.get(base+path)
            check(response.status == 200, f'PDF unavailable: {path}')
            check('application/pdf' in response.headers.get('content-type',''), f'PDF MIME: {path}')
            pdf_contents[path] = await response.body()
            pdf_checks(pdf_contents[path],path)
        check(pdf_contents['/mario_faundez_cv.pdf'] == pdf_contents['/mario_faundez_cv.en.pdf'], 'Legacy alias equals English PDF')
        check(pdf_contents['/mario_faundez_cv.es.pdf'] != pdf_contents['/mario_faundez_cv.en.pdf'], 'Distinct language PDFs')
        for path in ['/missing-audit-route','/missing-audit-route.html','/missing-audit-asset.png']:
            check((await request.get(base+path)).status == 404, f'Real 404: {path}')
        robots = await request.get(base+'/robots.txt')
        check(robots.status == 200 and ORIGIN+'/sitemap.xml' in await robots.text(), 'Robots discovery')
        sitemap = await request.get(base+'/sitemap.xml')
        tree = ET.fromstring(await sitemap.text())
        locs = [node.text for node in tree.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
        check(set(locs) == {ORIGIN+'/',ORIGIN+'/en/'}, 'Exactly two canonical sitemap URLs')
        check('cv=' not in await sitemap.text(), 'No personalized variants in sitemap')
        for path in ['/favicon.svg','/favicon.ico','/apple-touch-icon.png','/social-card.png','/fonts/schibsted-grotesk-latin.woff2']:
            check((await request.get(base+path)).status == 200, f'Asset unavailable: {path}')
        check(not analytics_requests, f'Automated browser sent analytics: {analytics_requests}')
        await context.close()
        await browser.close()
        print('PASS discovery, identity assets, real 404, PDF aliases, analytics suppression')
    print('PASS all acceptance checks')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:4175')
    parser.add_argument('--screenshot-dir')
    asyncio.run(run(parser.parse_args()))
