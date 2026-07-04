# 001 — Tasks

- [ ] T1: Remove `src/index.js`, `original.html`, `public/mario_faundez_cv.pdf`; fix any references (README, Makefile).
- [ ] T2: Inventory icons used (grep `fa-`) and fonts/weights used; decide inline-SVG vs subset font for icons.
- [ ] T3: Self-host fonts (`@font-face` in `main.css`), replace icons per T2, drop CDN links from `index.html`.
- [ ] T4: Simplify `scripts/` (remove interception logic, merge small modules); regenerate PDF.
- [ ] T5: Visual diff site + PDF vs current; run `make precommit`; commit.
