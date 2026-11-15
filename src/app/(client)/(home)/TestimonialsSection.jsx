"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rakshit Bhatol",
    role: "CEO, Electrica Systems",
    title: "Zero Leakage Reliability",
    quote:
      "“Excellent product quality and long-lasting sealing performance even under continuous thermal cycling.”",
    avatar: "/client/home/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Henrik Lindholm",
    role: "Director of Operations, NordChem AB",
    title: "Dependable Sealing Partner",
    quote:
      "“Consistent quality across every batch and dependable delivery schedules for our process lines.”",
    avatar: "/client/home/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Ananya Deshmukh",
    role: "Engineering Head, Apex Pharma Labs",
    title: "Hygienic Precision Design",
    quote:
      "“Clean stainless construction and zero contamination risk across all our high-purity reactors.”",
    avatar: "/client/home/testimonial-3.jpg",
  },
  {
    id: 4,
    name: "Klaus Weber",
    role: "Plant Manager, RheinKraft Energy",
    title: "Built for High Pressure",
    quote:
      "“These axial and cartridge seals hold steady under extreme boiler feed pump pressures without drift.”",
    avatar: "/client/home/testimonial-4.jpg",
  },
  {
    id: 5,
    name: "Vikramaditya Nair",
    role: "Lead Mechanical Engineer, Bharat Petrochem",
    title: "Responsive Tech Support",
    quote:
      "“Their engineering team helped us customize seal faces that cut our pump downtime in half.”",
    avatar: "/client/home/testimonial-5.jpg",
  },
  {
    id: 6,
    name: "Mei-Ling Tan",
    role: "Procurement Lead, Straits Marine Pte",
    title: "Corrosion Resistance Excellence",
    quote:
      "“Outstanding durability in seawater cooling pumps—far outperforming standard OEM replacements.”",
    avatar: "/client/home/testimonial-6.jpg",
  },
  {
    id: 7,
    name: "Tariq Al-Mansoor",
    role: "Technical Manager, Gulf Refining Co.",
    title: "Superior Abrasive Handling",
    quote:
      "“Reliable silicon carbide seal faces handled heavy slurry media effortlessly with minimal wear.”",
    avatar: "/client/home/testimonial-7.jpg",
  },
  {
    id: 8,
    name: "Suresh Kulkarni",
    role: "Head of QA, Deccan Pulp & Paper",
    title: "Long Service Intervals",
    quote:
      "“Maintenance intervals extended noticeably after switching our agitators and stock pumps to Flow Guard.”",
    avatar: "/client/home/testimonial-8.jpg",
  },
  {
    id: 9,
    name: "Elena Novak",
    role: "Production Supervisor, BioPure Europe",
    title: "Prompt Custom Turnaround",
    quote:
      "“Fast turnaround on custom seal dimensions saved us from costly scheduled plant shutdown delays.”",
    avatar: "/client/home/testimonial-9.jpg",
  },
];

const AUTOPLAY_INTERVAL_MS = 4500;

