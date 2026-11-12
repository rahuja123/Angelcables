import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Img from "./Img";
import { productPath } from "@/data/catalog";

export default function ProductCard({ product, headingLevel = "h3", showCategory = true, priority = false }) {
  const Heading = headingLevel;
  return (
    <Link
      href={productPath(product)}
      className="bg-white border border-slate-200 overflow-hidden hover:border-brand transition-colors group flex flex-col h-full"
    >
      <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
        <Img
          name={product.image}
          alt={`${product.name} — ${product.category} by Angel Cables, Delhi`}
          priority={priority}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {showCategory && (
          <span className="absolute top-3 left-3 bg-white/90 text-slate-700 px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-slate-200">
            {product.category}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Heading className="font-bold text-navy text-sm">{product.name}</Heading>
        <p className="text-slate-500 text-xs mt-2 line-clamp-2">{product.description}</p>
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {product.features.slice(0, 2).map((f) => (
              <span key={f} className="text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-100">
                {f}
              </span>
            ))}
          </div>
          <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-slate-400 group-hover:text-brand transition-colors" />
        </div>
      </div>
    </Link>
  );
}
