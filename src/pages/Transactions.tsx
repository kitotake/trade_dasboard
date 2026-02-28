import { useState, type Dispatch, type SetStateAction } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS, } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Transaction, AppData } from "../data/accountData";

interface TransactionsProps {
  data: AppData;
  setData: Dispatch<SetStateAction<AppData>>;
}

const Transactions: React.FC<TransactionsProps> = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const EMPTY: Transaction = { date:"", type:"Achat", asset:"", amount:"", shares:"", price:"", note:"", id:"" };
  const [form, setForm] = useState<Transaction>(EMPTY);

  const transactions = data.transactions || [];
  const save = () => {
    if (!form.date || !form.asset) return;
    setData(d => ({...d, transactions: [...(d.transactions||[]), {...form, id:uid()}].sort((a,b) => b.date.localeCompare(a.date))}));
    setModal(false); setForm(EMPTY);
  };
  const del = (id: string) => setData(d => ({...d, transactions: d.transactions.filter(t => t.id !== id)}));

  const TYPE_COLOR: Record<string,string> = { Achat:SCSS.accentGreen, Vente:SCSS.accentRed, Dividende:SCSS.accentAmber, Dépôt:SCSS.accentCyan, Retrait:"#F87171" };

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <div style={{ color:SCSS.textSecondary, fontSize:14 }}>{transactions.length} transaction{transactions.length > 1 ? "s" : ""}</div>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}>+ Ajouter</button>
      </div>

      <div className="card">
        {transactions.length === 0 ? (
          <EmptyState icon="↕️" msg="Aucune transaction" sub="Enregistrez vos achats, ventes, dividendes…" cta="+ Ajouter" onCta={() => setModal(true)} />
        ) : (
          <table className="data-table">
            <thead><tr><th>Date</th><th>Type</th><th>Actif</th><th>Montant</th><th>Parts</th><th>Prix unitaire</th><th>Note</th><th></th></tr></thead>
            <tbody>
              {transactions.map(t => (
                <tr key={t.id}>
                  <td style={{ fontFamily:SCSS.fontMono, fontSize:13 }}>{t.date}</td>
                  <td><span className="badge" style={{ background:`${TYPE_COLOR[t.type]}18`, color:TYPE_COLOR[t.type] }}>{t.type}</span></td>
                  <td style={{ fontWeight:600 }}>{t.asset}</td>
                  <td style={{ fontFamily:SCSS.fontMono }}>{fmtE(t.amount)}</td>
                  <td style={{ fontFamily:SCSS.fontMono }}>{t.shares || "—"}</td>
                  <td style={{ fontFamily:SCSS.fontMono }}>{t.price ? fmtE(t.price) : "—"}</td>
                  <td style={{ color:SCSS.textMuted, fontSize:12 }}>{t.note || "—"}</td>
                  <td><button className="btn-danger" style={{ padding:"4px 10px", fontSize:12 }} onClick={() => del(t.id)}>🗑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title="Nouvelle transaction" onClose={() => setModal(false)}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <FormField label="Date *"><input type="date" value={form.date} onChange={e => setForm(f => ({...f, date:e.target.value}))} /></FormField>
            <FormField label="Type">
              <select value={form.type} onChange={e => setForm(f => ({...f, type:e.target.value}))}>
                {["Achat","Vente","Dividende","Dépôt","Retrait","Autre"].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Actif / Libellé *"><input placeholder="ex : LVMH" value={form.asset} onChange={e => setForm(f => ({...f, asset:e.target.value}))} /></FormField>
            <FormField label="Montant (€)"><input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({...f, amount:e.target.value}))} /></FormField>
            <FormField label="Nombre de parts"><input type="number" placeholder="0" value={form.shares} onChange={e => setForm(f => ({...f, shares:e.target.value}))} /></FormField>
            <FormField label="Prix unitaire (€)"><input type="number" placeholder="0" value={form.price} onChange={e => setForm(f => ({...f, price:e.target.value}))} /></FormField>
          </div>
          <FormField label="Note"><input placeholder="Optionnel…" value={form.note} onChange={e => setForm(f => ({...f, note:e.target.value}))} /></FormField>
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:8 }}>
            <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Transactions;
