copilot-instructions.md

# 🤖 COPILOT INSTRUCTIONS – FinanceFlow

## Vue Globale du Projet

**FinanceFlow** = Application web React de gestion financière personnelle.

- 📊 Dashboard 
- 💰 Suivi transactions
- 💼 Portefeuille investissements
- 📈 Analyses et graphiques
- 🎯 Objectifs financiers
- 🌓 Dark/Light mode
- 💶 Devise EUR
- 🇫🇷 Locale fr-FR

**Stack** : React 18 + TypeScript + Context API + localStorage + REST API

---

## 📂 Structure Dossiers

```
src/
├── auth/                # Authentification
├── navigation/          # Navigation routes (AppNavigator)
├── pages/              # Écrans principaux
├── components/         # Composants réutilisables
├── store/              # State management (Context)
├── services/           # Services (API, storage, analytics)
├── utils/              # Utilitaires (formatters, validators)
├── types/              # TypeScript types
├── styles/             # CSS modules
└── assets/             # Images, icônes, fonts
```

---

## 🔧 Conventions de Code

### Nommage Fichiers
- **Composants React** : PascalCase (Dashboard.tsx)
- **Hooks** : camelCase + "use" (useAuth.ts)
- **Services** : PascalCase + "Service" (AuthService.ts)
- **Utilitaires** : camelCase (formatters.ts)
- **Types** : ".types.ts" suffix (auth.types.ts)

### Nommage Variables
```typescript
// Variables utilisateur
const user: User;
const userId: string;
const userName: string;

// Variables d'état
const [isLoading, setIsLoading] = useState(false);
const [errorMessage, setErrorMessage] = useState("");
const [selectedTab, setSelectedTab] = useState("dashboard");

// Fonctions
const handleClick = () => {};
const formatCurrency = (amount: number) => {};
const calculateBalance = (transactions: Transaction[]) => {};
```

---

## 🧹 Architecture Composants

### Structure Standard d'un Composant
```typescript
// filepath: src/pages/Dashboard.tsx
import React, { useState, useEffect } from "react";
import type { Props } from "./Dashboard.types";
import { useAuth } from "../store/hooks/useAuth";
import { useData } from "../store/hooks/useData";
import KpiCard from "../components/KpiCard";
import styles from "./Dashboard.module.scss";

export default function Dashboard({
  data,
  navigate
}: Props) {
  const { user } = useAuth();
  const { transactions } = useData();
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Calculs au montage
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    const total = transactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    setBalance(total);
  };

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <KpiCard label="Solde" value={balance} />
      {/* Contenu */}
    </div>
  );
}
```

---

## 🎯 Patterns Navigation

### Pattern : Navigate Function
```typescript
// AppNavigator.tsx
const navigate = (route: AppRoute) => {
  setRoute(route);
  onRouteChange?.(route);
};

// Utilisation dans composants
<button onClick={() => navigate("dashboard")}>
  Go to Dashboard
</button>
```

### Pattern : Callbacks
```typescript
// Passer données via callback
const handleNavigate = (route: AppRoute, data?: any) => {
  navigate(route);
  if (data) setData(data);
};

// Composant Dashboard utilise
<Dashboard data={data} navigate={navigate} />
```

---

## 🪝 Hooks Personnalisés

### useAuth
```typescript
// filepath: src/store/hooks/useAuth.ts
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }
  return context;
}

// Utilisation
const { user, token, isAuthenticated, logout } = useAuth();
```

### useData
```typescript
// filepath: src/store/hooks/useData.ts
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}

// Utilisation
const { transactions, portfolio, goals } = useData();
```

### useTheme
```typescript
// filepath: src/store/hooks/useTheme.ts
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

// Utilisation
const { isDark, colors, toggleTheme } = useTheme();
```

---

## 📝 Formatters

```typescript
// filepath: src/utils/formatters.ts

// Devise
const formatted = Formatters.currency(1234.56, "EUR");
// Résultat: "1 234,56 €"

// Date
const date = Formatters.date(new Date());
// Résultat: "28 février 2026"

// Pourcentage
const percent = Formatters.percentage(45.67);
// Résultat: "45,67%"

// Catégorie
const cat = Formatters.transactionCategory("food");
// Résultat: "Alimentation"
```

---

## 🧮 Calculs Financiers

