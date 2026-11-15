"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Play } from "lucide-react";

export default function AboutSection() {
  const points = ["Precision", "Quality", "Innovation", "Customer Focus"];

  return (
    <section className="bg-white text-[#1A1A1A] py-14 sm:py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div>
              <span className="inline-block bg-gradient-to-r from-[#F1F5F9] via-[#F1F5F9]/80 to-transparent pl-3 pr-10 py-1 rounded-none text-[#1A1A1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-none">
                ABOUT OUR INDUSTRY
              </span>

            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-bold text-[#1A1A1A] leading-[1.18] tracking-tight">
              Engineering Seal for <br />
              Every Industry
            </h2>

            <p className="text-xs sm:text-[13.5px] text-[#6B7280] leading-relaxed">
              We are pioneers in mechanical sealing solution, driven by innovation,
              quality , and reliability. With cutting-edge technology and precision
              engineering, Flowguard ensure zero leakage, maximum efficiency,
              and long-lasting performance.
            </p>

            <p className="text-xs sm:text-[13.5px] text-[#6B7280] leading-relaxed">
              Our products are trusted across multiple industries worldwide,
              delivering consistent results in the most demanding environments.
            </p>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 pt-1">
              {points.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4.5 h-4.5 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white flex-shrink-0">
                    <Check size={11} strokeWidth={3} />
                  </div>
                  <span className="font-semibold text-xs sm:text-sm text-[#1A1A1A]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link href="/about">
                <button className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-[6px] shadow-md shadow-[#E53935]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer">
                  Discover More
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: matches design */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end pt-8 pl-12 sm:pl-24 lg:pl-0">
            {/* Image box (everything else is positioned relative to this) */}
            <div className="relative w-[260px] sm:w-[320px] xl:w-[400px] aspect-[316/381]">
              {/* Red panel: top-left, only top-right rounded */}
              <div className="absolute -top-[5.8%] -left-[6.6%] w-[41%] h-[43%] bg-[#E53935] rounded-tr-[30px] z-0" />

              {/* Image: only top-right big rounded */}
              <div className="absolute inset-0 z-10 overflow-hidden bg-gray-100 rounded-tr-[40px] sm:rounded-tr-[48px]">
                <Image
                  src="/client/home/about.jpg"
                  alt="Flow Guard Industry Engineer"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                />
              </div>

              {/* See Our Industry tab: attached to image bottom-left */}
              <div className="absolute bottom-0 left-0 z-20 flex items-center gap-2 bg-[#E53935] hover:bg-[#d32f2f] transition-colors cursor-pointer pl-4 pr-6 py-2.5 sm:py-3 rounded-tr-[22px]">
                <div className="w-5 h-3.5 rounded-[3px] bg-white flex items-center justify-center flex-shrink-0">
                  <Play size={8} fill="#E53935" className="text-[#E53935] ml-0.5" />
                </div>
                <span className="font-semibold text-[11px] sm:text-xs text-white whitespace-nowrap">
                  See Our Industry
                </span>
              </div>

              {/* 10+ card: sticks out to the left of the image, white outline */}
              <div className="absolute z-30 bottom-[11.5%] -left-[30%] w-[44%] bg-[#E53935] text-white px-2 py-2.5 sm:py-3 text-center border-4 border-white rounded-tl-[14px] rounded-tr-[6px] shadow-lg">
                <div className="text-2xl sm:text-3xl xl:text-[34px] font-bold leading-none">
                  10+
                </div>
                <div className="text-[10px] sm:text-[11px] xl:text-xs font-normal mt-1.5 leading-tight whitespace-nowrap">
                  Year work Experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}