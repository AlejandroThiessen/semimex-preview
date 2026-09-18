# SemiMex — Sitio web

Sitio nuevo para **SemiMex (Comercializadora de Seminuevos Mexicanos S.A. de C.V.)**,
lote de autos y camionetas seminuevas en Cuauhtémoc, Chihuahua.

Reemplaza al sitio anterior de WordPress, que usaba una plantilla de **renta** de autos
en inglés y conservaba su texto de relleno ("Gas & insurance included", "Any Locations
Rent", un párrafo sobre cómo operan las flotillas de renta), sin filtros de inventario,
sin fichas técnicas, sin botones de WhatsApp y sin SEO.

---

## Qué incluye

| | |
|---|---|
| **Páginas** | 69 (inicio, catálogo, 61 fichas de vehículo, financiamiento, vende tu auto, nosotros, contacto, aviso de privacidad, 404) |
| **Vehículos** | 61, migrados del sitio anterior |
| **Fotos** | 508 de vehículos + 3 del establecimiento, en WebP con varios tamaños |
| **Stack** | Node + HTML/CSS/JS plano. **Cero dependencias de npm** |
| **Salida** | `dist/` — estático puro, se sube a cualquier hosting |

### Funcionalidad
- Catálogo con filtros en vivo (texto, tipo, marca, año, precio, transmisión, combustible) y orden
- Los filtros se reflejan en la URL → `/vehiculos/?cat=SUV&marca=Ford` se puede compartir
- Galería por vehículo con miniaturas, lightbox, teclado y deslizamiento en móvil
- Simulador de mensualidad (amortización real) en cada ficha y en Financiamiento
- WhatsApp con mensaje prellenado por unidad
- Tema claro / oscuro con preferencia guardada
- SEO: metadatos, Open Graph, JSON-LD (`AutoDealer`, `Car`, `FAQPage`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`
- Redirecciones 301 desde todas las rutas del WordPress anterior (`_redirects`)
- Accesibilidad: saltar al contenido, foco visible, `alt` en todas las imágenes, un solo `<h1>` por página

---

## Comandos

```bash
npm run build     # genera dist/
npm run dev       # genera y sirve en http://localhost:4321
npm run check     # valida enlaces, imágenes, metadatos y JSON-LD
```

No hay `npm install`: el proyecto no usa paquetes externos.
Requiere **Node 18+**. El procesamiento de fotos usa **Python 3 + Pillow**.

---

## Estructura

```
src/data/vehiculos.json     ← el inventario (aquí se edita todo)
src/data/sitio.json         ← teléfonos, dirección, horario, textos, FAQ
src/data/imagenes.json      ← generado por el script de fotos, no editar a mano
src/data/lote.json          ← fotos del establecimiento (hero y secciones)
src/fotos/                  ← originales de las fotos del lote
src/templates/              ← plantillas (layout, componentes, páginas)
src/styles/main.css         ← sistema de diseño completo
src/scripts/app.js          ← filtros, galería, calculadora
public/img/vehiculos/       ← fotos ya optimizadas
build.mjs                   ← generador
dist/                       ← salida lista para publicar
```

---

## Cómo agregar un vehículo

**1. Procesa las fotos**

```bash
python3 scripts/procesar-fotos.py ford-lobo-lariat-2023 ~/Escritorio/fotos-lobo
```

El primer dato es el *slug* (la dirección de la ficha: minúsculas, números y guiones).
El segundo es la carpeta con las fotos. **La primera foto en orden alfabético es la
portada**, así que conviene nombrarlas `01.jpg`, `02.jpg`, etc.

**2. Agrega el vehículo** a `src/data/vehiculos.json` (el script imprime la plantilla ya
lista para copiar):

```json
{
  "slug": "ford-lobo-lariat-2023",
  "titulo": "Ford Lobo Lariat 4X4 2023",
  "marca": "Ford",
  "modelo": "Lobo Lariat 4X4",
  "anio": 2023,
  "categoria": "Pick-up",
  "precio": 950000,
  "transmision": "Automática",
  "aire": true,
  "km": 38000,
  "color": "Blanco",
  "combustible": "Gasolina",
  "piel": true,
  "importado": false,
  "notas": "Un solo dueño. Servicios de agencia.",
  "imagenes": []
}
```

**3. Reconstruye**

```bash
npm run build
```

### Valores permitidos
| Campo | Valores |
|---|---|
| `categoria` | `Pick-up`, `SUV`, `Sedán`, `Deportivo` |
| `transmision` | `Automática`, `Manual` |
| `combustible` | `Gasolina`, `Diésel`, `Híbrido` |
| `precio` | número sin comas, o `null` para "a consultar" |
| `km`, `color` | valor, o `null` si no se conoce |

### Para quitar un vehículo vendido
Bórralo de `src/data/vehiculos.json` y corre `npm run build`.
Las fotos pueden quedarse; no estorban.

---

## Cómo cambiar datos del negocio

Todo está en **`src/data/sitio.json`**: teléfonos, WhatsApp, correos, dirección,
horario, redes sociales, los seis bloques de "por qué SemiMex", los pasos del
proceso y las preguntas frecuentes. Edita y reconstruye.

---

## Publicar

`dist/` es estático. Cualquiera de estas opciones funciona:

- **Netlify / Cloudflare Pages / Vercel** — arrastra `dist/`, o conecta el repositorio
  con comando de build `npm run build` y carpeta `dist`. El archivo `_redirects` ya
  trae las redirecciones del sitio anterior y lo leen Netlify y Cloudflare.
- **Hosting tradicional (cPanel/FTP)** — sube el contenido de `dist/` a `public_html`.
  En ese caso las redirecciones hay que pasarlas a `.htaccess` (ver `_redirects`).

---

## Sobre los datos migrados

El inventario se extrajo del sitio anterior. Al hacerlo se corrigieron errores que
venían de ahí:

- Erratas en nombres: *Delani* → **Denali**, *Big Ben* → **Big Bend**, *CRV* → **CR-V**, *TFSA* → **TFSI**
- Carrocerías mal clasificadas: la *Ford Lobo Platinum 4X4 2019* estaba como SUV (es pick-up)
  y la *Jaguar F-Pace* como pick-up (es SUV)
- Precios con formato roto: `$1,895,000.000`
- Descripciones partidas a la mitad por las comas de los números
  (`PRECIO: $795` / `000.00 KILOMETRAJE: 92` / `291.`)

Los precios que se conservaron son los del campo de precio del sitio anterior, que era
el que se mostraba en las tarjetas del catálogo.


---

## Las fotos del establecimiento

Viven en `src/fotos/` y se procesan a `public/img/lote/` con recortes distintos
para escritorio (4:3) y móvil (16:10) — *art direction* real, no el mismo archivo
reescalado.

Se configuran en **`src/data/lote.json`**:

| Campo | Para qué |
|---|---|
| `hero` | `true` = entra al carrusel del hero |
| `posD` | `object-position` en escritorio (el hero recorta casi a cuadrado) |
| `posM` | `object-position` en móvil |
| `alt` | texto alternativo |

Si cambias o agregas fotos del lote, corre el bloque de generación otra vez o
ajusta `posD` hasta que el letrero quede bien encuadrado. El hero hace un fundido
lento entre las fotos marcadas con `hero: true`, se detiene cuando no está a la
vista y respeta `prefers-reduced-motion`.

**Ver `PENDIENTES.md`** para la lista de cosas que hay que confirmar o completar.
