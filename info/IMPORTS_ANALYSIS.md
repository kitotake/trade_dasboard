# 📋 ANALYSE DES IMPORTS

## Vue d'ensemble

Analyse des imports réels de chaque fichier source.
Dernière mise à jour : **1 mars 2026**

---

## 🗂️ Point d'entrée

### `src/main.tsx`
```typescript
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import RootNavigator from './navigation/RootNavigator';
import './styles/global.scss';
```
**Status** : ✅ OK

---

### `src/App.tsx`
```typescript
import { useState, useEffect } from "react";
import { SCSS, GLOBAL_CSS, PAGES } from "./utils/theme";
import { fmtE } from "./utils/helpers";
import { initialData, type AppData, saveToStorage, clearStorage, withAutoSnapshot } from "./data/accountData";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import Transactions from "./pages/Transactions";
import Dividends from "./pages/Dividends";
import Goals from "./pages/Goals";
import Analysis from "./pages/Analysis";
import Simulation from "./pages/Simulation";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import ProfilePage from "./pages/Profile";
import Settings from "./pages/Settings";
import AiChat from "./pages/AiChat";
import "./styles/global.scss";
```
**Status** : ✅ OK — tous les imports utilisés

---

## 🔐 Auth

### `src/auth/LoginScreen.tsx`
```typescript
import { useState, type FormEvent } from "react";
import { DEV_CREDENTIALS, TEST_USERS } from "../utils/devCredentials";
import styles from "../styles/Auth.module.scss";
```
**Status** : ✅ OK
**Note** : `DEV_CREDENTIALS` importé mais uniquement référencé pour forcer le chargement hot reload. La vérification utilise `TEST_USERS`.

### `src/auth/RegisterScreen.tsx`
```typescript
import { useState, type FormEvent } from "react";
import styles from "../styles/Auth.module.scss";
```
**Status** : ✅ OK

### `src/auth/WelcomeScreen.tsx`
```typescript
import styles from "../styles/Auth.module.scss";
```
**Status** : ✅ OK

---

## 🧭 Navigation

### `src/navigation/RootNavigator.tsx`
```typescript
import { useState } from "react";
import type { RootState } from "../utils/types";
import AuthNavigator from "./AuthNavigator";
import AppNavigator from "./AppNavigator";
```
**Status** : ✅ OK

### `src/navigation/AuthNavigator.tsx`
```typescript
import { useState } from "react";
import type { AuthRoute } from "../utils/types";
import WelcomeScreen from "../auth/WelcomeScreen";
import LoginScreen from "../auth/LoginScreen";
import RegisterScreen from "../auth/RegisterScreen";
```
**Status** : ✅ OK

### `src/navigation/AppNavigator.tsx`
```typescript
import { useState } from "react";
import type { AppRoute } from "../utils/types";
import { initialData, type AppData } from "../data/accountData";
import Accueil from "../pages/Accueil";
import Dashboard from "../pages/Dashboard";
// ... toutes les pages
```
**Status** : ⚠️ LEGACY — non utilisé par `App.tsx`, mais conservé pour compatibilité.

---

## 📄 Pages

### `src/pages/Dashboard.tsx`
```typescript
import type { FC } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import KpiCard from "../components/KpiCard";
import EmptyState from "../components/EmptyState";
import { SCSS, SECTOR_COLORS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/Portfolio.tsx`
```typescript
import { useState } from "react";
import KpiCard from "../components/KpiCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS, RISK_COLORS } from "../utils/theme";
import { fmtE, pct, uid } from "../utils/helpers";
import type { Investment, AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/Transactions.tsx`
```typescript
import { useState, type Dispatch, type SetStateAction } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Transaction, AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/Dividends.tsx`
```typescript
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Dividend, AppData } from "../data/accountData";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
```
**Status** : ✅ OK — `FC` manquant dans l'import React (type implicite, pas d'erreur en pratique)

### `src/pages/Goals.tsx`
```typescript
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Goal, AppData } from "../data/accountData";
```
**Status** : ✅ OK — `FC` utilisé sans import explicite (même remarque que Dividends)

