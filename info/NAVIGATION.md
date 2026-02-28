# 🗺️ NAVIGATION – trade-dashboard

## Architecture Générale

```
main.tsx
  └── RootNavigator
        ├── mode: "auth"  → AuthNavigator
        │     ├── WelcomeScreen
        │     ├── LoginScreen
        │     └── RegisterScreen
        │
        └── mode: "app"   → App.tsx  ← navigation principale
              ├── Sidebar (PAGES)
              └── renderPage() switch
```

---

## 🔄 Flux d'authentification

```
Démarrage
  ↓
RootNavigator (mode: "auth", entry: "welcome")
  ↓
WelcomeScreen → [Commencer]
  ↓
LoginScreen → vérification dans TEST_USERS
  ↓
onAuthSuccess() → setState({ mode: "app", entry: "accueil" })
  ↓
App.tsx chargé
```

> `RegisterScreen` appelle aussi `onAuthSuccess()` directement (pas de vraie création de compte).

---

## 🧭 Navigation principale (App.tsx)

La navigation dans l'application est gérée par un simple `useState` dans `App.tsx` — **pas de React Router, pas de Context**.

```typescript
const [page, setPage] = useState<string>("dashboard");

const renderPage = () => {
  switch (page) {
    case "dashboard":     return <Dashboard data={data} setPage={setPage} />;
    case "portfolio":     return <Portfolio data={data} setData={handleSetData} />;
    case "transactions":  return <Transactions data={data} setData={handleSetData} />;
    case "dividends":     return <Dividends data={data} setData={handleSetData} />;
    case "goals":         return <Goals data={data} setData={handleSetData} />;
    case "analysis":      return <Analysis data={data} />;
    case "simulation":    return <Simulation data={data} />;
    case "reports":       return <Reports data={data} />;
    case "notifications": return <Notifications data={data} setData={handleSetData} />;
    case "profile":       return <ProfilePage data={data} setData={handleSetData} />;
    case "settings":      return <Settings data={data} setData={handleSetData} />;
  }
};
```

---

## 📍 Sidebar

La sidebar liste les pages depuis `PAGES` dans `src/utils/theme.ts` :

```typescript
export const PAGES = [
  { id: "dashboard",     label: "Dashboard",    icon: "⚡" },
  { id: "portfolio",     label: "Portefeuille", icon: "📊" },
  { id: "transactions",  label: "Transactions", icon: "↕️" },
  { id: "dividends",     label: "Dividendes",   icon: "💰" },
  { id: "goals",         label: "Objectifs",    icon: "🎯" },
  { id: "analysis",      label: "Analyse",      icon: "📈" },
  { id: "simulation",    label: "Simulation",   icon: "🔬" },
  { id: "reports",       label: "Rapports",     icon: "📋" },
  { id: "notifications", label: "Notifications",icon: "🔔" },
  { id: "profile",       label: "Profil",       icon: "👤" },
  { id: "settings",      label: "Paramètres",   icon: "⚙️" },
];
```

La sidebar est **collapsible** (`sidebarOpen` state dans App.tsx) : largeur 230px ↔ 62px.

---

## 🔀 Navigation depuis les composants

Les composants reçoivent `setPage` en prop depuis App.tsx.

### Pattern standard
```typescript
// Dans App.tsx
<Dashboard data={data} setPage={setPage} />

// Dans Dashboard.tsx
<button onClick={() => setPage("portfolio")}>Voir tout →</button>
```

### Navigation vers le profil (header)
```typescript
// App.tsx — avatar cliquable
<div onClick={() => setPage("profile")}>...</div>
```

### Navigation interne à une page (Portfolio)
Portfolio gère sa propre navigation interne (liste ↔ détail) via un `useState` local :
```typescript
const [detail, setDetail] = useState<string | null>(null);

// Vue détail
if (detail) {
  return <div>...<button onClick={() => setDetail(null)}>← Retour</button></div>;
}
```

---

## 🤖 Assistant IA (AiChat)

Le chat IA est un **overlay flottant**, pas une page. Il est géré par :
```typescript
const [chatOpen, setChatOpen] = useState(false);

// Bouton header
<button onClick={() => setChatOpen(c => !c)}>🤖 Assistant IA</button>

// Rendu conditionnel en dehors du main
{chatOpen && <AiChat data={data} onClose={() => setChatOpen(false)} />}
```

---

## 📊 Tableau des routes

| id | Composant | Props reçues | Modifie data ? |
|---|---|---|---|
| dashboard | Dashboard.tsx | data, setPage | ❌ |
| portfolio | Portfolio.tsx | data, setData | ✅ |
| transactions | Transactions.tsx | data, setData | ✅ |
| dividends | Dividends.tsx | data, setData | ✅ |
| goals | Goals.tsx | data, setData | ✅ |
| analysis | Analysis.tsx | data | ❌ |
| simulation | Simulation.tsx | data | ❌ |
| reports | Reports.tsx | data | ❌ |
| notifications | Notifications.tsx | data, setData | ✅ |
| profile | Profile.tsx | data, setData | ✅ |
| settings | Settings.tsx | data, setData | ✅ |

---

## ⚠️ Fichiers legacy (ne pas supprimer)

Ces fichiers existent pour des raisons de compatibilité avec `AppNavigator.tsx` :

| Fichier | Rôle |
|---|---|
| `src/pages/Accueil.tsx` | Stub vide, requis par AppNavigator |
| `src/pages/Portefeuille.tsx` | Redirige vers Portfolio.tsx |
| `src/pages/Dividendes.tsx` | Redirige vers Dividends.tsx |
| `src/navigation/AppNavigator.tsx` | Non utilisé par App.tsx mais conservé |

---

**Version** : 2.0
**Dernière mise à jour** : 1 mars 2026
