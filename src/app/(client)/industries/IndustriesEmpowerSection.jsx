import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Shield, Flame, Zap, Droplets, FlaskConical, Utensils } from "lucide-react";

export default function IndustriesEmpowerSection() {
  const industries = [
    {
      id: "oil-gas",
      title: "Oil & Gas",
      image: "/client/industries/oil-gas.jpg",
      icon: Flame,
      summary: "Mission-critical sealing systems for upstream extraction, pipeline boosting, and offshore platforms.",
      challenges: "High pressure (up to 150 bar), toxic H2S sour crude, particulate abrasive slurries.",
      sealSolutions: ["API 682 Category 2/3 Cartridge Seals", "Plan 53B Pressurized Barrier Systems", "Inconel & Hastelloy Bellow Seals"],
      compliance: "API 682 4th Ed / NACE MR0175",
    },
    {
      id: "petrochemical",
      title: "Petrochemical & Refining",
      image: "/client/industries/petrochemical.jpg",
      icon: Shield,
      summary: "Engineered mechanical seals for high-temperature cracking, aromatic solvents, and corrosive hydrocarbons.",
      challenges: "Thermal swings (-50°C to +400°C), VOC fugitive emissions, aggressive acid slurries.",
      sealSolutions: ["Double Balanced Cartridge Seals", "Silicon Carbide (SiC) vs SiC Faces", "High-Temp Stationary Bellows"],
      compliance: "ISO 21049 / ATEX Zone 0/1",
    },
    {
      id: "power",
      title: "Power Generation",
      image: "/client/industries/power-plants.jpg",
      icon: Zap,
      summary: "Heavy-duty rotating equipment seals for thermal, nuclear, combined-cycle, and hydro power plants.",
      challenges: "High peripheral velocities (>40 m/s), demineralized water lubricity, sudden load swings.",
      sealSolutions: ["Boiler Feed Pump (BFP) Seals", "Flue Gas Desulfurization (FGD) Heavy Slurry Seals", "Hydrodynamic Laser-Grooved Faces"],
      compliance: "DIN 24960 / ASME Section III",
    },
    {
      id: "water-treatment",
      title: "Water & Wastewater Treatment",
      image: "/client/industries/water-treatment.jpg",
      icon: Droplets,
      summary: "Robust, clog-free mechanical seals for municipal wastewater, industrial ETP/STP, and seawater desalination.",
      challenges: "Heavy stringy fibrous solids, abrasive silica grit, high chloride pitting corrosion.",
      sealSolutions: ["Non-Clogging Wave Spring Seals", "External Slurry Cartridge Seals", "Super Duplex SS & Tungsten Carbide"],
      compliance: "ISO 9001 / WRAS Approved Materials",
    },
    {
      id: "pharma",
      title: "Pharmaceutical & Biotech",
      image: "/client/industries/pharma.jpg",
      icon: FlaskConical,
      summary: "Ultra-pure sanitary sealing for API chemical reactors, sterile agitation vessels, and cleanroom pumps.",
      challenges: "Zero cross-contamination, CIP/SIP steam sterilization (135°C), vacuum-to-pressure cycling.",
      sealSolutions: ["Sanitary Dry-Running Agitator Seals", "FDA-Grade USP Class VI Elastomers", "Debris-Free Non-Contacting Gas Seals"],
      compliance: "FDA 21 CFR / ASME BPE / GMP",
    },
    {
      id: "food-beverages",
      title: "Food & Beverage Processing",
      image: "/client/industries/food-beverages.jpg",
      icon: Utensils,
      summary: "Hygienic mechanical seals designed for dairy, breweries, syrups, edible oils, and sanitary processing lines.",
      challenges: "Frequent caustic washdowns, sticky high-viscosity sugars, strict hygiene mandates.",
      sealSolutions: ["Clean-In-Place (CIP) Flushable Seals", "Food-Grade Silicon Carbide / Carbon", "Smooth Electropolished Hardware"],
      compliance: "3-A Sanitary / FDA 21 CFR / EC 1935/2004",
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 text-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header with exact Brochure Pill */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-12 border-b border-[#E2E8F0] pb-6">
          <div className="space-y-3">
            <div className="inline-block bg-[#E53935] text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-[3px] shadow-xs">
              Industries We Empower
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold font-roboto tracking-tight text-[#1A1A1A]">
              Engineered for Extreme Operating Conditions Across{" "}
              <span className="text-[#E53935]">6 Key Sectors</span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-md leading-relaxed">
            Every sector faces distinct operating dynamics. Flow Guard customizes metallurgy,
            face pairings, and barrier fluid configurations to ensure reliable pump uptime.
          </p>
        </div>

        {/* 6 Industry Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((ind) => {
            const Icon = ind.icon;
            return (
              <div
                key={ind.id}
                className="group bg-[#F8FAFC] hover:bg-white rounded-[10px] border border-[#E2E8F0] hover:border-[#E53935] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div>
                  {/* Photo with subtle zoom effect */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                    <Image
                      src={ind.image}
                      alt={`${ind.title} - Flow Guard Sealing Solutions`}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Top Industry Pill Badge */}
                    <div className="absolute top-3 left-3 bg-[#1A1A1A]/80 backdrop-blur-xs border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-[4px] flex items-center gap-1.5">
                      <Icon size={13} className="text-[#E53935]" />
                      <span>{ind.title}</span>
                    </div>

                    {/* Bottom Compliance Tag */}
                    <div className="absolute bottom-3 left-3 text-[10px] font-mono text-white/90 bg-black/60 px-2 py-0.5 rounded-[2px] border border-white/10">
                      {ind.compliance}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold font-roboto text-[#1A1A1A] group-hover:text-[#E53935] transition-colors">
                        {ind.title}
                      </h3>
                      <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed mt-1">
                        {ind.summary}
                      </p>
                    </div>

                    {/* Key Challenge Box */}
                    <div className="bg-white group-hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-[6px] p-3 text-xs">
                      <span className="font-bold text-[#E53935] block text-[11px] uppercase tracking-wider mb-0.5">
                        Operational Challenges:
                      </span>
                      <p className="text-[#64748B] text-[11.5px] leading-snug">
                        {ind.challenges}
                      </p>
                    </div>

                    {/* Sealing Solutions */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#1A1A1A]">
                        Recommended Flow Guard Seals:
                      </span>
                      {ind.sealSolutions.map((sol, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#334155]">
                          <CheckCircle2 size={13} className="text-[#E53935] shrink-0" />
                          <span className="text-[11.5px]">{sol}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Link / Inquiry */}
                <div className="p-5 sm:p-6 pt-0">
                  <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E53935] group-hover:text-[#d32f2f] hover:underline"
                    >
                      <span>Inquire for {ind.title}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <span className="text-[10px] text-[#94A3B8] font-medium uppercase tracking-wider">
                      Zero Leakage
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

