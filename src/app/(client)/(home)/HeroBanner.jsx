"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1A1A1A]">
      {/* Background Image Layer - High Visibility & Natural Factory Sunset */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/client/home/hero-bg.jpg"
          alt="Industrial Flow Guard Facility"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft Left Gradient Overlay for text contrast without hiding factory lights */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent/20" />
      </div>

      {/* Main Hero Content - Aligned on the exact same left grid line as Navbar Logo */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pt-24 pb-12 lg:pt-28 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* Top Tag Ribbon - Sharp Left Edge + Red-to-Transparent Fade (Exact Figma Image 2) */}
            <div>
              <div className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent pl-3 pr-10 py-1 rounded-null">
                <span className="text-white text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
                  PRECISION ENGINEERING
                </span>
              </div>
            </div>

            {/* Main Headline - Balanced for 100% Laptop Displays */}
            <h1 className="font-semibold text-2xl sm:text-4xl lg:text-[40px] xl:text-[44px] leading-[1.12] tracking-tight text-[#F8FAFC]">
              Precision Mechanical <br />
              Sealing Solutions for <br />
              <span className="relative inline-block mt-1">
                Every Industry
                {/* Red Underline Accent Curve */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-40 sm:w-48 lg:w-52 h-3.5 text-[#E53935]"
                  viewBox="0 0 280 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 11C70 2 195 3 278 12"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm lg:text-[14.5px] text-[#E5E7EB]/90 font-normal max-w-md leading-relaxed pt-0.5">
              High-performance mechanical seals designed for durability, zero
              leakage, and maximum efficiency.
            </p>

            {/* Action Buttons - Rounded-[6px] Compact & Sleek */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1.5">
              <Link href="/products">
                <button className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-[6px] shadow-lg shadow-[#E53935]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                  Explore Products
                </button>
              </Link>

              <Link href="/about">
                <button className="bg-black/30 backdrop-blur-sm border border-white/30 hover:border-white/60 text-[#F8FAFC] text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-[6px] hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                  Get a Quote
                </button>
              </Link>
            </div>

            {/* Bottom Tagline Strip */}
            <div className="pt-2">
              <div className="inline-flex items-center px-3.5 py-1 border-y border-[#E53935]/80 bg-black/40 backdrop-blur-sm shadow-sm">
                <span className="text-[11px] sm:text-xs text-[#F8FAFC] font-normal tracking-wide">
                  Precision • Durability • Performance
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Mechanical Seal Render - Proportional for Laptop Screen */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-60 sm:w-72 lg:w-[370px] xl:w-[400px] aspect-square animate-float">
              {/* Subtle ambient glow behind product */}
              <div className="absolute inset-0 bg-[#E53935]/10 rounded-full blur-3xl -z-10 scale-90" />
              <Image
                src="/client/home/hero-product.png"
                alt="Flow Guard Mechanical Seal Product"
                fill
                priority
                className="object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)]"
                sizes="(max-width: 768px) 80vw, (max-width: 1200px) 40vw, 400px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
