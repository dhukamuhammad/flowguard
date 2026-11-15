"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import BlogForm from "@/components/admin/blog/BlogForm";

function BlogFormContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [loading, setLoading] = useState(Boolean(editId));
  const [blogToEdit, setBlogToEdit] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!editId) return;

    let active = true;

    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs/${editId}`, { cache: "no-store" });
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.success || !data.blog) {
          throw new Error(data.error || "Blog post not found.");
        }

        setBlogToEdit(data.blog);
      } catch (err) {
        if (!active) return;
        setLoadError(err.message || "Failed to load blog post for editing.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchBlog();
    return () => {
      active = false;
    };
  }, [editId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-2.5 text-xs text-gray-500">
        <Loader2 size={24} className="animate-spin text-[#E53935]" />
        <span>Loading blog post details...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="p-8 text-center bg-white border border-red-200 rounded-[6px] max-w-lg mx-auto text-red-600 text-sm">
        {loadError}
      </div>
    );
  }

  return <BlogForm blogToEdit={blogToEdit} />;
}

export default function AddOrEditBlogPage() {
  return (
    <>
      <AdminNavbar title="Blog Editor" />
      <main className="p-4 sm:p-6 max-w-7xl w-full mx-auto">
        <Suspense
          fallback={
            <div className="py-24 flex items-center justify-center gap-2 text-xs text-gray-500">
              <Loader2 size={20} className="animate-spin text-[#E53935]" />
              <span>Loading editor...</span>
            </div>
          }
        >
          <BlogFormContent />
        </Suspense>
      </main>
    </>
  );
}

