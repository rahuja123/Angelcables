import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import { blogs } from "@/data/blogs";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" },
  }),
};

export default function BlogPage() {
  return (
    <div>
      <Helmet>
        <title>Wiring Guides & Cable Tips | Angel Cables Blog | Delhi</title>
        <meta name="description" content="Expert guides on electrical wiring for Indian homes — AC wire sizing, FR vs FRLS wire, armoured cables and more. From Angel Cables, ISI-certified manufacturer in Delhi." />
        <meta name="keywords" content="electrical wiring guide India, AC wire size India, FR FRLS wire difference, house wiring guide Delhi, cable buying guide India" />
        <link rel="canonical" href="https://angelcables.com/blog" />
        <meta property="og:title" content="Wiring Guides & Cable Tips | Angel Cables Blog" />
        <meta property="og:description" content="Expert guides on electrical wiring for Indian homes from Angel Cables — ISI-certified manufacturer in Delhi since 2005." />
        <meta property="og:url" content="https://angelcables.com/blog" />
        <meta property="og:image" content="https://angelcables.com/logo.png" />
      </Helmet>

      {/* Header */}
      <div className="bg-[#0F172A] py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Knowledge Base</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
            Wiring Guides
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Practical guides on cables, wiring and electrical safety for contractors, builders and homeowners across India.
          </p>
        </div>
      </div>

      {/* Blog grid */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post, i) => (
            <motion.article
              key={post.id}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group border border-slate-200 bg-white hover:border-[#EA580C] transition-colors duration-200 flex flex-col"
            >
              {/* Category + read time bar */}
              <div className="bg-[#F8FAFC] border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#EA580C]">{post.category}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <Clock size={10} /> {post.readTime}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-mono text-slate-400 mb-3">{post.date}</p>
                <h2 className="text-lg font-black text-[#0F172A] leading-snug tracking-tight group-hover:text-[#EA580C] transition-colors" style={{ fontFamily: "Chivo" }}>
                  {post.title}
                </h2>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed flex-1">
                  {post.excerpt}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#EA580C] hover:gap-3 transition-all"
                >
                  Read Guide <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-[#0F172A] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <BookOpen size={32} className="text-[#EA580C] shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "Chivo" }}>Have a specific wiring question?</h3>
              <p className="text-slate-400 text-sm mt-1">Our team in Delhi is happy to advise on wire sizing, specifications and bulk supply.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-colors flex items-center gap-2 shrink-0"
          >
            Ask Our Team <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
