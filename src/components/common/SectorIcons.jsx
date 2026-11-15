"use client";

/**
 * Custom line-art industrial SVG icons matching Flow Guard catalog datasheets.
 */

export function MechanicalMarineIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Dashed outer rotation ring */}
      <circle cx="12" cy="12" r="9.5" strokeDasharray="3 2.5" />
      {/* Center hub */}
      <circle cx="12" cy="12" r="1.8" />
      {/* 3 impeller / propeller blades */}
      <path d="M12 10.2C11.2 7.5 11.4 5 12.6 4.8C13.8 4.6 13.7 7.4 12.6 10.2" />
      <path d="M13.5 13C16.1 13.8 18.2 15.2 17.5 16.4C16.8 17.6 14.4 16 12.6 13.6" />
      <path d="M10.5 13C7.9 13.8 5.8 15.2 6.5 16.4C7.2 17.6 9.6 16 11.4 13.6" />
    </svg>
  );
}

export function EcologyIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  );
}

export function FluidsWaterIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6.5c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
      <path d="M3 10.2c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
      <path d="M3 13.9c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
      <path d="M3 17.6c1.5-1.2 3-1.2 4.5 0s3 1.2 4.5 0 3-1.2 4.5 0 3 1.2 4.5 0" />
    </svg>
  );
}

export function FoodBeverageIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Spoon */}
      <ellipse cx="6" cy="6.8" rx="1.8" ry="2.8" />
      <path d="M6 9.6V20" />
      {/* Fork */}
      <path d="M10.5 4v4.5a1.5 1.5 0 0 0 3 0V4" />
      <path d="M12 4v16" />
      {/* Knife */}
      <path d="M17.5 20V4c1.6 1.2 2.2 4.5 2.2 8.5h-2.2" />
    </svg>
  );
}

export function PowerPlantIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Ground line */}
      <path d="M3 20h18" />
      {/* Left cooling tower */}
      <path d="M4.5 20c1.2-3.5 1.4-6.5 1.1-9h4.6c-.3 2.5-.1 5.5 1.1 9" />
      {/* Right cooling tower */}
      <path d="M12.7 20c1.2-3.5 1.4-6.5 1.1-9h4.6c-.3 2.5-.1 5.5 1.1 9" />
      {/* Steam puffs */}
      <path d="M6.5 9c-.8-.6-.8-2 .4-2.5.4-1 2-1.2 2.7-.3.9-.2 1.8.6 1.5 1.5" />
      <path d="M14.7 9c-.8-.6-.8-2 .4-2.5.4-1 2-1.2 2.7-.3.9-.2 1.8.6 1.5 1.5" />
    </svg>
  );
}

export function ChemicalIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Erlenmeyer conical flask */}
      <path d="M7.5 4h4" />
      <path d="M8.5 4v4.2L4.4 17.5A1.5 1.5 0 0 0 5.8 19.5h7.4a1.5 1.5 0 0 0 1.4-2L10.5 8.2V4" />
      <path d="M6.2 14.5h6.6" />
      {/* Test tube */}
      <path d="M16.5 5h3" />
      <path d="M17 5v12.5a1.5 1.5 0 0 0 3 0V5" />
      <path d="M17 12h3" />
    </svg>
  );
}

export function PulpPaperIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Canopy */}
      <path d="M8.5 15.5a3.5 3.5 0 0 1-2.3-6.2 3.8 3.8 0 0 1 3-5 3.8 3.8 0 0 1 5.6 0 3.8 3.8 0 0 1 3 5 3.5 3.5 0 0 1-2.3 6.2" />
      {/* Trunk & branches */}
      <path d="M12 20v-9" />
      <path d="M12 14l2.5-2" />
      <path d="M12 13l-2.5-2" />
      {/* Ground */}
      <path d="M5 20h14" />
    </svg>
  );
}

export function PharmaIcon({ className = "w-5 h-5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <path d="m8.5 8.5 7 7" />
    </svg>
  );
}

export const SECTOR_LIST = [
  { id: "Mechanical / Marine", label: "Mechanical / Marine", Icon: MechanicalMarineIcon },
  { id: "Ecology", label: "Ecology", Icon: EcologyIcon },
  { id: "Fluids / Water", label: "Fluids / Water", Icon: FluidsWaterIcon },
  { id: "Food & Beverage", label: "Food & Beverage", Icon: FoodBeverageIcon },
  { id: "Power Plant", label: "Power Plant", Icon: PowerPlantIcon },
  { id: "Chemical", label: "Chemical", Icon: ChemicalIcon },
  { id: "Pulp & Paper", label: "Pulp & Paper", Icon: PulpPaperIcon },
  { id: "Pharma", label: "Pharma", Icon: PharmaIcon },
];

/**
 * Resolves a stored sector label to its SVG Icon component (including legacy aliases).
 */
export function getSectorIcon(sectorName) {
  const key = (sectorName || "").toLowerCase();
  if (key.includes("mechanical") || key.includes("marine")) return MechanicalMarineIcon;
  if (key.includes("ecology") || key.includes("cycle")) return EcologyIcon;
  if (key.includes("fluid") || key.includes("water")) return FluidsWaterIcon;
  if (key.includes("food") || key.includes("beverage")) return FoodBeverageIcon;
  if (key.includes("power") || key.includes("plant")) return PowerPlantIcon;
  if (key.includes("chemical")) return ChemicalIcon;
  if (key.includes("pulp") || key.includes("paper")) return PulpPaperIcon;
  if (key.includes("pharma")) return PharmaIcon;
  return MechanicalMarineIcon;
}

