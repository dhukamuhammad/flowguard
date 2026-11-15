"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Edit2, ExternalLink, Calendar } from "lucide-react";
import { formatShortDate } from "@/lib/utils";

/**
 * Clean read-only Quick View modal showing full blog cover image and formatted description.
 */
export default function BlogViewModal({ blog, onClose }) {
  useEffect(() => {
    if (!blog) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [blog, onClose]);

  if (!blog) return null;

  const coverSrc = blog.cover_image || "/client/home/hero-bg.jpg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-2xs font-roboto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white border border-gray-300 rounded-[6px] shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1.5">
                <Calendar size={13} className="text-[#E53935]" />
                <span>Published on {formatShortDate(blog.created_at)}</span>
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate">
              {blog.title}
            </h2>
            <span className="text-xs text-gray-400 font-mono block truncate">
              /blog/{blog.slug}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {blog.slug && (
              <a
                href={`/blog/${blog.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-[6px] hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={13} className="text-[#E53935]" />
                <span>Live View</span>
              </a>
            )}
            <Link
              href={`/admin/blog/addblog?id=${blog.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-[6px] hover:bg-blue-100 transition-colors"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-gray-400 hover:text-black border border-gray-200 rounded-[4px] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Cover Banner */}
          <div className="relative aspect-[16/9] w-full rounded-[6px] overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              src={coverSrc}
              alt={blog.title}
              fill
              sizes="700px"
              unoptimized={coverSrc.startsWith("http")}
              className="object-cover"
            />
          </div>

          {/* Formatted Description */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>
      </div>
    </div>
  );
}

