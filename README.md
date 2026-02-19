# 🌐 New Tab Page

Une page de nouvel onglet personnalisée avec horloge, barre de recherche et météo locale.

## ✨ Fonctionnalités

- **Horloge en temps réel** — affiche l'heure et la date en français
- **Barre de recherche** — recherche Google ou accès direct à une URL
- **Météo locale** — température et conditions actuelles (Chambray-lès-Tours)
- **Thèmes** — 5 dégradés de couleurs au choix (Par défaut, Océan, Coucher de soleil, Forêt, Nuit)
- **Paramètres** — possibilité de masquer l'heure et/ou la météo
- **Persistance** — les préférences sont sauvegardées dans le navigateur (localStorage)

---

## 🚀 Installation selon le navigateur

### Google Chrome

1. Installez l'extension **[Custom New Tab URL](https://chromewebstore.google.com/detail/custom-new-tab-url/mmjkeaogbplhcaoilhmklgbbomgjhkdj)** depuis le Chrome Web Store
2. Dans les paramètres de l'extension, entrez le chemin :
   ```
   https://new-tab-devlaubin.netlify.app/
   ```
3. Ouvrez un nouvel onglet — la page s'affiche automatiquement

> **Alternative :** L'extension **[New Tab Redirect](https://chromewebstore.google.com/detail/new-tab-redirect/icpgjfneehieebagbmdbhnlpiopdcmna)** fonctionne de la même façon.

---

### Mozilla Firefox

1. Installez l'extension **[New Tab Override](https://addons.mozilla.org/fr/firefox/addon/new-tab-override/)** depuis Firefox Add-ons
2. Dans les paramètres de l'extension, choisissez **"Url"**
3. Entrer le lien : https://new-tab-devlaubin.netlify.app/
4. Ouvrez un nouvel onglet pour vérifier

---

### Microsoft Edge

1. Installez l'extension **[Custom New Tab Page](https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home)** depuis le Edge Add-ons Store  
   *(cherchez "Custom New Tab" ou "New Tab Redirect")*
2. Renseignez le chemin vers le site ou le fichier local :
   ```
   [file:///C:/chemin/vers/index.html] ou (https://new-tab-devlaubin.netlify.app/)
   ```
3. Ouvrez un nouvel onglet pour confirmer

---

### Safari (macOS)

Safari ne supporte pas nativement le remplacement du nouvel onglet via extension légère. La solution recommandée est d'héberger le fichier localement via un petit serveur :

```bash
# Dans le dossier du projet
npx serve .
# ou
python3 -m http.server 8080
```

Puis dans Safari → Préférences → Général → **Page d'accueil** :
```
http://localhost:8080/index.html
```

Configurez ensuite **"Les nouveaux onglets s'ouvrent sur : Page d'accueil"**.

---

## 📁 Structure du projet

```
new-tab/
├── index.html       # Fichier principal (tout-en-un)
└── images/
    └── search.png   # Icône de l'onglet
└── autre fichiers du projet   
```

---

## ⚙️ Personnalisation

### Changer la ville de la météo

Dans `index.html`, ligne avec `wttr.in`, remplacez `Chambray-les-Tours` par votre ville :

```js
const response = await fetch('https://wttr.in/VotreVille?format=j1');
```

### Ajouter un thème

Dans le tableau `themes` en JavaScript, ajoutez une entrée :

```js
{ name: 'Mon thème', gradient: 'linear-gradient(135deg, #couleur1 0%, #couleur2 100%)' }
```

---

## 🛠️ Utilisation en local (sans extension)

Ouvrez simplement le fichier dans votre navigateur :

```
Double-clic sur index.html
```

Ou via terminal :
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

---

## 📝 Notes

- La météo utilise l'API gratuite [wttr.in](https://wttr.in) — aucune clé API requise
- Les préférences (thème, affichage) sont stockées localement dans le navigateur
- Le fichier est entièrement autonome, aucune dépendance externe à installer
