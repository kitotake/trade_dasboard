import type { FC } from "react";
import { SCSS } from "../utils/theme";

interface KpiCardProps {
  icon?: React.ReactNode;
  label: string;
  value?: string | number;
  sub?: string;
  color?: string;
  trend?: "up" | "down";
  empty?: boolean;
}

const KpiCard: FC<KpiCardProps> = ({ icon, label, value, sub, color = SCSS.accentCyan, trend, empty }) => {
  return (
    <div className="card kpi-card fade-up">
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
        <span className="card-title" style={{ marginBottom: 0, fontSize: 11 }}>{label.toUpperCase()}</span>
      </div>
      {empty ? (
        <div style={{ color: SCSS.textMuted, fontSize: 22, fontWeight: 700, fontFamily: SCSS.fontDisplay }}>—</div>
      ) : (
        <div className="kpi-value" style={{ color: color ?? "#fff" }}>{value ?? "—"}</div>
      )}
      {sub && (
        <div style={{ marginTop: 6, fontSize: 12, color: trend === "up" ? SCSS.accentGreen : trend === "down" ? SCSS.accentRed : SCSS.textSecondary }}>
          {trend === "up" && "▲ "}{trend === "down" && "▼ "}{sub}
        </div>
      )}
    </div>
  );
};

export default KpiCard;