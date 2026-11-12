import Link from "next/link";
import { Home, Package } from "lucide-react";
import { categories } from "@/data/catalog";

export const metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-surface py-16">
      <div className="text-center px-4">
        <p className="text-[120px] md:text-[160px] font-black text-slate-200 leading-none select-none font-display" aria-hidden="true">
          404
        </p>
        <div className="-mt-6 md:-mt-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Page Not Found</p>
          <h1 className="text-2xl md:text-4xl font-black text-navy mt-2 tracking-tight">This page doesn&apos;t exist</h1>
          <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm md:text-base">
            The page may have moved or the URL might be incorrect. Try one of our product categories:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-slate-200 bg-white text-slate-600 hover:border-brand hover:text-brand">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 bg-brand text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95"
            >
              <Home size={15} aria-hidden="true" /> Go Home
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 border-2 border-navy text-navy px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-navy hover:text-white transition-all"
            >
              <Package size={15} aria-hidden="true" /> View Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
