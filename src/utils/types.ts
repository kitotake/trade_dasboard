import App from "../App";

export type AuthRoute = "welcome" | "login" | "register";

export type AppRoute =
  | "accueil"
  | "dashboard"
  | "portfolio"
  | "transactions"
  | "dividends"
  | "goals"
  | "analysis"
  | "simulation"
  | "reports"
  | "profile"
  | "settings";

export type RootState = {
  mode: "auth" | "app";
  entry: AuthRoute | AppRoute;
};

export type Navigator = {
  navigateToApp: (route: AppRoute) => void;
  navigateToAuth: (route: AuthRoute) => void;
};

export interface Investment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  price: number;
  date: string;
  ticker?: string;
  sector?: string;
  region?: string;
  risk?: string;
  notes?: string;
}   

export interface Transaction {
  id: string;
  date: string;
  type: string;
  asset: string;
  amount: number;
  shares?: number;
  price?: number;
  note?: string;
} 

export interface Dividend {
  id: string;
  date: string;
  company: string;
  ticker?: string;
  amount: number;
  type?: string;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
  color?: string;
  note?: string;
}

export interface Profile {
  name?: string;
  email?: string;
  riskProfile?: string;
  horizon?: string;
  tax?: string;
  mainGoal?: string;
} 
export interface AppData {
  investments: Investment[];
  transactions: Transaction[];
  dividends: Dividend[];
  goals: Goal[];
  notifications: Notification[];
  profile: Profile;
}
export type Notification = {
  id: string;
  type: string;
  msg: string;
  time: string;
};

export const emptyData: AppData = {
  investments: [],
  transactions: [],
  dividends: [],
  goals: [],
  notifications: [],
  profile: {},
};

export function loadData() {
  const STORAGE_KEY = "financeFlowData";
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyData;
  try {
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...emptyData, ...parsed };
  }
  catch {
    console.error("Failed to load data from localStorage, using empty data.");
    return emptyData;
  }
} 

export function saveData(data: AppData) {
  const STORAGE_KEY = "financeFlowData";
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.error("Failed to save data to localStorage.");
  }  
}
