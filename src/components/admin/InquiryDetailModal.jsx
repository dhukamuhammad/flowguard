"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CustomSelect from "@/components/admin/CustomSelect";
import { formatShortDate } from "@/lib/utils";
import { INQUIRY_STATUS_OPTIONS, formatInquiryRef } from "@/lib/inquiryUtils";

/**
 * Shared modal displaying full client quote inquiry details and live status selector.
 */
export default function InquiryDetailModal({
  inquiry,
  onClose,
  onStatusChange,
  isUpdating = false,
}) {
  useEffect(() => {
    if (!inquiry) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inquiry, onClose]);

  if (!inquiry) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs font-roboto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white border border-gray-300 rounded-[6px] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-[#E53935]">
              Inquiry Reference: {formatInquiryRef(inquiry.id)} ·{" "}
              {formatShortDate(inquiry.created_at)}
            </div>
            <h3 className="text-base font-bold text-gray-900">
              Quote Request Details
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-gray-400 hover:text-black border border-gray-200 rounded-[4px] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm text-gray-700">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase">
                Client Name
              </span>
              <span className="font-semibold text-gray-900">{inquiry.name}</span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase">
                Company
              </span>
              <span className="font-semibold text-gray-900">
                {inquiry.company}
              </span>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase">
                Email Address
              </span>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-blue-600 hover:underline break-all"
              >
                {inquiry.email}
              </a>
            </div>
            <div>
              <span className="block text-[11px] font-bold text-gray-400 uppercase">
                Phone Number
              </span>
              <a
                href={`tel:${inquiry.phone}`}
                className="font-mono text-[#E53935] font-semibold"
              >
                {inquiry.phone}
              </a>
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
              Product Required
            </span>
            <span className="inline-block bg-gray-100 font-semibold px-2.5 py-1 rounded-[4px] text-xs text-gray-800 border border-gray-200">
              {inquiry.product}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-gray-400 uppercase mb-1">
              Technical Requirements & Message
            </span>
            <div className="bg-gray-50 p-3.5 rounded-[6px] border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
              {inquiry.message}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Status:</span>
              <CustomSelect
                variant="compact"
                menuMinWidth={150}
                disabled={isUpdating}
                value={inquiry.status}
                onChange={(val) => onStatusChange?.(inquiry.id, val)}
                ariaLabel="Inquiry status"
                options={INQUIRY_STATUS_OPTIONS}
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-[6px] hover:bg-black transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

