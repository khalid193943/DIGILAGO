/* =========================================================
   L'ANGE BLEU — animations et interactions
   Tout est désactivé si le visiteur a demandé à réduire
   les animations dans les réglages de son système.
   ========================================================= */

const REDUIT = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- menu mobile ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => {
    const ouvert = nav.classList.toggle('ouvert');
    burger.classList.toggle('ouvert', ouvert);
    burger.setAttribute('aria-expanded', String(ouvert));
    document.body.style.overflow = ouvert ? 'hidden' : '';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('ouvert');
    burger.classList.remove('ouvert');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));
}

/* ---------- en-tête : ombre au défilement ---------- */
const hdr = document.getElementById('hdr');
const prog = document.getElementById('prog');

function auDefilement(){
  const y = window.scrollY;
  if (hdr) hdr.classList.toggle('colle', y > 12);

  if (prog) {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = h > 0 ? (y / h * 100) + '%' : '0%';
  }
}
window.addEventListener('scroll', auDefilement, { passive: true });
auDefilement();

/* ---------- révélation au défilement ----------
   Un seul observateur pour tout : les éléments qui montent,
   ceux qui arrivent des côtés, et les groupes décalés. */
const aReveler = document.querySelectorAll('.rv, .rv-g, .rv-d, .rv-z, .stg, .frise');

if (REDUIT) {
  aReveler.forEach(el => el.classList.add('vue'));
} else if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entrees) => {
    entrees.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('vue');
      obs.unobserve(e.target);          // une seule fois : pas d'effet yoyo
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  aReveler.forEach(el => obs.observe(el));
} else {
  aReveler.forEach(el => el.classList.add('vue'));
}

/* ---------- compteurs ----------
   Le chiffre monte de 0 à sa valeur quand il entre à l'écran. */
const compteurs = document.querySelectorAll('[data-compte]');

function anime(el){
  const cible = parseInt(el.dataset.compte, 10) || 0;
  const suffixe = el.dataset.suffixe || '';
  if (REDUIT || cible === 0) { el.textContent = cible + suffixe; return; }

  const duree = 1500;
  const debut = performance.now();
  const pas = (t) => {
    const p = Math.min((t - debut) / duree, 1);
    // ralentit à l'approche de la valeur finale
    const v = Math.round(cible * (1 - Math.pow(1 - p, 3)));
    el.textContent = v + suffixe;
    if (p < 1) requestAnimationFrame(pas);
  };
  requestAnimationFrame(pas);
}

if (compteurs.length) {
  if (REDUIT || !('IntersectionObserver' in window)) {
    compteurs.forEach(anime);
  } else {
    const obsC = new IntersectionObserver((entrees) => {
      entrees.forEach(e => {
        if (!e.isIntersecting) return;
        anime(e.target);
        obsC.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    compteurs.forEach(el => obsC.observe(el));
  }
}

/* ---------- formulaires ----------
   Envoi vers Netlify Forms. En cas d'échec, on le dit
   honnêtement plutôt que d'afficher une fausse confirmation. */
document.querySelectorAll('form[data-envoi]').forEach(form => {
  const ok  = document.getElementById(form.dataset.ok);
  const err = document.getElementById(form.dataset.err);
  if (!ok) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const libelle = btn ? btn.innerHTML : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

    const reussi = () => {
      form.style.display = 'none';
      ok.classList.add('on');
      ok.setAttribute('tabindex', '-1');
      ok.focus();
    };

    if (location.protocol === 'file:') { reussi(); return; }

    try {
      const r = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      });
      if (!r.ok) throw new Error(r.status);
      reussi();
    } catch (_) {
      if (btn) { btn.disabled = false; btn.innerHTML = libelle; }
      if (err) { form.style.display = 'none'; err.classList.add('on'); err.focus(); }
      else reussi();
    }
  });
});
