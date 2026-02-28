import React from "react";
import { SCSS } from "../utils/theme";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  empty?: boolean;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, color = SCSS.accentCyan, icon, trend, empty }) => {
  return (
    <div className="kpi-card fade-up" style={{ "--hover-glow": color } as any}>
      <div style={{ position:"absolute", top:0, right:0, width:100, height:100,
        background:`radial-gradient(circle, ${color}18 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ fontSize: 22 }}>{icon}</div>
      <div className="kpi-label" style={{ marginTop: 12 }}>{label}</div>
      <div className="kpi-value" style={{ color: empty ? SCSS.textMuted : "#fff" }}>
        {empty ? "—" : value}
      </div>
      {sub && (
        <div className="kpi-sub" style={{ color: trend === "up" ? SCSS.accentGreen : trend === "down" ? SCSS.accentRed : SCSS.textSecondary }}>
          {trend === "up" ? "▲ " : trend === "down" ? "▼ " : ""}{sub}
        </div>
      )}
    </div>
  );
};

export default KpiCard;
