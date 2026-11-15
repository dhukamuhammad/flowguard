"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { validateInquiryPayload } from "@/lib/inquiryUtils";
import { notify } from "@/components/common/AppToaster";

const EMPTY_FORM = {
  name: "",
  email: "",
  company: "",
  phone: "",
  product: "",
  message: "",
};

export default function ContactFormSection({ initialProduct = "" }) {
  const [form, setForm] = useState({
    ...EMPTY_FORM,
    product: initialProduct || "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const { data: payload, error: validationError } =
      validateInquiryPayload(form);
    if (validationError) {
      setErrorMsg(validationError);
      notify.error(validationError);
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Failed to submit quote inquiry.");
      }

      setForm(EMPTY_FORM);

      setSuccessMsg(
        "Thank you! Your sealing requirement has been received. Our application engineering team will review your parameters and respond within 24 hours."
      );
      notify.success(
        "Inquiry Received!",
        "Saved to Flow Guard database. Our team will contact you within 24 hours."
      );
    } catch (err) {
      const msg = err.message || "Unable to submit inquiry right now.";
      setErrorMsg(msg);
      notify.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName =
    "w-full bg-white/15 border border-white/25 rounded-[6px] px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white placeholder-white/80 focus:outline-none focus:bg-white/20 focus:border-white transition-colors disabled:opacity-60";

  return (
    <section className="py-14 sm:py-18 lg:py-20 bg-white font-roboto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Flow Guard Signature Curved Red Quote Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#E53935] text-white p-7 sm:p-9 lg:p-10 rounded-tl-[44px] sm:rounded-tl-[52px] rounded-br-[44px] sm:rounded-br-[52px] rounded-tr-none rounded-bl-none shadow-2xl">
              <div className="text-center mb-6 sm:mb-7">
                <span className="text-[11px] font-bold tracking-wider uppercase text-white/85 block mb-1">
                  Fast Turnaround RFQ
                </span>
                <h2 className="text-2xl sm:text-[28px] font-medium font-roboto tracking-tight">
                  Request a Quote
                </h2>
                <p className="text-xs text-white/80 mt-1 max-w-sm mx-auto">
                  Submit your operating parameters for a customized technical and commercial proposal.
                </p>
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="mb-4 rounded-[6px] bg-black/25 border border-white/40 px-3.5 py-2.5 flex items-start gap-2.5 text-xs text-white"
                >
                  <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div
                  role="status"
                  className="mb-4 rounded-[6px] bg-white text-[#1A1A1A] px-4 py-3 flex items-start gap-2.5 text-xs font-medium shadow-md"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <span className="font-bold block">Inquiry Submitted Successfully!</span>
                    <span className="text-gray-600 mt-0.5 block">{successMsg}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Row 1: Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      disabled={submitting}
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="e.g. Rajesh Kumar"
                      aria-label="Full Name"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      disabled={submitting}
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="name@company.com"
                      aria-label="Email Address"
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Row 2: Company Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      disabled={submitting}
                      value={form.company}
                      onChange={handleChange("company")}
                      placeholder="Company Name"
                      aria-label="Company Name"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-white/90 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      disabled={submitting}
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="+91 98765 43210"
                      aria-label="Phone Number"
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Row 3: Product Requirement Input (Exact Homepage Style) */}
                <div>
                  <label className="block text-[11px] font-semibold text-white/90 mb-1">
                    Product Requirement *
                  </label>
                  <input
                    type="text"
                    name="product"
                    required
                    disabled={submitting}
                    value={form.product}
                    onChange={handleChange("product")}
                    placeholder="Product Requirement *"
                    aria-label="Product Requirement"
                    className={inputClassName}
                  />
                </div>

                {/* Row 4: Message Textarea */}
                <div>
                  <label className="block text-[11px] font-semibold text-white/90 mb-1">
                    Operating Conditions / Specifications *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={4}
                    disabled={submitting}
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="Please specify: Pump Make/Model, Shaft Size (mm/inch), Operating Pressure (bar), Temperature (°C), and Fluid Media..."
                    aria-label="Message"
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white hover:bg-gray-100 disabled:opacity-80 text-[#1A1A1A] font-bold text-xs sm:text-sm py-3.5 rounded-[6px] shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#E53935]" />
                        <span>Submitting Your Inquiry...</span>
                      </>
                    ) : (
                      <span>Submit Inquiry</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Engineering Sales & Plant Contact Hub */}
          <div className="lg:col-span-6 space-y-7 pt-2 lg:pt-4">
            <div>
              <span className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 mb-3">
                DIRECT ASSISTANCE
              </span>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#1A1A1A] font-roboto tracking-tight uppercase leading-tight">
                <span className="relative inline-block">
                  Engineering Sales &amp; Plant Operations
                  <svg
                    className="absolute -bottom-2.5 left-0 w-44 sm:w-56 h-2.5 sm:h-3"
                    viewBox="0 0 180 12"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 9C45 2 135 2 177 9"
                      stroke="#E53935"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-[#6B7280] font-normal mt-4 leading-relaxed max-w-lg">
                Flow Guard EngTech Industries designs and manufactures precision mechanical seals,
                cartridge assemblies, and tailor-made rotary sealing systems engineered for chemical,
                pharmaceutical, power, and process industries.
              </p>
            </div>

            {/* Signature Flow Guard Contact Blocks */}
            <div className="space-y-5 pt-1">
              {/* Phone Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#E53935] flex items-center justify-center text-[#E53935] flex-shrink-0 mt-0.5">
                  <Phone size={17} />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Talk to Engineering Sales
                  </span>
                  <div className="space-y-0.5 mt-0.5">
                    <a
                      href="tel:+911234567890"
                      className="text-sm font-bold text-[#1A1A1A] font-roboto hover:text-[#E53935] transition-colors block"
                    >
                      +91 12345 67890
                    </a>
                    <a
                      href="tel:+919825012345"
                      className="text-sm font-bold text-[#1A1A1A] font-roboto hover:text-[#E53935] transition-colors block"
                    >
                      +91 98250 12345
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-1">
                    <Clock size={12} className="text-[#E53935]" />
                    <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Email Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#E53935] flex items-center justify-center text-[#E53935] flex-shrink-0 mt-0.5">
                  <Mail size={17} />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Technical Inquiries &amp; Drawings
                  </span>
                  <div className="space-y-0.5 mt-0.5">
                    <a
                      href="mailto:sales@flowguard.com"
                      className="text-sm font-bold text-[#1A1A1A] font-roboto hover:text-[#E53935] transition-colors block"
                    >
                      sales@flowguard.com
                    </a>
                    <a
                      href="mailto:info@flowguard.com"
                      className="text-sm font-bold text-[#1A1A1A] font-roboto hover:text-[#E53935] transition-colors block"
                    >
                      info@flowguard.com
                    </a>
                  </div>
                  <span className="text-[11px] text-gray-400 mt-1 block">
                    Guaranteed technical response within 24 hours
                  </span>
                </div>
              </div>

              {/* Location Block */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-[#E53935] flex items-center justify-center text-[#E53935] flex-shrink-0 mt-0.5">
                  <MapPin size={17} />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#6B7280]">
                    Manufacturing Works &amp; Registered Office
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-roboto leading-snug max-w-md mt-0.5">
                    Plot No. 3, SR No. 98, Behind HDFC Bank, At Rajosana, Ta.
                    Vadagam, Dist. Banaskantha, Gujarat – 385210, India
                  </p>
                </div>
              </div>
            </div>

            {/* Industrial Engineering Standards Strip */}
            <div className="pt-4 border-t border-gray-200">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2.5">
                Quality &amp; Manufacturing Standards
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#E53935] flex-shrink-0" />
                  <span>100% Hydrostatic Tested</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#E53935] flex-shrink-0" />
                  <span>Fast Cartridge Dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#E53935] flex-shrink-0" />
                  <span>Custom Retrofit Sizing</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-[#E53935] flex-shrink-0" />
                  <span>Free Failure Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
