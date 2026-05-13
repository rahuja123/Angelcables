import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";

const LOGO = "/logo.png";

const categories = [
  "Armoured Cable",
  "Electric House Wire",
  "Flexible Cable",
  "CCTV Cables",
  "Submersible Cable",
  "Copper Wire",
  "CAT6 & LAN Cables",
  "Telephone & Communication Cable",
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white" data-testid="footer">
      {/* CTA Strip */}
      <div className="bg-[#EA580C]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white" style={{ fontFamily: 'Chivo' }}>
              Need a Custom Cable Solution?
            </h3>
            <p className="text-white/80 mt-1 text-sm md:text-base">Get in touch with our engineering team for bulk orders & custom specs.</p>
          </div>
          <Link
            to="/contact"
            data-testid="footer-cta-button"
            className="bg-white text-[#0F172A] px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-slate-100 transition-colors flex items-center gap-2 shrink-0 active:scale-95"
          >
            Request Quote <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6" data-testid="footer-logo">
              <img src={LOGO} alt="Angel Cables" className="h-8 w-auto object-contain shrink-0" />
              <div>
                <span className="text-xl font-black tracking-tight block" style={{ fontFamily: 'Chivo' }}>ANGEL CABLES</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">Since 2005</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Leading manufacturer of high-quality wires & cables in Delhi. Trusted by contractors, builders, and industries across India.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6" data-testid="footer-products-heading">Products</h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-slate-300 hover:text-[#EA580C] transition-colors text-sm"
                    data-testid={`footer-product-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "All Products", path: "/products" },
                { label: "Product Catalog", path: "/catalog" },
                { label: "Wiring Guides", path: "/blog" },
                { label: "About Us", path: "/about" },
                { label: "Become a Dealer", path: "/dealers" },
                { label: "FAQ", path: "/faq" },
                { label: "Contact Us", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-300 hover:text-[#EA580C] transition-colors text-sm"
                    data-testid={`footer-link-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-6">Contact</h4>
            <div className="space-y-4">
              <a href="tel:+919810011248" className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm" data-testid="footer-phone-1">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#EA580C]" />
                +91 9810011248
              </a>
              <a href="tel:+919873816127" className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm" data-testid="footer-phone-2">
                <Phone size={16} className="mt-0.5 shrink-0 text-[#EA580C]" />
                +91 9873816127
              </a>
              <a href="mailto:info@angelcables.com" className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors text-sm" data-testid="footer-email">
                <Mail size={16} className="mt-0.5 shrink-0 text-[#EA580C]" />
                info@angelcables.com
              </a>
              <div className="flex items-start gap-3 text-slate-300 text-sm" data-testid="footer-address">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#EA580C]" />
                B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs" data-testid="footer-copyright">
            &copy; {new Date().getFullYear()} Angel Cables — R K Enterprises. All rights reserved.
          </p>
          <p className="text-slate-500 text-xs">
            Manufacturing excellence since 2005
          </p>
        </div>
      </div>
    </footer>
  );
}
