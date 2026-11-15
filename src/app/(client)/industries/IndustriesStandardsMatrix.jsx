import { ShieldCheck, Check, FileText } from "lucide-react";

export default function IndustriesStandardsMatrix() {
  const standards = [
    {
      code: "API 682 4th Edition",
      name: "Pumps - Shaft Sealing Systems",
      sectors: "Oil & Gas, Petrochemical, Refining",
      description: "Standardized cartridge categories (Cat 1, 2, 3), arrangements (Plan 52, 53A/B/C), and qualification test parameters.",
      badge: "Heavy-Duty Petroleum",
    },
    {
      code: "ISO 21049 / DIN 24960",
      name: "Standardized Seal Cavity & Dimensions",
      sectors: "Chemical, General Industrial, Power",
      description: "Interchangeable metric dimensions conforming to standard EN 12756 pump stuffing boxes for seamless plant retrofits.",
      badge: "Global Standard",
    },
    {
      code: "FDA 21 CFR & USP Class VI",
      name: "Sanitary & Food Grade Materials",
      sectors: "Pharmaceutical, Biotechnology, Food & Beverage",
      description: "Certified non-toxic, extractables-tested elastomers (EPDM, FKM, FFKM) ensuring zero fluid contamination.",
      badge: "Hygienic Grade",
    },
    {
      code: "ATEX 2014/34/EU",
      name: "Explosive Atmosphere Safety",
      sectors: "Refineries, Chemical Plants, Gas Processing",
      description: "Temperature monitoring and spark-prevention designs certified for hazardous Zone 0, Zone 1, and Zone 2 operations.",
      badge: "Explosion Proof",
    },
  ];

  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20 text-[#1A1A1A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block bg-[#F1F5F9] border border-[#E2E8F0] text-[#1A1A1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3.5 py-1 mb-2.5 rounded-[3px]">
            COMPLIANCE &amp; ACCREDITATION
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-roboto tracking-tight text-[#1A1A1A]">
            Engineered to International <span className="text-[#E53935]">Standards</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            Every mechanical seal and cartridge system we manufacture complies with rigorous
            global engineering standards and testing certifications.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] p-5 sm:p-6 hover:border-[#E53935]/40 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-[4px] bg-[#E53935]/10 text-[#E53935] flex items-center justify-center">
                      <FileText size={16} strokeWidth={2.2} />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#E53935]">
                      {std.code}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-[3px]">
                    {std.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold font-roboto text-[#1A1A1A]">
                    {std.name}
                  </h3>
                  <p className="text-xs text-[#64748B] font-medium mt-0.5">
                    Target Sectors: {std.sectors}
                  </p>
                </div>

                <p className="text-xs sm:text-[13px] text-[#475569] leading-relaxed pt-1">
                  {std.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] mt-4 flex items-center gap-2 text-[11px] text-[#10B981] font-semibold">
                <Check size={14} strokeWidth={3} />
                <span>100% Certified Material Test Reports (MTR) Available</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

