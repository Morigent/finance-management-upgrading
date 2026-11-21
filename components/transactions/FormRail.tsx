import Link from "next/link";
import type { Paginated, Summary, Transaction } from "@/types/finance";
import { formatDate, formatRupiah, formatSignedRupiah, formatTimestamp } from "@/lib/format";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import { TypeBadge } from "@/components/ui/TypeBadge";

function RailPanel({
  title,
  action,
  children,
}: {
  readonly title: string;
  readonly action?: { href: string; label: string };
  readonly children: React.ReactNode;
}) {
  return (
    <section className="aside-block">
      <div className="aside-head">
        <h2>{title}</h2>
        {action ? (
          <Link className="link" href={action.href}>
            {action.label}
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function FormRail({
  summary,
  summaryFailed,
  recent,
  recentFailed,
  transaction,
}: {
  readonly summary?: Summary | null;
  readonly summaryFailed?: boolean;
  readonly recent: Paginated<Transaction> | null;
  readonly recentFailed: boolean;
  readonly transaction?: Transaction;
}) {
  return (
    <aside className="form-aside">
      {transaction ? (
        <RailPanel title="Jejak data">
          <dl className="key-values">
            <div>
              <dt>ID</dt>
              <dd className="figure">#{transaction.id}</dd>
            </div>
            <div>
              <dt>Kategori</dt>
              <dd>
                <TypeBadge type={transaction.type} />
              </dd>
            </div>
            <div>
              <dt>Dibuat</dt>
              <dd className="figure">{formatTimestamp(transaction.createdAt)}</dd>
            </div>
            <div>
              <dt>Diperbarui</dt>
              <dd className="figure">{formatTimestamp(transaction.updatedAt)}</dd>
            </div>
          </dl>
        </RailPanel>
      ) : (
        <RailPanel title="Bulan ini">
          {summary ? (
            <dl className="key-values">
              <div>
                <dt>Pemasukan</dt>
                <dd className="figure pos">{formatRupiah(summary.totalIncome)}</dd>
              </div>
              <div>
                <dt>Pengeluaran</dt>
                <dd className="figure">{formatRupiah(summary.totalExpense)}</dd>
              </div>
              <div>
                <dt>Saldo</dt>
                <dd className={`figure ${summary.balance < 0 ? "neg" : ""}`}>
                  {summary.balance < 0
                    ? `−${formatRupiah(summary.balance)}`
                    : formatRupiah(summary.balance)}
                </dd>
              </div>
            </dl>
          ) : summaryFailed ? (
            <StateBlock tone="error" title="Ringkasan bulan ini gagal dimuat.">
              <RetryButton />
            </StateBlock>
          ) : null}
        </RailPanel>
      )}

      <RailPanel title="Entri terakhir" action={{ href: "/transactions", label: "Lihat semua" }}>
        {recent && recent.data.length > 0 ? (
          <ul className="rail-rows">
            {recent.data.map((item) => (
              <li key={item.id}>
                <span className="rail-row-date">{formatDate(item.transactionDate)}</span>
                <span className="rail-row-title">{item.title}</span>
                <span className={`figure ${item.type === "income" ? "pos" : ""}`}>
                  {formatSignedRupiah(item.amount, item.type)}
                </span>
              </li>
            ))}
          </ul>
        ) : recentFailed ? (
          <StateBlock tone="error" title="Entri terakhir gagal dimuat.">
            <RetryButton />
          </StateBlock>
        ) : (
          <StateBlock title="Belum ada entri lain." />
        )}
      </RailPanel>
    </aside>
  );
}
