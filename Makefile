.PHONY: install start build preview clean

# Instalar todas las dependencias
install:
	npm install

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