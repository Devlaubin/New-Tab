# New Tab (New-Tab)

Copyright (C) 2026 [New-Tab]

Ce site web (et son code source) est un logiciel libre ; vous pouvez le
redistribuer et/ou le modifier selon les termes de la Licence Publique
Générale GNU telle que publiée par la Free Software Foundation ; soit
la version 3 de la licence, soit (à votre discrétion) toute version ultérieure.

Ce programme est distribué dans l'espoir qu'il sera utile, mais SANS
AUCUNE GARANTIE ; sans même la garantie implicite de COMMERCIALISATION
ou d'ADÉQUATION À UN BUT PARTICULIER. Voir la Licence Publique Générale
GNU pour plus de détails.

Vous devriez avoir reçu une copie de la Licence Publique Générale GNU
avec ce programme. Sinon, voir <https://gnu.org>.

[![Netlify Status](https://api.netlify.com/api/v1/badges/882115d8-6da4-434c-b5f7-27105e0fd60e/deploy-status)](https://app.netlify.com/projects/new-tab-devlaubin/deploys)

Une page **New Tab** personnalisable : thème, sidebar paramètres, moteur de recherche, suggestions, notes, raccourcis, météo, compteur de recherches (via serveur Neon), etc.

> Projet en HTML/CSS/JS avec un backend Node/Express pour stocker le compteur.

---

## Fonctionnalités

### Interface

- **Sidebar “Paramètres”** (ouvrable/fermeture avec un bouton burger)
- **Thème** : choix d’une couleur/gradient (modal “Choisir un thème”)
- **Mode sombre** : toggle persistant (`localStorage.themeMode`)
- **Moteur de recherche** : sélection (modal “Moteur de recherche”)
- **Recherche privée** : ouverture dans un moteur différent (modal via bouton)
- **Suggestions** : auto-complétion via Google Suggest
- **Raccourcis** : grille de raccourcis + ajout/édition/suppression
- **Notes** : sauvegarde automatique dans `localStorage.notes`
- **Météo** : récupération Wttr.in (toggle “Afficher la météo”)
- **Heure/date & salutation** : affichage en français (toggle “Afficher l’heure”)

### Compteur de recherches

- À chaque recherche, le front appelle le backend :
  - `POST /api/count`
- La sidebar affiche :
  - total (`GET /api/count`)
  - et le nombre “aujourd’hui”

### Sécurité (option)

- Option **“Renforcer la securité”** :
  - refuse certains liens non-HTTPS
  - ouvre les liens externes dans un nouvel onglet avec `noopener,noreferrer`

---

## Démarrage (développement)

### 1) Backend (Node/Express)

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Configurer Neon :

- `DATABASE_URL` : chaîne de connexion fournie par Neon

3. Lancer le serveur :
   ```bash
   node server.js
   ```

Le serveur expose :

- `GET  /api/` (message ok)
- `GET  /api/count` (lecture total + aujourd’hui)
- `POST /api/count` (incrément)

> Le front utilise `API_BASE = "/api"`.

---

## Configuration Neon

Le compteur utilise une table PostgreSQL **`searches`**. Le schéma complet, compatible Neon, se trouve dans `neon/migrations/20260701083045_create_search_queries_table.sql`.

Attendu (schéma implicite) :

- `id` (PK) : le compteur global est sur `id = 1`
- `total` : total historique
- `today_count` : compteur du jour
- `last_reset` : date ISO `YYYY-MM-DD`

Le backend crée automatiquement une ligne si elle n’existe pas, via `getCounter()`.

---

## Déploiement

Le projet est compatible Netlify (fichiers présents : `netlify.toml`).

---

## ScreenShot

![Screenshot du site internet](/images/screenshot.png)

---

## Fichiers principaux

- `index.html` : page principale + sidebar + modals
- `index.js` : logique front (thème, recherche, suggestions, compteur, etc.)
- `styles.css` : styles + mode sombre
- `server.js` : backend compteur Neon
- `Lite/` : version “lite”

---

## Notes sur la confidentialité

- Les **recherches** sont comptées côté serveur (table Neon `searches`).
- Les **notes** et préférences visuelles (ex : thème, moteur, toggles) sont stockées dans le navigateur via `localStorage`.

---

## Roadmap (à intégrer dans le futur si besoin)

- Pop-up anti-adblock (détection renforcée)
- IA pour reformulation / explications côté front (nécessite API)
- Historique de recherches + nouvelles (UI)
- Blocage/filtrage plus fin de certaines données envoyées au serveur

---

## Licence

Projet open source : voir le lien dans la sidebar (© New-Tab est open source 💙).
