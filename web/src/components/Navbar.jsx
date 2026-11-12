"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { PHONES } from "@/lib/site";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const resourceLinks = [
  { label: "Wiring Guides", path: "/blog" },
  { label: "Become a Dealer", path: "/dealers" },
  { label: "FAQ", path: "/faq" },
  { label: "Product Catalog", path: "/catalog" },
];

function isActive(pathname, path) {
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setResourcesOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const resourceActive = resourceLinks.some((l) => isActive(pathname, l.path));

  return (
    <header className="print:hidden">
      {/* Top bar */}
      <div className="bg-navy text-white text-xs py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-mono tracking-wider opacity-70">A Unit of R K Enterprises</span>
          <div className="flex items-center gap-4">
            {PHONES.map((p, i) => (
              <span key={p.tel} className="flex items-center gap-4">
                {i > 0 && <span className="opacity-30" aria-hidden="true">|</span>}
                <a href={`tel:${p.tel}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
                  <Phone size={12} aria-hidden="true" />
                  <span>{p.display}</span>
                </a>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        aria-label="Main"
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-lg border-b border-black/5 shadow-sm" : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3">
              <img src="/logo.webp" alt="" width={360} height={120} className="h-10 md:h-12 w-auto" />
              <span className="leading-none">
                <span className="text-lg md:text-xl font-black text-navy tracking-tight block font-display">ANGEL CABLES</span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hidden sm:block">Precision & Safety</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.path);
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    aria-current={active ? "page" : undefined}
                    className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                      active ? "text-brand" : "text-slate-600 hover:text-navy"
                    }`}
                  >
                    {link.label}
                    {active && <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand" />}
                  </Link>
                );
              })}

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((o) => !o)}
                  aria-expanded={resourcesOpen}
                  aria-haspopup="true"
                  className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                    resourceActive ? "text-brand" : "text-slate-600 hover:text-navy"
                  }`}
                >
                  More
                  <ChevronDown size={14} aria-hidden="true" className={`transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
                </button>
                {resourcesOpen && (
                  <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 shadow-lg z-50">
                    {resourceLinks.map((link) => (
                      <Link
                        key={link.path}
                        href={link.path}
                        className={`block px-5 py-3 text-sm font-semibold transition-colors border-b border-slate-100 last:border-b-0 ${
                          isActive(pathname, link.path) ? "text-brand bg-orange-50" : "text-slate-600 hover:text-brand hover:bg-slate-50"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/contact"
                className="ml-4 bg-brand text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-orange-700 transition-all active:scale-95"
              >
                Get Quote
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 text-slate-700"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-slate-100">
            <div className="px-4 py-4 space-y-1">
              {[...navLinks, ...resourceLinks].map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wider ${
                    isActive(pathname, link.path) ? "text-brand bg-orange-50" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href={`tel:${PHONES[0].tel}`} className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-600">
                <Phone size={14} aria-hidden="true" /> {PHONES[0].display}
              </a>
              <Link href="/contact" className="block mt-2 bg-brand text-white text-center px-6 py-3 text-sm font-bold uppercase tracking-wide">
                Get Quote
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
