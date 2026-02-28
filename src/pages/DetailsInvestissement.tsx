import type { FC } from "react";
import type { Investment } from "../data/accountData";
import { fmtE, pct } from "../utils/helpers";
import { SCSS } from "../utils/theme";

interface Props {
  investment: Investment;
  onBack?: () => void;
}

const DetailsInvestissement: FC<Props> = ({ investment, onBack }) => {
  const p = parseFloat(pct(investment.invested, investment.current));
  const gain = (Number(investment.current) || 0) - (Number(investment.invested) || 0);

  return (
    <div style={{ padding: "2rem", color: "#fff" }}>
      {onBack && (
        <button
          onClick={onBack}
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "rgba(255,255,255,0.6)",
            cursor: "pointer",
            padding: "8px 16px",
            marginBottom: "1.5rem",
            fontSize: 14,
          }}
        >
          ← Retour
        </button>
      )}
      <h1 style={{ fontFamily: SCSS.fontDisplay, marginBottom: "0.5rem" }}>
        {investment.name}
      </h1>
      {investment.ticker && (
        <p style={{ color: SCSS.textMuted, fontFamily: SCSS.fontMono, marginBottom: "1.5rem" }}>
          {investment.ticker}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: "1.5rem",
        }}
      >
        {[
          ["Montant investi", fmtE(investment.invested)],
          ["Valeur actuelle", fmtE(investment.current)],
          ["Performance", `${p >= 0 ? "+" : ""}${p}%`],
          ["Gain / Perte", `${gain >= 0 ? "+" : ""}${fmtE(gain)}`],
          ["Nb de parts", investment.shares ?? "—"],
          ["Risque", investment.risk ?? "—"],
        ].map(([label, value]) => (
          <div
            key={label as string}
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                color: SCSS.textMuted,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {label}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{value}</div>
          </div>
        ))}
      </div>
      {investment.notes && (
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 8,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              color: SCSS.textMuted,
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            Notes
          </div>
          <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            {investment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsInvestissement;