import IndustriesHeroBanner from "./IndustriesHeroBanner";
import IndustriesEmpowerSection from "./IndustriesEmpowerSection";
import IndustriesWhyChooseUs from "./IndustriesWhyChooseUs";
import IndustriesStandardsMatrix from "./IndustriesStandardsMatrix";
import IndustriesCtaBanner from "./IndustriesCtaBanner";

export const metadata = {
  title: "Industries We Empower | Flow Guard EngTech Industries",
  description:
    "Engineered mechanical sealing solutions for Oil & Gas, Petrochemical, Power Generation, Water Treatment, Pharmaceutical, and Food & Beverage processing plants worldwide.",
};

export default function IndustriesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner with signature Flow Guard styling */}
      <IndustriesHeroBanner />

      {/* 2. Core Section: Industries We Empower (6 Sectors) */}
      <IndustriesEmpowerSection />

      {/* 3. Why Choose Us: 4 Engineering Pillars from reference brochure */}
      <IndustriesWhyChooseUs />

      {/* 4. Global Standards & Compliance Matrix */}
      <IndustriesStandardsMatrix />

      {/* 5. Closing Technical Consultation CTA */}
      <IndustriesCtaBanner />
    </main>
  );
}

