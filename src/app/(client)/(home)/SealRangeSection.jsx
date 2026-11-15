"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

function shouldSkipImageOptimization(src) {
  if (typeof src !== "string") return true;
  if (src.startsWith("/")) return false;
  return !src.includes(".supabase.co");
}

export default function SealRangeSection({ categories = [] }) {
  const visibleCategories = Array.isArray(categories)
    ? categories.slice(0, 6)
    : [];

  return (
    <section className="relative py-14 sm:py-16 lg:py-18 bg-[#F8FAFC] overflow-hidden">
      {/* Subtle Atmospheric Industrial Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.06] grayscale">
        <Image
          src="/client/home/hero-bg.jpg"
          alt="Industrial background pattern"
          fill
          className="object-cover object-center"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-[#1A1A1A] font-roboto tracking-tight">
            Our Mechanical{" "}
            <span className="relative inline-block">
              Seal Range
              {/* Red Curved Accent Swoosh Under "Seal Range" */}
              <svg
                className="absolute -bottom-2 left-0 w-full h-2.5 sm:h-3"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C55 2 145 2 197 9"
                  stroke="#E53935"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-3 leading-relaxed">
            Designed for high performance across diverse industrial applications
          </p>
        </div>

        {/* Dynamic Active Seal Categories Grid */}
        {visibleCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visibleCategories.map((category, idx) => {
              const imageSrc =
                category.thumbnail || "/client/home/seal-product.png";
              const href = `/products?category=${category.id}`;
              const isHighlighted = idx === 0;

              return (
                <Link
                  key={category.id}
                  href={href}
                  prefetch={true}
                  className="group relative bg-white rounded-[6px] p-4.5 sm:p-5 border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-4 sm:gap-5 overflow-hidden"
                >
                  {/* Left: Category Primary Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 relative flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={imageSrc}
                      alt={category.title}
                      fill
                      unoptimized={shouldSkipImageOptimization(imageSrc)}
                      sizes="(max-width: 768px) 90px, 110px"
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Right: Title & View Link */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#1A1A1A] text-base sm:text-lg leading-snug group-hover:text-[#E53935] transition-colors">
                      {category.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#4B5563] group-hover:text-[#E53935] font-medium mt-2 transition-colors">
                      <span>View</span>
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>

                  {/* Red Bottom Accent Bar (Active on Card 1, interactive hover on others) */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] transition-all duration-300 ${
                      isHighlighted
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-[6px] border border-gray-200 p-8 text-center text-sm text-[#6B7280]">
            No active mechanical seal categories are available right now.
          </div>
        )}

        {/* Bottom Right "View More" CTA Button */}
        <div className="flex justify-end mt-8 sm:mt-10">
          <Link href="/products" prefetch={true}>
            <button className="border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-[6px] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm">
              View More
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
