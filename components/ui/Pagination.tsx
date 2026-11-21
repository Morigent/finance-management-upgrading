import Link from "next/link";
import { formatNumber } from "@/lib/format";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

export function Pagination({
  page,
  limit,
  total,
  buildHref,
}: {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly buildHref: (page: number) => string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const first = total === 0 ? 0 : (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <div className="pagination">
      <span className="range">
        {total === 0 ? "Tidak ada data" : `${formatNumber(first)}–${formatNumber(last)} dari ${formatNumber(total)}`}
      </span>
      <div className="controls">
        {page > 1 ? (
          <Link className="btn sm" href={buildHref(page - 1)} rel="prev">
            <ChevronLeftIcon />
            Sebelumnya
          </Link>
        ) : (
          <button type="button" className="btn sm" disabled>
            <ChevronLeftIcon />
            Sebelumnya
          </button>
        )}
        <span className="btn sm" aria-live="polite">
          {page} / {totalPages}
        </span>
        {page < totalPages ? (
          <Link className="btn sm" href={buildHref(page + 1)} rel="next">
            Berikutnya
            <ChevronRightIcon />
          </Link>
        ) : (
          <button type="button" className="btn sm" disabled>
            Berikutnya
            <ChevronRightIcon />
          </button>
        )}
      </div>
    </div>
  );
}
