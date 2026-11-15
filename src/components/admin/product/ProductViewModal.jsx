"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Edit2, ExternalLink } from "lucide-react";
import { getSectorIcon } from "@/components/common/SectorIcons";

/**
 * Clean read-only Quick View modal showing all product images, sector icons,
 * operating limits, characteristics, description, and custom extra blocks.
 */
export default function ProductViewModal({ product, onClose }) {
  const [selectedThumb, setSelectedThumb] = useState({
    productId: null,
    index: 0,
  });

  const activeImgIdx =
    selectedThumb.productId === product?.id ? selectedThumb.index : 0;

  useEffect(() => {
    if (!product) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [product, onClose]);

  if (!product) return null;

  const images =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : ["/client/product/Seals.png"];
  const activeImage = images[activeImgIdx] || images[0];
  const sectors = Array.isArray(product.sectors) ? product.sectors : [];
  const limits = Array.isArray(product.operating_limits)
    ? product.operating_limits
    : [];
  const characteristics = Array.isArray(product.characteristics)
    ? product.characteristics
    : [];
  const extraSections = Array.isArray(product.extra_sections)
    ? product.extra_sections
    : [];
  const isOn = Number(product.status) === 1;

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
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] bg-gray-100 text-gray-700 border border-gray-200">
                {product.categories?.title || "Uncategorized"}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[4px] border ${
                  isOn
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-gray-100 text-gray-500 border-gray-200"
                }`}
              >
                {isOn ? "ON (Active)" : "OFF (Inactive)"}
              </span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 truncate">
              {product.title}
            </h2>
            <span className="text-xs text-gray-400 font-mono block truncate">
              /{product.slug}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isOn && product.slug && (
              <a
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-[6px] hover:bg-gray-100 hover:text-black transition-colors"
              >
                <ExternalLink size={13} className="text-[#E53935]" />
                <span>Live Page</span>
              </a>
            )}
            <Link
              href={`/admin/product/addproduct?id=${product.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-[6px] hover:bg-blue-100 transition-colors"
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close quick view"
              className="p-1.5 text-gray-400 hover:text-black border border-gray-200 rounded-[4px] hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Images Gallery */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative w-full h-56 rounded-[6px] border border-gray-200 bg-gray-50 p-4 flex items-center justify-center">
                <Image
                  src={activeImage}
                  alt={product.title}
                  fill
                  sizes="300px"
                  className="object-contain p-3"
                  unoptimized={activeImage.startsWith("http")}
                />
              </div>

              {images.length > 1 && (
                <div className="flex flex-wrap gap-2">
                  {images.map((url, idx) => (
                    <button
                      type="button"
                      key={`${url}-${idx}`}
                      onClick={() =>
                        setSelectedThumb({ productId: product.id, index: idx })
                      }
                      className={`relative w-12 h-12 rounded-[6px] border bg-white p-1 cursor-pointer transition-all ${
                        activeImgIdx === idx
                          ? "border-[#E53935] ring-2 ring-[#E53935]/20"
                          : "border-gray-200 opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={url}
                        alt={`Thumb ${idx + 1}`}
                        fill
                        sizes="48px"
                        className="object-contain p-1"
                        unoptimized={url.startsWith("http")}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Sectors, Limits & Characteristics */}
            <div className="md:col-span-7 space-y-5">
              {sectors.length > 0 && (
                <div className="bg-gray-50 p-3.5 rounded-[6px] border border-gray-200">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Sectors ({sectors.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {sectors.map((sec, i) => {
                      const IconComp = getSectorIcon(sec);
                      return (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-gray-200 rounded-[4px] text-xs font-medium text-gray-700"
                        >
                          <IconComp className="w-3.5 h-3.5 text-[#E53935]" />
                          <span>{sec}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {limits.length > 0 && (
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2">
                    Operating Limits / Specifications
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {limits.map((lim, i) => (
                      <div
                        key={i}
                        className="bg-gray-50 border border-gray-200 rounded-[6px] px-3 py-2"
                      >
                        <span className="block text-[11px] text-gray-500 font-medium">
                          {lim.label}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-[#E53935] font-mono">
                          {lim.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {characteristics.length > 0 && (
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Characteristics
                  </span>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {characteristics.map((ch, i) => (
                      <li key={i}>• {ch}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.description && (
                <div>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    Description
                  </span>
                  <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Extra Custom Sections */}
          {extraSections.length > 0 && (
            <div className="pt-4 border-t border-gray-200 space-y-4">
              {extraSections.map((sec, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-[6px] p-4"
                >
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2.5">
                    {sec.heading}
                  </h4>

                  {sec.layout === "key_value" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sec.items.map((kv, j) => (
                        <div
                          key={j}
                          className="bg-white border border-gray-200 rounded-[4px] px-3 py-2 text-xs"
                        >
                          <span className="font-bold text-gray-800">
                            {kv.label}:{" "}
                          </span>
                          <span className="text-gray-600">{kv.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : sec.layout === "numbered" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {sec.items.map((item, j) => (
                        <div
                          key={j}
                          className="bg-white border border-gray-200 rounded-[4px] px-3 py-2 flex items-center gap-2.5 text-xs text-gray-700"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#E53935] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                            {j + 1}
                          </span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="text-xs text-gray-600 space-y-1">
                      {sec.items.map((item, j) => (
                        <li key={j}>• {item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

