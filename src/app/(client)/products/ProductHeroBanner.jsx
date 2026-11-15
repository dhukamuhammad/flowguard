"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductHeroBanner() {
  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 overflow-hidden">
      {/* Crisp Machinery Background Image with Low/Light Shade Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/client/product/product.jpg"
          alt="Industrial Machinery Sealing Systems"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent/20 z-0" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Breadcrumb Badge, Title, Subtitle */}
          <div className="lg:col-span-7 space-y-3.5 sm:space-y-4">
            {/* Breadcrumb Badge Ribbon */}
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[11px] sm:text-xs font-medium px-3.5 py-1">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <span className="text-white/80">&gt;</span>
              <Link href="/products" className="hover:underline">
                Products
              </Link>
              <span className="text-white/80">&gt;</span>
              <span className="text-white font-semibold">Mechanical Seals</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold font-roboto text-white tracking-tight leading-[1.14]">
              Mechanical Seals
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm lg:text-[14.5px] font-normal text-white/90 leading-relaxed max-w-xl">
              Precision Engineered Industrial Sealing Solutions
            </p>
          </div>

          {/* Right Column: 3D Floating Metallic Mechanical Seal - Compact to match Blog banner height */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[230px] sm:max-w-[270px] lg:max-w-[300px] h-[140px] sm:h-[160px] lg:h-[175px] flex items-center justify-center">
              <Image
                src="/client/product/Seals.png"
                alt="Flow Guard Mechanical Seals"
                fill
                priority
                className="object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.55)]"
                sizes="(max-width: 1024px) 100vw, 350px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
