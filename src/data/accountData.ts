// types for the app data state

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

export interface Settings {
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
  settings: Settings;
}

const STORAGE_KEY = "trade-dashboard_data_v1";

const emptyData: AppData = {
  investments: [],
  transactions: [],
  dividends: [],
  goals: [],
  notifications: [],
  portfolioHistory: [],
  accounts: { pea: undefined, cc: undefined },
  profile: {},
  settings: {},
};

function loadFromStorage(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    // Merge with emptyData to ensure all keys exist
    return { ...emptyData, ...parsed };
  } catch {
    return emptyData;
  }
}

export function saveToStorage(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // storage quota exceeded or unavailable
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Auto-snapshot: adds a portfolio history point for "today" if not already present */
export function withAutoSnapshot(data: AppData): AppData {
  const total = (data.investments || []).reduce((s, i) => s + (Number(i.current) || 0), 0);
  if (total === 0) return data;

  const today = new Date().toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
  const history = data.portfolioHistory || [];
  const last = history[history.length - 1];

  // Update existing snapshot for this period or add a new one
  if (last && last.label === today) {
    if (last.value === total) return data;
    const updated = [...history.slice(0, -1), { label: today, value: total }];
    return { ...data, portfolioHistory: updated };
  }

  // Keep max 24 points
  const trimmed = history.slice(-23);
  return { ...data, portfolioHistory: [...trimmed, { label: today, value: total }] };
}

// initial state — load from localStorage if available
export const initialData: AppData = loadFromStorage();