import { Skeleton } from "@/components/ui/Skeleton";

export default function TransactionsLoading() {
  return (
    <>
      <header className="title-row">
        <div>
          <h1>Transaksi</h1>
          <p className="title-sub">
            <Skeleton width="140px" height={12} />
          </p>
        </div>
      </header>

      <div className="filters" aria-hidden="true">
        {[0, 1, 2, 3].map((field) => (
          <div className="field" key={field}>
            <Skeleton width="56px" height={12} />
            <Skeleton width="132px" height={34} />
          </div>
        ))}
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Daftar transaksi</h2>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((row) => (
            <Skeleton key={row} height={18} width={row % 3 === 0 ? "92%" : "78%"} />
          ))}
        </div>
      </section>
    </>
  );
}
