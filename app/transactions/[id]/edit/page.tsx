import Link from "next/link";
import { fetchCategories, fetchTransaction, fetchTransactions } from "@/lib/api";
import { describeError } from "@/lib/errors";
import { formatDate } from "@/lib/format";
import { FormRail } from "@/components/transactions/FormRail";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import type { Category, Paginated, Transaction } from "@/types/finance";

export const dynamic = "force-dynamic";

export default async function EditTransactionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const transactionId = Number(id);

  if (!Number.isInteger(transactionId) || transactionId <= 0) {
    return (
      <>
        <header className="title-row">
          <div>
            <h1>Ubah transaksi</h1>
          </div>
        </header>
        <div className="panel form-panel">
          <StateBlock title="Transaksi tidak ditemukan." description={`Tidak ada transaksi dengan id ${id}.`}>
            <Link className="btn sm" href="/transactions">
              Kembali ke daftar
            </Link>
          </StateBlock>
        </div>
      </>
    );
  }

  const [transactionResult, categoriesResult, recentResult] = await Promise.allSettled([
    fetchTransaction(transactionId),
    fetchCategories(),
    fetchTransactions({ limit: 5 }),
  ]);

  const transaction: Transaction | null =
    transactionResult.status === "fulfilled" ? transactionResult.value : null;
  const categories: Category[] | null =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const recent: Paginated<Transaction> | null =
    recentResult.status === "fulfilled" ? recentResult.value : null;
  const error =
    transactionResult.status === "rejected"
      ? describeError(transactionResult.reason)
      : categoriesResult.status === "rejected"
        ? describeError(categoriesResult.reason)
        : null;

  return (
    <>
      <header className="title-row">
        <div>
          <h1>Ubah transaksi</h1>
          <p className="title-sub">
            {transaction
              ? `${formatDate(transaction.transactionDate)} · ${transaction.category.name}`
              : "Memuat data transaksi."}
          </p>
        </div>
        <div className="title-actions">
          <Link className="btn ghost" href="/transactions">
            Kembali ke transaksi
          </Link>
        </div>
      </header>

      {transaction && categories ? (
        <TransactionForm
          categories={categories}
          transaction={transaction}
          rail={
            <FormRail
              recent={recent}
              recentFailed={recentResult.status === "rejected"}
              transaction={transaction}
            />
          }
        />
      ) : (
        <div className="panel form-panel">
          <StateBlock tone="error" title="Transaksi gagal dimuat." description={error ?? undefined}>
            <RetryButton />
          </StateBlock>
        </div>
      )}
    </>
  );
}
