import { Mail, Phone, Briefcase, Wrench, Microscope, Building } from "lucide-react";

export default function ContactDepartmentDirectory() {
  const departments = [
    {
      icon: Briefcase,
      name: "Commercial & Domestic Sales",
      tag: "RFQs & Order Status",
      description:
        "New seal pricing, quotation revisions, standard cartridge availability, and delivery dispatch schedules.",
      email: "sales@flowguard.com",
      phone: "+91 12345 67890",
    },
    {
      icon: Wrench,
      name: "Application Engineering & Design",
      tag: "Technical Sizing & CAD",
      description:
        "Custom mechanical seal design, pump cross-section review, API 682 piping plan sizing, and metallurgy selection.",
      email: "engineering@flowguard.com",
      phone: "+91 98250 12345",
    },
    {
      icon: Microscope,
      name: "Seal Failure Analysis & Testing Lab",
      tag: "Forensic Diagnostics",
      description:
        "Complimentary wear pattern analysis, face flat testing, and failure diagnosis for recurring pump leaks.",
      email: "support@flowguard.com",
      phone: "+91 12345 67890",
    },
    {
      icon: Building,
      name: "Works Admin & Vendor Registration",
      tag: "Audits & Corporate",
      description:
        "Plant inspection audits, vendor enlistment forms, corporate documentation, and official administrative matters.",
      email: "info@flowguard.com",
      phone: "+91 98250 12345",
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-white font-roboto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block mb-1">
            Department Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            Connect Directly with the Right Team
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            Get your inquiry answered directly by specialists in sales, application engineering, testing, or administration.
          </p>
        </div>

        {/* 4 Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {departments.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div
                key={idx}
                className="bg-[#FAFAFA] hover:bg-white p-6 rounded-[8px] border border-gray-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#E53935] flex items-center justify-center mb-4 group-hover:scale-105 group-hover:border-[#E53935] transition-all">
                    <Icon size={18} />
                  </div>

                  <span className="text-[10px] font-bold text-[#E53935] uppercase tracking-wider block mb-1">
                    {dept.tag}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900 mb-2 leading-snug">
                    {dept.name}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {dept.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-200/80 space-y-1.5 text-xs">
                  <a
                    href={`mailto:${dept.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#E53935] transition-colors truncate"
                  >
                    <Mail size={13} className="text-[#E53935] flex-shrink-0" />
                    <span className="font-semibold truncate">{dept.email}</span>
                  </a>
                  <a
                    href={`tel:${dept.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-[#E53935] transition-colors"
                  >
                    <Phone size={13} className="text-[#E53935] flex-shrink-0" />
                    <span className="font-semibold">{dept.phone}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

