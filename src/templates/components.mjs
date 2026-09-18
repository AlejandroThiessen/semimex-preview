import { icon } from './icons.mjs';
import { esc, money, waLink } from './layout.mjs';

export const imgPath = (slug, i, size) => `/img/vehiculos/${slug}/${i}-${size}.webp`;

/** srcset responsivo a partir del manifiesto de imágenes */
export function pic(slug, entry, { sizes, alt, cls = '', loading = 'lazy', fetchpriority }) {
  if (!entry) {
    return `<div class="car__ph" style="display:grid;place-items:center;width:100%;height:100%;background:var(--ink-100);color:var(--text-faint)">${icon('imageOff')}</div>`;
  }
  const { i } = entry;
  const srcset = [400, 800, 1600].map(s => `${imgPath(slug, i, s)} ${s}w`).join(', ');
  return `<img src="${imgPath(slug, i, 800)}" srcset="${srcset}" sizes="${sizes}" alt="${esc(alt)}" width="${entry.w}" height="${entry.h}" loading="${loading}"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''} decoding="async"${cls ? ` class="${cls}"` : ''} style="background:${entry.c || 'var(--ink-100)'}">`;
}

/** Ficha resumida de un vehículo (tarjeta de catálogo) */
export function carCard(car, imgs, { loading = 'lazy', priority = false } = {}) {
  const first = imgs?.[0];
  const n = imgs?.length || 0;
  const badges = [
    `<span class="badge">${esc(car.categoria)}</span>`,
    car.importado ? `<span class="badge badge--accent">Importada</span>` : '',
    car.combustible === 'Híbrido' ? `<span class="badge badge--ok">Híbrido</span>` : '',
    car.combustible === 'Diésel' ? `<span class="badge">Diésel</span>` : '',
  ].filter(Boolean).join('');

  const specs = [
    car.anio && `<span class="car__spec">${icon('calendar')}${car.anio}</span>`,
    car.km && `<span class="car__spec">${icon('gauge')}${car.km.toLocaleString('es-MX')} km</span>`,
    `<span class="car__spec">${icon('gear')}${esc(car.transmision)}</span>`,
  ].filter(Boolean).join('');

  const price = car.precio
    ? `<div class="car__price"><small>Precio</small>$${car.precio.toLocaleString('es-MX')}</div>`
    : `<div class="car__price car__price--ask"><small>Precio</small>A consultar</div>`;

  return `
<article class="car" data-car
  data-cat="${esc(car.categoria)}" data-marca="${esc(car.marca)}" data-anio="${car.anio || ''}"
  data-precio="${car.precio || ''}" data-trans="${esc(car.transmision)}" data-comb="${esc(car.combustible)}"
  data-nombre="${esc(car.titulo.toLowerCase())}">
  <div class="car__media">
    ${pic(car.slug, first, { sizes: '(max-width:600px) 100vw, (max-width:1000px) 50vw, 340px', alt: car.titulo, loading, fetchpriority: priority ? 'high' : undefined })}
    <div class="car__badges">${badges}</div>
    ${n > 1 ? `<span class="car__count">${icon('camera')}${n}</span>` : ''}
  </div>
  <div class="car__body">
    <span class="car__cat">${esc(car.marca)}</span>
    <h3 class="car__title"><a href="/vehiculos/${car.slug}/">${esc(car.titulo)}</a></h3>
    <div class="car__specs">${specs}</div>
  </div>
  <div class="car__foot">
    ${price}
    <span class="car__go">Ver ficha ${icon('arrowRight')}</span>
  </div>
</article>`;
}

/** Bloque CTA oscuro reutilizable */
export function ctaBand(site, {
  titulo = '¿No encuentras lo que buscas?',
  texto = 'Recibimos unidades cada semana y también conseguimos vehículos sobre pedido. Dinos qué necesitas y te avisamos en cuanto entre al piso.',
  msg = 'Hola, busco un vehículo en particular. ¿Me pueden ayudar?',
} = {}) {
  return `
<div class="cta-band reveal">
  <div>
    <h2 class="h2">${esc(titulo)}</h2>
    <p>${esc(texto)}</p>
  </div>
  <div class="cta-band__actions">
    <a class="btn btn--wa btn--lg" href="${waLink(site, msg)}" target="_blank" rel="noopener">${icon('whatsapp')} Escríbenos</a>
    <a class="btn btn--ghost btn--lg" href="/contacto/">Formulario de contacto</a>
  </div>
</div>`;
}

