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
Mot de passe : 0ms29+Y#g@m0s#M_
```

⚠️ Cette adresse n'est **volontairement liée nulle part** sur le site public — gardez-la de côté. Le mot de passe n'est pas stocké en clair dans le code (juste son empreinte), donc si vous le perdez, il faudra m'en demander un nouveau plutôt que de le retrouver dans les fichiers.

Un site 100% statique ne peut pas faire de vraie authentification serveur : ce login est un frein sérieux contre les visiteurs occasionnels, **pas un coffre-fort**. N'y faites jamais transiter d'informations extrêmement sensibles (mots de passe bancaires, etc.).

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

## 🔌 Brancher vos données réelles (3 formulaires Google)

Le site utilise le même principe partout : un **Google Form gratuit** (vous le créez, sans code) relié automatiquement à un **Google Sheet**, que la console admin lit. Trois formulaires distincts, un par source de données.

### 1️⃣ Messages (contact.html → onglet "Messages")

Créez un Google Form avec ces champs, dans cet ordre :
`Votre nom` · `Nom de l'entreprise` · `Secteur d'activité` (liste) · `Téléphone / WhatsApp` · `Email` · `Page Facebook ou site actuel` · `Quelque chose à préciser`

### 2️⃣ Projets (demarrer.html → onglet "Projets")

Créez un 2ᵉ Google Form avec ces champs :
`Nom de votre entreprise` · `Votre nom` · `Secteur d'activité` · `Où en êtes-vous en ligne aujourd'hui ?` (QCM : *Oui, on a un site web* / *Une page Facebook ou LinkedIn* / *Non, aucune présence en ligne*) · `Quelle est l'adresse de votre site ?` · `Le lien de votre page` · `Email` · `Téléphone / WhatsApp` · `Quel ton pour votre marque ?` · `Qu'est-ce qui vous différencie ?` · `Des fonctionnalités en tête ?`

### 3️⃣ Analytics (suivi de pages → onglet "Analytics")

Créez un 3ᵉ Google Form, plus simple :
`Page` · `Appareil`

---

### Pour chacun des 3 formulaires, les mêmes étapes :

**A. Récupérer le lien d'envoi (pour que le site puisse y écrire)**
1. Ouvrez le formulaire en mode aperçu (icône œil 👁)
2. Menu **⋮ → "Obtenir un lien prérempli"**
3. Remplissez chaque champ avec un texte reconnaissable (ex. "NOM" dans le champ nom)
4. **"Obtenir le lien"** → copiez-le entièrement

**B. Publier la feuille de réponses (pour que la console admin puisse la lire)**
1. Onglet **Réponses** du formulaire → icône verte Sheets → créer la feuille liée
2. Dans le Sheet : **Fichier → Partager → Publier sur le web** → format **CSV** → copiez le lien

**C. Me transmettre les deux liens**, pour chacun des 3 formulaires (6 liens au total), et je branche tout — quelques minutes de mon côté.

Vous pouvez aussi le faire vous-même sans moi :
- Le lien pré-rempli (A) va dans `GOOGLE_FORM_URL` et `GOOGLE_FORM_FIELDS` en haut de `script.js` (pour les messages) ou dans `demarrer.html` (pour les projets) ou dans `script.js` (`ANALYTICS_FORM_URL`, pour le suivi de pages)
- Le lien CSV (B) se colle directement dans la console admin, via l'icône réglages de chaque onglet — pas besoin de toucher au code pour ça

**En attendant**, chaque onglet de la console affiche des exemples clairement indiqués comme tels — rien n'est cassé, le site fonctionne normalement sans ces branchements.

---

## Connecter le formulaire de `contact.html`

C'est le seul qui n'utilise pas encore le mécanisme Google Form ci-dessus. Une fois le Form #1 créé (section précédente), ouvrez `script.js`, cherchez `GOOGLE_FORM_URL` tout en haut de la section formulaire, et remplissez-le ainsi que les 7 `entry.XXXXXXXXX` dans `GOOGLE_FORM_FIELDS` juste en dessous — le lien prérempli (étape A ci-dessus) vous donne ces identifiants dans son URL.

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
