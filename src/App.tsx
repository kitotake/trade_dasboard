import { useState, useEffect, useCallback } from "react";
import { SCSS, GLOBAL_CSS, PAGES } from "./utils/theme";
import { fmtE } from "./utils/helpers";
import {
  initialData,
  type AppData,
  saveToStorage,
  clearStorage,
  withAutoSnapshot,
} from "./data/accountData";
import type { Session } from "./utils/authStorage";
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

interface AppProps {
  session?: Session | null;
  onLogout?: () => void;
}

export default function App({ session, onLogout }: AppProps) {
  const [page, setPage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [data, setDataRaw] = useState<AppData>(initialData);
  const [saveIndicator, setSaveIndicator] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Pré-remplir le profil avec les infos de session si le profil est vide
  useEffect(() => {
    if (session && !data.profile?.name && session.name) {
      setDataRaw(d => ({
        ...d,
        profile: { ...d.profile, name: session.name, email: session.email },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect(() => {
    try {
      const snapshotted = withAutoSnapshot(data);
      if (snapshotted.portfolioHistory !== data.portfolioHistory) {
        setDataRaw(snapshotted);
        return;
      }
      saveToStorage(data);
      setSaveIndicator(true);
      const t = setTimeout(() => setSaveIndicator(false), 1200);
      return () => clearTimeout(t);
    } catch (err) {
      console.error("[App] Erreur lors de la sauvegarde :", err);
      setDataError("Impossible de sauvegarder les données.");
    }
  }, [data]);

  // Wrapper sécurisé autour de setData — attrape les erreurs des updaters
  const handleSetData: React.Dispatch<React.SetStateAction<AppData>> = useCallback(
    (action) => {
      try {
        setDataRaw(prev => {
          const next =
            typeof action === "function" ? action(prev) : action;

          const isReset =
            next.investments.length === 0 &&
            next.transactions.length === 0 &&
            next.dividends.length === 0 &&
            next.goals.length === 0 &&
            next.portfolioHistory.length === 0;

          if (isReset) clearStorage();
          return next;
        });
        setDataError(null);
      } catch (err) {
        console.error("[App] Erreur lors de la mise à jour des données :", err);
        setDataError("Une erreur est survenue lors de la mise à jour.");
      }
    },
    []
  );

  const notifCount = (data.notifications || []).length;
  const displayName = session?.name || data.profile?.name || null;

  const renderPage = () => {
    switch (page) {
      case "dashboard":     return <Dashboard     data={data} setPage={setPage} />;
      case "portfolio":     return <Portfolio     data={data} setData={handleSetData} />;
      case "transactions":  return <Transactions  data={data} setData={handleSetData} />;
      case "dividends":     return <Dividends     data={data} setData={handleSetData} />;
      case "goals":         return <Goals         data={data} setData={handleSetData} />;
      case "analysis":      return <Analysis      data={data} />;
      case "simulation":    return <Simulation    data={data} />;
      case "reports":       return <Reports       data={data} />;
      case "notifications": return <Notifications data={data} setData={handleSetData} />;
      case "profile":       return <ProfilePage   data={data} setData={handleSetData} />;
      case "settings":      return <Settings      data={data} setData={handleSetData} onLogout={onLogout} />;
      default: return null;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: SCSS.bgBase }}>
        {/* Ambient gradients */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -300, left: -200, width: 700, height: 700, background: `radial-gradient(circle, ${SCSS.accentCyan}06 0%, transparent 65%)` }} />
          <div style={{ position: "absolute", bottom: -200, right: -100, width: 600, height: 600, background: `radial-gradient(circle, ${SCSS.accentViolet}05 0%, transparent 65%)` }} />
        </div>

        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 230 : 62,
          background: SCSS.bgSurface,
          borderRight: `1px solid ${SCSS.borderSub}`,
          display: "flex", flexDirection: "column",
          padding: "24px 0",
          position: "fixed", top: 0, left: 0, bottom: 0,
          zIndex: 100,
          transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
          overflow: "hidden",
        }}>
          {/* Logo */}
          <div style={{ padding: "0 18px 28px", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: `linear-gradient(135deg, ${SCSS.accentCyan}, ${SCSS.accentViolet})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17,
            }}>⚡</div>
            {sidebarOpen && (
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, fontFamily: SCSS.fontDisplay }}>
                trade-dashboard
              </span>
            )}
          </div>

          {/* Portfolio total */}
          {sidebarOpen && (
            <div style={{ margin: "0 14px 22px", background: "rgba(255,255,255,0.04)", borderRadius: SCSS.radiusSm, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: SCSS.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: SCSS.fontMono }}>
                Portefeuille
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: SCSS.fontDisplay, letterSpacing: -1 }}>
                {fmtE((data.investments || []).reduce((s, i) => s + (Number(i.current) || 0), 0))}
              </div>
            </div>
          )}

          {/* Nav */}
          {PAGES.map(p => (
            <button
              key={p.id}
              className={`nav-btn ${page === p.id ? "active" : ""}`}
              onClick={() => setPage(p.id)}
            >
              <span style={{ fontSize: 19, flexShrink: 0 }}>{p.icon}</span>
              {sidebarOpen && p.label}
              {p.id === "notifications" && sidebarOpen && notifCount > 0 && (
                <span style={{ marginLeft: "auto", background: SCSS.accentRed, borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff" }}>
                  {notifCount}
                </span>
              )}
            </button>
          ))}

          {/* Save indicator */}
          {sidebarOpen && (
            <div style={{ margin: "8px 14px 0", fontSize: 11, color: saveIndicator ? SCSS.accentGreen : "transparent", transition: "color 0.3s", textAlign: "center", fontFamily: SCSS.fontMono }}>
              ✓ Sauvegardé
            </div>
          )}

          {/* Logout */}
          {onLogout && (
            <button
              className="btn-ghost"
              onClick={onLogout}
              title="Se déconnecter"
              style={{
                margin: sidebarOpen ? "8px 14px 0" : "8px auto 0",
                borderRadius: SCSS.radiusSm,
                padding: "9px 10px",
                textAlign: "center",
                fontSize: 13,
                color: SCSS.accentRed,
                borderColor: `rgba(248,113,113,0.2)`,
                width: sidebarOpen ? "calc(100% - 28px)" : 34,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {sidebarOpen ? "🚪 Déconnexion" : "🚪"}
            </button>
          )}

          {/* Collapse */}
          <button
            className="btn-ghost"
            onClick={() => setSidebarOpen(s => !s)}
            style={{ margin: "8px 14px 0", borderRadius: SCSS.radiusSm, padding: "10px", textAlign: "center", fontSize: 14 }}
          >
            {sidebarOpen ? "◀ Réduire" : "▶"}
          </button>
        </aside>

        {/* Main */}
        <main style={{
          marginLeft: sidebarOpen ? 230 : 62,
          flex: 1, padding: "32px 40px", zIndex: 1,
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "100vh",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, fontFamily: SCSS.fontDisplay, letterSpacing: -0.8 }}>
                {page === "dashboard"
                  ? `Bonjour${displayName ? ", " + displayName.split(" ")[0] : ""} 👋`
                  : PAGES.find(p => p.id === page)?.label}
              </h1>
              <div style={{ color: SCSS.textMuted, fontSize: 13, marginTop: 3 }}>
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn-primary" onClick={() => setChatOpen(c => !c)}>🤖 Assistant IA</button>
              <div
                onClick={() => setPage("profile")}
                title={displayName || session?.email || "Profil"}
                style={{
                  width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
                  background: `linear-gradient(135deg, ${SCSS.accentViolet}, ${SCSS.accentCyan})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontFamily: SCSS.fontDisplay, fontSize: 16, flexShrink: 0,
                }}
              >
                {displayName ? displayName[0].toUpperCase() : (session?.email?.[0]?.toUpperCase() ?? "?")}
              </div>
            </div>
          </div>

          {/* Bandeau d'erreur data */}
          {dataError && (
            <div style={{
              marginBottom: 16, padding: "10px 16px",
              background: "rgba(248,113,113,0.1)", border: `1px solid rgba(248,113,113,0.25)`,
              borderRadius: 10, color: SCSS.accentRed, fontSize: 13,
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              ⚠️ {dataError}
              <button
                style={{ background: "none", border: "none", color: SCSS.accentRed, cursor: "pointer", fontSize: 14 }}
                onClick={() => setDataError(null)}
              >✕</button>
            </div>
          )}

          {renderPage()}
        </main>

        {chatOpen && <AiChat data={data} onClose={() => setChatOpen(false)} />}
      </div>
    </>
  );
}