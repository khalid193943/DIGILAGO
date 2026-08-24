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
    const url = `https://api.netlify.com/api/v1/sites/${SITE_ID}/submissions?per_page=300`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });

    if (!res.ok) {
      return json(502, { error: `L'API Netlify a répondu ${res.status}. Vérifiez le jeton d'accès.` });
    }

    const raw = await res.json();

    // on ne renvoie que le nécessaire, mis à plat
    const submissions = raw.map(s => ({
      id: s.id,
      formulaire: s.form_name || '',
      date: s.created_at || '',
      donnees: s.data || {}
    }));

    return json(200, { submissions });
  } catch (err) {
    return json(502, { error: 'Impossible de contacter l\'API Netlify : ' + err.message });
  }
};
