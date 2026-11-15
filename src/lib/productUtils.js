/**
 * Generates a URL-friendly slug from a product title.
 */
export function slugify(text) {
  if (typeof text !== "string") return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Cleans an array of strings by trimming whitespace and dropping empty items.
 */
export function normalizeStringArray(items) {
  if (!Array.isArray(items)) return [];
  return items
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

/**
 * Cleans dynamic operating_limits rows ({ label, value }).
 */
export function normalizeOperatingLimits(limits) {
  if (!Array.isArray(limits)) return [];
  return limits
    .map((row) => ({
      label: typeof row?.label === "string" ? row.label.trim() : "",
      value: typeof row?.value === "string" ? row.value.trim() : "",
    }))
    .filter((row) => row.label || row.value);
}

/**
 * Cleans dynamic extra_sections blocks ({ heading, layout, items }).
 */
export function normalizeExtraSections(sections) {
  if (!Array.isArray(sections)) return [];
  const validLayouts = new Set(["numbered", "list", "key_value"]);

  return sections
    .map((sec) => {
      const heading = typeof sec?.heading === "string" ? sec.heading.trim() : "";
      const layout = validLayouts.has(sec?.layout) ? sec.layout : "list";
      let items = [];

      if (layout === "key_value") {
        items = Array.isArray(sec?.items)
          ? sec.items
              .map((kv) => ({
                label: typeof kv?.label === "string" ? kv.label.trim() : "",
                value: typeof kv?.value === "string" ? kv.value.trim() : "",
              }))
              .filter((kv) => kv.label || kv.value)
          : [];
      } else {
        items = normalizeStringArray(sec?.items);
      }

      return { heading, layout, items };
    })
    .filter((sec) => sec.heading && sec.items.length > 0);
}

