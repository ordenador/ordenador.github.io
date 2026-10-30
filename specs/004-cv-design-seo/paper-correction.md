# Paper correction after review

2026-10-30, America/Santiago. Baseline: `599580d66fb7c7356a7103ca73bb1aedbb5bce4f`.
Worktree `/Users/mfaundez/git/github/ordenador/ordenador-cv-preview`, branch
`feat/cv-design-and-seo`. The user approved the screen frontend and requested the
older paper style instead of the proposed single-column four-page export.

## Paper contract

- Two complete A4 pages in Spanish, English and the existing Spanish alias variant.
- First page: education and current role in the left column; profile, links,
  capabilities, languages and interests in the right column.
- Second page: remaining eight career entries, four in each column, followed by
  certifications. Read the left column first, then the right column.
- Navy section and role headings, readable dark orange institutions, compact
  metadata, classic Sans typography. Body is 9pt with 1.2 line-height, comparable
  to the old export's effective body size after its 0.95 scale.
- `pdffonts` showed the old public export actually embedded Liberation Sans, despite
  the old stylesheet declaring Poppins. The new paper uses an Arial/Liberation
  Sans compatible stack; no Poppins assets/dependencies or extra font downloads.
- All nine roles, all summaries/responsibilities, education, skills, certifications,
  languages and interests retained. PDF tags and links remain present. The old
  `page_ranges: 1-2` truncation was never restored.
- Main screen CSS, App/components/data, metadata, locale routing and analytics
  are unchanged. The only entry-point addition installs the print lifecycle.

## Implementation and restoration

`public/print.css` is a print-media stylesheet. `src/print-layout.js` registers
beforeprint/afterprint and print-media listeners. Existing nodes are moved into
paper columns, with temporary position markers, then restored to their exact
original position. The native details disclosure state is also restored. Repeated
preparation is idempotent; cancellation and repeated prints do not duplicate facts
or leave paper wrappers in the approved screen DOM.

The original grid is hidden only when the prepared print columns exist. Without
JavaScript, printing retains all content through the existing complete linear
fallback, even if the new print stylesheet is loaded independently.

The export waits for the print stylesheet, activates print media, waits for the
prepared layout and fonts, then exports all pages. The acceptance page-count
regression requires review if current content stops fitting two pages; it never
clips output to enforce that count.

## Validation

- Build, complete PDF generation and ESLint: PASS.
- Full browser/PDF acceptance suite: PASS, including metadata, languages, no-JS
  navigation, responsive layout, keyboard, variants, real 404s and no analytics.
- All source summaries and responsibilities normalized and found in each PDF:
  PASS. All nine role periods appear in career order across the continuation:
  PASS. Email, LinkedIn and profile links, tags and language: PASS.
- Two pages in all four download paths: PASS. English legacy alias byte-identical.
  Variant rendered to PNG; both pages pixel-identical to the official Spanish PDF.
- All four official ES/EN paper pages rendered with Poppler and visually inspected
  by executor and reviewer: approved, no clipping/overlap.
- Eight approved screen captures, at 320/390/768/1440px in ES/EN: executor comparison
  byte-identical before and after print, and byte-identical to its pre-change PNGs.
- Repeated emulated print cycles with initially open and closed history: exact
  main DOM and disclosure state restored; all nine roles present while printing.
- Three consecutive actual native PDF calls per language in a normal page:
  two pages every time, complete source content, exact DOM/screen restoration;
  subsequent React hash-link updates still work.
- No-JS printing with the print stylesheet supplied in initial HTML: all older
  experience remains visible and is present in the printed PDF.
- No new screen font requests; only the existing Schibsted font loads.

Commands:

```sh
pnpm run lint
pnpm run build
uv run python scripts/generate_pdf.py
uv run python -u scripts/check_site.py --base-url http://127.0.0.1:4175 --screen-baseline-dir /tmp/ordenador-cv-paper/approved-screen
uv run pre-commit run --all-files
git diff --check
```

Executor runtime: Node 26.12.0, pnpm 11.9.0, Python 3.13.5, Playwright 1.61.0 /
Chromium 149, pypdf 6.21.4. The reviewer separately verifies Node 24 before final
acceptance. No push, publication, DNS or hosting changes occurred.

## Harness findings retained

An initial no-JS test hung when Playwright `add_style_tag` awaited script-driven
completion in a JS-disabled page. The test now inserts the stylesheet into the
initial HTML through a routed response, preserving disabled application JS.

A mixed synthetic-media/native-PDF test produced three pages after repeated
`emulate_media('screen')` cycles. Native PDF checks now use a separate normal
context, while repeated synthetic-media DOM restoration remains tested separately.
Three consecutive actual native captures pass in each locale. The reviewer also
independently verified three actual native captures using Chromium 156. This was
a harness correction, not a change to the approved paper composition.

The reviewer's separate screen comparison found seven exact captures and only
71 tiny antialiasing differences (max channel delta 5/255) in ES390, with identical
layout and content. Executor captures were exact in all eight cases. No approved
baseline, threshold or screen styles were modified to conceal that variation.

## Review files and hashes

Preview remains `http://127.0.0.1:4175/` and `/en/`.
Approved-screen baseline: `/tmp/ordenador-cv-paper/approved-screen/`.
Paper PNGs: `/tmp/ordenador-cv-paper/compact-{es,en}-{1,2}.png`.
Variant PNGs: `/tmp/ordenador-cv-paper/variant-es-{1,2}.png`.

| Output                                      |  Bytes | SHA-256                                                            |
| ------------------------------------------- | -----: | ------------------------------------------------------------------ |
| Screen CSS `index-BC8ST-Vb.css` (unchanged) |   8552 | `1eb69ebfc6e4ad1efb390fae819ffbf6c6c3e7254f2367ac7e9e1988a342621e` |
| Spanish PDF                                 | 247863 | `232a13e6e4018280e3565502d9def9d40c8dfaae6480834644e571198df76051` |
| English PDF and legacy alias                | 245831 | `6d8142615de87ab3e41fadc82a98c322d04862add3f4be59b6415355d75b9f48` |
| Spanish variant PDF                         | 247863 | `2724dafd84b5c27e58fe64fb9de175558a0f8ce1a09c856f924b26fd0559ab32` |

PDF hashes include generation timestamps and will change on regeneration.
