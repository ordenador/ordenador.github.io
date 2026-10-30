# 003 — i18n (ES/EN)

## Current contract (updated 2026-10-30)

Spanish is served at `/`; English at `/en/`. Each URL returns complete localized
static HTML, metadata and matching PDF links before JavaScript runs. Browser
preferences and localStorage never change a URL's language.

The header uses native ES/EN links with an accessible current-language indication.
Hydration adds preservation of unrelated query parameters and section anchors.
Legacy `?lang=es`/`?lang=en` URLs normalize in the client to canonical paths.

This intentionally supersedes the initial design, which selected locale from
query/localStorage/navigator and excluded language paths. Stable shareable URLs
and static SEO now take priority over that old default-selection behavior.

## Content and PDFs

- Locale data remain in `src/data/resume.en.js` and `resume.es.js`; shared labels
  live in `src/i18n/labels.js`. No i18n library is needed.
- Preserve language PDF filenames and the English legacy alias.
- Personalized `?cv=` variants keep their fixed locale. Language links open the
  official CV in the chosen locale, deliberately removing `cv` and preserving
  unrelated parameters/hash. Existing variant exports remain available.
- PDF generation, hydration, metadata, no-JS navigation and legacy links must pass
  `uv run python scripts/check_site.py --base-url <preview-or-deployment>`.
