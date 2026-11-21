import type { TransactionType } from "@/types/finance";

export const AMOUNT_MAX = 9_999_999_999.99;

const whole = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const twoDecimals = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateLabel = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatNumber(value: number): string {
  return whole.format(value);
}

/** `Rp1.250.000` for whole amounts, `Rp1.250.000,50` when there is a fraction. */
export function formatRupiah(value: number): string {
  const abs = Math.abs(value);
  const digits = Number.isInteger(abs)
    ? whole.format(abs)
    : twoDecimals.format(abs);
  return `Rp${digits.replace(/\s/g, "")}`;
}

/** `+Rp4.500.000` for income, `−Rp45.000` for expense. */
export function formatSignedRupiah(
  value: number,
  type: TransactionType,
): string {
  const sign = type === "income" ? "+" : "−";
  return `${sign}${formatRupiah(value)}`;
}

/** `YYYY-MM-DD` read as a plain calendar date, never shifted through UTC. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return dateLabel.format(new Date(year, month - 1, day));
}

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function monthStartISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
}

export function formatClock(now: Date = new Date()): string {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/** ISO timestamp as `21 Nov 2026 11:04`, in the server's local time. */
export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return `${dateLabel.format(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/** Digit string with thousands separators, e.g. `45000` becomes `45.000`. */
export function groupDigits(digits: string): string {
  const [intPart, decimalPart] = digits.split(",");
  const grouped = intPart.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decimalPart !== undefined ? `${grouped},${decimalPart}` : grouped;
}

/** Keep digits and at most one decimal separator with two places. */
export function sanitizeAmount(raw: string): string {
  const cleaned = raw.replace(/[^\d,]/g, "");
  const [intPart, ...rest] = cleaned.split(",");
  const int = intPart.slice(0, 10);
  if (!rest.length) return int;
  return `${int},${rest.join("").slice(0, 2)}`;
}

export function parseAmount(digits: string): number | null {
  if (!digits.trim()) return null;
  const value = Number(digits.replace(",", "."));
  return Number.isFinite(value) ? value : null;
}
