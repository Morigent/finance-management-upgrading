"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProductMark } from "@/components/layout/ProductMark";
import { LedgerIcon, RowsIcon, TagIcon } from "@/components/ui/icons";

const NAV = [
  { href: "/", label: "Ringkasan", Icon: LedgerIcon },
  { href: "/transactions", label: "Transaksi", Icon: RowsIcon },
  { href: "/categories", label: "Kategori", Icon: TagIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { readonly children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="shell">
      <nav className="rail" aria-label="Navigasi utama">
        <Link href="/" className="rail-brand" aria-label="Buku Kas, ke ringkasan">
          <ProductMark className="rail-mark" />
          <span className="rail-wordmark">
            Buku
            <br />
            Kas
          </span>
        </Link>
        <div className="rail-nav">
          {NAV.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="rail-link"
              aria-current={isActive(pathname, href) ? "page" : undefined}
            >
              <Icon />
              <span className="rail-tip">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      <main className="canvas">
        <div className="canvas-inner">{children}</div>
      </main>

      <nav className="phone-nav" aria-label="Navigasi utama">
        {NAV.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={isActive(pathname, href) ? "page" : undefined}
          >
            <Icon />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