```typescript
// filepath: src/utils/calculations.ts
import { FinancialCalculations } from "../utils/calculations";

// Solde mensuel
const monthlyBalance = FinancialCalculations.calculateMonthlyBalance(
  transactions,
  1, // Février
  2026
);

// Performance portefeuille
const performance = FinancialCalculations.calculatePortfolioPerformance(
  investments
);
// { totalValue: 15000, totalGain: 2000, gainPercentage: 15.38 }

// Progression objectif
const progress = FinancialCalculations.calculateGoalProgress(goal);
// 75 (%)
```

---

## 🎨 Styling

### CSS Modules
```typescript
// Dashboard.module.scss
.container {
  padding: 16px;
  background: var(--color-background);
}

.kpiGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

// Utilisation
import styles from "./Dashboard.module.scss";

<div className={styles.container}>
  <div className={styles.kpiGrid}>
    {/* KPIs */}
  </div>
</div>
```

### Variables CSS (Theme)
```css
:root {
  /* Light theme */
  --color-background: #FFFFFF;
  --color-surface: #F5F5F5;
  --color-primary: #2E7D32;
  --color-text: #212121;
}

[data-theme="dark"] {
  --color-background: #121212;
  --color-surface: #1E1E1E;
  --color-primary: #66BB6A;
  --color-text: #FFFFFF;
}
```

---

## 💾 AsyncStorage / localStorage

```typescript
// Sauvegarder
localStorage.setItem("user", JSON.stringify(user));

// Charger
const user = JSON.parse(
  localStorage.getItem("user") || "null"
);

// Supprimer
localStorage.removeItem("user");

// Utiliser StorageService
import { StorageService } from "../services/storage/StorageService";

StorageService.saveUser(user);
const user = StorageService.getUser();
StorageService.clearAll();
```

---

## 🔐 Authentification & Rôles

### Vérification Rôle
```typescript
const user = useAuth().user;

// Navigation basée sur rôle
if (user.role === "PREMIUM" || user.role === "ADMIN") {
  // Afficher Portfolio
} else {
  // Masquer Portfolio
}
```

### Guard Routes
```typescript
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};
```

---

---

## ✅ Checklist pour Nouveaux Composants

- [ ] Créer fichier .tsx
- [ ] Ajouter interface Props
- [ ] Importer dépendances nécessaires
- [ ] Créer composant avec TypeScript strict
- [ ] Ajouter docstring export
- [ ] Créer fichier .module.scss pour styles
- [ ] Ajouter types dans types/ si complexe
- [ ] Tester avec données réelles
- [ ] Vérifier dark mode compatibility
- [ ] Documenter props complexes

---

## 🧪 Bonnes Pratiques

### 1. Immutabilité État
```typescript
// ❌ Mauvais
state.transactions.push(newTransaction);
setState(state);

// ✅ Bon
setState([...state, newTransaction]);
```

### 2. Dependencies Array
```typescript
// ❌ Mauvais
useEffect(() => {
  fetchData(searchTerm);
}); // Boucle infinie !

// ✅ Bon
useEffect(() => {
  fetchData(searchTerm);
}, [searchTerm]);
```

### 3. Cleanup functions
```typescript
// ✅ Bon
useEffect(() => {
  const timer = setTimeout(() => {
    setMessage("");
  }, 3000);

  return () => clearTimeout(timer);
}, []);
```

### 4. TypeScript Strict
```typescript
// ❌ Mauvais
const data: any = {};

// ✅ Bon
interface TransactionData {
  id: string;
  amount: number;
}
const data: TransactionData = { id: "1", amount: 100 };
```

---

## 🚀 Commandes Utiles

```bash
npm create vite@latest trade-dashboard -- --template react-ts
cd trade-dashboard
npm install
npm install sass
npm run dev
```

---

## 📚 Ressources

- React Documentation : https://react.dev
- TypeScript : https://www.typescriptlang.org
- React Context : https://react.dev/reference/react/useContext
- localStorage : https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

---

## 🎯 Règles d'Or

1. **TypeScript strict** : Pas de `any`
2. **Composants petits** : Une responsabilité
3. **Réutilisabilité** : Composants génériques
4. **Performance** : Memoization si nécessaire
5. **Accessibilité** : WCAG AA minimum
6. **Tests** : Tests unitaires pour logique
7. **Documentation** : JSDoc pour fonctions complexes
8. **Nommage clair** : Code auto-documenté

---

**Version** : 1.0  
**Dernière mise à jour** : 28 février 2026  
**Auteur** : GitHub Copilot