# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  # Weather App

  Application météo simple construite avec React, TypeScript et Vite.

  Ce dépôt fournit une interface pour rechercher une ville, afficher des suggestions
  via l'API de géocodage d'OpenWeather et récupérer les prévisions (forecast).

  ## Fonctionnalités

  - Recherche de ville avec suggestions (géocodage direct OpenWeather)
  - Prévisions horaires (carrousel horizontal)
  - Tuiles d'informations : vent, humidité, pression, visibilité, lever/coucher du soleil
  - Développé en TypeScript + React + Vite

  ## Prérequis

  - Node.js (version LTS recommandée)
  - Une clé API OpenWeather (gratute) — inscrivez-vous sur https://openweathermap.org

  Ajoutez la clé dans un fichier `.env` à la racine du projet avec la variable suivante :

  ```
  VITE_WEATHER_API_KEY=your_api_key_here
  ```

  ## Installation

  Clonez le dépôt puis installez les dépendances :

  ```bash
  git clone <repo-url>
  cd weather-app
  npm install
  ```
  ## Configuration du repo
  ```bash
  git remote add origin <url>
  git branch -M main
  git add .
  git commit -m "commentaire du changement"
  git push origin main
  ```
  ## Scripts utiles

  - Démarrer le serveur de développement (HMR) :

  ```bash
  npm run dev
  ```

  - Construire pour production :

  ```bash
  npm run build
  ```

  - Prévisualiser la build locale :

  ```bash
  npm run preview
  ```

  Si vous avez ESLint configuré, lancez-le avec :

  ```bash
  npm run lint
  ```

  ## Structure du projet

  - `src/` : code source React
    - `components/` : composants UI (Forecast, Tile, Search...)
    - `hooks/` : hooks personnalisés (ex : `useForcast`)
    - `helpers/` : utilitaires de formatage
    - `types/` : définitions TypeScript

  ## Utilisation

  1. Démarrez le serveur de développement : `npm run dev`
  2. Entrez une ville dans le champ de recherche (ex : "Bamako")
  3. Sélectionnez une suggestion puis cliquez sur "Rechercher"

  ## Contribuer

  Les contributions sont les bienvenues. Ouvrez une issue pour proposer des améliorations
  ou soumettez une pull request.

  ## Licence

  Ce projet est distribué sous la licence MIT — ajoutez un fichier `LICENSE` si souhaité.

  ---

  Si vous voulez que j'ajoute un badge CI, des captures d'écran ou une section de déploiement,
  dites-moi ce que vous préférez et je l'ajouterai.
