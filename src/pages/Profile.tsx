import { useState } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE } from "../utils/helpers";
import type { AppData, Profile } from "../data/accountData";

interface ProfileProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const ProfilePage: FC<ProfileProps> = ({ data, setData }) => {
  const [editing, setEditing] = useState(false);
  const p = data.profile || {};
  const [form, setForm] = useState<Profile>(p);
  const save = () => { setData(d => ({...d, profile:{...form}})); setEditing(false); };

  const investments = data.investments || [];
  const totalInvested = investments.reduce((s,i) => s+(Number(i.invested) || 0), 0);
  const totalCurrent  = investments.reduce((s,i) => s+(Number(i.current) || 0), 0);

  return (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 2fr", gap:20, alignItems:"start" }}>
      <div className="card fade-up" style={{ textAlign:"center" }}>
        <div style={{ width:72, height:72, borderRadius:"50%",
          background:`linear-gradient(135deg, ${SCSS.accentViolet}, ${SCSS.accentCyan})`,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:700, margin:"0 auto 16px",
          fontFamily: SCSS.fontDisplay }}>
          {p.name ? p.name[0].toUpperCase() : "?"}
        </div>
        <div style={{ fontSize:20, fontWeight:700, fontFamily:SCSS.fontDisplay }}>{p.name || "—"}</div>
        <div style={{ color:SCSS.textMuted, fontSize:13, marginTop:4 }}>{p.email || "—"}</div>
        <div style={{ marginTop:6 }}>
          <span className="badge badge-violet">{p.riskProfile || "Profil non défini"}</span>
        </div>
        <hr className="divider" />
        <button className="btn-primary" style={{ width:"100%" }} onClick={() => { setForm(data.profile||{}); setEditing(true); }}>✏️ Modifier le profil</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <div className="card fade-up">
          <div className="card-title">Résumé financier</div>
          {[
            ["Portefeuille total", fmtE(totalCurrent)],
            ["Total investi", fmtE(totalInvested)],
            ["Gain total", `${totalCurrent - totalInvested >= 0 ? "+" : ""}${fmtE(totalCurrent - totalInvested)}`],
            ["Dividendes reçus", fmtE((data.dividends||[]).reduce((s,d)=>s+(Number(d.amount)||0),0))],
            ["Nbre de positions", investments.length]
          ].map(([k,v]) => (
            <div key={k as string} style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:`1px solid ${SCSS.borderSub}` }}>
              <span style={{ color:SCSS.textSecondary }}>{k}</span>
              <span style={{ color:SCSS.accentCyan, fontWeight:700, fontFamily:SCSS.fontMono }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="card fade-up fade-up-1">
          <div className="card-title">Informations personnelles</div>
          {!p.name ? (
            <EmptyState icon="👤" msg="Profil non configuré" sub="Cliquez sur Modifier pour renseigner vos informations" onCta={() => { setForm({}); setEditing(true); }} cta="Configurer" />
          ) : (
            <>
              {[
                { label: "Nom", value: p.name },
                { label: "Email", value: p.email },
                { label: "Profil risque", value: p.riskProfile },
                { label: "Horizon investissement", value: p.horizon },
                { label: "Fiscalité", value: p.tax },
                { label: "Objectif principal", value: p.mainGoal },
              ].map(({ label, value }) =>
                value ? (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", padding:"10px 0", borderBottom:`1px solid ${SCSS.borderSub}` }}>
                    <span style={{ color:SCSS.textSecondary, fontSize:14 }}>{label}</span>
                    <span style={{ color:"#fff", fontSize:14 }}>{value}</span>
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>

      {editing && (
        <Modal title="Modifier le profil" onClose={() => setEditing(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormField label="Prénom / Nom"><input placeholder="Jean Dupont" value={form.name||""} onChange={e => setForm(f=>({...f,name:e.target.value}))} /></FormField>
            <FormField label="Email"><input type="email" placeholder="jean@mail.com" value={form.email||""} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></FormField>
            <FormField label="Profil risque">
              <select value={form.riskProfile||""} onChange={e => setForm(f=>({...f,riskProfile:e.target.value}))}>
                <option value="">— Choisir —</option>
                {["Prudent","Équilibré","Dynamique","Agressif"].map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Horizon d'investissement">
              <select value={form.horizon||""} onChange={e => setForm(f=>({...f,horizon:e.target.value}))}>
                <option value="">— Choisir —</option>
                {["Court terme (< 3 ans)","Moyen terme (3-8 ans)","Long terme (> 8 ans)"].map(h => <option key={h}>{h}</option>)}
              </select>
            </FormField>
            <FormField label="Fiscalité / Enveloppes">
              <input placeholder="ex : PEA, CTO, Assurance-vie" value={form.tax||""} onChange={e => setForm(f=>({...f,tax:e.target.value}))} />
            </FormField>
            <FormField label="Objectif principal">
              <input placeholder="ex : Retraite, Immobilier…" value={form.mainGoal||""} onChange={e => setForm(f=>({...f,mainGoal:e.target.value}))} />
            </FormField>
          </div>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-ghost" onClick={() => setEditing(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Sauvegarder</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ProfilePage;