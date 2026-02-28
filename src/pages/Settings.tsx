import React from "react";
import { SCSS } from "../utils/theme";
import type { AppData } from "../data/accountData";

interface SettingsProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Settings: React.FC<SettingsProps> = ({ data, setData }) => {
  const s = data.settings || {};
  const upd = (key: keyof typeof s, val: any) => setData(d => ({...d, settings:{...(d.settings||{}), [key]:val}}));

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16, maxWidth:640 }}>
      <div className="card fade-up">
        <div className="card-title">🎨 Apparence</div>
        {[
          { key:"currency", label:"Devise", options:["EUR (€)","USD ($)","GBP (£)","CHF (Fr)"] },
          { key:"dateFormat", label:"Format de date", options:["JJ/MM/AAAA","MM/JJ/AAAA","AAAA-MM-JJ"] },
          { key:"language", label:"Langue", options:["Français","English","Español"] },
        ].map(({ key, label, options }) => (
          <div key={key} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${SCSS.borderSub}` }}>
            <span style={{ color:SCSS.textSecondary }}>{label}</span>
            <select value={s[key]||options[0]} onChange={e => upd(key, e.target.value)} style={{ width:180 }}>
              {options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="card fade-up fade-up-1">
        <div className="card-title">🔔 Notifications</div>
        {[
          ["notifDividends","Alertes dividendes"],
          ["notifGoals","Alertes objectifs"],
          ["notifPerf","Alertes de performance"],
          ["notifWeekly","Rapport hebdomadaire"],
        ].map(([key, label]) => (
          <div key={key as string} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:`1px solid ${SCSS.borderSub}` }}>
            <span style={{ color:SCSS.textSecondary }}>{label}</span>
            <div onClick={() => upd(key as string, !s[key as string])} style={{
              width:42, height:24, borderRadius:12, cursor:"pointer",
              background: s[key as string] ? SCSS.accentCyan : "rgba(255,255,255,0.1)",
              position:"relative", transition:"background 0.2s",
            }}>
              <div style={{
                position:"absolute", top:3, left: s[key as string] ? "calc(100% - 21px)" : 3,
                width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.2s",
              }} />
            </div>
          </div>
        ))}
      </div>

      <div className="card fade-up fade-up-2">
        <div className="card-title">🗑️ Données</div>
        <div style={{ color:SCSS.textSecondary, fontSize:13, marginBottom:16, lineHeight:1.6 }}>
          Réinitialiser toutes les données de l'application (investissements, transactions, dividendes, objectifs…).
          <br/><strong style={{ color:SCSS.accentRed }}>Cette action est irréversible.</strong>
        </div>
        <button className="btn-danger" onClick={() => {
          if (window.confirm("Confirmer la réinitialisation de toutes les données ?")) {
            setData({ investments:[], transactions:[], dividends:[], goals:[], notifications:[], portfolioHistory:[], accounts:{}, profile:{}, settings:{} });
          }
        }}>🗑️ Réinitialiser toutes les données</button>
      </div>
    </div>
  );
};

export default Settings;
