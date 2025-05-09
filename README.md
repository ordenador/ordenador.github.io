# Currículum Vitae - Mario Faúndez

Currículum vitae personal desarrollado con React, Vite y Tailwind CSS. Incluye funcionalidad para exportar a PDF.

## Requisitos Previos

- Node.js (v18 o superior)
- npm (incluido con Node.js)
- make (opcional, pero recomendado)

## Comandos Make Disponibles

El proyecto incluye varios comandos make para facilitar el desarrollo:

### `make install`

Instala todas las dependencias necesarias del proyecto:
```bash
make install
```

### `make start`

Inicia el servidor de desarrollo:
```bash
make start
```
El servidor se iniciará en `http://localhost:3000` (o el siguiente puerto disponible).

### `make build`

Genera los archivos estáticos para producción:
```bash
make build
```
Los archivos se generarán en el directorio `dist/`.

### `make preview`

Previsualiza la versión de producción:
```bash
make preview
```
Útil para verificar la versión de producción antes de desplegar.

### `make clean`

Limpia los archivos generados:
```bash
make clean
```
Elimina los directorios `dist/` y `node_modules/`.

## Flujo de Trabajo Típico

1. **Primera instalación**:
   ```bash
   make install
   make start
   ```

2. **Desarrollo diario**:
   ```bash
   make start
   ```

3. **Preparar para producción**:
   ```bash
   make build
   make preview  # opcional
   ```

4. **Reinstalación limpia**:
   ```bash
   make clean
   make install
   ```

## Características

- Diseño responsive
- Exportación a PDF
- Secciones organizadas para:
  - Información personal
  - Perfil profesional
  - Experiencia laboral
  - Educación
  - Habilidades técnicas
  - Idiomas
  - Certificaciones
  - Intereses
  - Redes sociales

## Tecnologías Utilizadas

- React 18
- Vite
- Tailwind CSS
- html2pdf.js (para exportación PDF)
- Font Awesome (para iconos)