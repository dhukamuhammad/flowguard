"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { useAdminLayout } from "@/app/admin/layout";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { performAdminLogout } from "@/lib/adminClientAuth";

export default function AdminNavbar({ title, onToggleSidebar }) {
  const router = useRouter();

  const [adminUsername, setAdminUsername] = useState("Administrator");
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  let adminLayoutContext = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    adminLayoutContext = useAdminLayout();
  } catch {
    // fallback
  }

  // Load current logged-in admin username and listen for Settings edits
  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;
        if (res.ok && data.success && data.admin?.username) {
          setAdminUsername(data.admin.username);
        }
      } catch {
        // Silently ignore navbar profile fetch error
      }
    }

    const handleProfileUpdate = (e) => {
      if (e?.detail?.username) {
        setAdminUsername(e.detail.username);
      }
    };

    loadProfile();
    window.addEventListener("admin-profile-updated", handleProfileUpdate);
    return () => {
      active = false;
      window.removeEventListener("admin-profile-updated", handleProfileUpdate);
    };
  }, []);

  const handleToggleSidebar =
    onToggleSidebar ||
    (() => {
      if (adminLayoutContext?.setMobileOpen) {
        adminLayoutContext.setMobileOpen(true);
      }
    });

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    await performAdminLogout(router);
  };

  return (
    <>
      <header className="h-16 flex-shrink-0 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 font-roboto">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 text-gray-700 hover:text-black border border-gray-200 rounded-[6px] hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Open Sidebar"
          >
            <Menu size={18} />
          </button>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
              {title || "Dashboard"}
            </h1>
          </div>
        </div>

        {/* Right: Profile Badge & Single Logout Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/admin/settings"
            title="Open Admin Settings"
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 rounded-[6px] bg-gray-100 border border-gray-300 text-gray-900 flex items-center justify-center font-bold text-xs uppercase">
              {(adminUsername || "A").charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-[#1A1A1A] leading-none">
                Administrator
              </span>
              <span className="block text-[10px] text-gray-500 mt-0.5 max-w-[140px] truncate">
                {adminUsername}
              </span>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setLogoutModalOpen(true)}
            title="Sign Out"
            aria-label="Sign Out"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#E53935] border border-gray-200 hover:border-red-200 rounded-[6px] hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <DeleteConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => !isLoggingOut && setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isDeleting={isLoggingOut}
        variant="logout"
        headerLabel="Confirm Session Exit"
        title="Sign Out of Admin Portal"
        description="Are you sure you want to sign out? You will need to sign in again to access dashboard, products, and quote inquiries."
        confirmLabel="Sign Out"
        loadingLabel="Signing out..."
        cancelLabel="Cancel"
      />
    </>
  );
}
