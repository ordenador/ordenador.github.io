"""Acceptance checks for a built local preview or an authorized deployment.

No test clicks external contact links or sends data to production analytics.
"""
import argparse
import asyncio
from io import BytesIO
import json
import hashlib
import re
from pathlib import Path
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

from playwright.async_api import async_playwright
from pypdf import PdfReader

ORIGIN = 'https://ordenador.cl'
LOCALES = {'es': '/', 'en': '/en/'}
SOURCE_CONTENT = ('.experience-item h3, .experience-item .institution-name, .experience-item .entry-summary, '
                  '.experience-item .description-list li, .education-item h3, .education-item p, '
                  '.profile-section > div, .skill-group h3, .skill-group p, .certification-group h3, '
                  '.certification-group li, .languages-section dt, .languages-section dd, .interests-section p')
APPROVED_SCREEN_CSS = '1eb69ebfc6e4ad1efb390fae819ffbf6c6c3e7254f2367ac7e9e1988a342621e'
PDF_PATHS = [
    '/mario_faundez_cv.es.pdf', '/mario_faundez_cv.en.pdf',
    '/mario_faundez_cv.pdf', '/cv/ia-aplicada/mario_faundez_cv.es.pdf',
]


def check(condition, message):
    if not condition:
        raise AssertionError(message)


def pdf_checks(content, path, responsibilities=None, require_compact=True):
    reader = PdfReader(BytesIO(content))
    text = '\n'.join(page.extract_text() for page in reader.pages)
    check(len(reader.pages) >= 2, f'{path}: suspiciously short PDF')
    if require_compact:
        check(len(reader.pages) == 2, f'{path}: approved paper layout has two complete pages; review pagination')
    for value in ['Mario Faúndez', 'Adessa Falabella', 'LATAM Airlines', 'Finalis', 'DevOps Engineer', 'Kairos']:
        check(value in text, f'{path}: missing text {value}')
    check(text.count('Sysadmin Engineer') == 2, f'{path}: old roles omitted')
    normalized = re.sub(r'[^\w]', '', text).casefold()
    periods = ['Mar2026', 'May2024Feb2026', '112023042025', '112020102023',
               '072019102020', '102017062019', '062020072022', '062016102017', '062012122015']
    positions = [normalized.find(period.casefold()) for period in periods]
    check(all(position >= 0 for position in positions), f'{path}: missing career period')
    check(positions == sorted(positions), f'{path}: career order across page/column continuation')
    for responsibility in responsibilities or []:
        expected_text = re.sub(r'[^\w]', '', responsibility).casefold()
        check(expected_text in normalized, f'{path}: a source responsibility is missing from the PDF')
    check('/StructTreeRoot' in reader.trailer['/Root'], f'{path}: untagged PDF')
    links = [a.get_object().get('/A', {}).get('/URI', '') for page in reader.pages for a in page.get('/Annots', [])]
    check(any(link.startswith('mailto:') for link in links), f'{path}: no email link')
    check(any('linkedin.com' in link for link in links), f'{path}: no LinkedIn link')
    check(not any('mfaundez.com' in link for link in links), f'{path}: unwanted full-profile annotation')
    check('Ver perfil completo' not in text and 'View full profile' not in text, f'{path}: unwanted full-profile text')
    expected = 'Capacidades' if '.es.pdf' in path else 'Capabilities'
    check(expected.casefold() in text.casefold(), f'{path}: wrong language')
    print(f'PASS PDF {path}: {len(reader.pages)} pages, full career, reading order, links, tags')


