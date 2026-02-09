# Quiz React + Open Trivia DB

Application de quiz simple en React (TypeScript) consommant l'API Open Trivia DB.

Fonctionnalités principales
- Récupération de 10 questions depuis Open Trivia DB
- Choix de la difficulté (Facile / Moyen / Difficile)
- Timer par question (20s) et progression
- Sauvegarde du meilleur score dans `localStorage`
- Gestion basique des erreurs et tentative de réessai en cas de rate-limit (HTTP 429)

Technologies
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Axios

Prérequis
- Node.js (>= 16 recommandé)
- npm ou pnpm

Installation

```bash
# depuis le dossier `quiz`
npm install
```

Développement

```bash
npm run dev
# ouvrez ensuite http://localhost:5173 (ou l'URL indiquée par Vite)
```

Build de production

```bash
npm run build
npm run preview
```

Usage
- Sélectionnez la difficulté via le sélecteur.
- Répondez aux questions avant la fin du temps (20s par question).
- Le meilleur score est stocké localement dans la clé `bestScoreQuiz`.

Remarques sur l'API et le rate-limit (429)
- Open Trivia DB applique des limites de requêtes publiques. Si vous voyez des erreurs 429, l'application:
  - affiche un message d'erreur clair,
  - propose un bouton pour réessayer,
  - effectue des tentatives de réessai côté client (backoff simple) lorsque possible.
- Si le rate-limit persiste, attendez quelques minutes ou réduisez la fréquence de rafraîchissement lors du développement.

Structure du projet (fichiers importants)
- `src/components/quizCard.tsx` — composant principal du quiz
- `src/App.tsx` — point d'entrée de l'app (montage du composant)
- `src/index.css` — styles globaux / Tailwind
- `vite.config.ts` — configuration Vite
- `package.json` — scripts et dépendances

Dépannage
- Erreur CORS ou 429 : vérifier que l'API Open Trivia DB est accessible depuis votre réseau.
- Problèmes de dépendances : supprimer `node_modules` et relancer `npm install`.

Contribution
- Les Pull Requests sont bienvenues — forkez le dépôt, créez une branche et ouvrez une PR.

Licence
- MIT — faites ce que vous voulez avec le code.

Contact
- Pour questions rapides, ajoutez une issue sur le dépôt GitHub.

Bonne utilisation !
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
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
