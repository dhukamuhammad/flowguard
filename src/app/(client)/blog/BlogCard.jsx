import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { formatShortDate, stripHtml } from "@/lib/utils";

/**
 * Clean, simplified Blog Card without clutter.
 * Automatically extracts and truncates the plain text preview from `description`.
 */
export default function BlogCard({ blog }) {
  const coverSrc = blog.cover_image || "/client/home/hero-bg.jpg";
  const plainTextExcerpt = stripHtml(blog.description);

  return (
    <article className="group relative bg-white rounded-[6px] border border-gray-200 overflow-hidden shadow-xs hover:shadow-md hover:border-gray-300 transition-all duration-300 flex flex-col">
      {/* Cover Image (Clean, No badge) */}
      <Link
        href={`/blog/${blog.slug}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 block"
      >
        <Image
          src={coverSrc}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized={coverSrc.startsWith("http")}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-4 font-roboto">
        <div className="space-y-2.5">
          {/* Published Date */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B7280] font-medium">
            <Calendar size={13} className="text-[#E53935]" />
            <span>{formatShortDate(blog.created_at)}</span>
          </div>

          {/* Title */}
          <Link href={`/blog/${blog.slug}`} className="block">
            <h3 className="text-base sm:text-[17px] font-bold text-[#1A1A1A] leading-snug line-clamp-2 group-hover:text-[#E53935] transition-colors">
              {blog.title}
            </h3>
          </Link>

          {/* Auto-Truncated Description */}
          <p className="text-xs sm:text-[13px] text-[#4B5563] leading-relaxed line-clamp-2 sm:line-clamp-3">
            {plainTextExcerpt}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
          <Link
            href={`/blog/${blog.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E53935] group-hover:gap-2 transition-all"
          >
            <span>Read More</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Signature Red Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E53935] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  );
}
