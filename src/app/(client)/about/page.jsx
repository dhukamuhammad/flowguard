import AboutHeroBanner from "./AboutHeroBanner";
import AboutOverviewSection from "./AboutOverviewSection";
import AboutVisionMission from "./AboutVisionMission";
import AboutCoreValues from "./AboutCoreValues";
import AboutManufacturingCapabilities from "./AboutManufacturingCapabilities";
import AboutCtaBanner from "./AboutCtaBanner";

export const metadata = {
  title: "About Us | Flow Guard EngTech Industries",
  description:
    "We are pioneers in mechanical sealing solutions, driven by innovation, quality, and reliability. Zero leakage, maximum efficiency, and long-lasting performance for industrial process equipment.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Sleek Hero Banner with signature Flow Guard gradient */}
      <AboutHeroBanner />

      {/* 2. Overview Section: Who We Are, OUR EDGE, and Industrial Plant photo */}
      <AboutOverviewSection />

      {/* 3. Guiding Principles: Our Vision & Strategic Mission */}
      <AboutVisionMission />

      {/* 4. Foundational Pillars: 4 Core Values from reference brochure */}
      <AboutCoreValues />

      {/* 5. Manufacturing Excellence: CNC machining, Testing lab, and R&D */}
      <AboutManufacturingCapabilities />

      {/* 6. Closing Call to Action: Technical Quote & Catalog access */}
      <AboutCtaBanner />
    </main>
  );
}
