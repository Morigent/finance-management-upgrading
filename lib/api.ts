import type {
  Category,
  CategoryInput,
  CategoryQuery,
  Paginated,
  Summary,
  SummaryQuery,
  Transaction,
  TransactionInput,
  TransactionQuery,
  ApiFieldError,
} from "@/types/finance";

const PUBLIC_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000/api/v1";
const SERVER_BASE = process.env.API_BASE_URL;

function apiBase(): string {
  const base = (typeof window === "undefined" ? SERVER_BASE : undefined) ?? PUBLIC_BASE;
  return base.replace(/\/+$/, "");
}

export class ApiError extends Error {
  status: number;
  code: string;
  details: ApiFieldError[];

  constructor(status: number, code: string, message: string, details: ApiFieldError[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function readJson(text: string): unknown {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toApiError(status: number, payload: unknown): ApiError {
  if (payload && typeof payload === "object") {
    const body = payload as Record<string, unknown>;
    return new ApiError(
      typeof body.statusCode === "number" ? body.statusCode : status,
      typeof body.code === "string" ? body.code : "INTERNAL_ERROR",
      typeof body.message === "string" ? body.message : "Permintaan gagal diproses.",
      Array.isArray(body.details) ? (body.details as ApiFieldError[]) : [],
    );
  }
  return new ApiError(status, "INTERNAL_ERROR", "Permintaan gagal diproses.");
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase()}${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
    });
  } catch {
    throw new ApiError(
      0,
      "NETWORK_ERROR",
      "Tidak dapat menghubungi server. Pastikan API berjalan.",
    );
  }

  if (response.status === 204) return undefined as T;

  const payload = readJson(await response.text());
  if (!response.ok) throw toApiError(response.status, payload);
  return payload as T;
}

function toQueryString(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function fetchSummary(query: SummaryQuery = {}): Promise<Summary> {
  return request<Summary>(`/transactions/summary${toQueryString(query)}`);
}

export function fetchTransactions(query: TransactionQuery = {}): Promise<Paginated<Transaction>> {
  return request<Paginated<Transaction>>(`/transactions${toQueryString(query)}`);
}

export function fetchTransaction(id: number): Promise<Transaction> {
  return request<Transaction>(`/transactions/${id}`);
}

export function createTransaction(input: TransactionInput): Promise<Transaction> {
  return request<Transaction>("/transactions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTransaction(id: number, input: TransactionInput): Promise<Transaction> {
  return request<Transaction>(`/transactions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteTransaction(id: number): Promise<void> {
  return request<void>(`/transactions/${id}`, { method: "DELETE" });
}

export function fetchCategories(query: CategoryQuery = {}): Promise<Category[]> {
  return request<{ data: Category[] }>(`/categories${toQueryString(query)}`).then(
    (payload) => payload.data,
  );
}

export function createCategory(input: CategoryInput): Promise<Category> {
  return request<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCategory(id: number, input: Partial<CategoryInput>): Promise<Category> {
  return request<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteCategory(id: number): Promise<void> {
  return request<void>(`/categories/${id}`, { method: "DELETE" });
}
