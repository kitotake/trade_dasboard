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