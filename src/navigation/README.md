Navigation architecture
=======================

But: ce dossier contient une proposition légère de navigators sans introduire une dépendance à `react-router`.

Fichiers
- `types.ts` — types partagés: `AuthRoute`, `AppRoute`, `RootState`, `Navigator`.
- `AuthNavigator.tsx` — navigation d'authentification: `welcome`, `login`, `register`. Gère les écrans d'auth dans `src/auth`.
- `AppNavigator.tsx` — navigation principale de l'application (accueil, dashboard, portfolio, etc.).
- `RootNavigator.tsx` — compose `AuthNavigator` et `AppNavigator` et commute selon l'état d'authentification.

But: pourquoi utiliser cette approche
- Simple à comprendre et adapter pour un prototype.
- Indépendante d'une librairie de routage; facile à migrer vers `react-router` plus tard.
- Centralise la logique de commutation d'écrans et les callbacks `onAuthSuccess` / `onRouteChange`.

Intégration
- Pour utiliser, importer `RootNavigator` et remplacer le rendu principal de `App.tsx` par:

```tsx
import RootNavigator from "./navigation/RootNavigator";

function App() {
  return <RootNavigator />;
}
```

Extensions possibles
- Remplacer la logique interne par `useReducer` ou `zustand` pour un contrôle plus fin.
- Persister l'état d'auth (localStorage / JWT) et initialiser `RootNavigator` en conséquence.
- Remplacer par `react-router` et mapper `Auth`/`App` en routes dédiées.

Notes
- Les navigateurs ici fournissent des contrôles de démonstration (buttons fixes) — retirer en production.
- Les types `AppRoute` listent les écrans existants dans `src/pages`. Ajoute ou retire selon besoin.