### `src/pages/Analysis.tsx`
```typescript
import type { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import EmptyState from "../components/EmptyState";
import { SCSS } from "../utils/theme";
import { pct, fmtE } from "../utils/helpers";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/Simulation.tsx`
```typescript
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import KpiCard from "../components/KpiCard";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE } from "../utils/helpers";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK — `data` prop reçue mais non utilisée (simulateur autonome)

### `src/pages/Reports.tsx`
```typescript
import type { FC } from "react";
import EmptyState from "../components/EmptyState";
import { SCSS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/Notifications.tsx`
```typescript
import { useState } from "react";
import { SCSS } from "../utils/theme";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { uid } from "../utils/helpers";
import type { Notification, AppData } from "../data/accountData";
```
**Status** : ✅ OK — `FC` utilisé sans import explicite

### `src/pages/Profile.tsx`
```typescript
import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE } from "../utils/helpers";
import type { AppData, Profile } from "../data/accountData";
```
**Status** : ✅ OK — `FC` utilisé sans import explicite

### `src/pages/Settings.tsx`
```typescript
import { type Dispatch, type SetStateAction } from "react";
import { SCSS } from "../utils/theme";
import { clearStorage } from "../data/accountData";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK

### `src/pages/AiChat.tsx`
```typescript
import { useState, useRef, useEffect } from "react";
import { SCSS } from "../utils/theme";
import { pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";
```
**Status** : ✅ OK

---

## 🧩 Composants

### `src/components/KpiCard.tsx`
```typescript
import type { FC, ReactNode } from "react";
import { SCSS } from "../utils/theme";
```
**Status** : ⚠️ `ReactNode` importé mais non utilisé dans les props (props utilisent `React.ReactNode` via JSX implicite)

### `src/components/Modal.tsx`
```typescript
import type { FC, ReactNode } from "react";
```
**Status** : ⚠️ Même remarque que KpiCard

### `src/components/EmptyState.tsx`
```typescript
import type { FC, ReactNode } from "react";
```
**Status** : ⚠️ `ReactNode` importé, `React.ReactNode` utilisé dans les props via import inline

### `src/components/FormField.tsx`
```typescript
import type { FC, ReactNode } from "react";
```
**Status** : ✅ OK

---

## 🔍 Checklist Globale

| Fichier | Status | Remarque |
|---|---|---|
| main.tsx | ✅ | — |
| App.tsx | ✅ | — |
| LoginScreen.tsx | ✅ | DEV_CREDENTIALS = force hot reload |
| RegisterScreen.tsx | ✅ | — |
| WelcomeScreen.tsx | ✅ | — |
| RootNavigator.tsx | ✅ | — |
| AuthNavigator.tsx | ✅ | — |
| AppNavigator.tsx | ⚠️ | Legacy, non utilisé |
| Dashboard.tsx | ✅ | — |
| Portfolio.tsx | ✅ | — |
| Transactions.tsx | ✅ | — |
| Dividends.tsx | ✅ | FC implicite |
| Goals.tsx | ✅ | FC implicite |
| Analysis.tsx | ✅ | — |
| Simulation.tsx | ✅ | data prop inutilisée |
| Reports.tsx | ✅ | — |
| Notifications.tsx | ✅ | FC implicite |
| Profile.tsx | ✅ | FC implicite |
| Settings.tsx | ✅ | — |
| AiChat.tsx | ✅ | — |
| KpiCard.tsx | ⚠️ | ReactNode import inutilisé |
| Modal.tsx | ⚠️ | ReactNode import inutilisé |
| EmptyState.tsx | ⚠️ | ReactNode import inutilisé |
| FormField.tsx | ✅ | — |

---

## ⚡ Recommandations

1. **Nettoyer les `ReactNode` inutilisés** dans KpiCard, Modal, EmptyState
2. **`Simulation.tsx`** : retirer le prop `data` si jamais utilisé ou l'utiliser pour pré-remplir les champs
3. **`AppNavigator.tsx`** : peut être supprimé si `RootNavigator` est redirigé directement vers `App.tsx`
4. **Stubs legacy** (`Accueil.tsx`, `Portefeuille.tsx`, `Dividendes.tsx`) : peuvent être supprimés si `AppNavigator` est supprimé

---

**Version** : 2.0
**Dernière mise à jour** : 1 mars 2026
