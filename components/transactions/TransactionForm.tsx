"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, Transaction, TransactionInput, TransactionType } from "@/types/finance";
import { AMOUNT_MAX, parseAmount, todayISO } from "@/lib/format";
import { createTransaction, updateTransaction } from "@/lib/api";
import { describeError, fieldErrors } from "@/lib/errors";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { Field } from "@/components/ui/Field";
import { AlertIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/Toast";

type Errors = Record<string, string>;

function amountToDigits(amount: number): string {
  return String(amount).replace(".", ",");
}

export function TransactionForm({
  categories,
  transaction,
  rail,
}: {
  readonly categories: Category[];
  readonly transaction?: Transaction;
  readonly rail?: React.ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  const editing = Boolean(transaction);

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "expense");
  const [title, setTitle] = useState(transaction?.title ?? "");
  const [amount, setAmount] = useState(
    transaction ? amountToDigits(transaction.amount) : "",
  );
  const [categoryId, setCategoryId] = useState(
    transaction ? String(transaction.category.id) : "",
  );
  const [date, setDate] = useState(transaction?.transactionDate ?? todayISO());
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [errors, setErrors] = useState<Errors>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const options = categories.filter((category) => category.type === type);

  function changeType(next: TransactionType) {
    setType(next);
    const selected = categories.find((category) => String(category.id) === categoryId);
    if (selected && selected.type !== next) setCategoryId("");
  }

  function validate(): Errors {
    const next: Errors = {};
    const trimmed = title.trim();
    const parsed = parseAmount(amount);
    if (!trimmed) next.title = "Judul wajib diisi.";
    else if (trimmed.length > 150) next.title = "Judul maksimal 150 karakter.";
    if (parsed === null) next.amount = "Nominal wajib diisi.";
    else if (parsed <= 0) next.amount = "Nominal harus lebih besar dari 0.";
    else if (parsed > AMOUNT_MAX) next.amount = "Nominal melebihi batas Rp9.999.999.999,99.";
    if (!categoryId) next.categoryId = "Pilih kategori yang sesuai.";
    if (!date) next.transactionDate = "Tanggal wajib diisi.";
    return next;
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    setBanner(null);
    if (Object.keys(nextErrors).length > 0) return;

    const payload: TransactionInput = {
      title: title.trim(),
      amount: parseAmount(amount) as number,
      type,
      description: description.trim() ? description.trim() : null,
      transactionDate: date,
      categoryId: Number(categoryId),
    };

    setSubmitting(true);
    try {
      if (transaction) await updateTransaction(transaction.id, payload);
      else await createTransaction(payload);
      toast.show(editing ? "Perubahan transaksi disimpan." : "Transaksi ditambahkan.");
      router.push("/transactions");
      router.refresh();
    } catch (caught) {
      setErrors(fieldErrors(caught));
      setBanner(describeError(caught));
      setSubmitting(false);
    }
  }

  return (
    <form className="panel form-sheet" onSubmit={submit} noValidate>
      <div className="form-sheet-grid">
        <div className="form-fields">
      <div className="form-grid">
        {banner ? (
          <div className="banner" role="alert">
            <AlertIcon />
            <span>{banner}</span>
          </div>
        ) : null}

        <div className="segmented-block">
          <span className="field-label" id="jenis-label">
            Jenis
          </span>
          <div className="segmented" role="radiogroup" aria-labelledby="jenis-label">
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={type === "expense"}
                onChange={() => changeType("expense")}
              />
              Pengeluaran
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={type === "income"}
                onChange={() => changeType("income")}
              />
              Pemasukan
            </label>
          </div>
        </div>

        <Field id="title" label="Judul" error={errors.title} hint="Maksimal 150 karakter.">
          {({ id, invalid, describedBy }) => (
            <input
              id={id}
              name={id}
              className="input"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              autoComplete="off"
              maxLength={150}
              data-autofocus
            />
          )}
        </Field>

        <div className="form-row">
          <Field id="amount" label="Nominal" error={errors.amount}>
            {({ id, invalid, describedBy }) => (
              <CurrencyInput
                id={id}
                value={amount}
                onChange={setAmount}
                invalid={invalid}
                describedBy={describedBy}
              />
            )}
          </Field>

          <Field id="transactionDate" label="Tanggal" error={errors.transactionDate}>
            {({ id, invalid, describedBy }) => (
              <input
                id={id}
                name={id}
                type="date"
                className="input"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
              />
            )}
          </Field>
        </div>

        <Field
          id="categoryId"
          label="Kategori"
          error={errors.categoryId}
          hint={
            options.length === 0
              ? undefined
              : "Hanya kategori dengan jenis yang sama yang tampil."
          }
        >
          {({ id, invalid, describedBy }) => (
            <select
              id={id}
              name={id}
              className="input"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              disabled={options.length === 0}
            >
              <option value="">
                {options.length === 0 ? "Belum ada kategori" : "Pilih kategori"}
              </option>
              {options.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </Field>

        {options.length === 0 ? (
          <div className="banner notice">
            <AlertIcon />
            <span>
              Belum ada kategori {type === "income" ? "pemasukan" : "pengeluaran"}.{" "}
              <Link className="link" href="/categories">
                Tambah kategori
              </Link>{" "}
              dulu, lalu kembali ke sini.
            </span>
          </div>
        ) : null}

        <Field
          id="description"
          label="Deskripsi (opsional)"
          error={errors.description}
          hint="Maksimal 5.000 karakter."
        >
          {({ id, invalid, describedBy }) => (
            <textarea
              id={id}
              name={id}
              className="input"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              maxLength={5000}
            />
          )}
        </Field>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn primary" disabled={submitting}>
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
        <Link className="btn ghost" href="/transactions">
          Batal
        </Link>
      </div>
        </div>
        {rail}
      </div>
    </form>
  );
}
