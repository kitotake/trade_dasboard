// ── src/components/InvestmentTable.tsx ────────────────────────────────────────
// Tableau des investissements avec colonnes triables et badges de risque.
// - thead avec `scope="col"` pour l'accessibilité
// - Toutes les valeurs numériques sont des `number` → plus de Number(...)

import type { FC } from "react";
import { SCSS, RISK_COLORS } from "../utils/theme";
import { fmtE, pct } from "../utils/helpers";
import type { Investment } from "../data/accountData";

interface Props {
  investments: Investment[];
  onEdit:   (inv: Investment) => void;
  onDelete: (id: string)      => void;
  onDetail: (id: string)      => void;
}

const InvestmentTable: FC<Props> = ({ investments, onEdit, onDelete, onDetail }) => (
  <table className="data-table" role="table" aria-label="Liste des investissements">
    <thead>
      <tr>
        <th scope="col">Actif</th>
        <th scope="col">Type</th>
        <th scope="col">Investi</th>
        <th scope="col">Valeur</th>
        <th scope="col">Perf.</th>
        <th scope="col">Gain</th>
        <th scope="col">Risque</th>
        <th scope="col"><span className="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      {investments.map(inv => {
        const invested = Number(inv.invested) || 0;
        const current  = Number(inv.current)  || 0;
        const p        = parseFloat(pct(invested, current));
        const gain     = current - invested;
        const riskColor = inv.risk ? (RISK_COLORS[inv.risk] ?? SCSS.textSecondary) : SCSS.textSecondary;

        return (
          <tr key={inv.id}>
            {/* Name + ticker */}
            <td
              onClick={() => onDetail(inv.id)}
              style={{ cursor: "pointer" }}
              aria-label={`Voir le détail de ${inv.name}`}
            >
              <div style={{ fontWeight: 600 }}>{inv.name || "—"}</div>
              {inv.ticker && (
                <div style={{ fontSize: 11, color: SCSS.textMuted, fontFamily: SCSS.fontMono }}>
                  {inv.ticker}
                </div>
              )}
            </td>

            <td><span className="badge badge-cyan">{inv.type}</span></td>

            <td style={{ fontFamily: SCSS.fontMono }}>{fmtE(invested)}</td>
            <td style={{ fontFamily: SCSS.fontMono, fontWeight: 600 }}>{fmtE(current)}</td>

            <td>
              <span className={`badge ${p >= 0 ? "badge-green" : "badge-red"}`}>
                {p >= 0 ? "+" : ""}{p}%
              </span>
            </td>

            <td style={{ color: gain >= 0 ? SCSS.accentGreen : SCSS.accentRed, fontFamily: SCSS.fontMono }}>
              {gain >= 0 ? "+" : ""}{fmtE(gain)}
            </td>

            <td>
              <span className="badge" style={{ background: `${riskColor}18`, color: riskColor }}>
                {inv.risk ?? "—"}
              </span>
            </td>

            <td>
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  className="btn-ghost"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                  onClick={() => onEdit(inv)}
                  aria-label={`Modifier ${inv.name}`}
                >✏️</button>
                <button
                  className="btn-danger"
                  style={{ padding: "4px 10px", fontSize: 12 }}
                  onClick={() => onDelete(inv.id)}
                  aria-label={`Supprimer ${inv.name}`}
                >🗑</button>
              </div>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default InvestmentTable;