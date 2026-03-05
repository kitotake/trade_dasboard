// ── src/data/accountData.ts ───────────────────────────────────────────────────
// Source unique de vérité pour tous les types de l'application.
// Les types dupliqués dans utils/types.ts ont été supprimés et remplacés
// par des re-exports depuis ce fichier.

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Investment {
  id: string;
  name: string;
  ticker?: string;
  type?: string;
  sector?: string;
  region?: string;
  invested?: number | string;
  current?: number | string;
  shares?: number | string;
  risk?: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: string;
  asset: string;
  amount?: number | string;
  shares?: number | string;
  price?: number | string;
  note?: string;
}

export interface Dividend {
  id: string;
  date: string;
  company: string;
  ticker?: string;
  amount?: number | string;
  type?: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  target?: number | string;
  current?: number | string;
  deadline?: string;
  color?: string;
  note?: string;
}

export interface Notification {
  id: string;
  type: string;
  msg: string;
  time: string;
}

export interface Profile {
  name?: string;
  email?: string;
  riskProfile?: string;
  horizon?: string;
  tax?: string;
  mainGoal?: string;
}

export interface AppSettings {
  currency?: string;
  dateFormat?: string;
  language?: string;
  notifDividends?: boolean;
  notifGoals?: boolean;
  notifPerf?: boolean;
  notifWeekly?: boolean;
}

export interface Accounts {
  pea?: number;
  cc?: number;
}

export interface PortfolioHistoryItem {
  label: string;
  value: number;
}

export interface AppData {
  investments: Investment[];
  transactions: Transaction[];
  dividends: Dividend[];
  goals: Goal[];
  notifications: Notification[];
  portfolioHistory: PortfolioHistoryItem[];
  accounts: Accounts;
  profile: Profile;
  settings: AppSettings;
}

// ── Storage ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = "trade-dashboard_data_v1";

const emptyData: AppData = {
  investments: [],
  transactions: [],
  dividends: [],
  goals: [],
  notifications: [],
  portfolioHistory: [],
  accounts: {},
  profile: {},
  settings: {},
};

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...emptyData, ...parsed };
  } catch {
    return emptyData;
  }
}

export function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn("[trade-dashboard] saveToStorage échoué :", err);
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Auto-snapshot : ajoute un point d'historique pour le mois courant si absent */
export function withAutoSnapshot(data: AppData): AppData {
  const total = (data.investments || []).reduce(
    (s, i) => s + (Number(i.current) || 0),
    0
  );
  if (total === 0) return data;

  const today = new Date().toLocaleDateString("fr-FR", {
    month: "short",
    year: "2-digit",
  });
  const history = data.portfolioHistory || [];
  const last = history[history.length - 1];

  if (last && last.label === today) {
    if (last.value === total) return data;
    return {
      ...data,
      portfolioHistory: [
        ...history.slice(0, -1),
        { label: today, value: total },
      ],
    };
  }

  return {
    ...data,
    portfolioHistory: [...history.slice(-23), { label: today, value: total }],
  };
}

export const initialData: AppData = loadFromStorage();