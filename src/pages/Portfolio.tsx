import React, { useState } from "react";
import KpiCard from "../components/KpiCard";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS, RISK_COLORS } from "../utils/theme";
import { fmtE, pct, uid } from "../utils/helpers";
import type { Investment, AppData } from "../data/accountData";

interface PortfolioProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Portfolio: React.FC<PortfolioProps> = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [detail, setDetail] = useState<string | null>(null);
  const EMPTY: Investment = { id: "", name:"", ticker:"", type:"Action", sector:"", region:"", invested:"", current:"", shares:"", risk:"Faible", notes:"" };
  const [form, setForm] = useState<Investment>(EMPTY);

  const investments = data.investments || [];
  const openAdd = () => { setForm(EMPTY); setEditing(null); setModal(true); };
  const openEdit = (inv: Investment) => { setForm({...inv}); setEditing(inv.id); setModal(true); };
  const del = (id: string) => setData(d => ({...d, investments: d.investments.filter(i => i.id !== id)}));

  const save = () => {
    if (!form.name) return;
    if (editing) {
      setData(d => ({...d, investments: d.investments.map(i => i.id === editing ? {...form, id:editing} : i)}));
    } else {
      setData(d => ({...d, investments: [...(d.investments||[]), {...form, id:uid()}]}));
    }
    setModal(false);
  };

  if (detail) {
    const inv = investments.find(i => i.id === detail)!;
    const p = parseFloat(pct(inv.invested, inv.current));
    const g = (+inv.current||0) - (+inv.invested||0);
    return (
      <div>
        <button className="btn-ghost" style={{ marginBottom:20 }} onClick={() => setDetail(null)}>← Retour</button>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
          <KpiCard icon="💵" label="Valeur actuelle" value={fmtE(inv.current)} color={SCSS.accentCyan} />
          <KpiCard icon="📉" label="Investi" value={fmtE(inv.invested)} color={SCSS.accentViolet} />
          <KpiCard icon="📈" label="Performance" value={`${p >= 0 ? "+" : ""}${p}%`} sub={`${g >= 0 ? "+" : ""}${fmtE(g)}`} color={p >= 0 ? SCSS.accentGreen : SCSS.accentRed} trend={p >= 0 ? "up" : "down"} />
        </div>
        <div className="card">
          <h2 style={{ fontFamily:SCSS.fontDisplay, marginBottom:4 }}>{inv.name}</h2>
          <div style={{ color:SCSS.textMuted, fontSize:13, marginBottom:20, fontFamily:SCSS.fontMono }}>{inv.ticker} · {inv.type} · {inv.sector} · {inv.region}</div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12 }}>
            {[
              ["Parts / Unités", inv.shares || "—"], ["Risque", inv.risk || "—"], ["Secteur", inv.sector || "—"],
              ["Région", inv.region || "—"], ["Type", inv.type || "—"]].map(([k,v]) => (
              <div key={k} style={{ background:"rgba(255,255,255,0.04)", borderRadius:SCSS.radiusSm, padding:"12px 16px" }}>
                <div style={{ color:SCSS.textMuted, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:5 }}>{k}</div>
                <div style={{ color:"#fff", fontWeight:600 }}>{v}</div>
              </div>
            ))}
          </div>
          {inv.notes && (
            <div style={{ marginTop:18, background:"rgba(255,255,255,0.04)", borderRadius:SCSS.radiusSm, padding:"14px 16px" }}>
              <div style={{ color:SCSS.textMuted, fontSize:11, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>Notes</div>
              <div style={{ color:SCSS.textSecondary, fontSize:14, lineHeight:1.6 }}>{inv.notes}</div>
            </div>
          )}
          <div style={{ marginTop:18, display:"flex", gap:10 }}>
            <button className="btn-primary" onClick={() => { openEdit(inv); setDetail(null); }}>✏️ Modifier</button>
            <button className="btn-danger" onClick={() => { del(inv.id); setDetail(null); }}>🗑 Supprimer</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div style={{ color:SCSS.textSecondary, fontSize:14 }}>{investments.length} position{investments.length > 1 ? "s" : ""}</div>
        <button className="btn-primary" onClick={openAdd}>+ Ajouter un investissement</button>
      </div>

      {investments.length === 0 ? (
        <div className="card"><EmptyState icon="📊" msg="Aucun investissement enregistré" sub="Ajoutez vos actions, ETF, obligations..." cta="+ Ajouter" onCta={openAdd} /></div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead><tr><th>Actif</th><th>Type</th><th>Investi</th><th>Valeur</th><th>Perf</th><th>Gain</th><th>Risque</th><th></th></tr></thead>
            <tbody>
              {investments.map(inv => {
                const p = parseFloat(pct(inv.invested, inv.current));
                const g = (+inv.current||0) - (+inv.invested||0);
                return (
                  <tr key={inv.id} style={{ cursor:"pointer" }}>
                    <td onClick={() => setDetail(inv.id)}>
                      <div style={{ fontWeight:600 }}>{inv.name || "—"}</div>
                      <div style={{ fontSize:11, color:SCSS.textMuted, fontFamily:SCSS.fontMono }}>{inv.ticker}</div>
                    </td>
                    <td><span className="badge badge-cyan">{inv.type}</span></td>
                    <td style={{ fontFamily:SCSS.fontMono }}>{fmtE(inv.invested)}</td>
                    <td style={{ fontFamily:SCSS.fontMono, fontWeight:600 }}>{fmtE(inv.current)}</td>
                    <td><span className={`badge ${p >= 0 ? "badge-green" : "badge-red"}`}>{p >= 0 ? "+" : ""}{p}%</span></td>
                    <td style={{ color:g >= 0 ? SCSS.accentGreen : SCSS.accentRed, fontFamily:SCSS.fontMono }}>{g >= 0 ? "+" : ""}{fmtE(g)}</td>
                    <td><span className="badge" style={{ background:`${RISK_COLORS[inv.risk]}18`, color:RISK_COLORS[inv.risk]||SCSS.textSecondary }}>{inv.risk}</span></td>
                    <td>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="btn-ghost" style={{ padding:"4px 10px", fontSize:12 }} onClick={() => openEdit(inv)}>✏️</button>
                        <button className="btn-danger" style={{ padding:"4px 10px", fontSize:12 }} onClick={() => del(inv.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={editing ? "Modifier l'investissement" : "Ajouter un investissement"} onClose={() => setModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormField label="Nom de l'actif *"><input placeholder="ex : LVMH" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} /></FormField>
            <FormField label="Ticker"><input placeholder="ex : MC.PA" value={form.ticker} onChange={e => setForm(f => ({...f, ticker:e.target.value}))} /></FormField>
            <FormField label="Type">
              <select value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))}>
                {['Action','ETF','Obligation','SCPI','Crypto','Autre'].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Secteur"><input placeholder="ex : Technologie" value={form.sector} onChange={e => setForm(f => ({...f, sector:e.target.value}))} /></FormField>
            <FormField label="Région"><input placeholder="ex : FR, US, Europe…" value={form.region} onChange={e => setForm(f => ({...f, region:e.target.value}))} /></FormField>
            <FormField label="Risque">
              <select value={form.risk} onChange={e => setForm(f => ({...f, risk:e.target.value}))}>
                {['Faible','Moyen','Élevé'].map(r => <option key={r}>{r}</option>)}
              </select>
            </FormField>
            <FormField label="Montant investi (€)"><input type="number" placeholder="0" value={form.invested} onChange={e => setForm(f => ({...f, invested:e.target.value}))} /></FormField>
            <FormField label="Valeur actuelle (€)"><input type="number" placeholder="0" value={form.current} onChange={e => setForm(f => ({...f, current:e.target.value}))} /></FormField>
            <FormField label="Nombre de parts"><input type="number" placeholder="0" value={form.shares} onChange={e => setForm(f => ({...f, shares:e.target.value}))} /></FormField>
          </div>
          <FormField label="Notes / Commentaire">
            <textarea rows={3} placeholder="Vos observations sur cet actif…" value={form.notes} onChange={e => setForm(f => ({...f, notes:e.target.value}))} />
          </FormField>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Portfolio;
