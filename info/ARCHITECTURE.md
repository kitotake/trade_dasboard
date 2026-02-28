# 🏗️ ARCHITECTURE – trade-dashboard

## Vue d'ensemble du projet

**trade-dashboard** est une application web de gestion financière personnelle construite avec **React + TypeScript**. Elle permet de suivre investissements, transactions, dividendes, objectifs financiers, et inclut un assistant IA intégré.

### Stack Technologique
- **Framework** : React 19+
- **Langage** : TypeScript strict
- **Build** : Vite 7
- **Navigation** : State-based (useState dans App.tsx)
- **État** : Props drilling local — pas de Context API
- **Stockage** : localStorage (`trade-dashboard_data_v1`)
- **Graphiques** : Recharts 3
- **Styles** : SCSS global + CSS Modules
- **Devise** : EUR (€)
- **Locale** : fr-FR

---

## 📂 Structure du Projet

```
trade-dashboard/
│
├── info/
│   ├── ARCHITECTURE.md
│   ├── NAVIGATION.md
│   └── IMPORTS_ANALYSIS.md
│
├── src/
│   ├── App.tsx               ← Point d'entrée principal (layout + navigation)
│   ├── main.tsx              ← Bootstrap React (monte RootNavigator)
│   ├── custom.d.ts
│   │
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── WelcomeScreen.tsx
│   │
│   ├── navigation/
│   │   ├── RootNavigator.tsx     ← Gère auth vs app
│   │   ├── AuthNavigator.tsx     ← Flux welcome → login → register
│   │   └── AppNavigator.tsx      ← (legacy, non utilisé dans App.tsx)
│   │
│   ├── pages/
│   │   ├── Accueil.tsx           ← Stub vide (legacy)
│   │   ├── Dashboard.tsx         ← Page principale KPI + graphiques
│   │   ├── Portfolio.tsx         ← Gestion des investissements
│   │   ├── Transactions.tsx      ← Historique des transactions
│   │   ├── Dividends.tsx         ← Dividendes reçus
│   │   ├── Dividendes.tsx        ← Stub → redirige vers Dividends.tsx
│   │   ├── Goals.tsx             ← Objectifs financiers
│   │   ├── Analysis.tsx          ← Analyse / graphiques de performance
│   │   ├── Simulation.tsx        ← Simulateur d'intérêts composés
│   │   ├── Reports.tsx           ← Rapports + export CSV
│   │   ├── Notifications.tsx     ← Alertes personnalisées
│   │   ├── Profile.tsx           ← Profil utilisateur
│   │   ├── Settings.tsx          ← Paramètres + reset données
│   │   ├── AiChat.tsx            ← Assistant IA (appel API Anthropic)
│   │   ├── DetailsInvestissement.tsx ← Détail d'un investissement
│   │   └── Portefeuille.tsx      ← Stub → redirige vers Portfolio.tsx
│   │
│   ├── components/
│   │   ├── EmptyState.tsx        ← État vide réutilisable
│   │   ├── FormField.tsx         ← Wrapper label + input
│   │   ├── KpiCard.tsx           ← Carte KPI avec trend
│   │   ├── Modal.tsx             ← Modale générique
│   │   └── SummaryCard.tsx       ← Carte résumé (legacy)
│   │
│   ├── data/
│   │   └── accountData.ts        ← Types, état initial, localStorage
│   │
│   ├── utils/
│   │   ├── devCredentials.ts     ← Utilisateurs de test (login)
│   │   ├── helpers.ts            ← fmt, fmtE, pct, uid
│   │   ├── theme.ts              ← Constantes SCSS, couleurs, PAGES
│   │   └── types.ts              ← Types navigation + données (legacy)
│   │
│   └── styles/
│       ├── global.scss           ← Styles globaux, classes utilitaires
│       ├── Auth.module.scss      ← Styles login/register/welcome
│       ├── Accueil.module.scss
│       ├── SummaryCard.module.scss
│       ├── Dividendes.module.scss
│       ├── Portefeuille.module.scss
│       └── DetailsInvestissement.module.scss
│
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔐 Authentification

L'authentification est **simulée localement** — aucun backend, aucun JWT réel.

### Flux
```
RootNavigator (mode: "auth")
  → AuthNavigator
      → WelcomeScreen → LoginScreen / RegisterScreen
  → onAuthSuccess() → RootNavigator (mode: "app")
  → AppNavigator (legacy) ou App.tsx
