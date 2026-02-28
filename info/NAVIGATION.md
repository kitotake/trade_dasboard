# 🗺️ NAVIGATION – FinanceFlow

## Architecture Générale

```
┌────────────────────────────────────┐
│      AppNavigator (Entry)          │
│    (Gestion des routes via state)  │
└────────────┬───────────────────────┘
             │
     ┌───────┴────────┐
     │                │
Non-auth         Auth ✅
     │                │
     ▼                ▼
┌──────────┐  ┌──────────────┐
│ Auth UI  │  │ AppNavigator │
│- Login   │  │ - Pages      │
│- Register│  │ - Components │
└──────────┘  └──────────────┘
```

---

## 📱 Flux Utilisateur Complet

### 1️⃣ Non-Authentifié
```
Start
  ↓
LoginScreen / RegisterScreen
  ↓
Validation JWT
  ↓
Token sauvegardé → localStorage
  ↓
Authentifié ✅
```

### 2️⃣ Authentifié
```
Accueil (Défaut)
  ↓
┌─→ Dashboard (KPI, solde)
├─→ Portfolio (Investissements)
├─→ Transactions (Historique)
├─→ Dividendes (Revenus)
├─→ Goals (Objectifs)
├─→ Analysis (Graphiques)
├─→ Simulation (Scénarios)
├─→ Reports (Rapports)
├─→ Profile (Profil)
└─→ Settings (Paramètres)
```

---

## 🧭 Navigation AppNavigator

### Structure
```typescript
// filepath: src/navigation/types.ts
export type AppRoute =
  | "accueil"
  | "dashboard"
  | "portfolio"
  | "transactions"
  | "dividends"
  | "goals"
  | "analysis"
  | "simulation"
  | "reports"
  | "profile"
  | "settings";
```

### Composant Principal
```typescript
// filepath: src/navigation/AppNavigator.tsx
type Props = {
  initial?: AppRoute;
  onRouteChange?: (r: AppRoute) => void;
};

export default function AppNavigator({
  initial = "accueil",
  onRouteChange
}: Props) {
  const [route, setRoute] = useState<AppRoute>(initial);
  const [data, setData] = useState<any>({});

  const navigate = (r: AppRoute) => {
    setRoute(r);
    onRouteChange?.(r);
  };

  const renderPage = () => {
    switch (route) {
      case "accueil":
        return <Accueil />;
      case "dashboard":
        return <Dashboard data={data} navigate={navigate} />;
      case "portfolio":
        return <Portfolio data={data} setData={setData} />;
      // ... autres cas
      default:
        return <Accueil />;
    }
  };

  return (
    <div>
      {renderPage()}
      <BottomNavigation navigate={navigate} />
    </div>
  );
}
```

---

## 📊 Matrice de Navigation

| Source | Destination | Méthode | Props |
|--------|-------------|---------|-------|
| Accueil | Dashboard | navigate("dashboard") | - |
| Accueil | Portfolio | navigate("portfolio") | - |
| Dashboard | Transactions | navigate("transactions") | - |
| Dashboard | Analysis | navigate("analysis") | - |
| Portfolio | Details | navigate() + params | investment |
| Transactions | Details | navigate() + params | transaction |
| Profile | Settings | navigate("settings") | - |
| Settings | Profile | navigate("profile") | - |

---

## 🔄 Flux de Navigation Détaillé

### Home → Dashboard
```
Home Screen
  ↓ [Click "Dashboard"]
  ↓
AppNavigator.navigate("dashboard")
  ↓
setRoute("dashboard")
  ↓
renderPage() swtich → Dashboard
  ↓
Dashboard Component Render
```

### Dashboard → Transactions
```
Dashboard Component
  ↓ [Click "View Transactions"]
  ↓ navigate("transactions")
  ↓
AppNavigator setRoute("transactions")
  ↓
Transactions Screen Appear
```

---

## 🎯 Patterns Navigation

