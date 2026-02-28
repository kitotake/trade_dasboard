import styles from "../styles/Auth.module.scss";

type Props = {
  onContinue?: () => void;
};

export default function WelcomeScreen({ onContinue }: Props) {
  return (
    <div className={styles.page}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeIcon}>⚡</div>

        <div className={styles.brand} style={{ justifyContent: "center" }}>
          <span className={styles.brandName}>trade-dashboard</span>
        </div>

        <h1 className={styles.welcomeTitle}>Votre portefeuille,<br />sous contrôle.</h1>
        <p className={styles.welcomeSubtitle}>
          Suivez, analysez et optimisez vos investissements depuis une interface élégante et intelligente.
        </p>

        <div className={styles.features}>
          {[
            ["📊", "Dashboard temps réel de vos actifs"],
            ["🤖", "Assistant IA intégré pour conseils"],
            ["🎯", "Suivi d'objectifs financiers personnels"],
            ["🔒", "Données stockées localement, 100% privées"],
          ].map(([icon, label]) => (
            <div key={label} className={styles.featureItem}>
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <button className={styles.submit} onClick={() => onContinue?.()}>
          Commencer →
        </button>
      </div>
    </div>
  );
}