/** Encabezado de página interior */
export function pageHead({ eyebrow, titulo, texto, crumbs = [] }) {
  const bc = crumbs.length ? `
  <nav class="breadcrumb" aria-label="Ruta de navegación">
    ${crumbs.map((c, i) => (c.href
      ? `<a href="${c.href}">${esc(c.label)}</a>${i < crumbs.length - 1 ? icon('chevronRight') : ''}`
      : `<span aria-current="page">${esc(c.label)}</span>`)).join('')}
  </nav>` : '';
  return `
<section class="pagehead">
  <div class="wrap">
    ${bc}
    ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ''}
    <h1 class="h1">${esc(titulo)}</h1>
    ${texto ? `<p>${esc(texto)}</p>` : ''}
  </div>
</section>`;
}

/** Formulario de contacto (envío por mailto/Formspree según config) */
export function contactForm(site, { asunto = '', compact = false } = {}) {
  const action = site.formEndpoint || `https://formsubmit.co/${site.emails[0].email}`;
  return `
<form class="stack" method="POST" action="${esc(action)}" data-contact-form>
  <input type="hidden" name="_subject" value="Contacto web SemiMex${asunto ? ' — ' + esc(asunto) : ''}">
  <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
  <input type="hidden" name="_captcha" value="false">
  <input type="hidden" name="_template" value="table">
  <div class="grid-2">
    <div class="field">
      <label for="nombre">Nombre completo *</label>
      <input id="nombre" name="nombre" type="text" required autocomplete="name" placeholder="Tu nombre">
    </div>
    <div class="field">
      <label for="telefono">Teléfono / WhatsApp *</label>
      <input id="telefono" name="telefono" type="tel" required autocomplete="tel" placeholder="625 000 0000">
    </div>
  </div>
  <div class="grid-2">
    <div class="field">
      <label for="email">Correo electrónico</label>
      <input id="email" name="email" type="email" autocomplete="email" placeholder="tu@correo.com">
    </div>
    <div class="field">
      <label for="interes">Me interesa</label>
      <select id="interes" name="interes">
        <option>Comprar un seminuevo</option>
        <option>Vender / dar a cuenta mi auto</option>
        <option>Financiamiento</option>
        <option>Otra consulta</option>
      </select>
    </div>
  </div>
  ${asunto ? `<input type="hidden" name="vehiculo" value="${esc(asunto)}">` : ''}
  <div class="field">
    <label for="mensaje">Mensaje</label>
    <textarea id="mensaje" name="mensaje" placeholder="${asunto ? `Me interesa el ${esc(asunto)}. ` : ''}Cuéntanos qué necesitas..."></textarea>
  </div>
  <button class="btn btn--primary btn--lg" type="submit">Enviar mensaje ${icon('arrowRight')}</button>
  <p class="form-note">Al enviar aceptas nuestro <a href="/aviso-de-privacidad/" style="text-decoration:underline">aviso de privacidad</a>. Te respondemos en horario laboral, normalmente el mismo día.</p>
</form>`;
}

/** Foto del lote (src/data/lote.json) lista para usar en cualquier sección */
export function fotoLote(f, { sizes, cls = '', loading = 'lazy', variante = 'd' } = {}) {
  const v = f[variante];
  const srcset = v.anchos.map(w => `/img/lote/${f.base}-${variante}${w}.webp ${w}w`).join(', ');
  const fallback = v.anchos[Math.min(1, v.anchos.length - 1)];
  return `<img src="/img/lote/${f.base}-${variante}${fallback}.webp" srcset="${srcset}" sizes="${sizes}"
    alt="${esc(f.alt)}" width="${v.w}" height="${v.h}" loading="${loading}" decoding="async"
    style="background:${f.color}"${cls ? ` class="${cls}"` : ''}>`;
}
