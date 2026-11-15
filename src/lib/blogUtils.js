/**
 * Generates an SEO clean URL slug from a blog post title.
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
 * Validates and normalizes blog post inputs for save / edit operations.
 */
export function validateBlogPayload(body) {
  const title = typeof body?.title === "string" ? body.title.trim() : "";
  const rawSlug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const slug = slugify(rawSlug || title);
  const cover_image =
    typeof body?.cover_image === "string" ? body.cover_image.trim() : "";
  const description =
    typeof body?.description === "string" ? body.description.trim() : "";
  const rawStatus = Number(body?.status);
  const status = rawStatus === 0 ? 0 : 1;

  if (!title) {
    return { error: "Blog title is required." };
  }

  if (!slug) {
    return { error: "A valid URL slug is required." };
  }

  if (!description) {
    return { error: "Blog description content cannot be empty." };
  }

  return {
    data: {
      title,
      slug,
      cover_image,
      description,
      status,
    },
    error: null,
  };
}

