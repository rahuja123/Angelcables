import Link from "next/link";
import { ArrowRight, Shield, Zap, Award, Factory, ChevronRight, Quote, Clock } from "lucide-react";
import Img from "@/components/Img";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { categories, products, blogs } from "@/data/catalog";
import { pageMetadata, localBusinessJsonLd, PHONES } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Wire & Cable Manufacturer in Delhi | ISI Certified | Angel Cables",
    description:
      "ISI-certified wire & cable manufacturer in Delhi since 2005: armoured, FR/FRLS house wire, CCTV, CAT6 and submersible cable at factory prices.",
    path: "/",
  }),
  // The homepage title is already complete — skip the "| Angel Cables" template.
  title: { absolute: "Wire & Cable Manufacturer in Delhi | ISI Certified | Angel Cables" },
};

const YEARS = new Date().getFullYear() - 2005;

const stats = [
  { value: `${YEARS}+`, label: "Years Experience" },
  { value: "50K+", label: "Happy Clients" },
  { value: String(categories.length), label: "Product Lines" },
  { value: "Delhi", label: "Based in India" },
];

const whyChoose = [
  { icon: Shield, title: "ISI Certified Quality", desc: "All products manufactured under strict quality control and certified to Indian standards." },
  { icon: Zap, title: "Superior Conductivity", desc: "Pure copper and premium aluminium conductors ensure maximum efficiency and safety." },
  { icon: Award, title: "Trusted Since 2005", desc: "Two decades of trust built with contractors, builders, and industries across India." },
  { icon: Factory, title: "Direct from Factory", desc: "Manufactured at our Delhi facility — competitive pricing with no middlemen." },
];

const FEATURED_SLUGS = [
  "2-core-aluminium-armoured-cable",
  "fr-single-core-house-wire",
  "2-5-sq-mm-single-phase-submersible-cable",
  "rg-6-ccs-cctv-coaxial-cable",
  "cat6-utp-cable-305mtr-box",
  "4-core-copper-armoured-cable",
];
const featured = FEATURED_SLUGS.map((s) => products.find((p) => p.slug === s)).filter(Boolean);

const testimonials = [
  {
    quote: "Angel Cables has been our go-to supplier for armoured cables for the past 6 years. Consistent quality, ISI certified, and always delivered on time.",
    name: "Rakesh Sharma",
    role: "Electrical Contractor",
    company: "Sharma Electricals, Delhi",
  },
  {
    quote: "We've used their house wires across 3 residential projects in Gurugram. Zero complaints from residents and the pricing beats the market.",
    name: "Anand Verma",
    role: "Project Manager",
    company: "BuildRight Infrastructure",
  },
  {
    quote: "Sourced submersible cables for 200+ borewells across Haryana. The quality is consistently good and their support team responds fast on WhatsApp.",
    name: "Suresh Patel",
    role: "Dealer & Distributor",
    company: "Patel Hardware, Rohtak",
  },
  {
    quote: "Good product range under one roof — armoured, flexible, CCTV cables. Makes procurement easy for large industrial orders.",
    name: "Meena Agarwal",
    role: "Purchase Manager",
    company: "Northern Power Projects",
  },
];

