import type { Summary } from "@/types/finance";
import { formatRupiah } from "@/lib/format";

export function SummaryPanel({ summary }: { readonly summary: Summary }) {
  const income = summary.totalIncome;
  const expense = summary.totalExpense;
  const balance = summary.balance;
  const hasIncome = income > 0;
  const share = hasIncome ? (expense / income) * 100 : 0;
  const roundedShare = Math.round(share);
  const over = expense > income;

  const balanceClass = balance < 0 ? "neg" : balance === 0 ? "zero" : "";
  const balanceText = balance < 0 ? `−${formatRupiah(balance)}` : formatRupiah(balance);

  return (
    <section className="panel summary" aria-label="Ringkasan saldo">
      <div className="summary-grid">
        <div className="summary-cell">
          <p className="kpi-label">Pemasukan</p>
          <p className={`kpi-value figure ${income === 0 ? "zero" : "pos"}`}>
            {formatRupiah(income)}
          </p>
        </div>
        <div className="summary-cell">
          <p className="kpi-label">Pengeluaran</p>
          <p className={`kpi-value figure ${expense === 0 ? "zero" : "neg"}`}>
            {formatRupiah(expense)}
          </p>
        </div>
        <div className="summary-cell">
          <p className="kpi-label">Saldo</p>
          <p className={`kpi-value figure lead ${balanceClass}`}>{balanceText}</p>
        </div>
      </div>

      <div className="flow">
        {hasIncome ? (
          <>
            <div
              className="flow-track"
              role="img"
              aria-label={`Pengeluaran ${roundedShare}% dari pemasukan`}
            >
              <div
                className={`flow-fill${over ? " over" : ""}`}
                style={{ width: `${Math.min(100, Math.max(share, 0))}%` }}
              />
            </div>
            <div className="flow-meta">
              <span>
                Keluar <b className="figure">{roundedShare}%</b> dari pemasukan
              </span>
              <span>
                {over ? (
                  "Melebihi pemasukan"
                ) : (
                  <>
                    Sisa <b className="figure">{100 - roundedShare}%</b>
                  </>
                )}
              </span>
            </div>
          </>
        ) : (
          <div className="flow-meta">
            <span>
              {expense > 0
                ? "Belum ada pemasukan pada periode ini, jadi rasio tidak dihitung."
                : "Belum ada arus kas pada periode ini."}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
