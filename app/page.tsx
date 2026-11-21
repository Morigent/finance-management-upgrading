import Link from "next/link";
import {
  fetchCategories,
  fetchSummary,
  fetchTransactions,
} from "@/lib/api";
import { formatClock, monthStartISO, todayISO } from "@/lib/format";
import { describeError } from "@/lib/errors";
import { CategoryUsage } from "@/components/dashboard/CategoryUsage";
import { RecentLedger } from "@/components/dashboard/RecentLedger";
import { SummaryPanel } from "@/components/dashboard/SummaryPanel";
import { PlusIcon } from "@/components/ui/icons";
import { RefreshButton, RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import type { Category, Paginated, Summary, Transaction } from "@/types/finance";

export const dynamic = "force-dynamic";

type Search = { periode?: string | string[] };

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;
  const monthOnly = params.periode === "bulan";
  const range = monthOnly
    ? { startDate: monthStartISO(), endDate: todayISO() }
    : {};

  const [summaryResult, latestResult, categoriesResult] = await Promise.allSettled([
    fetchSummary(range),
    fetchTransactions({ limit: 6 }),
    fetchCategories(),
  ]);

  const summary: Summary | null =
    summaryResult.status === "fulfilled" ? summaryResult.value : null;
  const summaryError: string | null =
    summaryResult.status === "rejected" ? describeError(summaryResult.reason) : null;

  const latest: Paginated<Transaction> | null =
    latestResult.status === "fulfilled" ? latestResult.value : null;
  const latestError = latestResult.status === "rejected";
  const categories: Category[] | null =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : null;
  const categoriesError = categoriesResult.status === "rejected";

  const periodLabel = monthOnly ? "bulan ini" : "sepanjang waktu";
  const sub = summary
    ? `${summary.transactionCount} transaksi ${periodLabel}`
    : `Ringkasan ${periodLabel}`;

  return (
    <>
      <header className="title-row">
        <div>
          <h1>Ringkasan</h1>
          <p className="title-sub">{sub}</p>
        </div>
        <div className="title-actions">
          <Link className="btn primary" href="/transactions/new">
            <PlusIcon />
            Tambah transaksi
          </Link>
        </div>
      </header>

      <div className="toolbar">
        <nav className="segmented" aria-label="Periode ringkasan">
          <Link href="/" aria-current={monthOnly ? undefined : "page"}>
            Semua waktu
          </Link>
          <Link href="/?periode=bulan" aria-current={monthOnly ? "page" : undefined}>
            Bulan ini
          </Link>
        </nav>
        <div className="toolbar-side">
          <span>Diperbarui {formatClock()} WIB</span>
          <RefreshButton />
        </div>
      </div>

      {summary ? (
        <SummaryPanel summary={summary} />
      ) : (
        <section className="panel" aria-label="Ringkasan saldo">
          <StateBlock tone="error" title="Ringkasan gagal dimuat." description={summaryError ?? undefined}>
            <RetryButton />
          </StateBlock>
        </section>
      )}

      <div className="split">
        <RecentLedger page={latest} failed={latestError} />
        <CategoryUsage categories={categories} failed={categoriesError} />
      </div>
    </>
  );
}
