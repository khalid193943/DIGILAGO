# Digilago — Site web complet

Site statique, **12 pages**, optimisé SEO/performance. Aucun framework, aucune installation : ouvrez `index.html` dans un navigateur pour prévisualiser, ou envoyez tout le dossier chez un hébergeur pour publier.

---

## 🔍 SEO & performance — ce qui a été fait

**Fichiers techniques**
- `robots.txt` — autorise l'indexation, bloque la console admin, référence le sitemap
- `sitemap.xml` — les 10 pages publiques, avec priorité et fréquence de mise à jour
- `404.html` — page d'erreur personnalisée, dans le même design
- `og-image.png` — vignette de partage (WhatsApp, Facebook, LinkedIn)

**Données structurées (Schema.org / JSON-LD)** — sur chaque page
- `ProfessionalService` — identité de l'entreprise, adresse, zone desservie, gamme de prix
- `FAQPage` — sur les 4 pages qui ont une FAQ (accueil, services, tarifs, contact) : vos questions/réponses peuvent apparaître directement dans les résultats Google
- `BreadcrumbList` — fil d'Ariane structuré sur toutes les pages internes
- `WebSite` — sur l'accueil

Ces données servent autant le référencement classique (Google) que les moteurs conversationnels (ChatGPT, Perplexity) qui s'appuient de plus en plus sur ce type de balisage pour citer une source — c'est le volet **GEO** demandé.

**Réseaux sociaux** — Open Graph et Twitter Card complets sur les 10 pages publiques (titre, description, image, URL) — un lien partagé sur WhatsApp ou Facebook affiche maintenant une vraie vignette.

