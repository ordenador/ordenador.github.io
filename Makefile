.PHONY: install start build preview clean generate-pdf deploy check-code update-deps update-packages

# Instalar todas las dependencias
install:
	npm install
	uv venv
	uv pip install -r requirements.txt
	. .venv/bin/activate && playwright install chromium

# Actualizar todas las dependencias
update-deps:
	npm update
	npm audit fix --force
	npm install --force
	# Asegurar que el entorno virtual existe
	uv venv
	# Activar el entorno virtual y actualizar dependencias de Python
	. .venv/bin/activate && uv pip install --upgrade -r requirements.txt

# Actualizar package.json a las últimas versiones
update-packages:
	npx npm-check-updates -u
	npm install

# Iniciar el servidor de desarrollo
start:
	npm run start

# Verificar y formatear todo el código
check-code:
	npm run lint:fix && npm run format

# Generar los archivos estáticos para producción
build: check-code
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

# Desplegar a GitHub Pages
deploy: build
	# Asegurarse de que estamos en la rama main
	git checkout main
	# Agregar y commitear los cambios del código fuente
	git add .
	git commit -m "Update source code" || true
	git push origin main
	# Crear o actualizar la rama gh-pages
	git checkout -b gh-pages || git checkout gh-pages
	# Limpiar la rama gh-pages
	git rm -rf .
	# Copiar los archivos generados
	cp -r dist/* .
	# Agregar y commitear los archivos generados
	git add .
	git commit -m "Deploy to GitHub Pages"
	git push origin gh-pages --force
	# Volver a la rama main
	git checkout main 