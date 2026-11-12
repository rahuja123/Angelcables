import Link from "next/link";
import { Shield, Users, Factory, Award, ArrowRight, CheckCircle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import Img from "@/components/Img";
import { categories } from "@/data/catalog";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Us — Delhi Cable Manufacturer Since 2005",
  description:
    "Angel Cables (R K Enterprises) has made ISI-certified wires and cables in Lawrence Road Industrial Area, Delhi since 2005. Trusted across North India.",
  path: "/about",
});

const YEARS = new Date().getFullYear() - 2005;

const timeline = [
  { year: "2005", title: "Founded", desc: "R K Enterprises established in Lawrence Road Industrial Area, Delhi." },
  { year: "2008", title: "Expansion", desc: "Expanded product range to include armoured cables and flexible cables." },
  { year: "2012", title: "Angel Cables Brand", desc: "Launched the Angel Cables brand for our premium wire and cable product line." },
  { year: "2018", title: "Industry Growth", desc: "Became a trusted supplier for major contractors and industrial projects across North India." },
  { year: "2024", title: "Digital Presence", desc: "Expanded our reach with digital platforms to serve customers across India." },
];

const values = [
  { icon: Shield, title: "Quality First", desc: "Every product undergoes rigorous quality testing before dispatch. No compromises." },
  { icon: Users, title: "Customer Focus", desc: "We build long-term relationships. Your success is our success." },
  { icon: Factory, title: "Made in India", desc: "Proudly manufactured in Delhi with Indian raw materials and workforce." },
  { icon: Award, title: "Industry Standards", desc: "All products meet ISI standards and industry-grade specifications." },
];

const gallery = [
  { name: "factory-floor", alt: "Cable manufacturing at the Angel Cables factory, Delhi" },
  { name: "factory-products", alt: "Finished Angel Cables wire and cable products" },
  { name: "cable-stock", alt: "Cable drums in stock at the Delhi warehouse" },
  { name: "armoured-cable", alt: "Steel wire armoured cable made by Angel Cables" },
];

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "About Us", path: "/about" }]} />
      <PageHeader eyebrow="Our Story" title="About Angel Cables">
        <p>Two decades of manufacturing wires and cables in Delhi — trusted by contractors, builders and dealers across India.</p>
      </PageHeader>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Est. 2005</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight">
              A Legacy of Trust
              <br />
              &amp; Quality
            </h2>
            <p className="text-slate-500 mt-6 leading-relaxed">
              Angel Cables, a unit of R K Enterprises, has been manufacturing premium quality wires and cables since 2005. Based in Delhi&apos;s
              Lawrence Road Industrial Area, we have built a reputation for products that meet the highest standards of safety and performance.
            </p>
            <p className="text-slate-500 mt-4 leading-relaxed">
              Our facility is equipped with modern machinery and stringent quality control. Every cable that leaves our factory is tested to make sure
              it meets ISI standards and performs reliably for years.
            </p>
            <p className="text-slate-500 mt-4 leading-relaxed">
              From residential house wiring to heavy-duty industrial armoured cables, we serve contractors, builders, electricians and industrial buyers
              across North India.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] bg-slate-100 overflow-hidden border border-slate-200">
              <Img
                name="manufacturing-facility"
                alt="Industrial manufacturing facility"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-brand text-white p-6 hidden md:block">
              <p className="text-3xl font-black font-display">{YEARS}+</p>
              <p className="text-xs font-mono uppercase tracking-wider mt-1">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Our Values</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight mb-12">What Drives Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 p-8 hover:border-brand transition-colors">
                <v.icon size={28} aria-hidden="true" className="text-brand mb-4" />
                <h3 className="font-bold text-navy text-lg">{v.title}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Our Journey</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight mb-12">Milestones</h2>
          <ol className="relative space-y-8">
            <span className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200" aria-hidden="true" />
            {timeline.map((item, i) => (
              <li key={item.year} className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${i % 2 ? "md:flex-row-reverse" : ""}`}>
                <span className="absolute left-4 md:left-1/2 w-3 h-3 bg-brand -translate-x-1/2 mt-2 z-10" aria-hidden="true" />
                <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 ? "md:pl-12" : "md:text-right md:pr-12"}`}>
                  <span className="font-mono text-brand text-sm font-bold">{item.year}</span>
                  <h3 className="font-bold text-navy text-lg mt-1">{item.title}</h3>
                  <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-navy">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Capabilities</p>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight">What We Manufacture</h2>
            <p className="text-slate-400 mt-4 leading-relaxed">
              Our Delhi facility produces and supplies a comprehensive range of electrical wires and cables for every application.
            </p>
            <ul className="mt-8 space-y-4">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products/${c.slug}`} className="flex items-center gap-3 text-white hover:text-brand transition-colors">
                    <CheckCircle size={18} aria-hidden="true" className="text-brand shrink-0" />
                    <span className="text-sm font-medium">{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((g, i) => (
              <div key={g.name} className={`bg-slate-800 aspect-square overflow-hidden border border-slate-700 ${i === 1 ? "mt-6" : ""} ${i === 2 ? "-mt-6" : ""}`}>
                <Img name={g.name} alt={g.alt} sizes="(min-width: 1024px) 25vw, 50vw" className="w-full h-full object-cover opacity-80" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-navy tracking-tight">Partner With Us</h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">Looking for a reliable cable supplier for your next project? Let&apos;s discuss your requirements.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href="/products"
              className="border-2 border-navy text-navy px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-navy hover:text-white transition-all"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
