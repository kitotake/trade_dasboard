import { useState, type FormEvent } from "react";
import { TEST_USERS } from "../utils/devCredentials";
import styles from "../styles/Auth.module.scss";

type Props = {
  onLogin?: () => void;
  onSwitchToRegister?: () => void;
};

export default function LoginScreen({ onLogin, onSwitchToRegister }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    const user = TEST_USERS.find(u => u.email === email && u.password === password);

    if (user) {
      if (onLogin) onLogin();
      else window.location.href = "/";
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>⚡</div>
          <span className={styles.brandName}>trade-dashboard</span>
        </div>

        <h1 className={styles.title}>Connexion</h1>
        <p className={styles.subtitle}>Accédez à votre tableau de bord</p>

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
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mot de passe</label>
              <input
                className={styles.input}
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submit}>
            Se connecter →
          </button>
        </form>

        <div className={styles.switchRow}>
          Pas encore de compte ?
          <button type="button" className={styles.switchLink} onClick={() => onSwitchToRegister?.()}>
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}