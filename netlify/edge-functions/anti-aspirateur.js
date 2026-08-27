/* =========================================================
   DIGILAGO — blocage des aspirateurs de site (Netlify)

   .htaccess ne fonctionne PAS sur Netlify : c'est un fichier
   Apache. Ce fichier-ci fait le même travail, à la périphérie
   du réseau Netlify, avant même que la page ne soit servie.

   ⚠️ Limite honnête : un aspirateur peut se déguiser en
   Chrome en cochant une case. Ce blocage arrête l'usage
   courant — pas quelqu'un de déterminé. Aucune technique
   au monde ne le peut, puisque le navigateur doit forcément
   recevoir le code pour afficher la page.
   ========================================================= */

const ASPIRATEURS = [
  // copieurs de site
  'httrack', 'webcopier', 'webzip', 'sitesucker', 'teleport',
  'offline explorer', 'webreaper', 'webstripper', 'webwhacker',
  'webauto', 'blackwidow', 'superbot', 'netants', 'xenu', 'zeus',
  'grabnet', 'superhttp', 'webbandit', 'websauger', 'webfetch',
  'weblesser', 'webleacher', 'sitesnagger', 'pagegrabber',

  // outils en ligne de commande
  'wget', 'curl/', 'libwww-perl', 'python-requests', 'go-http-client',
  'java/', 'okhttp', 'httpclient', 'scrapy', 'aiohttp',

  // collecteurs d'adresses
  'emailcollector', 'emailsiphon', 'emailwolf', 'extractorpro'
];

/* Les moteurs de recherche doivent passer : ils font vivre le site. */
const AUTORISES = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
  'whatsapp', 'applebot', 'petalbot', 'netlify'
];

export default async (request, context) => {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // un moteur connu passe toujours, même si son nom contient un mot bloqué
  if (AUTORISES.some(bon => ua.includes(bon))) {
    return context.next();
  }

  // user-agent vide ou dérisoire : presque toujours un script
  const vide = !ua.trim() || ua.trim().length < 8;

  if (vide || ASPIRATEURS.some(mauvais => ua.includes(mauvais))) {
    return new Response(
      "Accès refusé.\n\nCe site n'autorise pas la copie automatisée.\nPour toute demande : contact@digilago.ma",
      {
        status: 403,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-store'
        }
      }
    );
  }

  return context.next();
};

export const config = {
  path: '/*',
  // la console admin et les fonctions gardent leur propre logique
  excludedPath: ['/.netlify/*', '/robots.txt', '/sitemap.xml']
};
