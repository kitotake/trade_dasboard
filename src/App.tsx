import React, { useState, useEffect } from "react";
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

export default function App() {
  const [page, setPage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [data, setData] = useState<AppData>(initialData);
  const [saveIndicator, setSaveIndicator] = useState(false);

  // Persist to localStorage on every data change + auto-snapshot
  useEffect(() => {
    const snapshotted = withAutoSnapshot(data);
    // Only update state if snapshot actually changed
    if (snapshotted.portfolioHistory !== data.portfolioHistory) {
      setData(snapshotted);
      return;
    }
    saveToStorage(data);
    setSaveIndicator(true);
    const t = setTimeout(() => setSaveIndicator(false), 1200);
    return () => clearTimeout(t);
  }, [data]);

  const notifCount = (data.notifications || []).length;

  // Wrap setData to also handle reset (clear storage)
  const handleSetData: React.Dispatch<React.SetStateAction<AppData>> = (action) => {
    setData(prev => {
      const next = typeof action === "function" ? action(prev) : action;
      // Check if this is a full reset (all arrays empty)
      const isReset =
        next.investments.length === 0 &&
        next.transactions.length === 0 &&
        next.dividends.length === 0 &&
        next.goals.length === 0 &&
        next.portfolioHistory.length === 0;
      if (isReset) clearStorage();
      return next;
    });
  };

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
      default: return null;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: SCSS.bgBase }}>

        {/* Ambient blobs */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: -300, left: -200, width: 700, height: 700,
            background: `radial-gradient(circle, ${SCSS.accentCyan}06 0%, transparent 65%)`
          }} />
          <div style={{
            position: "absolute", bottom: -200, right: -100, width: 600, height: 600,
            background: `radial-gradient(circle, ${SCSS.accentViolet}05 0%, transparent 65%)`
          }} />
        </div>

        {/* ── SIDEBAR ── */}
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
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17
            }}>⚡</div>
            {sidebarOpen && (
              <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: -0.5, fontFamily: SCSS.fontDisplay }}>TradePulse</span>
            )}
          </div>

          {/* Account summary */}
          {sidebarOpen && (
            <div style={{ margin: "0 14px 22px", background: "rgba(255,255,255,0.04)", borderRadius: SCSS.radiusSm, padding: "12px 14px" }}>
              <div style={{ fontSize: 11, color: SCSS.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6, fontFamily: SCSS.fontMono }}>Portefeuille</div>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: SCSS.fontDisplay, letterSpacing: -1 }}>
                {fmtE((data.investments || []).reduce((s, i) => s + (+i.current || 0), 0))}
              </div>
            </div>
          )}

          {/* Nav */}
          {PAGES.map(p => (
            <button key={p.id} className={`nav-btn ${page === p.id ? "active" : ""}`} onClick={() => setPage(p.id)}>
              <span style={{ fontSize: 19, flexShrink: 0 }}>{p.icon}</span>
              {sidebarOpen && p.label}
              {p.id === "notifications" && sidebarOpen && notifCount > 0 && (
                <span style={{ marginLeft: "auto", background: SCSS.accentRed, borderRadius: 10, padding: "1px 7px", fontSize: 10, color: "#fff" }}>{notifCount}</span>
              )}
            </button>
          ))}

          {/* Save indicator */}
          {sidebarOpen && (
            <div style={{
              margin: "8px 14px 0",
              fontSize: 11,
              color: saveIndicator ? SCSS.accentGreen : "transparent",
              transition: "color 0.3s",
              textAlign: "center",
              fontFamily: SCSS.fontMono,
            }}>
              ✓ Sauvegardé
            </div>
          )}

          {/* Collapse toggle */}
          <button
            className="btn-ghost"
            onClick={() => setSidebarOpen(s => !s)}
            style={{ margin: "auto 14px 0", borderRadius: SCSS.radiusSm, padding: "10px", textAlign: "center", fontSize: 14 }}
          >
            {sidebarOpen ? "◀ Réduire" : "▶"}
          </button>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{
          marginLeft: sidebarOpen ? 230 : 62,
          flex: 1, padding: "32px 40px",
          zIndex: 1,
          transition: "margin-left 0.3s cubic-bezier(0.4,0,0.2,1)",
          minHeight: "100vh",
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, fontFamily: SCSS.fontDisplay, letterSpacing: -0.8 }}>
                {page === "dashboard" ? `Bonjour${data.profile?.name ? ", " + data.profile.name.split(" ")[0] : ""} 👋` : PAGES.find(p => p.id === page)?.label}
              </h1>
              <div style={{ color: SCSS.textMuted, fontSize: 13, marginTop: 3 }}>
                {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button className="btn-primary" onClick={() => setChatOpen(c => !c)}>🤖 Assistant IA</button>
              <div
                onClick={() => setPage("profile")}
                style={{
                  width: 38, height: 38, borderRadius: "50%", cursor: "pointer",
                  background: `linear-gradient(135deg, ${SCSS.accentViolet}, ${SCSS.accentCyan})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontFamily: SCSS.fontDisplay, fontSize: 16,
                }}
              >
                {data.profile?.name ? data.profile.name[0].toUpperCase() : "?"}
              </div>
            </div>
          </div>

          {/* Page content */}
          {renderPage()}
        </main>

        {/* ── AI CHAT ── */}
        {chatOpen && <AiChat data={data} onClose={() => setChatOpen(false)} />}
      </div>
    </>
  );
}