// ── src/data/accountData.ts ───────────────────────────────────────────────────
// Source unique de vérité pour tous les types de l'application.
// Les données sont isolées par userId — chaque compte a son propre storage.

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

// ── Storage — isolé par userId ────────────────────────────────────────────────

const BASE_KEY = "trade-dashboard_data_v1";

/** Retourne la clé localStorage propre à l'utilisateur connecté */
function storageKey(userId?: string): string {
  return userId ? `${BASE_KEY}_${userId}` : BASE_KEY;
}

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

export function loadFromStorage(userId?: string): AppData {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...emptyData, ...parsed };
  } catch {
    return emptyData;
  }
}

export function saveToStorage(data: AppData, userId?: string): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(data));
  } catch (err) {
    console.warn("[trade-dashboard] saveToStorage échoué :", err);
  }
}

export function clearStorage(userId?: string): void {
  localStorage.removeItem(storageKey(userId));
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

// initialData sans userId — sera rechargé dans App.tsx une fois la session connue
export const initialData: AppData = emptyData;