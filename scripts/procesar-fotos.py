#!/usr/bin/env python3
"""
Procesa las fotos de un vehículo y las deja listas para el sitio.

Uso:
    python3 scripts/procesar-fotos.py <slug> <carpeta-con-fotos>

Ejemplo:
    python3 scripts/procesar-fotos.py ford-lobo-lariat-2023 ~/Escritorio/fotos-lobo

Qué hace:
  1. Lee todas las imágenes de la carpeta (JPG, PNG, HEIC si Pillow lo soporta).
  2. Corrige la rotación, las convierte a WebP y genera 3 tamaños (400/800/1600 px).
  3. Las guarda en public/img/vehiculos/<slug>/
  4. Actualiza src/data/imagenes.json

Después sólo falta agregar el vehículo en src/data/vehiculos.json y correr:
    npm run build
"""
import sys, os, json, re
from PIL import Image, ImageOps

ROOT   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTDIR = os.path.join(ROOT, 'public', 'img', 'vehiculos')
MANIF  = os.path.join(ROOT, 'src', 'data', 'imagenes.json')
SIZES  = [400, 800, 1600]
EXTS   = {'.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tif', '.tiff', '.heic', '.heif'}

def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    slug = sys.argv[1].strip().lower()
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        sys.exit(f'✗ El slug "{slug}" sólo puede llevar minúsculas, números y guiones.')

    folder = os.path.expanduser(sys.argv[2])
    if not os.path.isdir(folder):
        sys.exit(f'✗ No existe la carpeta: {folder}')

    files = sorted(
        f for f in os.listdir(folder)
        if os.path.splitext(f)[1].lower() in EXTS and not f.startswith('.')
    )
    if not files:
        sys.exit(f'✗ No encontré imágenes en {folder}')

    dest = os.path.join(OUTDIR, slug)
    os.makedirs(dest, exist_ok=True)
    entries = []

    for i, name in enumerate(files):
        try:
            im = Image.open(os.path.join(folder, name))
            im = ImageOps.exif_transpose(im).convert('RGB')
        except Exception as e:
            print(f'  ⚠ Se omite {name}: {e}')
            continue
        w, h = im.size
        color = '#%02x%02x%02x' % im.resize((1, 1), Image.LANCZOS).getpixel((0, 0))
        for S in SIZES:
            tw = min(S, w)
            im.resize((tw, max(1, round(h * tw / w))), Image.LANCZOS).save(
                os.path.join(dest, f'{i}-{S}.webp'), 'WEBP', quality=82, method=5)
        entries.append({'i': i, 'w': w, 'h': h, 'c': color, 'src': name})
        print(f'  ✓ {name}  →  {i}-{{400,800,1600}}.webp')

    manifest = json.load(open(MANIF)) if os.path.exists(MANIF) else {}
    manifest[slug] = entries
    json.dump(manifest, open(MANIF, 'w'), indent=1, ensure_ascii=False)

    print(f"""
Listo: {len(entries)} fotos procesadas para "{slug}".

Siguiente paso — agrega el vehículo en src/data/vehiculos.json:

 {{
  "slug": "{slug}",
  "titulo": "Marca Modelo {'2025'}",
  "marca": "Marca",
  "modelo": "Modelo",
  "anio": 2025,
  "categoria": "Pick-up",          // Pick-up | SUV | Sedán | Deportivo
  "precio": 500000,                 // o null si es "a consultar"
  "transmision": "Automática",     // Automática | Manual
  "aire": true,
  "km": 45000,                      // o null
  "color": "Blanco",               // o null
  "combustible": "Gasolina",       // Gasolina | Diésel | Híbrido
  "piel": false,
  "importado": false,
  "notas": "",
  "imagenes": []
 }}

Y después corre:  npm run build
""")

if __name__ == '__main__':
    main()
