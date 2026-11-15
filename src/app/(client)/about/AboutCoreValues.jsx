import { Compass, ShieldCheck, Cpu, Users } from "lucide-react";

export default function AboutCoreValues() {
  const values = [
    {
      num: "01",
      title: "Precision",
      icon: Compass,
      quote:
        "We ensure that every product we manufacture measures up to the highest standards of accuracy and quality.",
      highlights: [
        "Sub-micron optical flat lapping",
        "Rigid dimensional tolerance control",
        "Calibrated coordinate measuring systems",
      ],
    },
    {
      num: "02",
      title: "Quality",
      icon: ShieldCheck,
      quote:
        "Our commitment to quality is unconditional, and only the finest materials are chosen combined with a testing schedule to confirm the very high reliability of our products.",
      highlights: [
        "Certified metallurgy (SS316, Hastelloy-C)",
        "100% dynamic pressure leak testing",
        "Raw material batch traceability",
      ],
    },
    {
      num: "03",
      title: "Innovation",
      icon: Cpu,
      quote:
        "In this process, we make use of the very latest technological innovation to further better the quality of our products and processes.",
      highlights: [
        "Multi-axis CNC turning and milling",
        "Hydrodynamic groove face design",
        "Custom finite element stress analysis",
      ],
    },
    {
      num: "04",
      title: "Customer Focus",
      icon: Users,
      quote:
        "We never take our eyes off the needs of our customers and offer personalized service and support to ensure seamless uptime.",
      highlights: [
        "24-Hour engineering quote turnaround",
        "Custom shaft & gland retrofit design",
        "On-site installation & failure analysis",
      ],
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 text-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12 border-b border-[#E2E8F0] pb-6">
          <div className="space-y-2">
            <span className="inline-block bg-gradient-to-r from-[#F1F5F9] via-[#F1F5F9]/80 to-transparent pl-3 pr-8 py-1 text-[#1A1A1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              FOUNDATIONAL PILLARS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-roboto tracking-tight text-[#1A1A1A]">
              Our Core <span className="text-[#E53935]">Values</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md">
            The principles that anchor every seal we machine, inspect, and ship to
            industrial facilities across the globe.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#F8FAFC] hover:bg-white rounded-[8px] p-5 sm:p-6 border border-[#E2E8F0] hover:border-[#E53935] hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Background Watermark Number */}
                <span className="absolute -right-2 -bottom-4 text-7xl font-extrabold text-[#0F172A]/[0.04] group-hover:text-[#E53935]/[0.08] select-none transition-colors pointer-events-none">
                  {v.num}
                </span>

                <div className="space-y-4 relative z-10">
                  {/* Top Header: Icon & Number Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-[6px] bg-[#E53935]/10 text-[#E53935] flex items-center justify-center group-hover:bg-[#E53935] group-hover:text-white transition-colors duration-200">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="text-xs font-bold text-[#94A3B8] font-mono group-hover:text-[#E53935] transition-colors">
                      {v.num} / 04
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold font-roboto text-[#1A1A1A] group-hover:text-[#E53935] transition-colors">
                    {v.title}
                  </h3>

                  {/* Exact Quote from Brochure */}
                  <p className="text-xs sm:text-[13px] text-[#334155] leading-relaxed font-normal">
                    &ldquo;{v.quote}&rdquo;
                  </p>
                </div>

                {/* Technical Highlights */}
                <div className="pt-4 border-t border-[#E2E8F0] mt-5 space-y-1.5 relative z-10">
                  {v.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                      <span className="w-1 h-1 rounded-full bg-[#E53935] shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

