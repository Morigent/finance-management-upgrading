export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
  type: TransactionType;
  transactionCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  /** YYYY-MM-DD, no time component */
  transactionDate: string;
  category: Pick<Category, "id" | "name" | "type">;
  createdAt: string;
  updatedAt: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionCount: number;
  period: {
    startDate: string | null;
    endDate: string | null;
  };
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}

export type TransactionSort =
  | "date_desc"
  | "date_asc"
  | "amount_desc"
  | "amount_asc";

export interface TransactionQuery {
  page?: number;
  limit?: number;
  type?: TransactionType;
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  sort?: TransactionSort;
}

export interface SummaryQuery {
  startDate?: string;
  endDate?: string;
  categoryId?: number;
}

export interface CategoryQuery {
  type?: TransactionType;
  search?: string;
}

export interface TransactionInput {
  title: string;
  amount: number;
  type: TransactionType;
  description: string | null;
  transactionDate: string;
  categoryId: number;
}

export interface CategoryInput {
  name: string;
  type: TransactionType;
}

export interface ApiFieldError {
  field: string;
  message: string;
}
