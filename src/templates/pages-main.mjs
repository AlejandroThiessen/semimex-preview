import { icon } from './icons.mjs';
import { esc, money, waLink, page } from './layout.mjs';
import { carCard, ctaBand, pageHead, pic, contactForm, imgPath, fotoLote } from './components.mjs';

/* ============================ INICIO ============================ */
export function home(site, cars, imgs, lote = []) {
  const destacados = cars.filter(c => c.precio).slice(0, 6);

  const nCat = (c) => cars.filter(x => x.categoria === c).length;
  const cats = [
    { n: 'Pick-up',   q: 'Pick-up',   d: 'Trocas de trabajo y doble cabina' },
    { n: 'SUV',       q: 'SUV',       d: 'Familiares y de lujo' },
    { n: 'Sedán',     q: 'Sedán',     d: 'Rendidores y cómodos' },
    { n: 'Deportivo', q: 'Deportivo', d: 'Unidades de colección' },
  ].filter(c => nCat(c.n) > 0).map(c => {
    const ej = cars.find(x => x.categoria === c.n && imgs[x.slug]?.length);
    const im = ej && imgs[ej.slug]?.[0];
    return `
    <a class="cat" href="/vehiculos/?cat=${encodeURIComponent(c.q)}">
      ${im ? `<img src="${imgPath(ej.slug, im.i, 800)}" alt="" loading="lazy" decoding="async" width="${im.w}" height="${im.h}">` : ''}
      <span class="cat__name">${esc(c.n)}</span>
      <span class="cat__n">${nCat(c.n)} ${nCat(c.n) === 1 ? 'unidad disponible' : 'unidades disponibles'}</span>
    </a>`;
  }).join('');


  const marcas = [...new Set(cars.map(c => c.marca))].sort();
  const marcasN = marcas.length;
  const anios = cars.map(c => c.anio).filter(Boolean);
  const anioMin = Math.min(...anios), anioMax = Math.max(...anios);
  const minP = Math.min(...cars.filter(c => c.precio).map(c => c.precio));

  // Diapositivas del hero: <picture> con dirección de arte (móvil 16:10 / escritorio 4:3)
  const heroFotos = lote.filter(f => f.hero);
  const slides = heroFotos.map((f, i) => {
    const srcD = f.d.anchos.map(w => `/img/lote/${f.base}-d${w}.webp ${w}w`).join(', ');
    const srcM = f.m.anchos.map(w => `/img/lote/${f.base}-m${w}.webp ${w}w`).join(', ');
    return `
      <picture class="hero__slide"${i === 0 ? ' data-active="true"' : ''} data-slide="${i}">
        <source media="(min-width:900px)" srcset="${srcD}" sizes="52vw">
        <source srcset="${srcM}" sizes="100vw">
        <img src="/img/lote/${f.base}-m720.webp" alt="${esc(f.alt)}"
             width="${f.m.w}" height="${f.m.h}"
             loading="eager" fetchpriority="${i === 0 ? 'high' : 'low'}"
             decoding="async" style="background:${f.color};object-position:${f.posD}">
      </picture>`;
  }).join('');

  const dots = heroFotos.length > 1 ? `
    <div class="hero__dots" role="tablist" aria-label="Fotos del lote">
      ${heroFotos.map((f, i) => `<button class="hero__dot" type="button" role="tab" data-dot="${i}"
        aria-selected="${i === 0}" aria-label="Foto ${i + 1} de ${heroFotos.length}"></button>`).join('')}
    </div>` : '';

  const body = `
<section class="hero">
  <div class="hero__panel">
    <div class="hero__content">
      <span class="eyebrow">Cuauhtémoc, Chihuahua</span>
      <h1 class="h1">Seminuevos revisados,<br>precio directo de lote</h1>
      <p class="hero__lead">
        Camionetas, pick-ups y autos seleccionados uno por uno.
        Financiamiento bancario y tomamos tu unidad a cuenta.
      </p>
      <div class="hero__actions">
        <a class="btn btn--primary btn--lg" href="/vehiculos/">Ver ${cars.length} unidades ${icon('arrowRight')}</a>
        <a class="btn btn--wa btn--lg" href="${waLink(site, 'Hola, me interesa un vehículo de su inventario.')}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a>
      </div>
      <div class="hero__stats">
        <div class="hero__stat"><b>${cars.length}</b><span>Unidades en piso</span></div>
        <div class="hero__stat"><b>${marcasN}</b><span>Marcas</span></div>
        <div class="hero__stat hero__stat--opt"><b>${anioMin}–${anioMax}</b><span>Años modelo</span></div>
        <div class="hero__stat"><b>$${(minP / 1000).toFixed(0)}k</b><span>Desde</span></div>
      </div>
    </div>
  </div>
  <div class="hero__media" data-hero-media>
    ${slides}
    ${dots}
  </div>
</section>

<!-- Buscador rápido -->
<div class="wrap quickfind">
  <form class="quickfind__card" action="/vehiculos/" method="get">
    <div class="field">
      <label for="qf-cat">Tipo de vehículo</label>
      <select id="qf-cat" name="cat"><option value="">Todos</option>
        ${[...new Set(cars.map(c => c.categoria))].sort().map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="qf-marca">Marca</label>
      <select id="qf-marca" name="marca"><option value="">Todas</option>
        ${marcas.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="qf-max">Presupuesto máximo</label>
      <select id="qf-max" name="max"><option value="">Sin límite</option>
        ${[200000, 300000, 450000, 600000, 800000, 1000000, 1500000].map(v => `<option value="${v}">Hasta $${v.toLocaleString('es-MX')}</option>`).join('')}
      </select>
    </div>
    <div class="field">
      <label for="qf-anio">Año desde</label>
      <select id="qf-anio" name="anio"><option value="">Cualquiera</option>
        ${[2024, 2022, 2020, 2018, 2015].map(v => `<option value="${v}">${v} o más nuevo</option>`).join('')}
      </select>
    </div>
    <button class="btn btn--dark" type="submit">${icon('search')} Buscar</button>
  </form>
</div>

<!-- Categorías -->
<section class="section">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Inventario</span>
      <h2 class="h2">Encuentra por tipo de unidad</h2>
      <p>Todo lo que ves está físicamente en el lote. Cada ficha incluye fotos reales de la unidad, no de catálogo.</p>
    </div>
    <div class="cats reveal">${cats}</div>
  </div>
</section>

<!-- Destacados -->
<section class="section section--alt">
  <div class="wrap">
    <div class="section-head" style="display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;max-width:none;flex-wrap:wrap">
      <div style="max-width:60ch">
        <span class="eyebrow">Recién ingresados</span>
        <h2 class="h2">Unidades destacadas</h2>
        <p>Una muestra de lo que tenemos ahora mismo. El inventario se mueve rápido: confirma disponibilidad por WhatsApp.</p>
      </div>
      <a class="btn btn--ghost" href="/vehiculos/">Ver todo el inventario ${icon('arrowRight')}</a>
    </div>
    <div class="cars-grid reveal">
      ${destacados.map((c, i) => carCard(c, imgs[c.slug], { loading: i < 3 ? 'eager' : 'lazy' })).join('')}
    </div>
  </div>
</section>

<!-- Por qué nosotros -->
<section class="section">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="eyebrow">Por qué SemiMex</span>
      <h2 class="h2">Comprar seminuevo sin sobresaltos</h2>
      <p>Llevamos años vendiendo en la región y vivimos de que el cliente regrese y nos recomiende. Así trabajamos.</p>
    </div>
    <div class="cards reveal">
      ${site.beneficios.map(b => `
      <div class="card">
        <div class="card__icon">${icon(b.icono)}</div>
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.texto)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- Proceso -->
<section class="section section--sunken">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Cómo funciona</span>
      <h2 class="h2">De la búsqueda a las llaves</h2>
      <p>Cuatro pasos, sin vueltas innecesarias. La mayoría de nuestros clientes cierra el mismo día que visita el lote.</p>
    </div>
    <div class="steps reveal">
      ${site.pasos.map(p => `
      <div class="step"${p.n === 1 ? ' data-active' : ''}>
        <span class="step__n">0${p.n}</span>
        <h3>${esc(p.titulo)}</h3>
        <p>${esc(p.texto)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<!-- Vende / financia -->
<section class="section">
  <div class="wrap split">
    <div class="split__media">
      ${(() => { const f = lote.find(x => !x.hero) || lote[0];
        return fotoLote(f, { sizes: '(max-width:900px) 100vw, 560px', variante: 'm' }); })()}
    </div>
    <div>
      <span class="eyebrow">Tu auto vale</span>
      <h2 class="h2">Tomamos tu unidad a cuenta</h2>
      <p class="lead" style="margin-top:1rem">
        No tienes que vender por tu cuenta ni lidiar con desconocidos. Trae tu auto, lo valuamos
        el mismo día sin costo y aplicamos el avalúo directo al enganche de tu siguiente unidad.
      </p>
      <ul style="list-style:none;padding:0;display:grid;gap:.75rem;margin-top:1.5rem">
        ${['Avalúo gratuito y sin compromiso', 'Nosotros hacemos el cambio de propietario', 'Se aplica como enganche inmediato', 'También compramos de contado'].map(t =>
          `<li style="display:flex;gap:.6rem;align-items:flex-start"><span style="color:var(--ok-600);flex:none;width:20px">${icon('check')}</span><span>${esc(t)}</span></li>`).join('')}
      </ul>
      <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.8rem">
        <a class="btn btn--primary" href="/vende-tu-auto/">Cotizar mi auto ${icon('arrowRight')}</a>
        <a class="btn btn--ghost" href="/financiamiento/">Ver financiamiento</a>
      </div>
    </div>
  </div>
</section>

<!-- FAQ -->
<section class="section section--alt">
  <div class="wrap">
    <div class="section-head">
      <span class="eyebrow">Preguntas frecuentes</span>
      <h2 class="h2">Lo que más nos preguntan</h2>
    </div>
    <div class="faq reveal">
      ${site.faq.map((f, i) => `
      <details${i === 0 ? ' open' : ''}>
        <summary>${esc(f.p)}</summary>
        <div class="faq__a">${esc(f.r)}</div>
      </details>`).join('')}
    </div>
  </div>
</section>

<section class="section"><div class="wrap">${ctaBand(site)}</div></section>`;

  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'AutoDealer',
      name: site.nombre, legalName: site.razonSocial, description: site.descripcion,
      url: site.url, image: site.url + '/img/brand/og-default.jpg',
      telephone: site.telefonos.map(t => t.tel), email: site.emails[0].email,
      priceRange: '$$', currenciesAccepted: 'MXN', paymentAccepted: 'Efectivo, Transferencia, Financiamiento bancario',
      address: { '@type': 'PostalAddress', streetAddress: site.direccion.calle, addressLocality: site.direccion.ciudad, addressRegion: site.direccion.estado, postalCode: site.direccion.cp, addressCountry: 'MX' },
      areaServed: { '@type': 'State', name: 'Chihuahua' },
      sameAs: [site.redes.facebook].filter(Boolean),
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
        { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '14:00' },
      ],
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: site.faq.map(f => ({ '@type': 'Question', name: f.p, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
    },
    {
      '@context': 'https://schema.org', '@type': 'WebSite', name: site.nombreLargo, url: site.url,
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: site.url + '/vehiculos/?q={search_term_string}' }, 'query-input': 'required name=search_term_string' },
    },
  ];

  return page({
    site, current: '/',
    title: `${site.nombre} | Autos y camionetas seminuevas en Cuauhtémoc, Chihuahua`,
    description: `${cars.length} seminuevos revisados en Cuauhtémoc, Chihuahua. Pick-ups, SUVs y sedanes con financiamiento bancario. Tomamos tu auto a cuenta. Precio directo de lote.`,
    body, jsonld: ld,
  });
}

