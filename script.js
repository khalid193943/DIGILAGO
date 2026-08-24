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

/* ---------- header transparent superposé à la photo (accueil uniquement) ---------- */
const heroPhoto = document.querySelector('.hero-photo');
const hdrEl = document.querySelector('.hdr');
if (heroPhoto && hdrEl) {
  const updateHdr = () => {
    const photoVisible = heroPhoto.offsetParent !== null; // faux si un ancêtre est display:none (ex. onglet inactif dans un aperçu multi-pages)
    if (photoVisible && window.scrollY <= 40) hdrEl.classList.add('on-photo');
    else hdrEl.classList.remove('on-photo');
  };
  window.addEventListener('scroll', updateHdr, { passive: true });
  updateHdr();
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

/* ---------- formulaire de contact ----------
   Envoie vers Netlify Forms : les demandes arrivent dans votre console admin.
   En local (fichier ouvert directement), l'envoi échoue silencieusement et
   le message de confirmation s'affiche quand même — c'est normal. */
const form = document.getElementById('form');
const formOk = document.getElementById('formOk');
if (form && formOk) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const fd = new FormData(form);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(fd).toString()
    }).catch(() => {});

    form.classList.add('f-hide');
    formOk.classList.add('show');
    formOk.setAttribute('tabindex', '-1');
    formOk.focus();
  });
}

/* =========================================================
   BULLE D'AIDE + NOTIFICATIONS
   Injectées automatiquement sur toutes les pages qui chargent
   ce fichier. Volontairement absentes du parcours "démarrer"
   (pour ne pas distraire) et de la console admin.

   ⚠️ HONNÊTETÉ : les messages ci-dessous ne servent pas à
   simuler une fausse activité. Ils rappellent des faits vrais,
   déjà affichés ailleurs sur le site. Ne les remplacez pas par
   de fausses notifications d'achat : à El Jadida, un client
   peut vérifier, et la crédibilité perdue ne revient pas.
   ========================================================= */
(function widgets(){
  if (document.body.classList.contains('dm-body')) return;
  if (document.querySelector('.adm-body')) return;

  /* ---- Messages rotatifs. Modifiables librement, tant qu'ils restent vrais. ---- */
  const MESSAGES = [
    { t:'Offre de lancement',   x:"5 999 MAD, prix garanti pendant 3 mois." },
    { t:'Démo gratuite',        x:"On construit votre site avant que vous payiez." },
    { t:'Réponse sous 48h',     x:"Votre démo arrive en deux jours ouvrés." },
    { t:'Tout compris',         x:"Domaine et hébergement offerts la première année." },
    { t:'Tarif de lancement',   x:"Réservé aux 50 premières entreprises d'El Jadida." }
  ];

  const WHATSAPP = 'https://wa.me/2126XXXXXXXX';
  const PREMIER_DELAI = 7000;   // avant la 1re notification
  const INTERVALLE   = 17000;   // entre deux notifications
  const DUREE        = 7000;    // temps d'affichage

  /* ---------- bulle + panneau ---------- */
  const bubble = document.createElement('button');
  bubble.className = 'wgt-bubble';
  bubble.setAttribute('aria-label', "Ouvrir l'aide");
  bubble.setAttribute('aria-expanded', 'false');
  bubble.innerHTML = `
    <span class="wgt-dot" aria-hidden="true"></span>
    <svg class="ic-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-9.1 8.5L4 21l1.4-5A8.5 8.5 0 1 1 21 11.5z"/></svg>
    <svg class="ic-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>`;

  const panel = document.createElement('div');
  panel.className = 'wgt-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Aide rapide');
  panel.innerHTML = `
    <p class="wgt-panel-hi">Bonjour 👋</p>
    <p class="wgt-panel-sub">Comment peut-on vous aider&nbsp;?</p>
    <a class="wgt-opt" href="demarrer.html">
      <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg></span>
      Je veux ma démo gratuite
    </a>
    <a class="wgt-opt" href="contact.html">
      <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16v16H4z"/><path d="m4 8 8 5 8-5"/></svg></span>
      J'ai une question
    </a>
    <a class="wgt-opt" href="${WHATSAPP}" target="_blank" rel="noopener">
      <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-9.1 8.5L4 21l1.4-5A8.5 8.5 0 1 1 21 11.5z"/></svg></span>
      Écrire sur WhatsApp
    </a>`;

  /* ---------- notification ---------- */
  const toast = document.createElement('div');
  toast.className = 'wgt-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <span class="wgt-toast-ic" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.9 6.3 6.8.8-5 4.7 1.3 6.8L12 17.3 6 20.6l1.3-6.8-5-4.7 6.8-.8z"/></svg></span>
    <span class="wgt-toast-b"><span class="wgt-toast-t"></span><span class="wgt-toast-x"></span></span>
    <button class="wgt-toast-close" aria-label="Fermer la notification">&times;</button>`;

  document.body.append(toast, panel, bubble);

  /* ---------- comportement de la bulle ---------- */
  function setPanel(open){
    panel.classList.toggle('open', open);
    bubble.classList.toggle('open', open);
    bubble.setAttribute('aria-expanded', String(open));
    bubble.setAttribute('aria-label', open ? "Fermer l'aide" : "Ouvrir l'aide");
    if (open) toast.classList.remove('show'); // jamais les deux en même temps
  }
  bubble.addEventListener('click', () => setPanel(!panel.classList.contains('open')));
  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !bubble.contains(e.target)) setPanel(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setPanel(false); });

  /* ---------- rotation des notifications ---------- */
  let i = 0, stop = false, timer = null;
  if (sessionStorage.getItem('dg_toast_off') === '1') stop = true;

  toast.querySelector('.wgt-toast-close').addEventListener('click', () => {
    stop = true;
    sessionStorage.setItem('dg_toast_off', '1');
    toast.classList.remove('show');
    clearTimeout(timer);
  });

  function afficher(){
    if (stop) return;
    if (panel.classList.contains('open')) { timer = setTimeout(afficher, INTERVALLE); return; }
    const m = MESSAGES[i % MESSAGES.length]; i++;
    toast.querySelector('.wgt-toast-t').textContent = m.t;
    toast.querySelector('.wgt-toast-x').textContent = m.x;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), DUREE);
    timer = setTimeout(afficher, INTERVALLE);
  }
  timer = setTimeout(afficher, PREMIER_DELAI);
})();
