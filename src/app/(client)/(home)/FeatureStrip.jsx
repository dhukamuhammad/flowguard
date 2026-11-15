"use client";

export default function FeatureStrip() {
  const features = [
    {
      title: "ISO Certified Company",
      subtitle: "ISO 9001",
      icon: (
        <svg
          className="w-10 h-10 text-[#1A1A1A] flex-shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="24" cy="24" r="20" />
          <path d="M4 24h40" />
          <ellipse cx="24" cy="24" rx="9" ry="20" />
          {/* ISO Badge */}
          <rect
            x="11"
            y="17"
            width="26"
            height="14"
            rx="2"
            fill="#E8ECEF"
            stroke="currentColor"
            strokeWidth="2"
          />
          <text
            x="24"
            y="27.5"
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="currentColor"
            stroke="none"
            fontFamily="sans-serif"
          >
            ISO
          </text>
        </svg>
      ),
    },
    {
      title: "High Precision Engineering",
      subtitle: "ISO 9001",
      icon: (
        <svg
          className="w-10 h-10 text-[#1A1A1A] flex-shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Nozzle head */}
          <rect x="15" y="6" width="18" height="6" rx="1" />
          <path d="M18 12l3 8h6l3-8" />
          <line x1="24" y1="20" x2="24" y2="24" />
          {/* Spark beam */}
          <path d="M24 24l-3 4 5 3-4 6" />
          {/* Metal plate */}
          <path d="M10 37l14-7 16 6-14 7z" />
        </svg>
      ),
    },
    {
      title: "Global Standard Products",
      subtitle: "Global Standard",
      icon: (
        <svg
          className="w-10 h-10 text-[#1A1A1A] flex-shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="24" cy="24" r="20" />
          <ellipse cx="24" cy="24" rx="9" ry="20" />
          <path d="M4 24h40" />
          {/* Central Check Circle Badge */}
          <circle
            cx="24"
            cy="24"
            r="9"
            fill="#E8ECEF"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M20 24l3 3 5-6" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      title: "Reliable Performance",
      subtitle: "ISO 9001",
      icon: (
        <svg
          className="w-10 h-10 text-[#1A1A1A] flex-shrink-0"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Shield outline */}
          <path d="M24 6l14 5v13c0 10-7 17-14 20-7-3-14-10-14-20V11l14-5z" />
          {/* Inner checkmark */}
          <path d="M18 24l4 4 8-8" strokeWidth="2.5" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-[#E8ECEF] border-y border-[#D1D5DB] py-6 sm:py-7">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 items-center">
          {features.map((item, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="transition-transform group-hover:scale-110 duration-200">
                {item.icon}
              </div>
              <div>
                <h3 className="text-[#1A1A1A] font-semibold text-sm sm:text-[15px] font-roboto leading-snug">
                  {item.title}
                </h3>
                <p className="text-[#6B7280] text-xs font-normal font-roboto mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

