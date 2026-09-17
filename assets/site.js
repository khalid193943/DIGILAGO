/* =========================================================
   DIGILAGO — comportements du site (v2)
   Tout est progressif : sans JavaScript, la page reste lisible
   et le formulaire s'envoie de façon classique.
   ========================================================= */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header : fond au scroll ---------- */
  const hdr = $('.hdr');
  const onScroll = () => hdr && hdr.classList.toggle('is-solid', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- menu mobile ---------- */
  const burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', () => {
      const open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('.mnav a').forEach(a => a.addEventListener('click', () => {
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---------- lien de nav actif selon la section visible ---------- */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = $$('main section[id]');
  if (navLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(s => io.observe(s));
  }

  /* ---------- hero : la recherche se "tape" puis les résultats tombent ---------- */
  const typed = $('#typed');
  if (typed) {
    const text = typed.dataset.text || '';
    const rows = $$('.sm-row, .sm-note');
    if (reduce) {
      typed.textContent = text;
      rows.forEach(r => r.classList.add('show'));
    } else {
      let i = 0;
      const tick = () => {
        typed.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, 55 + Math.random() * 60);
        else rows.forEach((r, k) => setTimeout(() => r.classList.add('show'), 250 + k * 170));
      };
      setTimeout(tick, 900);
    }
  }

  /* ---------- scrollytelling : le téléphone suit les étapes ---------- */
  const phone = $('#phone');
  const storySteps = $$('.story-step');
  if (phone && storySteps.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        storySteps.forEach(s => s.classList.remove('is-active'));
        e.target.classList.add('is-active');
        phone.dataset.step = e.target.dataset.step;
        const panel = $('.story-panel');
        if (panel) panel.innerHTML = e.target.innerHTML;
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    storySteps.forEach(s => io.observe(s));
    const panel0 = $('.story-panel');
    if (panel0) panel0.innerHTML = storySteps[0].innerHTML;
  }

  /* ---------- méthode : la ligne se dessine au scroll ---------- */
  const steps = $('.steps');
  if (steps) {
    const items = $$('.step', steps);
    const update = () => {
      const r = steps.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.7 - r.top) / r.height));
      steps.style.setProperty('--p', p.toFixed(3));
      items.forEach(it => {
        const ir = it.getBoundingClientRect();
        it.classList.toggle('is-done', ir.top < vh * 0.7);
      });
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
  }

  /* ---------- apparitions discrètes ---------- */
  const rv = $$('.rv');
  if (rv.length && 'IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(el => io.observe(el));
  } else rv.forEach(el => el.classList.add('in'));

  /* ---------- FAQ ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item);
    q.addEventListener('click', () => {
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  /* =========================================================
     Formulaire en étapes
     ========================================================= */
  const form = $('#wizard');
  if (!form) return;

  const stepsEl = $$('.wz-step', form);
  const total = stepsEl.length;
  const bar = $('.wz-bar i', form);
  const meta = $('#wzMeta');
  const title = $('#wzTitle');
  const btnPrev = $('#wzPrev');
  const btnNext = $('#wzNext');
  const done = $('#wzDone');
  const nav = $('.wz-nav', form);
  let current = 0;

  const names = ['Votre entreprise', 'Votre présence actuelle', 'Ce dont vous avez besoin', 'Votre style', 'Vos coordonnées'];

  function show(n) {
    current = Math.max(0, Math.min(total - 1, n));
    stepsEl.forEach((s, i) => s.classList.toggle('is-active', i === current));
    bar.style.width = ((current + 1) / total * 100) + '%';
    meta.textContent = `Étape ${current + 1} sur ${total}`;
    title.textContent = names[current] || '';
    btnPrev.style.visibility = current === 0 ? 'hidden' : 'visible';
    btnNext.textContent = current === total - 1 ? 'Envoyer ma demande' : 'Continuer';
    if (current === total - 1) buildRecap();
    const first = $('input:not([type=hidden]):not([type=checkbox]):not([type=radio]), select, textarea', stepsEl[current]);
    if (first && window.innerWidth > 1000) first.focus({ preventScroll: true });
  }

  function validate() {
    let ok = true;
    $$('.field', stepsEl[current]).forEach(f => {
      const input = $('input, select, textarea', f);
      if (!input) return;
      let valid = true;
      if (input.required && !input.value.trim()) valid = false;
      if (valid && input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) valid = false;
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    // groupes radio obligatoires
    $$('[data-required-group]', stepsEl[current]).forEach(g => {
      const any = $$('input:checked', g).length > 0;
      g.classList.toggle('invalid', !any);
      const err = $('.err', g);
      if (err) err.style.display = any ? 'none' : 'block';
      if (!any) ok = false;
    });
    return ok;
  }

  function val(name) {
    const els = $$(`[name="${name}"]`, form);
    if (!els.length) return '';
    if (els[0].type === 'checkbox') return els.filter(e => e.checked).map(e => e.value).join(', ');
    if (els[0].type === 'radio') { const c = els.find(e => e.checked); return c ? c.value : ''; }
    return els[0].value.trim();
  }

  function buildRecap() {
    const r = $('#recap');
    if (!r) return;
    const rows = [
      ['Entreprise', val('entreprise')],
      ['Secteur', val('secteur')],
      ['Ville', [val('ville'), val('pays')].filter(Boolean).join(', ')],
      ['Présence', val('presence')],
      ['Besoins', val('services')],
      ['Ton', val('ton')]
    ].filter(x => x[1]);
    r.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${escapeHtml(v)}</b></div>`).join('');
  }

  function escapeHtml(s) { return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  btnPrev.addEventListener('click', () => show(current - 1));
  btnNext.addEventListener('click', () => {
    if (!validate()) {
      const bad = $('.invalid', stepsEl[current]);
      if (bad) bad.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      return;
    }
    if (current < total - 1) { show(current + 1); form.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }); }
    else submit();
  });
  form.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); btnNext.click(); }
  });
  // on retire le message d'erreur dès que la personne corrige
  form.addEventListener('input', e => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });
  form.addEventListener('change', e => { const g = e.target.closest('[data-required-group]'); if (g) { g.classList.remove('invalid'); const err = $('.err', g); if (err) err.style.display = 'none'; } });

  function whatsappText() {
    const lines = [
      `Bonjour Digilago, je souhaite une première version pour ${val('entreprise')}.`,
      `Secteur : ${val('secteur')}`,
      `Ville : ${[val('ville'), val('pays')].filter(Boolean).join(', ')}`,
      `Présence actuelle : ${val('presence')}`,
      `Besoins : ${val('services')}`,
      `Contact : ${val('nom')} — ${val('telephone')}`
    ];
    return encodeURIComponent(lines.join('\n'));
  }

  async function submit() {
    btnNext.disabled = true;
    btnNext.textContent = 'Envoi…';
    const data = new FormData(form);
    // Netlify attend un champ par nom : on fusionne les cases cochées
    ['services', 'fonctionnalites'].forEach(n => { const v = val(n); data.delete(n); data.set(n, v); });
    data.set('form-name', 'projet');
    let sent = false;
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      sent = res.ok;
    } catch (_) { sent = false; }

    const wa = $('#waLink');
    if (wa) wa.href = wa.dataset.base + '?text=' + whatsappText();
    const doneTitle = $('#wzDone h3');
    if (doneTitle) doneTitle.textContent = sent ? 'Bien reçu.' : 'Presque envoyé.';
    const note = $('#doneNote');
    if (note) {
      note.textContent = sent
        ? `Merci ${val('nom')}. On étudie ${val('entreprise')} et vous recevez le lien de votre première version sous 72 heures ouvrées.`
        : `Le serveur n'a pas pu enregistrer la demande (c'est normal si vous testez le site hors ligne). Envoyez-la en un clic sur WhatsApp, nous avons pré-rempli le message.`;
    }
    $('.wz-head', form).style.display = 'none';
    $('.wz-body', form).style.display = 'none';
    nav.style.display = 'none';
    done.classList.add('is-active');
    done.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  }

  // pré-remplissage depuis le hero ("Nom de votre entreprise")
  const quick = $('#quickName');
  const quickBtn = $('#quickGo');
  if (quick && quickBtn) {
    quickBtn.addEventListener('click', e => {
      e.preventDefault();
      const target = $('[name="entreprise"]', form);
      if (target && quick.value.trim()) target.value = quick.value.trim();
      $('#demarrer').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  show(0);
})();
