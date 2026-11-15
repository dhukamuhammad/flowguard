import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";

export default function ProductCtaBanner() {
  return (
    <section className="bg-white py-12 sm:py-16 text-[#1A1A1A] relative border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="bg-[#1A1A1A] rounded-[10px] p-8 sm:p-12 text-white relative overflow-hidden shadow-xl border border-gray-800">
          
          {/* Subtle Red Radial Glow in corner */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#E53935]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block bg-[#E53935] text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-[3px]">
                GET STARTED WITH FLOW GUARD
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-roboto tracking-tight text-white leading-tight">
                Ready to Upgrade Your Plant&apos;s Sealing Reliability?
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-2xl leading-relaxed">
                Connect directly with our application engineers for custom cartridge seal designs,
                direct OEM replacements, and fast turnaround technical quotes.
              </p>

              {/* Quick Contact Points */}
              <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#E53935]" />
                  <span>+91 94276 02434 / +91 97262 72584</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#E53935]" />
                  <span>contact@flowguard.in</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#E53935]" />
                  <span>Gujarat, India</span>
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center lg:items-end">
              <Link href="/contact" className="w-full sm:w-auto lg:w-full">
                <button className="w-full bg-[#E53935] hover:bg-[#d32f2f] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-[6px] shadow-md shadow-[#E53935]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Request a Quote</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
              
              <Link href="/industries" className="w-full sm:w-auto lg:w-full">
                <button className="w-full bg-transparent hover:bg-white/10 text-white border border-white/20 font-semibold text-xs sm:text-sm px-6 py-3 rounded-[6px] hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Explore Industries</span>
                  <ArrowRight size={14} className="text-white/70" />
                </button>
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

