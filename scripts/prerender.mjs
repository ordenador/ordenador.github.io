import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { render } from '../dist-ssr/entry-server.js';
import { labels } from '../src/i18n/labels.js';
import { localizedPages, siteOrigin } from '../site.config.mjs';

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
if (!template.includes('<!--seo:start-->') || !template.includes('<div id="root"></div>'))
  throw new Error('Missing prerender template markers');
const card = await readFile(new URL('social-card.png', dist));
const image = `${siteOrigin}/social-card.png?v=${createHash('sha256').update(card).digest('hex').slice(0, 12)}`;
const escape = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const alternates = [
  ...Object.entries(localizedPages).map(([lang, page]) => [lang, siteOrigin + page.path]),
  ['x-default', siteOrigin + '/'],
];
for (const [locale, page] of Object.entries(localizedPages)) {
  const url = siteOrigin + page.path;
  const { body, schema } = render(locale);
  const title = labels[locale].pageTitle;
  const description = labels[locale].metaDescription;
  const imageAlt =
    locale === 'es'
      ? 'Mario Faúndez, plataformas de IA, código y música.'
      : 'Mario Faúndez, AI platforms, code and music. Spanish identity card.';
  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates.map(
      ([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}" />`
    ),
    '<meta property="og:type" content="profile" />',
    '<meta property="og:site_name" content="Mario Faúndez — CV" />',
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:locale" content="${page.locale}" />`,
    `<meta property="og:locale:alternate" content="${localizedPages[locale === 'es' ? 'en' : 'es'].locale}" />`,
    `<meta property="og:image" content="${image}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escape(imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<meta name="twitter:image:alt" content="${escape(imageAlt)}" />`,
    `<script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`,
  ].join('\n    ');
  const html = template
    .replace(/<html lang="[^"]+"/, `<html lang="${locale}"`)
    .replace(
      /<!--seo:start-->[\s\S]*?<!--seo:end-->/,
      `<!--seo:start-->\n    ${head}\n    <!--seo:end-->`
    )
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
  const directory = new URL(`.${page.path}`, dist);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), html);
  process.stdout.write(`Prerendered ${page.path} (${locale})\n`);
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${Object.values(
  localizedPages
)
  .map(
    (page) =>
      `  <url><loc>${siteOrigin}${page.path}</loc>\n${alternates.map(([lang, href]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${href}" />`).join('\n')}\n  </url>`
  )
  .join('\n')}\n</urlset>\n`;
await writeFile(new URL('sitemap.xml', dist), sitemap);
