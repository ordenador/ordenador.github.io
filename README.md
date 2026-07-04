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

# Run pre-commit on all files
make precommit
```

## Deploy 🚢

Push to `main`. GitHub Actions builds the site, generates the PDFs, and deploys to GitHub Pages — no build artifacts are committed.
