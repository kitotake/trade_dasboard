import { useState, type FormEvent } from "react";
import styles from "../styles/Auth.module.scss";

type Props = {
  onRegister?: () => void;
  onSwitchToLogin?: () => void;
};

export default function RegisterScreen({ onRegister, onSwitchToLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    // TODO: replace with real register logic
    if (onRegister) onRegister();
    else window.location.href = "/";
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>⚡</div>
          <span className={styles.brandName}>trade-dashboard</span>
        </div>

        <h1 className={styles.title}>Créer un compte</h1>
        <p className={styles.subtitle}>Commencez à piloter vos investissements</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Adresse email</label>
              <input
                className={styles.input}
                type="email"
                placeholder="jean@exemple.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mot de passe</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Minimum 6 caractères"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Confirmer le mot de passe</label>
              <input
                className={styles.input}
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submit}>
            Créer mon compte →
          </button>
        </form>

        <div className={styles.switchRow}>
          Déjà un compte ?
          <button
            type="button"
            className={styles.switchLink}
            onClick={() => onSwitchToLogin?.()}
          >
            Se connecter
          </button>
        </div>
      </div>
    </div>
  );
}