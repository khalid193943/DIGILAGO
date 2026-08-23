// =========================================================
// DIGILAGO — script partagé.
// Chaque bloc vérifie ses éléments : fonctionne sur toutes les pages.
// =========================================================

/* ---------- menu mobile ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }));
}

/* ---------- apparition au scroll ---------- */
const revealables = document.querySelectorAll('.rv, .stg, .rv-l, .rv-r');
if (revealables.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealables.forEach(el => io.observe(el));
}

/* ---------- déclenchement de l'animation de la timeline (zigzag + feuille de route) ---------- */
const timelines = document.querySelectorAll('.tl, .tl-mob');
if (timelines.length) {
  const ioTl = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('tl-play'); ioTl.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  timelines.forEach(el => ioTl.observe(el));
}

/* ---------- scène de recherche animée (page "Pourquoi un site") : déclenchement en boucle ---------- */
const scenas = document.querySelectorAll('.scena');
if (scenas.length) {
  const ioScena = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('play'); ioScena.unobserve(e.target); }
    });
  }, { threshold: 0.35 });
  scenas.forEach(el => ioScena.observe(el));
}

/* ---------- avant/après animé, façon gif : les points apparaissent un à un, puis tout se réinitialise ---------- */
document.querySelectorAll('.ba').forEach(ba => {
  const before = ba.querySelectorAll('.ba-b.no p');
  const after = ba.querySelectorAll('.ba-b.yes p');
  const winCard = ba.querySelector('.ba-c.win');
  if (!before.length || !after.length) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    before.forEach(p => p.classList.add('show'));
    after.forEach(p => p.classList.add('show'));
    return;
  }
  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function loop() {
    while (true) {
      before.forEach(p => p.classList.remove('show'));
      after.forEach(p => p.classList.remove('show'));
      winCard.classList.remove('glow');
      await wait(500);
      for (const p of before) { p.classList.add('show'); await wait(260); }
      await wait(1000);
      for (const p of after) { p.classList.add('show'); await wait(260); }
      winCard.classList.add('glow');
      await wait(2600);
    }
  }

  const ioBa = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { loop(); ioBa.disconnect(); }
    });
  }, { threshold: 0.35 });
  ioBa.observe(ba);
});

/* ---------- scène animée du hero : recherche → positionnement → site ---------- */
(function heroDemo() {
  const stage = document.getElementById('demoStage');
  if (!stage) return;
  const typed = document.getElementById('demoTyped');
  const results = document.getElementById('demoResults');
  const phSearch = document.getElementById('phSearch');
  const phSite = document.getElementById('phSite');
  const query = 'école privée el jadida';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce) {
    // pas d'animation : on montre directement l'état final le plus utile (le site)
    typed.textContent = query;
    results.classList.add('show');
    phSearch.classList.remove('active');
    phSite.classList.add('active');
    return;
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  async function typeText(el, text, speed) {
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
      el.textContent += text[i];
      await wait(speed);
    }
  }

  async function loop() {
    while (true) {
      phSite.classList.remove('active');
      phSearch.classList.add('active');
      results.classList.remove('show');
      await wait(450);
      await typeText(typed, query, 60);
      await wait(450);
      results.classList.add('show');
      await wait(1800);
      phSearch.classList.remove('active');
      phSite.classList.add('active');
      await wait(3600);
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { loop(); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(stage);
})();
document.querySelectorAll('.car').forEach(car => {
  const track = car.querySelector('.car-track');
  if (!track) return;
  const dots = car.querySelectorAll('.car-dot');
  const prevBtn = car.querySelector('.car-prev');
  const nextBtn = car.querySelector('.car-next');
  const cards = Array.from(track.children);
  if (!cards.length) return;

  function step() {
    const style = getComputedStyle(track);
    return cards[0].getBoundingClientRect().width + parseFloat(style.columnGap || style.gap || 0);
  }

  function syncUI() {
    const max = track.scrollWidth - track.clientWidth - 2;
    const idx = Math.round(track.scrollLeft / step());
    dots.forEach((d, i) => d.classList.toggle('on', i === Math.min(idx, dots.length - 1)));
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 4;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= max;
  }

  let t;
  track.addEventListener('scroll', () => { clearTimeout(t); t = setTimeout(syncUI, 90); }, { passive: true });

  if (prevBtn) prevBtn.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (nextBtn) nextBtn.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  dots.forEach((d, i) => d.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' })));

  // glisser à la souris (le tactile utilise le scroll natif du navigateur)
  let dragging = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch') return;
    dragging = true; moved = false; startX = e.clientX; startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    if (Math.abs(e.clientX - startX) > 4) moved = true;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  const endDrag = () => { dragging = false; };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);

  syncUI();
  window.addEventListener('resize', syncUI);
});

/* ---------- compteur animé sur les chiffres ---------- */
const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io2 = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      io2.unobserve(el);
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      if (reduce) { el.textContent = target + suffix; return; }
      const dur = 1400;
      const start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => io2.observe(el));
}

