"use client";

import { AlertIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  busy = false,
  error,
  onConfirm,
  onCancel,
}: {
  readonly open: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly busy?: boolean;
  readonly error?: string | null;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={busy ? () => {} : onCancel}
      footer={
        <>
          <button type="button" className="btn" onClick={onCancel} disabled={busy}>
            Batal
          </button>
          <button type="button" className="btn primary" onClick={onConfirm} disabled={busy}>
            {busy ? "Menghapus..." : confirmLabel}
          </button>
        </>
      }
    >
      <p className="dialog-sub">{description}</p>
      {error ? (
        <div className="banner" role="alert">
          <AlertIcon />
          <span>{error}</span>
        </div>
      ) : null}
    </Modal>
  );
}
