"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center font-roboto">
      <div className="flex items-center gap-3 text-sm text-gray-500">
        <div className="w-4 h-4 border-2 border-[#E53935] border-t-transparent animate-spin" />
        <span>Loading Admin Dashboard...</span>
      </div>
    </div>
  );
}