**Nettoyage du code**
- 5 classes CSS mortes retirées (jamais utilisées nulle part) — `.sh`, `.g4`, `.olive-text`, `.sun-text`, `.rv-l`/`.rv-r`
- Un poids de police inutilisé retiré du chargement Google Fonts (300 n'était utilisé nulle part)
- **Hiérarchie des titres corrigée sur tout le site** : plusieurs endroits sautaient un niveau (h2 → h4 direct, ou h1 → h3 direct) — c'est un vrai critère d'accessibilité et de SEO. Corrigé partout, avec des titres invisibles à l'écran mais lisibles par Google et les lecteurs d'écran là où c'était nécessaire (`realisations.html`, `tarifs.html`)
- `lang="fr-MA"` (au lieu de `fr` générique) pour mieux cibler le français marocain

**Ce qui était déjà bon** avant cette passe : carte en chargement différé (`loading="lazy"`), police avec `font-display:swap` (pas de texte invisible pendant le chargement), aucune image lourde (tout est en SVG intégré, donc aucune requête image à charger).

### ⚠️ Sur le score "100%" — soyons honnêtes

Le code est maintenant optimisé au maximum de ce qui est sous mon contrôle. Mais le score Lighthouse/PageSpeed dépend aussi de facteurs **liés à l'hébergement**, hors de portée du code lui-même :
- Le temps de réponse du serveur (un hébergement mutualisé lent plafonne le score Performance, quel que soit le code)
- La compression Gzip/Brotli (active par défaut chez la plupart des hébergeurs — vérifiez-le)
- Le certificat SSL et le support HTTP/2
- Si vous ajoutez de vraies photos plus tard : compressez-les avant (TinyPNG), sinon elles feront chuter le score Performance

Avec un hébergement correct (LWS, Hostinger, o2switch en HTTP/2 + SSL), viser 95-100 sur Performance, SEO et Bonnes pratiques est réaliste. Le score Accessibilité devrait déjà être excellent grâce aux corrections de hiérarchie de titres.

**Après la mise en ligne : soumettez `sitemap.xml` dans Google Search Console** (Sitemaps → coller `https://digilago.ma/sitemap.xml`) pour accélérer l'indexation.

---

## 📁 Contenu du dossier

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil |
| `pourquoi.html` | Pourquoi un site web |
| `services.html` | 9 services web détaillés + capacités étendues (apps, jeux, Shopify...) |
| `realisations.html` | Exemples par secteur + fonctionnalités additionnelles |
| `tarifs.html` | Formules, comparatif, étapes de paiement |
| `a-propos.html` | Histoire, engagements, feuille de route |
| `contact.html` | Contact général (question simple) |
| **`demarrer.html`** | **Parcours guidé en 5 étapes pour qualifier une demande de démo** — c'est ici que pointent tous les boutons "Ma démo gratuite" |
| `mentions-legales.html` | Mentions légales |
| `politique-confidentialite.html` | Politique de confidentialité |
| `404.html` | Page d'erreur personnalisée |
| **`admin-console-89898zzx.html`** | **Console privée** — messages, projets, analytics |
| `conditions-generales.html` | Conditions générales de vente |
| `.htaccess` | Configuration serveur **Apache uniquement** (ignoré par Netlify) |
| `netlify.toml` | Configuration Netlify (redirections, en-têtes, fonctions) |
| `netlify/functions/submissions.js` | Fonction serveur qui alimente la console admin |
| `robots.txt` | Instructions pour les robots d'indexation |
| `sitemap.xml` | Plan du site pour Google Search Console |
| `og-image.png` | Vignette de partage sur les réseaux sociaux |
| `styles.css` | Tout le design system |
| `script.js` | Comportements partagés sur toutes les pages |

---

## 🔑 Votre console admin

```
Adresse   : votredomaine.ma/admin-console-89898zzx.html
Email     : khalid.lagouiti93@gmail.com
Mot de passe : celui que vous définissez dans la variable ADMIN_PASSWORD sur Netlify
```

Le mot de passe **n'est pas dans les fichiers du site** — c'est vous qui le choisissez dans les variables d'environnement Netlify (voir plus bas). Vous pouvez le changer à tout moment sans retoucher au code.

⚠️ Cette adresse n'est **volontairement liée nulle part** sur le site public — gardez-la de côté. Le mot de passe n'est pas stocké en clair dans le code (juste son empreinte), donc si vous le perdez, il faudra m'en demander un nouveau plutôt que de le retrouver dans les fichiers.

Depuis l'ajout de la fonction serveur Netlify, c'est une **vraie authentification** : le mot de passe est vérifié côté serveur et n'apparaît jamais dans le code envoyé au navigateur.

---

## ⚠️ À REMPLACER AVANT LA MISE EN LIGNE

Recherche-remplacement dans **tous les fichiers .html** :

| Chercher | Remplacer par |
|---|---|
| `+212 6XX-XXXXXX` | Votre vrai numéro |
| `2126XXXXXXXX` | Votre numéro format WhatsApp (sans + ni 0 initial) |
| `contact@digilago.ma` | Votre email si différent |

Dans **`mentions-legales.html`**, complétez les champs `[à compléter]` : forme juridique, adresse complète, ICE, RC, nom de l'hébergeur, directeur de publication. Ce sont des mentions légalement obligatoires au Maroc.

Vérifiez aussi les **prix** (`tarifs.html`, `index.html`) et les **délais annoncés** (48h, 5 jours, 8h de réponse...). N'annoncez que ce que vous pouvez tenir.

---

## 🔌 Comment les demandes arrivent dans votre console

**C'est déjà branché, entièrement automatique.** Aucun Google Form, aucun fichier à connecter.

Le site utilise **Netlify Forms** (inclus, gratuit) : chaque envoi depuis `contact.html` ou `demarrer.html` est capturé par Netlify, puis affiché dans votre console admin. Rien à faire de votre côté après la mise en ligne.

### Les 3 étapes de configuration (une seule fois, 5 minutes)

**1. Publier le site sur Netlify**
Glissez-déposez le dossier sur [app.netlify.com/drop](https://app.netlify.com/drop), ou connectez votre dépôt Git. Netlify détecte automatiquement les deux formulaires (`contact` et `projet`).

**2. Créer un jeton d'accès Netlify**
- En haut à droite de Netlify : **User settings → Applications → Personal access tokens**
- **New access token**, donnez-lui un nom (ex. « Console Digilago »), copiez le jeton
- ⚠️ Il ne s'affiche qu'une fois — copiez-le tout de suite

**3. Ajouter les deux variables d'environnement**
Sur votre site : **Site configuration → Environment variables → Add a variable**

| Nom | Valeur |
|---|---|
| `ADMIN_PASSWORD` | Votre mot de passe de console |
| `NETLIFY_ACCESS_TOKEN` | Le jeton copié à l'étape 2 |

Puis **redéployez** le site (Deploys → Trigger deploy) pour que les variables soient prises en compte.

C'est tout. Votre console affiche désormais les vraies demandes.

### Pourquoi c'est vraiment sécurisé maintenant

Le mot de passe **n'est plus dans le code du site**. Il vit dans une variable d'environnement Netlify, et la vérification se fait sur leurs serveurs, dans `netlify/functions/submissions.js`. Un visiteur qui inspecte le code source ne trouve rien.

C'est la différence avec la version précédente : c'est maintenant une **vraie authentification serveur**, pas un simple frein.

### Recevoir un email à chaque demande

Dans Netlify : **Forms → [votre formulaire] → Settings → Form notifications → Add notification → Email notification**. Vous recevez un email dès qu'une demande arrive.

### Limites du plan gratuit Netlify

100 soumissions de formulaire par mois. Au-delà, il faut passer au plan payant (19 $/mois) ou lever le plafond. Pour un démarrage, 100 demandes par mois est largement suffisant.

### Tester en local

Si vous ouvrez `admin-console-89898zzx.html` directement depuis votre disque (double-clic), la console affiche des **données d'exemple** clairement signalées — pratique pour voir l'interface sans être connecté. Les vraies données n'apparaissent que sur le site publié.

---

## Remplacer les emplacements photo

**L'image du hero (accueil)** est hébergée sur **Cloudinary** (chargement rapide via leur réseau, rien à envoyer avec le site). Elle est référencée directement dans `index.html`.

Une copie locale est conservée dans `images/hero-office.jpg` en secours&nbsp;: si vous voulez héberger l'image vous-même plutôt que sur Cloudinary, remplacez simplement l'URL par `images/hero-office.jpg` dans `index.html` — une seule ligne à changer.

**Astuce performance Cloudinary** : en ajoutant `f_auto,q_auto/` juste après `/upload/` dans l'URL, Cloudinary sert automatiquement le format le plus léger (WebP/AVIF) selon le navigateur — souvent 50 à 70&nbsp;% de poids en moins. À tester chez vous avant de garder&nbsp;: si votre compte a l'option « strict transformations » activée, ces URL sont bloquées et l'image ne s'affiche plus.

- `a-propos.html` : un emplacement `.slot` est prêt — remplacez-le par une vraie image
- `realisations.html` : les visuels de secteur sont des compositions vectorielles finies (le site est présentable tel quel) — remplaçables plus tard par de vraies captures de démos, en remplaçant le `<svg>` par une image dans `.work-art`

Compressez toujours vos images avant (TinyPNG ou Squoosh), moins de 200 Ko chacune.

---

## Mettre en ligne

1. Achetez **digilago.ma** chez un registrar accrédité au Maroc
2. Prenez un hébergement mutualisé (LWS, Hostinger, o2switch)
3. Envoyez **tous les fichiers** du dossier à la racine (`public_html` ou `www`) par FTP
4. Activez le certificat **SSL** (https) — gratuit chez tous les hébergeurs
5. Testez sur un vrai téléphone

**Alternative gratuite pour tester en ligne tout de suite :** Netlify ou Cloudflare Pages — glissez-déposez le dossier, le site est en ligne en une minute.

**Note sur la carte (`contact.html`)** : c'est un `<iframe>` OpenStreetMap standard, sans clé API. Elle peut ne pas s'afficher si vous ouvrez le fichier directement depuis votre disque dans certains navigateurs stricts — c'est normal, elle fonctionne dès la mise en ligne réelle.

---

## Après la mise en ligne

- [ ] Fiche **Google Business Profile** de Digilago
- [ ] Site vérifié dans **Google Search Console**, sitemap envoyé
- [ ] Les 3 formulaires Google branchés (section ci-dessus)
- [ ] Champs `[à compléter]` de `mentions-legales.html` remplis
- [ ] Test **PageSpeed Insights** (viser plus de 85 sur mobile)
- [ ] Relecture complète des textes

---

## Modifier le design

Tout est centralisé en haut de `styles.css`, bloc `:root`. Changer une valeur met à jour tout le site.

| Variable | Rôle |
|---|---|
| `--sun` | Couleur d'accent (jaune doré) |
| `--cream` | Fond des sections alternées |
| `--ink` | Texte et blocs sombres |
| `--olive` | Couleur secondaire (eyebrows, accents) |
| `--pad` | Espacement vertical des sections |
| `--r` | Arrondi des cartes |

### Notes de design à respecter si vous continuez à modifier le site

- Les grands titres sont en **graisse 400**, pas en gras — c'est ce qui donne l'allure posée. Ne les passez pas en bold.
- Dans les `clamp()`, **toujours une espace** autour de `+` et `-` (ex. `clamp(1rem, 2rem + 3vw, 4rem)`) — sans elle, le navigateur ignore silencieusement toute la valeur.
- Deux sections consécutives de même fond doivent porter `band-follow` sur la seconde, sinon l'espacement double.
- Le carrousel (`.car`) et les cartes numérotées (`.svc-card`) sont réutilisables : copiez la structure HTML existante pour en ajouter.
