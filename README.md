📊 Trade Dashboard
Application web développée en React (TypeScript / TSX) avec SASS permettant de centraliser, analyser et visualiser des données financières issues de comptes d’investissement (PEA, compte courant, portefeuille titres).

🚀 Vision du projet
Trade Dashboard a pour objectif de devenir une plateforme complète de gestion et d’analyse financière personnelle :

- Visualisation des investissements
- Suivi des performances
- Gestion des objectifs financiers
- Simulation de stratégies
- Analyse des risques

---

## Structure du projet

```
/trade-dashboard
 ├── src/
 │   ├── components/       # réutilisables (SummaryCard, etc.)
 │   ├── data/             # exemples de données et types
 │   ├── pages/            # pages principales (Accueil, Portefeuille, etc.)
 │   ├── styles/           # fichiers SCSS et modules
 │   ├── App.tsx
 │   └── main.tsx
 ├── public/              # assets statiques
 ├── package.json
 └── tsconfig.json
```

> Les fichiers TSX contiennent des valeurs à 0 ou des tableaux vides : à l’utilisateur de renseigner ses propres chiffres.

## Installation

```bash
npm install
npm install sass   # si ce n’est pas déjà fait
npm run dev
```

L’application démarre sur `http://localhost:3000` (par défaut).

---

## Développement rapide

- **Ajouter une page** : créer un composant dans `src/pages` et un module SCSS dans `src/styles`.
- **Données factices** : éditer `src/data/accountData.ts` pour insérer des valeurs de test.
- **Styles** : tout est en SCSS moderne. Les modules `.module.scss` garantissent un scope local.

---

N’hésitez pas à étoffer ces pages (Péa, compte courant, liste d’investissements, dividendes) et à intégrer des graphiques, import CSV/PDF, authentification, etc.