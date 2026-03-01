import { useState } from "react";
import type { AppRoute } from "../utils/types";
import { initialData, type AppData } from "../data/accountData";
import Accueil from "../pages/Accueil";
import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import Transactions from "../pages/Transactions";
import Dividends from "../pages/Dividends";
import Goals from "../pages/Goals";
import Analysis from "../pages/Analysis";
import Simulation from "../pages/Simulation";
import Reports from "../pages/Reports";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";

type Props = {
  initial?: AppRoute;
  onRouteChange?: (r: AppRoute) => void;
};

export default function AppNavigator({ initial = "accueil", onRouteChange }: Props) {
  const [route, setRoute] = useState<AppRoute>(initial);
  const [data, setData] = useState<AppData>(initialData);

  const navigate = (r: AppRoute) => {
    setRoute(r);
    onRouteChange?.(r);
  };

  // Dashboard.setPage expects (page: string) — cast to satisfy both types
  const navigateFromDashboard = (page: string) => navigate(page as AppRoute);

  const renderPage = () => {
    switch (route) {
      case "accueil":       return <Accueil />;
      case "dashboard":     return <Dashboard data={data} setPage={navigateFromDashboard} />;
      case "portfolio":     return <Portfolio data={data} setData={setData} />;
      case "transactions":  return <Transactions data={data} setData={setData} />;
      case "dividends":     return <Dividends data={data} setData={setData} />;
      case "goals":         return <Goals data={data} setData={setData} />;
      case "analysis":      return <Analysis data={data} />;
      case "simulation":    return <Simulation data={data} />;
      case "reports":       return <Reports data={data} />;
      case "profile":       return <Profile data={data} setData={setData} />;
      case "settings":      return <Settings data={data} setData={setData} />;
      default:              return <Accueil />;
    }
  };

  return (
    <div style={{ minHeight: "100%" }}>
      {renderPage()}

      {/* Boutons de navigation visibles en développement uniquement */}
      {import.meta.env.DEV && (
        <div style={{ position: "fixed", right: 12, bottom: 12, display: "flex", gap: 8, zIndex: 9999 }}>
          <button onClick={() => navigate("dashboard")}>Dashboard</button>
          <button onClick={() => navigate("portfolio")}>Portfolio</button>
          <button onClick={() => navigate("profile")}>Profile</button>
          <button onClick={() => navigate("settings")}>Settings</button>
        </div>
      )}
    </div>
  );
}