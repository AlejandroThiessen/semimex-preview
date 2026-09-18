# Pendientes — lo que hace falta para publicar

Marcado por prioridad. Los puntos de **Bloqueantes** hay que resolverlos antes de
poner el sitio en línea; el resto se puede ir completando después.

---

## 🔴 Bloqueantes

### 1. Confirmar los datos de contacto
El sitio anterior sólo mostraba **un** teléfono (625 586 3339). Lo demás lo saqué del
directorio de la **ANCA** y de directorios de negocios, no de ellos directamente.
**Todo esto hay que confirmarlo con el cliente:**

| Dato | Lo que puse | Fuente |
|---|---|---|
| Tel. oficina | 625 586 3339 | su sitio web |
| Tel. ventas | 625 589 4554 | aparecía en las descripciones de los autos |
| Tel. ventas 2 | 625 118 3117 | directorio ANCA |
| **WhatsApp** | **625 589 4554** | **supuesto mío — hay que confirmarlo** |
| Correos | info@ / armando@ / jaime@semimex.com.mx | directorio ANCA |
| Dirección | Carr. Estatal Cuauhtémoc–Álvaro Obregón Km 12.5 #1240, Col. Campo Número 20, C.P. 31607 | directorio ANCA |

⚠️ **Dos direcciones distintas en línea.** La ANCA dice *Col. Campo Número 20, C.P. 31607*;
otro directorio dice *Fraccionamiento del Kilómetro Once, C.P. 31500*. Usé la de la ANCA.
Hay que preguntar cuál es la correcta.

⚠️ **El horario me lo inventé** (L–V 9:00–18:00, Sáb 9:00–14:00, Dom cerrado).
Es lo habitual en un lote, pero hay que confirmarlo o corregirlo.

→ Todo se edita en **`src/data/sitio.json`**.

### 2. Conectar el formulario de contacto
Los tres formularios (contacto, vende tu auto, ficha de vehículo) apuntan hoy a
**FormSubmit**, que necesita que el dueño del correo confirme la primera vez.
Opciones:

- **FormSubmit** (gratis) — enviar un formulario de prueba y confirmar desde `info@semimex.com.mx`.
- **Netlify Forms** (gratis hasta 100/mes) — si se publica en Netlify, basta agregar `netlify` al `<form>`.
- **Formspree** — plan gratuito de 50 envíos/mes.

Cuando lo decidan, agrego `"formEndpoint": "…"` en `src/data/sitio.json`.
**Sin esto, los formularios no entregan nada.**

### 3. Dónde se publica

> **Nota:** la vista previa en GitHub Pages **no aplica las redirecciones** del
> archivo `_redirects` (GitHub Pages no las soporta). Eso sólo importa para el
> sitio definitivo: si se publica en Netlify o Cloudflare Pages funcionan solas;
> si se queda en hosting tradicional hay que pasarlas a `.htaccess`.
Necesito saber:
- ¿Se queda en el hosting actual o se mueve a Netlify / Cloudflare Pages / Vercel?
- ¿Quién tiene el acceso al dominio `semimex.com.mx` (DNS)?
- Si se queda en hosting tradicional, hay que convertir `_redirects` a `.htaccess`
  (lo hago cuando me digan).

---

## 🟠 Importantes (afectan ventas o credibilidad)

### 4. Falta el kilometraje de casi todo el inventario
**Sólo 4 de 61 unidades traen kilometraje**, porque el sitio anterior no lo capturaba
salvo en unas pocas descripciones. Para un lote de seminuevos es de lo primero que
pregunta el cliente.

→ Si me pasan una lista (slug o nombre → km), la cargo toda de una vez.
Lo mismo aplica a **color** (sólo 4 unidades lo traen).

### 5. Confirmar qué unidades siguen disponibles
Migré las **61** que estaban publicadas. Es muy probable que varias ya se hayan vendido.
→ Necesito la lista de cuáles quitar.

### 6. Dos unidades sin precio
- **Ford Bronco Big Bend Sport 2024**
- **Range Rover Sport Supercharged 2017**

En el sitio anterior el campo de precio venía vacío. Ahora salen como
"Precio a consultar", que funciona, pero si tienen precio conviene ponerlo.

### 7. Una unidad se quedó sin fotos
**Chevrolet Silverado 4X4 2020** — sus fotos dan error 404 en el servidor actual
(también están rotas en el sitio viejo). Su ficha muestra un mensaje de
"Fotografías en preparación".
→ Hace falta volver a subirlas:
`python3 scripts/procesar-fotos.py chevrolet-silverado-4x4-2020 <carpeta>`

