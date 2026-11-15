"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check, PackageOpen } from "lucide-react";
import { getSectorIcon } from "@/components/common/SectorIcons";

function shouldSkipImageOptimization(src) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/")) return false;
  return !src.includes(".supabase.co");
}

function KeyValueSectionBlock({ section }) {
  return (
    <div>
      <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-roboto">
        {section.heading}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-[#F9FAFB] p-3 rounded-[6px] border border-gray-100"
          >
            {item.label && (
              <span className="block text-xs text-gray-500 font-medium">
                {item.label}
              </span>
            )}
            <span className="text-xs sm:text-sm font-bold text-[#E53935] font-roboto">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ListSectionBlock({ section }) {
  return (
    <div className="pt-2">
      <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-roboto">
        {section.heading}
      </h4>
      <ul className="text-xs sm:text-[13px] text-[#4B5563] space-y-1 leading-relaxed">
        {section.items.map((item, idx) => (
          <li key={idx}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}

function NumberedSectionBlock({ section }) {
  return (
    <div className="pt-8 border-t border-gray-200">
      <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] uppercase tracking-wider mb-4 font-roboto">
        {section.heading}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {section.items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[6px] border border-gray-200 p-3 sm:p-3.5 flex items-center gap-3 shadow-2xs hover:border-[#E53935]/40 transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-[#E53935] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
              {idx + 1}
            </div>
            <span className="text-xs sm:text-[13px] font-semibold text-[#1A1A1A]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProductCatalogSection({
  categories = [],
  products = [],
  initialCategoryId = null,
  initialProductId = null,
  unmatchedSlug = false,
}) {
  const [openCategoryId, setOpenCategoryId] = useState(initialCategoryId);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [activeThumbnail, setActiveThumbnail] = useState(0);

  const activeProduct =
    products.find((p) => p.id === selectedProductId) || null;
  const activeCategory =
    categories.find((c) => c.id === openCategoryId) || null;
  const productCategory =
    categories.find((c) => c.id === activeProduct?.category_id) || null;

  const handleToggleCategory = (cat) => {
    if (openCategoryId === cat.id) {
      setOpenCategoryId(null);
      return;
    }

    setOpenCategoryId(cat.id);
    if (cat.products && cat.products.length > 0) {
      const alreadyInCat = activeProduct?.category_id === cat.id;
      if (!alreadyInCat) {
        handleSelectProduct(cat.products[0]);
      }
    }
  };

  const handleSelectProduct = (prod) => {
    setSelectedProductId(prod.id);
    setOpenCategoryId(prod.category_id);
    setActiveThumbnail(0);

    if (typeof window !== "undefined" && prod.slug) {
      window.history.replaceState(null, "", `/products/${prod.slug}`);
    }
  };

  // Derive normalized sections and media for active product
  const productImages =
    activeProduct?.images?.length > 0
      ? activeProduct.images
      : ["/client/product/Seals.png"];
  const safeThumbIdx =
    activeThumbnail < productImages.length ? activeThumbnail : 0;
  const mainImageSrc = productImages[safeThumbIdx] || productImages[0];

  const descriptionParagraphs = activeProduct?.description
    ? activeProduct.description
        .split(/\r?\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
    : [];

  const listExtraSections = (activeProduct?.extra_sections || []).filter(
    (s) => s.layout === "list"
  );
  const keyValueExtraSections = (activeProduct?.extra_sections || []).filter(
    (s) => s.layout === "key_value"
  );
  const numberedExtraSections = (activeProduct?.extra_sections || []).filter(
    (s) => s.layout === "numbered"
  );

  return (
    <section className="bg-white text-[#1A1A1A] py-10 sm:py-12 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {unmatchedSlug && (
          <div className="mb-6 rounded-[6px] border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-800">
            The requested mechanical seal link is currently unavailable or
            inactive. Showing our active catalog instead.
          </div>
        )}

        {categories.length === 0 ? (
          <div className="rounded-[6px] border border-gray-200 bg-[#F9FAFB] p-12 text-center">
            <PackageOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-[#1A1A1A] font-roboto">
              No Active Products Available
            </h2>
            <p className="text-sm text-[#6B7280] mt-1">
              Our product catalog is currently being updated. Please contact us
              for custom seal specifications.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* ================= LEFT SIDEBAR: ALL CATEGORY ================= */}
            <aside className="lg:col-span-4 xl:col-span-3 w-full bg-white rounded-[6px] border border-gray-200 p-4 sm:p-5 shadow-xs lg:sticky lg:top-24">
              <div className="mb-4">
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-roboto">
                  All Category
                </h3>
                <div className="w-10 h-[2.5px] bg-[#E53935] mt-1" />
              </div>

              <div className="space-y-1.5 lg:max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isOpen = openCategoryId === cat.id;
                  const catProducts = cat.products || [];

                  return (
                    <div
                      key={cat.id}
                      className="border-b border-gray-100 last:border-none"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleCategory(cat)}
                        className="w-full flex items-center justify-between py-2.5 px-2 text-left hover:bg-gray-50 rounded-[6px] transition-colors cursor-pointer group"
                      >
                        <span
                          className={`text-xs sm:text-[13px] font-semibold transition-colors leading-snug ${
                            isOpen
                              ? "text-[#E53935]"
                              : "text-[#1A1A1A] group-hover:text-[#E53935]"
                          }`}
                        >
                          {cat.title}
                        </span>
                        {isOpen ? (
                          <ChevronUp
                            size={14}
                            className="text-[#E53935] flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={14}
                            className="text-gray-400 group-hover:text-[#E53935] flex-shrink-0"
                          />
                        )}
                      </button>

                      {isOpen && (
                        <div className="pl-2 pr-1 pb-2 space-y-1.5 pt-1">
                          {catProducts.length > 0 ? (
                            catProducts.map((prod) => {
                              const isSelected = selectedProductId === prod.id;
                              const thumbSrc =
                                prod.images?.[0] || "/client/oue mechanicle.png";

                              return (
                                <button
                                  type="button"
                                  key={prod.id}
                                  onClick={() => handleSelectProduct(prod)}
                                  className={`w-full flex items-center justify-between p-2 rounded-[6px] text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-gray-100/90 font-medium text-[#1A1A1A]"
                                      : "hover:bg-gray-50 text-gray-600"
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div
                                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 ${
                                        isSelected
                                          ? "bg-[#E53935] border-[#E53935] text-white"
                                          : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {isSelected && (
                                        <Check size={11} strokeWidth={3} />
                                      )}
                                    </div>
                                    <span className="text-[11px] sm:text-xs truncate">
                                      {prod.title}
                                    </span>
                                  </div>

                                  <div className="relative w-5 h-5 flex-shrink-0 ml-1 opacity-80">
                                    <Image
                                      src={thumbSrc}
                                      alt={prod.title}
                                      fill
                                      unoptimized={shouldSkipImageOptimization(
                                        thumbSrc
                                      )}
                                      sizes="20px"
                                      className="object-contain"
                                    />
                                  </div>
                                </button>
                              );
                            })
                          ) : (
                            <p className="text-[11px] text-gray-400 italic px-2 py-1">
                              No products added in this category yet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </aside>

            {/* ================= RIGHT MAIN AREA: PRODUCT DETAILS ================= */}
            <main className="lg:col-span-8 xl:col-span-9 space-y-8">
              {!activeProduct ? (
                <div className="rounded-[6px] border border-gray-200 bg-[#F9FAFB] p-10 text-center space-y-3">
                  <PackageOpen className="w-9 h-9 text-gray-400 mx-auto" />
                  <h2 className="text-xl font-bold font-roboto text-[#1A1A1A]">
                    {activeCategory
                      ? `No products in "${activeCategory.title}" yet`
                      : "Select a Product"}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto">
                    {activeCategory
                      ? "We are updating models for this seal category. Please browse another active seal series from the left menu."
                      : "Choose a category and seal model from the left sidebar to inspect technical specifications."}
                  </p>
                  {products.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSelectProduct(products[0])}
                      className="inline-flex items-center px-4 py-2 rounded-[6px] bg-[#E53935] text-white text-xs font-semibold hover:bg-[#d32f2f] transition-colors cursor-pointer"
                    >
                      View {products[0].title}
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Product Header */}
                  <div>
                    {productCategory && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#E53935] mb-1">
                        {productCategory.title}
                      </p>
                    )}
                    <h2 className="text-2xl sm:text-3xl font-bold font-roboto text-[#1A1A1A] tracking-tight">
                      {activeProduct.title}
                    </h2>
                  </div>

                  {/* Two-Column Product Specs View */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    {/* Product Visual Column */}
                    <div className="md:col-span-6 lg:col-span-5 space-y-5">
                      <div className="w-full h-72 sm:h-80 rounded-[6px] border border-gray-200 bg-white p-6 flex items-center justify-center shadow-xs relative">
                        <div className="relative w-full h-full">
                          <Image
                            src={mainImageSrc}
                            alt={activeProduct.title}
                            fill
                            priority
                            unoptimized={shouldSkipImageOptimization(
                              mainImageSrc
                            )}
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 360px"
                          />
                        </div>
                      </div>

                      {productImages.length > 1 && (
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {productImages.map((thumb, idx) => (
                            <button
                              type="button"
                              key={idx}
                              onClick={() => setActiveThumbnail(idx)}
                              className={`relative w-14 h-14 rounded-[6px] border p-1.5 flex items-center justify-center bg-white transition-all cursor-pointer ${
                                safeThumbIdx === idx
                                  ? "border-[#E53935] ring-2 ring-[#E53935]/20 shadow-xs"
                                  : "border-gray-200 hover:border-gray-300 opacity-80 hover:opacity-100"
                              }`}
                            >
                              <Image
                                src={thumb}
                                alt={`${activeProduct.title} view ${idx + 1}`}
                                fill
                                unoptimized={shouldSkipImageOptimization(thumb)}
                                className="object-contain p-1"
                                sizes="60px"
                              />
                            </button>
                          ))}
                        </div>
                      )}

                      {listExtraSections.map((sec, idx) => (
                        <ListSectionBlock key={idx} section={sec} />
                      ))}
                    </div>

                    {/* Product Details & Operating Limits Column */}
                    <div className="md:col-span-6 lg:col-span-7 space-y-6">
                      {activeProduct.sectors.length > 0 && (
                        <div className="bg-[#EFF2F6] p-4 rounded-[6px]">
                          <h4 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider mb-2.5 font-roboto">
                            SECTOR
                          </h4>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            {activeProduct.sectors.map((sector, idx) => {
                              const SectorSvg = getSectorIcon(sector);
                              return (
                                <div
                                  key={idx}
                                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-white border border-gray-200/80 flex items-center justify-center text-gray-600 shadow-2xs hover:text-[#E53935] hover:border-[#E53935] transition-colors"
                                  title={sector}
                                  aria-label={sector}
                                >
                                  <SectorSvg className="w-[18px] h-[18px]" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {activeProduct.characteristics.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-roboto">
                            CHARACTERISTICS
                          </h4>
                          <ul className="text-xs sm:text-[13px] text-[#4B5563] space-y-1 leading-relaxed">
                            {activeProduct.characteristics.map((item, idx) => (
                              <li key={idx}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {activeProduct.operating_limits.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-roboto">
                            OPERATING LIMITS
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {activeProduct.operating_limits.map((limit, idx) => (
                              <div
                                key={idx}
                                className="bg-[#F9FAFB] p-3 rounded-[6px] border border-gray-100"
                              >
                                <span className="block text-xs text-gray-500 font-medium">
                                  {limit.label}
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-[#E53935] font-roboto">
                                  {limit.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {keyValueExtraSections.map((sec, idx) => (
                        <KeyValueSectionBlock key={idx} section={sec} />
                      ))}

                      {descriptionParagraphs.length > 0 && (
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] uppercase tracking-wider mb-2 font-roboto">
                            DESCRIPTION
                          </h4>
                          <div className="text-xs sm:text-[13px] text-[#4B5563] space-y-2 leading-relaxed">
                            {descriptionParagraphs.map((para, idx) => (
                              <p key={idx}>{para}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Full-Width Numbered Extra Sections (e.g. COMPONENTS) */}
                  {numberedExtraSections.map((sec, idx) => (
                    <NumberedSectionBlock key={idx} section={sec} />
                  ))}
                </>
              )}
            </main>
          </div>
        )}

        {/* ================= BOTTOM CTA: NEED CUSTOM MECHANICAL SEAL? ================= */}
        <div className="pt-20 sm:pt-24 pb-4 text-center">
          <h3 className="text-2xl sm:text-3xl font-bold font-roboto text-[#1A1A1A] tracking-tight mb-5">
            Need Custom Mechanical Seal?
          </h3>
          <Link href="/contact">
            <button className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-8 py-3 rounded-[6px] shadow-md shadow-[#E53935]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
              Get a Quote
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
