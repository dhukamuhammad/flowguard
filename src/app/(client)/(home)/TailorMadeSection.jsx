"use client";

import Image from "next/image";

function DraftingIcon({ className = "w-10 h-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 36 36"
      fill="none"
      stroke="#E53935"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Triangular / Diagonal Ruler with Graduation Marks */}
      <path d="M5 15L15 5L20 10L10 20L5 15Z" />
      <path d="M9 9L11 11" />
      <path d="M12 12L14 14" />
      {/* Drafting Pen / Brush Crossing */}
      <path d="M23 7C23 7 26 8 27 11C28 14 26 16 24 18L14 28L9 29L10 24L20 14C22 12 23 7 23 7Z" />
      <path d="M19 15L23 19" />
    </svg>
  );
}

export default function TailorMadeSection() {
  const solutions = [
    {
      id: 1,
      title: "Custom Design Support",
      description:
        "Lorem ipsum dolor sit amet consectetur. Justo leo eget id ut nibh met consectetur. Justo leo eget id ut nibh.",
    },
    {
      id: 2,
      title: "Application-Based Solutions",
      description:
        "Lorem ipsum dolor sit amet consectetur. Justo leo eget id ut nibh met consectetur. Justo leo eget id ut nibh.",
    },
    {
      id: 3,
      title: "High Performance Materials",
      description:
        "Lorem ipsum dolor sit amet consectetur. Justo leo eget id ut nibh met consectetur. Justo leo eget id ut nibh.",
    },
    {
      id: 4,
      title: "End-to-End Engineering",
      description:
        "Lorem ipsum dolor sit amet consectetur. Justo leo eget id ut nibh met consectetur. Justo leo eget id ut nibh.",
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-18 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header (Center Aligned) */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-[#1A1A1A] font-roboto tracking-tight">
            Tailor-Made{" "}
            <span className="relative inline-block">
              Sealing Solutions
              {/* Signature Red Curved Accent Swoosh */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-2.5 sm:h-3"
                viewBox="0 0 220 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C55 2 165 2 217 9"
                  stroke="#E53935"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-3 leading-relaxed max-w-2xl mx-auto">
            We offer customized sealing solutions designed to meet specific client requirements{" "}
            <br className="hidden sm:inline" />
            and complex industrial challenges.
          </p>
        </div>

        {/* Two-Column Master Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Left Column: Featured Image - Rounded-[6px] */}
          <div className="lg:col-span-5 relative w-full min-h-[300px] sm:min-h-[360px] lg:min-h-full rounded-[6px] overflow-hidden shadow-lg bg-gray-100 flex-shrink-0">
            <Image
              src="/client/home/Tailor-Made.jpg"
              alt="Tailor-Made Industrial Solutions Facility"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: 2x2 Grid of 4 Feature Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {solutions.map((item) => (
              <div
                key={item.id}
                className="bg-[#EFF2F6] p-5 sm:p-5.5 rounded-[6px] border border-gray-200/50 flex flex-col justify-between hover:bg-[#E7ECF3] transition-colors duration-300 group"
              >
                <div>
                  {/* Red Engineering / Drafting Icon */}
                  <div className="mb-3 text-[#E53935] group-hover:scale-105 transition-transform duration-200">
                    <DraftingIcon className="w-8 h-8 sm:w-9 sm:h-9" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-[17px] font-bold text-[#1A1A1A] font-roboto tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[12.5px] text-[#6B7280] leading-relaxed mt-2.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