/* ============================ CATÁLOGO ============================ */
export function catalogo(site, cars, imgs) {
  const marcas = [...new Set(cars.map(c => c.marca))].sort();
  const cats = [...new Set(cars.map(c => c.categoria))].sort();
  const combs = [...new Set(cars.map(c => c.combustible))].sort();

  const body = `
${pageHead({
  eyebrow: 'Inventario completo',
  titulo: 'Vehículos disponibles',
  texto: `${cars.length} unidades en piso, todas con fotografías reales. Usa los filtros para acotar por tipo, marca, año o presupuesto.`,
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Vehículos' }],
})}

<section class="section" style="padding-top:var(--sp-6)">
  <div class="wrap catalog">
    <aside class="filters" data-filters data-open="false">
      <div class="filters__head">
        <h2>${icon('filter')} Filtros</h2>
        <button class="btn btn--ghost btn--sm filters__toggle" type="button" data-filters-toggle aria-expanded="false">Mostrar</button>
      </div>
      <div class="filters__body">
        <div class="field search-box">
          <label for="f-q">Buscar</label>
          ${icon('search')}
          <input id="f-q" type="search" placeholder="Ford Lobo, Suburban..." data-f="q" autocomplete="off">
        </div>
        <div class="field">
          <span class="field-label" style="font-size:var(--step--1);font-weight:650;color:var(--text-muted)">Tipo</span>
          <div class="chips" data-chips="cat">
            <button class="chip" type="button" data-val="" aria-pressed="true">Todos</button>
            ${cats.map(c => `<button class="chip" type="button" data-val="${esc(c)}" aria-pressed="false">${esc(c)}</button>`).join('')}
          </div>
        </div>
        <div class="field">
          <label for="f-marca">Marca</label>
          <select id="f-marca" data-f="marca"><option value="">Todas las marcas</option>
            ${marcas.map(m => `<option value="${esc(m)}">${esc(m)} (${cars.filter(c => c.marca === m).length})</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="f-anio">Año desde</label>
          <select id="f-anio" data-f="anio"><option value="">Cualquier año</option>
            ${[...new Set(cars.map(c => c.anio).filter(Boolean))].sort((a,b) => b-a).map(a => `<option value="${a}">${a} o más nuevo</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="f-max">Precio máximo</label>
          <select id="f-max" data-f="max"><option value="">Sin límite</option>
            ${[150000, 250000, 350000, 500000, 700000, 900000, 1200000, 2000000].map(v => `<option value="${v}">Hasta $${v.toLocaleString('es-MX')}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="f-trans">Transmisión</label>
          <select id="f-trans" data-f="trans"><option value="">Todas</option>
            <option value="Automática">Automática</option><option value="Manual">Manual</option>
          </select>
        </div>
        <div class="field">
          <label for="f-comb">Combustible</label>
          <select id="f-comb" data-f="comb"><option value="">Todos</option>
            ${combs.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
          </select>
        </div>
        <button class="btn btn--ghost btn--block btn--sm" type="button" data-filters-reset>Limpiar filtros</button>
      </div>
    </aside>

    <div>
      <div class="catalog__bar">
        <span class="catalog__count"><b data-count>${cars.length}</b> <span data-count-word>unidades</span></span>
        <label class="catalog__sort">Ordenar por
          <select data-sort>
            <option value="precio-desc">Mayor precio</option>
            <option value="precio-asc">Menor precio</option>
            <option value="anio-desc">Más nuevos</option>
            <option value="anio-asc">Más antiguos</option>
            <option value="nombre">Nombre (A–Z)</option>
          </select>
        </label>
      </div>
      <div class="cars-grid" data-grid>
        ${cars.map((c, i) => carCard(c, imgs[c.slug], { loading: i < 6 ? 'eager' : 'lazy' })).join('')}
      </div>
      <div class="empty" data-empty hidden>
        ${icon('search')}
        <h3 class="h3">Sin resultados</h3>
        <p class="muted" style="margin-top:.5rem">No hay unidades con esos filtros. Prueba ampliando el presupuesto o quitando alguna condición.</p>
        <button class="btn btn--primary" type="button" data-filters-reset style="margin-top:1.2rem">Limpiar filtros</button>
      </div>
    </div>
  </div>
</section>

<section class="section section--alt"><div class="wrap">${ctaBand(site)}</div></section>`;

  const ld = [{
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: 'Inventario de seminuevos SemiMex', numberOfItems: cars.length,
    itemListElement: cars.slice(0, 40).map((c, i) => ({
      '@type': 'ListItem', position: i + 1, url: `${site.url}/vehiculos/${c.slug}/`, name: c.titulo,
    })),
  }];

  return page({
    site, current: '/vehiculos/',
    title: `Inventario de seminuevos | ${cars.length} unidades | ${site.nombre}`,
    description: `Explora ${cars.length} autos y camionetas seminuevas en Cuauhtémoc, Chihuahua. Filtra por tipo, marca, año y presupuesto. Fotos reales de cada unidad.`,
    body, jsonld: ld,
  });
}

/* ============================ FICHA DE VEHÍCULO ============================ */
export function vehiculo(site, car, imgs, todos) {
  const g = imgs[car.slug] || [];
  const similares = todos
    .filter(c => c.slug !== car.slug)
    .map(c => ({ c, score: (c.categoria === car.categoria ? 3 : 0) + (c.marca === car.marca ? 2 : 0)
      + (car.precio && c.precio ? Math.max(0, 2 - Math.abs(c.precio - car.precio) / 250000) : 0) }))
    .sort((a, b) => b.score - a.score).slice(0, 3).map(x => x.c);

  const msg = `Hola, me interesa el ${car.titulo}${car.precio ? ` (${money(car.precio)})` : ''}. ¿Sigue disponible?`;

  const specs = [
    ['Año', car.anio], ['Tipo', car.categoria], ['Marca', car.marca],
    ['Transmisión', car.transmision], ['Combustible', car.combustible],
    car.km && ['Kilometraje', car.km.toLocaleString('es-MX') + ' km'],
    car.color && ['Color', car.color],
    car.importado && ['Importación', 'Con documentación'],
  ].filter(Boolean);

  const features = [
    car.aire && 'Aire acondicionado',
    car.piel && 'Asientos de piel',
    car.transmision === 'Automática' && 'Transmisión automática',
    car.combustible === 'Diésel' && 'Motor diésel',
    car.combustible === 'Híbrido' && 'Tecnología híbrida',
  ].filter(Boolean);

  const body = `
<div class="wrap">
  <nav class="breadcrumb" aria-label="Ruta de navegación">
    <a href="/">Inicio</a>${icon('chevronRight')}
    <a href="/vehiculos/">Vehículos</a>${icon('chevronRight')}
    <a href="/vehiculos/?cat=${encodeURIComponent(car.categoria)}">${esc(car.categoria)}</a>${icon('chevronRight')}
    <span aria-current="page">${esc(car.titulo)}</span>
  </nav>
</div>

<section style="padding-bottom:var(--sp-8)">
  <div class="wrap vehicle">
    <header class="vehicle__head">
      <span class="eyebrow">${esc(car.marca)} · ${esc(car.categoria)}</span>
      <h1 class="h1" style="font-size:var(--step-3);margin-top:.6rem">${esc(car.titulo)}</h1>
    </header>

    <div class="vehicle__gallery">
      ${g.length ? `
      <div class="gallery" data-gallery>
        <div class="gallery__main" data-gallery-main role="button" tabindex="0" aria-label="Ampliar imagen">
          ${pic(car.slug, g[0], { sizes: '(max-width:1000px) 100vw, 720px', alt: car.titulo, loading: 'eager', fetchpriority: 'high' })}
          ${g.length > 1 ? `
          <button class="gallery__nav gallery__nav--prev" type="button" data-g-prev aria-label="Imagen anterior">${icon('chevronLeft')}</button>
          <button class="gallery__nav gallery__nav--next" type="button" data-g-next aria-label="Imagen siguiente">${icon('chevronRight')}</button>
          <span class="gallery__counter"><span data-g-i>1</span> / ${g.length}</span>` : ''}
        </div>
        ${g.length > 1 ? `
        <div class="gallery__thumbs">
          ${g.map((e, i) => `
          <button class="gallery__thumb" type="button" data-g-thumb="${i}" aria-current="${i === 0}" aria-label="Ver imagen ${i + 1}">
            <img src="${imgPath(car.slug, e.i, 400)}" alt="" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async" width="${e.w}" height="${e.h}" style="background:${e.c}">
          </button>`).join('')}
        </div>` : ''}
      </div>
      <script type="application/json" data-gallery-data>${JSON.stringify(g.map(e => ({ s: imgPath(car.slug, e.i, 1600), t: imgPath(car.slug, e.i, 800), w: e.w, h: e.h, c: e.c })))}</script>
      ` : `<div class="empty">${icon('imageOff')}<h3 class="h3">Fotografías en preparación</h3><p class="muted" style="margin-top:.5rem">Esta unidad está en el lote pero aún no subimos sus fotos. Escríbenos y te las mandamos por WhatsApp hoy mismo.</p></div>`}

    </div>

    <aside class="vpanel">
      <div class="vpanel__card">
        <div class="vprice${car.precio ? '' : ' vprice--ask'}">
          <small>${car.precio ? 'Precio de contado' : 'Precio'}</small>
          ${car.precio ? `$${car.precio.toLocaleString('es-MX')} <span style="font-size:.9rem;color:var(--text-faint);font-family:var(--font-sans)">MXN</span>` : 'A consultar'}
        </div>
        <div class="vactions">
          <a class="btn btn--wa btn--lg btn--block" href="${waLink(site, msg)}" target="_blank" rel="noopener">${icon('whatsapp')} Preguntar por esta unidad</a>
          <a class="btn btn--dark btn--block" href="tel:${site.telefonos[1].tel}">${icon('phone')} Llamar ${esc(site.telefonos[1].numero)}</a>
          <a class="btn btn--ghost btn--block" href="/contacto/?v=${encodeURIComponent(car.titulo)}">Agendar prueba de manejo</a>
        </div>
        <p class="form-note" style="text-align:center">Disponibilidad sujeta a cambio. Confírmanos antes de trasladarte.</p>
      </div>

      ${car.precio ? `
      <div class="calc" data-calc data-precio="${car.precio}">
        <div>
          <h3 style="font-size:var(--step-1)">Simulador de pago mensual</h3>
          <p class="calc__disc" style="margin-top:.35rem">Estimación referencial para que te des una idea.</p>
        </div>
        <div class="calc__row">
          <label for="calc-eng">Enganche <b data-calc-eng>$${Math.round(car.precio * 0.3).toLocaleString('es-MX')}</b></label>
          <input id="calc-eng" type="range" min="10" max="60" step="5" value="30" data-calc-pct>
        </div>
        <div class="calc__row">
          <label for="calc-plazo">Plazo <b data-calc-plazo>48 meses</b></label>
          <input id="calc-plazo" type="range" min="12" max="72" step="12" value="48" data-calc-months>
        </div>
        <div class="calc__out">
          <span>Mensualidad aproximada</span>
          <b data-calc-out>—</b>
        </div>
        <p class="calc__disc">
          Cálculo con tasa anual estimada del <b data-calc-rate>16%</b>. No es una oferta de crédito:
          la tasa, el plazo y el enganche definitivos los determina la institución financiera según tu perfil.
        </p>
        <a class="btn btn--primary btn--block" href="${waLink(site, `Hola, quiero cotizar financiamiento para el ${car.titulo}.`)}" target="_blank" rel="noopener">Cotizar financiamiento</a>
      </div>` : ''}

      <div class="vpanel__card">
        <h3 style="font-size:var(--step-1)">Visítanos</h3>
        <p class="muted" style="font-size:.93rem">${esc(site.direccion.calle)}, ${esc(site.direccion.colonia)}, ${esc(site.direccion.ciudad)}, ${esc(site.direccion.estado)}.</p>
        <a class="btn btn--ghost btn--block btn--sm" href="https://www.google.com/maps/search/?api=1&query=${site.direccion.mapaQuery}" target="_blank" rel="noopener">${icon('pin')} Cómo llegar</a>
      </div>
    </aside>

    <div class="vehicle__details stack">
      <h2 class="h3">Ficha técnica</h2>
      <div class="specs">
        ${specs.map(([k, v]) => `<div class="spec"><span class="spec__k">${esc(k)}</span><span class="spec__v">${esc(v)}</span></div>`).join('')}
      </div>
      ${features.length ? `
      <h2 class="h3" style="margin-top:var(--sp-5)">Equipamiento</h2>
      <div class="vfeatures">${features.map(f => `<span class="feature">${icon('check')}${esc(f)}</span>`).join('')}</div>` : ''}
      ${car.notas ? `<h2 class="h3" style="margin-top:var(--sp-5)">Detalles de la unidad</h2><p class="vnotes">${esc(car.notas)}</p>` : ''}
      ${car.importado ? `
      <div class="card" style="margin-top:var(--sp-5);border-left:4px solid var(--accent-500)">
        <h3 style="font-size:var(--step-1)">Unidad importada</h3>
        <p>Este vehículo fue internado legalmente a México y cuenta con su documentación aduanal correspondiente. Te mostramos el documento original antes de cerrar cualquier trato.</p>
      </div>` : ''}
    </div>
  </div>
</section>

${similares.length ? `
<section class="section section--alt">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">También te puede interesar</span><h2 class="h2">Unidades similares</h2></div>
    <div class="cars-grid">${similares.map(c => carCard(c, imgs[c.slug])).join('')}</div>
  </div>
</section>` : ''}

<div class="lightbox" data-lightbox aria-hidden="true" role="dialog" aria-modal="true" aria-label="Galería ampliada">
  <button class="lightbox__close" type="button" data-lb-close aria-label="Cerrar">${icon('close')}</button>
  <button class="lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="Anterior">${icon('chevronLeft')}</button>
  <img src="" alt="${esc(car.titulo)}" data-lb-img>
  <button class="lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="Siguiente">${icon('chevronRight')}</button>
  <span class="lightbox__counter" data-lb-counter></span>
</div>`;

  const ld = [{
    '@context': 'https://schema.org', '@type': 'Car',
    name: car.titulo, brand: { '@type': 'Brand', name: car.marca }, model: car.modelo,
    vehicleModelDate: car.anio, productionDate: String(car.anio),
    bodyType: car.categoria, vehicleTransmission: car.transmision, fuelType: car.combustible,
    ...(car.km ? { mileageFromOdometer: { '@type': 'QuantitativeValue', value: car.km, unitCode: 'KMT' } } : {}),
    ...(car.color ? { color: car.color } : {}),
    itemCondition: 'https://schema.org/UsedCondition',
    image: g.slice(0, 6).map(e => site.url + imgPath(car.slug, e.i, 1600)),
    url: `${site.url}/vehiculos/${car.slug}/`,
    ...(car.precio ? {
      offers: {
        '@type': 'Offer', price: car.precio, priceCurrency: 'MXN',
        availability: 'https://schema.org/InStock', itemCondition: 'https://schema.org/UsedCondition',
        url: `${site.url}/vehiculos/${car.slug}/`,
        seller: { '@type': 'AutoDealer', name: site.nombre, telephone: site.telefonos[0].tel },
      },
    } : {}),
  }, {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: site.url + '/' },
      { '@type': 'ListItem', position: 2, name: 'Vehículos', item: site.url + '/vehiculos/' },
      { '@type': 'ListItem', position: 3, name: car.titulo, item: `${site.url}/vehiculos/${car.slug}/` },
    ],
  }];

  const desc = `${car.titulo} en venta en Cuauhtémoc, Chihuahua. ${car.precio ? money(car.precio) + '. ' : ''}${car.transmision}, ${car.combustible}${car.km ? ', ' + car.km.toLocaleString('es-MX') + ' km' : ''}. Financiamiento disponible y tomamos tu auto a cuenta.`;

  return page({
    site, current: '/vehiculos/', canonical: `/vehiculos/${car.slug}/`,
    title: `${car.titulo}${car.precio ? ' — ' + money(car.precio) : ''} | ${site.nombre}`,
    description: desc,
    image: g.length ? imgPath(car.slug, g[0].i, 1600) : undefined,
    body, jsonld: ld,
  });
}
