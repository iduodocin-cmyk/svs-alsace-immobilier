# SVS Alsace Immobilier — site vitrine

Site statique moderne de l'agence SVS Alsace Immobilier (Châtenois), reconstruit à partir du site d'origine en conservant l'ensemble des informations : 65 annonces, équipe, partenaires, honoraires, pages légales et formulaires.

## Aperçu en local

Aucune installation requise. Depuis ce dossier :

```bash
python3 -m http.server 8000
```

Puis ouvrir <http://localhost:8000>.

## Structure

- `index.html` — accueil avec recherche, sélection de biens et actualités
- `acheter.html`, `location.html`, `professionnels.html`, `vendus.html`, `loues.html` — listes filtrables
- `bien.html?id=<clé>` — fiche détaillée avec galerie
- `estimation.html`, `equipe.html`, `recommandations.html`, `recrutement.html`, `alerte.html`, `actualites.html`, `liens.html`, `honoraires.html`, `contact.html`
- `mentions-legales.html`, `confidentialite.html`, `plan-du-site.html`
- `assets/js/data.js` — contenu du site et annonces
- `assets/js/app.js` — rendu des pages, filtres, galerie et formulaires
- `assets/css/style.css` — design system
- `assets/images`, `assets/fonts` — médias et polices auto-hébergés

## Formulaires

Les formulaires ouvrent un e-mail prérempli vers `svsalsaceimmobilier@gmail.com` (aucun serveur requis).

## Avis Google

La page d'accueil affiche le badge officiel et une carte Google Maps des avis de l'agence (CID `5459822615213304715`). Aucune note ni aucun nombre d'avis n'est inventé : le contenu provient de Google Maps.

## Langues

Un sélecteur FR / EN / DE est disponible dans la barre supérieure et le menu mobile. Les versions EN et DE utilisent Google Translate (widget chargé uniquement lorsqu'une de ces langues est active, cookie `googtrans`). Le retour au français supprime le cookie.

## Hébergement

Le site est publié sur GitHub Pages : <https://iduodocin-cmyk.github.io/svs-alsace-immobilier/>
