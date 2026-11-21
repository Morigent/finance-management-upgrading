# Buku Kas — frontend Finance Management

Next.js App Router + TypeScript untuk aplikasi pencatatan pemasukan dan pengeluaran pada PRD
Finance Management. Repositori ini hanya berisi frontend; API NestJS berjalan terpisah.

## Prasyarat

- Node.js 22+
- API `finance-management-api` berjalan di `http://localhost:3000/api/v1` (lihat PRD 5.4)

## Menjalankan

```bash
npm install
cp .env.example .env.local
npm run dev -- -p 3001
```

Buka `http://localhost:3001`. Frontend memakai port 3001 agar CORS backend
(`CORS_ORIGIN=http://localhost:3001`) cocok.

Build produksi:

```bash
npm run build
npm run start -- -p 3001
```

Jika shell mengekspor `NODE_ENV=development`, `next build` gagal dengan
`Cannot read properties of null (reading 'useContext')`. Jalankan build dengan
`NODE_ENV=production`.

## Environment

| Variabel | Dipakai | Nilai development |
|---|---|---|
| `API_BASE_URL` | Server Components | `http://localhost:3000/api/v1` |
| `NEXT_PUBLIC_API_BASE_URL` | Client Components (mutasi) | `http://localhost:3000/api/v1` |

Versi node di `.env.example` hanya contoh; jangan commit `.env.local`.

## Rute

| Rute | Isi |
|---|---|
| `/` | Ringkasan saldo, arus kas, transaksi terbaru, kategori terpakai, pemilih periode |
| `/transactions` | Tabel transaksi, filter jenis/kategori/tanggal, pagination, ubah dan hapus |
| `/transactions/new` | Form tambah transaksi + ringkasan bulan ini dan entri terakhir |
| `/transactions/[id]/edit` | Form ubah transaksi + jejak data |
| `/categories` | Daftar kategori per jenis, modal tambah/ubah, hapus dengan konfirmasi |

Semua rute dinamis (`force-dynamic`): tidak ada data keuangan yang di-cache, setiap permintaan
membaca ulang API.

## Struktur

```text
app/                      rute App Router, layout, loading, error boundary
components/layout/        shell (rail desktop, bottom bar ponsel), wordmark
components/dashboard/     ringkasan, transaksi terbaru, kategori terpakai
components/transactions/  tabel, filter, form, rail konteks, aksi hapus
components/categories/    tabel + modal CRUD kategori
components/ui/            modal, konfirmasi, field, input rupiah, pagination, toast, state
lib/api.ts                satu-satunya klien HTTP (envelope error -> ApiError)
lib/errors.ts             pesan error per kode API (PRD 8.2)
lib/format.ts             rupiah, tanggal Indonesia, input nominal
lib/search-params.ts      parsing query string halaman
types/finance.ts          tipe kontrak API (PRD 8.3)
```

## Alur data

- Server Components mengambil data lewat `lib/api.ts` dengan `cache: "no-store"`.
- Form, modal, filter, dan aksi hapus adalah Client Components; mutasi memanggil `lib/api.ts`
  memakai `NEXT_PUBLIC_API_BASE_URL`, lalu `router.refresh()` agar ringkasan dan daftar ikut berubah.
- Error API dibaca dari envelope PRD 8.2: `code` diterjemahkan di `lib/errors.ts`, detail per field
  dipetakan ke input yang bersangkutan.
- Setiap blok punya state loading (skeleton dengan ukuran akhir), empty, dan error dengan tombol coba
  lagi. Filter yang kosong dibedakan dari data yang memang belum ada.

## Tampilan

Arah desain: *achromatic ledger* — chrome tanpa warna, angka rupiah dalam kolom monospace dengan
tabular figures, ground biru-abu `#f2f4f7`, satu warna semantik untuk pemasukan (hijau) dan
pengeluaran (merah) sesuai PRD 9.3, plus palet pil status. Token ada di `app/globals.css`; komponen
hanya memakai token.

Breakpoint: 1440, 768, 390. Di bawah 640px tabel transaksi dan kategori menjadi daftar dua baris; di
bawah 900px kolom jenis tabel transaksi disembunyikan; navigasi rail menjadi bottom bar di bawah
860px.

## Pemeriksaan

```bash
npm run lint
npm run build
```

`prd.md` memuat kontrak API, acceptance criteria, dan aturan bisnis yang menjadi acuan formulir dan
pesan error.
