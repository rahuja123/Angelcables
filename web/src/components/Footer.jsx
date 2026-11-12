import Link from "next/link";
import { Phone, Mail, MapPin, ArrowUpRight, Clock } from "lucide-react";
import { categories, blogs } from "@/data/catalog";
import { PHONES, EMAIL, ADDRESS, HOURS, MAPS_URL } from "@/lib/site";

const quickLinks = [
  { label: "All Products", path: "/products" },
  { label: "Product Catalog", path: "/catalog" },
  { label: "Wiring Guides", path: "/blog" },
  { label: "About Us", path: "/about" },
  { label: "Become a Dealer", path: "/dealers" },
  { label: "FAQ", path: "/faq" },
  { label: "Contact Us", path: "/contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white print:hidden">
      {/* CTA strip */}
      <div className="bg-brand">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">Need a Custom Cable Solution?</p>
            <p className="text-white/80 mt-1 text-sm md:text-base">Get in touch with our team for bulk orders & custom specs.</p>
          </div>
          <Link
            href="/contact"
            className="bg-white text-navy px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0 active:scale-95"
          >
            Request Quote <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-3 mb-6">
              <img src="/logo.webp" alt="" width={360} height={120} loading="lazy" className="h-8 w-auto shrink-0" />
              <span>
                <span className="text-xl font-black tracking-tight block font-display">ANGEL CABLES</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Since 2005</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              ISI-certified wire and cable manufacturer in Delhi. Trusted by contractors, builders, dealers and industries across India.
            </p>
          </div>

          {/* Product categories — every category page is linked from every page */}
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Products</p>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/products/${cat.slug}`} className="text-slate-300 hover:text-brand transition-colors text-sm">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links + guides */}
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link href={link.path} className="text-slate-300 hover:text-brand transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Contact</p>
            <address className="not-italic space-y-4">
              {PHONES.map((p) => (
                <a key={p.tel} href={`tel:${p.tel}`} className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm">
                  <Phone size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                  {p.display}
                </a>
              ))}
              <a href={`mailto:${EMAIL}`} className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm">
                <Mail size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {EMAIL}
              </a>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm">
                <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {ADDRESS.full}
              </a>
              <p className="flex items-start gap-3 text-slate-300 text-sm">
                <Clock size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
                {HOURS}
              </p>
            </address>
          </div>
        </div>

        {/* Guides row — gives every blog post a site-wide internal link */}
        <div className="mt-14 pt-8 border-t border-slate-800">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-4">Wiring Guides</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
            {blogs.map((b) => (
              <li key={b.slug}>
                <Link href={`/blog/${b.slug}`} className="text-slate-400 hover:text-brand transition-colors text-sm">
                  {b.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">© {new Date().getFullYear()} Angel Cables — R K Enterprises. All rights reserved.</p>
          <p className="text-slate-500 text-xs">Manufacturing excellence since 2005</p>
        </div>
      </div>
    </footer>
  );
}
