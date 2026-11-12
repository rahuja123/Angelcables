import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Phone, CheckCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import Img from "@/components/Img";
import ProductCard from "@/components/ProductCard";
import JsonLd from "@/components/JsonLd";
import { products, getProduct, productsInCategory, blogsForCategory, productPath, img } from "@/data/catalog";
import { getCategory } from "@/data/categories";
import { pageMetadata, absoluteUrl, whatsappLink, PHONES, HOURS, LEGAL_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ category: p.categorySlug, product: p.slug }));
}

function specLabel(key) {
  const label = key.replace(/_/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function firstSentence(text) {
  const m = text.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

function metaDescription(p) {
  const base = `${firstSentence(p.description)} Factory-direct from Angel Cables, Delhi. Bulk pricing: +91 9810011248.`;
  return base.length <= 160 ? base : `${base.slice(0, 157).replace(/\s+\S*$/, "")}…`;
}

export async function generateMetadata({ params }) {
  const { category, product } = await params;
  const p = getProduct(category, product);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} in Delhi`,
    description: metaDescription(p),
    path: productPath(p),
    image: `/images/${p.image}.webp`,
  });
}

export default async function ProductPage({ params }) {
  const { category, product } = await params;
  const p = getProduct(category, product);
  if (!p) notFound();

  const cat = getCategory(p.categorySlug);
  const related = productsInCategory(p.categorySlug).filter((x) => x.slug !== p.slug).slice(0, 3);
  const guides = blogsForCategory(p.categorySlug);
  const path = productPath(p);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: absoluteUrl(img(p.image).src),
    url: absoluteUrl(path),
    category: p.category,
    brand: { "@type": "Brand", name: "Angel Cables" },
    manufacturer: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: LEGAL_NAME },
    additionalProperty: Object.entries(p.specs).map(([k, v]) => ({
      "@type": "PropertyValue",
      name: specLabel(k),
      value: v,
    })),
  };

  return (
    <>
      <JsonLd data={productJsonLd} />
      <Breadcrumbs
        items={[
          { name: "Products", path: "/products" },
          { name: cat.name, path: `/products/${cat.slug}` },
          { name: p.name, path },
        ]}
      />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <Link href={`/products/${cat.slug}`} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors mb-8 font-semibold">
          <ArrowLeft size={16} aria-hidden="true" /> All {cat.name}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="aspect-[4/3] bg-slate-100 border border-slate-200 overflow-hidden">
              <Img
                name={p.image}
                alt={`${p.name} — ${p.category} manufactured by Angel Cables, Delhi`}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute top-4 left-4 bg-brand text-white px-4 py-1.5 text-xs font-mono uppercase tracking-wider">{p.category}</span>
          </div>

          <div>
            <Link href={`/products/${cat.slug}`} className="text-xs font-mono uppercase tracking-[0.3em] text-brand hover:underline">
              {p.category}
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight leading-tight">{p.name}</h1>
            <p className="text-slate-600 mt-4 leading-relaxed">{p.description}</p>

            <h2 className="mt-8 mb-4 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Specifications</h2>
            <dl className="grid grid-cols-2 gap-2">
              {Object.entries(p.specs).map(([k, v]) => (
                <div key={k} className="bg-surface p-3 border border-slate-200">
                  <dt className="text-[10px] font-mono uppercase tracking-wider text-slate-400">{specLabel(k)}</dt>
                  <dd className="text-sm font-bold text-navy mt-0.5">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="mt-8 mb-4 text-xs font-mono uppercase tracking-[0.2em] text-slate-400">Key Features</h2>
            <ul className="space-y-2">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-navy">
                  <CheckCircle size={16} aria-hidden="true" className="text-brand shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={whatsappLink(`Hi, I am interested in ${p.name}. Please share pricing and availability.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[200px] bg-[#25D366] text-white px-6 py-4 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors text-center"
              >
                Enquire on WhatsApp
              </a>
              <a
                href={`tel:${PHONES[1].tel}`}
                className="flex-1 min-w-[200px] border-2 border-navy text-navy px-6 py-4 font-bold uppercase tracking-wide text-sm hover:bg-navy hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} aria-hidden="true" /> Call Now
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
              {HOURS} · {PHONES[0].display} · {PHONES[1].display}
            </p>
            <p className="text-sm text-slate-500 mt-6">
              Need bulk quantities or a custom specification?{" "}
              <Link href="/contact" className="text-brand font-semibold hover:underline">
                Request a quote
              </Link>{" "}
              or{" "}
              <Link href="/dealers" className="text-brand font-semibold hover:underline">
                become a dealer
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-surface py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black text-navy tracking-tight">More {cat.name}</h2>
              <Link href={`/products/${cat.slug}`} className="text-xs font-bold uppercase tracking-wide text-brand inline-flex items-center gap-1 shrink-0">
                View all <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <ProductCard key={r.slug} product={r} showCategory={false} />
              ))}
            </div>
          </div>
        </section>
      )}

      {guides.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <h2 className="text-2xl font-black text-navy tracking-tight mb-6">Helpful Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guides.map((g) => (
              <Link key={g.slug} href={`/blog/${g.slug}`} className="group flex items-start justify-between gap-4 p-5 border border-slate-200 hover:border-brand transition-colors">
                <span className="text-sm font-bold text-navy group-hover:text-brand transition-colors font-display">{g.title}</span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 mt-0.5 text-slate-400 group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
