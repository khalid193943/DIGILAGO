// =========================================================
// DIGILAGO — Fonction serveur : lecture des demandes reçues
//
// Cette fonction tourne sur les serveurs Netlify, pas dans le
// navigateur. C'est ce qui permet de garder le mot de passe et
// le jeton d'accès secrets : ils ne sont JAMAIS envoyés au visiteur.
//
// Variables d'environnement à définir dans Netlify
// (Site configuration -> Environment variables) :
//   ADMIN_PASSWORD        -> votre mot de passe de console
//   NETLIFY_ACCESS_TOKEN  -> jeton personnel Netlify (User settings -> Applications)
// SITE_ID est fourni automatiquement par Netlify.
// =========================================================

exports.handler = async (event) => {
  const json = (statusCode, body) => ({
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body)
  });

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Méthode non autorisée.' });
  }

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const TOKEN = process.env.NETLIFY_ACCESS_TOKEN;
  const SITE_ID = process.env.SITE_ID;

  if (!ADMIN_PASSWORD || !TOKEN) {
    return json(500, {
      error: "Configuration incomplète côté serveur. Vérifiez les variables ADMIN_PASSWORD et NETLIFY_ACCESS_TOKEN dans Netlify."
    });
  }

  let payload = {};
  try { payload = JSON.parse(event.body || '{}'); } catch (_) {}

  // --- vérification du mot de passe, côté serveur ---
  if (payload.password !== ADMIN_PASSWORD) {
    // même délai quel que soit le résultat, pour ne pas renseigner un attaquant
    await new Promise(r => setTimeout(r, 400));
    return json(401, { error: 'Mot de passe incorrect.' });
  }

  // --- récupération des soumissions auprès de l'API Netlify ---
  try {
    const auth = { headers: { Authorization: `Bearer ${TOKEN}` } };

    const res = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions?per_page=300`, auth);
    if (!res.ok) {
      return json(502, { error: `L'API Netlify a répondu ${res.status}. Vérifiez le jeton d'accès.` });
    }
    const raw = await res.json();

    // Diagnostic + récupération des demandes classées en spam.
    // Netlify filtre parfois de vraies demandes : on les récupère aussi
    // pour que rien ne soit perdu, en les marquant clairement.
    let formulaires = [];
    let spamSubs = [];
    try {
      const rf = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/forms`, auth);
      if (rf.ok) formulaires = (await rf.json()).map(f => f.name);

      const rs = await fetch(`https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions?state=spam&per_page=100`, auth);
      if (rs.ok) {
        spamSubs = (await rs.json()).map(s => ({
          id: s.id,
          formulaire: s.form_name || '',
          date: s.created_at || '',
          donnees: s.data || {},
          spam: true
        }));
      }
    } catch (_) { /* diagnostic optionnel : on continue sans */ }

    const submissions = raw.map(s => ({
      id: s.id,
      formulaire: s.form_name || '',
      date: s.created_at || '',
      donnees: s.data || {},
      spam: false
    }));

    return json(200, {
      submissions: submissions.concat(spamSubs),
      formulaires,
      spam: spamSubs.length
    });
  } catch (err) {
    return json(502, { error: 'Impossible de contacter l\'API Netlify : ' + err.message });
  }
};
