"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category, TransactionType } from "@/types/finance";

export function TransactionFilters({
  categories,
  initialType,
  initialCategoryId,
  initialStartDate,
  initialEndDate,
}: {
  readonly categories: Category[];
  readonly initialType: TransactionType | undefined;
  readonly initialCategoryId: number | undefined;
  readonly initialStartDate: string | undefined;
  readonly initialEndDate: string | undefined;
}) {
  const router = useRouter();
  const [type, setType] = useState<TransactionType | "">(initialType ?? "");
  const [categoryId, setCategoryId] = useState(initialCategoryId ? String(initialCategoryId) : "");

  const options = type ? categories.filter((category) => category.type === type) : categories;

  function apply(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const search = new URLSearchParams();
    for (const key of ["jenis", "kategori", "dari", "sampai"]) {
      const value = String(data.get(key) ?? "").trim();
      if (value) search.set(key, value);
    }
    const query = search.toString();
    router.push(query ? `/transactions?${query}` : "/transactions");
  }

  return (
    <form className="filters" action="/transactions" method="get" onSubmit={apply}>
      <div className="field">
        <label htmlFor="filter-jenis">Jenis</label>
        <select
          id="filter-jenis"
          name="jenis"
          className="input"
          value={type}
          onChange={(event) => {
            const next = event.target.value as TransactionType | "";
            setType(next);
            const selected = categories.find((category) => String(category.id) === categoryId);
            if (next && selected && selected.type !== next) setCategoryId("");
          }}
        >
          <option value="">Semua jenis</option>
          <option value="income">Pemasukan</option>
          <option value="expense">Pengeluaran</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="filter-kategori">Kategori</label>
        <select
          id="filter-kategori"
          name="kategori"
          className="input"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
        >
          <option value="">Semua kategori</option>
          {options.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="range-fields">
        <div className="field">
          <label htmlFor="filter-dari">Dari</label>
          <input
            id="filter-dari"
            name="dari"
            type="date"
            className="input"
            defaultValue={initialStartDate ?? ""}
          />
        </div>
        <div className="field">
          <label htmlFor="filter-sampai">Sampai</label>
          <input
            id="filter-sampai"
            name="sampai"
            type="date"
            className="input"
            defaultValue={initialEndDate ?? ""}
          />
        </div>
      </div>

      <div className="spacer" />

      <div className="filter-actions">
        <button type="submit" className="btn">
          Terapkan
        </button>
        <Link className="btn ghost" href="/transactions">
          Reset
        </Link>
      </div>
    </form>
  );
}
