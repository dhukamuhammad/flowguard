import { CheckCircle2, Clock, FileText, Send } from "lucide-react";

export default function ContactResponseTimeline() {
  const steps = [
    {
      number: "01",
      icon: Send,
      title: "Inquiry Submission & Acknowledgment",
      subtitle: "Instant Reference Number",
      description:
        "As soon as you submit your requirements, an inquiry reference is registered and routed to our dedicated application engineer.",
    },
    {
      number: "02",
      icon: Clock,
      title: "Technical Review & Sizing",
      subtitle: "Within 12 Hours",
      description:
        "Our seal design team verifies pump shaft size, operating pressure, temperature limits, and chemical media compatibility.",
    },
    {
      number: "03",
      icon: FileText,
      title: "Dimensional Drawing & Formal Quote",
      subtitle: "Within 24 Hours",
      description:
        "You receive a comprehensive technical proposal including dimensional cross-section drawing, seal face metallurgy, and commercial pricing.",
    },
  ];

  return (
    <section className="py-14 sm:py-16 bg-[#F8FAFC] border-y border-gray-200/80 font-roboto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-[11px] font-bold text-[#E53935] uppercase tracking-wider block mb-1">
            Our Response Commitment
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            What Happens After You Submit an Inquiry?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
            A transparent, prompt engineering evaluation designed to minimize your plant downtime.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 sm:p-7 rounded-[8px] border border-gray-200 shadow-xs hover:shadow-md transition-shadow relative flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Number and Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold font-mono text-gray-300 group-hover:text-[#E53935] transition-colors">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-red-50 text-[#E53935] flex items-center justify-center">
                      <Icon size={18} />
                    </div>
                  </div>

                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#E53935] bg-red-50 px-2.5 py-0.5 rounded-full mb-2">
                    {step.subtitle}
                  </span>

                  <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <CheckCircle2 size={13} />
                  <span>Guaranteed Flow Guard SLA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

