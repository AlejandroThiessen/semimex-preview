import { icon } from './icons.mjs';

/* ---------- Helpers ---------- */
export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const money = (n) =>
  n == null ? 'Precio a consultar' : '$' + Number(n).toLocaleString('es-MX') + ' MXN';

export const moneyShort = (n) =>
  n == null ? null : '$' + Number(n).toLocaleString('es-MX');

export const waLink = (site, msg) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

export const NAV = [
  { href: '/',                 label: 'Inicio' },
  { href: '/vehiculos/',       label: 'Vehículos' },
  { href: '/financiamiento/',  label: 'Financiamiento' },
  { href: '/vende-tu-auto/',   label: 'Vende tu auto' },
  { href: '/nosotros/',        label: 'Nosotros' },
  { href: '/contacto/',        label: 'Contacto' },
];

/* Insignia "SM" de SemiMex, vectorizada a partir del logotipo original. */
const logoMark = `
<svg class="logo__mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
  <g transform="rotate(-5 50 50)">
    <rect x="8" y="20" width="84" height="60" rx="13" fill="#0d1117"/>
    <rect x="13" y="25" width="74" height="50" rx="9" fill="#fff"/>
    <rect x="17" y="29" width="66" height="42" rx="6" fill="#006030"/>
    <text x="50" y="59.5" text-anchor="middle" font-family="Arial Black, Arial, Helvetica, sans-serif"
          font-size="31" font-weight="900" fill="#fff" letter-spacing="-0.5">SM</text>
  </g>
</svg>`;

export const logo = (site, href = '/') => `
<a class="logo" href="${href}" aria-label="${esc(site.nombre)} — inicio">
  ${logoMark}
  <span class="logo__text">
    <span class="logo__name">${esc(site.nombre)}</span>
    <span class="logo__sub">${esc(site.tagline)}</span>
  </span>
</a>`;

/* ---------- Header ---------- */
const header = (site, current) => {
  const links = NAV.map(n =>
    `<a class="nav__link" href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');
  const mlinks = NAV.map(n =>
    `<a href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');
  const p = site.telefonos[0];

  return `
${site.preview ? `
<div class="preview-bar">
  <span class="wrap">
    <strong>Vista previa</strong> · Propuesta de rediseño para SemiMex — no es el sitio oficial.
    <a href="https://semimex.com.mx" target="_blank" rel="noopener nofollow">Ir al sitio actual</a>
  </span>
</div>` : ''}
<a class="skip" href="#main">Saltar al contenido</a>
<header class="header">
  <div class="wrap header__bar">
    ${logo(site)}
    <nav class="nav" aria-label="Principal">${links}</nav>
    <div class="header__cta">
      <a class="header__phone" href="tel:${p.tel}">${icon('phone')}<span>${esc(p.numero)}</span></a>
      <button class="theme-toggle" type="button" data-theme-toggle aria-label="Cambiar tema claro u oscuro">
        ${icon('sun', 'icon-sun')}${icon('moon', 'icon-moon')}
      </button>
      <a class="btn btn--primary btn--sm" href="/vehiculos/">Ver inventario</a>
      <button class="burger" type="button" data-menu-open aria-label="Abrir menú" aria-expanded="false">${icon('menu')}</button>
    </div>
  </div>
</header>

<div class="mobile-nav" data-mobile-nav data-open="false" aria-hidden="true">
  <div class="wrap mobile-nav__top">
    ${logo(site)}
    <button class="burger" type="button" data-menu-close aria-label="Cerrar menú">${icon('close')}</button>
  </div>
  <div class="wrap">
    <nav class="mobile-nav__links" aria-label="Menú móvil">${mlinks}</nav>
    <div class="mobile-nav__foot">
      <a class="btn btn--wa btn--block" href="${waLink(site, 'Hola, me interesa un vehículo de su inventario.')}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a>
      <a class="btn btn--ghost btn--block" href="tel:${p.tel}">${icon('phone')} ${esc(p.numero)}</a>
    </div>
  </div>
</div>`;
};

/* ---------- Footer ---------- */
const footer = (site) => {
  const d = site.direccion;
  const cats = [
    ['Pick-up', '/vehiculos/?cat=Pick-up'],
    ['SUV', '/vehiculos/?cat=SUV'],
    ['Sedán', '/vehiculos/?cat=Sed%C3%A1n'],
    ['Deportivo', '/vehiculos/?cat=Deportivo'],
  ];
  const socials = [
    site.redes.facebook && `<a href="${site.redes.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icon('facebook')}</a>`,
    `<a href="${waLink(site, 'Hola, vengo del sitio web de SemiMex.')}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}</a>`,
    site.redes.instagram && `<a href="${site.redes.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>`,
  ].filter(Boolean).join('');

  return `
<footer class="footer">
  <div class="wrap">
    <div class="footer__grid">
      <div>
        ${logo(site)}
        <p class="footer__about">${esc(site.descripcion)}</p>
        <div class="footer__socials">${socials}</div>
      </div>
      <div>
        <h3>Navegación</h3>
        <ul>${NAV.map(n => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Inventario</h3>
        <ul>${cats.map(([l, h]) => `<li><a href="${h}">${esc(l)}</a></li>`).join('')}</ul>
      </div>
      <div>
        <h3>Contacto</h3>
        <ul>
          <li><a href="https://www.google.com/maps/search/?api=1&query=${d.mapaQuery}" target="_blank" rel="noopener">${esc(d.calle)}<br>${esc(d.colonia)}<br>${esc(d.ciudad)}, ${esc(d.estado)} C.P. ${esc(d.cp)}</a></li>
          ${site.telefonos.map(t => `<li><a href="tel:${t.tel}">${esc(t.etiqueta)}: ${esc(t.numero)}</a></li>`).join('')}
          <li><a href="mailto:${site.emails[0].email}">${esc(site.emails[0].email)}</a></li>
          <li>${site.horario.map(h => `${esc(h.dias)}: ${esc(h.horas)}`).join('<br>')}</li>
        </ul>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© ${new Date().getFullYear()} ${esc(site.razonSocial)}. Todos los derechos reservados.</span>
      <nav class="footer__legal" aria-label="Legal">
        <a href="/aviso-de-privacidad/">Aviso de privacidad</a>
        <a href="/contacto/">Contacto</a>
      </nav>
    </div>
  </div>
</footer>`;
};

/* ---------- Documento ---------- */
export function page({ site, title, description, current = '', body, jsonld = [], image, canonical, bodyClass = '' }) {
  const url = site.url + (canonical || current || '/');
  const og = image ? (image.startsWith('http') ? image : site.url + image) : site.url + '/img/brand/og-default.jpg';
  const ld = jsonld.length
    ? jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n')
    : '';

  return `<!DOCTYPE html>
<html lang="es-MX">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#006030">
${site.noindex ? '<meta name="robots" content="noindex,nofollow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.nombreLargo)}">
<meta property="og:locale" content="es_MX">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/img/brand/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/img/brand/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter:wght@400;500;600;700&display=swap">
<link rel="stylesheet" href="/css/main.css">
<script>(function(){try{var t=localStorage.getItem('semimex-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
${ld}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
${header(site, current)}
<main id="main">
${body}
</main>
${footer(site)}
<a class="wa-float" href="${waLink(site, 'Hola, me interesa un vehículo de su inventario.')}" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">
  ${icon('whatsapp')}<span>WhatsApp</span>
</a>
<script src="/js/app.js" defer></script>
</body>
</html>`;
}
