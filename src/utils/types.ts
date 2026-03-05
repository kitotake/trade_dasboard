// ── src/utils/types.ts ────────────────────────────────────────────────────────
// Ce fichier ne contient plus de définitions dupliquées.
// Tous les types métier sont définis dans src/data/accountData.ts.
// Ce fichier ne garde que les types de navigation.

export type AuthRoute = "welcome" | "login" | "register";

export type AppRoute =
  | "dashboard"
  | "portfolio"
  | "transactions"
  | "dividends"
  | "goals"
  | "analysis"
  | "simulation"
  | "reports"
  | "notifications"
  | "profile"
  | "settings";

export type RootState = {
  mode: "auth" | "app";
  entry: AuthRoute | AppRoute;
};

// Re-exports depuis la source unique de vérité
export type {
  Investment,
  Transaction,
  Dividend,
  Goal,
  Notification,
  Profile,
  AppSettings,
  AppData,
} from "../data/accountData";