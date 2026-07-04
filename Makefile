.DEFAULT_GOAL := help

.PHONY: help install start build preview clean generate-pdf deploy update-deps update-packages lint install-python-deps precommit precommit-install

# Default target - mostrar ayuda
help:
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make install              - Instalar todas las dependencias (Node + Python + Playwright)"
	@echo "  make start                - Iniciar servidor de desarrollo"
	@echo "  make build                - Generar archivos estáticos para producción"
	@echo "  make preview              - Previsualizar versión de producción"
	@echo "  make lint                 - Ejecutar linter y formateador"
	@echo "  make precommit            - Ejecutar pre-commit en todos los archivos"
	@echo "  make precommit-install    - Instalar el hook de git de pre-commit"
	@echo "  make generate-pdf         - Generar PDF del curriculum"
	@echo "  make deploy               - Build + generar PDF (listo para GitHub Pages)"
	@echo "  make update-packages      - Actualizar todas las dependencias"
	@echo "  make update-packages-node - Actualizar solo dependencias de Node"
	@echo "  make update-packages-python - Actualizar solo dependencias de Python"
	@echo "  make clean                - Limpiar archivos generados"
	@echo ""

# Instalar todas las dependencias
install:
	pnpm install
	uv sync
	. .venv/bin/activate && playwright install chromium
	. .venv/bin/activate && pre-commit install

# Actualizar todas las dependencias de Python
update-packages-python:
	uv lock --upgrade

# Actualizar package.json a las últimas versiones
update-packages-node:
	pnpm dlx npm-check-updates -u
	pnpm install

# Actualizar dependencias
update-packages: update-packages-node update-packages-python

# Iniciar el servidor de desarrollo
start:
	pnpm run start

# Generar los archivos estáticos para producción
build:
	rm -rf dist
	pnpm run build
	uv sync
	. .venv/bin/activate && python3 scripts/generate_pdf.py

# Previsualizar la versión de producción
preview:
	pnpm run preview

# Ejecutar linter y formateador automáticamente
lint:
	pnpm run lint:fix && pnpm run format

# Ejecutar pre-commit en todos los archivos
precommit: install-python-deps
	. .venv/bin/activate && pre-commit run --all-files

# Instalar el hook de git de pre-commit
precommit-install: install-python-deps
	. .venv/bin/activate && pre-commit install

# Limpiar archivos generados
clean:
	rm -rf dist
	rm -rf node_modules
	rm -rf .venv

# Instalar dependencias de Python
install-python-deps:
	uv sync

# Generar PDF del curriculum
generate-pdf: build install-python-deps
	. .venv/bin/activate && python3 scripts/generate_pdf.py

# Deploy real = push a main (CI construye y publica)
deploy: generate-pdf
