export type AuthRoute = "welcome" | "login" | "register";

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

export type RootState = {
  mode: "auth" | "app";
  entry: AuthRoute | AppRoute;
};

export type Navigator = {
  navigateToApp: (route: AppRoute) => void;
  navigateToAuth: (route: AuthRoute) => void;
};
