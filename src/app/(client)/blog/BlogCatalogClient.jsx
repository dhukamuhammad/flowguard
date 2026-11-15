"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, BookOpen, ArrowRight } from "lucide-react";
import BlogCard from "./BlogCard";
import { stripHtml } from "@/lib/utils";

export default function BlogCatalogClient({ blogs = [] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBlogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blogs;

    return blogs.filter((blog) => {
      const titleMatch = blog.title.toLowerCase().includes(q);
      const textMatch = stripHtml(blog.description).toLowerCase().includes(q);
      return titleMatch || textMatch;
    });
  }, [blogs, searchQuery]);

  return (
    <section className="bg-[#F9FAFB] text-[#1A1A1A] py-10 sm:py-14 font-roboto">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 space-y-8 sm:space-y-10">
        {/* Simple Top Toolbar: Article Counter + Search Bar */}
        <div className="bg-white border border-gray-200 rounded-[6px] p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#1A1A1A] tracking-tight">
              All Articles
            </h2>
            <p className="text-xs text-[#6B7280]">
              Showing {filteredBlogs.length} {filteredBlogs.length === 1 ? "article" : "articles"}
            </p>
          </div>

          {/* Clean Search Input */}
          <div className="relative w-full sm:w-80 flex-shrink-0">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-300 rounded-[6px] text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#E53935] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 3-Column Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-[6px] p-12 text-center shadow-xs space-y-3">
            <div className="w-12 h-12 mx-auto rounded-[6px] bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400">
              <BookOpen size={22} />
            </div>
            <h3 className="text-base font-bold text-[#1A1A1A]">
              No matching articles found
            </h3>
            <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto">
              No blogs match your search query &quot;{searchQuery}&quot;. Try searching with a different keyword.
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-semibold px-4 py-2 rounded-[6px] cursor-pointer transition-colors"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}

        {/* Bottom Support CTA Strip */}
        <div className="bg-[#1A1A1A] text-white rounded-[6px] p-6 sm:p-8 lg:p-10 border border-white/10 shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
              Need Help Selecting the Right Mechanical Seal?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Share your pump specifications, shaft size, pressure, and process
              fluid with our engineering team for a custom seal recommendation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-shrink-0">
            <Link
              href="/products"
              className="px-5 py-2.5 rounded-[6px] border border-white/25 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Explore Seal Catalog
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-[6px] bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#E53935]/30 transition-all"
            >
              <span>Request a Quote</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
