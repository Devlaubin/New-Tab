Installation rapide

- Ouvrez Chrome/Edge → Extensions → Mode développeur
- Cliquez sur "Charger l’extension non empaquetée" et sélectionnez le dossier `extension`.
- Par défaut l'extension enverra les événements à `http://localhost:3000/count`. Modifiez `background.js` si votre serveur est ailleurs.

Notes

- L'extension détecte les recherches en regardant les paramètres `q`, `query` ou `p` dans l'URL.
- Vous pouvez ajouter d'autres hôtes dans `manifest.json` si nécessaire.

Confidentialité

- L'extension envoie uniquement l'hôte (`engine`) et la chaîne de recherche (`query`) au endpoint configuré.
