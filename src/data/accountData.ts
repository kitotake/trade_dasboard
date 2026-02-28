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

// initial empty state to feed React
export const initialData: AppData = {
  investments: [],
  transactions: [],
  dividends: [],
  goals: [],
  notifications: [],
  portfolioHistory: [],
  accounts: { pea: null, cc: null },
  profile: {},
  settings: {},
};
