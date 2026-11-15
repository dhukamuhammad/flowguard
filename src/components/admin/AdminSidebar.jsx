"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  BookOpen,
  MessageSquareQuote,
  Settings,
  ExternalLink,
  X,
} from "lucide-react";

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/admin" || pathname.startsWith("/admin/dashboard"),
    },
    {
      name: "Category",
      href: "/admin/category",
      icon: Layers,
      active: pathname.startsWith("/admin/category"),
    },
    {
      name: "Product",
      href: "/admin/product",
      icon: Package,
      active: pathname.startsWith("/admin/product"),
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: BookOpen,
      active: pathname.startsWith("/admin/blog"),
    },
    {
      name: "Inquiries",
      href: "/admin/inquiries",
      icon: MessageSquareQuote,
      active: pathname.startsWith("/admin/inquiries"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
      active: pathname.startsWith("/admin/settings"),
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-white text-gray-800 p-4 font-roboto border-r border-gray-200 overflow-hidden">
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">
        {/* Brand Logo & Header */}
        <div className="flex items-center justify-between pb-5 mb-5 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="relative h-9 w-40">
              <Image
                src="/admin/flowguard-logo.png"
                alt="Flow Guard"
                fill
                className="object-contain object-left"
                priority
                unoptimized
              />
            </div>
          </Link>

          {/* Close button on mobile */}
          {setMobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-gray-500 hover:text-black border border-gray-200 rounded-[6px] hover:bg-gray-100 transition-colors"
              aria-label="Close Sidebar"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Portal Tag */}
        <div className="px-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            Flow Guard Management
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs sm:text-sm font-semibold rounded-[6px] transition-all ${
                  link.active
                    ? "bg-[#E53935] text-white shadow-xs"
                    : "text-gray-700 hover:bg-gray-100 hover:text-black border border-transparent"
                }`}
              >
                <Icon size={16} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Clean Live Website Link (Opens in New Tab) */}
      <div className="flex-shrink-0 pt-4 mt-2 border-t border-gray-200">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setMobileOpen && setMobileOpen(false)}
          title="Open Live Website in New Tab"
          className="flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-[6px] border border-gray-200 transition-colors"
        >
          <ExternalLink size={14} className="text-[#E53935]" />
          <span>Live Website</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar (Width w-56, locked to 100vh) */}
      <aside className="hidden lg:block w-56 flex-shrink-0 h-full z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-2xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
