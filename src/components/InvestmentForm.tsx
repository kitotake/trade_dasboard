// ── src/components/InvestmentForm.tsx ─────────────────────────────────────────
// Formulaire d'ajout / modification d'un investissement.
// Utilise un état local `FormValues` avec des strings pour les inputs numériques
// (nécessaire pour les champs contrôlés HTML), et expose `toInvestment()` pour
// convertir en Investment typé (numbers) au moment de la sauvegarde.

import type { FC } from "react";
import FormField from "./FormField";
import type { Investment } from "../data/accountData";

// ── Form state (string inputs pour éviter le bug "0 persistant" dans input) ──
export interface FormValues {
  name:     string;
  ticker:   string;
  type:     string;
  sector:   string;
  region:   string;
  risk:     string;
  invested: string;
  current:  string;
  shares:   string;
  notes:    string;
}

export const EMPTY_FORM: FormValues = {
  name: "", ticker: "", type: "Action", sector: "", region: "",
  risk: "Faible", invested: "", current: "", shares: "", notes: "",
};

/** Convertit les valeurs du formulaire en Investment (numbers vrais) */
export function formToInvestment(f: FormValues, id: string): Investment {
  return {
    id,
    name:     f.name,
    ticker:   f.ticker,
    type:     f.type,
    sector:   f.sector,
    region:   f.region,
    risk:     f.risk,
    invested: parseFloat(f.invested) || 0,
    current:  parseFloat(f.current)  || 0,
    shares:   parseFloat(f.shares)   || 0,
    notes:    f.notes,
  };
}

/** Convertit un Investment existant en FormValues pour édition */
export function investmentToForm(inv: Investment): FormValues {
  return {
    name:     inv.name        ?? "",
    ticker:   inv.ticker      ?? "",
    type:     inv.type        ?? "Action",
    sector:   inv.sector      ?? "",
    region:   inv.region      ?? "",
    risk:     inv.risk        ?? "Faible",
    invested: inv.invested != null ? String(inv.invested) : "",
    current:  inv.current  != null ? String(inv.current)  : "",
    shares:   inv.shares   != null ? String(inv.shares)   : "",
    notes:    inv.notes       ?? "",
  };
}

interface Props {
  form:    FormValues;
  setForm: React.Dispatch<React.SetStateAction<FormValues>>;
  onSave:  () => void;
  onClose: () => void;
}

const InvestmentForm: FC<Props> = ({ form, setForm, onSave, onClose }) => {
  const upd = <K extends keyof FormValues>(k: K, v: FormValues[K]) =>
    setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <FormField label="Nom de l'actif *">
          <input
            aria-label="Nom de l'actif"
            placeholder="ex : LVMH"
            value={form.name}
            onChange={e => upd("name", e.target.value)}
          />
        </FormField>

        <FormField label="Ticker / ISIN">
          <input
            aria-label="Ticker ou ISIN"
            placeholder="ex : MC.PA"
            value={form.ticker}
            onChange={e => upd("ticker", e.target.value)}
          />
        </FormField>

        <FormField label="Type">
          <select aria-label="Type d'actif" value={form.type} onChange={e => upd("type", e.target.value)}>
            {["Action", "ETF", "Obligation", "SCPI", "Crypto", "Autre"].map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Secteur">
          <input
            aria-label="Secteur"
            placeholder="ex : Technologie"
            value={form.sector}
            onChange={e => upd("sector", e.target.value)}
          />
        </FormField>

        <FormField label="Région">
          <input
            aria-label="Région"
            placeholder="ex : FR, US, Europe…"
            value={form.region}
            onChange={e => upd("region", e.target.value)}
          />
        </FormField>

        <FormField label="Risque">
          <select aria-label="Niveau de risque" value={form.risk} onChange={e => upd("risk", e.target.value)}>
            {["Faible", "Moyen", "Élevé"].map(r => <option key={r}>{r}</option>)}
          </select>
        </FormField>

        <FormField label="Montant investi (€)">
          <input
            aria-label="Montant investi en euros"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={form.invested}
            onChange={e => upd("invested", e.target.value)}
          />
        </FormField>

        <FormField label="Valeur actuelle (€)">
          <input
            aria-label="Valeur actuelle en euros"
            type="number"
            min="0"
            step="0.01"
            placeholder="0"
            value={form.current}
            onChange={e => upd("current", e.target.value)}
          />
        </FormField>

        <FormField label="Nombre de parts">
          <input
            aria-label="Nombre de parts"
            type="number"
            min="0"
            step="any"
            placeholder="0"
            value={form.shares}
            onChange={e => upd("shares", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Notes / Commentaire">
        <textarea
          aria-label="Notes ou commentaires"
          rows={3}
          placeholder="Vos observations sur cet actif…"
          value={form.notes}
          onChange={e => upd("notes", e.target.value)}
        />
      </FormField>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-ghost" onClick={onClose} aria-label="Annuler">
          Annuler
        </button>
        <button
          className="btn-primary"
          onClick={onSave}
          disabled={!form.name.trim()}
          aria-label="Enregistrer l'investissement"
          style={{ opacity: form.name.trim() ? 1 : 0.5 }}
        >
          💾 Enregistrer
        </button>
      </div>
    </>
  );
};

export default InvestmentForm;