# Instrucciones para el Agente Copilot

Este archivo guía al agente de IA (Copilot) para trabajar de forma segura y eficiente dentro del repositorio. Se centra en buenas prácticas de desarrollo, flujos de CI/CD y reglas específicas de la política de Copilot.

## 1. Visión General

- **Propósito**: Construir y desplegar un portfolio personal con React, Vite y Tailwind, y generar un CV en PDF con Python.
- **Entorno**: Node ≥ 20, Python ≥ 3.10, `uv` y Playwright instalados.
- **CI**: GitHub Actions ejecuta lint, build y generación de PDF en cada push a `main`.

## 2. Flujo de Construcción y Validación

| Objetivo | Comando | Precondiciones | Postcondiciones |
|----------|---------|----------------|-----------------|
| **Instalar** | `make install` | Node ≥ 20, Python ≥ 3.10, `uv` | npm packages, venv Python, Playwright browsers, `docs/` vacío |
| **Lint** | `make lint` | Dependencias instaladas | Código formateado y sin errores de lint |
| **Build** | `make build` | Lint sin errores | Sitio estático en `docs/` |
| **Generar PDF** | `make generate-pdf` | Build exitoso | `docs/mario_faundez_cv.pdf` creado |
| **Deploy** | `make deploy` | Build + PDF | `docs/` listo para GitHub Pages |
| **Actualizar dependencias** | `make update-packages` | Ninguna | Node y Python actualizados |

> **Nota**: Si un comando falla, consulte la sección *Errores Comunes* antes de buscar en el código.

## 3. Errores Comunes

- **Playwright**: Asegúrese de tener permisos de escritura en ` /.cache` y conexión a Internet.
- **Entorno Python**: El Makefile activa el venv en línea; al ejecutar manualmente, use `source .venv/bin/activate`.
- **Vite**: Ejecute `npm run lint:fix` antes de construir.

## 4. Estructura del Proyecto

```
.github/
  copilot.yml
  copilot-instructions.md
src/
  App.jsx
  index.js
  main.jsx
  components/
    ...
scripts/
  generate_pdf.py
  ...
docs/ (generado)
  index.html
  mario_faundez_cv.pdf
  assets/
    ...
package.json
requirements.txt
Makefile
README.md
```

## 5. Política de Copilot

- **Permisos**: Sugerencias permitidas en `src/` y `scripts/`.
- **Denegado**: `docs/assets/` y cualquier archivo fuera de las carpetas mencionadas.
- **Revisión**: El agente debe respetar estas reglas en todas las modificaciones.

## 6. Guía para el Agente

1. **Instalación**: Siempre ejecute `make install` antes de cualquier otro objetivo.
2. **Modificaciones**: Después de cambiar código, ejecute `make lint`.
3. **Validación**: Verifique que el sitio se construya con `make build`.
4. **PDF**: Asegúrese de que el PDF se genere con `make generate-pdf`.
5. **Errores**: Si algo falla, consulte la sección *Errores Comunes*.
6. **Pull Requests**: Mantenga cada PR enfocado en una única mejora lógica.

## 7. Buenas Prácticas de Desarrollo

### SOLID

| Principio | Aplicación en este proyecto |
|-----------|-----------------------------|
| **S** (Single Responsibility) | Cada componente React debe tener una única responsabilidad; los scripts deben hacer una sola cosa. |
| **O** (Open/Closed) | Extienda componentes con props y hooks sin modificar su código interno. |
| **L** (Liskov Substitution) | Si se crean componentes hijos, deben ser intercambiables con el padre sin romper la lógica. |
| **I** (Interface Segregation) | Exponer solo las props necesarias; evitar interfaces monolíticas. |
| **D** (Dependency Inversion) | Inyectar dependencias (por ejemplo, servicios de API) a través de contextos o hooks. |

### DRY (Don’t Repeat Yourself)

- **Componentes reutilizables**: Extraiga UI común (botones, tarjetas) a componentes independientes.
- **Hooks personalizados**: Centralice lógica de estado o efectos en hooks.
- **Constantes y tipos**: Defina valores y tipos en archivos separados (`constants.ts`, `types.ts`).

### KISS (Keep It Simple, Stupid)

- **Estructura clara**: Mantenga la jerarquía de carpetas simple (`components/`, `hooks/`, `utils/`).
- **Código legible**: Evite lógica compleja en renderizado; delegue a funciones auxiliares.
- **Configuración mínima**: Use la configuración por defecto de Vite y Tailwind siempre que sea posible.

## 8. Checklist de Entrega

- [ ] `make install` sin errores.
- [ ] `make lint` sin advertencias.
- [ ] `make build` genera `docs/` sin fallos.
- [ ] `make generate-pdf` crea el PDF.
- [ ] PR incluye descripción clara y pruebas unitarias si aplica.

---

**¡Gracias por seguir estas instrucciones!**
Con ellas, el agente Copilot podrá contribuir de manera consistente y de alta calidad al proyecto.
