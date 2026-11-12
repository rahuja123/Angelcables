import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle, Phone } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import ProductCard from "@/components/ProductCard";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { categories, productsInCategory, blogsForCategory, productPath } from "@/data/catalog";
import { getCategory } from "@/data/categories";
import { pageMetadata, faqJsonLd, absoluteUrl, whatsappLink, PHONES } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return pageMetadata({
    title: cat.metaTitle,
    description: cat.metaDescription,
    path: `/products/${cat.slug}`,
    image: `/images/${cat.image}.webp`,
  });
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const items = productsInCategory(cat.slug);
  const guides = blogsForCategory(cat.slug);
  const others = categories.filter((c) => c.slug !== cat.slug);
  const path = `/products/${cat.slug}`;

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: cat.h1,
    description: cat.metaDescription,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: absoluteUrl(productPath(p)),
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionJsonLd} />
      <JsonLd data={faqJsonLd(cat.faqs)} />
      <Breadcrumbs
        items={[
          { name: "Products", path: "/products" },
          { name: cat.name, path },
        ]}
      />
      <PageHeader eyebrow={cat.name} title={cat.h1}>
        <p>{cat.intro[0]}</p>
      </PageHeader>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight mb-8">
          {cat.name} Range <span className="text-slate-400 font-normal text-lg">({items.length} products)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p, i) => (
            <ProductCard key={p.slug} product={p} showCategory={false} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* Long-form copy + applications */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight">About Our {cat.name}</h2>
            <div className="mt-5 space-y-4 text-slate-600 leading-relaxed">
              {cat.intro.slice(1).map((para) => (
                <p key={para.slice(0, 32)}>{para}</p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 h-fit">
            <h2 className="text-lg font-black text-navy">Common Applications</h2>
            <ul className="mt-4 space-y-3">
              {cat.uses.map((u) => (
                <li key={u} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle size={16} aria-hidden="true" className="text-brand shrink-0 mt-0.5" />
                  {u}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={whatsappLink(`Hi, I need a quote for ${cat.name}. Please share pricing.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-5 py-3 font-bold uppercase tracking-wide text-xs hover:bg-green-600 transition-colors text-center"
              >
                Get {cat.name} Price on WhatsApp
              </a>
              <a
                href={`tel:${PHONES[0].tel}`}
                className="border-2 border-navy text-navy px-5 py-3 font-bold uppercase tracking-wide text-xs hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={14} aria-hidden="true" /> Call {PHONES[0].display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight mb-6">{cat.name} — Frequently Asked Questions</h2>
        <FaqList items={cat.faqs} />
      </section>

      {/* Related guides */}
      {guides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 pb-12 md:pb-16">
          <h2 className="text-2xl font-black text-navy tracking-tight mb-6">Buying Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((g) => (
              <Link key={g.slug} href={`/blog/${g.slug}`} className="group flex items-start justify-between gap-4 p-5 border border-slate-200 hover:border-brand transition-colors">
                <span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand">{g.category}</span>
                  <span className="block text-sm font-bold text-navy mt-1 group-hover:text-brand transition-colors font-display">{g.title}</span>
                </span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 mt-1 text-slate-400 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Other categories */}
      <section className="bg-navy py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-black text-white tracking-tight mb-6">Other Cable Categories</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {others.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/${c.slug}`}
                  className="flex items-center justify-between gap-3 border border-slate-700 px-5 py-4 text-sm font-semibold text-slate-200 hover:border-brand hover:text-white transition-colors"
                >
                  {c.name} <ArrowRight size={14} aria-hidden="true" className="text-brand shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
