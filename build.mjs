#!/usr/bin/env node
/**
 * SemiMex — generador de sitio estático (sin dependencias).
 * Uso:  node build.mjs
 * Salida: dist/
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC  = path.join(ROOT, 'src');
const PUB  = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

const read = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const site = read(path.join(SRC, 'data/sitio.json'));
// Despliegues de vista previa: distinta URL base y sin indexar en buscadores
if (process.env.SITE_URL) site.url = process.env.SITE_URL.replace(/\/$/, '');
site.noindex = process.env.NOINDEX === '1';
site.preview = process.env.PREVIEW === '1';
const cars = read(path.join(SRC, 'data/vehiculos.json'));
const imgs = read(path.join(SRC, 'data/imagenes.json'));
const lote = read(path.join(SRC, 'data/lote.json'));

const { home, catalogo, vehiculo } = await import('./src/templates/pages-main.mjs');
const { nosotros, financiamiento, venderAuto, contacto, privacidad, noEncontrado } =
  await import('./src/templates/pages-info.mjs');

/* ---------- utilidades de archivo ---------- */
let written = 0;
function write(rel, content) {
  const full = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  written++;
}
function copyDir(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

/* ---------- limpiar ---------- */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

/* ---------- páginas ---------- */
write('index.html',                      home(site, cars, imgs, lote));
write('vehiculos/index.html',            catalogo(site, cars, imgs));
write('nosotros/index.html',             nosotros(site, cars, imgs, lote));
write('financiamiento/index.html',       financiamiento(site, cars));
write('vende-tu-auto/index.html',        venderAuto(site, cars, imgs, lote));
write('contacto/index.html',             contacto(site));
write('aviso-de-privacidad/index.html',  privacidad(site));
write('404.html',                        noEncontrado(site, cars, imgs));

for (const car of cars) {
  write(`vehiculos/${car.slug}/index.html`, vehiculo(site, car, imgs, cars));
}

/* ---------- assets ---------- */
fs.mkdirSync(path.join(DIST, 'css'), { recursive: true });
fs.mkdirSync(path.join(DIST, 'js'),  { recursive: true });
fs.copyFileSync(path.join(SRC, 'styles/main.css'), path.join(DIST, 'css/main.css'));
fs.copyFileSync(path.join(SRC, 'scripts/app.js'),  path.join(DIST, 'js/app.js'));
copyDir(PUB, DIST);

/* ---------- sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ['/', '1.0', 'weekly'],
  ['/vehiculos/', '0.9', 'daily'],
  ['/financiamiento/', '0.7', 'monthly'],
  ['/vende-tu-auto/', '0.7', 'monthly'],
  ['/nosotros/', '0.6', 'monthly'],
  ['/contacto/', '0.6', 'monthly'],
  ['/aviso-de-privacidad/', '0.2', 'yearly'],
  ...cars.map(c => [`/vehiculos/${c.slug}/`, '0.8', 'weekly']),
];
write('sitemap.xml',
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p, f]) => `  <url><loc>${site.url}${u}</loc><lastmod>${today}</lastmod><changefreq>${f}</changefreq><priority>${p}</priority></url>`).join('\n')}
</urlset>`);

/* ---------- robots ---------- */
write('robots.txt', site.noindex
  ? `# Vista previa privada — no indexar
User-agent: *
Disallow: /`
  : `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml`);

/* ---------- manifest ---------- */
write('site.webmanifest', JSON.stringify({
  name: site.nombreLargo, short_name: site.nombre, description: site.descripcion,
  start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#0f2038',
  lang: 'es-MX',
  icons: [
    { src: '/img/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/img/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/img/brand/favicon.svg',  sizes: 'any',     type: 'image/svg+xml' },
  ],
}, null, 2));

/* ---------- redirecciones desde el sitio anterior (Netlify/Vercel) ---------- */
const oldSlugs = cars.map(c => `/cars/${c.slug}/  /vehiculos/${c.slug}/  301`);
write('_redirects',
`# Rutas del sitio WordPress anterior
/cars/*            /vehiculos/:splat   301
/cars_group/pick-up/*  /vehiculos/?cat=Pick-up   301
/cars_group/suv/*      /vehiculos/?cat=SUV       301
/cars_group/sedan/*    /vehiculos/?cat=Sed%C3%A1n 301
/cars_group/*      /vehiculos/         301
/services/*        /vehiculos/         301
/our-services/     /vehiculos/         301
/contacts/         /contacto/          301
/vehiculos         /vehiculos/         301
/tienda/*          /vehiculos/         301
/carrito/*         /                   301
/mi-cuenta/*       /                   301
/finalizar-compra/* /                  301
/hola-mundo/       /                   301
/home-boxed/       /                   301
${oldSlugs.join('\n')}
`);

/* ---------- reporte ---------- */
const sizeOf = (dir) => {
  let s = 0;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    s += e.isDirectory() ? sizeOf(p) : fs.statSync(p).size;
  }
  return s;
};
const mb = (b) => (b / 1024 / 1024).toFixed(1) + ' MB';
const htmlBytes = urls.reduce((a, [u]) => {
  const f = path.join(DIST, u === '/' ? 'index.html' : u.replace(/^\/|\/$/g, '') + '/index.html');
  return a + (fs.existsSync(f) ? fs.statSync(f).size : 0);
}, 0);

console.log(`
  SemiMex — build completo
  ────────────────────────────────────────
  Páginas generadas : ${written}
  Vehículos         : ${cars.length}
  Imágenes          : ${Object.values(imgs).reduce((a, v) => a + v.length, 0)}
  Peso HTML total   : ${mb(htmlBytes)}
  Peso de dist/     : ${mb(sizeOf(DIST))}
  Salida            : ${DIST}
`);
