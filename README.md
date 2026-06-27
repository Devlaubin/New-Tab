# New Tab (New-Tab)

Une page **New Tab** personnalisable : thème, sidebar paramètres, moteur de recherche, suggestions, notes, raccourcis, météo, compteur de recherches (via serveur Supabase), etc.

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
2. Configurer Supabase :
   - `SUPABASE_URL`
   - `SUPABASE_KEY`

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

## Configuration Supabase

Le compteur utilise une table **`searches`**.

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

## Fichiers principaux

- `index.html` : page principale + sidebar + modals
- `index.js` : logique front (thème, recherche, suggestions, compteur, etc.)
- `styles.css` : styles + mode sombre
- `server.js` : backend compteur Supabase
- `Lite/` : version “lite”

---

## Notes sur la confidentialité

- Les **recherches** sont comptées côté serveur (table Supabase `searches`).
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
