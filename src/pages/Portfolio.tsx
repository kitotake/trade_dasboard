// ── src/pages/Portfolio.tsx ────────────────────────────────────────────────────
// Orchestrateur principal du portefeuille.
// Toute la logique de parsing est dans utils/trParser.ts
// Les sous-composants :
//   • InvestmentTable   → tableau des positions
//   • InvestmentDetail  → vue détail d'une position
//   • InvestmentForm    → formulaire ajout / édition
//   • ImportModal       → import CSV / PDF Trade Republic

import { useState, type FC } from "react";
import EmptyState from "../components/EmptyState";
import Modal from "../components/Modal";
import InvestmentTable  from "../components/InvestmentTable.tsx/index.ts";
import InvestmentDetail from "../components/InvestmentDetail.tsx/index.ts";
import InvestmentForm, {
  EMPTY_FORM,
  formToInvestment,
  investmentToForm,
  type FormValues,
} from "../components/InvestmentForm.tsx";
import ImportModal from "../components/ImportModal";
import { SCSS } from "../utils/theme";
import { uid } from "../utils/helpers";
import type { Investment, AppData } from "../data/accountData";

interface PortfolioProps {
  data:    AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const Portfolio: FC<PortfolioProps> = ({ data, setData }) => {
  // ── UI state ───────────────────────────────────────────────────────────────
  const [detail,      setDetail]      = useState<string | null>(null);
  const [modalOpen,   setModalOpen]   = useState(false);
  const [importOpen,  setImportOpen]  = useState(false);
  const [editingId,   setEditingId]   = useState<string | null>(null);
  const [form,        setForm]        = useState<FormValues>(EMPTY_FORM);

  const investments = data.investments ?? [];

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalOpen(true);
  };

  const openEdit = (inv: Investment) => {
    setForm(investmentToForm(inv));
    setEditingId(inv.id);
    setDetail(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(d => ({ ...d, investments: d.investments.filter(i => i.id !== id) }));
    if (detail === id) setDetail(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingId) {
      setData(d => ({
        ...d,
        investments: d.investments.map(i =>
          i.id === editingId ? formToInvestment(form, editingId) : i
        ),
      }));
    } else {
      setData(d => ({
        ...d,
        investments: [...(d.investments ?? []), formToInvestment(form, uid())],
      }));
    }
    setModalOpen(false);
  };

  // ── Detail view ────────────────────────────────────────────────────────────
  if (detail) {
    const inv = investments.find(i => i.id === detail);
    if (!inv) { setDetail(null); return null; }
    return (
      <InvestmentDetail
        inv={inv}
        onBack={()       => setDetail(null)}
        onEdit={openEdit}
        onDelete={id     => { handleDelete(id); }}
      />
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Header bar ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <div style={{ color: SCSS.textSecondary, fontSize: 14 }} aria-live="polite">
          {investments.length} position{investments.length > 1 ? "s" : ""}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="btn-ghost"
            onClick={() => setImportOpen(true)}
            aria-label="Importer un fichier CSV ou PDF Trade Republic"
          >
            📥 Importer CSV / PDF
          </button>
          <button
            className="btn-primary"
            onClick={openAdd}
            aria-label="Ajouter un investissement manuellement"
          >
            + Ajouter un investissement
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      {investments.length === 0 ? (
        <div className="card">
          <EmptyState
            icon="📊"
            msg="Aucun investissement enregistré"
            sub="Ajoutez vos actions, ETF, obligations... ou importez votre relevé Trade Republic"
            cta="+ Ajouter"
            onCta={openAdd}
          />
          {/* Drop zone in empty state */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Zone de dépôt — cliquer ou glisser un fichier CSV ou PDF"
            style={{
              marginTop: 16,
              border: `2px dashed rgba(110,231,247,0.25)`,
              borderRadius: 12,
              padding: "24px 20px",
              textAlign: "center",
              color: SCSS.textMuted,
              fontSize: 13,
              cursor: "pointer",
              transition: "border-color 0.2s",
            }}
            onClick={() => setImportOpen(true)}
            onKeyDown={e => { if (e.key === "Enter" || e.key === " ") setImportOpen(true); }}
            onDragOver={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = SCSS.accentCyan;
            }}
            onDragLeave={e => {
              e.currentTarget.style.borderColor = "rgba(110,231,247,0.25)";
            }}
            onDrop={e => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "rgba(110,231,247,0.25)";
              setImportOpen(true);
            }}
          >
            📂 Déposez votre PDF ou CSV ici
          </div>
        </div>
      ) : (
        <div className="card">
          <InvestmentTable
            investments={investments}
            onEdit={openEdit}
            onDelete={handleDelete}
            onDetail={setDetail}
          />
        </div>
      )}

      {/* ── Add / Edit modal ── */}
      {modalOpen && (
        <Modal
          title={editingId ? "Modifier l'investissement" : "Ajouter un investissement"}
          onClose={() => setModalOpen(false)}
        >
          <InvestmentForm
            form={form}
            setForm={setForm}
            onSave={handleSave}
            onClose={() => setModalOpen(false)}
          />
        </Modal>
      )}

      {/* ── Import modal ── */}
      {importOpen && (
        <ImportModal
          onClose={() => setImportOpen(false)}
          onOpenAdd={openAdd}
          setData={setData}
        />
      )}
    </div>
  );
};

export default Portfolio;