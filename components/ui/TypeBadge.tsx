import type { TransactionType } from "@/types/finance";

export function TypeBadge({ type }: { readonly type: TransactionType }) {
  const income = type === "income";
  return (
    <span className={`pill ${income ? "pos" : "neg"}`}>
      {income ? "Pemasukan" : "Pengeluaran"}
    </span>
  );
}
