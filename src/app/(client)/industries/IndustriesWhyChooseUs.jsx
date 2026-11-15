import { Cog, Sliders, ShieldCheck, Headphones, Award } from "lucide-react";

export default function IndustriesWhyChooseUs() {
  const pillars = [
    {
      id: "experience",
      title: "Experience",
      gearColor: "text-sky-600 bg-sky-50 border-sky-200 group-hover:border-sky-500",
      accentBadge: "bg-sky-100 text-sky-800",
      icon: Award,
      quote: "Decades of precision engineering expertise go into each and every project.",
      details: [
        "Specialized in pump, agitator & mixer seal designs",
        "Deep knowledge of API 682, DIN & ISO standards",
        "Proven track record across global process plants",
      ],
    },
    {
      id: "customisation",
      title: "Customisation",
      gearColor: "text-purple-600 bg-purple-50 border-purple-200 group-hover:border-purple-500",
      accentBadge: "bg-purple-100 text-purple-800",
      icon: Sliders,
      quote: "Personalised solutions to each client's specific needs.",
      details: [
        "Tailored gland plates, bolt circles & shaft sleeves",
        "Engineered face combinations (SiC, TC, Carbon, Ceramic)",
        "Custom barrier fluid auxiliary system design",
      ],
    },
    {
      id: "reliability",
      title: "Reliability",
      gearColor: "text-amber-600 bg-amber-50 border-amber-200 group-hover:border-amber-500",
      accentBadge: "bg-amber-100 text-amber-800",
      icon: ShieldCheck,
      quote: "Our products are designed to perform in the harshest conditions.",
      details: [
        "100% Dynamic and hydrostatic pressure testing",
        "Sub-micron optical flat face lapping inspection",
        "Resistance to thermal shock and corrosive slurries",
      ],
    },
    {
      id: "support",
      title: "Customer Support",
      gearColor: "text-[#E53935] bg-red-50 border-red-200 group-hover:border-[#E53935]",
      accentBadge: "bg-red-100 text-[#E53935]",
      icon: Headphones,
      quote: "We guide from product selection through after-sales for our customers.",
      details: [
        "Fast 24-hour technical proposal turnaround",
        "On-site installation and commissioning guidance",
        "Seal refurbishing, failure analysis & emergency spares",
      ],
    },
  ];

  return (
    <section className="bg-[#F8FAFC] py-14 sm:py-16 lg:py-20 text-[#1A1A1A] border-y border-[#E2E8F0] relative overflow-hidden">
      {/* Background Subtle Gear Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#1A1A1A 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* Central Gear Header from Brochure */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1A1A1A] text-white px-5 py-2 rounded-full shadow-md mb-4">
            <Cog size={18} className="text-[#E53935] animate-[spin_10s_linear_infinite]" />
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest">
              Why Choose Us
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold font-roboto tracking-tight text-[#1A1A1A]">
            Engineering Precision Meets{" "}
            <span className="text-[#E53935]">Industry Reliability</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2">
            The 4 interconnected operational pillars that define Flow Guard&apos;s commitment
            to plants across the globe.
          </p>
        </div>

        {/* 4 Pillars Grid (Directly mirroring the brochure flowchart) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="group bg-white rounded-[10px] p-6 border border-[#E2E8F0] hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Top Gear Icon & Title */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Stylized Gear Container */}
                    <div className={`w-12 h-12 rounded-[8px] border-2 flex items-center justify-center transition-all duration-300 ${pillar.gearColor}`}>
                      <Icon size={22} strokeWidth={2.2} />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[3px] ${pillar.accentBadge}`}>
                      Pillar
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold font-roboto text-[#1A1A1A] group-hover:text-[#E53935] transition-colors">
                      {pillar.title}
                    </h3>
                    <div className="w-8 h-1 bg-[#E53935] mt-1.5 rounded-full" />
                  </div>

                  {/* Exact Quote from Brochure */}
                  <blockquote className="text-xs sm:text-[13px] font-medium text-[#1E293B] italic leading-relaxed border-l-2 border-slate-300 pl-3">
                    &ldquo;{pillar.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Technical Bullet Points */}
                <div className="pt-4 border-t border-[#F1F5F9] mt-6 space-y-2">
                  {pillar.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-[#64748B]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] shrink-0 mt-1" />
                      <span className="leading-snug">{detail}</span>
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

