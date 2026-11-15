import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, ArrowRight } from "lucide-react";
import BlogCard from "../BlogCard";
import { supabase } from "@/lib/supabase";
import { formatShortDate, stripHtml } from "@/lib/utils";

export const revalidate = 60;

async function getBlogBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, description, status, created_at")
      .eq("slug", slug)
      .eq("status", 1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

async function getRelatedBlogs(currentBlog, limit = 3) {
  try {
    const { data, error } = await supabase
      .from("blogs")
      .select("id, title, slug, cover_image, description, status, created_at")
      .eq("status", 1)
      .neq("id", currentBlog.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Flow Guard EngTech Industries",
    };
  }

  return {
    title: `${blog.title} | Flow Guard Blog`,
    description: stripHtml(blog.description).slice(0, 160),
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog, 3);
  const coverSrc = blog.cover_image || "/client/home/hero-bg.jpg";

  return (
    <main className="bg-white min-h-screen font-roboto text-[#1A1A1A]">
      {/* Top Clean Header */}
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={coverSrc}
            alt={blog.title}
            fill
            priority
            unoptimized={coverSrc.startsWith("http")}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-3.5">
          {/* Breadcrumb Ribbon */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[11px] sm:text-xs font-medium px-3.5 py-1 shadow-xs">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="text-white/80">&gt;</span>
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight tracking-tight max-w-4xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            {blog.title}
          </h1>

          {/* Published Date */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-white font-medium pt-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
            <Calendar size={14} className="text-[#E53935]" />
            <span>{formatShortDate(blog.created_at)}</span>
          </div>
        </div>
      </section>

      {/* Main Article Body & Right Sidebar */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left Column: Cover Image + Description + Back Link */}
            <article className="lg:col-span-8 space-y-6">
              {/* Main Cover Banner */}
              <div className="relative aspect-[16/9] w-full rounded-[6px] overflow-hidden border border-gray-200 bg-gray-100 shadow-xs">
                <Image
                  src={coverSrc}
                  alt={blog.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 850px"
                  unoptimized={coverSrc.startsWith("http")}
                  className="object-cover"
                />
              </div>

              {/* Formatted Rich Description */}
              <div
                className="blog-content pt-2"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />

              {/* Back to All Articles Navigation */}
              <div className="pt-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#E53935] px-4 py-2 rounded-[6px] border border-gray-200 hover:border-[#E53935]/40 transition-colors"
                >
                  <ArrowLeft size={15} />
                  <span>Back to All Articles</span>
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-[#E53935] hover:bg-[#d32f2f] px-4 py-2 rounded-[6px] transition-colors"
                >
                  <span>Request a Quote</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            {/* Right Sticky Sidebar: Quote Box + Related Articles */}
            <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Engineering Support / Quote Box */}
              <div className="bg-[#1A1A1A] text-white rounded-[6px] p-6 border border-gray-800 shadow-md space-y-4">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#E53935] bg-[#E53935]/15 border border-[#E53935]/30 px-2.5 py-1 rounded-[4px]">
                  Flow Guard Engineering
                </span>
                <h3 className="text-lg font-bold leading-snug">
                  Need a Custom Mechanical Seal Quote?
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Send your operating pressure, temperature, shaft size, and
                  fluid details for rapid engineering assistance.
                </p>
                <div className="space-y-2.5 pt-1">
                  <Link
                    href="/contact"
                    className="w-full inline-flex items-center justify-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold py-2.5 px-4 rounded-[6px] transition-colors"
                  >
                    <span>Request a Quote</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/products"
                    className="w-full inline-flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/20 text-white text-xs font-semibold py-2.5 px-4 rounded-[6px] transition-colors"
                  >
                    Browse Seal Catalog
                  </Link>
                </div>
              </div>

              {/* Related Articles in Sidebar */}
              {relatedBlogs.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-[6px] p-5 shadow-2xs space-y-3.5">
                  <h3 className="text-sm font-bold text-[#1A1A1A] uppercase tracking-wider pb-2 border-b border-gray-100">
                    Related Articles
                  </h3>
                  <div className="space-y-3.5">
                    {relatedBlogs.slice(0, 3).map((item) => (
                      <Link
                        key={item.id}
                        href={`/blog/${item.slug}`}
                        className="group flex items-start gap-3"
                      >
                        <div className="relative w-16 h-12 rounded-[4px] overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                          <Image
                            src={item.cover_image || "/client/home/hero-bg.jpg"}
                            alt={item.title}
                            fill
                            sizes="80px"
                            unoptimized={(item.cover_image || "").startsWith("http")}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-gray-400 font-medium block">
                            {formatShortDate(item.created_at)}
                          </span>
                          <h4 className="text-xs font-bold text-[#1A1A1A] group-hover:text-[#E53935] transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* Bottom Recent Articles Grid */}
      {relatedBlogs.length > 0 && (
        <section className="py-12 sm:py-14 bg-[#F9FAFB] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#E53935] block">
                  More Articles
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] tracking-tight">
                  Recent Flow Guard Blogs
                </h2>
              </div>

              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#E53935] hover:underline"
              >
                <span>View All Articles</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedBlogs.slice(0, 3).map((rel) => (
                <BlogCard key={rel.id} blog={rel} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
