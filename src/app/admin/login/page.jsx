"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, User, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { notify } from "@/components/common/AppToaster";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid username or password.");
      }

      notify.success("Signed in successfully", "Welcome to Flow Guard Admin.");
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      const msg = err.message || "Authentication failed.";
      setError(msg);
      notify.error("Authentication failed", msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] text-gray-900 font-roboto">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-[6px] p-8 sm:p-9 shadow-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Live Website</span>
        </Link>

        {/* Brand Logo & Title */}
        <div className="text-center mb-8">
          <div className="relative h-11 w-44 mx-auto mb-3">
            <Image
              src="/admin/flowguard-logo.png"
              alt="Flow Guard"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
          <div className="inline-block bg-red-50 text-[#E53935] border border-red-200 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] mb-1">
            Flow Guard Admin Portal
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#1A1A1A] mt-1">
            Management Sign In
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Enter credentials to manage mechanical seals and inquiries.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-[#E53935] text-xs text-center font-medium rounded-[4px]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Username / Email
            </label>
            <div className="relative">
              <User
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                disabled={loading}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors disabled:opacity-60"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#E53935] hover:bg-[#d32f2f] text-white font-bold text-xs sm:text-sm rounded-[6px] shadow-xs transition-all cursor-pointer mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In to Admin Portal</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