### 8. Revisar precios contra la realidad
Algunos precios del sitio anterior se contradecían entre la tarjeta y la descripción
(ej. la *Ford Lobo King Ranch 2017* decía `$745,000` en la tarjeta y `$795,000` en el
texto). Me quedé con el de la tarjeta, que era el que se mostraba en el catálogo.
→ Vale la pena una pasada rápida a la lista completa.

### 9. Tasa del simulador de financiamiento
El simulador usa **16% anual** como estimación y lo dice claramente en la nota legal.
→ Si su tasa habitual es otra, se cambia en `src/scripts/app.js` (constante `TASA`).

---

## 🟡 Deseables

### 10. Logotipo en alta resolución
El logo original que encontré es un PNG de **300×167 px**, muy chico. Redibujé la
insignia "SM" en SVG (vectorial, nítida a cualquier tamaño) respetando el diseño y el
verde de marca **#006030**.
→ Si tienen el archivo original (AI, EPS, SVG o PDF), lo sustituyo por el suyo exacto.

### 11. Más fotos del lote y del equipo
✅ *Resuelto en parte:* ya tenemos tres fotos profesionales del establecimiento
(`src/fotos/lote-1..3.png`). Se usan así:

| Foto | Dónde | Por qué |
|---|---|---|
| `lote-1` (Mustang + letrero completo) | Hero, diapositiva 1 · imagen para redes | La más completa y balanceada |
| `lote-3` (F-150 Platinum de cerca) | Hero, diapositiva 2 · *Nosotros* | La más premium, letrero completo |
| `lote-2` (fila de pick-ups, ángulo bajo) | *Tomamos tu auto a cuenta* · *Vende tu auto* | El letrero viene cortado desde el original, así que no funciona en el hero, pero en un marco 4:3 se ve muy bien |

Faltaría: **fotos del equipo de ventas** y alguna del interior de la oficina, para
la sección *Nosotros*. Es lo que más ayuda a generar confianza.

### 12. Redes sociales
Sólo encontré **Facebook** (`facebook.com/semimex12`). Si tienen Instagram o TikTok,
los agrego en `src/data/sitio.json` → `redes`.

### 13. Ubicación exacta en el mapa
El mapa embebido usa una búsqueda por dirección. Queda mejor con las coordenadas
reales o el enlace de su ficha de **Google Business Profile**.
→ Si me pasan el enlace corto de Google Maps, lo ajusto.

### 14. Analítica
No instalé nada (ni Google Analytics ni píxeles) para no meter rastreo sin permiso.
→ Si quieren GA4 o el píxel de Meta, díganme el ID y lo agrego junto con el aviso
de cookies correspondiente.

### 15. Revisión legal del aviso de privacidad
Redacté uno completo conforme a la **LFPDPPP** con datos reales de la empresa.
→ Conviene que lo lea el cliente (o su contador/abogado) antes de publicar.

### 16. Textos de "Nosotros"
Escribí la sección con lo que se puede deducir de su operación (socios ANCA,
enfoque en pick-ups, revisión de unidades). **No sé el año de fundación ni su
historia real.**
→ Con dos o tres datos verdaderos queda mucho mejor.

---

## Correcciones que ya apliqué a los datos migrados

Para que quede constancia de qué se cambió respecto al sitio anterior:

- **Erratas de nombre:** Delani → **Denali**, Big Ben → **Big Bend**, CRV → **CR-V**,
  TFSA → **TFSI**, Xdrive → **xDrive**, RAV 4 → **RAV4**, F-pace → **F-Pace**
- **Carrocerías mal clasificadas:** *Ford Lobo Platinum 4X4 2019* estaba como SUV
  (es pick-up); *Jaguar F-Pace* estaba como pick-up (es SUV)
- **Precios con formato roto:** `$1,895,000.000` → `$1,895,000`
- **Descripciones partidas por las comas:** `PRECIO: $795` / `000.00 KILOMETRAJE: 92` / `291.`
- **Categorías nuevas:** se separó *Deportivo* (Camaro SS, Subaru WRX) de *Sedán*
- **Se eliminó todo el texto de relleno en inglés** de la plantilla de renta de autos
  ("Gas & insurance included", "Any Locations Rent", "Cleaning Included",
  "This Summer, Go Beyond", y el párrafo sobre cómo operan las flotillas de renta)
