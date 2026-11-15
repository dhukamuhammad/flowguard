import ProductHeroBanner from "../ProductHeroBanner";
import ProductCatalogSection from "../ProductCatalogSection";
import ProductCtaBanner from "../ProductCtaBanner";
import { getActiveCatalogData, resolveCatalogSelection } from "@/lib/catalog";

export const revalidate = 60;

/**
 * Pre-generate static routes for all active products & categories
 * so clicking any product in the catalog is instantaneous.
 */
export async function generateStaticParams() {
  try {
    const { categories, products } = await getActiveCatalogData();
    const params = [];
    (products || []).forEach((p) => {
      if (p.slug) params.push({ id: p.slug });
      params.push({ id: String(p.id) });
    });
    (categories || []).forEach((c) => {
      if (c.slug) params.push({ id: c.slug });
      params.push({ id: String(c.id) });
    });
    return params;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { categories, products } = await getActiveCatalogData();
  const { initialProductId, initialCategoryId, unmatchedSlug } =
    resolveCatalogSelection({
      categories,
      products,
      slugParam: resolvedParams?.id,
    });

  if (!unmatchedSlug) {
    const matchedProduct = products.find((p) => p.id === initialProductId);
    const matchedCategory = categories.find((c) => c.id === initialCategoryId);
    const label = matchedProduct?.title || matchedCategory?.title;
    if (label) {
      return {
        title: `${label} | Flow Guard EngTech Industries`,
        description:
          matchedProduct?.description ||
          `Precision engineered ${label} mechanical seal solutions from Flow Guard.`,
      };
    }
  }

  return {
    title: "Mechanical Seals | Flow Guard EngTech Industries",
    description:
      "Precision engineered industrial sealing solutions for critical applications across diverse industries.",
  };
}

export default async function ProductDetailPage({ params, searchParams }) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const { categories, products } = await getActiveCatalogData();
  const { initialCategoryId, initialProductId, unmatchedSlug } =
    resolveCatalogSelection({
      categories,
      products,
      slugParam: resolvedParams?.id,
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
        unmatchedSlug={unmatchedSlug}
      />
      <ProductCtaBanner />
    </main>
  );
}
