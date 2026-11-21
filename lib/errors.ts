import { ApiError } from "@/lib/api";

const MESSAGES: Record<string, string> = {
  VALIDATION_ERROR: "Ada isian yang belum sesuai.",
  TYPE_MISMATCH: "Jenis transaksi tidak cocok dengan jenis kategorinya.",
  CATEGORY_NOT_FOUND: "Kategori tidak ditemukan. Muat ulang halaman ini.",
  TRANSACTION_NOT_FOUND: "Transaksi tidak ditemukan. Muat ulang halaman ini.",
  DUPLICATE_CATEGORY: "Kategori dengan nama dan jenis itu sudah ada.",
  CATEGORY_IN_USE:
    "Kategori masih dipakai transaksi. Pindahkan atau hapus transaksi tersebut dulu.",
  CATEGORY_TYPE_LOCKED:
    "Jenis kategori tidak dapat diubah karena kategori ini sudah dipakai transaksi.",
  INTERNAL_ERROR: "Server gagal memproses permintaan. Coba lagi.",
  NETWORK_ERROR: "Tidak dapat menghubungi server. Periksa apakah API berjalan.",
};

/** The one sentence a person reads when a call fails. */
export function describeError(error: unknown): string {
  if (error instanceof ApiError) {
    return MESSAGES[error.code] ?? error.message ?? MESSAGES.INTERNAL_ERROR;
  }
  return "Terjadi kesalahan yang tidak terduga. Coba lagi.";
}

/** Server field errors keyed by the API's field names. */
export function fieldErrors(error: unknown): Record<string, string> {
  if (!(error instanceof ApiError)) return {};
  const errors: Record<string, string> = {};
  for (const detail of error.details) {
    if (!errors[detail.field]) errors[detail.field] = detail.message;
  }
  return errors;
}
