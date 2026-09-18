# SemiMex — Rebuild del sitio web

**Estado:** ✅ Sitio completo y funcionando · 2026-09-17
**Sitio original:** https://semimex.com.mx/ (WordPress + tema "Cars4Rent" de renta de autos)

## Por qué se rehizo
El sitio actual usa una plantilla de **renta** de autos en inglés. Quedó texto de
relleno del tema ("Gas & insurance included", "Any Locations Rent", "Car rental
companies operate by purchasing or leasing a number of fleet vehicles…"), el catálogo
no tenía filtros, no había fichas técnicas, ni CTA de WhatsApp, ni SEO.

## Stack
Generador estático propio en Node, **sin dependencias de npm**.
`src/data/*.json` → `build.mjs` → `dist/` (HTML/CSS/JS plano).

## Checklist

### Fase 1 — Datos ✅
- [x] Crawl completo (61 vehículos, sitemap, páginas)
- [x] Parser HTML → JSON estructurado
- [x] Datos de contacto (ANCA + directorios) — *pendiente confirmar con cliente*
- [x] Catálogo normalizado → `src/data/vehiculos.json`
- [x] 508 imágenes descargadas → WebP en 3 tamaños

### Fase 2 — Build ✅
- [x] `build.mjs`
- [x] Sistema de diseño (`main.css`, 570 líneas) con verde de marca #006030
- [x] Layout: header, nav móvil, footer, WhatsApp flotante, tema claro/oscuro
- [x] `app.js`: filtros, galería + lightbox, calculadora, menú

### Fase 3 — Páginas ✅
- [x] `/` Inicio · `/vehiculos/` Catálogo · 61 fichas
- [x] `/nosotros/` · `/financiamiento/` · `/vende-tu-auto/`
- [x] `/contacto/` · `/aviso-de-privacidad/` · `404.html`

### Fase 4 — Pulido ✅
- [x] SEO: meta, OG, JSON-LD, sitemap.xml, robots.txt, `_redirects` 301
- [x] Marca: insignia SM vectorizada, favicon, iconos, imagen OG
- [x] QA visual: escritorio, móvil 390px, tema oscuro
- [x] Validador (`scripts/check.mjs`): 0 problemas
- [x] Herramienta para agregar fotos (`scripts/procesar-fotos.py`)
- [x] README.md + PENDIENTES.md

## Siguiente paso
Ver **`PENDIENTES.md`** — lo que hace falta del cliente para publicar.

## Cómo retomar
```bash
npm run dev      # construye y sirve en http://localhost:4321
npm run check    # valida enlaces, imágenes, metadatos y JSON-LD
```
