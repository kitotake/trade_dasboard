// ── src/utils/trParser.ts ──────────────────────────────────────────────────────
// Parsers Trade Republic CSV & PDF, et helper de fusion d'investissements.
// Tous les montants/parts sont des `number` — aucune conversion externe nécessaire.

import { uid } from "./helpers";
import type { Investment } from "../data/accountData";

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Devine le type d'actif depuis le nom */
function guessAssetType(name: string): string {
  if (/ETF|UCITS|INDEX|STOXX|MSCI|S&P/i.test(name)) return "ETF";
  if (/MTN|BANQUE|BOND|OBL/i.test(name))             return "Obligation";
  return "Action";
}

/** Parse un montant français "26,42" ou "26.42" → 26.42 */
function parseFrAmount(raw: string): number {
  return parseFloat(raw.replace(/\s/g, "").replace(",", ".")) || 0;
}

/**
 * Fusionne une liste de nouveaux investissements parsés dans
 * une liste existante. Matching sur ISIN (ticker).
 * - Si l'ISIN existe déjà → additionne invested / current / shares
 * - Sinon → ajoute l'entrée
 */
export function mergeInvestments(
  existing: Investment[],
  incoming: Investment[]
): Investment[] {
  // Travaille sur une copie pour éviter les mutations
  const result: Investment[] = existing.map(e => ({ ...e }));
  const byIsin: Record<string, Investment> = {};
  result.forEach(inv => { if (inv.ticker) byIsin[inv.ticker] = inv; });

  for (const inc of incoming) {
    const key = inc.ticker;
    if (key && byIsin[key]) {
      const ex = byIsin[key];
      ex.invested = (Number(ex.invested) || 0) + (Number(inc.invested) || 0);
      ex.current  = (Number(ex.current)  || 0) + (Number(inc.current)  || 0);
      ex.shares   = (Number(ex.shares)   || 0) + (Number(inc.shares)   || 0);
    } else {
      result.push(inc);
      if (key) byIsin[key] = inc;
    }
  }
  return result;
}

// ── CSV parser ────────────────────────────────────────────────────────────────
/**
 * Parse un relevé Trade Republic au format CSV.
 * Format réel : Date;Type;Description;Entrée (€);Sortie (€);Solde (€)
 * Les achats : "Buy trade ISIN NOM, quantity: X"  dans la colonne Description.
 * Le montant investi = colonne Sortie (€).
 *
 * Parsing asynchrone par chunks (50 lignes) pour ne pas bloquer l'UI
 * sur de gros fichiers.
 */
export async function parseTradeRepublicCSV(text: string): Promise<Investment[]> {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (lines.length < 2) return [];

  const sep     = lines[0].includes(";") ? ";" : ",";
  const headers = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g, "").toLowerCase());

  const iDate   = headers.findIndex(h => h.startsWith("date"));
  const iType   = headers.findIndex(h => h.startsWith("type"));
  const iDesc   = headers.findIndex(h => h.includes("description"));
  const iSortie = headers.findIndex(h => h.includes("sortie"));

  const seen:   Record<string, Investment> = {};
  const result: Investment[] = [];

  // Regex : "Buy trade FR0011550185 BNP PARIBAS..."
  const buyRe = /buy\s+trade\s+([A-Z]{2}[A-Z0-9]{10})\s+(.*)/i;
  const CHUNK = 50;

  for (let i = 1; i < lines.length; i++) {
    // Yield control every CHUNK lines so the browser stays responsive
    if ((i % CHUNK) === 0) await new Promise(r => setTimeout(r, 0));

    const row  = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g, ""));
    const type = iType >= 0 ? (row[iType] ?? "") : "";
    const desc = iDesc >= 0 ? (row[iDesc] ?? "") : "";

    if (!/ex[eé]cution|execution/i.test(type)) continue;
    const buyMatch = buyRe.exec(desc);
    if (!buyMatch) continue;

    const isin   = buyMatch[1];
    const name   = buyMatch[2].replace(/,?\s*quantity\s*:\s*[\d.]+\s*$/i, "").trim() || isin;
    const amount = parseFrAmount(iSortie >= 0 ? (row[iSortie] ?? "0") : "0");
    const qtyM   = /quantity\s*:\s*([\d.]+)/i.exec(desc);
    const shares = qtyM ? parseFloat(qtyM[1]) : 1;
    const date   = iDate >= 0 ? (row[iDate] ?? "") : "";

    if (seen[isin]) {
      seen[isin].invested = (seen[isin].invested as number) + amount;
      seen[isin].current  = (seen[isin].current  as number) + amount;
      seen[isin].shares   = (seen[isin].shares   as number) + shares;
    } else {
      const inv: Investment = {
        id: uid(), name, ticker: isin,
        type: guessAssetType(name),
        sector: "", region: "",
        invested: amount, current: amount, shares,
        risk: "Moyen",
        notes: date ? `Import TR – ${date}` : "Import Trade Republic CSV",
      };
      seen[isin] = inv;
      result.push(inv);
    }
  }
  return result;
}

// ── PDF text parser ───────────────────────────────────────────────────────────
/**
 * Parse le texte brut extrait par pdf.js d'un relevé Trade Republic.
 * Format : "Buy trade ISIN NAME, quantity: QTY AMOUNT €"
 * Testé sur relevé réel → 13 actifs, 397,70 €
 */
export function parseTradeRepublicPDFText(text: string): Investment[] {
  const seen:   Record<string, Investment> = {};
  const result: Investment[] = [];

  // Ex: "Buy trade FR0011550185 BNP PARIBAS EASY..., quantity: 1 26,42 €"
  const re = /Buy\s+trade\s+([A-Z]{2}[A-Z0-9]{10})\s+(.*?),\s*quantity\s*:\s*([\d.]+)\s+([\d\s,]+)\s*€/gi;
  let m: RegExpExecArray | null;

  while ((m = re.exec(text)) !== null) {
    const isin   = m[1];
    const name   = m[2].trim();
    const shares = parseFloat(m[3]);
    const amount = parseFrAmount(m[4]);

    if (seen[isin]) {
      seen[isin].invested = (seen[isin].invested as number) + amount;
      seen[isin].current  = (seen[isin].current  as number) + amount;
      seen[isin].shares   = (seen[isin].shares   as number) + shares;
    } else {
      const inv: Investment = {
        id: uid(), name, ticker: isin,
        type: guessAssetType(name),
        sector: "", region: "",
        invested: amount, current: amount, shares,
        risk: "Moyen",
        notes: "Import Trade Republic PDF",
      };
      seen[isin] = inv;
      result.push(inv);
    }
  }
  return result;
}