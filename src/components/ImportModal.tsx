// ── src/components/ImportModal.tsx ────────────────────────────────────────────
// Modal d'import CSV / PDF Trade Republic.
// - Parsing asynchrone (non-bloquant via chunks + setTimeout)
// - Spinner animé pendant l'import
// - Fallback automatique CSV si le PDF ne trouve rien
// - aria-labels pour l'accessibilité

import { useState, useRef, type FC } from "react";
import Modal from "./Modal";
import { SCSS } from "../utils/theme";
import {
  parseTradeRepublicCSV,
  parseTradeRepublicPDFText,
  mergeInvestments,
} from "../utils/trParser";
import type { Investment, AppData } from "../data/accountData";

interface ImportModalProps {
  onClose:    () => void;
  onOpenAdd:  () => void;
  setData:    React.Dispatch<React.SetStateAction<AppData>>;
}

// ── Status types ──────────────────────────────────────────────────────────────
type StatusKind = "idle" | "loading" | "success" | "warn" | "error";

interface Status {
  kind:    StatusKind;
  message: string;
}

const STATUS_STYLES: Record<StatusKind, { bg: string; border: string; color: string }> = {
  idle:    { bg: "transparent",             border: "transparent",               color: SCSS.textMuted    },
  loading: { bg: "rgba(110,231,247,0.07)",  border: "rgba(110,231,247,0.2)",     color: SCSS.accentCyan   },
  success: { bg: "rgba(52,211,153,0.1)",    border: "rgba(52,211,153,0.2)",      color: SCSS.accentGreen  },
  warn:    { bg: "rgba(252,211,77,0.1)",    border: "rgba(252,211,77,0.2)",      color: SCSS.accentAmber  },
  error:   { bg: "rgba(248,113,113,0.1)",   border: "rgba(248,113,113,0.2)",     color: SCSS.accentRed    },
};

// ── pdf.js loader (singleton) ─────────────────────────────────────────────────
let pdfJsLoading: Promise<void> | null = null;

async function loadPdfJs(): Promise<void> {
  if ((window as any).pdfjsLib) return;
  if (!pdfJsLoading) {
    pdfJsLoading = new Promise<void>((resolve, reject) => {
      const script      = document.createElement("script");
      script.src        = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
      script.onload     = () => {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        resolve();
      };
      script.onerror    = () => reject(new Error("Impossible de charger pdf.js"));
      document.head.appendChild(script);
    });
  }
  return pdfJsLoading;
}

async function extractPdfText(file: File): Promise<string> {
  await loadPdfJs();
  const buffer = await file.arrayBuffer();
  const pdf    = await (window as any).pdfjsLib.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const page    = await pdf.getPage(p);
    const content = await page.getTextContent();
    pages.push(content.items.map((it: any) => it.str).join(" "));
  }
  return pages.join("\n");
}

