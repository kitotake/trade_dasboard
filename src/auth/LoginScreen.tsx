import { useState, type FormEvent } from "react";
import styles from "../styles/Auth.module.scss";

type Props = {
  onLogin?: () => void;
  onSwitchToRegister?: () => void;
};

export default function LoginScreen({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: replace with real auth logic
    if (onLogin) onLogin();
    else window.location.href = "/";
  };

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h2>Connexion</h2>
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
        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            Se connecter
          </button>
          <button
            type="button"
            className={styles.link}
            onClick={() => onSwitchToRegister?.()}
          >
            S'inscrire
          </button>
        </div>
      </form>
    </div>
  );
}
