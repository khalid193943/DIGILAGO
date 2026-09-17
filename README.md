# Digilago — site web v2 (septembre 2026)

Site statique **sans framework, sans installation** : ouvrez `index.html` dans un navigateur pour prévisualiser, ou déployez le dossier tel quel sur Netlify (configuration déjà prête).

Cette version 2 remplace l'ancien site multi-pages par **une page d'accueil longue, animée au scroll**, qui raconte d'abord la présence en ligne, puis présente toutes les spécialités de l'agence (web, mobile, e-commerce, extensions, SEO/GEO, fiche Google, publicité, branding, UI/UX, hébergement), la méthode, les démonstrations, les tarifs, l'agence, la FAQ et un **formulaire en 5 étapes** pour démarrer un projet.

---

## 📁 Contenu du dossier

| Fichier / dossier | Rôle |
|---|---|
| `index.html` | **Tout le site public** (11 sections, formulaire en étapes intégré) |
| `assets/site.css` | Design system v2 (couleurs, typographies, animations) |
| `assets/site.js` | Comportements : menu, scrollytelling, timeline, FAQ, formulaire en étapes |
| `mentions-legales.html` · `politique-confidentialite.html` · `conditions-generales.html` | Pages légales (nouveau design) |
| `merci.html` | Confirmation d'envoi (utilisée si JavaScript est désactivé) |
| `404.html` | Page d'erreur personnalisée |
| `ar/` | **Version arabe (ancien design, inchangée)** — voir « Version arabe » plus bas |
| `styles.css` · `script.js` | Anciens fichiers, **conservés uniquement pour `ar/`** — ne pas les lier ailleurs |
| `demos/angebleu/` | Démonstration complète « école privée », liée depuis la section Réalisations |
| `admin-console-89898zzx.html` | Console privée (messages reçus) — inchangée |
| `netlify/` · `netlify.toml` | Fonctions serveur, en-têtes de sécurité, **redirections des anciennes pages** |
| `robots.txt` · `sitemap.xml` · `og-image.png` | SEO et partage social |

Les anciennes pages (`pourquoi`, `services`, `realisations`, `tarifs`, `a-propos`, `contact`, `demarrer`) **n'existent plus** : leur contenu est intégré à l'accueil et `netlify.toml` redirige chaque ancienne adresse vers la bonne section (`/services.html` → `/#services`, etc.). Elles restent disponibles dans l'historique Git si besoin.

---

## 🎨 Le design en deux mots

- **Typographies** : Bricolage Grotesque (titres) + Plus Jakarta Sans (texte), chargées depuis Google Fonts.
- **Couleurs** (bloc `:root` en haut de `assets/site.css`) : `--paper` (fond), `--ink` (encre / sections sombres), `--sun` (jaune Digilago), `--lagune` (bleu-vert secondaire).
- **Animations liées au scroll** :
  - *Hero* : la recherche Google se « tape » et les résultats apparaissent — une seule fois au chargement.
  - *Présence en ligne* : téléphone collant (sticky) qui se transforme à chaque étape du texte (invisible → fiche Google → site → avis → recommandé par l'IA). Sur mobile, le téléphone reste en haut et le texte de l'étape active s'affiche dessous.
  - *Services* : trois grandes cartes qui s'empilent en défilant (encre, lagune, soleil).
  - *Méthode* : la ligne de la frise se dessine et les numéros se colorent au fur et à mesure.
- `prefers-reduced-motion` est respecté : tout devient statique pour les personnes qui désactivent les animations.

---

## 📨 Le formulaire en 5 étapes

Section `#demarrer`, formulaire Netlify nommé **`projet`** (même nom qu'avant : votre console admin continue de fonctionner). Étapes : entreprise → présence actuelle → besoins → style → coordonnées, avec récapitulatif avant envoi.

Champs envoyés : `entreprise, secteur, ville, pays, presence, lien_social, probleme, services, fonctionnalites, budget, ton, unique, domaine, nom, telephone, email`.

- Envoi en arrière-plan (sans rechargement). Si l'envoi échoue (test hors ligne, par exemple), un bouton WhatsApp **pré-rempli avec le récapitulatif** est proposé.
- Sans JavaScript, le formulaire s'envoie de façon classique vers `merci.html`.
- ⚠️ Sur Netlify, **Site configuration → Forms → Enable form detection** doit être activé, puis redéployer (sinon rien n'est enregistré). Vous devez voir les formulaires `projet` et `contact` dans l'onglet Forms.

---

## ⚡ Mise en ligne (Netlify)

1. Poussez ce dossier sur GitHub, connectez le dépôt à Netlify (ou glissez-déposez le dossier sur app.netlify.com/drop).
2. **Forms → Enable form detection**, puis **Deploys → Trigger deploy**.
3. Variables d'environnement pour la console admin : `ADMIN_PASSWORD` et `NETLIFY_ACCESS_TOKEN` (voir `netlify/functions/submissions.js`), puis redéployer.
4. **Forms → projet → Form notifications** : recevoir un email à chaque demande.
5. Après la mise en ligne : soumettre `https://digilago.ma/sitemap.xml` dans Google Search Console.

---

## ⚠️ À remplacer avant la mise en ligne

Recherche-remplacement dans `index.html`, `merci.html`, les pages légales **et** `ar/` :

Les coordonnées réelles sont déjà en place : +212 649 953 813 (appel et WhatsApp), contact@digilago.ma, devis@digilago.ma, khalid@digilago.ma (commercial), page Facebook.

Dans `mentions-legales.html`, complétez les champs surlignés en jaune `[à compléter]` (forme juridique, adresse, ICE, RC, hébergeur, directeur de publication).

Vérifiez les **délais annoncés** (première version sous **72 h ouvrées**, devis sous 48 h) et le **prix** (5 999 MAD) : n'annoncez que ce que vous pouvez tenir. Ajoutez vos réseaux sociaux dans `sameAs` (JSON-LD en haut de `index.html`) et dans le pied de page quand vous les aurez.

---

## 🇲🇦 Version arabe

Le dossier `ar/` est l'**ancienne version** (design v1, pages séparées). Elle fonctionne toujours et reste liée depuis le bouton « العربية ». Deux options :

1. La garder telle quelle pour l'instant (rien à faire).
2. La refaire sur le modèle de `index.html` : copier `index.html` dans `ar/index.html`, traduire, ajouter `dir="rtl"` sur `<html>` et une police arabe (Tajawal, déjà utilisée dans l'ancienne version). Ensuite supprimer `styles.css` et `script.js` à la racine.

---

## 🔎 SEO / GEO déjà en place

- Données structurées JSON-LD : `ProfessionalService`, `FAQPage` (7 questions), `WebSite`.
- Open Graph + Twitter Card, `hreflang` fr/ar, `canonical`, `sitemap.xml`, `robots.txt`.
- Les robots des assistants IA **ne sont plus bloqués** dans `robots.txt` : le site vend la visibilité dans les IA, il doit pouvoir être lu et cité.
- Une seule requête image (aucune photo lourde), polices avec `display=swap`, CSS/JS en un fichier chacun.

Pour aller plus loin : ajoutez de vraies photos compressées (moins de 200 Ko) et remplacez les compositions des cartes « Réalisations » par des captures de vos démos.
