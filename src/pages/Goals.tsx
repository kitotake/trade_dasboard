import React, { useState } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Goal, AppData } from "../data/accountData";

interface GoalsProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Goals: React.FC<GoalsProps> = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const EMPTY: Goal = { id:"", name:"", target:"", current:"", deadline:"", color:SCSS.accentCyan, note:"" };
  const [form, setForm] = useState<Goal>(EMPTY);
  const goals = data.goals || [];
  const totalPortfolio = (data.investments||[]).reduce((s, i) => s + (Number(i.current)||0), 0);

  const del = (id: string) => setData(d => ({...d, goals: d.goals.filter(g => g.id !== id)}));
  const save = () => {
    if (!form.name || !form.target) return;
    if (editing) {
      setData(d => ({...d, goals: d.goals.map(g => g.id === editing ? {...form, id:editing} : g)}));
    } else {
      setData(d => ({...d, goals: [...(d.goals||[]), {...form, id:uid()}]}));
    }
    setModal(false);
  };

  const COLORS = [SCSS.accentCyan, SCSS.accentViolet, SCSS.accentGreen, SCSS.accentAmber, SCSS.accentRed];

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:22 }}>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setEditing(null); setModal(true); }}>+ Nouvel objectif</button>
      </div>

      {goals.length === 0 ? (
        <div className="card"><EmptyState icon="🎯" msg="Aucun objectif défini" sub="Créez vos objectifs financiers : retraite, achat immobilier, fonds d'urgence…" cta="+ Créer" onCta={() => setModal(true)} /></div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
          {goals.map(g => {
            const targetNum = Number(g.target) || 0;
            const currentNum = Number(g.current) || totalPortfolio;
            const pctVal = Math.min(100, targetNum > 0 ? (currentNum / targetNum) * 100 : 0);
            const rest = targetNum - currentNum;
            return (
              <div key={g.id} className="card fade-up">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16, marginBottom:4 }}>{g.name}</div>
                    {g.deadline && <span style={{ color:SCSS.textMuted, fontSize:12 }}>📅 Échéance : {g.deadline}</span>}
                  </div>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="btn-ghost" style={{ padding:"4px 10px", fontSize:12 }} onClick={() => { setForm({...g}); setEditing(g.id); setModal(true); }}>✏️</button>
                    <button className="btn-danger" style={{ padding:"4px 10px", fontSize:12 }} onClick={() => del(g.id)}>🗑</button>
                  </div>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:8, fontSize:13 }}>
                  <span style={{ color:SCSS.textSecondary }}>{fmtE(g.current || totalPortfolio)}</span>
                  <span style={{ color:g.color||SCSS.accentCyan, fontWeight:700 }}>{pctVal.toFixed(0)}%</span>
                  <span style={{ color:SCSS.textSecondary }}>{fmtE(g.target)}</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width:`${pctVal}%`, background:`linear-gradient(90deg, ${g.color||SCSS.accentCyan}88, ${g.color||SCSS.accentCyan})` }} />
                </div>
                <div style={{ marginTop:10, fontSize:12, color:SCSS.textMuted }}>
                  Reste : <span style={{ color:SCSS.textSecondary }}>{fmtE(Math.max(0, rest))}</span>
                </div>
                {g.note && <div style={{ marginTop:10, fontSize:12, color:SCSS.textMuted, fontStyle:"italic" }}>{g.note}</div>}
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title={editing ? "Modifier l'objectif" : "Nouvel objectif"} onClose={() => setModal(false)}>
          <FormField label="Nom de l'objectif *"><input placeholder="ex : Retraite anticipée" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} /></FormField>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormField label="Montant cible (€)"><input type="number" placeholder="100000" value={form.target} onChange={e => setForm(f => ({...f, target:e.target.value}))} /></FormField>
            <FormField label="Montant actuel (€) — laisser vide = valeur du portefeuille"><input type="number" placeholder="0" value={form.current} onChange={e => setForm(f => ({...f, current:e.target.value}))} /></FormField>
            <FormField label="Échéance (date)"><input type="date" value={form.deadline} onChange={e => setForm(f => ({...f, deadline:e.target.value}))} /></FormField>
            <FormField label="Couleur">
              <div style={{ display:"flex", gap:8, marginTop:6 }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setForm(f => ({...f, color:c}))}
                    style={{ width:24, height:24, borderRadius:"50%", background:c, cursor:"pointer", border: form.color === c ? "2px solid #fff" : "2px solid transparent", transition:"border 0.15s" }} />
                ))}
              </div>
            </FormField>
          </div>
          <FormField label="Note"><textarea rows={2} placeholder="Description de l'objectif…" value={form.note} onChange={e => setForm(f => ({...f, note:e.target.value}))} /></FormField>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Goals;