import type { FC } from "react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import KpiCard from "../components/KpiCard";
import EmptyState from "../components/EmptyState";
import { SCSS, SECTOR_COLORS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";

interface DashboardProps {
  data: AppData;
  setPage: (page: string) => void;
}

const Dashboard: FC<DashboardProps> = ({ data, setPage }) => {
  const { investments = [], dividends = [], accounts = {}, portfolioHistory = [] } = data;

  const totalInvested = investments.reduce((s, i) => s + (Number(i.invested) || 0), 0);
  const totalCurrent  = investments.reduce((s, i) => s + (Number(i.current)  || 0), 0);
  const totalDiv      = dividends.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const perf  = parseFloat(pct(totalInvested, totalCurrent));
  const empty = investments.length === 0;

  const sectorMap: Record<string, number> = {};
  investments.forEach(i => {
    const s = i.sector || "Autre";
    sectorMap[s] = (sectorMap[s] || 0) + (Number(i.current) || 0);
  });
  const sectorData = Object.entries(sectorMap).map(([name, value], idx) => ({
    name, value: Math.round((value / totalCurrent) * 100) || 0,
    color: SECTOR_COLORS[idx % SECTOR_COLORS.length],
  }));

  const histData = portfolioHistory.length > 0 ? portfolioHistory : [{ label: "—", value: 0 }];

  return (
    <div>
      {/* kpi-grid — 4 colonnes desktop, 2 colonnes tablette/mobile via CSS */}
      <div
        className="kpi-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}
      >
        <KpiCard icon="💼" label="Valeur totale" value={fmtE(totalCurrent)} sub={`${perf >= 0 ? "+" : ""}${perf}% all time`} color={SCSS.accentCyan} trend={perf >= 0 ? "up" : "down"} empty={empty} />
        <KpiCard icon="🏛️" label="PEA"            value={fmtE(accounts.pea)} color={SCSS.accentViolet} empty={!accounts.pea} />
        <KpiCard icon="🏦" label="Compte courant" value={fmtE(accounts.cc)}  color={SCSS.accentGreen}  empty={!accounts.cc} />
        <KpiCard icon="💰" label="Dividendes"     value={fmtE(totalDiv)}     color={SCSS.accentAmber}  empty={!totalDiv} />
      </div>

      {/* grid-2col — 2:1 desktop, 1 col tablette/mobile */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 28 }}>
        <div className="card fade-up fade-up-1">
          <div className="card-title">Évolution du portefeuille</div>
          {portfolioHistory.length < 2 ? (
            <EmptyState icon="📉" msg="Pas encore d'historique" sub="Ajoutez des snapshots dans Transactions" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={histData}>
                <defs>
                  <linearGradient id="gPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={SCSS.accentCyan} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={SCSS.accentCyan} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" stroke="rgba(255,255,255,0.18)" fontSize={11} />
                <YAxis stroke="rgba(255,255,255,0.18)" fontSize={11} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                  formatter={(v: any) => [fmtE(v)]}
                />
                <Area type="monotone" dataKey="value" stroke={SCSS.accentCyan} strokeWidth={2} fill="url(#gPort)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card fade-up fade-up-2">
          <div className="card-title">Répartition sectorielle</div>
          {sectorData.length === 0 ? (
            <EmptyState icon="🥧" msg="Aucune répartition" sub="Ajoutez vos investissements" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie data={sectorData} dataKey="value" cx="50%" cy="50%" innerRadius={38} outerRadius={65}>
                    {sectorData.map((s, i) => <Cell key={i} fill={s.color} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                    formatter={(v: any) => [`${v}%`]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px", marginTop: 8 }}>
                {sectorData.map(s => (
                  <span key={s.name} style={{ fontSize: 11, color: SCSS.textSecondary, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 7, height: 7, borderRadius: 2, background: s.color, display: "inline-block" }} />
                    {s.name} {s.value}%
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Positions table avec scroll horizontal sur mobile via data-table-wrap */}
      <div className="card fade-up fade-up-3">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span className="card-title" style={{ marginBottom: 0 }}>Positions</span>
          <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setPage("portfolio")}>Voir tout →</button>
        </div>
        {investments.length === 0 ? (
          <EmptyState icon="📊" msg="Aucun investissement" sub="Allez dans Portefeuille pour ajouter vos positions" onCta={() => setPage("portfolio")} cta="+ Ajouter" />
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actif</th><th>Investi</th><th>Valeur actuelle</th><th>Perf. %</th><th>Gain €</th>
                </tr>
              </thead>
              <tbody>
                {investments.slice(0, 5).map(inv => {
                  const p = parseFloat(pct(inv.invested, inv.current));
                  const g = (Number(inv.current) || 0) - (Number(inv.invested) || 0);
                  return (
                    <tr key={inv.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{inv.name || "—"}</div>
                        <div style={{ fontSize: 11, color: SCSS.textMuted, fontFamily: SCSS.fontMono }}>{inv.ticker}</div>
                      </td>
                      <td>{fmtE(inv.invested)}</td>
                      <td style={{ fontWeight: 600 }}>{fmtE(inv.current)}</td>
                      <td>
                        <span className={`badge ${p >= 0 ? "badge-green" : "badge-red"}`}>
                          {p >= 0 ? "+" : ""}{p}%
                        </span>
                      </td>
                      <td style={{ color: g >= 0 ? SCSS.accentGreen : SCSS.accentRed, fontFamily: SCSS.fontMono }}>
                        {g >= 0 ? "+" : ""}{fmtE(g)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;