import { icon } from './icons.mjs';
import { esc, waLink, page } from './layout.mjs';
import { ctaBand, pageHead, contactForm, imgPath, carCard, fotoLote } from './components.mjs';

/* ============================ NOSOTROS ============================ */
export function nosotros(site, cars, imgs, lote = []) {
  const ej = cars.find(c => imgs[c.slug]?.length >= 3);
  const im = imgs[ej.slug];
  const marcas = [...new Set(cars.map(c => c.marca))].length;

  const body = `
${pageHead({
  eyebrow: 'Quiénes somos',
  titulo: 'Un lote de seminuevos que responde por lo que vende',
  texto: 'Comercializadora de Seminuevos Mexicanos S.A. de C.V. — SemiMex — opera sobre la carretera Cuauhtémoc–Álvaro Obregón, en Chihuahua.',
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Nosotros' }],
})}

<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Nuestra forma de trabajar</span>
      <h2 class="h2">Seleccionamos poco, pero seleccionamos bien</h2>
      <div class="prose" style="margin-top:1.2rem">
        <p>SemiMex nació de una idea simple: en el mercado de seminuevos la diferencia no está
        en tener el inventario más grande, sino en poder responder con honestidad por cada unidad
        que se exhibe. Por eso revisamos cada vehículo antes de ponerlo en el piso y por eso
        te decimos qué tiene y qué no tiene la unidad que te interesa.</p>

        <p>Trabajamos principalmente con <strong>pick-ups, camionetas y SUVs</strong>, que es lo que
        más se mueve en la región, pero también manejamos sedanes, híbridos y, de vez en cuando,
        alguna unidad especial. Todo lo que publicamos está físicamente en el lote y lo fotografiamos
        nosotros: las imágenes que ves en cada ficha son de la unidad real, no de catálogo.</p>

        <p>Somos socios de la <strong>ANCA</strong> (Asociación Nacional de Comerciantes en Automóviles
        y Camiones), lo que nos obliga a un estándar de operación y documentación que no todos los
        lotes cumplen.</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.8rem">
        <a class="btn btn--primary" href="/vehiculos/">Ver inventario ${icon('arrowRight')}</a>
        <a class="btn btn--ghost" href="/contacto/">Visítanos</a>
      </div>
    </div>
    <div class="split__media">
      ${lote.length ? fotoLote(lote.find(f => f.base === 'lote-3') || lote[0], { sizes: '(max-width:900px) 100vw, 560px', variante: 'm' })
        : `<img src="${imgPath(ej.slug, im[0].i, 800)}" alt="Unidades seminuevas en el lote de SemiMex" loading="lazy" decoding="async" width="${im[0].w}" height="${im[0].h}">`}
    </div>
  </div>
</section>

<section class="section section--dark">
  <div class="wrap">
    <div class="section-head section-head--center" style="margin-inline:auto">
      <span class="eyebrow">En números</span>
      <h2 class="h2">SemiMex hoy</h2>
    </div>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(170px,1fr));text-align:center">
      ${[
        [cars.length, 'Unidades en inventario'],
        [marcas, 'Marcas representadas'],
        ['3', 'Tipos de carrocería'],
        ['ANCA', 'Socio certificado'],
      ].map(([n, l]) => `
      <div>
        <b style="display:block;font-family:var(--font-display);font-size:var(--step-4);color:var(--accent-400);line-height:1">${esc(n)}</b>
        <span style="color:#a9bed5;font-size:var(--step--1)">${esc(l)}</span>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="eyebrow">Compromisos</span>
      <h2 class="h2">Lo que puedes esperar de nosotros</h2>
    </div>
    <div class="cards">
      ${site.beneficios.map(b => `
      <div class="card">
        <div class="card__icon">${icon(b.icono)}</div>
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.texto)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap">
    <div class="section-head"><span class="eyebrow">Respaldo</span><h2 class="h2">Socios y afiliaciones</h2></div>
    <div class="cards">
      ${site.asociaciones.map(a => `
      <div class="card">
        <div class="card__icon">${icon('shield')}</div>
        <h3>${esc(a.nombre)}</h3>
        <p>${esc(a.descripcion)}</p>
        ${a.url ? `<a class="btn btn--ghost btn--sm" href="${esc(a.url)}" target="_blank" rel="noopener" style="justify-self:start">Sitio oficial ${icon('arrowRight')}</a>` : ''}
      </div>`).join('')}
      <div class="card">
        <div class="card__icon">${icon('bank')}</div>
        <h3>Instituciones financieras</h3>
        <p>Operamos con las principales financieras automotrices y bancos del país para armar tu crédito. Te ayudamos a comparar opciones y a integrar el expediente.</p>
      </div>
    </div>
  </div>
</section>

<section class="section"><div class="wrap">${ctaBand(site, {
  titulo: '¿Vienes de fuera de Cuauhtémoc?',
  texto: 'Atendemos con frecuencia a clientes de Chihuahua capital y de toda la región. Te mandamos fotos y video adicionales de la unidad antes de que hagas el viaje.',
  msg: 'Hola, vengo de fuera de Cuauhtémoc y me interesa una unidad. ¿Me pueden dar más información?',
})}</div></section>`;

  return page({
    site, current: '/nosotros/',
    title: `Nosotros | ${site.nombreLargo}`,
    description: 'Comercializadora de Seminuevos Mexicanos (SemiMex), lote de autos y camionetas seminuevas en Cuauhtémoc, Chihuahua. Socios de ANCA. Unidades revisadas y documentación en regla.',
    body,
  });
}

/* ============================ FINANCIAMIENTO ============================ */
export function financiamiento(site, cars) {
  const reqs = [
    { t: 'Identificación oficial vigente', d: 'INE o pasaporte del solicitante.' },
    { t: 'Comprobante de ingresos', d: 'Recibos de nómina, estados de cuenta o declaración si eres independiente.' },
    { t: 'Comprobante de domicilio', d: 'No mayor a 3 meses de antigüedad.' },
    { t: 'CURP y RFC', d: 'Para integrar el expediente ante la institución.' },
    { t: 'Enganche', d: 'Generalmente desde el 20% del valor de la unidad, según tu perfil.' },
    { t: 'Historial crediticio', d: 'Se consulta buró. Un historial sano mejora tasa y plazo.' },
  ];

  const body = `
${pageHead({
  eyebrow: 'Crédito automotriz',
  titulo: 'Financiamiento para tu seminuevo',
  texto: 'Trabajamos con instituciones bancarias y financieras automotrices. Nosotros armamos el expediente y buscamos el plan que mejor se ajuste a lo que puedes pagar.',
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Financiamiento' }],
})}

<section class="section">
  <div class="wrap" style="display:grid;grid-template-columns:minmax(0,1.3fr) minmax(320px,1fr);gap:var(--sp-7);align-items:start">
    <div class="prose">
      <h2 class="h3">Cómo funciona</h2>
      <p>No necesitas ir al banco por tu cuenta. Aquí mismo levantamos tu solicitud, la mandamos
      a las instituciones con las que trabajamos y te decimos qué te aprobaron y bajo qué condiciones.
      El proceso normalmente toma entre <strong>24 y 72 horas hábiles</strong>.</p>

      <h3>Tres formas de comprar</h3>
      <ul>
        <li><strong>Contado.</strong> El precio publicado es de contado. Es la vía más rápida y la que da más margen de negociación.</li>
        <li><strong>Crédito.</strong> Das un enganche y financias el resto a plazos de 12 a 72 meses.</li>
        <li><strong>A cuenta.</strong> Entregas tu unidad actual como enganche y financias la diferencia, si hace falta.</li>
      </ul>

      <h2 class="h3" style="margin-top:2rem">Qué necesitas para solicitar</h2>
      <div class="cards" style="grid-template-columns:1fr 1fr;margin-top:1rem">
        ${reqs.map(r => `
        <div class="card" style="padding:var(--sp-4)">
          <div style="display:flex;gap:.6rem;align-items:flex-start">
            <span style="color:var(--ok-600);flex:none;width:20px;margin-top:2px">${icon('check')}</span>
            <div><h3 style="font-size:1rem">${esc(r.t)}</h3><p style="font-size:.9rem;margin-top:.2rem">${esc(r.d)}</p></div>
          </div>
        </div>`).join('')}
      </div>

      <h2 class="h3" style="margin-top:2.5rem">Preguntas sobre el crédito</h2>
      <div class="faq" style="margin-top:1rem">
        <details open><summary>¿Puedo solicitar si estoy en buró de crédito?</summary>
          <div class="faq__a">Estar en buró no te descalifica automáticamente: lo que importa es tu comportamiento de pago. Si tienes un historial con problemas, cuéntanoslo desde el principio para buscar la institución adecuada o ajustar el enganche.</div></details>
        <details><summary>¿Cuál es el enganche mínimo?</summary>
          <div class="faq__a">Depende del perfil y de la unidad, pero normalmente parte del 20% del valor. Un enganche mayor reduce la mensualidad y suele mejorar la tasa que te ofrecen.</div></details>
        <details><summary>¿Puedo liquidar antes de tiempo?</summary>
          <div class="faq__a">Sí. Las instituciones con las que trabajamos permiten pagos anticipados. Las condiciones exactas vienen en tu contrato: revísalas antes de firmar y pregúntanos cualquier duda.</div></details>
        <details><summary>¿El seguro va incluido?</summary>
          <div class="faq__a">El crédito automotriz exige tener la unidad asegurada con cobertura amplia durante la vigencia. Te ayudamos a cotizarlo y puede financiarse junto con el crédito.</div></details>
      </div>
    </div>

    <aside style="position:sticky;top:calc(var(--nav-h) + 1rem);display:grid;gap:var(--sp-4)">
      <div class="calc" data-calc data-precio="500000">
        <div>
          <h3 style="font-size:var(--step-1)">Calcula tu mensualidad</h3>
          <p class="calc__disc" style="margin-top:.35rem">Mueve los controles para estimar tu pago.</p>
        </div>
        <div class="calc__row">
          <label for="fc-precio">Precio del vehículo <b data-calc-price-label>$500,000</b></label>
          <input id="fc-precio" type="range" min="100000" max="2000000" step="25000" value="500000" data-calc-price>
        </div>
        <div class="calc__row">
          <label for="fc-eng">Enganche <b data-calc-eng>$150,000</b></label>
          <input id="fc-eng" type="range" min="10" max="60" step="5" value="30" data-calc-pct>
        </div>
        <div class="calc__row">
          <label for="fc-plazo">Plazo <b data-calc-plazo>48 meses</b></label>
          <input id="fc-plazo" type="range" min="12" max="72" step="12" value="48" data-calc-months>
        </div>
        <div class="calc__out"><span>Mensualidad aproximada</span><b data-calc-out>—</b></div>
        <p class="calc__disc">Cálculo con tasa anual estimada del <b data-calc-rate>16%</b>. Es una referencia, no una oferta de crédito: la tasa final la define la institución financiera según tu perfil crediticio.</p>
        <a class="btn btn--primary btn--block" href="${waLink(site, 'Hola, quiero solicitar financiamiento para un seminuevo.')}" target="_blank" rel="noopener">${icon('whatsapp')} Solicitar pre-aprobación</a>
      </div>
      <div class="vpanel__card">
        <h3 style="font-size:var(--step-1)">¿Prefieres que te llamemos?</h3>
        <p class="muted" style="font-size:.93rem">Déjanos tus datos y un asesor se comunica contigo para revisar tu caso.</p>
        <a class="btn btn--ghost btn--block btn--sm" href="/contacto/">Ir al formulario</a>
      </div>
    </aside>
  </div>
</section>

<section class="section section--alt"><div class="wrap">${ctaBand(site, {
  titulo: 'Primero elige la unidad',
  texto: 'La solicitud de crédito se arma sobre un vehículo concreto. Revisa el inventario, dinos cuál te interesa y de ahí partimos.',
  msg: 'Hola, quiero información sobre financiamiento.',
})}</div></section>`;

  return page({
    site, current: '/financiamiento/',
    title: `Financiamiento de seminuevos | ${site.nombre}`,
    description: 'Crédito automotriz para seminuevos en Cuauhtémoc, Chihuahua. Calcula tu mensualidad, conoce los requisitos y solicita tu pre-aprobación con SemiMex.',
    body,
  });
}

/* ============================ VENDE TU AUTO ============================ */
export function venderAuto(site, cars, imgs, lote = []) {
  const ej = cars.find(c => c.categoria === 'SUV' && imgs[c.slug]?.length);
  const im = imgs[ej.slug][0];

  const body = `
${pageHead({
  eyebrow: 'Compramos tu unidad',
  titulo: 'Vende o da tu auto a cuenta',
  texto: 'Te lo compramos de contado o lo tomamos como enganche de tu siguiente vehículo. Avalúo el mismo día, sin costo y sin compromiso.',
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Vende tu auto' }],
})}

<section class="section">
  <div class="wrap">
    <div class="section-head section-head--center">
      <span class="eyebrow">El proceso</span>
      <h2 class="h2">Cuatro pasos, un solo día</h2>
    </div>
    <div class="steps">
      ${[
        ['Cuéntanos qué tienes', 'Mándanos marca, modelo, año, kilometraje y unas fotos por WhatsApp. Con eso te damos un rango estimado.'],
        ['Trae la unidad', 'La revisamos físicamente: mecánica, carrocería, interiores y documentación. Toma menos de una hora.'],
        ['Recibe la oferta', 'Te damos una cifra en firme y te explicamos cómo llegamos a ella. Sin presión: decides tú.'],
        ['Cobra o cámbiala', 'Si aceptas, te pagamos de contado o aplicamos el monto al enganche de la unidad que elijas.'],
      ].map(([t, d], i) => `
      <div class="step"${i === 0 ? ' data-active' : ''}>
        <span class="step__n">0${i + 1}</span>
        <h3>${esc(t)}</h3>
        <p>${esc(d)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>

<section class="section section--alt">
  <div class="wrap split">
    <div>
      <span class="eyebrow">Qué compramos</span>
      <h2 class="h2">Nos interesan sobre todo camionetas y pick-ups</h2>
      <p class="lead" style="margin-top:1rem">Es lo que más se mueve en la región, así que solemos pagar mejor por ellas. Aun así, valuamos cualquier unidad en buen estado.</p>
      <ul style="list-style:none;padding:0;display:grid;gap:.75rem;margin-top:1.5rem">
        ${[
          'Pick-ups y camionetas de trabajo o doble cabina',
          'SUVs familiares y de lujo',
          'Sedanes y hatchbacks en buen estado',
          'Unidades nacionales, importadas con pedimento o con decreto',
          'Con adeudo o crédito vigente: lo revisamos caso por caso',
        ].map(t => `<li style="display:flex;gap:.6rem;align-items:flex-start"><span style="color:var(--ok-600);flex:none;width:20px">${icon('check')}</span><span>${esc(t)}</span></li>`).join('')}
      </ul>
      <div class="card" style="margin-top:1.8rem;border-left:4px solid var(--accent-500)">
        <h3 style="font-size:var(--step-1)">Ten a la mano</h3>
        <p>Factura original (o copia si está financiada), tarjeta de circulación, tenencias y verificaciones al corriente, e identificación oficial del titular. Si falta algo, dinos: casi siempre hay forma de resolverlo.</p>
      </div>
    </div>
    <div class="split__media">
      ${lote.length ? fotoLote(lote.find(f => !f.hero) || lote[0], { sizes: '(max-width:900px) 100vw, 560px', variante: 'm' })
        : `<img src="${imgPath(ej.slug, im.i, 800)}" alt="Camioneta seminueva valuada por SemiMex" loading="lazy" decoding="async" width="${im.w}" height="${im.h}">`}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap contact-grid">
    <div>
      <span class="eyebrow">Solicita tu avalúo</span>
      <h2 class="h2">Cuéntanos de tu unidad</h2>
      <p class="lead" style="margin-top:1rem">Llena el formulario o mándanos un WhatsApp con las fotos. Te contestamos con un rango estimado el mismo día.</p>
      <div style="display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.5rem">
        <a class="btn btn--wa btn--lg" href="${waLink(site, 'Hola, quiero vender / dar a cuenta mi auto. Les mando los datos:')}" target="_blank" rel="noopener">${icon('whatsapp')} Mandar por WhatsApp</a>
        <a class="btn btn--ghost btn--lg" href="tel:${site.telefonos[1].tel}">${icon('phone')} Llamar</a>
      </div>
      <div class="info-list" style="margin-top:2.5rem">
        <div class="info"><div class="info__icon">${icon('clock')}</div><div><h3>Horario de valuación</h3>${site.horario.map(h => `<p>${esc(h.dias)}: ${esc(h.horas)}</p>`).join('')}</div></div>
        <div class="info"><div class="info__icon">${icon('pin')}</div><div><h3>Dónde</h3><p>${esc(site.direccion.calle)}, ${esc(site.direccion.colonia)}, ${esc(site.direccion.ciudad)}, ${esc(site.direccion.estado)}.</p></div></div>
      </div>
    </div>
    <div class="vpanel__card">
      <h3 class="h3">Formulario de avalúo</h3>
      ${contactForm(site, { asunto: 'Avalúo de unidad' })}
    </div>
  </div>
</section>`;

  return page({
    site, current: '/vende-tu-auto/',
    title: `Vende tu auto o dalo a cuenta | ${site.nombre}`,
    description: 'Compramos tu auto o camioneta de contado, o lo tomamos a cuenta de tu siguiente seminuevo. Avalúo gratuito el mismo día en Cuauhtémoc, Chihuahua.',
    body,
  });
}

/* ============================ CONTACTO ============================ */
export function contacto(site) {
  const d = site.direccion;
  const body = `
${pageHead({
  eyebrow: 'Estamos para atenderte',
  titulo: 'Contacto',
  texto: 'Escríbenos por WhatsApp para la respuesta más rápida, llámanos en horario de oficina o visítanos directamente en el lote.',
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Contacto' }],
})}

<section class="section">
  <div class="wrap contact-grid">
    <div>
      <div class="info-list">
        <div class="info">
          <div class="info__icon">${icon('whatsapp')}</div>
          <div>
            <h3>WhatsApp</h3>
            <p style="margin-bottom:.5rem">La vía más rápida. Mándanos la unidad que te interesa y te contestamos con fotos y disponibilidad.</p>
            <a class="btn btn--wa btn--sm" href="${waLink(site, 'Hola, me gustaría recibir información.')}" target="_blank" rel="noopener">Abrir WhatsApp</a>
          </div>
        </div>
        <div class="info">
          <div class="info__icon">${icon('phone')}</div>
          <div><h3>Teléfonos</h3>
            ${site.telefonos.map(t => `<p><a href="tel:${t.tel}">${esc(t.etiqueta)}: <strong>${esc(t.numero)}</strong></a></p>`).join('')}
          </div>
        </div>
        <div class="info">
          <div class="info__icon">${icon('mail')}</div>
          <div><h3>Correo</h3>
            ${site.emails.map(e => `<p><a href="mailto:${e.email}">${esc(e.email)}</a></p>`).join('')}
          </div>
        </div>
        <div class="info">
          <div class="info__icon">${icon('pin')}</div>
          <div><h3>Dirección</h3>
            <p>${esc(d.calle)}<br>${esc(d.colonia)}<br>${esc(d.ciudad)}, ${esc(d.estado)}, C.P. ${esc(d.cp)}</p>
            <p style="margin-top:.5rem"><a href="https://www.google.com/maps/search/?api=1&query=${d.mapaQuery}" target="_blank" rel="noopener" style="text-decoration:underline">Abrir en Google Maps</a></p>
          </div>
        </div>
        <div class="info">
          <div class="info__icon">${icon('clock')}</div>
          <div><h3>Horario</h3>
            ${site.horario.map(h => `<p>${esc(h.dias)}: <strong>${esc(h.horas)}</strong></p>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="vpanel__card">
      <h2 class="h3">Mándanos un mensaje</h2>
      <p class="muted" style="font-size:.93rem;margin-bottom:.5rem">Los campos marcados con * son obligatorios.</p>
      ${contactForm(site)}
    </div>
  </div>
</section>

<section class="section section--alt" style="padding-top:0">
  <div class="wrap" style="padding-top:var(--sp-7)">
    <div class="section-head"><span class="eyebrow">Cómo llegar</span><h2 class="h2">Visítanos en el lote</h2>
    <p>Estamos sobre la carretera estatal Cuauhtémoc – Álvaro Obregón, en el kilómetro 12.5.</p></div>
    <div class="map">
      <iframe title="Ubicación de SemiMex en Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen
        src="https://www.google.com/maps?q=${d.mapaQuery}&output=embed"></iframe>
    </div>
  </div>
</section>`;

  return page({
    site, current: '/contacto/',
    title: `Contacto | ${site.nombreLargo}`,
    description: `Contacta a SemiMex en Cuauhtémoc, Chihuahua. Teléfono ${site.telefonos[0].numero}, WhatsApp y correo. Carretera Cuauhtémoc – Álvaro Obregón Km 12.5.`,
    body,
    jsonld: [{
      '@context': 'https://schema.org', '@type': 'ContactPage',
      mainEntity: {
        '@type': 'AutoDealer', name: site.nombre, telephone: site.telefonos.map(t => t.tel), email: site.emails[0].email,
        address: { '@type': 'PostalAddress', streetAddress: d.calle, addressLocality: d.ciudad, addressRegion: d.estado, postalCode: d.cp, addressCountry: 'MX' },
      },
    }],
  });
}

/* ============================ AVISO DE PRIVACIDAD ============================ */
export function privacidad(site) {
  const d = site.direccion;
  const body = `
${pageHead({
  eyebrow: 'Legal',
  titulo: 'Aviso de privacidad',
  texto: `Última actualización: ${site.avisoPrivacidadVigencia}.`,
  crumbs: [{ label: 'Inicio', href: '/' }, { label: 'Aviso de privacidad' }],
})}

<section class="section">
  <div class="wrap prose">
    <p>En cumplimiento de la <strong>Ley Federal de Protección de Datos Personales en Posesión
    de los Particulares</strong> (LFPDPPP), su Reglamento y demás disposiciones aplicables,
    <strong>${esc(site.razonSocial)}</strong> pone a su disposición el presente aviso de privacidad.</p>

    <h2>1. Responsable del tratamiento</h2>
    <p>${esc(site.razonSocial)} ("SemiMex"), con domicilio en ${esc(d.calle)}, ${esc(d.colonia)},
    ${esc(d.ciudad)}, ${esc(d.estado)}, C.P. ${esc(d.cp)}, México, es responsable del uso, tratamiento
    y protección de los datos personales que usted proporcione.</p>

    <h2>2. Datos personales que recabamos</h2>
    <p>Para las finalidades descritas en este aviso podemos recabar los siguientes datos:</p>
    <ul>
      <li><strong>Datos de identificación y contacto:</strong> nombre, teléfono, correo electrónico y, en su caso, domicilio.</li>
      <li><strong>Datos del vehículo:</strong> marca, modelo, año, kilometraje y documentación, cuando solicite un avalúo o entregue una unidad a cuenta.</li>
      <li><strong>Datos financieros y patrimoniales:</strong> únicamente cuando solicite financiamiento y de forma necesaria para integrar su expediente ante la institución crediticia.</li>
    </ul>
    <p>No recabamos datos personales sensibles.</p>

    <h2>3. Finalidades del tratamiento</h2>
    <p><strong>Finalidades primarias</strong> (necesarias para la relación):</p>
    <ul>
      <li>Atender sus solicitudes de información sobre vehículos y servicios.</li>
      <li>Agendar pruebas de manejo, citas y visitas al establecimiento.</li>
      <li>Elaborar cotizaciones, avalúos y contratos de compraventa.</li>
      <li>Gestionar solicitudes de crédito ante instituciones financieras, cuando usted lo solicite.</li>
      <li>Cumplir obligaciones fiscales, contables y legales derivadas de la operación.</li>
    </ul>
    <p><strong>Finalidades secundarias</strong> (no necesarias, puede oponerse):</p>
    <ul>
      <li>Enviarle información sobre nuevas unidades, promociones y novedades.</li>
      <li>Realizar encuestas de satisfacción y estudios internos de mercado.</li>
    </ul>
    <p>Si no desea que sus datos se usen para las finalidades secundarias, puede manifestarlo
    enviando un correo a <a href="mailto:${site.emails[0].email}">${esc(site.emails[0].email)}</a>.
    Su negativa no será motivo para negarle los servicios que solicita.</p>

    <h2>4. Transferencia de datos</h2>
    <p>Sus datos pueden ser transferidos, sin requerir su consentimiento en los casos previstos por el
    artículo 37 de la LFPDPPP, a:</p>
    <ul>
      <li>Instituciones bancarias y financieras, exclusivamente cuando usted solicite financiamiento.</li>
      <li>Aseguradoras, cuando requiera contratar una póliza a través de nosotros.</li>
      <li>Autoridades competentes, cuando exista requerimiento fundado y motivado.</li>
      <li>Notarías y gestores, para trámites de cambio de propietario y registro vehicular.</li>
    </ul>
    <p>No comercializamos ni vendemos sus datos personales a terceros.</p>

    <h2>5. Derechos ARCO</h2>
    <p>Usted tiene derecho a <strong>Acceder</strong> a sus datos, <strong>Rectificarlos</strong>
    cuando sean inexactos, <strong>Cancelarlos</strong> cuando considere que no se requieren para
    las finalidades señaladas, y <strong>Oponerse</strong> a su tratamiento para fines específicos.</p>
    <p>Para ejercer cualquiera de estos derechos, envíe su solicitud a
    <a href="mailto:${site.emails[0].email}">${esc(site.emails[0].email)}</a> indicando:</p>
    <ol>
      <li>Nombre completo y medio para comunicarle la respuesta.</li>
      <li>Copia de identificación oficial que acredite su identidad.</li>
      <li>Descripción clara de los datos sobre los que busca ejercer el derecho.</li>
      <li>Cualquier elemento que facilite la localización de sus datos.</li>
    </ol>
    <p>Responderemos en un plazo máximo de 20 días hábiles.</p>

    <h2>6. Revocación del consentimiento</h2>
    <p>Puede revocar el consentimiento que nos haya otorgado siguiendo el mismo procedimiento
    señalado para los derechos ARCO. Considere que, por obligaciones legales, en ciertos casos
    no podremos concluir el uso de forma inmediata.</p>

    <h2>7. Uso de cookies y tecnologías similares</h2>
    <p>Este sitio web no utiliza cookies de rastreo publicitario ni de terceros con fines de perfilado.
    Únicamente empleamos almacenamiento local del navegador para recordar su preferencia de tema
    (claro u oscuro). Los mapas se cargan desde Google Maps, servicio que aplica sus propias políticas.</p>

    <h2>8. Cambios al aviso de privacidad</h2>
    <p>Cualquier modificación a este aviso será publicada en esta misma página. Le recomendamos
    revisarla periódicamente. La fecha de última actualización aparece al inicio del documento.</p>

    <h2>9. Contacto</h2>
    <p>Para cualquier duda sobre este aviso: <a href="mailto:${site.emails[0].email}">${esc(site.emails[0].email)}</a>
    · Tel. <a href="tel:${site.telefonos[0].tel}">${esc(site.telefonos[0].numero)}</a></p>
  </div>
</section>`;

  return page({
    site, current: '/aviso-de-privacidad/',
    title: `Aviso de privacidad | ${site.nombre}`,
    description: 'Aviso de privacidad de Comercializadora de Seminuevos Mexicanos S.A. de C.V. conforme a la LFPDPPP.',
    body,
  });
}

/* ============================ 404 ============================ */
export function noEncontrado(site, cars, imgs) {
  const sug = cars.filter(c => c.precio).slice(0, 3);
  const body = `
<section class="section" style="text-align:center;padding-block:var(--sp-9)">
  <div class="wrap" style="max-width:640px">
    <span class="eyebrow" style="justify-content:center">Error 404</span>
    <h1 class="h1" style="margin-top:1rem">Esta página no existe</h1>
    <p class="lead" style="margin:1.2rem auto 0">
      Puede que la unidad que buscabas ya se haya vendido o que la dirección esté mal escrita.
      Revisa el inventario actual o escríbenos y te ayudamos a encontrar lo que necesitas.
    </p>
    <div style="display:flex;flex-wrap:wrap;gap:.7rem;justify-content:center;margin-top:2rem">
      <a class="btn btn--primary btn--lg" href="/vehiculos/">Ver inventario ${icon('arrowRight')}</a>
      <a class="btn btn--wa btn--lg" href="${waLink(site, 'Hola, no encontré lo que buscaba en el sitio.')}" target="_blank" rel="noopener">${icon('whatsapp')} Escríbenos</a>
    </div>
  </div>
</section>
<section class="section section--alt">
  <div class="wrap">
    <div class="section-head section-head--center"><h2 class="h2">Quizá te interese</h2></div>
    <div class="cars-grid">${sug.map(c => carCard(c, imgs[c.slug])).join('')}</div>
  </div>
</section>`;

  return page({
    site, current: '', canonical: '/404.html',
    title: `Página no encontrada | ${site.nombre}`,
    description: 'La página que buscas no existe o la unidad ya fue vendida. Consulta el inventario actual de seminuevos de SemiMex en Cuauhtémoc, Chihuahua.',
    body,
  });
}
