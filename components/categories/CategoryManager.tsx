"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, TransactionType } from "@/types/finance";
import { formatNumber } from "@/lib/format";
import { createCategory, deleteCategory, updateCategory } from "@/lib/api";
import { describeError, fieldErrors } from "@/lib/errors";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Field } from "@/components/ui/Field";
import { AlertIcon, PlusIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/Modal";
import { StateBlock } from "@/components/ui/StateBlock";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { useToast } from "@/components/ui/Toast";

type DialogState =
  | { mode: "create" }
  | { mode: "edit"; category: Category }
  | null;

export function CategoryManager({
  categories,
  activeType,
}: {
  readonly categories: Category[];
  readonly activeType: TransactionType | undefined;
}) {
  const router = useRouter();
  const toast = useToast();
  const [dialog, setDialog] = useState<DialogState>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const incomeCount = categories.filter((category) => category.type === "income").length;
  const expenseCount = categories.length - incomeCount;
  const visible = activeType
    ? categories.filter((category) => category.type === activeType)
    : categories;
  const maxUsed = Math.max(1, ...visible.map((category) => category.transactionCount ?? 0));

  const tabs = [
    { href: "/categories", label: "Semua", count: categories.length, active: !activeType },
    {
      href: "/categories?jenis=income",
      label: "Pemasukan",
      count: incomeCount,
      active: activeType === "income",
    },
    {
      href: "/categories?jenis=expense",
      label: "Pengeluaran",
      count: expenseCount,
      active: activeType === "expense",
    },
  ];

  return (
    <>
      <header className="title-row">
        <div>
          <h1>Kategori</h1>
          <p className="title-sub">
            {formatNumber(categories.length)} kategori, {formatNumber(incomeCount)} pemasukan dan{" "}
            {formatNumber(expenseCount)} pengeluaran.
          </p>
        </div>
        <div className="title-actions">
          <button type="button" className="btn primary" onClick={() => setDialog({ mode: "create" })}>
            <PlusIcon />
            Tambah kategori
          </button>
        </div>
      </header>

      <nav className="tabs" aria-label="Saring kategori">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={tab.active ? "page" : undefined}
          >
            {tab.label}
            <span className="count">{formatNumber(tab.count)}</span>
          </Link>
        ))}
      </nav>

      <section className="panel" aria-labelledby="category-heading">
        <div className="panel-head">
          <h2 id="category-heading">
            {activeType === "income"
              ? "Kategori pemasukan"
              : activeType === "expense"
                ? "Kategori pengeluaran"
                : "Semua kategori"}
          </h2>
          <span className="panel-meta">
            {formatNumber(visible.length)} baris, diurutkan menurut nama
          </span>
        </div>

        {visible.length > 0 ? (
          <>
          <div className="table-wrap compact-hide">
            <table>
              <colgroup>
                <col style={{ width: "40%" }} />
                <col style={{ width: "16%" }} />
                <col style={{ width: "28%" }} />
                <col style={{ width: "16%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Nama</th>
                  <th scope="col">Jenis</th>
                  <th scope="col" className="n">
                    Transaksi
                  </th>
                  <th scope="col">
                    <span className="visually-hidden">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((category) => {
                  const used = category.transactionCount ?? 0;
                  return (
                    <tr key={category.id}>
                      <td className="cell-title">{category.name}</td>
                      <td>
                        <TypeBadge type={category.type} />
                      </td>
                      <td className="n">
                        <div className="usage-cell">
                          <span className="usage-track" aria-hidden="true">
                            <span
                              className={`usage-fill${used === maxUsed && used > 0 ? " top" : ""}`}
                              style={{ width: `${Math.round((used / maxUsed) * 100)}%` }}
                            />
                          </span>
                          <span className={`figure ${used === 0 ? "zero" : ""}`}>
                            {formatNumber(used)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="row-actions">
                          <button
                            type="button"
                            className="btn sm ghost"
                            aria-label={`Ubah kategori ${category.name}`}
                            onClick={() => setDialog({ mode: "edit", category })}
                          >
                            Ubah
                          </button>
                          <button
                            type="button"
                            className="btn sm ghost"
                            aria-label={`Hapus kategori ${category.name}`}
                            onClick={() => {
                              setDeleteError(null);
                              setDeleting(category);
                            }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <ul className="rowlist compact-only">
            {visible.map((category) => {
              const used = category.transactionCount ?? 0;
              return (
                <li key={category.id}>
                  <span className="rl-title">{category.name}</span>
                  <span className={`rl-value figure ${used === 0 ? "zero" : ""}`}>
                    {formatNumber(used)}
                  </span>
                  <span className="rl-meta">
                    <TypeBadge type={category.type} />
                  </span>
                  <span className="rl-actions">
                    <button
                      type="button"
                      className="btn sm ghost"
                      aria-label={`Ubah kategori ${category.name}`}
                      onClick={() => setDialog({ mode: "edit", category })}
                    >
                      Ubah
                    </button>
                    <button
                      type="button"
                      className="btn sm ghost"
                      aria-label={`Hapus kategori ${category.name}`}
                      onClick={() => {
                        setDeleteError(null);
                        setDeleting(category);
                      }}
                    >
                      Hapus
                    </button>
                  </span>
                </li>
              );
            })}
          </ul>
          </>
        ) : (
          <StateBlock
            title={
              activeType === "income"
                ? "Belum ada kategori pemasukan."
                : activeType === "expense"
                  ? "Belum ada kategori pengeluaran."
                  : "Belum ada kategori."
            }
            description="Transaksi perlu kategori, jadi buat minimal satu untuk setiap jenis."
          >
            <button
              type="button"
              className="btn sm"
              onClick={() => setDialog({ mode: "create" })}
            >
              Tambah kategori
            </button>
          </StateBlock>
        )}
      </section>

      <CategoryDialog
        key={dialog ? (dialog.mode === "edit" ? `edit-${dialog.category.id}` : "create") : "closed"}
        state={dialog}
        onClose={() => setDialog(null)}
        onSaved={(message) => {
          setDialog(null);
          toast.show(message);
          router.refresh();
        }}
      />

      <ConfirmDialog
        open={deleting !== null}
        title="Hapus kategori"
        description={
          deleting
            ? `"${deleting.name}" akan dihapus. ${
                (deleting.transactionCount ?? 0) > 0
                  ? `${formatNumber(deleting.transactionCount ?? 0)} transaksi memakai kategori ini, jadi server akan menolak penghapusan sampai transaksi itu dipindahkan atau dihapus.`
                  : "Kategori ini belum dipakai transaksi."
              }`
            : ""
        }
        confirmLabel="Hapus kategori"
        busy={deleteBusy}
        error={deleteError}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </>
  );

  async function confirmDelete() {
    if (!deleting) return;
    setDeleteBusy(true);
    setDeleteError(null);
    try {
      await deleteCategory(deleting.id);
      toast.show(`Kategori ${deleting.name} dihapus.`);
      setDeleting(null);
      router.refresh();
    } catch (caught) {
      setDeleteError(describeError(caught));
    } finally {
      setDeleteBusy(false);
    }
  }
}

function CategoryDialog({
  state,
  onClose,
  onSaved,
}: {
  readonly state: DialogState;
  readonly onClose: () => void;
  readonly onSaved: (message: string) => void;
}) {
  const editing = state?.mode === "edit" ? state.category : null;
  const [name, setName] = useState(editing?.name ?? "");
  const [type, setType] = useState<TransactionType>(editing?.type ?? "expense");
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const used = editing?.transactionCount ?? 0;
  const locked = Boolean(editing) && used > 0;

  function reset() {
    setName(editing?.name ?? "");
    setType(editing?.type ?? "expense");
    setError(null);
    setFieldError(null);
    setBusy(false);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setFieldError("Nama kategori wajib diisi.");
      return;
    }
    setBusy(true);
    setError(null);
    setFieldError(null);
    try {
      if (editing) {
        await updateCategory(editing.id, {
          name: trimmed,
          ...(type !== editing.type ? { type } : {}),
        });
        onSaved(`Kategori ${trimmed} diperbarui.`);
      } else {
        await createCategory({ name: trimmed, type });
        onSaved(`Kategori ${trimmed} ditambahkan.`);
      }
    } catch (caught) {
      setFieldError(fieldErrors(caught).name ?? null);
      setError(describeError(caught));
      setBusy(false);
    }
  }

  return (
    <Modal
      open={state !== null}
      title={editing ? "Ubah kategori" : "Kategori baru"}
      subtitle={
        editing
          ? "Nama bisa diubah kapan saja. Jenis hanya sebelum kategori dipakai transaksi."
          : "Kategori membantu memisahkan pemasukan dari pengeluaran."
      }
      onClose={() => {
        reset();
        onClose();
      }}
      footer={
        <>
          <button
            type="button"
            className="btn"
            onClick={() => {
              reset();
              onClose();
            }}
            disabled={busy}
          >
            Batal
          </button>
          <button type="submit" form="category-form" className="btn primary" disabled={busy}>
            {busy ? "Menyimpan..." : "Simpan"}
          </button>
        </>
      }
    >
      <form id="category-form" onSubmit={submit} className="form-grid" noValidate>
        {error ? (
          <div className="banner" role="alert">
            <AlertIcon />
            <span>{error}</span>
          </div>
        ) : null}

        <Field id="category-name" label="Nama" error={fieldError ?? undefined}>
          {({ id, invalid, describedBy }) => (
            <input
              id={id}
              className="input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              maxLength={100}
              autoComplete="off"
              data-autofocus
            />
          )}
        </Field>

        <div className="segmented-block">
          <span className="field-label" id="category-type-label">
            Jenis
          </span>
          <div className="segmented" role="radiogroup" aria-labelledby="category-type-label">
            <label>
              <input
                type="radio"
                name="category-type"
                value="expense"
                checked={type === "expense"}
                disabled={locked}
                onChange={() => setType("expense")}
              />
              Pengeluaran
            </label>
            <label>
              <input
                type="radio"
                name="category-type"
                value="income"
                checked={type === "income"}
                disabled={locked}
                onChange={() => setType("income")}
              />
              Pemasukan
            </label>
          </div>
          {locked ? (
            <p className="field-hint">
              Jenis terkunci karena kategori ini sudah dipakai {formatNumber(used)} transaksi.
            </p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}