const heroImages = [
  // Mix of new branded studio shots and original product photos, alternating corners.
  { name: "angel-armoured-4-core-copper", alt: "Angel 4 core copper armoured cable cut open showing steel wire armour", aspect: "aspect-[4/3]" },
  { name: "armoured-cable-3-core", alt: "3 core armoured cable with steel wire armour and copper conductors", aspect: "aspect-square" },
  { name: "angel-bare-copper-wire", alt: "Angel bare copper wire coil", aspect: "aspect-square" },
  { name: "cctv-cable", alt: "CCTV coaxial cable roll", aspect: "aspect-[4/3]" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />

      {/* HERO */}
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand opacity-5 skew-x-[-12deg] translate-x-20" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand opacity-10 rounded-full blur-3xl" aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1>
                <span className="block text-xs font-mono uppercase tracking-[0.3em] text-brand mb-6">
                  ISI-Certified Wire &amp; Cable Manufacturer in Delhi
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]">
                  Powering India
                  <br />
                  with <span className="text-brand">Precision</span>
                  <br />
                  &amp; Safety
                </span>
              </h1>
              <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-lg">
                Angel Cables manufactures ISI-certified armoured cables, FR/FRLS house wires, flexible, CCTV, CAT6 and submersible cables at our
                Delhi factory — trusted by contractors, builders and dealers since 2005.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  View Products <ArrowRight size={16} aria-hidden="true" />
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-white/30 text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-all"
                >
                  Get a Quote
                </Link>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-3">
              {[heroImages.slice(0, 2), heroImages.slice(2)].map((col, ci) => (
                <div key={ci} className={`space-y-3 ${ci === 1 ? "pt-8" : ""}`}>
                  {col.map((im) => (
                    <div key={im.name} className={`bg-slate-800 ${im.aspect} overflow-hidden border border-slate-700`}>
                      <Img
                        name={im.name}
                        alt={im.alt}
                        sizes="(min-width: 1280px) 300px, 25vw"
                        priority={ci === 0}
                        className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white border-b border-slate-200" aria-label="Company highlights">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {stats.map((s) => (
              <div key={s.label} className="py-8 md:py-12 text-center flex flex-col-reverse">
                <dt className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 mt-2">{s.label}</dt>
                <dd className="text-3xl md:text-4xl font-black text-navy font-display">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Our Range</p>
              <h2 className="text-3xl md:text-5xl font-black text-navy mt-2 tracking-tight">Wire &amp; Cable Categories</h2>
            </div>
            <Link
              href="/products"
              className="mt-4 md:mt-0 text-sm font-bold uppercase tracking-wide text-brand hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              View All Products <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products/${cat.slug}`}
                className="group block bg-white border border-slate-200 overflow-hidden hover:border-brand transition-colors"
              >
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <Img
                    name={cat.image}
                    alt={`${cat.name} — Angel Cables, Delhi`}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <h3 className="font-bold text-navy text-sm uppercase tracking-wider">{cat.name}</h3>
                  <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-slate-400 group-hover:text-brand group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Featured</p>
            <h2 className="text-3xl md:text-5xl font-black text-navy mt-2 tracking-tight">Popular Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border-2 border-navy text-navy px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-navy hover:text-white transition-all"
            >
              See All {products.length} Products <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Why Angel Cables</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight">
              Built Different.
              <br />
              Built to Last.
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((item) => (
              <div key={item.title} className="border border-slate-700 p-8 hover:border-brand transition-colors">
                <item.icon size={28} aria-hidden="true" className="text-brand mb-4" />
                <h3 className="text-lg font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LOCAL SEO COPY */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">About Angel Cables</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight">Delhi Wire &amp; Cable Supplier, Delivering Across India</h2>
          <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
            <p>
              Angel Cables, a unit of R K Enterprises, has manufactured electrical wires and cables at Lawrence Road Industrial Area, Delhi since 2005.
              We sell direct from our factory, so electrical contractors, builders, dealers and industrial buyers get ISI-certified quality at
              wholesale rates — with GST invoices and quick dispatch.
            </p>
            <p>
              Our range covers{" "}
              <Link href="/products/armoured-cable" className="text-brand font-semibold hover:underline">aluminium and copper armoured cable</Link>,{" "}
              <Link href="/products/house-wire" className="text-brand font-semibold hover:underline">FR and FRLS house wire</Link>,{" "}
              <Link href="/products/flexible-cable" className="text-brand font-semibold hover:underline">flexible and shielded control cable</Link>,{" "}
              <Link href="/products/cctv-cable" className="text-brand font-semibold hover:underline">RG-6 and combo CCTV cable</Link>,{" "}
              <Link href="/products/submersible-cable" className="text-brand font-semibold hover:underline">submersible pump cable</Link>,{" "}
              <Link href="/products/copper-wire" className="text-brand font-semibold hover:underline">bare and tinned copper wire</Link>,{" "}
              <Link href="/products/cat6-lan-cable" className="text-brand font-semibold hover:underline">CAT6 LAN cable</Link> and{" "}
              <Link href="/products/telephone-cable" className="text-brand font-semibold hover:underline">telephone cable</Link>.
            </p>
            <p>
              We deliver all over India — from Delhi, Noida, Gurugram, Faridabad and Ghaziabad to contractors, builders and dealers in
              every state.{" "}
              <Link href="/contact" className="text-brand font-semibold hover:underline">Request a quote</Link> for bulk pricing.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">What Clients Say</p>
            <h2 className="text-3xl md:text-5xl font-black text-navy mt-2 tracking-tight">
              Trusted by Contractors
              <br />
              &amp; Industries Alike
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <figure key={t.name} className="bg-white border border-slate-200 p-8 hover:border-brand transition-colors">
                <Quote size={28} aria-hidden="true" className="text-brand mb-4 opacity-60" />
                <blockquote className="text-slate-600 leading-relaxed text-sm">“{t.quote}”</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 text-brand font-black text-sm" aria-hidden="true">
                    {t.name[0]}
                  </span>
                  <span>
                    <span className="block font-bold text-navy text-sm font-display">{t.name}</span>
                    <span className="block text-xs text-slate-400 font-mono">
                      {t.role} · {t.company}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Knowledge Base</p>
              <h2 className="text-3xl md:text-5xl font-black text-navy mt-2 tracking-tight">Wiring Guides</h2>
            </div>
            <Link href="/blog" className="mt-4 md:mt-0 text-sm font-bold uppercase tracking-wide text-brand hover:text-orange-700 inline-flex items-center gap-1">
              All Guides <ChevronRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group border border-slate-200 p-6 hover:border-brand transition-colors flex flex-col">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand">{post.category}</span>
                <h3 className="text-lg font-black text-navy mt-2 leading-snug group-hover:text-brand transition-colors">{post.title}</h3>
                <p className="text-slate-500 text-sm mt-3 line-clamp-3 flex-1">{post.excerpt}</p>
                <span className="mt-4 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Clock size={11} aria-hidden="true" /> {post.readTime}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-navy tracking-tight">Ready to Power Your Project?</h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Whether you need cables for a residential project or an industrial setup, we have the right solution. Contact us for competitive
            pricing and fast delivery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <a
              href={`tel:${PHONES[1].tel}`}
              className="border-2 border-navy text-navy px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-navy hover:text-white transition-all"
            >
              Call Now: {PHONES[1].display}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
