#!/usr/bin/env node
/**
 * Reescribe las rutas absolutas de dist/ para servir el sitio desde un subdirectorio
 * (GitHub Pages publica en /usuario.github.io/<repo>/).
 *
 *   node scripts/basepath.mjs /semimex-preview
 *
 * Es idempotente: si la ruta ya lleva el prefijo, no la vuelve a tocar.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || '').replace(/\/$/, '');
if (!BASE || !BASE.startsWith('/')) {
  console.error('Uso: node scripts/basepath.mjs /mi-repo');
  process.exit(1);
}
const DIST = path.join(process.cwd(), 'dist');

// Una ruta se reescribe sólo si es absoluta del sitio y aún no tiene el prefijo
const needs = (u) => u.startsWith('/') && !u.startsWith('//') && !u.startsWith(BASE + '/') && u !== BASE;
const pre = (u) => (needs(u) ? BASE + u : u);

const fixSrcset = (v) =>
  v.split(',').map(part => {
    const t = part.trim();
    if (!t) return t;
    const [url, ...rest] = t.split(/\s+/);
    return [pre(url), ...rest].join(' ');
  }).join(', ');

let files = 0, edits = 0;
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); continue; }
    const ext = path.extname(e.name);
    if (!['.html', '.webmanifest', '.xml', '.js', '.css'].includes(ext)) continue;

    const before = fs.readFileSync(p, 'utf8');
    let out = before;

    if (ext === '.html') {
      // atributos de una sola URL
      out = out.replace(/\b(href|src|action|data-src)="([^"]*)"/g,
        (m, attr, url) => `${attr}="${pre(url)}"`);
      // srcset (varias URLs)
      out = out.replace(/\bsrcset="([^"]*)"/g, (m, v) => `srcset="${fixSrcset(v)}"`);
      // rutas dentro de los bloques JSON de la galería
      out = out.replace(/"(\/(?:img|css|js)\/[^"]*)"/g, (m, u) => `"${pre(u)}"`);
    } else if (ext === '.webmanifest') {
      const j = JSON.parse(out);
      if (j.start_url) j.start_url = pre(j.start_url);
      if (Array.isArray(j.icons)) j.icons.forEach(i => { i.src = pre(i.src); });
      out = JSON.stringify(j, null, 2);
    } else if (ext === '.css') {
      out = out.replace(/url\((['"]?)(\/[^)'"]+)\1\)/g, (m, q, u) => `url(${q}${pre(u)}${q})`);
    } else if (ext === '.js') {
      out = out.replace(/(['"])(\/(?:img|css|js)\/[^'"]*)\1/g, (m, q, u) => `${q}${pre(u)}${q}`);
    }

    if (out !== before) { fs.writeFileSync(p, out); edits++; }
    files++;
  }
}
walk(DIST);
console.log(`Prefijo "${BASE}" aplicado · ${edits}/${files} archivos modificados`);
