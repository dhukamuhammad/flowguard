import Image from "next/image";
import { CheckCircle2, Wrench, Microscope, Gauge } from "lucide-react";

export default function AboutManufacturingCapabilities() {
  const capabilities = [
    {
      title: "Precision CNC Machining",
      image: "/client/home/CNC Machining.jpg",
      tag: "Machining Accuracy",
      icon: Wrench,
      description:
        "High-rigidity multi-axis CNC lathe centers, turning seal gland plates, sleeves, and seal rings within micron-level dimensional tolerances.",
      specs: ["High-speed CNC Turning", "Precision Optical Lapping", "Ra < 0.2 µm Surface Finish"],
    },
    {
      title: "Quality Testing & Inspection Labs",
      image: "/client/home/Quality Testing Labs.png",
      tag: "Verification",
      icon: Microscope,
      description:
        "Dedicated test rigs verifying static & dynamic sealing under simulated plant pressures, monochromatic light band flatness testing, and helium leak detection.",
      specs: ["100% Hydrostatic Test Rig", "Monochromatic Light Flatness", "Helium Leak Detection"],
    },
    {
      title: "Material Engineering & Continuous R&D",
      image: "/client/home/Continuous R&D.png",
      tag: "Innovation",
      icon: Gauge,
      description:
        "Ongoing material testing for harsh chemical compatibility, specialized silicon carbide, tungsten carbide, and carbon face combinations.",
      specs: ["SS316L, Alloy-20 & Hastelloy-C", "FEA Stress Analysis", "Tailored Seal Face Pairings"],
    },
  ];

  const stats = [
    { value: "10+", label: "Years of Engineering Excellence", sub: "Pioneering industrial seals" },
    { value: "100%", label: "Tested Before Dispatch", sub: "Zero-defect delivery policy" },
    { value: "500+", label: "Plant Installations", sub: "Chemical, Pharma & Refinery" },
    { value: "<24h", label: "Technical RFQ Turnaround", sub: "Direct engineer response" },
  ];

  return (
    <section className="bg-[#0F172A] py-14 sm:py-16 lg:py-20 text-white relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-radial from-[#1E293B]/60 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-[#E53935]/15 border border-[#E53935]/30 text-[#E53935] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1 mb-2.5 rounded-[4px]">
            MANUFACTURING EXCELLENCE
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-roboto tracking-tight text-white">
            State-of-the-Art <span className="text-[#E53935]">Infrastructure</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2">
            Every mechanical seal leaving our facility is machined on modern CNC equipment
            and inspected to meet global API 682, DIN 24960, and ISO standards.
          </p>
        </div>

        {/* 3 Infrastructure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="group bg-[#1E293B]/70 border border-slate-700/70 hover:border-[#E53935]/60 rounded-[8px] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                  <Image
                    src={cap.image}
                    alt={cap.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/30" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs border border-white/10 px-2.5 py-1 rounded-[3px] text-[10px] font-bold uppercase tracking-wider text-white">
                    {cap.tag}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-[4px] bg-[#E53935]/20 text-[#E53935] flex items-center justify-center shrink-0">
                        <Icon size={14} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold font-roboto text-white group-hover:text-[#E53935] transition-colors">
                        {cap.title}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>

                  {/* Specs List */}
                  <div className="pt-3 border-t border-slate-700/60 space-y-1.5">
                    {cap.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300">
                        <CheckCircle2 size={13} className="text-[#E53935] shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Ribbon */}
        <div className="mt-12 lg:mt-16 bg-[#162032] border border-slate-700/80 rounded-[8px] p-6 sm:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-700/60">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className={`text-center space-y-1 ${idx > 0 ? "pt-4 lg:pt-0" : ""}`}
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-roboto text-[#E53935]">
                  {s.value}
                </div>
                <div className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                  {s.label}
                </div>
                <div className="text-[11px] text-slate-400">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

