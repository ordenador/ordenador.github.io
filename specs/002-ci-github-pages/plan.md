# 002 — Plan

1. **Workflow** `.github/workflows/deploy.yml`:
   - Triggers: `push: [main]`, `workflow_dispatch`. PRs: run build+lint only (no deploy).
   - Job `build`: checkout → `pnpm/action-setup` (uses `packageManager` field) → `actions/setup-node` with pnpm cache → `astral-sh/setup-uv` with cache → `pnpm install` → `pre-commit run --all-files` → `pnpm run build` → `uv run playwright install chromium --with-deps` (cached) → `uv run python scripts/generate_pdf.py` → `actions/upload-pages-artifact` with the build dir.
   - Job `deploy` (needs build, main only): `actions/deploy-pages`.
2. **Build output**: point vite `outDir` to `dist/` (default) instead of `docs/`; update Makefile + `scripts/config.py` paths. `docs/` naming only existed for the Pages-from-branch mode.
3. **Repo hygiene**: `git rm -r docs/`, add `dist/`+`docs/` to `.gitignore`. Update Makefile `build`/`deploy` targets (deploy target becomes "push to main"; document in README).
4. **Pages settings**: switch repo Settings → Pages → Source to "GitHub Actions" (manual step, note in tasks). CNAME stays via `public/CNAME`.
5. **Rollout order**: ~~merge workflow first, then flip Pages source~~ — **Pages source was already switched to "GitHub Actions" (2026-07-03), so the site serves nothing until the first workflow deploy. T2/T3 are now P0.**

## Risks

- Custom domain drop during source switch → verify `public/CNAME` lands in the artifact before flipping.
- minimumReleaseAge policy can fail CI on a fresh lockfile — CI uses the committed lockfile (`--frozen-lockfile`), so only `update-packages` PRs are affected.
