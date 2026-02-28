# 🏗️ ARCHITECTURE – FinanceFlow

## Vue d'ensemble du projet

**FinanceFlow** est une application web de gestion financière personnelle construite avec **React + TypeScript**. Elle permet aux utilisateurs de suivre leurs revenus, dépenses, investissements et objectifs financiers.

### Stack Technologique
- **Framework** : React 18+
- **Langage** : TypeScript
- **Navigation** : React Router v6
- **État** : Context API + useReducer
- **Stockage** : localStorage pour la persistance locale
- **UI** : CSS Modules / Tailwind CSS
- **Graphiques** : Chart.js / Recharts
- **Devise** : EUR (€)
- **Locale** : fr-FR

---

## 📂 Structure du Projet

```
trade-dashboard/
│
├── .github/
│   ├── ARCHITECTURE.md (ce fichier)
│   ├── NAVIGATION.md
│   ├── IMPORTS_ANALYSIS.md
│   └── copilot-instructions.md
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── custom.d.ts
│   │
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── WelcomeScreen.tsx
│   │   ├── services/
│   │   │   ├── AuthService.ts
│   │   │   └── TokenManager.ts
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── types/
│   │       └── auth.types.ts
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx (composant principal)
│   │   ├── types.ts
│   │   └── README.md
│   │
│   ├── pages/
│   │   ├── Accueil.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Portfolio.tsx
│   │   ├── Transactions.tsx
│   │   ├── Dividendes.tsx
│   │   ├── Goals.tsx
│   │   ├── Analysis.tsx
│   │   ├── Simulation.tsx
│   │   ├── Reports.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   └── DetailsInvestissement.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── cards/
│   │   │   ├── TransactionCard.tsx
│   │   │   ├── InvestmentCard.tsx
│   │   │   ├── KpiCard.tsx
│   │   │   └── SummaryCard.tsx
│   │   ├── forms/
│   │   │   ├── FormField.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   └── GoalForm.tsx
│   │   ├── modals/
│   │   │   ├── Modal.tsx
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── AddTransactionModal.tsx
│   │   └── charts/
│   │       ├── ExpenseChart.tsx
│   │       ├── IncomeChart.tsx
│   │       ├── PortfolioChart.tsx
│   │       └── GoalChart.tsx
│   │
│   ├── store/
│   │   ├── context/
│   │   │   ├── DataContext.tsx
│   │   │   ├── ThemeContext.tsx
│   │   │   ├── CurrencyContext.tsx
│   │   │   └── AuthContext.tsx
│   │   ├── reducers/
│   │   │   ├── transactionReducer.ts
│   │   │   ├── portfolioReducer.ts
│   │   │   └── types.ts
│   │   └── hooks/
│   │       ├── useAuth.ts
│   │       ├── useData.ts
│   │       ├── useTheme.ts
│   │       └── useCurrency.ts
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── apiClient.ts
│   │   │   ├── endpoints.ts
│   │   │   └── types.ts
│   │   ├── storage/
│   │   │   ├── StorageService.ts
│   │   │   └── keys.ts
│   │   └── analytics/
│   │       └── AnalyticsService.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── calculations.ts
│   │   ├── dateUtils.ts
│   │   └── constants.ts
│   │
│   ├── types/
│   │   ├── index.ts
│   │   ├── models.ts
│   │   └── api.types.ts
│   │
│   ├── styles/
│   │   ├── global.scss
│   │   ├── variables.scss
│   │   ├── Accueil.module.scss
│   │   └── ...autres
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   └── data/
│       └── accountData.ts
│
├── app.json
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

---

## 🔐 Authentification & Rôles

### Types d'Utilisateurs
```typescript
enum UserRole {
  USER = "user",
  PREMIUM = "premium",
  ADMIN = "admin"
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  lastLogin: Date;
}
```

### Permissions par Rôle

| Fonctionnalité | USER | PREMIUM | ADMIN |
|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ |
| Transactions | ✅ | ✅ | ✅ |
| Portfolio | ❌ | ✅ | ✅ |
| Analyses avancées | ❌ | ✅ | ✅ |
| Rapports | ❌ | ✅ | ✅ |
| Export données | ❌ | ✅ | ✅ |
| Gestion utilisateurs | ❌ | ❌ | ✅ |

---

## 💾 Persistance des données

### localStorage Structure
```typescript
const STORAGE_KEYS = {
  USER: "financeflow:user",
  AUTH_TOKEN: "financeflow:token",
  TRANSACTIONS: "financeflow:transactions",
  PORTFOLIO: "financeflow:portfolio",
  GOALS: "financeflow:goals",
  SETTINGS: "financeflow:settings",
  THEME: "financeflow:theme"
};
```

### Service de Stockage
```typescript
// filepath: src/services/storage/StorageService.ts
export class StorageService {
  static saveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }

  static clearAll(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
```

---

## 🎨 Thème Dark / Light

### Système de Couleurs
```typescript
// filepath: src/theme/colors.ts
const lightTheme = {
  background: "#FFFFFF",
  surface: "#F5F5F5",
  primary: "#2E7D32",
  secondary: "#1976D2",
  danger: "#D32F2F",
  text: "#212121",
  textSecondary: "#757575",
  border: "#E0E0E0"
};

const darkTheme = {
  background: "#121212",
  surface: "#1E1E1E",
  primary: "#66BB6A",
  secondary: "#64B5F6",
  danger: "#EF5350",
  text: "#FFFFFF",
  textSecondary: "#BDBDBD",
  border: "#424242"
};
```

---

## 📊 Modèles de Données

### Transaction
```typescript
interface Transaction {
  id: string;
  userId: string;
  type: "income" | "expense" | "transfer";
  category: string;
  amount: number;
  description: string;
  date: Date;
}
```

### Investissement
```typescript
interface Investment {
  id: string;
  userId: string;
  name: string;
  type: "stock" | "crypto" | "etf" | "bond";
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: Date;
}
```

---

## 🔌 API Endpoints

| Méthode | Endpoint | Auth | Description |
|---------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Créer compte |
| POST | `/auth/login` | ❌ | Connexion |
| GET | `/users/me` | ✅ | Profil |
| POST | `/transactions` | ✅ | Créer transaction |
| GET | `/transactions` | ✅ | Lister |
| PUT | `/transactions/:id` | ✅ | Modifier |
| DELETE | `/transactions/:id` | ✅ | Supprimer |

---

## 🎯 Conventions

### Nommage
- **Composants** : PascalCase (Dashboard.tsx)
- **Hooks** : camelCase + "use" (useAuth.ts)
- **Services** : PascalCase + "Service" (AuthService.ts)
- **Utils** : camelCase (formatters.ts)

### Composants
```typescript
// filepath: src/components/cards/TransactionCard.tsx
interface Props {
  transaction: Transaction;
  onPress?: () => void;
}

export function TransactionCard({ transaction, onPress }: Props) {
  return (
    <div className={styles.container}>
      <span>{transaction.category}</span>
      <span>{transaction.amount.toFixed(2)} €</span>
    </div>
  );
}
```

---

## 📱 Gestion État

### Context API Pattern
```typescript
// filepath: src/store/context/DataContext.tsx
export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within DataProvider");
  }
  return context;
}
```

---

## ✅ Résumé

| Aspect | Solution |
|--------|----------|
| Framework | React 18+ |
| Langage | TypeScript strict |
| Navigation | AppNavigator (state-based) |
| État | Context API |
| Stockage | localStorage |
| Auth | JWT |
| Thème | Dark/Light |
| Devise | EUR |

---

**Version** : 1.0  
**Dernière mise à jour** : 28 février 2026