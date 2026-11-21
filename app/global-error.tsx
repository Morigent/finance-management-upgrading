"use client";

import "./globals.css";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body>
        <main className="canvas" style={{ marginLeft: 0 }}>
          <div className="canvas-inner">
            <div className="narrow">
              <header className="title-row">
                <div>
                  <h1>Aplikasi gagal dimuat</h1>
                  <p className="title-sub">
                    Ada kesalahan di luar halaman data. Transaksi yang tersimpan di server tidak
                    terpengaruh.
                  </p>
                </div>
              </header>
              <div className="panel">
                <div className="state state-error" role="alert">
                  <strong>Halaman berhenti sebelum selesai dirender.</strong>
                  <span>Coba muat ulang; kalau tetap gagal, periksa koneksi ke API.</span>
                  <button type="button" className="btn sm" onClick={reset}>
                    Coba lagi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
