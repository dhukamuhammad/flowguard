"use client";

/**
 * Compact, clickable KPI filter cards grid shared across Admin table pages.
 */
export default function AdminStatFilterGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-shrink-0 font-roboto">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = Boolean(item.active);

        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            aria-pressed={isActive}
            className={`text-left px-3.5 py-2.5 rounded-[6px] border transition-all flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs ${
              isActive
                ? "bg-red-50/45 border-[#E53935] ring-1 ring-[#E53935]/20"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/70"
            }`}
          >
            <div className="min-w-0">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider truncate">
                {item.label}
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span
                  className={`text-lg sm:text-xl font-bold font-mono leading-tight ${
                    item.valueClass || "text-gray-900"
                  }`}
                >
                  {item.value}
                </span>
                {item.subLabel && (
                  <span className="text-[10px] font-medium text-gray-400 truncate">
                    {item.subLabel}
                  </span>
                )}
              </div>
            </div>

            {Icon && (
              <div
                className={`w-8 h-8 rounded-[5px] border flex items-center justify-center flex-shrink-0 ${
                  item.iconBoxClass ||
                  "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <Icon size={15} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
