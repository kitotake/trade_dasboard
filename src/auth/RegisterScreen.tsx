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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    // TODO: replace with real register logic
    if (onRegister) onRegister();
    else window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2>Inscription</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </label>
        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Créer un compte
          </button>
          <button
            type="button"
            className={styles.link}
            onClick={() => onSwitchToLogin?.()}
          >
            Déjà un compte ?
          </button>
        </div>
      </form>
    </div>
  );
}
