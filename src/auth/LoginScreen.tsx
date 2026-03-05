import { useState, type FormEvent } from "react";
import { login, saveSession } from "../utils/authStorage";
import styles from "../styles/Auth.module.scss";

type Props = {
  onLogin?: () => void;
  onSwitchToRegister?: () => void;
};

export default function LoginScreen({ onLogin, onSwitchToRegister }: Props) {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setLoading(true);
    try {
      const result = await login(email, password);
      if (result.ok) {
        saveSession({ userId: result.user.id, email: result.user.email, name: result.user.name });
        onLogin?.();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
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
                autoComplete="email"
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
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className={styles.submit} disabled={loading}>
            {loading ? "Connexion…" : "Se connecter →"}
          </button>
        </form>

        {import.meta.env.DEV && (
          <div style={{
            marginTop: 12, padding: "10px 14px",
            background: "rgba(110,231,247,0.06)",
            border: "1px solid rgba(110,231,247,0.15)",
            borderRadius: 10, fontSize: 12,
            color: "rgba(255,255,255,0.4)", lineHeight: 1.7,
          }}>
            <strong style={{ color: "rgba(255,255,255,0.55)" }}>Comptes de test</strong><br />
            dev@test.com / Dev123!<br />
            alice@example.com / password123
          </div>
        )}

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