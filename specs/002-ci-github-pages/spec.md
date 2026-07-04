# 002 — CI: build & deploy GitHub Pages from pipeline

## Problem

`docs/` (HTML, JS/CSS bundles, PDF binary) is committed on every content change. Diffs are noisy, the PDF bloats git history, and forgetting `make build` ships a stale site. There is no CI at all today.

## Scope

- GitHub Actions workflow: on push to `main` → install (pnpm + uv, cached) → lint → `vite build` → generate PDF → deploy with `actions/deploy-pages` (Pages source: **GitHub Actions**, not branch/docs).
- Second job (or first): run `pre-commit run --all-files` as the quality gate on PRs and main.
- Remove `docs/` from the repo; add it to `.gitignore`. Keep `public/CNAME` so the custom domain survives (vite copies it into the build).
- Cache: pnpm store, uv cache, Playwright chromium (keyed on lockfiles) — target < 2 min runs.

## Non-goals

- No preview deploys for PRs (single-owner repo; YAGNI).
- No release/versioning of the PDF.

## Acceptance

- Push to `main` with only `src/data/resume.js` changed → site + PDF live in minutes, zero build artifacts in the commit.
- Repo contains no `docs/` directory; `git log --stat` for new commits shows only source files.
- Workflow green run < 2 min warm.
