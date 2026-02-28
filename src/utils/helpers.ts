export const fmt = (v: any, dec = 2): string =>
  v == null ? "—" : Number(v).toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
export const fmtE = (v: any): string =>
  v == null || v === "" ? "—" : `${fmt(v)} €`;
export const pct = (invested: any, current: any): string => {
  const i = Number(invested) || 0;
  const c = Number(current) || 0;
  return i > 0 ? (((c - i) / i) * 100).toFixed(2) : "0.00";
};
export const uid = (): string => Math.random().toString(36).slice(2, 9);