/* ---------- grille 100 points : 30 pleins, 70 vides ---------- */
const dots = document.getElementById('dots');
if (dots) {
  const on = new Set();
  while (on.size < 30) on.add(Math.floor(Math.random() * 100));
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 100; i++) {
    const d = document.createElement('i');
    if (on.has(i)) d.className = 'on';
    frag.appendChild(d);
  }
  dots.appendChild(frag);
}

/* ---------- accordéon : une seule question ouverte ---------- */
const faqs = document.querySelectorAll('.fq');
if (faqs.length) {
  faqs.forEach(d => d.addEventListener('toggle', () => {
    if (!d.open) return;
    faqs.forEach(o => { if (o !== d && o.parentElement === d.parentElement) o.open = false; });
  }));
}

/* ---------- suivi de pages (analytics premier-parti, léger) ----------
   Alimente l'onglet Analytics de la console admin. Tant que
   ANALYTICS_FORM_URL n'est pas rempli, ne fait rien du tout. */
(function trackPageView(){
  const ANALYTICS_FORM_URL = ''; // ex: https://docs.google.com/forms/d/e/XXXXXXXX/formResponse
  const ANALYTICS_FIELDS = { page: '', device: '' }; // entry.XXXXXXXXX
  if (!ANALYTICS_FORM_URL) return;
  const page = location.pathname.split('/').pop() || 'index.html';
  const device = window.matchMedia('(max-width: 760px)').matches ? 'Mobile' : 'Desktop';
  const fd = new FormData();
  if (ANALYTICS_FIELDS.page) fd.append(ANALYTICS_FIELDS.page, page);
  if (ANALYTICS_FIELDS.device) fd.append(ANALYTICS_FIELDS.device, device);
  fetch(ANALYTICS_FORM_URL, { method: 'POST', mode: 'no-cors', body: fd }).catch(() => {});
})();

/* ---------- formulaire ----------
   Envoie silencieusement vers un Google Form (qui alimente le Sheet lu
   par la page admin). Tant que GOOGLE_FORM_URL n'est pas rempli, le
   formulaire fonctionne comme avant (aucune erreur, juste pas d'envoi). */
const GOOGLE_FORM_URL = ''; // ex: https://docs.google.com/forms/d/e/XXXXXXXX/formResponse
const GOOGLE_FORM_FIELDS = {
  nom: '',        // entry.XXXXXXXXX
  entreprise: '', // entry.XXXXXXXXX
  secteur: '',    // entry.XXXXXXXXX
  telephone: '',  // entry.XXXXXXXXX
  email: '',      // entry.XXXXXXXXX
  lien: '',       // entry.XXXXXXXXX
  message: ''     // entry.XXXXXXXXX
};

const form = document.getElementById('form');
const formOk = document.getElementById('formOk');
if (form && formOk) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    if (GOOGLE_FORM_URL) {
      const fd = new FormData(form);
      const gData = new FormData();
      Object.keys(GOOGLE_FORM_FIELDS).forEach(key => {
        if (GOOGLE_FORM_FIELDS[key]) gData.append(GOOGLE_FORM_FIELDS[key], fd.get(key) || '');
      });
      fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body: gData }).catch(() => {});
    }

    form.classList.add('f-hide');
    formOk.classList.add('show');
    formOk.setAttribute('tabindex', '-1');
    formOk.focus();
  });
}
