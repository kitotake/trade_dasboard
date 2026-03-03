// ── src/components/InvestmentDetail.tsx ───────────────────────────────────────
// Vue détail d'un investissement.

import type { FC } from "react";
import KpiCard from "./KpiCard";
import { SCSS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { Investment } from "../data/accountData";

interface Props {
  inv:      Investment;
  onBack:   () => void;
  onEdit:   (inv: Investment) => void;
  onDelete: (id: string) => void;
}

const InvestmentDetail: FC<Props> = ({ inv, onBack, onEdit, onDelete }) => {
  const invested = Number(inv.invested) || 0;
  const current  = Number(inv.current)  || 0;
  const p        = parseFloat(pct(invested, current));
  const gain     = current - invested;

  return (
    <div>
      <button
        className="btn-ghost"
        style={{ marginBottom: 20 }}
        onClick={onBack}
        aria-label="Retour à la liste"
      >
        ← Retour
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 24 }}>
        <KpiCard icon="💵" label="Valeur actuelle" value={fmtE(current)}  color={SCSS.accentCyan} />
        <KpiCard icon="📉" label="Investi"          value={fmtE(invested)} color={SCSS.accentViolet} />
        <KpiCard
          icon="📈"
          label="Performance"
          value={`${p >= 0 ? "+" : ""}${p}%`}
          sub={`${gain >= 0 ? "+" : ""}${fmtE(gain)}`}
          color={p >= 0 ? SCSS.accentGreen : SCSS.accentRed}
          trend={p >= 0 ? "up" : "down"}
        />
      </div>

      <div className="card" role="region" aria-label={`Détail de ${inv.name}`}>
        <h2 style={{ fontFamily: SCSS.fontDisplay, marginBottom: 4 }}>{inv.name}</h2>
        <div style={{ color: SCSS.textMuted, fontSize: 13, marginBottom: 20, fontFamily: SCSS.fontMono }}>
          {[inv.ticker, inv.type, inv.sector, inv.region].filter(Boolean).join(" · ")}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          {([
            ["Parts / Unités", inv.shares ?? "—"],
            ["Risque",         inv.risk   ?? "—"],
            ["Secteur",        inv.sector ?? "—"],
            ["Région",         inv.region ?? "—"],
            ["Type",           inv.type   ?? "—"],
          ] as [string, string | number][]).map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.04)", borderRadius: SCSS.radiusSm, padding: "12px 16px" }}>
              <div style={{ color: SCSS.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 }}>{k}</div>
              <div style={{ color: "#fff", fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        {inv.notes && (
          <div style={{ marginTop: 18, background: "rgba(255,255,255,0.04)", borderRadius: SCSS.radiusSm, padding: "14px 16px" }}>
            <div style={{ color: SCSS.textMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>
              Notes
            </div>
            <div style={{ color: SCSS.textSecondary, fontSize: 14, lineHeight: 1.6 }}>{inv.notes}</div>
          </div>
        )}

        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          <button className="btn-primary" onClick={() => onEdit(inv)}     aria-label={`Modifier ${inv.name}`}>✏️ Modifier</button>
          <button className="btn-danger"  onClick={() => onDelete(inv.id)} aria-label={`Supprimer ${inv.name}`}>🗑 Supprimer</button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetail;