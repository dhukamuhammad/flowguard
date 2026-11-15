import ProductHeroBanner from "./ProductHeroBanner";
import ProductCatalogSection from "./ProductCatalogSection";
import ProductCtaBanner from "./ProductCtaBanner";
import { getActiveCatalogData, resolveCatalogSelection } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mechanical Seals | Flow Guard EngTech Industries",
  description:
    "Precision engineered industrial sealing solutions for critical applications across diverse industries.",
};

export default async function ProductsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { categories, products } = await getActiveCatalogData();
  const { initialCategoryId, initialProductId } = resolveCatalogSelection({
    categories,
    products,
    categoryParam: resolvedSearchParams?.category,
  });

  return (
    <main className="bg-white min-h-screen">
      <ProductHeroBanner />
      <ProductCatalogSection
        key={`${initialCategoryId ?? "none"}-${initialProductId ?? "none"}`}
        categories={categories}
        products={products}
        initialCategoryId={initialCategoryId}
        initialProductId={initialProductId}
      />
      <ProductCtaBanner />
    </main>
  );
}
