/** Verificación del sitio construido: enlaces, imágenes, metadatos y JSON-LD. */
import fs from 'node:fs';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const htmls = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) htmls.push(p);
  }
})(DIST);

const problems = [];
const exists = (rel) => {
  const clean = rel.split(/[?#]/)[0];
  const f = path.join(DIST, clean);
  if (fs.existsSync(f)) return fs.statSync(f).isFile() || fs.existsSync(path.join(f, 'index.html'));
  return fs.existsSync(path.join(DIST, clean, 'index.html'));
};

let nLinks = 0, nImgs = 0, nLd = 0;
for (const f of htmls) {
  const rel = '/' + path.relative(DIST, f).replace(/\\/g, '/');
  const html = fs.readFileSync(f, 'utf8');

  // enlaces internos
  for (const m of html.matchAll(/href="(\/[^"#]*)"/g)) {
    nLinks++;
    const href = m[1];
    if (href.startsWith('//')) continue;
    if (!exists(href)) problems.push(`${rel}: enlace roto → ${href}`);
  }
  // imágenes y assets
  for (const m of html.matchAll(/(?:src|content)="(\/[^"]+\.(?:webp|jpg|jpeg|png|svg|css|js|ico))"/g)) {
    nImgs++;
    if (!exists(m[1])) problems.push(`${rel}: asset faltante → ${m[1]}`);
  }
  // srcset
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) {
      const u = part.trim().split(/\s+/)[0];
      if (u.startsWith('/') && !exists(u)) problems.push(`${rel}: srcset faltante → ${u}`);
    }
  }
  // JSON-LD válido
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    nLd++;
    try { JSON.parse(m[1]); } catch (e) { problems.push(`${rel}: JSON-LD inválido (${e.message})`); }
  }
  // metadatos obligatorios
  for (const [re, name] of [
    [/<title>[^<]{10,}<\/title>/, 'title'],
    [/<meta name="description" content="[^"]{50,}"/, 'description'],
    [/<link rel="canonical"/, 'canonical'],
    [/<meta property="og:image"/, 'og:image'],
    [/<h1[^>]*>/, 'h1'],
    [/lang="es-MX"/, 'lang'],
  ]) if (!re.test(html)) problems.push(`${rel}: falta ${name}`);

  // un solo h1
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s > 1) problems.push(`${rel}: ${h1s} elementos h1 (debe haber 1)`);
  // imágenes sin alt
  for (const m of html.matchAll(/<img(?![^>]*\balt=)[^>]*>/g)) problems.push(`${rel}: <img> sin alt → ${m[0].slice(0, 70)}`);
}

console.log(`Páginas: ${htmls.length} · enlaces: ${nLinks} · assets: ${nImgs} · bloques JSON-LD: ${nLd}`);
if (problems.length) {
  console.log(`\n⚠ ${problems.length} problemas:\n`);
  const seen = new Map();
  for (const p of problems) {
    const k = p.replace(/^[^:]+:/, '').trim();
    seen.set(k, (seen.get(k) || 0) + 1);
  }
  [...seen.entries()].slice(0, 25).forEach(([k, n]) => console.log(`  ${n}×  ${k}`));
  process.exitCode = 1;
} else {
  console.log('\n✓ Sin problemas detectados.');
}
