import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ChevronRight, Filter } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products`).then((r) => setProducts(r.data)).catch(console.error);
    axios.get(`${API}/products/categories`).then((r) => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    if (cat === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
    setMobileFilterOpen(false);
  };

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="bg-[#0F172A] py-12 md:py-16" data-testid="products-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Our Range</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="products-page-heading">
            Products
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Browse our complete range of wires and cables — from armoured cables for underground installations to flexible cables for everyday use.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Search + mobile filter */}
        <div className="flex gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="product-search-input"
              className="w-full pl-12 pr-4 py-3 border border-slate-200 bg-white text-sm focus:outline-none focus:border-[#EA580C] transition-colors"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600" data-testid="clear-search">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden border border-slate-200 px-4 py-3 text-sm font-bold flex items-center gap-2"
            data-testid="mobile-filter-toggle"
          >
            <Filter size={16} /> Filter
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block w-56 shrink-0" data-testid="category-sidebar">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-4">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => handleCategoryChange("All")}
                data-testid="category-filter-all"
                className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                  activeCategory === "All"
                    ? "bg-[#EA580C] text-white"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                All Products
                <span className="text-xs opacity-70">{products.length}</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    data-testid={`category-filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between ${
                      activeCategory === cat
                        ? "bg-[#EA580C] text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                    <span className="text-xs opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile filter dropdown */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden fixed inset-x-0 top-[64px] bg-white z-40 border-b border-slate-200 shadow-lg overflow-hidden"
                data-testid="mobile-filter-panel"
              >
                <div className="p-4 space-y-1">
                  <button
                    onClick={() => handleCategoryChange("All")}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold ${
                      activeCategory === "All" ? "bg-[#EA580C] text-white" : "text-slate-600"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full text-left px-4 py-3 text-sm font-semibold ${
                        activeCategory === cat ? "bg-[#EA580C] text-white" : "text-slate-600"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500" data-testid="product-count">
                Showing <span className="font-bold text-[#0F172A]">{filtered.length}</span> product{filtered.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && <> in <span className="font-bold text-[#EA580C]">{activeCategory}</span></>}
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="py-20 text-center" data-testid="no-products">
                <p className="text-slate-400 text-lg">No products found</p>
                <button
                  onClick={() => { setActiveCategory("All"); setSearchQuery(""); setSearchParams({}); }}
                  className="mt-4 text-[#EA580C] font-semibold text-sm underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      variants={fadeUp}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="bg-white border border-slate-200 overflow-hidden hover:border-[#EA580C] transition-colors group cursor-pointer"
                      onClick={() => setSelectedProduct(product)}
                      data-testid={`product-card-${product.id}`}
                    >
                      <div className="aspect-[4/3] bg-slate-50 overflow-hidden relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 text-[10px] font-mono uppercase tracking-wider border border-slate-200">
                          {product.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-[#0F172A] text-sm" style={{ fontFamily: "Chivo" }}>
                          {product.name}
                        </h3>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-2">{product.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {product.features.slice(0, 2).map((f) => (
                              <span key={f} className="text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50 px-2 py-0.5 border border-slate-100">
                                {f}
                              </span>
                            ))}
                          </div>
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-[#EA580C] transition-colors" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
            data-testid="product-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              data-testid="product-modal"
            >
              <div className="aspect-[16/9] bg-slate-50 overflow-hidden relative">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 hover:bg-white transition-colors"
                  data-testid="close-product-modal"
                >
                  <X size={20} />
                </button>
                <span className="absolute bottom-4 left-4 bg-[#EA580C] text-white px-4 py-1.5 text-xs font-mono uppercase tracking-wider">
                  {selectedProduct.category}
                </span>
              </div>
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="modal-product-name">
                  {selectedProduct.name}
                </h2>
                <p className="text-slate-500 mt-3 leading-relaxed text-sm">{selectedProduct.description}</p>

                {/* Specs */}
                {selectedProduct.specs && Object.keys(selectedProduct.specs).length > 0 && (
                  <div className="mt-6" data-testid="modal-specs">
                    <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-3">Specifications</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedProduct.specs).map(([key, val]) => (
                        <div key={key} className="bg-slate-50 p-3 border border-slate-100">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">{key}</span>
                          <span className="text-sm font-semibold text-[#0F172A] mt-0.5 block">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mt-6" data-testid="modal-features">
                  <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-3">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.features.map((f) => (
                      <span key={f} className="bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-slate-200">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={`https://wa.me/919873816127?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(selectedProduct.name)}.%20Please%20share%20pricing%20and%20availability.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="modal-whatsapp-enquiry"
                    className="bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors flex-1 text-center"
                  >
                    Enquire on WhatsApp
                  </a>
                  <a
                    href="tel:+919873816127"
                    data-testid="modal-call-btn"
                    className="border-2 border-[#0F172A] text-[#0F172A] px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-colors flex-1 text-center"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
