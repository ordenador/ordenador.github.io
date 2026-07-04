# 001 — Code Cleanup

## Problem

The repo carries dead code and duplicated sources of truth, making every change noisier than it needs to be.

## Scope

- Delete `src/index.js` (dead legacy entry; broken imports, duplicates `App.jsx`).
- Delete `original.html` (pre-React CV, superseded).
- Delete `public/mario_faundez_cv.pdf` (stale duplicate; the built PDF in `docs/` is the real one — and after spec 002, no PDF is committed at all).
- Self-host or subset Font Awesome and Inter/Poppins fonts (removes render-blocking CDNs and most of `scripts/browser.py` interception logic).
- Reduce `scripts/` complexity: with fonts local, PDF generation is "load file, wait for fonts, print" — target ≤ half the current line count.

## Non-goals

- No visual redesign. Pixel output of site and PDF must stay identical (eyeball check).
- No framework/library changes.

## Acceptance

- `pnpm run build` + `make generate-pdf` produce the same-looking site/PDF.
- `git grep index.js original.html` → no references.
- Lighthouse: no external font/CSS requests.
