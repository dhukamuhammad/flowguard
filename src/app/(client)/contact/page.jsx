import { Suspense } from "react";
import ContactHeroBanner from "./ContactHeroBanner";
import ContactFormSection from "./ContactFormSection";
import ContactResponseTimeline from "./ContactResponseTimeline";
import ContactDepartmentDirectory from "./ContactDepartmentDirectory";
import ContactVisitingGuide from "./ContactVisitingGuide";

export const metadata = {
  title: "Contact Us & Request a Quote | Flow Guard EngTech Industries",
  description:
    "Direct contact with Flow Guard application engineers for mechanical seal selection, fast RFQs, custom cartridge drawings, and Gujarat plant visits.",
};

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* 1. Sleek Hero Banner */}
      <ContactHeroBanner />

      {/* 2. Main Signature Contact & Quote Form Section with Suspense for URL params */}
      <Suspense fallback={<div className="min-h-[400px] bg-white" />}>
        <ContactFormSection />
      </Suspense>

      {/* 3. Inquiry Response Timeline */}
      <ContactResponseTimeline />

      {/* 4. Department Directory (Commercial, Engineering, Lab, Admin) */}
      <ContactDepartmentDirectory />

      {/* 5. Visiting & Factory Audit Guide (Airport, Rail, Working Hours) */}
      <ContactVisitingGuide />
    </main>
  );
}
