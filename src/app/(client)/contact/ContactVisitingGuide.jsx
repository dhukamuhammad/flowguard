import { Plane, Train, Clock, MapPin, Building2, ShieldCheck } from "lucide-react";

export default function ContactVisitingGuide() {
  return (
    <section className="py-14 sm:py-16 bg-[#121316] text-white font-roboto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block mb-1">
            Plant Visit &amp; Audits
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Visiting Flow Guard Works &amp; Facilities
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1.5 leading-relaxed">
            We welcome technical audits, vendor evaluation teams, and plant maintenance engineers to inspect our manufacturing and testing setup.
          </p>
        </div>

        {/* 3 Travel & Operating Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Airport Access */}
          <div className="bg-[#1C1E23] p-6 rounded-[8px] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#E53935] flex items-center justify-center">
              <Plane size={20} />
            </div>
            <h3 className="text-base font-bold text-white">
              Airport Connectivity
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-white block mb-0.5">
                Sardar Vallabhbhai Patel International (AMD)
              </strong>
              Located approximately 110 km from Rajosana. Direct 2 to 2.5 hour drive via state highway with taxi and cab services readily available.
            </p>
          </div>

          {/* Card 2: Railway & Highway Access */}
          <div className="bg-[#1C1E23] p-6 rounded-[8px] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#E53935] flex items-center justify-center">
              <Train size={20} />
            </div>
            <h3 className="text-base font-bold text-white">
              Rail &amp; Highway Connectivity
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              <strong className="text-white block mb-0.5">
                Mehsana Junction (45 km) / Palanpur (60 km)
              </strong>
              Well connected to the Western Railway broad-gauge network. Smooth road transit connecting through the northern Gujarat industrial belt.
            </p>
          </div>

          {/* Card 3: Working & Audit Hours */}
          <div className="bg-[#1C1E23] p-6 rounded-[8px] border border-gray-800 space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-[#E53935] flex items-center justify-center">
              <Clock size={20} />
            </div>
            <h3 className="text-base font-bold text-white">
              Working &amp; Visiting Hours
            </h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p>
                <span className="text-white font-semibold">Manufacturing Floor:</span>{" "}
                Mon – Sat: 8:30 AM – 6:30 PM
              </p>
              <p>
                <span className="text-white font-semibold">Corporate Office:</span>{" "}
                Mon – Sat: 9:00 AM – 7:00 PM
              </p>
              <p className="text-amber-400/90 text-[11px] pt-1">
                * Vendor audits scheduled 48 hours in advance.
              </p>
            </div>
          </div>
        </div>

        {/* Address Banner */}
        <div className="mt-8 bg-[#181A1F] border border-gray-800 p-5 sm:p-6 rounded-[8px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#E53935] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin size={16} />
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                Official Factory Address
              </span>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                Flow Guard EngTech Industries — Plot No. 3, SR No. 98, Behind HDFC Bank, At Rajosana, Ta. Vadagam, Dist. Banaskantha, Gujarat – 385210
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 flex-shrink-0 self-end sm:self-center">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>ISO 9001 Compliant Facility</span>
          </div>
        </div>
      </div>
    </section>
  );
}

