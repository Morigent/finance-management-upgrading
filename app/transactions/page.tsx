import Link from "next/link";
import { fetchCategories, fetchTransactions } from "@/lib/api";
import { describeError } from "@/lib/errors";
import {
  readISODate,
  readPage,
  readPositiveInt,
  readType,
  type SearchParams,
} from "@/lib/search-params";
import { formatClock, formatDate, formatNumber, formatSignedRupiah } from "@/lib/format";
import { DeleteTransactionButton } from "@/components/transactions/DeleteTransactionButton";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { TransactionFilters } from "@/components/transactions/TransactionFilters";
import { PlusIcon } from "@/components/ui/icons";
import { Pagination } from "@/components/ui/Pagination";
import { RefreshButton, RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import { TypeBadge } from "@/components/ui/TypeBadge";
import type { Category, Paginated, Transaction } from "@/types/finance";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const type = readType(params.jenis);
  const categoryId = readPositiveInt(params.kategori);
  const startDate = readISODate(params.dari);
  const endDate = readISODate(params.sampai);
  const page = readPage(params.halaman);
  const filtered = Boolean(type || categoryId || startDate || endDate);

  const [listResult, categoriesResult] = await Promise.allSettled([
    fetchTransactions({ page, limit: PAGE_SIZE, type, categoryId, startDate, endDate }),
    fetchCategories(),
  ]);

  const list: Paginated<Transaction> | null =
    listResult.status === "fulfilled" ? listResult.value : null;
  const listError =
    listResult.status === "rejected" ? describeError(listResult.reason) : null;
  const categories: Category[] =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const total = list?.meta.total ?? 0;

  function hrefForPage(nextPage: number): string {
    const search = new URLSearchParams();
    if (type) search.set("jenis", type);
    if (categoryId) search.set("kategori", String(categoryId));
    if (startDate) search.set("dari", startDate);
    if (endDate) search.set("sampai", endDate);
    search.set("halaman", String(nextPage));
    return `/transactions?${search.toString()}`;
  }

  const filterKey = `${type ?? ""}|${categoryId ?? ""}|${startDate ?? ""}|${endDate ?? ""}`;

  return (
    <>
      <header className="title-row">
        <div>
          <h1>Transaksi</h1>
          <p className="title-sub">
            {filtered
              ? `${formatNumber(total)} hasil filter`
              : `${formatNumber(total)} transaksi tercatat`}
          </p>
        </div>
        <div className="title-actions">
          <Link className="btn primary" href="/transactions/new">
            <PlusIcon />
            Tambah transaksi
          </Link>
        </div>
      </header>

      <TransactionFilters
        key={filterKey}
        categories={categories}
        initialType={type}
        initialCategoryId={categoryId}
        initialStartDate={startDate}
        initialEndDate={endDate}
      />

      <section className="panel" aria-labelledby="ledger-heading">
        <div className="panel-head">
          <h2 id="ledger-heading">Daftar transaksi</h2>
          <span className="panel-tools">
            Diperbarui {formatClock()} WIB
            <RefreshButton />
          </span>
        </div>

        {listError ? (
          <StateBlock tone="error" title="Daftar transaksi gagal dimuat." description={listError}>
            <RetryButton />
          </StateBlock>
        ) : list && list.data.length > 0 ? (
          <>
            <div className="table-wrap ledger-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Tanggal</th>
                    <th scope="col">Transaksi</th>
                    <th scope="col">Kategori</th>
                    <th scope="col" className="col-type">
                      Jenis
                    </th>
                    <th scope="col" className="n">
                      Nominal
                    </th>
                    <th scope="col">
                      <span className="visually-hidden">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.map((item) => (
                    <TransactionRow key={item.id} item={item} />
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="ledger-cards">
              {list.data.map((item) => (
                <li key={item.id} className="ledger-card">
                  <div className="ledger-card-top">
                    <Link className="ledger-card-title" href={`/transactions/${item.id}/edit`}>
                      {item.title}
                    </Link>
                    <span className={`figure ${item.type === "income" ? "pos" : ""}`}>
                      {formatSignedRupiah(item.amount, item.type)}
                    </span>
                  </div>
                  <div className="ledger-card-meta">
                    <span>
                      {formatDate(item.transactionDate)} · {item.category.name}
                    </span>
                    <TypeBadge type={item.type} />
                  </div>
                  <div className="ledger-card-actions">
                    <Link className="btn sm ghost" href={`/transactions/${item.id}/edit`}>
                      Ubah
                    </Link>
                    <DeleteTransactionButton
                      id={item.id}
                      title={item.title}
                      amountLabel={formatSignedRupiah(item.amount, item.type)}
                    />
                  </div>
                </li>
              ))}
            </ul>

            <Pagination
              page={list.meta.page}
              limit={list.meta.limit}
              total={list.meta.total}
              buildHref={hrefForPage}
            />
          </>
        ) : page > 1 ? (
          <StateBlock
            title={`Halaman ${page} tidak berisi transaksi.`}
            description="Jumlah data berubah sejak halaman ini dibuka."
          >
            <Link className="btn sm" href={hrefForPage(1)}>
              Ke halaman 1
            </Link>
          </StateBlock>
        ) : filtered ? (
          <StateBlock
            title="Tidak ada transaksi untuk filter ini."
            description="Coba longgarkan jenis, kategori, atau rentang tanggal."
          >
            <Link className="btn sm" href="/transactions">
              Reset filter
            </Link>
          </StateBlock>
        ) : (
          <StateBlock
            title="Belum ada transaksi."
            description="Catatan pertama akan muncul di sini dan langsung mengubah saldo."
          >
            <Link className="btn sm" href="/transactions/new">
              Tambah transaksi
            </Link>
          </StateBlock>
        )}
      </section>
    </>
  );
}
