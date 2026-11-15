"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#141517] text-[#9CA3AF] font-roboto overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top Branding Banner Row: "Best Industry for" + FLOW GUARD Logo */}
        <div className="pt-16 sm:pt-20 pb-10 sm:pb-12 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight">
            Best Industry for
          </h2>

          <div className="relative h-12 sm:h-14 lg:h-16 w-56 sm:w-64 lg:w-72 flex-shrink-0">
            <Image
              src="/client/logo.png"
              alt="Flow Guard Engtech Industries"
              fill
              className="object-contain object-left md:object-right"
            />
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="py-12 sm:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12">
          {/* Column 1: Company */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-5 font-roboto tracking-wide">
              Company
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#9CA3AF]">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/industries"
                  className="hover:text-white transition-colors"
                >
                  Industries
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Our Services */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-5 font-roboto tracking-wide">
              Our Services
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#9CA3AF]">
              <li>CNC Machining</li>
              <li>Custom Machining &amp; Fabrication</li>
              <li>Milling Services</li>
              <li>Turning Services</li>
              <li>Prototype Manufacturing</li>
              <li>Production Machining</li>
            </ul>
          </div>

          {/* Column 3: Industries We Serve */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-5 font-roboto tracking-wide">
              Industries We Serve
            </h4>
            <ul className="space-y-3 text-xs sm:text-[13px] text-[#9CA3AF]">
              <li>Oil &amp; Gas</li>
              <li>Petrochemical</li>
              <li>Power Plants</li>
              <li>Water Treatment</li>
              <li>Pharmaceuticals</li>
              <li>Food &amp; Beverage</li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-bold text-base sm:text-lg mb-5 font-roboto tracking-wide">
              Contact
            </h4>
            <div className="space-y-3.5 text-xs sm:text-[13px] text-[#9CA3AF] leading-relaxed">
              <p>
                Plot No. 3, SR No. 98, Behind HDFC Bank, At Rajosana, Ta. Vadagam,
                Dist. Banaskantha, Gujarat – 385210
              </p>

              <p>
                Phone:{" "}
                <a
                  href="tel:+911234567890"
                  className="hover:text-white transition-colors"
                >
                  +9112345 67890
                </a>
              </p>

              <p>
                <a
                  href="mailto:info@flowgaurd.com"
                  className="hover:text-white transition-colors"
                >
                  info@flowgaurd.com
                </a>
              </p>

              <p>Mon-Sun: 10:00 AM – 7:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-white/10 py-6 sm:py-8 flex items-center justify-center text-center text-xs text-[#9CA3AF]">
          <p>© 2026 Rakshit bhatol Inc. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
