import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, CheckCircle, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-pulse">
      <div className="h-4 w-48 bg-slate-200 rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/3] bg-slate-200 rounded" />
        <div className="space-y-4">
          <div className="h-3 w-24 bg-slate-200 rounded" />
          <div className="h-10 w-3/4 bg-slate-200 rounded" />
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
          <div className="h-4 w-4/6 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    axios.get(`${API}/products/${id}`)
      .then((r) => {
        setProduct(r.data);
        return axios.get(`${API}/products?category=${encodeURIComponent(r.data.category)}`);
      })
      .then((r) => {
        setRelated(r.data.filter((p) => p.id !== id).slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (notFound) return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-32 text-center">
      <h1 className="text-3xl font-black text-[#0F172A]" style={{ fontFamily: "Chivo" }}>Product Not Found</h1>
      <p className="text-slate-500 mt-3">This product doesn't exist or may have been removed.</p>
      <Link to="/products" className="mt-6 inline-flex items-center gap-2 bg-[#EA580C] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all">
        <ArrowLeft size={16} /> Back to Products
      </Link>
    </div>
  );

  return (
    <div>
      <Helmet>
        <title>{product ? `${product.name} — Angel Cables` : "Product — Angel Cables"}</title>
        <meta name="description" content={product ? `${product.name} by Angel Cables. ${product.description?.slice(0, 120) || "ISI-marked quality wire and cable manufactured in Delhi."}` : "Product details — Angel Cables"} />
        {product && <link rel="canonical" href={`https://angelcables.com/products/${product.id}`} />}
        {product && <meta property="og:title" content={`${product.name} — Angel Cables`} />}
        {product && <meta property="og:description" content={product.description?.slice(0, 200) || "High-quality wire and cable from Angel Cables, Delhi."} />}
        {product && <meta property="og:url" content={`https://angelcables.com/products/${product.id}`} />}
        {product?.image_url && <meta property="og:image" content={product.image_url} />}
      </Helmet>
      {/* Breadcrumb */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider">
            <Link to="/" className="hover:text-[#EA580C] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-[#EA580C] transition-colors">Products</Link>
            <ChevronRight size={12} />
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#EA580C] transition-colors">{product.category}</Link>
            <ChevronRight size={12} />
            <span className="text-[#0F172A] font-semibold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Detail */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#EA580C] transition-colors mb-8 font-semibold">
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-slate-100 border border-slate-200 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute top-4 left-4 bg-[#EA580C] text-white px-4 py-1.5 text-xs font-mono uppercase tracking-wider">
              {product.category}
            </span>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">{product.category}</span>
            <h1 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight leading-tight" style={{ fontFamily: "Chivo" }}>
              {product.name}
            </h1>
            <p className="text-slate-500 mt-4 leading-relaxed">{product.description}</p>

            {/* Specs */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-[#F8FAFC] p-3 border border-slate-200">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">{key}</span>
                      <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {product.features?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-[#0F172A]">
                      <CheckCircle size={16} className="text-[#EA580C] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CTA */}
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`https://api.whatsapp.com/send?phone=919873816127&text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}.%20Please%20share%20pricing%20and%20availability.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] text-white px-6 py-4 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors text-center"
              >
                Enquire on WhatsApp
              </a>
              <a
                href="tel:+919873816127"
                className="flex-1 border-2 border-[#0F172A] text-[#0F172A] px-6 py-4 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Phone size={16} /> Call Now
              </a>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">Mon–Sat: 10:00 AM – 8:00 PM · +91 9873816127</p>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-[#F8FAFC] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">More in {product.category}</span>
            <h2 className="text-2xl md:text-3xl font-black text-[#0F172A] mt-2 tracking-tight mb-8" style={{ fontFamily: "Chivo" }}>
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="bg-white border border-slate-200 overflow-hidden hover:border-[#EA580C] transition-colors group"
                >
                  <div className="aspect-[4/3] bg-slate-100 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0F172A] text-sm" style={{ fontFamily: "Chivo" }}>{p.name}</h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{p.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
