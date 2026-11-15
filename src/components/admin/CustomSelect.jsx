"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";

/**
 * Custom styled dropdown menu rendered via a body portal so it never clips
 * inside overflow-auto tables, pagination bars, or modals.
 */
export default function CustomSelect({
  options = [],
  value = "",
  onChange,
  placeholder = "Select option",
  prefixIcon: PrefixIcon = null,
  disabled = false,
  ariaLabel,
  className = "",
  buttonClassName = "",
  menuMinWidth = 176,
  align = "left",
  variant = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find(
    (opt) => String(opt.value) === String(value)
  );

  const handleToggle = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect && typeof window !== "undefined") {
      const estimatedHeight = Math.min(options.length * 36 + 14, 240);
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < estimatedHeight + 12 && rect.top > spaceBelow;
      const minWidth = Math.max(rect.width, menuMinWidth);
      const desiredLeft = align === "right" ? rect.right - minWidth : rect.left;
      const left = Math.max(
        8,
        Math.min(desiredLeft, window.innerWidth - minWidth - 8)
      );

      setMenuStyle(
        openUp
          ? {
              position: "fixed",
              bottom: window.innerHeight - rect.top + 6,
              left,
              minWidth,
            }
          : {
              position: "fixed",
              top: rect.bottom + 6,
              left,
              minWidth,
            }
      );
    }

    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !menuRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    const handleScroll = (e) => {
      if (
        e.target &&
        (e.target === menuRef.current || menuRef.current?.contains(e.target))
      ) {
        return;
      }
      setIsOpen(false);
    };

    const handleResize = () => setIsOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  const variantClasses =
    variant === "badge"
      ? "px-2 py-0.5 text-[10px] font-bold rounded-[4px] border gap-1"
      : variant === "compact"
      ? "px-2 py-1 text-xs font-semibold rounded-[4px] border bg-white border-gray-300 text-gray-800 hover:border-gray-400 gap-1.5"
      : `px-3 py-2 text-xs font-semibold rounded-[6px] border gap-2 ${
          isOpen
            ? "bg-white border-[#E53935] text-gray-900 ring-2 ring-[#E53935]/10"
            : "bg-gray-50 border-gray-300 text-gray-800 hover:bg-white hover:border-gray-400"
        }`;

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={`w-full inline-flex items-center justify-between transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap focus:outline-none ${variantClasses} ${buttonClassName}`}
      >
        <span className="inline-flex items-center gap-1.5 min-w-0">
          {PrefixIcon && (
            <PrefixIcon
              size={13}
              className={`flex-shrink-0 ${
                isOpen ? "text-[#E53935]" : "text-gray-400"
              }`}
            />
          )}
          {selectedOption?.dotClass && (
            <span
              className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${selectedOption.dotClass}`}
            />
          )}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>

        <ChevronDown
          size={variant === "badge" ? 11 : 14}
          className={`flex-shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180" : ""
          } ${variant === "badge" ? "opacity-75" : isOpen ? "text-[#E53935]" : "text-gray-400"}`}
        />
      </button>

      {isOpen &&
        menuStyle &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={menuStyle}
            className="z-[90] bg-white border border-gray-300 rounded-[6px] shadow-xl overflow-hidden font-roboto py-1 max-h-60 overflow-y-auto"
          >
            {options.map((opt) => {
              const isSelected = String(opt.value) === String(value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  disabled={opt.disabled}
                  onClick={() => {
                    onChange?.(String(opt.value));
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 text-left text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                    isSelected
                      ? "bg-red-50 text-[#E53935] font-semibold"
                      : "text-gray-700 hover:bg-gray-50 font-medium"
                  }`}
                >
                  <span className="inline-flex items-center gap-2 min-w-0">
                    {opt.dotClass && (
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${opt.dotClass}`}
                      />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 flex-shrink-0">
                    {opt.badge && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-gray-100 text-gray-500 border border-gray-200">
                        {opt.badge}
                      </span>
                    )}
                    {isSelected && (
                      <Check size={13} className="text-[#E53935]" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

