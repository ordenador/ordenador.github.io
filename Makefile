.PHONY: install start build preview clean generate-pdf

# Instalar todas las dependencias
install:
	npm install
	uv venv
	uv pip install -r requirements.txt
	. .venv/bin/activate && playwright install chromium

# Iniciar el servidor de desarrollo
start:
	npm run start

# Generar los archivos estáticos para producción
build:
	npm run build

# Previsualizar la versión de producción
preview:
	npm run preview

# Limpiar archivos generados
clean:
	rm -rf dist
	rm -rf node_modules 
	rm -rf .venv

# Generar PDF del curriculum
generate-pdf: build
	. .venv/bin/activate && python3 scripts/generate_pdf.py 