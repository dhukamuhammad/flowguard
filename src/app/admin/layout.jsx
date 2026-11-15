"use client";

import { useState, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const AdminLayoutContext = createContext({
  mobileOpen: false,
  setMobileOpen: () => {},
});

export const useAdminLayout = () => useContext(AdminLayoutContext);

export default function AdminRootLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <div className={outfit.className}>{children}</div>;
  }

  return (
    <AdminLayoutContext.Provider value={{ mobileOpen, setMobileOpen }}>
      <div className={`flex h-screen overflow-hidden bg-[#F8FAFC] text-gray-900 ${outfit.className}`}>
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
          {children}
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}