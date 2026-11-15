import BlogHeroBanner from "./BlogHeroBanner";
import BlogCatalogClient from "./BlogCatalogClient";
import { supabase } from "@/lib/supabase";
import { STATIC_BLOGS } from "@/data/staticBlogs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Engineering Blog & Sealing Guides | Flow Guard EngTech Industries",
  description:
    "Explore practical engineering articles on mechanical seal selection, API 682 flush plans, failure analysis, and industrial sealing applications.",
};

async function getPublishedBlogs() {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, description, status, created_at")
      .eq("status", 1)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return STATIC_BLOGS;
    }
    return data;
  } catch {
    return STATIC_BLOGS;
  }
}

export default async function BlogPage() {
  const blogs = await getPublishedBlogs();

  return (
    <main className="bg-[#F9FAFB] min-h-screen">
      <BlogHeroBanner />
      <BlogCatalogClient blogs={blogs} />
    </main>
  );
}
