"use client";

/**
 * Reusable ON (1) / OFF (0) sliding toggle switch for Admin tables.
 */
export default function StatusToggle({
  status,
  disabled = false,
  onToggle,
}) {
  const isOn = Number(status) === 1;

  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={onToggle}
        title={isOn ? "Turn OFF (Set status to 0)" : "Turn ON (Set status to 1)"}
        className={`relative inline-flex h-5.5 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none cursor-pointer disabled:opacity-60 ${
          isOn ? "bg-emerald-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            isOn ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
      <span
        className={`text-[11px] font-bold uppercase tracking-wide font-mono ${
          isOn ? "text-emerald-700" : "text-gray-400"
        }`}
      >
        {isOn ? "ON" : "OFF"}
      </span>
    </div>
  );
}

