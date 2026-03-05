// ── src/navigation/AppNavigator.tsx ──────────────────────────────────────────
// NOTE : Ce navigateur standalone n'est plus utilisé dans le flux principal.
// Le rendu des pages est géré directement par App.tsx via RootNavigator.
// Conservé uniquement pour d'éventuels tests isolés de pages.

import { useState } from "react";
import type { AppRoute } from "../utils/types";
import { initialData, type AppData } from "../data/accountData";
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

export default function AppNavigator({ initial = "dashboard", onRouteChange }: Props) {
  const [route, setRoute] = useState<AppRoute>(initial);
  const [data, setData]   = useState<AppData>(initialData);

  const navigate = (r: AppRoute) => {
    setRoute(r);
    onRouteChange?.(r);
  };

  const renderPage = () => {
    switch (route) {
      case "dashboard":    return <Dashboard    data={data} setPage={r => navigate(r as AppRoute)} />;
      case "portfolio":    return <Portfolio    data={data} setData={setData} />;
      case "transactions": return <Transactions data={data} setData={setData} />;
      case "dividends":    return <Dividends    data={data} setData={setData} />;
      case "goals":        return <Goals        data={data} setData={setData} />;
      case "analysis":     return <Analysis     data={data} />;
      case "simulation":   return <Simulation   data={data} />;
      case "reports":      return <Reports      data={data} />;
      case "profile":      return <Profile      data={data} setData={setData} />;
      case "settings":     return <Settings     data={data} setData={setData} />;
      default:             return <Dashboard    data={data} setPage={r => navigate(r as AppRoute)} />;
    }
  };

  return <div style={{ minHeight: "100%" }}>{renderPage()}</div>;
}