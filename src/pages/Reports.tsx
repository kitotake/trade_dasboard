import type { FC } from "react";
import EmptyState from "../components/EmptyState";
import { SCSS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { AppData } from "../data/accountData";

interface ReportsProps {
  data: AppData;
}

const Reports: FC<ReportsProps> = ({ data }) => {
  const investments = data.investments || [];
  const dividends = data.dividends || [];
  const transactions = data.transactions || [];

  const totalInvested = investments.reduce((s, i) => s + (Number(i.invested)||0), 0);
  const totalCurrent  = investments.reduce((s, i) => s + (Number(i.current) ||0), 0);
  const totalDiv = dividends.reduce((s, d) => s + (Number(d.amount)||0), 0);
  const perf = parseFloat(pct(totalInvested, totalCurrent));

  const csvExport = () => {
    const csv = ["Actif,Ticker,Type,Investi,Valeur,Perf%,Gain",
      ...investments.map(i => `${i.name},${i.ticker},${i.type},${i.invested},${i.current},${pct(i.invested,i.current)},${(Number(i.current)||0)-(Number(i.invested)||0)}`)
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
    a.download = "tradepulse_rapport.csv"; a.click();
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div className="card fade-up">
        <div className="card-title">📄 Rapport de performance global</div>
        {investments.length === 0 ? (
          <EmptyState icon="📋" msg="Aucune donnée" sub="Ajoutez vos investissements pour générer un rapport" />
        ) : (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
              {[["Investi", fmtE(totalInvested)], ["Valeur", fmtE(totalCurrent)], ["Gain", `${perf >= 0 ? "+" : ""}${perf}%`], ["Dividendes", fmtE(totalDiv)]].map(([k,v]) => (
                <div key={k as string} style={{ background:"rgba(255,255,255,0.04)", borderRadius:SCSS.radiusSm, padding:"14px 16px" }}>
                  <div style={{ color:SCSS.textMuted, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>{k}</div>
                  <div style={{ color:"#fff", fontWeight:700, fontSize:17 }}>{v}</div>
                </div>
              ))}
            </div>
            <div className="card-title" style={{ fontSize:13, marginTop:8 }}>Détail par actif</div>
            <table className="data-table">
              <thead><tr><th>Actif</th><th>Type</th><th>Investi</th><th>Valeur</th><th>Perf. %</th><th>Gain €</th><th>Risque</th></tr></thead>
              <tbody>
                {investments.map(inv => {
                  const p = parseFloat(pct(inv.invested, inv.current));
                  const g = (Number(inv.current)||0) - (Number(inv.invested)||0);
                  return (
                    <tr key={inv.id}>
                      <td style={{ fontWeight:600 }}>{inv.name}</td>
                      <td><span className="badge badge-cyan">{inv.type}</span></td>
                      <td style={{ fontFamily:SCSS.fontMono }}>{fmtE(inv.invested)}</td>
                      <td style={{ fontFamily:SCSS.fontMono, fontWeight:600 }}>{fmtE(inv.current)}</td>
                      <td><span className={`badge ${p >= 0 ? "badge-green" : "badge-red"}`}>{p >= 0 ? "+" : ""}{p}%</span></td>
                      <td style={{ color:g >= 0 ? SCSS.accentGreen : SCSS.accentRed, fontFamily:SCSS.fontMono }}>{g >= 0 ? "+" : ""}{fmtE(g)}</td>
                      <td><span className="badge" style={{ background:`${SCSS.accentRed}18`, color:SCSS.accentRed }}>{inv.risk}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ marginTop:20, display:"flex", gap:10 }}>
              <button className="btn-ghost" onClick={csvExport}>⬇️ Exporter CSV</button>
              <button className="btn-ghost" onClick={() => window.print()}>🖨️ Imprimer</button>
            </div>
          </div>
        )}
      </div>

      <div className="card fade-up fade-up-1">
        <div className="card-title">📑 Résumé des transactions</div>
        {transactions.length === 0 ? (
          <EmptyState icon="↕️" msg="Aucune transaction" sub="Ajoutez des transactions dans l'onglet Transactions" />
        ) : (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:16 }}>
              {(()=>{
                const achats = transactions.filter(t => t.type === "Achat").reduce((s,t)=>s+(Number(t.amount)||0),0);
                const ventes = transactions.filter(t => t.type === "Vente").reduce((s,t)=>s+(Number(t.amount)||0),0);
                const depots = transactions.filter(t => t.type === "Dépôt").reduce((s,t)=>s+(Number(t.amount)||0),0);
                return [["Total achats", fmtE(achats)], ["Total ventes", fmtE(ventes)], ["Total dépôts", fmtE(depots)]].map(([k,v]) => (
                  <div key={k as string} style={{ background:"rgba(255,255,255,0.04)", borderRadius:SCSS.radiusSm, padding:"12px 14px" }}>
                    <div style={{ color:SCSS.textMuted, fontSize:11, marginBottom:4 }}>{k}</div>
                    <div style={{ fontWeight:700 }}>{v}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;