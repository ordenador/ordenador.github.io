# Mario Faúndez — CV

Bilingual professional CV at [ordenador.cl](https://ordenador.cl), with complete,
selectable and tagged PDFs. [mfaundez.com](https://mfaundez.com/) is the broader
personal profile; the CV links to the matching language there.

## Local development

Use Node.js 24, pnpm (version pinned in `package.json`), Python 3.13+ and uv.

```sh
pnpm install --frozen-lockfile
uv sync --frozen
uv run playwright install chromium
pnpm start
```

The development server does not generate PDFs. For the production build, including
all PDF downloads, use:

```sh
pnpm run build
uv run python scripts/generate_pdf.py
pnpm run preview --host 127.0.0.1 --port 4175 --strictPort
```

Preview: Spanish at `http://127.0.0.1:4175/`, English at `/en/`.
For pnpm, pass preview flags directly; an extra `--` before them is passed to Vite
and can prevent the requested port from being applied.

`make build` and `make preview` remain available. Build generates web pages first,
then all PDFs. Rebuilding the web removes old PDFs; generate them again afterward.

## Content and language

- `src/data/resume.en.js` and `resume.es.js` supply content; Spanish overrides
  experience entries by array index. Keep the two arrays aligned when adding a role.
- One URL always has one language: `/` is Spanish and `/en/` is English. Browser
  language and localStorage no longer override the URL.
- ES/EN are native links, usable without JS. After hydration they preserve unrelated
  query parameters and section anchors. Old `?lang=es`/`?lang=en` URLs normalize
  in the browser to their canonical language paths, keeping unrelated params/hash.
- `?cv=ia-aplicada` still renders the fixed Spanish variant. It currently aliases
  the official Spanish data. Language links deliberately open the official CV in
  the requested language, removing `cv`; they never relabel Spanish variant data
  as English. Variants are omitted from the sitemap and receive client `noindex`;
  unlisted URLs are not private access control.
- The first three career entries are immediately visible. Native HTML details
  expose earlier roles without JavaScript. Printing and PDF exports include all
  roles, regardless of the disclosure state.
- Company name `Finalis`, dates and contact details are preserved from the existing
  CV. The `Finalls` spelling and additional ARS entry on mfaundez.com remain an
  editorial confirmation item, not inferred corrections here.

## Static HTML and SEO

`pnpm run build` builds the client, renders the same components with an explicit
locale through `entry-server.jsx`, hydrates them in the browser, and creates a
bilingual sitemap. No production rendering server is required.

`site.config.mjs` defines canonical paths and the shared Person ID. Metadata is
localized in the initial HTML: title, description, canonical, reciprocal hreflang,
Open Graph, large-image sharing card and structured data. The existing approved
favicon, social card and locally hosted Schibsted Grotesk font/license are reused
from mfaundez.com to keep identity consistent; the card is an identity card, not a
screenshot of this CV. Its URL contains a content hash for cache updates.

Only `dist/` is published. `dist-ssr/` and source files remain local. GitHub Pages
returns a real 404 for missing routes; a preview middleware enforces the same
status for unknown pages and assets instead of Vite's default SPA fallback.

Font Awesome and the old Inter/Poppins imports were replaced with a single
licensed variable font and small inline SVGs. Web body copy is 16px. Paper uses a separate compact two-column composition,
9.5pt Arial-compatible Sans career text, navy headings and dark orange institutions,
matching the actual older PDF. No additional print fonts are downloaded. The
approved screen CSS, content and layout remain unchanged. Review every paper
page separately; the responsive website does not represent the PDF composition.

## PDF exports

```sh
uv run python scripts/generate_pdf.py
```

The generator serves `dist/` on a temporary loopback HTTP port, preserving root
asset URLs for prerendered language pages with normal browser security. It closes
the browser and server after export. It opens every career disclosure, waits for
fonts, enables PDF tags and exports every page with page numbers. There is no
page-range cap: the previous `1-2` cap silently removed older roles.

Public filenames are preserved:

- `/mario_faundez_cv.es.pdf`
- `/mario_faundez_cv.en.pdf`
- `/mario_faundez_cv.pdf` — byte-for-byte alias of English
- `/cv/ia-aplicada/mario_faundez_cv.es.pdf`

A complete CV currently spans **two A4 pages** in each language, with all nine
roles. Both pages share 16mm margins and equal-width column axes. The first page
places education/current role on the left and profile/capabilities, the preceding
role and interests on the right. The second page continues the seven older roles
across both columns, with certifications and languages. Whole blocks are measured
at paper width to fill the first page and balance the continuation. Do not cap export pages or remove facts
to meet a count: the two-page acceptance regression means a content/layout change
needs review if pagination grows.

`src/print-layout.js` reversibly groups the existing DOM nodes for printing;
`public/print.css` loads from a static `media="print"` link. Native `beforeprint`
fires before Chromium activates print media, so the hook temporarily activates
that stylesheet for paper measurements; `afterprint` restores its print-only media.
Print events preserve exact screen DOM and disclosure state, including cancellation.
There is no duplicated CV data/template. Without JavaScript, browser printing uses
the existing complete linear fallback; loading print CSS without grouping never
hides the career. The full-profile contact link is hidden in all print flows; it
remains available on screen. The download PDFs and normal browser print use the two-column
layout. Tagged text, every source responsibility, within-career reading order and
links are checked; this does not guarantee universal ATS compatibility.

## Validation

```sh
pnpm run lint
uv run pre-commit run --all-files
# Run against an already running production preview after generating PDFs:
uv run python scripts/check_site.py --base-url http://127.0.0.1:4175
# Optional review screenshots:
uv run python scripts/check_site.py --base-url http://127.0.0.1:4175 --screenshot-dir /tmp/cv-review
# Optional exact comparison against previously approved screen PNGs:
uv run python scripts/check_site.py --base-url http://127.0.0.1:4175 --screen-baseline-dir /tmp/cv-approved
```

Acceptance checks cover full HTML with JS disabled, hydration warnings, URL-defined
languages despite saved/browser preferences, legacy parameters, query/hash links,
variant behavior, responsive layout at 320/390/768/1440px, keyboard navigation,
printing closed history, reversible DOM/disclosure restoration, exact screen pixels
before/after printing at all four widths in both languages, three consecutive native
PDF exports per locale, complete no-JS printing, metadata, schema, sitemap, genuine
404s, local identity
assets, all four PDF paths, all source summaries/responsibilities, career order across
columns, links/tags and analytics suppression.
`pypdf` is a development dependency for PDF checks; Playwright is already required
for export. Review PNG renderings of every PDF page after layout changes.

## Analytics and deployment

The existing GA property loads only on `ordenador.cl` in a non-automated browser.
Local previews, PDF generation and automated browser checks send no production
analytics. GA enhanced measurement may already track file downloads; no duplicate
custom download event was added. Email/phone contact events contain language and
method only, not the email address or phone number. Page metadata is ready before
GA initialization.

Pushing to `main` deploys automatically. A PR builds and validates without publishing.
CI runs pre-commit, static build, complete PDF generation and browser/PDF acceptance
before deploying. A separate job runs the same acceptance checks on the public
site after deployment. Check the actual site after a future authorized publication;
local success does not establish public index coverage or rankings.

Search Console canonical/index coverage, impressions, queries and GA reports remain
pending access and publication. Compare 28-day periods; do not infer an SEO lift
from a successful build. No DNS or hosting changes are required.
