"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshIcon } from "@/components/ui/icons";

export function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn sm icon-only"
      aria-label="Muat ulang data"
      title="Muat ulang data"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
    >
      <RefreshIcon />
    </button>
  );
}

export function RetryButton({ label = "Coba lagi" }: { readonly label?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="btn sm"
      onClick={() => startTransition(() => router.refresh())}
      disabled={pending}
    >
      {pending ? "Memuat..." : label}
    </button>
  );
}
