import Link from "next/link";
import type { Paginated, Transaction } from "@/types/finance";
import { formatDate, formatSignedRupiah } from "@/lib/format";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";

export function RecentLedger({
  page,
  failed,
}: {
  readonly page: Paginated<Transaction> | null;
  readonly failed: boolean;
}) {
  return (
    <section className="panel" aria-labelledby="recent-heading">
      <div className="panel-head">
        <h2 id="recent-heading">Transaksi terbaru</h2>
        <Link className="link" href="/transactions">
          Lihat semua
        </Link>
      </div>

      {failed ? (
        <StateBlock
          tone="error"
          title="Transaksi terbaru gagal dimuat."
          description="Data terakhir yang tampil mungkin sudah lama."
        >
          <RetryButton />
        </StateBlock>
      ) : page && page.data.length > 0 ? (
        <>
        <div className="table-wrap compact-hide">
          <table>
            <thead>
              <tr>
                <th scope="col">Tanggal</th>
                <th scope="col">Transaksi</th>
                <th scope="col">Kategori</th>
                <th scope="col" className="n">
                  Nominal
                </th>
              </tr>
            </thead>
            <tbody>
              {page.data.map((item) => (
                <tr key={item.id}>
                  <td className="date-cell">{formatDate(item.transactionDate)}</td>
                  <td>
                    <Link className="cell-title" href={`/transactions/${item.id}/edit`}>
                      <span className="truncate-title">{item.title}</span>
                    </Link>
                  </td>
                  <td className="cell-category">{item.category.name}</td>
                  <td className={`n figure ${item.type === "income" ? "pos" : ""}`}>
                    {formatSignedRupiah(item.amount, item.type)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="rowlist compact-only">
          {page.data.map((item) => (
            <li key={item.id}>
              <Link className="rl-title" href={`/transactions/${item.id}/edit`}>
                {item.title}
              </Link>
              <span className={`rl-value figure ${item.type === "income" ? "pos" : ""}`}>
                {formatSignedRupiah(item.amount, item.type)}
              </span>
              <span className="rl-meta">
                {formatDate(item.transactionDate)} · {item.category.name}
              </span>
            </li>
          ))}
        </ul>
        </>
      ) : (
        <StateBlock
          title="Belum ada transaksi."
          description="Catat pemasukan atau pengeluaran pertama untuk melihat saldo."
        >
          <Link className="link" href="/transactions/new">
            Tambah transaksi
          </Link>
        </StateBlock>
      )}
    </section>
  );
}
