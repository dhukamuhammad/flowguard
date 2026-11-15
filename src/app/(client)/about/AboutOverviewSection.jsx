import Image from "next/image";
import { CheckCircle2, ShieldCheck, Cog, Award, HeadphonesIcon } from "lucide-react";

export default function AboutOverviewSection() {
  const edgePoints = [
    {
      title: "100% Engineered Excellence",
      description: "Micron-level CNC precision, optical flat lapping, and rigorous zero-defect manufacturing standards.",
      icon: Cog,
    },
    {
      title: "Global Standards, Local Trust",
      description: "Conforming to API 682, DIN 24960, and ISO 9001 engineering specifications with rapid local responsiveness.",
      icon: Award,
    },
    {
      title: "Customized Sealing Solutions",
      description: "Tailor-made seal cartridges, specialized barrier fluid systems, and custom face pairings for harsh media.",
      icon: ShieldCheck,
    },
    {
      title: "End-to-End After Sales Support",
      description: "24/7 technical hotline, on-site installation guidance, seal refurbishing, and guaranteed spare parts availability.",
      icon: HeadphonesIcon,
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 text-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Who We Are & Our Edge */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Dot Grid + Section Pill */}
            <div className="flex items-center gap-3">
              {/* Dot Grid Matrix Icon */}
              <div className="grid grid-cols-4 gap-1 w-6 h-6 shrink-0" aria-hidden="true">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 h-1 rounded-full ${
                      i % 3 === 0 ? "bg-[#E53935]" : "bg-[#94A3B8]"
                    }`}
                  />
                ))}
              </div>
              <span className="bg-gradient-to-r from-[#F1F5F9] via-[#F1F5F9]/80 to-transparent pl-3 pr-8 py-1 text-[#1A1A1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                FLOW GUARD ENGTECH INDUSTRIES
              </span>
            </div>

            {/* Main Headline from Brochure */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-roboto tracking-tight text-[#1A1A1A] leading-[1.2]">
              Engineering Seals for{" "}
              <span className="text-[#E53935]">Every Industry</span>
            </h2>

            {/* Who We Are Box */}
            <div className="space-y-3">
              <div className="inline-block bg-[#F1F5F9] border-l-4 border-[#E53935] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                Who We Are
              </div>
              <p className="text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                We are pioneers in mechanical sealing solutions, driven by innovation,
                quality, and reliability. With cutting-edge technology and precision
                engineering, Flowguard ensures zero leakage, maximum efficiency,
                and long-lasting performance.
              </p>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Our mechanical seals, cartridge systems, and sealing accessories are trusted
                by maintenance engineers and plant operators worldwide, delivering continuous,
                trouble-free operation in the most demanding high-pressure, corrosive, and
                high-temperature industrial environments.
              </p>
            </div>

            {/* OUR EDGE Section */}
            <div className="pt-2 space-y-3.5">
              <div className="inline-block bg-[#F1F5F9] border-l-4 border-[#1A1A1A] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#1A1A1A]">
                OUR EDGE
              </div>

              {/* Edge Grid (2x2 on sm/md) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {edgePoints.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="group bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#E53935]/40 rounded-[6px] p-3.5 transition-all duration-200 hover:shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[4px] bg-[#E53935]/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:bg-[#E53935] group-hover:text-white transition-colors">
                          <Icon size={16} strokeWidth={2.2} />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-[13px] font-bold text-[#1A1A1A] leading-snug">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Industrial Refinery Photo & Tagline */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[440px]">
              
              {/* Industrial Accent Underlay */}
              <div className="absolute -top-3 -right-3 w-32 h-32 bg-[#E53935]/10 rounded-tr-[32px] -z-10" />
              <div className="absolute -bottom-3 -left-3 w-32 h-32 bg-[#1A1A1A]/5 rounded-bl-[32px] -z-10" />

              {/* Image Frame */}
              <div className="relative rounded-t-[16px] rounded-br-[16px] overflow-hidden border-2 border-[#E2E8F0] shadow-lg bg-[#0F172A] aspect-[4/5]">
                <Image
                  src="/client/home/Petrochemical.jpg"
                  alt="Industrial Refinery Plant - Flow Guard Sealing Technology"
                  fill
                  className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 440px"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                {/* Floating Reliability Badge */}
                <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-[4px] text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span className="text-[11px] font-medium tracking-wide">
                      100% Leak Tested &amp; Certified
                    </span>
                  </div>
                </div>

                {/* Brand Tag in photo corner matching brochure */}
                <div className="absolute top-4 right-4 bg-[#E53935] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-[2px] shadow-xs">
                  API 682 &amp; ISO 9001
                </div>

                {/* Tagline inside / bottom of image matching reference */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white">
                  <p className="text-sm sm:text-base font-bold font-roboto tracking-tight text-white/95">
                    &ldquo;Sealing the Future, Engineering the Present&rdquo;
                  </p>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    Flow Guard EngTech Industries &bull; Industrial Reliability
                  </p>
                </div>
              </div>

              {/* Bottom Caption matching brochure */}
              <div className="mt-3 text-center">
                <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
                  Sealing the Future, Engineering the Present
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E53935]" />
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

