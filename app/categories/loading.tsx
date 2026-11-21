import { Skeleton } from "@/components/ui/Skeleton";

export default function CategoriesLoading() {
  return (
    <div className="narrow">
      <header className="title-row">
        <div>
          <h1>Kategori</h1>
          <p className="title-sub">
            <Skeleton width="220px" height={12} />
          </p>
        </div>
      </header>

      <div className="tabs" aria-hidden="true">
        {[0, 1, 2].map((tab) => (
          <Skeleton key={tab} width="72px" height={14} />
        ))}
      </div>

      <section className="panel">
        <div className="panel-head">
          <h2>Semua kategori</h2>
        </div>
        <div style={{ display: "grid", gap: 14 }}>
          {[0, 1, 2, 3, 4, 5].map((row) => (
            <Skeleton key={row} height={18} width={row % 2 === 0 ? "86%" : "70%"} />
          ))}
        </div>
      </section>
    </div>
  );
}
