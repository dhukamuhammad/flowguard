"use client";

import { useEffect } from "react";
import { AlertTriangle, Loader2, LogOut, X } from "lucide-react";

/**
 * Reusable confirmation modal for destructive delete and sign-out actions across Admin pages.
 */
export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  headerLabel = "Confirm Action",
  itemName = "",
  description = "",
  confirmLabel = "Delete",
  loadingLabel = "Deleting...",
  cancelLabel = "Cancel",
  variant = "danger",
  isDeleting = false,
}) {
  const IconComponent = variant === "logout" ? LogOut : AlertTriangle;
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs font-roboto"
      onClick={() => !isDeleting && onClose?.()}
    >
      <div
        className="relative w-full max-w-sm bg-white border border-gray-300 rounded-[6px] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-[4px] bg-red-50 border border-red-200 text-[#E53935] flex items-center justify-center">
              <IconComponent size={14} />
            </span>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#E53935]">
                {headerLabel}
              </div>
              <h3 className="text-sm font-bold text-gray-900 leading-tight">
                {title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            disabled={isDeleting}
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 text-gray-400 hover:text-black border border-gray-200 rounded-[4px] hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed">
            {description ? (
              description
            ) : (
              <>
                Are you sure you want to delete{" "}
                {itemName ? (
                  <span className="font-bold text-gray-900">
                    &ldquo;{itemName}&rdquo;
                  </span>
                ) : (
                  "this item"
                )}
                ? This action cannot be undone.
              </>
            )}
          </p>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-200">
            <button
              type="button"
              disabled={isDeleting}
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-[6px] text-xs font-semibold hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onConfirm}
              className="px-4 py-2 bg-[#E53935] hover:bg-[#d32f2f] text-white rounded-[6px] text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-60"
            >
              {isDeleting && <Loader2 size={13} className="animate-spin" />}
              <span>{isDeleting ? loadingLabel : confirmLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

