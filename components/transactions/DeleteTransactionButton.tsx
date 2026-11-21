"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteTransaction } from "@/lib/api";
import { describeError } from "@/lib/errors";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export function DeleteTransactionButton({
  id,
  title,
  amountLabel,
}: {
  readonly id: number;
  readonly title: string;
  readonly amountLabel: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await deleteTransaction(id);
      setOpen(false);
      toast.show("Transaksi dihapus.");
      router.refresh();
    } catch (caught) {
      setError(describeError(caught));
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn sm ghost"
        aria-label={`Hapus transaksi ${title}`}
        onClick={() => {
          setError(null);
          setOpen(true);
        }}
      >
        Hapus
      </button>
      <ConfirmDialog
        open={open}
        title="Hapus transaksi"
        description={`"${title}" (${amountLabel}) akan dihapus permanen dan ringkasan saldo ikut berubah.`}
        confirmLabel="Hapus transaksi"
        busy={busy}
        error={error}
        onCancel={() => setOpen(false)}
        onConfirm={confirm}
      />
    </>
  );
}
