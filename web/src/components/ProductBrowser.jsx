"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import ProductCard from "./ProductCard";

/** Full product list (pre-rendered) with an optional client-side search filter. */
export default function ProductBrowser({ products, categories }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  // Old CRA links used /products?category=Armoured%20Cable — send them to the
  // new category landing page so bookmarks and external links keep working.
  useEffect(() => {
    const legacy = new URLSearchParams(window.location.search).get("category");
    if (!legacy) return;
    const match = categories.find((c) => c.name.toLowerCase() === legacy.toLowerCase());
    if (match) router.replace(`/products/${match.slug}`);
  }, [categories, router]);

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      q
        ? products.filter((p) =>
            [p.name, p.category, p.description, ...p.features, ...Object.values(p.specs)].join(" ").toLowerCase().includes(q)
          )
        : [],
    [products, q]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="relative mb-6">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <Search size={18} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id="product-search"
          type="search"
          placeholder="Search products — e.g. 2.5 sq mm, FRLS, RG-6, 4 core…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-10 py-3 border border-slate-200 bg-white text-sm focus:outline-none focus:border-brand transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Category jump links (real links to the category landing pages) */}
      <nav aria-label="Product categories" className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/products/${c.slug}`}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider border border-slate-200 text-slate-600 hover:border-brand hover:text-brand transition-colors"
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {q ? (
        <section aria-live="polite">
          <p className="text-sm text-slate-500 mb-4">
            {results.length} result{results.length === 1 ? "" : "s"} for <span className="font-bold text-navy">“{query}”</span>
          </p>
          {results.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-slate-400">
              No products match. Try a different term or{" "}
              <Link href="/contact" className="text-brand font-semibold underline">
                ask our team
              </Link>
              .
            </p>
          )}
        </section>
      ) : (
        <div className="space-y-16">
          {categories.map((c, ci) => {
            const items = products.filter((p) => p.categorySlug === c.slug);
            return (
              <section key={c.slug} aria-labelledby={`cat-${c.slug}`}>
                <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2 mb-6">
                  <h2 id={`cat-${c.slug}`} className="text-2xl md:text-3xl font-black text-navy tracking-tight">
                    {c.name}
                  </h2>
                  <Link
                    href={`/products/${c.slug}`}
                    className="text-xs font-bold uppercase tracking-wide text-brand hover:text-orange-700 inline-flex items-center gap-1"
                  >
                    View category<span className="sr-only">: {c.name}</span> <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.map((p, i) => (
                    <ProductCard key={p.slug} product={p} showCategory={false} priority={ci === 0 && i === 0} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
