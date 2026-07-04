.DEFAULT_GOAL := help

.PHONY: help install start build preview update clean

# Default target - mostrar ayuda
help:
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make install  - Instalar dependencias (Node + Python + Playwright + hook de pre-commit)"
	@echo "  make start    - Servidor de desarrollo (sin PDFs)"
	@echo "  make build    - Generar sitio + PDFs en dist/"
	@echo "  make preview  - Construir y servir el sitio final en local (con PDFs, igual a producción)"
	@echo "  make update   - Actualizar todas las dependencias"
	@echo "  make clean    - Limpiar archivos generados"
	@echo ""
	@echo "Deploy: push a main (CI construye y publica en GitHub Pages)"

install:
	pnpm install
	uv sync
	. .venv/bin/activate && playwright install chromium
	. .venv/bin/activate && pre-commit install

start:
	pnpm run start

build:
	rm -rf dist
	pnpm run build
	uv sync
	. .venv/bin/activate && python3 scripts/generate_pdf.py

preview: build
	pnpm run preview

update:
	pnpm dlx npm-check-updates -u
	pnpm install
	uv lock --upgrade
	uv sync

clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf .venv
