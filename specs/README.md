# Improvement Backlog

Analysis date: 2026-07-03. Specs only — no implementation yet.

| #   | Spec                                           | Goal                                                  | Depends on         |
| --- | ---------------------------------------------- | ----------------------------------------------------- | ------------------ |
| 001 | [code-cleanup](001-code-cleanup/spec.md)       | Remove dead code, tidy structure                      | —                  |
| 002 | [ci-github-pages](002-ci-github-pages/spec.md) | Pipeline builds HTML+PDF, stop committing `docs/`     | 001 (nice-to-have) |
| 003 | [i18n](003-i18n/spec.md)                       | ES/EN content with language switcher + per-locale PDF | 001, 002           |

## Findings from code analysis

- `src/index.js` is a dead legacy entry point: it imports named exports (`{ Header }`) that no longer exist (components use default exports) and duplicates `App.jsx`. Never referenced — real entry is `src/main.jsx`.
- `original.html` (33 KB) is the pre-React version of the CV. Unused.
- `docs/` (built site + PDF) is committed on every change → noisy diffs, merge friction, and the PDF binary bloats history. No CI exists; GitHub Pages serves the committed `docs/`.
- `public/mario_faundez_cv.pdf` is a stale copy of the PDF (build output also lands in `docs/`). Two sources of truth.
- UI strings are hardcoded English ("Experience", "Download PDF", section titles) while `index.html` declares `lang="es"` and the title is Spanish. Content lives only in English in `src/data/resume.js`.
- External render-blocking CDNs: Font Awesome 6.0.0 (2021) and Google Fonts. The PDF script (`scripts/browser.py`, 148 lines) exists largely to intercept/wait on these CDN requests; `scripts/styles.py` (189 lines) re-injects print styles by hand.
- `scripts/` PDF generation is functional but heavy: Playwright + Chromium download for a single static page.
