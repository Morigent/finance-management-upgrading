"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Transaction } from "@/types/finance";
import { formatDate, formatSignedRupiah } from "@/lib/format";
import { DeleteTransactionButton } from "@/components/transactions/DeleteTransactionButton";
import { TypeBadge } from "@/components/ui/TypeBadge";

export function TransactionRow({ item }: { readonly item: Transaction }) {
  const router = useRouter();

  return (
    <tr
      data-clickable="true"
      onClick={(event) => {
        if ((event.target as HTMLElement).closest("a, button")) return;
        router.push(`/transactions/${item.id}/edit`);
      }}
    >
      <td className="date-cell">{formatDate(item.transactionDate)}</td>
      <td>
        <Link className="cell-title" href={`/transactions/${item.id}/edit`}>
          <span className="truncate-title">{item.title}</span>
        </Link>
        {item.description ? <span className="cell-sub">{item.description}</span> : null}
      </td>
      <td className="cell-category">{item.category.name}</td>
      <td className="col-type">
        <TypeBadge type={item.type} />
      </td>
      <td className={`n figure ${item.type === "income" ? "pos" : ""}`}>
        {formatSignedRupiah(item.amount, item.type)}
      </td>
      <td>
        <div className="row-actions">
          <Link className="btn sm ghost" href={`/transactions/${item.id}/edit`}>
            Ubah
          </Link>
          <DeleteTransactionButton
            id={item.id}
            title={item.title}
            amountLabel={formatSignedRupiah(item.amount, item.type)}
          />
        </div>
      </td>
    </tr>
  );
}
