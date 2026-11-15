export const INQUIRY_STATUSES = ["New", "In Progress", "Completed"];

export const INQUIRY_STATUS_STYLES = {
  New: "bg-red-50 text-[#E53935] border-red-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const INQUIRY_STATUS_OPTIONS = [
  { value: "New", label: "New", dotClass: "bg-[#E53935]" },
  { value: "In Progress", label: "In Progress", dotClass: "bg-amber-500" },
  { value: "Completed", label: "Completed", dotClass: "bg-emerald-500" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formats an inquiry ID consistently (e.g. id 1 -> INQ-1001).
 */
export function formatInquiryRef(id) {
  const num = Number(id);
  if (!Number.isInteger(num) || num <= 0) return "INQ-0000";
  return `INQ-${1000 + num}`;
}

/**
 * Validates and normalizes all required contact / quote inquiry fields.
 */
export function validateInquiryPayload(body) {
  const clean = {
    name: typeof body?.name === "string" ? body.name.trim() : "",
    email: typeof body?.email === "string" ? body.email.trim() : "",
    company: typeof body?.company === "string" ? body.company.trim() : "",
    phone: typeof body?.phone === "string" ? body.phone.trim() : "",
    product: typeof body?.product === "string" ? body.product.trim() : "",
    message: typeof body?.message === "string" ? body.message.trim() : "",
  };

  if (!clean.name) return { error: "Full Name is required." };
  if (!clean.email || !EMAIL_PATTERN.test(clean.email)) {
    return { error: "Please enter a valid Email Address." };
  }
  if (!clean.company) return { error: "Company Name is required." };
  if (!clean.phone || clean.phone.replace(/\D/g, "").length < 7) {
    return { error: "Please enter a valid Phone Number." };
  }
  if (!clean.product) return { error: "Product Requirement is required." };
  if (!clean.message) return { error: "Message is required." };

  return { data: clean, error: null };
}

/**
 * Persists an inquiry status change via API and returns the updated record.
 */
export async function updateInquiryStatusRequest(id, status) {
  const res = await fetch(`/api/inquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || "Failed to update inquiry status.");
  }

  return data.inquiry;
}