// ── Component ─────────────────────────────────────────────────────────────────
const ImportModal: FC<ImportModalProps> = ({ onClose, onOpenAdd, setData }) => {
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLoading = status.kind === "loading";

  // ── Apply imported investments to app state ─────────────────────────────
  const applyImport = (parsed: Investment[]) => {
    if (parsed.length === 0) {
      setStatus({ kind: "warn", message: "⚠️ Aucun investissement détecté. Vérifiez le format du fichier." });
      return;
    }
    setData(d => ({ ...d, investments: mergeInvestments(d.investments || [], parsed) }));
    setStatus({ kind: "success", message: `✅ ${parsed.length} actif(s) importé(s) avec succès !` });
    setTimeout(onClose, 2000);
  };

  // ── Main file handler ───────────────────────────────────────────────────
  const handleFile = async (file: File) => {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";

    if (!["csv", "txt", "pdf"].includes(ext)) {
      setStatus({ kind: "error", message: "❌ Format non supporté. Utilisez un fichier .csv ou .pdf" });
      return;
    }

    setStatus({ kind: "loading", message: "Lecture du fichier…" });

    try {
      if (ext === "csv" || ext === "txt") {
        const text   = await file.text();
        const parsed = await parseTradeRepublicCSV(text);          // async (chunked)
        applyImport(parsed);

      } else {
        // PDF path
        setStatus({ kind: "loading", message: "Chargement pdf.js…" });
        const text = await extractPdfText(file);

        setStatus({ kind: "loading", message: "Analyse du PDF…" });
        const parsed = parseTradeRepublicPDFText(text);

        // Fallback : si le PDF ne donne rien, tenter de le lire comme CSV
        if (parsed.length === 0) {
          setStatus({ kind: "loading", message: "Tentative fallback CSV…" });
          const csvParsed = await parseTradeRepublicCSV(text);
          if (csvParsed.length > 0) {
            applyImport(csvParsed);
            return;
          }
          setStatus({
            kind: "warn",
            message: "⚠️ Aucun achat détecté dans le PDF. Essayez d'exporter en CSV depuis l'app Trade Republic.",
          });
          return;
        }
        applyImport(parsed);
      }
    } catch (err) {
      console.error("[ImportModal]", err);
      setStatus({ kind: "error", message: "❌ Erreur lors de l'import. Vérifiez le fichier et réessayez." });
    }
  };

  const ss = STATUS_STYLES[status.kind];

  return (
    <Modal
      title="📥 Importer Trade Republic"
      onClose={isLoading ? () => {} : onClose}
    >
      <div role="region" aria-label="Import de relevé Trade Republic" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Info banner ── */}
        <div style={{
          background: "rgba(110,231,247,0.06)",
          border: "1px solid rgba(110,231,247,0.15)",
          borderRadius: 10,
          padding: "12px 16px",
          fontSize: 13,
          color: SCSS.textSecondary,
          lineHeight: 1.7,
        }}>
          <strong style={{ color: SCSS.accentCyan }}>Formats supportés :</strong><br />
          <strong>CSV</strong> — Export depuis l'app Trade Republic <span style={{ color: SCSS.accentGreen, fontSize: 11 }}>(recommandé)</span><br />
          <strong>PDF</strong> — Relevé mensuel Trade Republic Bank GmbH<br />
          <span style={{ color: SCSS.textMuted, fontSize: 12 }}>
            Les achats multiples du même ISIN sont fusionnés automatiquement.
          </span>
        </div>

        {/* ── Drop zone ── */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Zone de dépôt de fichier — cliquer ou glisser un fichier CSV ou PDF"
          aria-disabled={isLoading}
          style={{
            border: `2px dashed rgba(110,231,247,0.3)`,
            borderRadius: 12,
            padding: "32px 20px",
            textAlign: "center",
            cursor: isLoading ? "not-allowed" : "pointer",
            transition: "border-color 0.2s, background 0.2s",
            opacity: isLoading ? 0.6 : 1,
          }}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          onKeyDown={e => { if (!isLoading && (e.key === "Enter" || e.key === " ")) fileInputRef.current?.click(); }}
          onDragOver={e => {
            if (isLoading) return;
            e.preventDefault();
            e.currentTarget.style.borderColor = SCSS.accentCyan;
            e.currentTarget.style.background   = "rgba(110,231,247,0.04)";
          }}
          onDragLeave={e => {
            e.currentTarget.style.borderColor = "rgba(110,231,247,0.3)";
            e.currentTarget.style.background   = "transparent";
          }}
          onDrop={e => {
            e.preventDefault();
            e.currentTarget.style.borderColor = "rgba(110,231,247,0.3)";
            e.currentTarget.style.background   = "transparent";
            if (!isLoading) handleFile(e.dataTransfer.files[0]);
          }}
        >
          {/* Spinner ou icône */}
          {isLoading ? (
            <div style={{
              width: 36, height: 36,
              border: `3px solid rgba(110,231,247,0.2)`,
              borderTopColor: SCSS.accentCyan,
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 10px",
            }} aria-hidden="true" />
          ) : (
            <div style={{ fontSize: 36, marginBottom: 10 }} aria-hidden="true">📂</div>
          )}

          <div style={{ color: SCSS.accentCyan, fontWeight: 700, marginBottom: 6 }}>
            {isLoading ? status.message : "Cliquer ou glisser votre fichier ici"}
          </div>
          {!isLoading && (
            <div style={{ color: SCSS.textMuted, fontSize: 12 }}>.csv · .pdf · .txt</div>
          )}
        </div>

        {/* ── Hidden file input ── */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.pdf,.txt"
          aria-hidden="true"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />

        {/* ── Status message ── */}
        {status.kind !== "idle" && !isLoading && (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: "12px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              background: ss.bg,
              color: ss.color,
              border: `1px solid ${ss.border}`,
            }}
          >
            {status.message}
          </div>
        )}

        {/* ── Manual fallback link ── */}
        {!isLoading && (
          <div style={{ fontSize: 12, color: SCSS.textMuted, textAlign: "center" }}>
            Ou{" "}
            <button
              style={{
                background: "none", border: "none", padding: 0,
                color: SCSS.accentCyan, cursor: "pointer",
                fontSize: 12, textDecoration: "underline",
              }}
              onClick={() => { onClose(); onOpenAdd(); }}
              aria-label="Ajouter un investissement manuellement"
            >
              ajouter manuellement
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportModal;