"use client";

import Image from "next/image";
import Link from "next/link";

export default function IndustriesSection() {
  const industries = [
    {
      id: 1,
      title: "OIL & GAS",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/oil-gas.jpg",
      link: "/industries",
    },
    {
      id: 2,
      title: "PETROCHEMICAL",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/Petrochemical.jpg",
      link: "/industries",
    },
    {
      id: 3,
      title: "POWER PLANTS",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/power-plants.jpg",
      link: "/industries",
    },
  ];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Upper Industrial Banner Area */}
      <div className="relative pt-12 sm:pt-14 pb-36 sm:pb-40 bg-[#121316]">
        {/* Crisp Industrial Background Image with Light Contrast Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/client/home/industries-bg.jpg"
            alt="Industries Factory Background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/20 to-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          {/* Top-Left Red Badge: INDUSTRIES WE SERVE */}
          <div className="mb-4 sm:mb-5">
            <span className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none">
              INDUSTRIES WE SERVE
            </span>
          </div>

          {/* Center Main Heading with Signature White Curved Underline */}
          <div className="text-center max-w-3xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-white font-roboto tracking-tight leading-tight">
              <span className="relative inline-block">
                Industries We
                {/* White Curved Swoosh Under "Industries We" */}
                <svg
                  className="absolute -bottom-2.5 left-0 w-full h-2.5 sm:h-3"
                  viewBox="0 0 220 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C60 2 160 2 217 9"
                    stroke="#FFFFFF"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Empower
            </h2>

            <p className="text-xs sm:text-[13.5px] text-[#D1D5DB] font-normal mt-3 leading-relaxed max-w-2xl mx-auto">
              Our sealing solutions are engineered to perform in harsh, high-pressure,{" "}
              <br className="hidden sm:inline" />
              and high-temperature environments across industries.
            </p>
          </div>
        </div>
      </div>

      {/* Overlapping Cards Container (Floats over Dark Banner and White Base) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 -mt-26 sm:-mt-28 pb-14 sm:pb-18">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {industries.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[6px] border border-gray-100 overflow-hidden shadow-xl shadow-black/10 flex flex-col group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Photo */}
              <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Card Content Area */}
              <div className="p-5 sm:p-5.5 flex flex-col justify-between flex-1">
                <div>
                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-wider uppercase font-roboto">
                    {item.title}
                  </h3>

                  {/* Red Accent Bar attached to the Left Border */}
                  <div className="-ml-5 sm:-ml-5.5 w-10 sm:w-12 h-[3px] bg-[#E53935] my-3" />

                  {/* Description */}
                  <p className="text-xs sm:text-[12.5px] text-[#6B7280] leading-relaxed mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Learn More Button - Rounded-[6px] */}
                <div>
                  <Link href={item.link}>
                    <button className="bg-[#E53935] hover:bg-[#d32f2f] text-white font-semibold text-xs px-5 py-2 rounded-[6px] shadow-sm hover:shadow transition-all cursor-pointer">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

