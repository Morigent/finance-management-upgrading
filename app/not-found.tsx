import Link from "next/link";
import { StateBlock } from "@/components/ui/StateBlock";

export default function NotFound() {
  return (
    <div className="narrow">
      <header className="title-row">
        <div>
          <h1>Halaman tidak ditemukan</h1>
          <p className="title-sub">Alamat ini tidak ada di Buku Kas.</p>
        </div>
      </header>
      <div className="panel">
        <StateBlock
          title="Tidak ada halaman di alamat itu."
          description="Periksa tautannya, atau kembali ke ringkasan saldo."
        >
          <Link className="btn sm" href="/">
            Kembali ke ringkasan
          </Link>
        </StateBlock>
      </div>
    </div>
  );
}
