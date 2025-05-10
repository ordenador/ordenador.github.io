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

Los archivos se generarán en el directorio `docs/`.

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

Elimina los directorios `docs/` y `node_modules/`.

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

- React 19.1.0
- Vite 6.3.5
- Tailwind CSS 4.1.6
- ESLint 9.26.0
- Prettier 3.5.3
- html2pdf.js (para exportación PDF)
- Font Awesome (para iconos)

## Herramientas de Calidad de Código

El proyecto incluye configuración para mantener la calidad del código:

### ESLint

Configurado para detectar problemas en el código JavaScript/JSX:

```bash
npm run lint        # Verificar problemas
npm run lint:fix    # Corregir problemas automáticamente
```

### Prettier

Configurado para formatear el código de manera consistente:

```bash
npm run format      # Formatear código
```

La configuración de ESLint y Prettier está optimizada para trabajar en conjunto y mantener un estilo de código consistente en todo el proyecto.
