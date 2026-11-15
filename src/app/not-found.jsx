import Link from "next/link";
import Image from "next/image";
import { Home, Layers, Mail, ArrowRight } from "lucide-react";

export const metadata = {
  title: "404 - Page Not Found | Flow Guard EngTech Industries",
  description:
    "The mechanical seal datasheet or page you requested could not be found.",
};

function SealZeroGraphic() {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 text-white drop-shadow-[0_0_24px_rgba(229,57,53,0.35)]"
    >
      {/* Outer dashed rotation ring */}
      <circle
        cx="60"
        cy="60"
        r="52"
        stroke="#E53935"
        strokeWidth="3"
        strokeDasharray="10 7"
      />
      {/* Precision flange ring */}
      <circle
        cx="60"
        cy="60"
        r="41"
        stroke="currentColor"
        strokeOpacity="0.85"
        strokeWidth="4"
      />
      {/* Spring / bolt holes around perimeter */}
      <circle cx="60" cy="25" r="3" fill="#E53935" />
      <circle cx="95" cy="60" r="3" fill="#E53935" />
      <circle cx="60" cy="95" r="3" fill="#E53935" />
      <circle cx="25" cy="60" r="3" fill="#E53935" />
      <circle cx="85" cy="35" r="2.2" fill="white" fillOpacity="0.45" />
      <circle cx="85" cy="85" r="2.2" fill="white" fillOpacity="0.45" />
      <circle cx="35" cy="85" r="2.2" fill="white" fillOpacity="0.45" />
      <circle cx="35" cy="35" r="2.2" fill="white" fillOpacity="0.45" />
      {/* Inner seal face */}
      <circle
        cx="60"
        cy="60"
        r="24"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {/* Shaft bore */}
      <circle
        cx="60"
        cy="60"
        r="14"
        stroke="#E53935"
        strokeWidth="3"
        fill="#121316"
      />
      {/* Center keyway dot */}
      <circle cx="60" cy="60" r="3.5" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

export default function NotFound() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between bg-[#121316] text-white overflow-hidden font-roboto">
      {/* Subtle Circuit Background & Radial Red Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/client/home/contact-us-bg.png"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121316]/85 via-[#121316]/75 to-[#121316]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full bg-[#E53935]/10 blur-[110px]" />
      </div>

      {/* Top Logo Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-6 sm:pt-8">
        <Link href="/" className="inline-flex items-center group">
          <div className="relative h-10 sm:h-11 w-44 sm:w-52">
            <Image
              src="/client/logo.png"
              alt="Flow Guard EngTech Industries"
              fill
              priority
              className="object-contain object-left group-hover:opacity-90 transition-opacity"
            />
          </div>
        </Link>
      </header>

      {/* Center 404 Engineering Card */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
        <div className="max-w-2xl w-full text-center space-y-6">
          {/* Status Ribbon */}
          <div>
            <span className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/85 to-transparent text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-4 py-1.5">
              ERROR 404 • ROUTE NOT FOUND
            </span>
          </div>

          {/* 4 [Seal] 4 Display */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 select-none">
            <span className="text-7xl sm:text-8xl lg:text-[112px] font-bold tracking-tight leading-none text-white">
              4
            </span>
            <SealZeroGraphic />
            <span className="text-7xl sm:text-8xl lg:text-[112px] font-bold tracking-tight leading-none text-white">
              4
            </span>
          </div>

          {/* Headline with Signature Red Curved Swoosh */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
              Page{" "}
              <span className="relative inline-block">
                Not Found
                <svg
                  className="absolute -bottom-2 left-0 w-full h-2.5 sm:h-3"
                  viewBox="0 0 180 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C45 2 135 2 177 9"
                    stroke="#E53935"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-lg mx-auto leading-relaxed pt-1">
              The mechanical seal datasheet or page you requested could not be
              located. It may have been moved, renamed, or deactivated from our
              active catalog.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-[6px] shadow-lg shadow-[#E53935]/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Home size={16} />
              <span>Return to Home</span>
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/25 hover:border-white/50 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-[6px] hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Layers size={16} />
              <span>Explore Seals Catalog</span>
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#D1D5DB] hover:text-white px-3 py-2.5 transition-colors"
            >
              <Mail size={15} className="text-[#E53935]" />
              <span>Request a Quote</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Compact Footer Strip */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-6">
        <div className="border-t border-white/10 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-[#9CA3AF]">
          <span>Flow Guard EngTech Industries • Precision Mechanical Seals</span>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-white transition-colors">
              Mechanical Seals
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
