import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Printer, Download, ArrowLeft, CheckCircle, FileDown } from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const LOGO = "https://fplogoimages.withfloats.com/actual/68e49dcdc5794dccda71a861.png";

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/products`),
      axios.get(`${API}/products/categories`),
    ]).then(([p, c]) => {
      setProducts(p.data);
      setCategories(c.data);
      setLoading(false);
    });
  }, []);

  const grouped = categories.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat);
    return acc;
  }, {});

  return (
    <div>
      <Helmet>
        <title>Product Catalog — Angel Cables | Download PDF</title>
        <meta name="description" content="Download the Angel Cables product catalog as a PDF. Browse our complete range of electrical wires, house wiring cables, armoured cables and industrial cables with specifications." />
        <link rel="canonical" href="https://angelcables.com/catalog" />
        <meta property="og:title" content="Angel Cables Product Catalog — Download PDF" />
        <meta property="og:description" content="Full product catalog with specifications for all Angel Cables wire and cable products. Free PDF download." />
        <meta property="og:url" content="https://angelcables.com/catalog" />
      </Helmet>
      {/* Screen-only header */}
      <div className="bg-[#0F172A] py-10 print:hidden">
        <div className="max-w-5xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Downloads</span>
            <h1 className="text-3xl font-black text-white mt-1 tracking-tight" style={{ fontFamily: "Chivo" }}>
              Product Catalog
            </h1>
            <p className="text-slate-400 text-sm mt-1">Print or save as PDF — all products in one place.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/products" className="flex items-center gap-2 border border-slate-600 text-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-800 transition-colors">
              <ArrowLeft size={15} /> Products
            </Link>
            <a
              href={`${process.env.REACT_APP_BACKEND_URL}/api/catalog/pdf`}
              download="angel-cables-catalog-2025.pdf"
              className="flex items-center gap-2 bg-[#EA580C] text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-orange-700 transition-colors"
            >
              <FileDown size={15} /> Download PDF
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 border border-slate-600 text-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-800 transition-colors"
            >
              <Printer size={15} /> Print
            </button>
          </div>
        </div>
      </div>

      {/* Printable catalog body */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 print:py-0 print:px-0 print:max-w-none">

        {/* Print cover header */}
        <div className="hidden print:flex items-center justify-between border-b-2 border-[#EA580C] pb-6 mb-10">
          <div className="flex items-center gap-4">
            <img src={LOGO} alt="Angel Cables" className="h-14 w-auto" />
            <div>
              <div className="text-2xl font-black tracking-tight" style={{ fontFamily: "Chivo" }}>ANGEL CABLES</div>
              <div className="text-xs font-mono uppercase tracking-widest text-slate-500">A Unit of R K Enterprises · Est. 2005</div>
            </div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>B-70/32, DSIDC, Lawrence Road Industrial Area</div>
            <div>Delhi – 110035</div>
            <div className="mt-1 font-semibold">+91 9873816127 · angelcables.com</div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 print:hidden">Loading catalog…</div>
        ) : (
          <>
            {/* Summary stats - screen */}
            <div className="grid grid-cols-3 gap-4 mb-10 print:hidden">
              {[
                { value: `${products.length}+`, label: "Products" },
                { value: `${categories.length}`, label: "Categories" },
                { value: "ISI", label: "Certified" },
              ].map((s) => (
                <div key={s.label} className="bg-[#F8FAFC] border border-slate-200 p-5 text-center">
                  <div className="text-2xl font-black text-[#0F172A]" style={{ fontFamily: "Chivo" }}>{s.value}</div>
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Products by category */}
            {categories.map((cat) => (
              <div key={cat} className="mb-12 print:mb-8 print:break-inside-avoid">
                <div className="flex items-center gap-3 mb-5 print:mb-4">
                  <div className="h-px flex-1 bg-slate-200" />
                  <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C] px-2">{cat}</h2>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-4">
                  {grouped[cat]?.map((product) => (
                    <div key={product.id} className="border border-slate-200 overflow-hidden print:break-inside-avoid">
                      <div className="flex gap-4 p-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-20 h-20 object-cover border border-slate-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#0F172A] text-sm leading-tight" style={{ fontFamily: "Chivo" }}>
                            {product.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{product.description}</p>
                          {product.specs && Object.keys(product.specs).length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                              {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (
                                <span key={k} className="text-[10px] text-slate-500">
                                  <span className="font-semibold text-slate-600">{k}:</span> {v}
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {product.features.slice(0, 3).map((f) => (
                              <span key={f} className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50 px-1.5 py-0.5 border border-slate-100 print:border-slate-200">
                                <CheckCircle size={8} className="text-[#EA580C]" /> {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Print footer */}
            <div className="hidden print:block border-t border-slate-200 pt-6 mt-10 text-xs text-slate-400 flex justify-between">
              <span>© {new Date().getFullYear()} Angel Cables — R K Enterprises. All rights reserved.</span>
              <span>For enquiries: +91 9873816127 · angelcables.com</span>
            </div>
          </>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
