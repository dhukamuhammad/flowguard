import ContactHeroBanner from "./ContactHeroBanner";
import ContactFormSection from "./ContactFormSection";
import ContactResponseTimeline from "./ContactResponseTimeline";
import ContactDepartmentDirectory from "./ContactDepartmentDirectory";
import ContactVisitingGuide from "./ContactVisitingGuide";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us & Request a Quote | Flow Guard EngTech Industries",
  description:
    "Direct contact with Flow Guard application engineers for mechanical seal selection, fast RFQs, custom cartridge drawings, and Gujarat plant visits.",
};

export default async function ContactPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialProduct =
    typeof resolvedSearchParams?.product === "string"
      ? resolvedSearchParams.product
      : "";

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Sleek Hero Banner */}
      <ContactHeroBanner />

      {/* 2. Main Signature Contact & Quote Form Section */}
      <ContactFormSection initialProduct={initialProduct} />

      {/* 3. Inquiry Response Timeline (Connected directly to form submission) */}
      <ContactResponseTimeline />

      {/* 4. Department Directory (Commercial, Engineering, Lab, Admin) */}
      <ContactDepartmentDirectory />

      {/* 5. Visiting & Factory Audit Guide (Airport, Rail, Working Hours) */}
      <ContactVisitingGuide />
    </main>
  );
}
