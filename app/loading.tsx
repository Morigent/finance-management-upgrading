import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <>
      <header className="title-row">
        <div>
          <h1>Ringkasan</h1>
          <p className="title-sub">
            <Skeleton width="168px" height={12} />
          </p>
        </div>
      </header>

      <div className="toolbar">
        <span className="segmented" aria-hidden="true">
          <span style={{ width: 108, height: 32 }} />
        </span>
      </div>

      <section className="panel summary" aria-label="Memuat ringkasan saldo">
        <div className="summary-grid">
          {[0, 1, 2].map((cell) => (
            <div className="summary-cell" key={cell}>
              <Skeleton width="92px" height={13} />
              <div style={{ marginTop: 8 }}>
                <Skeleton width={cell === 2 ? "200px" : "150px"} height={cell === 2 ? 32 : 22} />
              </div>
            </div>
          ))}
        </div>
        <div className="flow">
          <Skeleton height={8} />
        </div>
      </section>

      <div className="split">
        <section className="panel">
          <div className="panel-head">
            <h2>Transaksi terbaru</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <Skeleton key={row} height={20} width={row % 2 === 0 ? "88%" : "72%"} />
            ))}
          </div>
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Kategori terpakai</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[0, 1, 2, 3, 4, 5].map((row) => (
              <Skeleton key={row} height={20} width={row % 2 === 0 ? "80%" : "64%"} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
