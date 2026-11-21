"use client";

export default function AppError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <header className="title-row">
        <div>
          <h1>Halaman gagal dimuat</h1>
          <p className="title-sub">
            Ada kesalahan saat merender halaman ini. Data yang sudah tersimpan tidak berubah.
          </p>
        </div>
      </header>
      <div className="panel">
        <div className="state state-error" role="alert">
          <strong>Halaman berhenti sebelum selesai dirender.</strong>
          <span>Coba lagi; kalau tetap gagal, periksa koneksi ke API.</span>
          <button type="button" className="btn sm" onClick={reset}>
            Coba lagi
          </button>
        </div>
      </div>
    </>
  );
}
