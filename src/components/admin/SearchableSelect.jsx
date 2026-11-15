"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";

/**
 * Custom searchable dropdown replacing native <select> for long option lists.
 */
export default function SearchableSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(query.trim().toLowerCase())
  );

  const closeDropdown = () => {
    setIsOpen(false);
    setQuery("");
  };

  useEffect(() => {
    if (!isOpen) return;

    // Focus search box automatically when dropdown opens
    const timer = setTimeout(() => searchInputRef.current?.focus(), 20);

    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (optValue) => {
    onChange?.(String(optValue));
    closeDropdown();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => (isOpen ? closeDropdown() : setIsOpen(true))}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-gray-50 border rounded-[6px] text-left text-xs sm:text-sm transition-colors cursor-pointer disabled:opacity-60 ${
          isOpen
            ? "bg-white border-[#E53935] ring-2 ring-[#E53935]/10"
            : "border-gray-300 hover:bg-white hover:border-gray-400"
        }`}
      >
        <span
          className={`truncate ${
            selectedOption ? "text-gray-900 font-medium" : "text-gray-400"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {selectedOption?.badge && (
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-gray-200 text-gray-600">
              {selectedOption.badge}
            </span>
          )}
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-150 ${
              isOpen ? "rotate-180 text-[#E53935]" : ""
            }`}
          />
        </div>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1.5 z-40 bg-white border border-gray-300 rounded-[6px] shadow-xl overflow-hidden">
          {/* Top Search Input inside Dropdown */}
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-7 py-1.5 bg-white border border-gray-300 rounded-[4px] text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E53935]"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Options List */}
          <ul className="max-h-56 overflow-y-auto py-1 divide-y divide-gray-50">
            {filteredOptions.length === 0 ? (
              <li className="px-3.5 py-4 text-center text-xs text-gray-400">
                {emptyText}
              </li>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      onClick={() => handleSelect(opt.value)}
                      className={`w-full flex items-center justify-between gap-2 px-3.5 py-2 text-left text-xs sm:text-[13px] transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-red-50 text-[#E53935] font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {opt.badge && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-gray-100 text-gray-500 border border-gray-200">
                            {opt.badge}
                          </span>
                        )}
                        {isSelected && <Check size={14} className="text-[#E53935]" />}
                      </div>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

