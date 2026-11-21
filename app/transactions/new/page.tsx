import Link from "next/link";
import { fetchCategories, fetchSummary, fetchTransactions } from "@/lib/api";
import { monthStartISO, todayISO } from "@/lib/format";
import { describeError } from "@/lib/errors";
import { FormRail } from "@/components/transactions/FormRail";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import type { Category, Paginated, Summary, Transaction } from "@/types/finance";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage() {
  const [categoriesResult, summaryResult, recentResult] = await Promise.allSettled([
    fetchCategories(),
    fetchSummary({ startDate: monthStartISO(), endDate: todayISO() }),
    fetchTransactions({ limit: 5 }),
  ]);

  const categories: Category[] | null =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const summary: Summary | null =
    summaryResult.status === "fulfilled" ? summaryResult.value : null;
  const recent: Paginated<Transaction> | null =
    recentResult.status === "fulfilled" ? recentResult.value : null;
  const error =
    categoriesResult.status === "rejected" ? describeError(categoriesResult.reason) : null;

  return (
    <>
      <header className="title-row">
        <div>
          <h1>Tambah transaksi</h1>
          <p className="title-sub">Catat pemasukan atau pengeluaran baru.</p>
        </div>
        <div className="title-actions">
          <Link className="btn ghost" href="/transactions">
            Kembali ke transaksi
          </Link>
        </div>
      </header>

      {categories ? (
        <TransactionForm
          categories={categories}
          rail={
            <FormRail
              summary={summary}
              summaryFailed={summaryResult.status === "rejected"}
              recent={recent}
              recentFailed={recentResult.status === "rejected"}
            />
          }
        />
      ) : (
        <div className="panel form-panel">
          <StateBlock
            tone="error"
            title="Kategori gagal dimuat."
            description={error ?? undefined}
          >
            <RetryButton />
          </StateBlock>
        </div>
      )}
    </>
  );
}
