import { fetchCategories } from "@/lib/api";
import { describeError } from "@/lib/errors";
import { readType, type SearchParams } from "@/lib/search-params";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { RetryButton } from "@/components/ui/RefreshButton";
import { StateBlock } from "@/components/ui/StateBlock";
import type { Category } from "@/types/finance";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeType = readType(params.jenis);

  let categories: Category[] | null = null;
  let error: string | null = null;

  try {
    categories = await fetchCategories();
  } catch (caught) {
    error = describeError(caught);
  }

  if (!categories) {
    return (
      <div className="narrow">
        <header className="title-row">
          <div>
            <h1>Kategori</h1>
            <p className="title-sub">Kelola kategori pemasukan dan pengeluaran.</p>
          </div>
        </header>
        <div className="panel">
          <StateBlock tone="error" title="Kategori gagal dimuat." description={error ?? undefined}>
            <RetryButton />
          </StateBlock>
        </div>
      </div>
    );
  }

  return (
    <div className="narrow">
      <CategoryManager categories={categories} activeType={activeType} />
    </div>
  );
}
