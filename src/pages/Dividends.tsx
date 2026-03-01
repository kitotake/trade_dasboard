import { useState, type FC } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import FormField from "../components/FormField";
import { SCSS } from "../utils/theme";
import { fmtE, uid } from "../utils/helpers";
import type { Dividend, AppData } from "../data/accountData";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface DividendsProps {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Dividends: FC<DividendsProps> = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const EMPTY: Dividend = { date: "", company: "", ticker: "", amount: "", type: "Dividende", note: "", id: "" };
  const [form, setForm] = useState<Dividend>(EMPTY);

  const dividends = data.dividends || [];
  const total = dividends.reduce((s, d) => s + (Number(d.amount) || 0), 0);
  const del = (id: string) => setData(d => ({ ...d, dividends: d.dividends.filter(x => x.id !== id) }));
  const save = () => {
    if (!form.date || !form.company) return;
    setData(d => ({
      ...d,
      dividends: [...(d.dividends || []), { ...form, id: uid() }].sort((a, b) => b.date.localeCompare(a.date)),
    }));
    setModal(false);
    setForm(EMPTY);
  };

  const byMonth: Record<string, number> = {};
  dividends.forEach(d => {
    const key = d.date?.slice(0, 7) || "—";
    byMonth[key] = (byMonth[key] || 0) + (Number(d.amount) || 0);
  });
  const chartData = Object.entries(byMonth).sort().map(([k, v]) => ({ label: k, value: v }));

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14, marginBottom: 28 }}>
        <div className="card fade-up">
          <div className="card-title">Total dividendes</div>
          <div className="kpi-value" style={{ color: total ? "#fff" : SCSS.textMuted }}>{fmtE(total)}</div>
        </div>
        <div className="card fade-up">
          <div className="card-title">Dernier reçu</div>
          <div className="kpi-value" style={{ color: dividends[0] ? "#fff" : SCSS.textMuted }}>
            {dividends[0] ? fmtE(dividends[0].amount) : "—"}
          </div>
          <div style={{ color: SCSS.textSecondary, fontSize: 12 }}>{dividends[0]?.company}</div>
        </div>
        <div className="card fade-up">
          <div className="card-title">Nb versements</div>
          <div className="kpi-value" style={{ color: dividends.length ? "#fff" : SCSS.textMuted }}>
            {dividends.length || "0"}
          </div>
        </div>
      </div>

      {chartData.length > 1 && (
        <div className="card fade-up" style={{ marginBottom: 24 }}>
          <div className="card-title">Dividendes par mois</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" stroke="rgba(255,255,255,0.18)" fontSize={11} />
              <YAxis stroke="rgba(255,255,255,0.18)" fontSize={11} />
              <Tooltip
                contentStyle={{ background: "#1a1d2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, color: "#fff", fontSize: 13 }}
                formatter={(v: any) => [fmtE(v)]}
              />
              <Bar dataKey="value" fill={SCSS.accentAmber} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <span style={{ color: SCSS.textSecondary, fontSize: 14 }}>
          {dividends.length} versement{dividends.length > 1 ? "s" : ""}
        </span>
        <button className="btn-primary" onClick={() => { setForm(EMPTY); setModal(true); }}>+ Ajouter un dividende</button>
      </div>

      <div className="card">
        {dividends.length === 0 ? (
          <EmptyState
            icon="💰"
            msg="Aucun dividende enregistré"
            sub="Ajoutez vos versements de dividendes, coupons, loyers…"
            cta="+ Ajouter"
            onCta={() => setModal(true)}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Société</th><th>Ticker</th><th>Montant</th><th>Type</th><th>Note</th><th></th>
              </tr>
            </thead>
            <tbody>
              {dividends.map(d => (
                <tr key={d.id}>
                  <td style={{ fontFamily: SCSS.fontMono, fontSize: 13 }}>{d.date}</td>
                  <td style={{ fontWeight: 600 }}>{d.company}</td>
                  <td style={{ fontFamily: SCSS.fontMono, color: SCSS.textMuted, fontSize: 12 }}>{d.ticker || "—"}</td>
                  <td style={{ color: SCSS.accentGreen, fontFamily: SCSS.fontMono, fontWeight: 700 }}>+{fmtE(d.amount)}</td>
                  <td><span className="badge badge-amber">{d.type}</span></td>
                  <td style={{ color: SCSS.textMuted, fontSize: 12 }}>{d.note || "—"}</td>
                  <td>
                    <button className="btn-danger" style={{ padding: "4px 10px", fontSize: 12 }} onClick={() => del(d.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <Modal title="Ajouter un dividende" onClose={() => setModal(false)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <FormField label="Date *">
              <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </FormField>
            <FormField label="Société *">
              <input placeholder="ex : Air Liquide" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
            </FormField>
            <FormField label="Ticker">
              <input placeholder="ex : AI.PA" value={form.ticker} onChange={e => setForm(f => ({ ...f, ticker: e.target.value }))} />
            </FormField>
            <FormField label="Montant (€)">
              <input type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </FormField>
            <FormField label="Type">
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {["Dividende", "Coupon", "Loyer SCPI", "Intérêts", "Autre"].map(t => <option key={t}>{t}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Note">
            <input placeholder="Optionnel…" value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} />
          </FormField>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
            <button className="btn-ghost" onClick={() => setModal(false)}>Annuler</button>
            <button className="btn-primary" onClick={save}>💾 Enregistrer</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Dividends;