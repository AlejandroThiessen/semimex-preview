/* SemiMex — interacciones del sitio. Sin dependencias. */
(function () {
  'use strict';
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const mxn = n => '$' + Math.round(n).toLocaleString('es-MX');

  /* ---------- Tema claro / oscuro ---------- */
  const themeBtn = $('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = cur ? (cur === 'dark' ? 'light' : 'dark') : (sysDark ? 'light' : 'dark');
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('semimex-theme', next); } catch (e) {}
    });
  }

  /* ---------- Menú móvil ---------- */
  const mnav = $('[data-mobile-nav]');
  const setNav = (open) => {
    if (!mnav) return;
    mnav.dataset.open = String(open);
    mnav.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    const b = $('[data-menu-open]');
    if (b) b.setAttribute('aria-expanded', String(open));
    if (open) { const f = mnav.querySelector('a, button'); if (f) f.focus(); }
  };
  const openBtn = $('[data-menu-open]'); if (openBtn) openBtn.addEventListener('click', () => setNav(true));
  const closeBtn = $('[data-menu-close]'); if (closeBtn) closeBtn.addEventListener('click', () => setNav(false));
  if (mnav) $$('a', mnav).forEach(a => a.addEventListener('click', () => setNav(false)));

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$('.reveal');
  if (reveals.length && 'IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(r => io.observe(r));
  } else {
    reveals.forEach(r => r.classList.add('is-in'));
  }

  /* ---------- Hero: fundido entre fotos del lote ---------- */
  const heroMedia = $('[data-hero-media]');
  if (heroMedia) {
    const slides = $$('.hero__slide', heroMedia);
    const dots   = $$('[data-dot]', heroMedia);
    if (slides.length > 1) {
      let hi = 0, timer = null;
      const DUR = 6000;
      const go = (n) => {
        hi = (n + slides.length) % slides.length;
        slides.forEach((s, k) => s.setAttribute('data-active', String(k === hi)));
        dots.forEach((d, k) => d.setAttribute('aria-selected', String(k === hi)));
      };
      const start = () => { stop(); timer = setInterval(() => go(hi + 1), DUR); };
      const stop  = () => { if (timer) { clearInterval(timer); timer = null; } };

      dots.forEach((d, k) => d.addEventListener('click', () => { go(k); start(); }));

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
      const maybeStart = () => { if (!reduce.matches && !document.hidden) start(); else stop(); };
      document.addEventListener('visibilitychange', maybeStart);
      if (reduce.addEventListener) reduce.addEventListener('change', maybeStart);
      // No gastar ciclos si el hero no está a la vista
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((es) => {
          es.forEach(e => (e.isIntersecting ? maybeStart() : stop()));
        }, { threshold: 0.15 }).observe(heroMedia);
      } else maybeStart();
    }
  }

  /* ---------- Catálogo: filtros, orden y URL ---------- */
  const grid = $('[data-grid]');
  if (grid) {
    const cards   = $$('[data-car]', grid);
    const countEl = $('[data-count]');
    const wordEl  = $('[data-count-word]');
    const emptyEl = $('[data-empty]');
    const sortEl  = $('[data-sort]');
    const state   = { q: '', cat: '', marca: '', anio: '', max: '', trans: '', comb: '' };

    // Hidratar desde la URL (permite enlaces del tipo /vehiculos/?cat=SUV)
    const params = new URLSearchParams(location.search);
    Object.keys(state).forEach(k => { const v = params.get(k); if (v) state[k] = v; });

    const syncInputs = () => {
      $$('[data-f]').forEach(el => { const k = el.dataset.f; if (state[k] != null) el.value = state[k]; });
      $$('[data-chips]').forEach(box => {
        const k = box.dataset.chips;
        $$('.chip', box).forEach(c => c.setAttribute('aria-pressed', String(c.dataset.val === state[k])));
      });
    };

    const matches = (card) => {
      const d = card.dataset;
      if (state.q) {
        const q = state.q.toLowerCase().trim();
        const hay = (d.nombre + ' ' + d.marca + ' ' + d.cat + ' ' + d.anio).toLowerCase();
        if (!q.split(/\s+/).every(t => hay.includes(t))) return false;
      }
      if (state.cat   && d.cat   !== state.cat)   return false;
      if (state.marca && d.marca !== state.marca) return false;
      if (state.trans && d.trans !== state.trans) return false;
      if (state.comb  && d.comb  !== state.comb)  return false;
      if (state.anio  && (!d.anio || +d.anio < +state.anio)) return false;
      if (state.max   && (!d.precio || +d.precio > +state.max)) return false;
      return true;
    };

    const sortCards = () => {
      const mode = sortEl ? sortEl.value : 'precio-desc';
      const num = (c, k) => +c.dataset[k] || 0;
      const sorted = cards.slice().sort((a, b) => {
        switch (mode) {
          case 'precio-asc':  return (num(a,'precio') || Infinity) - (num(b,'precio') || Infinity);
          case 'anio-desc':   return num(b,'anio') - num(a,'anio');
          case 'anio-asc':    return num(a,'anio') - num(b,'anio');
          case 'nombre':      return a.dataset.nombre.localeCompare(b.dataset.nombre, 'es');
          default:            return num(b,'precio') - num(a,'precio');
        }
      });
      sorted.forEach(c => grid.appendChild(c));
    };

    const apply = (pushUrl = true) => {
      let n = 0;
      cards.forEach(c => { const ok = matches(c); c.hidden = !ok; if (ok) n++; });
      if (countEl) countEl.textContent = n;
      if (wordEl)  wordEl.textContent = n === 1 ? 'unidad' : 'unidades';
      if (emptyEl) emptyEl.hidden = n > 0;
      grid.hidden = n === 0;
      if (pushUrl) {
        const p = new URLSearchParams();
        Object.entries(state).forEach(([k, v]) => { if (v) p.set(k, v); });
        const qs = p.toString();
        history.replaceState(null, '', qs ? '?' + qs : location.pathname);
      }
    };

    $$('[data-f]').forEach(el => {
      const ev = el.type === 'search' || el.type === 'text' ? 'input' : 'change';
      el.addEventListener(ev, () => { state[el.dataset.f] = el.value; apply(); });
    });
    $$('[data-chips]').forEach(box => {
      const k = box.dataset.chips;
      $$('.chip', box).forEach(chip => chip.addEventListener('click', () => {
        state[k] = chip.dataset.val;
        $$('.chip', box).forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
        apply();
      }));
    });
    if (sortEl) sortEl.addEventListener('change', () => { sortCards(); apply(); });
    $$('[data-filters-reset]').forEach(b => b.addEventListener('click', () => {
      Object.keys(state).forEach(k => state[k] = '');
      syncInputs(); apply();
      window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
    }));

    const ftoggle = $('[data-filters-toggle]');
    if (ftoggle) ftoggle.addEventListener('click', () => {
      const box = $('[data-filters]');
      const open = box.dataset.open !== 'true';
      box.dataset.open = String(open);
      ftoggle.setAttribute('aria-expanded', String(open));
      ftoggle.textContent = open ? 'Ocultar' : 'Mostrar';
    });

    syncInputs();
    sortCards();
    apply(false);
  }

  /* ---------- Galería de la ficha ---------- */
  const gal = $('[data-gallery]');
  if (gal) {
    const dataEl = $('[data-gallery-data]');
    const items = dataEl ? JSON.parse(dataEl.textContent) : [];
    const mainImg = $('[data-gallery-main] img');
    const idxEl = $('[data-g-i]');
    const thumbs = $$('[data-g-thumb]');
    let i = 0;

    const show = (n) => {
      if (!items.length) return;
      i = (n + items.length) % items.length;
      const it = items[i];
      mainImg.src = it.t;
      mainImg.srcset = '';
      mainImg.width = it.w; mainImg.height = it.h;
      mainImg.style.background = it.c;
      if (idxEl) idxEl.textContent = i + 1;
      thumbs.forEach((t, k) => t.setAttribute('aria-current', String(k === i)));
      const active = thumbs[i];
      if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    };

    const prev = $('[data-g-prev]'); if (prev) prev.addEventListener('click', e => { e.stopPropagation(); show(i - 1); });
    const next = $('[data-g-next]'); if (next) next.addEventListener('click', e => { e.stopPropagation(); show(i + 1); });
    thumbs.forEach((t, k) => t.addEventListener('click', () => show(k)));

    /* Lightbox */
    const lb = $('[data-lightbox]');
    if (lb) {
      const lbImg = $('[data-lb-img]', lb);
      const lbC = $('[data-lb-counter]', lb);
      let li = 0;
      const render = () => {
        const it = items[li];
        if (!it) return;
        lbImg.src = it.s;
        lbC.textContent = (li + 1) + ' / ' + items.length;
      };
      const open = (n) => {
        li = n; render();
        lb.dataset.open = 'true'; lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const c = $('[data-lb-close]', lb); if (c) c.focus();
      };
      const close = () => {
        lb.dataset.open = 'false'; lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      };
      const main = $('[data-gallery-main]');
      main.addEventListener('click', () => open(i));
      main.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
      $('[data-lb-close]', lb).addEventListener('click', close);
      $('[data-lb-prev]', lb).addEventListener('click', e => { e.stopPropagation(); li = (li - 1 + items.length) % items.length; render(); });
      $('[data-lb-next]', lb).addEventListener('click', e => { e.stopPropagation(); li = (li + 1) % items.length; render(); });
      lb.addEventListener('click', e => { if (e.target === lb || e.target === lbImg) close(); });
      document.addEventListener('keydown', e => {
        if (lb.dataset.open !== 'true') return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft')  { li = (li - 1 + items.length) % items.length; render(); }
        if (e.key === 'ArrowRight') { li = (li + 1) % items.length; render(); }
      });
      // Swipe en móvil
      let sx = 0;
      lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) { li = (li + (dx < 0 ? 1 : -1) + items.length) % items.length; render(); }
      }, { passive: true });
    }

    // Teclado sobre la galería principal
    document.addEventListener('keydown', e => {
      const lbOpen = $('[data-lightbox]') && $('[data-lightbox]').dataset.open === 'true';
      if (lbOpen) return;
      if (e.key === 'ArrowLeft')  show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
  }

  /* ---------- Calculadora de financiamiento ---------- */
  $$('[data-calc]').forEach(calc => {
    const TASA = 0.16;                     // tasa anual estimada
    const pctEl   = $('[data-calc-pct]', calc);
    const mesEl   = $('[data-calc-months]', calc);
    const priceEl = $('[data-calc-price]', calc);
    const out     = $('[data-calc-out]', calc);
    const engLbl  = $('[data-calc-eng]', calc);
    const plzLbl  = $('[data-calc-plazo]', calc);
    const prcLbl  = $('[data-calc-price-label]', calc);

    const run = () => {
      const precio = priceEl ? +priceEl.value : +calc.dataset.precio;
      const pct = +pctEl.value / 100;
      const meses = +mesEl.value;
      const enganche = precio * pct;
      const capital = precio - enganche;
      const r = TASA / 12;
      const pago = capital * (r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
      if (prcLbl) prcLbl.textContent = mxn(precio);
      engLbl.textContent = mxn(enganche) + ' (' + Math.round(pct * 100) + '%)';
      plzLbl.textContent = meses + ' meses';
      out.textContent = isFinite(pago) ? mxn(pago) : '—';
    };
    [pctEl, mesEl, priceEl].forEach(el => el && el.addEventListener('input', run));
    run();
  });

  /* ---------- Prefill del formulario desde ?v= ---------- */
  const vParam = new URLSearchParams(location.search).get('v');
  if (vParam) {
    const ta = $('[data-contact-form] textarea');
    const hid = $('[data-contact-form] input[name="vehiculo"]');
    if (ta && !ta.value) ta.value = 'Hola, me interesa el ' + vParam + '. Quisiera agendar una prueba de manejo.';
    if (hid) hid.value = vParam;
    const sel = $('[data-contact-form] select[name="interes"]');
    if (sel) sel.value = 'Comprar un seminuevo';
  }
})();