```

### Utilisateurs de test (`src/utils/devCredentials.ts`)
| Email | Mot de passe |
|---|---|
| dev@test.com | Dev123! |
| alice@example.com | password123 |
| bob@example.com | password123 |

> ⚠️ La vérification se fait côté client dans `LoginScreen.tsx` par comparaison directe avec `TEST_USERS`.

---

## 💾 Persistance des données

Toutes les données sont stockées dans `localStorage` avec la clé :

```
trade-dashboard_data_v1
```

### Structure `AppData` (`src/data/accountData.ts`)
```typescript
interface AppData {
  investments: Investment[];
  transactions: Transaction[];
  dividends: Dividend[];
  goals: Goal[];
  notifications: Notification[];
  portfolioHistory: PortfolioHistoryItem[];
  accounts: { pea?: number; cc?: number };
  profile: Profile;
  settings: Settings;
}
```

### Fonctions clés
```typescript
loadFromStorage(): AppData     // Appelée au démarrage (initialData)
saveToStorage(data): void      // Appelée à chaque changement dans App.tsx (useEffect)
clearStorage(): void           // Réinitialisation depuis Settings.tsx
withAutoSnapshot(data): AppData // Auto-snapshot mensuel du portefeuille
```

---

## 🧭 Navigation (réelle)

La navigation principale est gérée dans **`App.tsx`** via un simple `useState<string>`.

```typescript
// App.tsx
const [page, setPage] = useState<string>("dashboard");

// Rendu conditionnel
switch (page) {
  case "dashboard":     return <Dashboard data={data} setPage={setPage} />;
  case "portfolio":     return <Portfolio data={data} setData={handleSetData} />;
  // ...
}
```

La sidebar liste toutes les pages via `PAGES` (défini dans `src/utils/theme.ts`).

### Pages disponibles
| id | Composant | Description |
|---|---|---|
| dashboard | Dashboard.tsx | KPI, graphiques, positions |
| portfolio | Portfolio.tsx | Gestion investissements |
| transactions | Transactions.tsx | Historique achats/ventes |
| dividends | Dividends.tsx | Dividendes reçus |
| goals | Goals.tsx | Objectifs financiers |
| analysis | Analysis.tsx | Performance et allocation |
| simulation | Simulation.tsx | Simulateur intérêts composés |
| reports | Reports.tsx | Rapports + export CSV |
| notifications | Notifications.tsx | Alertes personnalisées |
| profile | Profile.tsx | Profil utilisateur |
| settings | Settings.tsx | Paramètres + reset |

---

## 🤖 Assistant IA (`AiChat.tsx`)

Appel direct à l'API Anthropic depuis le frontend :

```typescript
fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    system: `Tu es un assistant financier expert. ${ctx}`,
    messages: [...]
  })
});
```

Le contexte injecté inclut : valeur totale du portefeuille, liste des positions, dividendes totaux.

---

## 📊 Modèles de Données

```typescript
interface Investment {
  id: string;
  name: string;
  ticker?: string;
  type?: string;        // Action, ETF, Obligation, SCPI, Crypto, Autre
  sector?: string;
  region?: string;
  invested?: number | string;
  current?: number | string;
  shares?: number | string;
  risk?: string;        // Faible, Moyen, Élevé
  notes?: string;
}

interface Transaction {
  id: string;
  date: string;         // YYYY-MM-DD
  type: string;         // Achat, Vente, Dividende, Dépôt, Retrait, Autre
  asset: string;
  amount?: number | string;
  shares?: number | string;
  price?: number | string;
  note?: string;
}

interface Dividend {
  id: string;
  date: string;
  company: string;
  ticker?: string;
  amount?: number | string;
  type?: string;        // Dividende, Coupon, Loyer SCPI, Intérêts, Autre
  note?: string;
}

interface Goal {
  id: string;
  name: string;
  target?: number | string;
  current?: number | string;  // Si vide = valeur totale du portefeuille
  deadline?: string;
  color?: string;
  note?: string;
}
```

---

## 🎨 Thème

Toutes les constantes de style sont dans `src/utils/theme.ts` (objet `SCSS`).
Les classes utilitaires globales (`.card`, `.btn-primary`, `.badge-*`, `.kpi-card`, `.data-table`, etc.) sont dans `src/styles/global.scss`.

```typescript
export const SCSS = {
  bgBase: "#08090D",
  bgSurface: "#0D0F17",
  accentCyan: "#6EE7F7",
  accentViolet: "#B197FC",
  accentGreen: "#34D399",
  accentAmber: "#FCD34D",
  accentRed: "#F87171",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontMono: "'JetBrains Mono', monospace",
  // ...
};
```

---

## ⚡ Utilitaires (`src/utils/helpers.ts`)

```typescript
fmt(v, dec?)   // Formate un nombre en fr-FR
fmtE(v)        // Formate en euros : "1 234,56 €"
pct(invested, current)  // Calcule la performance en %
uid()          // Génère un ID aléatoire court
```

---

**Version** : 2.0
**Dernière mise à jour** : 1 mars 2026