export default function TestimonialsSection() {
  const trackRef = useRef(null);
  const scrollRafRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  const maxIndex = Math.max(0, TESTIMONIALS.length - visibleCount);
  const totalStops = maxIndex + 1;

  // Measure cards per viewport directly from rendered track geometry
  const measureVisibleCount = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length === 0) return 1;
    const firstCard = track.children[0];
    const cardWidth = firstCard.getBoundingClientRect().width;
    if (!cardWidth) return 1;
    return Math.max(1, Math.min(3, Math.round(track.clientWidth / cardWidth)));
  }, []);

  const scrollToSlide = useCallback(
    (targetIndex) => {
      const track = trackRef.current;
      if (!track || track.children.length === 0) return;

      const clamped = Math.max(
        0,
        Math.min(targetIndex, Math.max(0, TESTIMONIALS.length - visibleCount))
      );
      const targetCard = track.children[clamped];
      if (!targetCard) return;

      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      track.scrollTo({
        left: targetCard.offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      setActiveIndex(clamped);
    },
    [visibleCount]
  );

  const handleNext = useCallback(() => {
    const nextIdx = activeIndex >= maxIndex ? 0 : activeIndex + 1;
    scrollToSlide(nextIdx);
  }, [activeIndex, maxIndex, scrollToSlide]);

  const handlePrev = useCallback(() => {
    const prevIdx = activeIndex <= 0 ? maxIndex : activeIndex - 1;
    scrollToSlide(prevIdx);
  }, [activeIndex, maxIndex, scrollToSlide]);

  // Keep visibleCount and activeIndex synchronized on resize and manual scroll/swipe
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const syncMetrics = () => {
      const nextVisible = measureVisibleCount();
      setVisibleCount(nextVisible);

      const children = Array.from(track.children);
      if (children.length === 0) return;

      const scrollLeft = track.scrollLeft;
      let nearestIdx = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < children.length; i += 1) {
        const dist = Math.abs(children[i].offsetLeft - scrollLeft);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }

      const nextMax = Math.max(0, TESTIMONIALS.length - nextVisible);
      setActiveIndex(Math.min(nearestIdx, nextMax));
    };

    const handleScroll = () => {
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
      scrollRafRef.current = requestAnimationFrame(syncMetrics);
    };

    const resizeObserver = new ResizeObserver(syncMetrics);
    resizeObserver.observe(track);
    track.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      track.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [measureVisibleCount]);

  // Smooth auto-slider that pauses cleanly on hover, focus, or reduced-motion
  useEffect(() => {
    if (isPaused || totalStops <= 1) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      const nextIdx = activeIndex >= maxIndex ? 0 : activeIndex + 1;
      scrollToSlide(nextIdx);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeIndex, isPaused, maxIndex, totalStops, scrollToSlide]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Client Testimonials"
      className="relative py-14 sm:py-16 lg:py-20 bg-[#121316] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Crisp Industrial Facility Background with Normal Balanced Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/client/home/trusted-by-bg.jpg"
          alt="Trusted by Industry Leaders Facility Background"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Top-Left Red Badge: OUR TESTIMONIAL */}
        <div className="mb-4 sm:mb-5">
          <span className="inline-block bg-gradient-to-r from-[#E53935] via-[#E53935]/80 to-transparent text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-none">
            OUR TESTIMONIAL
          </span>
        </div>

        {/* Section Header (Center Aligned) */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
          <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[36px] font-bold text-white font-roboto tracking-tight leading-tight">
            Trusted by{" "}
            <span className="relative inline-block">
              Industry Leaders
              {/* Signature Red Curved Swoosh */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-2.5 sm:h-3"
                viewBox="0 0 220 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 9C60 2 160 2 217 9"
                  stroke="#E53935"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-[#D1D5DB] font-normal mt-3 leading-relaxed max-w-2xl mx-auto">
            Our clients trust us for delivering reliable and efficient sealing
            solutions.
          </p>
        </div>

        {/* Horizontally Scrollable Snap Track (Top padding protects overlapping avatars) */}
        <div
          ref={trackRef}
          role="group"
          aria-label="Client review slides"
          tabIndex={0}
          className="relative flex gap-6 lg:gap-7 overflow-x-auto snap-x snap-mandatory pt-16 pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden touch-manipulation focus:outline-none"
        >
          {TESTIMONIALS.map((item, idx) => (
            <article
              key={item.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${idx + 1} of ${TESTIMONIALS.length}: ${item.name}`}
              className="relative flex flex-col flex-shrink-0 snap-start w-full md:w-[calc((100%-24px)/2)] lg:w-[calc((100%-56px)/3)] group transition-all duration-300 hover:-translate-y-1"
            >
              {/* Circular Avatar with Bold Red Border - Centered & Overlapping the Dip */}
              <div className="absolute -top-12 sm:-top-13 left-1/2 -translate-x-1/2 z-20 w-24 h-24 sm:w-26 sm:h-26 rounded-full overflow-hidden border-[3px] border-[#E53935] shadow-2xl bg-gray-200 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={item.avatar}
                  alt={item.name}
                  fill
                  sizes="110px"
                  className="object-cover object-center"
                />
              </div>

              {/* White Card Body with Signature V-Dip Top Edge */}
              <div className="relative z-10 filter drop-shadow-2xl flex-1 flex flex-col">
                <div
                  className="bg-white pt-16 sm:pt-18 pb-6 px-5 sm:px-7 text-center flex-1 flex flex-col justify-between"
                  style={{
                    clipPath: "polygon(0 0, 50% 36px, 100% 0, 100% 100%, 0 100%)",
                  }}
                >
                  <div>
                    {/* Unique Review Title */}
                    <h3 className="text-base sm:text-lg font-bold text-[#1A1A1A] font-roboto tracking-tight mt-1">
                      {item.title}
                    </h3>

                    {/* 5 Solid Red Stars */}
                    <div
                      className="flex items-center justify-center gap-1.5 my-2.5"
                      aria-label="5 out of 5 stars"
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="#E53935"
                          className="text-[#E53935]"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-xs text-[#4B5563] leading-relaxed max-w-xs mx-auto italic mt-1.5">
                      {item.quote}
                    </p>
                  </div>

                  {/* Client Name & Role */}
                  <div className="mt-6 pt-3.5 border-t border-gray-100/60">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-roboto leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-[#E53935] mt-0.5 tracking-wide">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Accessible Live Slide Status */}
        <p className="sr-only" role="status" aria-live="polite">
          Showing testimonial {activeIndex + 1} of {totalStops}
        </p>

        {/* Bottom Controls: Prev Icon + Interactive Indicator Bars + Next Icon */}
        <div className="flex items-center justify-center gap-4 sm:gap-5 mt-8 sm:mt-10">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous testimonial"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-white/10 hover:bg-[#E53935] border border-white/20 hover:border-[#E53935] text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-md touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] active:scale-95"
          >
            <ChevronLeft size={18} />
          </button>

          <nav
            aria-label="Choose a testimonial slide"
            className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
          >
            {Array.from({ length: totalStops }).map((_, idx) => {
              const isCurrent = activeIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToSlide(idx)}
                  aria-label={`Go to review ${idx + 1}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] ${
                    isCurrent
                      ? "w-8 sm:w-10 bg-[#E53935]"
                      : "w-4 sm:w-6 bg-white/35 hover:bg-white/60"
                  }`}
                />
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next testimonial"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-[6px] bg-white/10 hover:bg-[#E53935] border border-white/20 hover:border-[#E53935] text-white flex items-center justify-center transition-all duration-200 cursor-pointer backdrop-blur-sm shadow-md touch-manipulation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E53935] active:scale-95"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
