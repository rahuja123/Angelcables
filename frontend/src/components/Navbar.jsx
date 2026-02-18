import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOGO = "https://fplogoimages.withfloats.com/actual/68e49dcdc5794dccda71a861.png";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About Us", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  return (
    <>
      {/* Top bar */}
      <div className="bg-[#0F172A] text-white text-xs py-2 px-4 hidden md:block" data-testid="top-bar">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="font-mono tracking-wider opacity-70">A Unit of R K Enterprises</span>
          <a href="tel:+919873816127" className="flex items-center gap-2 hover:text-orange-400 transition-colors" data-testid="top-bar-phone">
            <Phone size={12} />
            <span>+91 9873816127</span>
          </a>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg border-b border-black/5 shadow-sm"
            : "bg-white border-b border-slate-100"
        }`}
        data-testid="main-navbar"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group" data-testid="logo-link">
              <img src={LOGO} alt="Angel Cables Logo" className="h-10 md:h-12 w-auto" />
              <div className="leading-none">
                <span className="text-lg md:text-xl font-black text-[#0F172A] tracking-tight block" style={{ fontFamily: 'Chivo' }}>
                  ANGEL CABLES
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 hidden sm:block">
                  Precision & Safety
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  data-testid={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                  className={`px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                    location.pathname === link.path
                      ? "text-[#EA580C]"
                      : "text-slate-600 hover:text-[#0F172A]"
                  }`}
                >
                  {link.label}
                  {location.pathname === link.path && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#EA580C]"
                    />
                  )}
                </Link>
              ))}
              <Link
                to="/contact"
                data-testid="nav-get-quote-btn"
                className="ml-4 bg-[#EA580C] text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-orange-700 transition-all active:scale-95"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-slate-700"
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden bg-white border-t border-slate-100"
              data-testid="mobile-menu"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                    className={`block px-4 py-3 text-sm font-semibold uppercase tracking-wider ${
                      location.pathname === link.path
                        ? "text-[#EA580C] bg-orange-50"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  data-testid="mobile-get-quote-btn"
                  className="block mt-2 bg-[#EA580C] text-white text-center px-6 py-3 text-sm font-bold uppercase tracking-wide"
                >
                  Get Quote
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
