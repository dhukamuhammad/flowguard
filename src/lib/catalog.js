import { supabase } from "@/lib/supabase";
import {
  slugify,
  normalizeStringArray,
  normalizeOperatingLimits,
  normalizeExtraSections,
} from "@/lib/productUtils";

export const DEFAULT_CATEGORY_THUMB = "/client/home/seal-product.png";
export const DEFAULT_PRODUCT_IMAGE = "/client/product/Seals.png";
export const DEFAULT_SIDEBAR_THUMB = "/client/oue mechanicle.png";

let catalogCache = null;
let catalogCacheTime = 0;
const CATALOG_CACHE_TTL = 60 * 1000; // 60s in-memory cache

export function clearCatalogCache() {
  catalogCache = null;
  catalogCacheTime = 0;
}

/**
 * Normalizes a single database product row so client components receive
 * strictly typed arrays/strings without null surprises.
 */
function normalizeProduct(row) {
  const images = normalizeStringArray(row?.images);
  return {
    id: row.id,
    category_id: row.category_id,
    title: row.title || "Untitled Seal",
    slug: row.slug || slugify(row.title || "") || String(row.id),
    images: images.length > 0 ? images : [DEFAULT_PRODUCT_IMAGE],
    sectors: normalizeStringArray(row?.sectors),
    description: typeof row?.description === "string" ? row.description.trim() : "",
    characteristics: normalizeStringArray(row?.characteristics),
    operating_limits: normalizeOperatingLimits(row?.operating_limits),
    extra_sections: normalizeExtraSections(row?.extra_sections),
    status: row.status,
    created_at: row.created_at,
  };
}

/**
 * Fetches all active (status = 1) categories and their active (status = 1) products
 * directly from Supabase. Products belonging to inactive categories are excluded.
 */
export async function getActiveCatalogData() {
  if (catalogCache && Date.now() - catalogCacheTime < CATALOG_CACHE_TTL) {
    return catalogCache;
  }

  try {
    const [{ data: categoryRows, error: catErr }, { data: productRows, error: prodErr }] =
      await Promise.all([
        supabase
          .from("categories")
          .select("id, title, status, created_at")
          .eq("status", 1)
          .order("id", { ascending: true }),
        supabase
          .from("products")
          .select(
            "id, category_id, title, slug, images, sectors, description, characteristics, operating_limits, extra_sections, status, created_at"
          )
          .eq("status", 1)
          .order("id", { ascending: true }),
      ]);

    if (catErr || prodErr) {
      console.error("Catalog fetch error:", catErr?.message || prodErr?.message);
      return { categories: [], products: [] };
    }

    const activeCategoryIds = new Set((categoryRows || []).map((c) => c.id));
    const normalizedProducts = (productRows || [])
      .filter((p) => activeCategoryIds.has(p.category_id))
      .map(normalizeProduct);

    const productsByCategory = {};
    for (const prod of normalizedProducts) {
      if (!productsByCategory[prod.category_id]) {
        productsByCategory[prod.category_id] = [];
      }
      productsByCategory[prod.category_id].push(prod);
    }

    const enrichedCategories = (categoryRows || []).map((cat) => {
      const catProducts = productsByCategory[cat.id] || [];
      return {
        ...cat,
        slug: slugify(cat.title) || String(cat.id),
        products: catProducts,
        products_count: catProducts.length,
        thumbnail: catProducts[0]?.images?.[0] || DEFAULT_CATEGORY_THUMB,
      };
    });

    const result = {
      categories: enrichedCategories,
      products: normalizedProducts,
    };
    catalogCache = result;
    catalogCacheTime = Date.now();
    return result;
  } catch (err) {
    console.error("Unexpected error loading active catalog:", err);
    return { categories: [], products: [] };
  }
}

/**
 * Resolves which category and product should be pre-selected in the catalog
 * based on route slug (`/products/[id]`) or query param (`?category=...`).
 */
export function resolveCatalogSelection({
  categories = [],
  products = [],
  slugParam = "",
  categoryParam = "",
}) {
  const cleanSlug =
    typeof slugParam === "string"
      ? decodeURIComponent(slugParam).trim().toLowerCase()
      : "";
  const cleanCatParam =
    typeof categoryParam === "string"
      ? decodeURIComponent(categoryParam).trim().toLowerCase()
      : "";

  // 1. Exact product slug match (e.g. /products/fl-flhg)
  if (cleanSlug) {
    const matchedProduct = products.find(
      (p) => p.slug?.toLowerCase() === cleanSlug || String(p.id) === cleanSlug
    );
    if (matchedProduct) {
      return {
        initialCategoryId: matchedProduct.category_id,
        initialProductId: matchedProduct.id,
        unmatchedSlug: false,
      };
    }

    // 2. Category slug fallback (e.g. /products/single-spring-seals)
    const matchedCatBySlug = categories.find(
      (c) => c.slug?.toLowerCase() === cleanSlug || slugify(c.title) === cleanSlug
    );
    if (matchedCatBySlug) {
      return {
        initialCategoryId: matchedCatBySlug.id,
        initialProductId: matchedCatBySlug.products?.[0]?.id ?? null,
        unmatchedSlug: false,
      };
    }
  }

  // 3. Query param category filter (e.g. /products?category=4 or ?category=axial-spring-seals)
  if (cleanCatParam) {
    const matchedCat = categories.find(
      (c) =>
        String(c.id) === cleanCatParam ||
        c.slug?.toLowerCase() === cleanCatParam ||
        slugify(c.title) === cleanCatParam
    );
    if (matchedCat) {
      return {
        initialCategoryId: matchedCat.id,
        initialProductId: matchedCat.products?.[0]?.id ?? null,
        unmatchedSlug: Boolean(cleanSlug),
      };
    }
  }

  // 4. Default: pick first active category that contains at least 1 product
  const firstPopulatedCategory =
    categories.find((c) => c.products && c.products.length > 0) || categories[0];

  return {
    initialCategoryId: firstPopulatedCategory?.id ?? null,
    initialProductId: firstPopulatedCategory?.products?.[0]?.id ?? null,
    unmatchedSlug: Boolean(cleanSlug),
  };
}

