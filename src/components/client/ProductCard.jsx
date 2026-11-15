import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }) {
  const {
    id,
    name,
    description,
    price,
    image_url,
    category,
    stock = 10,
  } = product;

  return (
    <div className="group bg-[#202020] rounded-[6px] border border-white/10 overflow-hidden hover:border-[#E53935]/60 hover:shadow-2xl hover:shadow-[#E53935]/10 transition-all flex flex-col">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-[#181818] overflow-hidden">
        {image_url ? (
          <Image
            src={image_url}
            alt={name || "Product image"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-sm">
            No image available
          </div>
        )}

        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#1A1A1A]/90 text-[#F8FAFC] border border-white/15 backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              stock > 0
                ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                : "bg-red-950/60 text-red-400 border-red-800"
            }`}
          >
            {stock > 0 ? "In Stock" : "Sold Out"}
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg text-[#F8FAFC] group-hover:text-[#E53935] transition-colors line-clamp-1">
            {name}
          </h3>
          <p className="mt-1 text-sm text-[#6B7280] line-clamp-2">
            {description || "High-performance precision mechanical sealing hardware designed for zero leakage."}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#6B7280] block">Unit Price</span>
            <span className="text-xl font-bold text-[#F8FAFC]">
              {formatPrice(price)}
            </span>
          </div>

          <Link
            href={`/products/${id}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#E53935] hover:text-[#d32f2f] transition-colors"
          >
            Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
