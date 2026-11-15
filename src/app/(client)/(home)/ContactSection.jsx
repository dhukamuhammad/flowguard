"use client";

import Image from "next/image";
import { useState } from "react";
import { Phone, MapPin, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
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

export default function ContactSection({ initialProduct = "" }) {
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

    const { data: payload, error: validationError } = validateInquiryPayload(form);
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
        "Thank you! Your inquiry has been received. Our engineering team will get back to you within 24 hours."
      );
      notify.success(
        "Quote inquiry submitted!",
        "Our engineering team will contact you within 24 hours."
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
    <section className="relative overflow-hidden">
      {/* Background Split: Top Dark Sparks + Circuit Background, Bottom Pure White */}
      <div className="absolute top-0 left-0 right-0 h-[48%] sm:h-[49%] lg:h-[50%] bg-[#121316] z-0 overflow-hidden">
        <Image
          src="/client/home/Get in Touch.jpg"
          alt="Contact Industrial Welding Background"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121316]/70 via-[#121316]/55 to-[#121316]/55" />
        <Image
          src="/client/home/contact-us-bg.png"
          alt="Contact Industrial Circuit Pattern"
          fill
          className="object-cover object-center opacity-50 pointer-events-none"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-[52%] sm:h-[51%] lg:h-[50%] bg-white z-0" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12 sm:py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Signature Curved Red Quote Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#E53935] text-white p-7 sm:p-9 lg:p-10 rounded-tl-[44px] sm:rounded-tl-[52px] rounded-br-[44px] sm:rounded-br-[52px] rounded-tr-none rounded-bl-none shadow-2xl">
              <h3 className="text-2xl sm:text-[26px] font-medium font-roboto text-center mb-6 sm:mb-7 tracking-tight">
                Request a Quote
              </h3>

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
                  className="mb-4 rounded-[6px] bg-white text-[#1A1A1A] px-3.5 py-3 flex items-start gap-2.5 text-xs font-medium shadow-md"
                >
                  <CheckCircle2
                    size={16}
                    className="text-emerald-600 mt-0.5 flex-shrink-0"
                  />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Row 1: Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={submitting}
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Full Name *"
                    aria-label="Full Name"
                    className={inputClassName}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={submitting}
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="Email Address *"
                    aria-label="Email Address"
                    className={inputClassName}
                  />
                </div>

                {/* Row 2: Company Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <input
                    type="text"
                    name="company"
                    required
                    disabled={submitting}
                    value={form.company}
                    onChange={handleChange("company")}
                    placeholder="Company Name *"
                    aria-label="Company Name"
                    className={inputClassName}
                  />
                  <input
                    type="tel"
                    name="phone"
                    required
                    disabled={submitting}
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="Phone Number *"
                    aria-label="Phone Number"
                    className={inputClassName}
                  />
                </div>

                {/* Row 3: Product Requirement */}
                <div>
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
                  <textarea
                    name="message"
                    required
                    rows={4}
                    disabled={submitting}
                    value={form.message}
                    onChange={handleChange("message")}
                    placeholder="Message / Operating Conditions *"
                    aria-label="Message"
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-white hover:bg-gray-100 disabled:opacity-80 text-[#1A1A1A] font-medium sm:font-semibold text-xs sm:text-sm py-3 sm:py-3.5 rounded-[6px] shadow-md hover:shadow-lg active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin text-[#E53935]" />
                        <span>Submitting Inquiry...</span>
                      </>
                    ) : (
                      <span>Submit Inquiry</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Contact Details */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            {/* Upper Portion: In the Dark Area */}
            <div className="pb-8 sm:pb-10 lg:pb-12 drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
              <div className="mb-2.5">
                <span className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none">
                  CONTACT US
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-white font-roboto tracking-tight uppercase leading-tight">
                <span className="relative inline-block">
                  GET IN TOUCH
                  <svg
                    className="absolute -bottom-2.5 left-0 w-36 sm:w-40 h-2.5 sm:h-3"
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

              <p className="text-xs sm:text-sm text-[#D1D5DB] font-normal mt-3 leading-relaxed">
                Our engineering team will review your requirements and respond within 24 hours.
              </p>
            </div>

            {/* Lower Portion: In the White Area */}
            <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-5">
              <h3 className="text-xl sm:text-2xl font-bold text-[#E53935] font-roboto tracking-tight">
                Visit Our Manufacturing Facility
              </h3>

              <div className="space-y-3.5">
                {/* Phone */}
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#E53935] flex items-center justify-center text-[#E53935] flex-shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#6B7280]">
                      Talk to Engineering Sales
                    </span>
                    <a
                      href="tel:+911234567890"
                      className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-roboto hover:text-[#E53935] transition-colors"
                    >
                      +9112345 67890
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-full border border-[#E53935] flex items-center justify-center text-[#E53935] flex-shrink-0 mt-0.5">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="block text-[11px] text-[#6B7280]">
                      Visit Our Location
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-roboto leading-snug max-w-md">
                      Plot No. 3, SR No. 98, Behind HDFC Bank, At Rajosana, Ta.
                      Vadagam, Dist. Banaskantha, Gujarat – 385210
                    </p>
                  </div>
                </div>
              </div>

              {/* Relevant Industry Copy */}
              <p className="text-xs text-[#6B7280] leading-relaxed max-w-lg pt-1">
                Flow Guard EngTech Industries designs and manufactures precision
                mechanical seals, cartridge assemblies, and tailor-made rotary
                sealing systems engineered for chemical, pharmaceutical, power,
                and process industries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
