import Image from "next/image";
import Link from "next/link";

export default function BlogHeroBanner() {
  return (
    <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 overflow-hidden">
      {/* Brand New Dedicated Industrial Mechanical Seal Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/client/blog/blog-hero-bg.jpg"
          alt="Flow Guard Engineering & Mechanical Seal Testing"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Soft Left Gradient Overlay matching Homepage Hero: High contrast for text, natural vibrant lighting on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent/20" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl space-y-4">
          {/* Breadcrumb Ribbon */}
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[11px] sm:text-xs font-medium px-3.5 py-1 shadow-xs">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="text-white/80">&gt;</span>
            <span className="text-white font-semibold">Blog</span>
          </div>

          {/* Headline with Signature Red Underline */}
          <h1 className="text-2xl sm:text-4xl lg:text-[42px] font-bold font-roboto text-white tracking-tight leading-[1.14]">
            Technical Insights &amp;{" "}
            <span className="relative inline-block">
              Sealing Guides
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-[#E53935]"
                viewBox="0 0 260 14"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10C65 2 185 2 258 10"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm lg:text-[15px] text-white/90 font-normal leading-relaxed max-w-2xl pt-1">
            Practical engineering articles on mechanical seal selection, API 682
            piping plans, face material metallurgy, and pump reliability from the
            Flow Guard engineering team.
          </p>
        </div>
      </div>
    </section>
  );
}
