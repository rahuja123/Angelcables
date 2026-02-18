import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Zap, Award, Factory, ChevronRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const stats = [
  { value: "19+", label: "Years Experience" },
  { value: "500+", label: "Happy Clients" },
  { value: "12+", label: "Product Lines" },
  { value: "Delhi", label: "Based in India" },
];

const whyChoose = [
  {
    icon: Shield,
    title: "ISI Certified Quality",
    desc: "All products manufactured under strict quality control and certified to Indian standards.",
  },
  {
    icon: Zap,
    title: "Superior Conductivity",
    desc: "Pure copper and premium aluminium conductors ensure maximum efficiency and safety.",
  },
  {
    icon: Award,
    title: "Trusted Since 2005",
    desc: "Two decades of trust built with contractors, builders, and industries across India.",
  },
  {
    icon: Factory,
    title: "Direct from Factory",
    desc: "Manufactured at our Delhi facility — competitive pricing with no middlemen.",
  },
];

const categoryImages = {
  "Armoured Cable": "https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg",
  "Flexible Cable": "https://productimages.withfloats.com/actual/68e4a0060b69274f568853d8.jpg",
  "Electric House Wire": "https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png",
  "CCTV Cables": "https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png",
  "Copper Wire": "https://productimages.withfloats.com/actual/68e49a12b575d00c5aa771b6.jpg",
  "Submersible Cable": "https://fpimages.withfloats.com/actual/68e60002327a323aaf2eb218.png",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products`).then((r) => setProducts(r.data)).catch(console.error);
    axios.get(`${API}/products/categories`).then((r) => setCategories(r.data)).catch(console.error);
  }, []);

  const featured = products.slice(0, 6);

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-[#0F172A] overflow-hidden" data-testid="hero-section">
        {/* Geometric accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#EA580C] opacity-5 skew-x-[-12deg] translate-x-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#EA580C] opacity-10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C] mb-6" data-testid="hero-label">
                  Wires & Cables Manufacturer — Delhi
                </span>
                <h1
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[0.95]"
                  style={{ fontFamily: "Chivo" }}
                  data-testid="hero-heading"
                >
                  Powering India
                  <br />
                  with{" "}
                  <span className="text-[#EA580C]">Precision</span>
                  <br />
                  & Safety
                </h1>
                <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed max-w-lg" data-testid="hero-description">
                  Angel Cables manufactures premium quality armoured cables, house wires, flexible cables, and CCTV cables — trusted by contractors and industries since 2005.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to="/products"
                    data-testid="hero-cta-products"
                    className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
                  >
                    View Products <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    data-testid="hero-cta-contact"
                    className="border-2 border-white/30 text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-all"
                  >
                    Get a Quote
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Hero image grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-3"
              data-testid="hero-images"
            >
              <div className="space-y-3">
                <div className="bg-slate-800 aspect-[4/3] overflow-hidden border border-slate-700">
                  <img
                    src="https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg"
                    alt="Armoured Cable"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700">
                  <img
                    src="https://productimages.withfloats.com/actual/68e4a12956522870096e857a.png"
                    alt="House Wire"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700">
                  <img
                    src="https://productimages.withfloats.com/actual/68e49bf05c295f6c8beebf4e.jpg"
                    alt="3 Core Cable"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                </div>
                <div className="bg-slate-800 aspect-[4/3] overflow-hidden border border-slate-700">
                  <img
                    src="https://productimages.withfloats.com/actual/68e49f18993a511b693b1be0.png"
                    alt="CCTV Cables"
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS MARQUEE */}
      <section className="bg-white border-b border-slate-200" data-testid="stats-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-200">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="py-8 md:py-12 text-center"
              >
                <div className="text-3xl md:text-4xl font-black text-[#0F172A]" style={{ fontFamily: "Chivo" }} data-testid={`stat-value-${i}`}>
                  {stat.value}
                </div>
                <div className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 mt-2" data-testid={`stat-label-${i}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT CATEGORIES */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]" data-testid="categories-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Our Range</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="categories-heading">
                Product Categories
              </h2>
            </div>
            <Link
              to="/products"
              data-testid="view-all-products-link"
              className="mt-4 md:mt-0 text-sm font-bold uppercase tracking-wide text-[#EA580C] hover:text-orange-700 inline-flex items-center gap-1 transition-colors"
            >
              View All Products <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat)}`}
                  data-testid={`category-card-${cat.toLowerCase().replace(/\s/g, '-')}`}
                  className="group block relative bg-white border border-slate-200 overflow-hidden hover:border-[#EA580C] transition-colors"
                >
                  <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={categoryImages[cat] || "https://fplogoimages.withfloats.com/actual/68e49dcdc5794dccda71a861.png"}
                      alt={cat}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex items-center justify-between">
                    <h3 className="font-bold text-[#0F172A] text-sm uppercase tracking-wider" style={{ fontFamily: "Chivo" }}>
                      {cat}
                    </h3>
                    <ArrowRight size={16} className="text-slate-400 group-hover:text-[#EA580C] group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 md:py-24" data-testid="featured-products-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Featured</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="featured-heading">
              Popular Products
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((product, i) => (
              <motion.div
                key={product.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white border border-slate-200 overflow-hidden hover:border-[#EA580C] transition-colors group"
                data-testid={`featured-product-${i}`}
              >
                <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-slate-100 text-slate-700 px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-slate-200">
                    {product.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#0F172A] text-base" style={{ fontFamily: "Chivo" }}>
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-1 border border-slate-100">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/products"
              data-testid="see-all-products-btn"
              className="inline-flex items-center gap-2 border-2 border-[#0F172A] text-[#0F172A] px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-all"
            >
              See All Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 md:py-24 bg-[#0F172A]" data-testid="why-choose-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Why Angel Cables</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="why-heading">
              Built Different.
              <br />
              Built to Last.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChoose.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="border border-slate-700 p-8 hover:border-[#EA580C] transition-colors group"
                data-testid={`why-card-${i}`}
              >
                <item.icon size={28} className="text-[#EA580C] mb-4" />
                <h3 className="text-lg font-bold text-white" style={{ fontFamily: "Chivo" }}>{item.title}</h3>
                <p className="text-slate-400 text-sm mt-2 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-white" data-testid="cta-section">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="cta-heading">
            Ready to Power Your Project?
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto">
            Whether you need cables for a residential project or industrial setup, we have the right solution. Contact us for competitive pricing and fast delivery.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              data-testid="cta-contact-btn"
              className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
            <a
              href="tel:+919873816127"
              data-testid="cta-call-btn"
              className="border-2 border-[#0F172A] text-[#0F172A] px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-all"
            >
              Call Now: +91 9873816127
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
