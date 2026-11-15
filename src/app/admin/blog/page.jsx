"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, AlertCircle, X } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import BlogTable from "@/components/admin/blog/BlogTable";
import BlogViewModal from "@/components/admin/blog/BlogViewModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import {
  DEFAULT_PAGE_SIZE,
  paginateItems,
} from "@/components/admin/AdminPagination";
import { notify } from "@/components/common/AppToaster";

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // View & Delete states
  const [blogToView, setBlogToView] = useState(null);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs", { cache: "no-store" });
        const data = await res.json();
        if (!active) return;

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to load blog posts.");
        }

        setPageError("");
        setBlogs(data.blogs || []);
      } catch (err) {
        if (!active) return;
        setPageError(err.message || "Unable to connect to blogs database.");
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchBlogs();
    return () => {
      active = false;
    };
  }, []);

  const handleConfirmDelete = async () => {
    if (!blogToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setPageError("");

      const res = await fetch(`/api/blogs/${blogToDelete.id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete blog post.");
      }

      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
      notify.success(`Blog "${blogToDelete.title}" deleted`);
      setBlogToDelete(null);
    } catch (err) {
      const msg = err.message || "Failed to delete blog post.";
      setPageError(msg);
      notify.error(msg);
      setBlogToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const q = searchQuery.trim().toLowerCase();
    return (
      !q ||
      blog.title.toLowerCase().includes(q) ||
      blog.slug.toLowerCase().includes(q)
    );
  });

  const {
    paginatedItems: paginatedBlogs,
    safePage,
    totalPages,
    totalItems,
    startIndex,
    showingFrom,
    showingTo,
  } = paginateItems(filteredBlogs, currentPage, pageSize);

  return (
    <>
      <AdminNavbar title="Blog Management" />

      <main className="lg:flex-1 lg:min-h-0 flex flex-col p-4 sm:p-5 max-w-7xl w-full mx-auto gap-3.5 lg:overflow-hidden font-roboto">
        {/* Error Notification Banner */}
        {pageError && (
          <div className="flex-shrink-0 flex items-center justify-between gap-3 px-4 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-[6px] text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />
              <span>{pageError}</span>
            </div>
            <button
              type="button"
              onClick={() => setPageError("")}
              className="text-red-500 hover:text-red-700 cursor-pointer"
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Action Bar: Search on left, Add Blog on right */}
        <div className="flex-shrink-0 bg-white p-3 sm:p-3.5 border border-gray-200 rounded-[6px] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search blogs by title, slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <Link
              href="/admin/blog/addblog"
              className="flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-[6px] shadow-xs transition-all"
            >
              <Plus size={15} />
              <span>Add Blog</span>
            </Link>
          </div>
        </div>

        {/* Table View */}
        {loading ? (
          <div className="bg-white border border-gray-200 rounded-[6px] p-16 text-center shadow-xs lg:flex-1 lg:min-h-0 flex flex-col items-center justify-center">
            <div className="w-7 h-7 border-2 border-[#E53935] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Loading Flow Guard Blog Articles...
            </p>
          </div>
        ) : (
          <BlogTable
            blogs={paginatedBlogs}
            startIndex={startIndex}
            pagination={{
              totalItems,
              currentPage: safePage,
              totalPages,
              pageSize,
              showingFrom,
              showingTo,
              onPageChange: setCurrentPage,
              onPageSizeChange: (newSize) => {
                setPageSize(newSize);
                setCurrentPage(1);
              },
            }}
            onView={(blog) => setBlogToView(blog)}
            onDelete={(blog) => setBlogToDelete(blog)}
          />
        )}
      </main>

      {/* Quick View Modal */}
      {blogToView && (
        <BlogViewModal
          blog={blogToView}
          onClose={() => setBlogToView(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {blogToDelete && (
        <DeleteConfirmModal
          isOpen={Boolean(blogToDelete)}
          isDeleting={isDeleting}
          title="Delete Blog Article"
          description={`Are you sure you want to permanently delete "${blogToDelete.title}"? This action cannot be undone.`}
          confirmLabel="Delete Article"
          onClose={() => {
            if (!isDeleting) setBlogToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}
