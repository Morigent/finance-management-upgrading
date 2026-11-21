import { Skeleton } from "@/components/ui/Skeleton";

export default function TransactionFormLoading() {
  return (
    <>
      <header className="title-row">
        <div>
          <h1>Transaksi</h1>
          <p className="title-sub">
            <Skeleton width="200px" height={12} />
          </p>
        </div>
      </header>
      <div className="panel form-sheet">
        <div className="form-sheet-grid">
          <div className="form-fields">
            <div style={{ display: "grid", gap: 18 }}>
              <Skeleton width="120px" height={14} />
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={96} />
              <Skeleton width="160px" height={36} />
            </div>
          </div>
          <aside className="form-aside">
            <div style={{ display: "grid", gap: 12 }}>
              <Skeleton width="96px" height={14} />
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
