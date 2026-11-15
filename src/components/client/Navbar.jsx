"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const SCROLL_THRESHOLD = 40;

function subscribeScroll(callback) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

const getScrollSnapshot = () => window.scrollY > SCROLL_THRESHOLD;
const getServerSnapshot = () => false;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isScrolled = useSyncExternalStore(
    subscribeScroll,
    getScrollSnapshot,
    getServerSnapshot
  );

  const isLinkActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/products") {
      return (
        pathname === "/products" ||
        pathname === "/product" ||
        pathname.startsWith("/products/") ||
        pathname.startsWith("/product/")
      );
    }
    return pathname.startsWith(href);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Product", href: "/products" },
    { name: "Industries", href: "/industries" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 motion-reduce:transition-none ${
        isScrolled
          ? "py-3 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/25"
          : "pt-6 pb-4 bg-transparent"
      }`}
    >
      {/* Container aligned with Hero content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex items-center justify-between">
        {/* Brand Logo - Perfectly aligned on left grid line */}
        <Link href="/" className="flex items-center group">
          <div
            className={`relative transition-all duration-300 motion-reduce:transition-none ${
              isScrolled ? "h-9 sm:h-10 w-40 sm:w-48" : "h-11 w-44 sm:w-52"
            }`}
          >
            <Image
              src="/client/logo.png"
              alt="Flow Guard Engtech Industries"
              fill
              className="object-contain object-left group-hover:opacity-95 transition-opacity"
              priority
            />
          </div>
        </Link>

        {/* Desktop Navigation Box - Rounded-[6px] */}
        <div
          className={`hidden lg:flex items-center rounded-[6px] px-2 py-1.5 backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${
            isScrolled
              ? "bg-white/8 border border-white/15 shadow-md shadow-black/20"
              : "bg-white/10 border border-white/20 shadow-xl shadow-black/20"
          }`}
        >
          <nav className="flex items-center gap-7 px-5">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  className="relative text-sm font-medium text-white/90 hover:text-white transition-colors py-1 group"
                >
                  {link.name}
                  {active ? (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#E53935] rounded-full" />
                  ) : (
                    <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#E53935] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* "Get a Quote" Button - Rounded-[6px] */}
          <Link href="/contact" prefetch={true}>
            <button className="bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-5 py-2.5 rounded-[6px] transition-all shadow-md shadow-[#E53935]/40 hover:scale-105 active:scale-95 cursor-pointer">
              Get a Quote
            </button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-[6px] bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 mx-4 sm:mx-8 p-5 rounded-[6px] bg-[#1A1A1A]/95 backdrop-blur-xl border border-white/15 shadow-2xl space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-[6px] text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#E53935]/20 text-[#E53935] font-semibold"
                      : "text-[#E5E7EB] hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-white/10">
            <Link
              href="/contact"
              prefetch={true}
              onClick={() => setMobileMenuOpen(false)}
            >
              <button className="w-full bg-[#E53935] hover:bg-[#d32f2f] text-white text-sm font-semibold py-3 rounded-[6px] transition-all shadow-lg shadow-[#E53935]/30 cursor-pointer">
                Get a Quote
              </button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
