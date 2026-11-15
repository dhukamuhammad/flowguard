import HeroBanner from "./HeroBanner";
import FeatureStrip from "./FeatureStrip";
import AboutSection from "./AboutSection";
import SealRangeSection from "./SealRangeSection";
import IndustriesSection from "./IndustriesSection";
import ManufacturingFacilitySection from "./ManufacturingFacilitySection";
import TailorMadeSection from "./TailorMadeSection";
import TestimonialsSection from "./TestimonialsSection";
import ContactSection from "./ContactSection";
import { getActiveCatalogData } from "@/lib/catalog";

// Enable ISR so Homepage is pre-rendered and served from edge cache instantly (0s delay)
export const revalidate = 60;

export default async function HomePage() {
  const { categories } = await getActiveCatalogData();
  // Show only active categories that have at least one active product on Homepage
  const sealRangeCategories = categories
    .filter((cat) => (cat.products_count ?? cat.products?.length ?? 0) > 0)
    .slice(0, 6)
    .map((cat) => ({
      id: cat.id,
      title: cat.title,
      thumbnail: cat.thumbnail,
    }));

  return (
    <main>
      <HeroBanner />
      <FeatureStrip />
      <AboutSection />
      <SealRangeSection categories={sealRangeCategories} />
      <IndustriesSection />
      <ManufacturingFacilitySection />
      <TailorMadeSection />
      <TestimonialsSection />
      <ContactSection />
    </main>
  );
}
