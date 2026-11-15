"use client";

import Image from "next/image";
import Link from "next/link";

export default function ManufacturingFacilitySection() {
  const facilities = [
    {
      id: "01",
      title: "CNC Machining",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/cnc-machining.jpg",
      link: "/manufacturing/cnc-machining",
      active: false,
    },
    {
      id: "02",
      title: "Quality Testing Labs",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/quality-testing-labs.png",
      link: "/manufacturing/quality-testing-labs",
      active: false,
    },
    {
      id: "03",
      title: "Skilled Engineering Team",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat magnis dui volutpat porttitor. Rhoncus fringilla dui leo in.",
      image: "/client/home/skilled-engineering-team.png",
      link: "/manufacturing/skilled-engineering-team",
      active: false,
    },
    {
      id: "04",
      title: "Continuous R&D",
      description:
        "Lorem ipsum dolor sit amet consectetur. Vel fringilla pharetra a at. Pretium placerat.",
      image: "/client/home/continuous-rd.png",
      link: "/manufacturing/continuous-rd",
      active: true,
    },
  ];

  return (
    <section className="py-14 sm:py-16 lg:py-18 bg-[#F8FAFC] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-[#1A1A1A] font-roboto tracking-tight">
            Advanced{" "}
            <span className="relative inline-block">
              Manufacturing Facility
              {/* Red Curved Accent Swoosh */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-2.5 sm:h-3"
                viewBox="0 0 240 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C65 2 175 2 237 9"
                  stroke="#E53935"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-3 leading-relaxed">
            Our state-of-the-art manufacturing unit is equipped with modern machinery and{" "}
            <br className="hidden sm:inline" />
            advanced technology to deliver precision-engineered sealing solutions.
          </p>
        </div>

        {/* 4 Facilities Grid (2 Rows x 2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {facilities.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-stretch gap-4 sm:gap-5 group"
            >
              {/* Left: Content Area */}
              <div className="flex-1 flex flex-col justify-between py-1.5 sm:py-2 pl-1.5 sm:pl-2 min-w-0">
                <div>
                  {/* Giant Number Watermark */}
                  <span
                    className={`block text-4xl sm:text-5xl font-bold font-roboto leading-none transition-colors duration-300 ${
                      item.active
                        ? "text-[#E53935]/35 group-hover:text-[#E53935]"
                        : "text-[#D1D5DB] group-hover:text-[#E53935]/50"
                    }`}
                  >
                    {item.id}
                  </span>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A1A1A] font-roboto mt-2.5 tracking-tight group-hover:text-[#E53935] transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-[12.5px] text-[#6B7280] leading-relaxed mt-2 mb-5">
                    {item.description}
                  </p>
                </div>

                {/* Learn More Button - Rounded-[6px] */}
                <div>
                  <Link href={item.link}>
                    <button
                      className={`font-semibold text-xs px-5 py-2 rounded-[6px] transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm ${
                        item.active
                          ? "bg-[#E53935] hover:bg-[#d32f2f] text-white"
                          : "border border-[#E53935] text-[#E53935] hover:bg-[#E53935] hover:text-white"
                      }`}
                    >
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right: Facility Image - Rounded-[6px] */}
              <div className="relative w-full sm:w-[46%] h-48 sm:h-auto min-h-[190px] sm:min-h-[210px] rounded-[6px] overflow-hidden flex-shrink-0 bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

