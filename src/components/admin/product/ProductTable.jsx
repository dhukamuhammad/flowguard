"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Edit2, Trash2, Activity, ExternalLink } from "lucide-react";
import StatusToggle from "@/components/admin/StatusToggle";
import AdminPagination from "@/components/admin/AdminPagination";
import { formatShortDate } from "@/lib/utils";

export default function ProductTable({
  products,
  startIndex = 0,
  pagination = null,
  togglingId = null,
  onToggleStatus,
  onView,
  onDelete,
}) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-[6px] p-12 text-center shadow-xs lg:flex-1 lg:min-h-0 flex flex-col items-center justify-center">
        <div className="w-14 h-14 mx-auto rounded-[6px] bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-4">
          <Activity size={24} />
        </div>
        <h3 className="text-sm font-bold text-gray-800">
          No mechanical seals found
        </h3>
        <p className="text-gray-500 text-xs mt-1 max-w-md mx-auto">
          No products match your search or filter criteria. Click &quot;Add
          Product&quot; to register a new mechanical seal model.
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
              <th className="px-5 py-3.5">Product</th>
              <th className="px-5 py-3.5">Category</th>
              <th className="px-5 py-3.5">Status (ON / OFF)</th>
              <th className="px-5 py-3.5">Created Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item, idx) => {
              const primaryImage =
                Array.isArray(item.images) && item.images.length > 0
                  ? item.images[0]
                  : "/client/product/Seals.png";

              return (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3.5 font-mono text-gray-400 text-xs">
                    {String(startIndex + idx + 1).padStart(2, "0")}
                  </td>

                  {/* Thumbnail + Title + Slug */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-[6px] bg-gray-50 border border-gray-200 p-1 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        <Image
                          src={primaryImage}
                          alt={item.title || "Seal"}
                          fill
                          sizes="44px"
                          className="object-contain p-0.5"
                          unoptimized={primaryImage.startsWith("http")}
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm block truncate max-w-[220px]">
                          {item.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-mono block truncate max-w-[220px]">
                          /{item.slug}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category Title */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-gray-100 text-gray-800 border border-gray-200">
                      {item.categories?.title || "Uncategorized"}
                    </span>
                  </td>

                  {/* Interactive ON / OFF Toggle */}
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <StatusToggle
                      status={item.status}
                      disabled={togglingId === item.id}
                      onToggle={() => onToggleStatus?.(item)}
                    />
                  </td>

                  {/* Created Date */}
                  <td className="px-5 py-3.5 text-xs text-gray-500 font-mono whitespace-nowrap">
                    {formatShortDate(item.created_at)}
                  </td>

                  {/* Actions: Quick View + Live Page + Edit + Delete */}
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(item)}
                        className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 rounded-[4px] transition-colors cursor-pointer"
                        title="Quick View Specifications"
                      >
                        <Eye size={15} />
                      </button>
                      {Number(item.status) === 1 && item.slug && (
                        <a
                          href={`/products/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-600 hover:text-[#E53935] hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors"
                          title="Open Product on Live Website"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <Link
                        href={`/admin/product/addproduct?id=${item.id}`}
                        prefetch={true}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-[4px] transition-colors"
                        title="Edit Seal Model"
                      >
                        <Edit2 size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onDelete?.(item)}
                        className="p-1.5 text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-[4px] transition-colors cursor-pointer"
                        title="Delete Seal Model"
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
