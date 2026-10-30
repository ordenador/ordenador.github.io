# CV design and SEO — initial local validation

The single-column four-page paper proposal below is historical and was rejected
after user review. The screen frontend was approved. The revised paper contract
and current validation are in [paper-correction.md](paper-correction.md).

Date: 2026-10-30, America/Santiago. Baseline: `1e3c3687cd929eabe7e82b70c1575f05e9aa4686`.
Worktree: `/Users/mfaundez/git/github/ordenador/ordenador-cv-preview`.
Branch: `feat/cv-design-and-seo`. Publication has not been authorized or performed.

## Baseline

- Frozen pnpm installation and uv sync: PASS.
- Existing ESLint and Vite build: PASS.
- Initial HTML had no resume content; CSS 109706 bytes, JS 214328 bytes.
- Existing PDF configuration restricted output to pages 1–2; older experience
  was missing from the published PDFs (reviewer inspected the public baseline).
- Mobile experience at 390px previously began around y2306px; the proposed
  Spanish layout was measured at y588px, with no horizontal overflow.

## Implemented and checked

- Spanish `/` and English `/en/` prerendered with the same React components;
  hydrated without warnings/errors, even with unrelated query params/hash.
- Root language stays Spanish despite English browser/saved preference; English
  stays English. Native language links work without JS and retain current query
  and section after hydration. Legacy `?lang=` URLs normalize correctly.
- Valid fixed-locale `?cv=ia-aplicada` preserved; selecting another language opens
  the official CV, explicitly discarding `cv`. Unknown/inherited object-property
  slugs (`constructor`, `toString`, `__proto__`) safely use the official CV.
- Profile shortened; professional years distinguished from leadership tenure.
  Uncertain company name/chronology unchanged. English wording corrected without
  adding new achievements. mfaundez.com source and publication remain untouched.
- First three roles visible; older history usable through native details without
  JS and always included in printing, even if the disclosure is closed.
- Body copy at least 16px; no horizontal overflow at 320/390/768/1440px in ES/EN.
  Keyboard disclosure and skip-to-main work. Computed text contrast: 123 rendered
  text elements checked per language, minimum 6.93:1, no AA contrast failures.
- Canonical/hreflang/x-default, localized metadata, shared Person identity,
  social card, favicon, licensed self-hosted font, robots and bilingual sitemap.
  Actual 404 responses for unknown routes, `.html` pages and missing assets.
- Small inline SVGs and one 46864-byte variable font replace full Font Awesome
  and previous font imports. CSS now 8552 bytes; JS 216580 bytes (uncompressed).
  This records resource size, not a Lighthouse score or field Core Web Vitals.
- Local/automated navigation makes no production analytics requests. No duplicate
  custom file-download event; contact event parameters contain only locale/method.
- All four PDF filenames respond with PDF MIME. English legacy alias is byte
  identical. Both locales and the Spanish variant export four complete A4 pages,
  with nine experience entries, ending in Adessa; text extraction preserves
  career order, tags are present and contact/LinkedIn/profile links are usable.
- Removed page-range truncation. Export now serves built files on loopback HTTP
  with normal browser security; expected role count comes from rendered data.
  Browser/server cleanup verified by successful repeated runs.
- Every page of final ES and EN PDF rendered with Poppler and visually inspected:
  no clipping/overlap, readable type, stable section spacing and sans page footers.
  Current variant aliases Spanish data; its export content checks also pass.

## Commands and actual results

- `pnpm install --frozen-lockfile`: PASS after dependency cleanup.
- `uv sync --frozen`: PASS after adding pypdf as a development dependency.
- `pnpm run lint`: PASS; expanded to entry-server/config/prerender sources, no warnings.
- `uv run pre-commit run --all-files`: PASS including staged new files.
- `pnpm run build`: PASS; both languages prerendered.
- `uv run python scripts/generate_pdf.py`: PASS; three jobs plus English alias.
- `uv run python scripts/check_site.py --base-url http://127.0.0.1:4175 --screenshot-dir /tmp/ordenador-cv-implementation`: PASS all acceptance checks.
- `pdftoppm -scale-to 1400 -png` on both official PDFs: PASS; all eight final page PNGs inspected.
- `git diff --check`: PASS.

Actual executor runtime: Node 26.12.0, pnpm 11.9.0, uv 0.7.20, Python 3.13.5,
Playwright Python 1.61.0 / Chromium 149.0.7827.55, pypdf 6.21.4. CI uses Node 24;
reviewer will independently verify that target runtime before acceptance.
The PDF artifact-operation marker ran successfully exactly once before generation.

## Review assets and output hashes

Local preview: `http://127.0.0.1:4175/` and `/en/`.
Screenshots: `/tmp/ordenador-cv-implementation/{es,en}-{desktop,mobile}.png`.
Final PDF renders: `/tmp/ordenador-cv-implementation/final-{es,en}-{1..4}.png`.
Build outputs are ignored, not committed. PDF hashes include this run's timestamps;
regeneration changes PDF hashes without necessarily changing content.

| Output                           |  Bytes | SHA-256                                                            |
| -------------------------------- | -----: | ------------------------------------------------------------------ |
| `dist/assets/index-BC8ST-Vb.css` |   8552 | `1eb69ebfc6e4ad1efb390fae819ffbf6c6c3e7254f2367ac7e9e1988a342621e` |
| `dist/assets/index-CtFbY8_X.js`  | 216580 | `391e04af272d0fea08ea7f87a63531deabe73ef2493f4aaca7918514dd107790` |
| `dist/mario_faundez_cv.es.pdf`   | 244232 | `eed5dfcee9355d47a73cfc167c9988d712da002b07812b1ed119690a79888469` |
| `dist/mario_faundez_cv.en.pdf`   | 239212 | `5d74b2ba9bc78a49ee9409fffc24ccc7eb728135a61428f77b63533fbdad828a` |

## Scope adaptations and pending work

The PDF truncation fix required `scripts/config.py` in addition to the originally
listed export files. Validation adds pypdf, extends ESLint/pre-commit to `.mjs`,
and wires browser/PDF acceptance into CI before and after deployment. Identity
assets/font were reused read-only from the existing approved sibling site.

Public deployment, its CI execution, Search Console access/indexing, GA reports,
field performance and rankings remain pending. No DNS/hosting changes, pushes,
merges or public writes were performed. Tagged PDFs and text checks are not a
promise of universal ATS compatibility. The broader mfaundez.com writing review
is still a separate follow-up after this CV is accepted.
