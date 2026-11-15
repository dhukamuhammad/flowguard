import { Eye, Target, Sparkles, Check } from "lucide-react";

export default function AboutVisionMission() {
  return (
    <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 text-[#1A1A1A] border-y border-[#E2E8F0] relative overflow-hidden">
      {/* Background Subtle Technical Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1A1A1A 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-block bg-gradient-to-r from-white via-white/80 to-transparent border border-[#E2E8F0] text-[#1A1A1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 mb-2.5 shadow-2xs">
            GUIDING PRINCIPLES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-roboto tracking-tight text-[#1A1A1A]">
            Our Vision &amp; Strategic <span className="text-[#E53935]">Mission</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            The guiding philosophy driving our engineering decisions, manufacturing investments,
            and long-term partnerships with process plants.
          </p>
        </div>

        {/* 2 High Impact Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Card 1: Our Vision (Direct from Reference Brochure) */}
          <div className="bg-white rounded-[10px] p-6 sm:p-8 border border-[#E2E8F0] hover:border-[#E53935]/40 transition-all duration-200 shadow-xs relative flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-[6px] bg-[#E53935]/10 text-[#E53935] flex items-center justify-center group-hover:bg-[#E53935] group-hover:text-white transition-colors duration-200">
                  <Eye size={24} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-[#E53935] bg-[#E53935]/10 px-2.5 py-1 rounded-[4px]">
                  Future Horizon
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-roboto text-[#1A1A1A]">
                  Our Vision
                </h3>
                <div className="w-10 h-1 bg-[#E53935] mt-1.5 rounded-full" />
              </div>

              {/* Exact Vision Statement from Reference Brochure */}
              <blockquote className="text-base sm:text-lg font-medium text-[#1E293B] italic leading-snug border-l-3 border-[#E53935] pl-4 py-1">
                &ldquo;To redefine industrial sealing technology with sustainable,
                high-performance solutions trusted worldwide.&rdquo;
              </blockquote>

              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed pt-1">
                We envision a future where industrial pumping and fluid handling equipment
                operates at zero unplanned downtime and negligible fugitive emissions,
                protecting our environment while maximizing client operational productivity.
              </p>
            </div>

            <div className="pt-6 border-t border-[#F1F5F9] mt-6 grid grid-cols-2 gap-3 text-xs text-[#334155] font-medium">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E53935] shrink-0" strokeWidth={3} />
                <span>Zero fugitive emissions</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E53935] shrink-0" strokeWidth={3} />
                <span>Extended MTBF cycles</span>
              </div>
            </div>
          </div>

          {/* Card 2: Our Mission */}
          <div className="bg-[#1A1A1A] rounded-[10px] p-6 sm:p-8 border border-[#2D3748] hover:border-[#E53935]/50 transition-all duration-200 shadow-md relative flex flex-col justify-between group text-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-[6px] bg-[#E53935] text-white flex items-center justify-center">
                  <Target size={24} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/90 bg-white/10 px-2.5 py-1 rounded-[4px]">
                  Daily Commitment
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold font-roboto text-white">
                  Our Mission
                </h3>
                <div className="w-10 h-1 bg-[#E53935] mt-1.5 rounded-full" />
              </div>

              <p className="text-sm sm:text-[15px] text-white/90 leading-relaxed font-normal">
                To design, precision-machine, and rigorously test high-integrity mechanical
                seals that withstand extreme operating temperatures, corrosive chemicals,
                and high pressures across critical rotating equipment.
              </p>

              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                By pairing advanced CNC machining and optical flat inspection with fast,
                transparent customer engineering support, we ensure that every Flow Guard
                seal installation delivers proven durability and peace of mind.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6 grid grid-cols-2 gap-3 text-xs text-white/80 font-medium">
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E53935] shrink-0" strokeWidth={3} />
                <span>100% Hydrostatic testing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={14} className="text-[#E53935] shrink-0" strokeWidth={3} />
                <span>Rapid engineering support</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

