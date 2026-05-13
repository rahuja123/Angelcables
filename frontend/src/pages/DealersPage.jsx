import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Send, TrendingUp, Users, Package, Headphones } from "lucide-react";
import { Helmet } from "react-helmet-async";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const benefits = [
  {
    icon: TrendingUp,
    title: "Competitive Margins",
    desc: "Attractive dealer margins with volume-based pricing tiers. The more you sell, the better your margin.",
  },
  {
    icon: Package,
    title: "Direct from Factory",
    desc: "No middlemen. Get products directly from our Delhi manufacturing facility at factory prices.",
  },
  {
    icon: Users,
    title: "Marketing Support",
    desc: "We provide branding materials, product brochures, and co-marketing support to help grow your business.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A dedicated relationship manager for all your orders, logistics, and technical queries.",
  },
];

export default function DealersPage() {
  const [form, setForm] = useState({ name: "", company: "", phone: "", email: "", city: "", message: "" });
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.company || !form.phone || !form.email || !form.city) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStatus("sending");
    try {
      await axios.post(`${API}/dealer-enquiry`, form);
      setStatus("success");
      setForm({ name: "", company: "", phone: "", email: "", city: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please call us directly at +91 9873816127.");
    }
  };

  return (
    <div>
      <Helmet>
        <title>Become a Dealer — Angel Cables | Dealership Enquiry</title>
        <meta name="description" content="Join the Angel Cables dealer network. Competitive margins, direct-from-factory pricing, marketing support and a dedicated relationship manager. Apply online today." />
        <link rel="canonical" href="https://angelcables.com/dealers" />
        <meta property="og:title" content="Become an Angel Cables Dealer — Apply Today" />
        <meta property="og:description" content="Grow your business with Angel Cables dealership. Competitive margins, pan-India logistics and full marketing support." />
        <meta property="og:url" content="https://angelcables.com/dealers" />
      </Helmet>
      {/* Header */}
      <div className="bg-[#0F172A] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Partner with Us</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
            Become a Dealer
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Join our growing network of distributors and dealers across India. Sell premium cables with strong margins and factory-direct pricing.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-10">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Why Partner with Us</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
              Dealer Benefits
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white border border-slate-200 p-7 hover:border-[#EA580C] transition-colors"
              >
                <b.icon size={28} className="text-[#EA580C] mb-4" />
                <h3 className="font-bold text-[#0F172A] text-base" style={{ fontFamily: "Chivo" }}>{b.title}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enquiry Form */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="mb-10 text-center">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Apply Now</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
              Dealer Enquiry Form
            </h2>
            <p className="text-slate-500 mt-3 text-sm">Fill in your details and our team will get back to you within 24 hours.</p>
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 p-6 md:p-10">
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-10 text-center"
              >
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "Chivo" }}>Enquiry Received!</h3>
                <p className="text-slate-500 text-sm mt-2">Our team will contact you within 24 hours to discuss the dealership opportunity.</p>
                <button
                  onClick={() => setStatus(null)}
                  className="mt-6 text-sm font-bold text-[#EA580C] underline"
                >
                  Submit another enquiry
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">Your Name <span className="text-[#EA580C]">*</span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Full name"
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">Company / Shop Name <span className="text-[#EA580C]">*</span></label>
                    <input type="text" name="company" value={form.company} onChange={handleChange} required placeholder="Your business name"
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">Phone <span className="text-[#EA580C]">*</span></label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 XXXXX XXXXX"
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">Email <span className="text-[#EA580C]">*</span></label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="your@email.com"
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">City / Location <span className="text-[#EA580C]">*</span></label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required placeholder="City where you operate"
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors" />
                </div>

                <div>
                  <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">Message (Optional)</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    placeholder="Tell us about your current business, monthly cable requirements, or any questions…"
                    className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors resize-none" />
                </div>

                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                <button type="submit" disabled={status === "sending"}
                  className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60 inline-flex items-center gap-2">
                  {status === "sending" ? "Sending…" : <><Send size={15} /> Submit Enquiry</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
