import { type Dispatch, type SetStateAction } from "react";
import { SCSS } from "../utils/theme";
import { clearStorage } from "../data/accountData";
import type { AppData } from "../data/accountData";

interface SettingsProps {
  data: AppData;
  setData: Dispatch<SetStateAction<AppData>>;
  onLogout?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ data, setData, onLogout }) => {
  const s = data.settings || {};
  const upd = (key: string, val: unknown) =>
    setData(d => ({ ...d, settings: { ...(d.settings || {}), [key]: val } }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 640 }}>
      <div className="card fade-up">
        <div className="card-title">🎨 Apparence</div>
        {[
          { key: "currency",   label: "Devise",           options: ["EUR (€)", "USD ($)", "GBP (£)", "CHF (Fr)"] },
          { key: "dateFormat", label: "Format de date",   options: ["JJ/MM/AAAA", "MM/JJ/AAAA", "AAAA-MM-JJ"] },
          { key: "language",   label: "Langue",           options: ["Français", "English", "Español"] },
        ].map(({ key, label, options }) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${SCSS.borderSub}` }}>
            <span style={{ color: SCSS.textSecondary }}>{label}</span>
            <select
              value={(s as Record<string, string>)[key] || options[0]}
              onChange={e => upd(key, e.target.value)}
              style={{ width: 180 }}
            >
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="card fade-up fade-up-1">
        <div className="card-title">🔔 Notifications</div>
        {([
          ["notifDividends", "Alertes dividendes"],
          ["notifGoals",     "Alertes objectifs"],
          ["notifPerf",      "Alertes de performance"],
          ["notifWeekly",    "Rapport hebdomadaire"],
        ] as [string, string][]).map(([key, label]) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: `1px solid ${SCSS.borderSub}` }}>
            <span style={{ color: SCSS.textSecondary }}>{label}</span>
            <div
              onClick={() => upd(key, !(s as Record<string, boolean>)[key])}
              style={{
                width: 42, height: 24, borderRadius: 12, cursor: "pointer",
                background: (s as Record<string, boolean>)[key] ? SCSS.accentCyan : "rgba(255,255,255,0.1)",
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                position: "absolute", top: 3,
                left: (s as Record<string, boolean>)[key] ? "calc(100% - 21px)" : 3,
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                transition: "left 0.2s",
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card fade-up fade-up-2">
        <div className="card-title">💾 Persistance</div>
        <div style={{ color: SCSS.textSecondary, fontSize: 13, marginBottom: 12, lineHeight: 1.6 }}>
          Vos données sont automatiquement sauvegardées dans votre navigateur (localStorage). Elles persistent entre les sessions.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%", background: SCSS.accentGreen,
            animation: "blink 3s infinite",
          }} />
          <span style={{ color: SCSS.accentGreen, fontSize: 13, fontFamily: SCSS.fontMono }}>Données persistées localement</span>
        </div>
      </div>

      <div className="card fade-up fade-up-3">
        <div className="card-title">🗑️ Données</div>
        <div style={{ color: SCSS.textSecondary, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
          Réinitialiser toutes les données de l'application (investissements, transactions, dividendes, objectifs…).
          <br /><strong style={{ color: SCSS.accentRed }}>Cette action est irréversible.</strong>
        </div>
        <button
          className="btn-danger"
          onClick={() => {
            if (window.confirm("Confirmer la réinitialisation de toutes les données ?")) {
              clearStorage();
              setData({
                investments: [], transactions: [], dividends: [], goals: [],
                notifications: [], portfolioHistory: [], accounts: {}, profile: {}, settings: {},
              });
            }
          }}
        >
          🗑️ Réinitialiser toutes les données
        </button>
      </div>

      {onLogout && (
        <div className="card fade-up fade-up-4">
          <div className="card-title">🔐 Compte</div>
          <div style={{ color: SCSS.textSecondary, fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
            Déconnectez-vous de votre session. Vos données locales seront conservées.
          </div>
          <button className="btn-danger" onClick={onLogout}>
            🚪 Se déconnecter
          </button>
        </div>
      )}
    </div>
  );
};

export default Settings;