async def verify_screen_and_print(browser, base, args):
    for locale, path in LOCALES.items():
        for width in [320,390,768,1440]:
            page = await browser.new_page(viewport={'width':width,'height':900})
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            await page.goto(base+path,wait_until='networkidle')
            await page.evaluate('document.fonts.ready')
            before = await page.screenshot(full_page=True)
            if args.screen_baseline_dir:
                approved = Path(args.screen_baseline_dir,f'{locale}-{width}.png').read_bytes()
                check(before == approved, f'{locale}/{width}: approved frontend pixels changed')
            fonts = await page.evaluate("performance.getEntriesByType('resource').filter(r=>r.name.includes('.woff')).map(r=>r.name)")
            check(len(fonts) == 1 and 'schibsted' in fonts[0], 'No print font payload in screen mode')
            for initially_open in [False,True]:
                await page.locator('.career-history').evaluate('(element, value) => element.open = value', initially_open)
                dom = await page.locator('#resumeContent').inner_html()
                await page.emulate_media(media='print')
                await page.wait_for_selector('.print-continuation')
                await page.evaluate("window.dispatchEvent(new Event('beforeprint'))")
                check(await page.locator('main > .print-columns').count() == 1, 'Repeated print preparation is idempotent')
                check(await page.locator('.experience-item').count() == 9, 'All nine original entries present while printing')
                check(await page.locator('.print-left-column .education-section').count() == 1, 'Education remains in classic left column')
                check(await page.locator('.print-right-column .profile-section').count() == 1, 'Profile remains in classic right column')
                await page.emulate_media(media='screen')
                await page.wait_for_function("!document.querySelector('.print-continuation')")
                check(await page.locator('#resumeContent').inner_html() == dom, 'Print/cancel restores exact original DOM and disclosure state')
            await page.locator('.career-history').evaluate('(element) => element.open = false')
            if width == 1440:
                # A fresh context is intentional: explicit emulate_media('screen')
                # can persist through CDP PDF capture even after clearing the
                # override. Exercise real repeated native prints separately.
                native = await browser.new_page(viewport={'width':1440,'height':900})
                native_errors = []
                native.on('pageerror', lambda error: native_errors.append(str(error)))
                await native.goto(base+path,wait_until='networkidle')
                await native.evaluate('document.fonts.ready')
                dom = await native.locator('#resumeContent').inner_html()
                pixels = await native.screenshot(full_page=True)
                responsibilities = await native.locator(SOURCE_CONTENT).all_text_contents()
                for iteration in range(3):
                    printed = await native.pdf(format='A4',print_background=True,tagged=True,prefer_css_page_size=True)
                    await native.wait_for_function("!document.querySelector('.print-continuation')")
                    check(await native.locator('#resumeContent').inner_html() == dom, 'Actual PDF export restores approved screen DOM')
                    pdf_checks(printed,f'native-{iteration+1}.{locale}.pdf',responsibilities)
                await native.evaluate("location.hash = 'experience'")
                await native.wait_for_function("document.querySelector('.language-switcher a').getAttribute('href').endsWith('#experience')")
                await native.evaluate("history.replaceState(null,'',location.pathname); scrollTo(0,0)")
                check(await native.screenshot(full_page=True) == pixels, 'Repeated actual native PDFs preserve screen pixels')
                check(not native_errors, f'Repeated native print caused React/browser errors: {native_errors}')
                await native.close()
            await page.evaluate('window.scrollTo(0,0)')
            await page.evaluate('document.fonts.ready')
            after = await page.screenshot(full_page=True)
            check(before == after, f'{locale}/{width}: screen pixels changed after printing')
            check(not errors, f'Print lifecycle caused browser errors: {errors}')
            print(f'PASS {locale}/{width} screen unchanged before/after print: {hashlib.sha256(after).hexdigest()}')
            await page.close()


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
            before_print = await page.locator('#resumeContent').inner_html()
            await page.emulate_media(media='print')
            await page.wait_for_selector('.print-continuation')
            check(await page.locator('.experience-item').last.is_visible(), 'All history visible when printing')
            check(await page.locator('.print-columns').count() == 2, 'Classic first page plus two-column continuation')
            check(await page.locator('main > .print-columns .experience-item').count() == 2, 'Two recent roles fill the first page')
            check(await page.locator('.print-continuation .experience-item').count() == 7, 'Seven older roles retained in continuation')
            check(not await page.locator('.profile-link').is_visible(), 'Full-profile link hidden only in print')
            geometry = await page.evaluate('''() => [...document.querySelectorAll('.print-columns')].map(grid =>
                [...grid.children].map(column => { const r = column.getBoundingClientRect();
                    return {x:r.x, width:r.width, height:r.height}; }))''')
            for first, second in zip(*geometry):
                check(abs(first['x'] - second['x']) < 0.1 and abs(first['width'] - second['width']) < 0.1, 'Same paper column axes on both pages')
            check(abs(geometry[0][0]['width'] - geometry[0][1]['width']) < 0.1, 'Equal-width paper columns')
            await page.emulate_media(media='screen')
            await page.wait_for_function("!document.querySelector('.print-continuation')")
            check(await page.locator('#resumeContent').inner_html() == before_print, 'Exact DOM restored after print')
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
            # Exercise the real static stylesheet with application JS disabled;
            # no routed HTML, injected CSS or application grouping is supplied.
            check(await plain.locator('link[href="/print.css"][media="print"]').count() == 1, 'Static paper stylesheet available without JS')
            await plain.wait_for_function("document.querySelector('link[href=\"/print.css\"]')?.sheet")
            await plain.emulate_media(media='print')
            check(await plain.locator('.experience-item').last.is_visible(), 'No-JS print keeps old roles visible')
            nojs_pdf = await plain.pdf(format='A4', print_background=True, tagged=True)
            nojs_text = '\n'.join(sheet.extract_text() for sheet in PdfReader(BytesIO(nojs_pdf)).pages)
            check('Ver perfil completo' not in nojs_text and 'View full profile' not in nojs_text, 'No-JS print hides full-profile text')
            nojs_links = [a.get_object().get('/A', {}).get('/URI', '') for sheet in PdfReader(BytesIO(nojs_pdf)).pages for a in sheet.get('/Annots', [])]
            check(not any('mfaundez.com' in link for link in nojs_links), 'No-JS print removes full-profile annotation')
            check('Adessa Falabella' in nojs_text and 'LATAM Airlines' in nojs_text, 'No-JS printed PDF retains older experience')
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
            source_path = '/?cv=ia-aplicada' if path.startswith('/cv/') else ('/' if '.es.pdf' in path else '/en/')
            await page.goto(base+source_path,wait_until='networkidle')
            source_responsibilities = await page.locator(SOURCE_CONTENT).all_text_contents()
            pdf_checks(pdf_contents[path],path,source_responsibilities)
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
        screen_css = await page.locator('link[rel="stylesheet"]:not([media="print"])').first.get_attribute('href')
        screen_response = await request.get(base+screen_css)
        check(hashlib.sha256(await screen_response.body()).hexdigest() == APPROVED_SCREEN_CSS, 'Approved screen CSS unchanged')
        await verify_screen_and_print(browser, base, args)
        await context.close()
        await browser.close()
        print('PASS discovery, identity assets, real 404, PDF aliases, analytics suppression')
    print('PASS all acceptance checks')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base-url',default='http://127.0.0.1:4175')
    parser.add_argument('--screenshot-dir')
    parser.add_argument('--screen-baseline-dir', help='Optional approved PNG baseline directory for exact screen pixel checks')
    asyncio.run(run(parser.parse_args()))
