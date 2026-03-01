import type { FC } from "react";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Cell } from "recharts";
import EmptyState from "../components/EmptyState";
import { SCSS } from "../utils/theme";
import { pct, fmtE } from "../utils/helpers";
import type { AppData } from "../data/accountData";

interface AnalysisProps {
  data: AppData;
}

const Analysis: FC<AnalysisProps> = ({ data }) => {
  const investments = data.investments || [];

  const perfData = investments.map(i => ({
    name: i.ticker || i.name?.slice(0, 8),
    perf: parseFloat(pct(i.invested, i.current)),
  }));

  const sectors  = [...new Set(investments.map(i => i.sector).filter(Boolean))] as string[];
  const regions  = [...new Set(investments.map(i => i.region).filter(Boolean))] as string[];
  const highRisk = investments.filter(i => i.risk === "Élevé").length;
  const divers   = Math.min(100, sectors.length * 14 + regions.length * 12);
  const geoScore = Math.min(100, regions.length * 20);
  const riskScore = Math.max(0, 80 - highRisk * 15);

  const scoreRows: [string, number, string][] = [
    ["Diversification sectorielle", divers,    SCSS.accentGreen],
    ["Diversif. géographique",       geoScore,  SCSS.accentCyan],
    ["Score risque global",           riskScore, riskScore > 60 ? SCSS.accentGreen : SCSS.accentAmber],
  ];

  const total = investments.reduce((s, i) => s + (Number(i.current) || 0), 0);
  const sortedInvestments = [...investments].sort((a, b) => (Number(b.current) || 0) - (Number(a.current) || 0));

  return (
    <div>
      {investments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📈"
            msg="Pas encore de données à analyser"
            sub="Ajoutez vos investissements dans Portefeuille pour voir l'analyse"
          />
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Performance par actif */}
            <div className="card fade-up">
              <div className="card-title">Performance par actif (%)</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={perfData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.18)" fontSize={11} />
                  <YAxis stroke="rgba(255,255,255,0.18)" fontSize={11} unit="%" />
                  <Tooltip
                    contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                    formatter={(v: any) => [`${v}%`]}
                  />
                  <Bar dataKey="perf" radius={[4, 4, 0, 0]}>
                    {perfData.map((d, i) => (
                      <Cell key={i} fill={d.perf >= 0 ? SCSS.accentGreen : SCSS.accentRed} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Score risque */}
            <div className="card fade-up fade-up-1">
              <div className="card-title">Score risque estimé</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
                {scoreRows.map(([label, val, color]) => (
                  <div key={label}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: SCSS.textSecondary, fontSize: 13 }}>{label}</span>
                      <span style={{ color, fontWeight: 700 }}>{val}/100</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${val}%`, background: `linear-gradient(90deg, ${color}66, ${color})` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <hr className="divider" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  ["Secteurs distincts",       sectors.length],
                  ["Régions distinctes",        regions.length],
                  ["Positions à risque élevé",  highRisk],
                  ["Positions totales",          investments.length],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ background: "rgba(255,255,255,0.04)", borderRadius: SCSS.radiusSm, padding: "10px 14px" }}>
                    <div style={{ color: SCSS.textMuted, fontSize: 11, marginBottom: 4 }}>{k}</div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Allocation détaillée */}
          <div className="card fade-up fade-up-2">
            <div className="card-title">Allocation détaillée</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actif</th><th>Secteur</th><th>Région</th>
                  <th>% du portefeuille</th><th>Valeur</th><th>Perf.</th>
                </tr>
              </thead>
              <tbody>
                {sortedInvestments.map(inv => {
                  const share = total > 0 ? ((Number(inv.current) || 0) / total * 100).toFixed(1) : "0.0";
                  const p = parseFloat(pct(inv.invested, inv.current));
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight: 600 }}>{inv.name}</td>
                      <td><span className="badge badge-cyan">{inv.sector || "—"}</span></td>
                      <td style={{ color: SCSS.textSecondary }}>{inv.region || "—"}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                            <div style={{ width: `${share}%`, height: "100%", background: SCSS.accentCyan, borderRadius: 4 }} />
                          </div>
                          <span style={{ fontFamily: SCSS.fontMono, fontSize: 12, width: 40 }}>{share}%</span>
                        </div>
                      </td>
                      <td style={{ fontFamily: SCSS.fontMono }}>{fmtE(inv.current)}</td>
                      <td>
                        <span className={`badge ${p >= 0 ? "badge-green" : "badge-red"}`}>
                          {p >= 0 ? "+" : ""}{p}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis;