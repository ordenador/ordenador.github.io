.DEFAULT_GOAL := help

.PHONY: help install start build preview clean generate-pdf deploy update-deps update-packages lint install-python-deps

# Default target - mostrar ayuda
help:
	@echo "Comandos disponibles:"
	@echo ""
	@echo "  make install              - Instalar todas las dependencias (Node + Python + Playwright)"
	@echo "  make start                - Iniciar servidor de desarrollo"
	@echo "  make build                - Generar archivos estáticos para producción"
	@echo "  make preview              - Previsualizar versión de producción"
	@echo "  make lint                 - Ejecutar linter y formateador"
	@echo "  make generate-pdf         - Generar PDF del curriculum"
	@echo "  make deploy               - Build + generar PDF (listo para GitHub Pages)"
	@echo "  make update-packages      - Actualizar todas las dependencias"
	@echo "  make update-packages-node - Actualizar solo dependencias de Node"
	@echo "  make update-packages-python - Actualizar solo dependencias de Python"
	@echo "  make clean                - Limpiar archivos generados"
	@echo ""

# Instalar todas las dependencias
install:
	npm install
	uv sync
	. .venv/bin/activate && playwright install chromium

# Actualizar todas las dependencias de Python
update-packages-python:
	uv lock --upgrade

# Actualizar package.json a las últimas versiones
update-packages-node:
	npx npm-check-updates -u
	npm install

# Actualizar dependencias
update-packages: update-packages-node update-packages-python

# Iniciar el servidor de desarrollo
start:
	npm run start

# Generar los archivos estáticos para producción
build:
	rm -rf docs
	npm run build
	uv sync
	. .venv/bin/activate && python3 scripts/generate_pdf.py

# Previsualizar la versión de producción
preview:
	npm run preview

# Ejecutar linter y formateador automáticamente
lint:
	npm run lint:fix && npm run format

# Limpiar archivos generados
clean:
	rm -rf docs
	rm -rf node_modules 
	rm -rf .venv

# Instalar dependencias de Python
install-python-deps:
	uv sync

# Generar PDF del curriculum
generate-pdf: build install-python-deps
	. .venv/bin/activate && python3 scripts/generate_pdf.py 

# Generar codigo estático en ./docs
deploy: generate-pdf