### Pattern 1 : Navigation Simple
```typescript
const navigate = (route: AppRoute) => {
  setRoute(route);
  onRouteChange?.(route);
};

// Utilisation
<button onClick={() => navigate("dashboard")}>
  Dashboard
</button>
```

### Pattern 2 : Navigation avec Données
```typescript
const navigateWithData = (
  route: AppRoute,
  data: any
) => {
  setRoute(route);
  setData(data);
};

// Utilisation
<button onClick={() =>
  navigateWithData("transactions", { month: 1 })
}>
  Janvier
</button>
```

### Pattern 3 : Retour à l'Accueil
```typescript
const goHome = () => {
  setRoute("accueil");
  setData({});
  onRouteChange?.("accueil");
};
```

---

## 🔐 Navigation Authentifiée

### Routes Protégées
```typescript
// Routes accessibles uniquement si authentifié
const PROTECTED_ROUTES = [
  "dashboard",
  "portfolio",
  "transactions",
  "goals",
  "analysis",
  "simulation",
  "reports",
  "profile",
  "settings"
];

// Vérification avant navigation
const navigate = (r: AppRoute) => {
  if (PROTECTED_ROUTES.includes(r) && !isAuthenticated) {
    redirect("/login");
    return;
  }
  setRoute(r);
};
```

---

## 🎨 Composants de Navigation

### BottomNavigation
```typescript
interface BottomNavigationProps {
  navigate: (route: AppRoute) => void;
  currentRoute?: AppRoute;
}

export function BottomNavigation({
  navigate,
  currentRoute
}: BottomNavigationProps) {
  return (
    <div style={{
      position: "fixed",
      right: 12,
      bottom: 12,
      display: "flex",
      gap: 8
    }}>
      <button
        onClick={() => navigate("dashboard")}
        style={{
          backgroundColor:
            currentRoute === "dashboard" ? "#2E7D32" : "#ccc"
        }}
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate("portfolio")}
        style={{
          backgroundColor:
            currentRoute === "portfolio" ? "#2E7D32" : "#ccc"
        }}
      >
        Portfolio
      </button>
      <button
        onClick={() => navigate("profile")}
      >
        Profile
      </button>
      <button
        onClick={() => navigate("settings")}
      >
        Settings
      </button>
    </div>
  );
}
```

---

## 🚨 Gestion des Erreurs de Navigation

### Guard Navigation
```typescript
const navigate = (r: AppRoute) => {
  try {
    // Validation route
    if (!VALID_ROUTES.includes(r)) {
      console.warn(`Route invalide: ${r}`);
      setRoute("accueil");
      return;
    }

    setRoute(r);
    onRouteChange?.(r);
  } catch (error) {
    console.error("Navigation error:", error);
    setRoute("accueil");
  }
};
```

---

## 📍 Niveaux de Profondeur Navigation

```
Niveau 0
└── AppNavigator

Niveau 1 (Pages)
├── Accueil
├── Dashboard
├── Portfolio
├── Transactions
├── Goals
└── ...

Niveau 2 (Détails)
├── Transaction Details
├── Investment Details
└── ...
```

---

## 🎯 Résumé Routes

| Route | Composant | Auth | Icône |
|-------|-----------|------|-------|
| accueil | Accueil | ✅ | 🏠 |
| dashboard | Dashboard | ✅ | 📊 |
| portfolio | Portfolio | ✅ | 💼 |
| transactions | Transactions | ✅ | 💰 |
| dividends | Dividendes | ✅ | 📈 |
| goals | Goals | ✅ | 🎯 |
| analysis | Analysis | ✅ | 📉 |
| simulation | Simulation | ✅ | 🔮 |
| reports | Reports | ✅ | 📄 |
| profile | Profile | ✅ | 👤 |
| settings | Settings | ✅ | ⚙️ |

---

**Version** : 1.0  
**Dernière mise à jour** : 28 février 2026