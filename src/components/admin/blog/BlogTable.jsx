"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Edit2, Trash2, BookOpen, ExternalLink } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { formatShortDate } from "@/lib/utils";

export default function BlogTable({
  blogs = [],
  startIndex = 0,
  pagination = null,
  onView,
  onDelete,
}) {
  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-[6px] p-12 text-center shadow-xs lg:flex-1 lg:min-h-0 flex flex-col items-center justify-center font-roboto">
        <div className="w-14 h-14 mx-auto rounded-[6px] bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
          <BookOpen size={24} />
        </div>
        <h3 className="text-sm font-bold text-gray-800">No blog posts found</h3>
        <p className="text-gray-500 text-xs mt-1 max-w-md mx-auto">
          No articles match your search query. Click &quot;Add Blog&quot; to write a new engineering post.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-[6px] overflow-hidden shadow-xs font-roboto flex flex-col lg:flex-1 lg:min-h-0">
      <div className="overflow-auto lg:flex-1 lg:min-h-0">
        <table className="w-full text-left text-xs sm:text-sm text-gray-600">
          <thead className="sticky top-0 z-10 bg-gray-50 text-gray-700 text-[11px] uppercase tracking-wider font-semibold shadow-[0_1px_0_0_#E5E7EB]">
            <tr>
              <th className="px-5 py-3.5 w-14">#</th>
              <th className="px-5 py-3.5">Blog Article</th>
              <th className="px-5 py-3.5">Created Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {blogs.map((item, idx) => {
              const coverSrc = item.cover_image || "/client/home/hero-bg.jpg";

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-gray-400 text-xs">
                    {String(startIndex + idx + 1).padStart(2, "0")}
                  </td>

                  {/* Thumbnail + Title + Slug */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-10 rounded-[4px] bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                        <Image
                          src={coverSrc}
                          alt={item.title}
                          fill
                          sizes="60px"
                          className="object-cover"
                          unoptimized={coverSrc.startsWith("http")}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm block truncate max-w-[280px] sm:max-w-md">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono block truncate max-w-[280px] sm:max-w-md">
                          /blog/{item.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-3.5 text-xs text-gray-500 font-mono whitespace-nowrap">
                    {formatShortDate(item.created_at)}
                  </td>

                  {/* Actions: View + Live Link + Edit + Delete */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(item)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-[4px] transition-colors cursor-pointer"
                        title="Quick View Article"
                      >
                        <Eye size={15} />
                      </button>

                      {item.slug && (
                        <a
                          href={`/blog/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-600 hover:text-[#E53935] hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors"
                          title="Open on Live Website (New Tab)"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}

                      <Link
                        href={`/admin/blog/addblog?id=${item.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-[4px] transition-colors"
                        title="Edit Article"
                      >
                        <Edit2 size={14} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors cursor-pointer"
                        title="Delete Article"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && <AdminPagination {...pagination} />}
    </div>
  );
}
