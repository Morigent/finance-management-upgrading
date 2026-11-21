import Link from "next/link";
import type { Category } from "@/types/finance";
import { formatNumber } from "@/lib/format";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";

export function CategoryUsage({
  categories,
  failed,
}: {
  readonly categories: Category[] | null;
  readonly failed: boolean;
}) {
  const ranked = [...(categories ?? [])]
    .sort((a, b) => (b.transactionCount ?? 0) - (a.transactionCount ?? 0))
    .slice(0, 6);

  return (
    <section className="panel" aria-labelledby="categories-heading">
      <div className="panel-head">
        <h2 id="categories-heading">Kategori terpakai</h2>
        <Link className="link" href="/categories">
          Kelola
        </Link>
      </div>

      {failed ? (
        <StateBlock
          tone="error"
          title="Kategori gagal dimuat."
          description="Ringkasan di atas tetap memakai data transaksi."
        >
          <RetryButton />
        </StateBlock>
      ) : ranked.length > 0 ? (
        <>
        <div className="table-wrap compact-hide">
          <table>
            <thead>
              <tr>
                <th scope="col">Kategori</th>
                <th scope="col">Jenis</th>
                <th scope="col" className="n">
                  Transaksi
                </th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((category) => (
                <tr key={category.id}>
                  <td className="cell-title">{category.name}</td>
                  <td className="cell-category">
                    {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </td>
                  <td className="n figure">{formatNumber(category.transactionCount ?? 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="rowlist compact-only">
          {ranked.map((category) => (
            <li key={category.id}>
              <span className="rl-title">{category.name}</span>
              <span className={`rl-value figure ${(category.transactionCount ?? 0) === 0 ? "zero" : ""}`}>
                {formatNumber(category.transactionCount ?? 0)}
              </span>
              <span className="rl-meta">
                {category.type === "income" ? "Pemasukan" : "Pengeluaran"}
              </span>
            </li>
          ))}
        </ul>
        </>
      ) : (
        <StateBlock
          title="Belum ada kategori."
          description="Setiap transaksi butuh kategori, jadi buat yang pertama dulu."
        >
          <Link className="link" href="/categories">
            Tambah kategori
          </Link>
        </StateBlock>
      )}
    </section>
  );
}
