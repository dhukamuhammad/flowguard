"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import CustomSelect from "@/components/admin/CustomSelect";

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50];

/**
 * Slices an array safely for the active page, clamping out-of-range page numbers.
 */
export function paginateItems(items, currentPage = 1, pageSize = DEFAULT_PAGE_SIZE) {
  const list = Array.isArray(items) ? items : [];
  const totalItems = list.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(1, Number(currentPage) || 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedItems = list.slice(startIndex, startIndex + pageSize);

  return {
    paginatedItems,
    safePage,
    totalPages,
    totalItems,
    startIndex,
    showingFrom: totalItems === 0 ? 0 : startIndex + 1,
    showingTo: Math.min(startIndex + pageSize, totalItems),
  };
}

/**
 * Builds compact page buttons with ellipsis when page count exceeds 7.
 */
function buildPageNumbers(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) pages.push("ellipsis-left");
  for (let p = left; p <= right; p += 1) {
    pages.push(p);
  }
  if (right < totalPages - 1) pages.push("ellipsis-right");
  pages.push(totalPages);

  return pages;
}

/**
 * Shared pagination footer used across Admin Category, Product, and Inquiries tables.
 */
export default function AdminPagination({
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  pageSize = DEFAULT_PAGE_SIZE,
  showingFrom = 0,
  showingTo = 0,
  onPageChange,
  onPageSizeChange,
}) {
  if (totalItems === 0) return null;

  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  return (
    <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50/70 px-5 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-3 font-roboto">
      {/* Left: Entries Counter & Per-Page Selector */}
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span>
          Showing{" "}
          <span className="font-bold text-gray-900 font-mono">
            {showingFrom}
          </span>
          –
          <span className="font-bold text-gray-900 font-mono">
            {showingTo}
          </span>{" "}
          of{" "}
          <span className="font-bold text-gray-900 font-mono">
            {totalItems}
          </span>
        </span>

        {onPageSizeChange && (
          <div className="inline-flex items-center gap-1.5 border-l border-gray-300 pl-3">
            <span className="text-[11px] font-medium text-gray-500">Rows:</span>
            <CustomSelect
              variant="compact"
              menuMinWidth={78}
              value={String(pageSize)}
              onChange={(val) => onPageSizeChange(Number(val))}
              ariaLabel="Rows per page"
              options={PAGE_SIZE_OPTIONS.map((size) => ({
                value: String(size),
                label: String(size),
              }))}
            />
          </div>
        )}
      </div>

      {/* Right: Prev / Numbered Pages / Next */}
      <nav
        aria-label="Table Pagination"
        className="flex items-center gap-1.5"
      >
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[4px] border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft size={14} />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {pageNumbers.map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              className="px-1.5 text-xs text-gray-400 select-none"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange?.(item)}
              aria-current={item === currentPage ? "page" : undefined}
              className={`min-w-[30px] h-[30px] px-2 text-xs font-mono font-semibold rounded-[4px] border transition-colors cursor-pointer ${
                item === currentPage
                  ? "bg-[#E53935] border-[#E53935] text-white shadow-2xs"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next page"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-[4px] border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-45 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight size={14} />
        </button>
      </nav>
    </div>
  );
}

