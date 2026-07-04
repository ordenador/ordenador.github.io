# 001 — Plan

1. **Dead files**: `git rm src/index.js original.html public/mario_faundez_cv.pdf`. Grep for references (README, scripts, vite config) and fix any.
2. **Fonts local**: download Inter + Poppins woff2 (only used weights) and the Font Awesome subset actually used (~10 icons — consider inline SVG instead of the full icon font). Place under `src/assets/`, import from `main.css` with `@font-face`. Remove CDN `<link>`s from `index.html`.
   - Lazy option evaluated first: replace Font Awesome entirely with inline SVGs (10 icons) — kills the dependency, no font files.
3. **Simplify PDF scripts**: with no external requests, `scripts/browser.py` request-interception and CDN-wait logic goes away. Keep: launch chromium → open built `index.html` → wait `networkidle` + fonts → `page.pdf()`. Fold `config.py`/`styles.py` remnants into `generate_pdf.py` if what's left is small.
4. **Verify**: build + PDF, visual compare against current output.

## Risks

- Icon rendering in PDF changes subtly → compare PDFs side by side before merging.
