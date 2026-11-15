import { Suspense } from "react";
import ProductHeroBanner from "./ProductHeroBanner";
import ProductCatalogSection from "./ProductCatalogSection";
import ProductCtaBanner from "./ProductCtaBanner";
import { getActiveCatalogData, resolveCatalogSelection } from "@/lib/catalog";

export const revalidate = 60;

export const metadata = {
  title: "Mechanical Seals | Flow Guard EngTech Industries",
  description:
    "Precision engineered industrial sealing solutions for critical applications across diverse industries.",
};

async function ProductCatalogLoader({ categories, products, searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { initialCategoryId, initialProductId } = resolveCatalogSelection({
    categories,
    products,
    categoryParam: resolvedSearchParams?.category,
  });

  return (
    <ProductCatalogSection
      key={`${initialCategoryId ?? "none"}-${initialProductId ?? "none"}`}
      categories={categories}
      products={products}
      initialCategoryId={initialCategoryId}
      initialProductId={initialProductId}
    />
  );
}

export default async function ProductsPage({ searchParams }) {
  const { categories, products } = await getActiveCatalogData();

  return (
    <main className="bg-white min-h-screen">
      <ProductHeroBanner />
      <Suspense
        fallback={
          <ProductCatalogSection
            categories={categories}
            products={products}
            initialCategoryId={categories[0]?.id || null}
            initialProductId={null}
          />
        }
      >
        <ProductCatalogLoader
          categories={categories}
          products={products}
          searchParams={searchParams}
        />
      </Suspense>
      <ProductCtaBanner />
    </main>
  );
}
