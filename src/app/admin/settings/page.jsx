"use client";

import { useEffect, useState } from "react";
import {
  User,
  Lock,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { notify } from "@/components/common/AppToaster";
import { formatShortDate } from "@/lib/utils";
import {
  fetchAdminData,
  getCachedAdminData,
  invalidateAdminCache,
} from "@/lib/adminCache";

export default function AdminSettingsPage() {
  const cached = getCachedAdminData("/api/admin/settings");
  const [admin, setAdmin] = useState(cached?.admin || null);
  const [loading, setLoading] = useState(!cached);
  const [errorMsg, setErrorMsg] = useState("");
  const [showViewPassword, setShowViewPassword] = useState(false);

  // Edit mode state (Single Account Edit-Only — no Delete / Add)
  const [isEditing, setIsEditing] = useState(false);
  const [usernameInput, setUsernameInput] = useState(cached?.admin?.username || "");
  const [passwordInput, setPasswordInput] = useState(cached?.admin?.password || "");
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadAccount() {
      try {
        const data = await fetchAdminData("/api/admin/settings");
        if (!active) return;

        if (!data || !data.success) {
          throw new Error(data?.error || "Failed to load admin settings.");
        }

        setErrorMsg("");
        setAdmin(data.admin);
        setUsernameInput(data.admin?.username || "");
        setPasswordInput(data.admin?.password || "");
      } catch (err) {
        if (!active) return;
        setErrorMsg(err.message || "Unable to load admin settings.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadAccount();
    return () => {
      active = false;
    };
  }, []);

  const handleOpenEdit = () => {
    setUsernameInput(admin?.username || "");
    setPasswordInput(admin?.password || "");
    setShowEditPassword(false);
    setErrorMsg("");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setPasswordInput(admin?.password || "");
    setShowEditPassword(false);
    setErrorMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const cleanUsername = usernameInput.trim();

    if (cleanUsername.length < 3) {
      const msg = "Username must be at least 3 characters.";
      setErrorMsg(msg);
      notify.error(msg);
      return;
    }

    if (passwordInput.length > 0 && passwordInput.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErrorMsg(msg);
      notify.error(msg);
      return;
    }

    if (admin?.has_viewable_password && !passwordInput) {
      const msg = "Password cannot be empty.";
      setErrorMsg(msg);
      notify.error(msg);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg("");

      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: cleanUsername,
          password: passwordInput,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update admin credentials.");
      }

      setAdmin(data.admin);
      invalidateAdminCache("settings");
      setPasswordInput(data.admin?.password || "");
      setShowViewPassword(false);
      setShowEditPassword(false);
      setIsEditing(false);
      window.dispatchEvent(
        new CustomEvent("admin-profile-updated", {
          detail: { username: data.admin.username },
        })
      );
      notify.success("Admin credentials updated successfully");
    } catch (err) {
      const msg = err.message || "Unable to update settings.";
      setErrorMsg(msg);
      notify.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <AdminNavbar title="Admin Settings" />

      <main className="p-5 sm:p-7 max-w-4xl w-full mx-auto space-y-6 font-roboto">
        {/* Header Notice Card */}
        <div className="bg-white border border-gray-200 border-l-4 border-l-[#E53935] rounded-[6px] p-5 sm:p-6 shadow-xs flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#E53935] border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px]">
              <ShieldCheck size={12} />
              <span>Single Admin Account · Edit Only</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1A1A1A] pt-1">
              Login Account & Security
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Update your admin portal username or login password. Creating extra accounts or deleting the primary administrator account is restricted.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[6px] text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Main Single Account Credentials Card */}
        <div className="bg-white border border-gray-200 rounded-[6px] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                Administrator Credentials
              </h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {admin?.updated_at
                  ? `Last updated on ${formatShortDate(admin.updated_at)}`
                  : "JWT session protected account"}
              </p>
            </div>

            {!loading && !isEditing && (
              <button
                type="button"
                onClick={handleOpenEdit}
                className="flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-[6px] shadow-xs transition-all cursor-pointer"
              >
                <Edit2 size={14} />
                <span>Edit</span>
              </button>
            )}
          </div>

          {loading ? (
            <div className="py-14 flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-500">
              <Loader2 size={18} className="animate-spin text-[#E53935]" />
              <span>Loading admin credentials...</span>
            </div>
          ) : !isEditing ? (
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-4 rounded-[6px] bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <User size={13} className="text-[#E53935]" />
                  <span>Admin Username</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-[#1A1A1A] break-all">
                  {admin?.username}
                </p>
              </div>

              <div className="p-4 rounded-[6px] bg-gray-50 border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    <Lock size={13} className="text-[#E53935]" />
                    <span>Password</span>
                  </div>
                  {admin?.has_viewable_password && (
                    <button
                      type="button"
                      onClick={() => setShowViewPassword((prev) => !prev)}
                      aria-label={
                        showViewPassword ? "Hide password" : "Show password"
                      }
                      title={
                        showViewPassword ? "Hide password" : "Show password"
                      }
                      className="p-1 text-gray-500 hover:text-[#E53935] rounded-[4px] hover:bg-gray-200/70 transition-colors cursor-pointer"
                    >
                      {showViewPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-sm sm:text-base font-bold text-[#1A1A1A] font-mono break-all">
                  {admin?.has_viewable_password
                    ? showViewPassword
                      ? admin.password
                      : "••••••••••"
                    : "••••••••••"}
                </p>

                <span className="block text-[11px] text-gray-400">
                  {admin?.has_viewable_password
                    ? showViewPassword
                      ? "Click the eye icon to hide password"
                      : "Click the eye icon to view or Edit to change"
                    : "Click Edit to set a new password or sign in again once to reveal"}
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Username / Email *
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      disabled={isSaving}
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Enter admin username"
                      className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors disabled:opacity-60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                    Password {admin?.has_viewable_password ? "*" : ""}
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showEditPassword ? "text" : "password"}
                      required={Boolean(admin?.has_viewable_password)}
                      disabled={isSaving}
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={
                        admin?.has_viewable_password
                          ? "Enter password"
                          : "Enter new password (or leave blank)"
                      }
                      className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors disabled:opacity-60"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword((prev) => !prev)}
                      aria-label={
                        showEditPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      {showEditPassword ? (
                        <EyeOff size={15} />
                      ) : (
                        <Eye size={15} />
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {admin?.has_viewable_password
                      ? "Current password is pre-filled. Minimum 6 characters required."
                      : "Minimum 6 characters required when setting a password."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-[6px] transition-colors cursor-pointer"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#E53935] hover:bg-[#d32f2f] rounded-[6px] shadow-xs transition-all cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}
