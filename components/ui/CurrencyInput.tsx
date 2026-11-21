"use client";

import { groupDigits, sanitizeAmount } from "@/lib/format";

export function CurrencyInput({
  id,
  value,
  onChange,
  invalid,
  describedBy,
}: {
  readonly id: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly invalid?: boolean;
  readonly describedBy?: string;
}) {
  return (
    <div className="amount-field" data-invalid={invalid ? "true" : undefined}>
      <span className="amount-prefix" aria-hidden="true">
        Rp
      </span>
      <input
        id={id}
        name={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={groupDigits(value)}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        placeholder="0"
        onChange={(event) => onChange(sanitizeAmount(event.target.value))}
      />
    </div>
  );
}
