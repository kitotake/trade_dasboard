import type { FC } from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  msg?: string;
  sub?: string;
  cta?: string;
  onCta?: () => void;
}

const EmptyState: FC<EmptyStateProps> = ({
  icon = "📭",
  msg = "Aucune donnée",
  sub = "Ajoutez vos informations pour commencer",
  cta,
  onCta,
}) => {
  return (
    <div className="empty-state">
      <div className="icon">{icon}</div>
      <p>
        <strong style={{ color: "rgba(255,255,255,0.45)" }}>{msg}</strong>
        <br />
        {sub}
      </p>
      {cta && <button className="btn-primary" onClick={onCta}>{cta}</button>}
    </div>
  );
};

export default EmptyState;