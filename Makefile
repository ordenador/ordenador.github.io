.PHONY: install start build preview clean generate-pdf deploy update-deps update-packages lint install-python-deps

# Instalar todas las dependencias
install:
	npm install
	uv venv
	uv pip install -r requirements.txt
	. .venv/bin/activate && playwright install chromium

# Actualizar todas las dependencias de Python
update-packages-python:
	# Asegurar que el entorno virtual existe
	uv venv
	# Activar el entorno virtual y actualizar dependencias de Python
	. .venv/bin/activate && uv pip install --upgrade pip
	. .venv/bin/activate && uv pip install --upgrade -r requirements.txt
	. .venv/bin/activate && uv pip freeze > requirements.txt

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
	npm run build

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
	uv venv
	. .venv/bin/activate && uv pip install -r requirements.txt

# Generar PDF del curriculum
generate-pdf: build install-python-deps
	. .venv/bin/activate && python3 scripts/generate_pdf.py 

# Generar codigo estático en ./docs
deploy: generate-pdf