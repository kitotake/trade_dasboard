
import styles from "../styles/Auth.module.scss";

type Props = {
  onContinue?: () => void;
};

export default function WelcomeScreen({ onContinue }: Props) {
  const handleContinue = () => {
    if (onContinue) onContinue();
    else window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Bienvenue</h1>
        <p>Bienvenue dans votre tableau de bord Trade Dashboard.</p>
        <div className={styles.actions}>
          <button className={styles.primary} onClick={handleContinue}>
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
}
