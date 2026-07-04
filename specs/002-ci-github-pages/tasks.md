# 002 — Tasks

- [x] T1: Change vite `outDir` to `dist/`; update Makefile and `scripts/config.py`; add `dist/` + `docs/` to `.gitignore`.
- [x] T2: Write `.github/workflows/deploy.yml` (build job with pnpm/uv/Playwright caches + pre-commit gate; deploy job with `actions/deploy-pages`, main only).
- [x] T3: Push, verify green run and artifact contains `CNAME` + PDF.
- [x] T4: Repo Settings → Pages → Source = GitHub Actions (done 2026-07-03 — site down until T2/T3 ship; they are P0).
- [x] T5: `git rm -r docs/`; update README (deploy = push to main); verify site still serves.
