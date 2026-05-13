import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Home, Package } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F8FAFC]">
      <Helmet>
        <title>404 — Page Not Found | Angel Cables</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="text-[120px] md:text-[160px] font-black text-slate-200 leading-none select-none" style={{ fontFamily: "Chivo" }}>
          404
        </div>
        <div className="-mt-6 md:-mt-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Page Not Found</span>
          <h1 className="text-2xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
            This page doesn't exist
          </h1>
          <p className="text-slate-500 mt-3 max-w-md mx-auto text-sm md:text-base">
            The page you're looking for may have been moved or the URL might be incorrect.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 bg-[#EA580C] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95"
            >
              <Home size={15} /> Go Home
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 border-2 border-[#0F172A] text-[#0F172A] px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-all"
            >
              <Package size={15} /> View Products
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
