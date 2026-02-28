import React, { useState } from "react";
import { SCSS } from "../utils/theme";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { uid } from "../utils/helpers";
import type { Notification, AppData } from "../data/accountData";

interface NotificationsProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Notifications: React.FC<NotificationsProps> = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const EMPTY: Notification = { type:"info", msg:"", time:"", id:"" };
  const [form, setForm] = useState<Notification>(EMPTY);

  const notifs = data.notifications || [];
  const del = (id: string) => setData(d => ({...d, notifications: d.notifications.filter(n => n.id !== id)}));
  const save = () => {
    if (!form.msg) return;
    setData(d => ({...d, notifications: [{...form, id:uid(), time: new Date().toLocaleString("fr-FR")}, ...(d.notifications||[])]}));
    setModal(false);
  };

  const TYPE_CONFIG: Record<string,{color:string;icon:string}> = {
    info:     { color: SCSS.accentCyan,   icon: "ℹ️" },
    dividend: { color: SCSS.accentAmber,  icon: "💰" },
    alert:    { color: SCSS.accentRed,    icon: "⚠️" },
    goal:     { color: SCSS.accentGreen,  icon: "🎯" },
    perf:     { color: SCSS.accentViolet, icon: "📈" },
  };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div style={{ color:SCSS.textSecondary, fontSize:14 }}>{notifs.length} notification{notifs.length > 1 ? "s" : ""}</div>
        <div style={{ display:"flex", gap:10 }}>
          {notifs.length > 0 && <button className="btn-ghost" onClick={() => setData(d => ({...d, notifications:[]}))}>Tout effacer</button>}
          <button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}>+ Ajouter</button>
        </div>
      </div>

      {notifs.length === 0 ? (
        <div className="card"><EmptyState icon="🔔" msg="Aucune notification" sub="Créez des alertes personnalisées pour suivre vos investissements" cta="+ Créer une alerte" onCta={() => setModal(true)} /></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {notifs.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            return (
              <div key={n.id} className="notif-item">
                <div className="notif-dot" style={{ background: cfg.color }}>
                  <div style={{ position:"absolute", inset:0, borderRadius:"50%", background: cfg.color, animation:"pulseRing 1.5s ease-out infinite" }} />
                </div>
                <span style={{ fontSize:22, flexShrink:0 }}>{cfg.icon}</span>
                <div style={{ flex:1 }}>
                  <div style={{ color: "#fff", fontWeight:500, fontSize:14 }}>{n.msg}</div>
                  <div style={{ color:SCSS.textMuted, fontSize:12, marginTop:3 }}>{n.time}</div>
                </div>
                <button className="btn-ghost" style={{ padding:"4px 10px", fontSize:12, flexShrink:0 }} onClick={() => del(n.id)}>✕</button>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <Modal title="Créer une notification" onClose={() => setModal(false)}>
          <FormField label="Type">
            <select value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))}>
              {["info","dividend","alert","goal","perf"].map(t => <option key={t}>{t}</option>)}
            </select>
          </FormField>
          <FormField label="Message *"><textarea rows={3} placeholder="Contenu de la notification…" value={form.msg} onChange={e => setForm(f => ({...f, msg:e.target.value}))} /></FormField>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Créer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Notifications;
