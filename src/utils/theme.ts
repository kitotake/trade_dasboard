export const SCSS = {
  bgBase: "#08090D",
  bgSurface: "#0D0F17",
  bgCard: "rgba(255,255,255,0.035)",
  borderSub: "rgba(255,255,255,0.07)",
  borderAccent: "rgba(110,231,247,0.35)",
  accentCyan: "#6EE7F7",
  accentViolet: "#B197FC",
  accentGreen: "#34D399",
  accentAmber: "#FCD34D",
  accentRed: "#F87171",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.45)",
  textMuted: "rgba(255,255,255,0.22)",
  fontDisplay: "'Playfair Display', Georgia, serif",
  fontBody: "'DM Sans', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
  radius: "14px",
  radiusSm: "8px",
  shadow: "0 8px 40px rgba(0,0,0,0.5)",
};

export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; }
  body { background: ${SCSS.bgBase}; color: ${SCSS.textPrimary}; font-family: ${SCSS.fontBody}; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

  /* ── animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes blink {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes pulseRing {
    0%   { transform: scale(1);   opacity: 0.6; }
    100% { transform: scale(1.8); opacity: 0; }
  }

  .fade-up { animation: fadeUp 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.10s; }
  .fade-up-3 { animation-delay: 0.15s; }
  .fade-up-4 { animation-delay: 0.20s; }

  /* ── form resets ── */
  input, textarea, select {
    font-family: ${SCSS.fontBody};
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.10);
    color: ${SCSS.textPrimary};
    border-radius: ${SCSS.radiusSm};
    padding: 10px 14px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  input:focus, textarea:focus, select:focus {
    border-color: ${SCSS.accentCyan};
    box-shadow: 0 0 0 3px rgba(110,231,247,0.08);
  }
  input::placeholder, textarea::placeholder { color: ${SCSS.textMuted}; }
  select option { background: #1a1d2e; }

  /* ── btn ── */
  .btn-primary {
    background: linear-gradient(135deg, ${SCSS.accentCyan}, ${SCSS.accentViolet});
    border: none; border-radius: ${SCSS.radiusSm};
    color: #08090D; font-weight: 700; font-family: ${SCSS.fontBody};
    cursor: pointer; padding: 10px 22px; font-size: 14px;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-primary:hover  { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: ${SCSS.radiusSm};
    color: ${SCSS.textSecondary}; font-family: ${SCSS.fontBody};
    cursor: pointer; padding: 9px 18px; font-size: 14px;
    transition: background 0.15s, color 0.15s;
  }
  .btn-ghost:hover { background: rgba(255,255,255,0.1); color: #fff; }

  .btn-danger {
    background: rgba(248,113,113,0.12);
    border: 1px solid rgba(248,113,113,0.25);
    border-radius: ${SCSS.radiusSm};
    color: ${SCSS.accentRed}; font-family: ${SCSS.fontBody};
    cursor: pointer; padding: 9px 18px; font-size: 14px;
    transition: background 0.15s;
  }
  .btn-danger:hover { background: rgba(248,113,113,0.22); }

  /* ... (remaining global styles copied from source) ... */
`;

export const RISK_COLORS: Record<string, string> = {
  Faible: SCSS.accentGreen,
  Moyen: SCSS.accentAmber,
  Élevé: SCSS.accentRed,
};

export const SECTOR_COLORS = [
  "#6EE7F7","#B197FC","#34D399","#FCD34D","#F87171","#60A5FA","#FB923C","#A3E635"
];

export const PAGES = [
  { id: "dashboard",     label: "Dashboard",       icon: "⚡" },
  { id: "portfolio",     label: "Portefeuille",     icon: "📊" },
  { id: "transactions",  label: "Transactions",     icon: "↕️" },
  { id: "dividends",     label: "Dividendes",       icon: "💰" },
  { id: "goals",         label: "Objectifs",        icon: "🎯" },
  { id: "analysis",      label: "Analyse",          icon: "📈" },
  { id: "simulation",    label: "Simulation",       icon: "🔬" },
  { id: "reports",       label: "Rapports",         icon: "📋" },
  { id: "notifications", label: "Notifications",    icon: "🔔" },
  { id: "profile",       label: "Profil",           icon: "👤" },
  { id: "settings",      label: "Paramètres",       icon: "⚙️" },
];