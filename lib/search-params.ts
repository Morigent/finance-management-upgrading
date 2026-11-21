import type { TransactionType } from "@/types/finance";

export type SearchParams = Record<string, string | string[] | undefined>;

export function readType(value: string | string[] | undefined): TransactionType | undefined {
  return value === "income" || value === "expense" ? value : undefined;
}

export function readPositiveInt(value: string | string[] | undefined): number | undefined {
  const text = Array.isArray(value) ? value[0] : value;
  if (!text) return undefined;
  const parsed = Number(text);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

export function readISODate(value: string | string[] | undefined): string | undefined {
  const text = Array.isArray(value) ? value[0] : value;
  return text && /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : undefined;
}

export function readPage(value: string | string[] | undefined): number {
  return readPositiveInt(value) ?? 1;
}
