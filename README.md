# Mario Faúndez - Portfolio & CV 🚀

Welcome to my professional portfolio and CV! Available in English and Spanish.

## Quick Links 🔗

- 🌐 [Live Portfolio](https://ordenador.cl)
- 📄 [Download CV (EN)](https://ordenador.cl/mario_faundez_cv.en.pdf) · [CV (ES)](https://ordenador.cl/mario_faundez_cv.es.pdf)

## Getting Started 🛠️

### Prerequisites

- [Node.js + pnpm](package.json)
- [Python + uv](pyproject.toml)

### Essential Commands

```bash
# Install dependencies (Node + Python + Playwright + pre-commit hook)
make install

# Start development server
make start

# Build site + PDFs into dist/
make build

# Update all dependencies
make update
```

Code quality checks run automatically on every commit (pre-commit hook, installed by `make install`) and in CI.

## Testing Locally 🧪

**Full site with PDFs (what production serves):**

```bash
make preview    # builds dist/ (site + en/es PDFs) and serves it at http://localhost:4173
```

The "Download PDF" button works in both languages here (try the EN|ES switcher or `?lang=es`).

**Development only (hot reload, no PDFs):**

```bash
make start      # vite dev server at http://localhost:3000
```

The download button 404s in dev — PDFs are generated at build time, not by the dev server. To inspect a generated PDF directly: `make build && open dist/mario_faundez_cv.es.pdf`.

## Deploy 🚢

Push to `main`. GitHub Actions builds the site, generates the PDFs, and deploys to GitHub Pages — no build artifacts are committed.
