import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
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

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    phones: [
      { value: "+91 9810011248", href: "tel:+919810011248" },
      { value: "+91 9873816127", href: "tel:+919873816127" },
    ],
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@angelcables.com",
    href: "mailto:info@angelcables.com",
  },
  {
    icon: MapPin,
    label: "Address",
    value: "B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035",
    href: "https://maps.google.com/?q=28.6775005,77.14972139999999",
  },
  {
    icon: Clock,
    label: "Business Hours",
    value: "Mon - Sun: 10:00 AM - 8:00 PM",
    href: null,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setStatus("sending");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or contact us directly.");
    }
  };

  return (
    <div>
      <Helmet>
        <title>Contact Angel Cables Delhi | Get Bulk Cable Quote | +91 9810011248</title>
        <meta name="description" content="Contact Angel Cables (R K Enterprises) for bulk wire & cable orders, product enquiries or dealer pricing. Call +91 9810011248 or visit us at B-70/32, DSIDC, Lawrence Road Industrial Area, Delhi-110035. We respond within 24 hours." />
        <meta name="keywords" content="contact cable manufacturer Delhi, cable supplier contact Delhi, bulk cable order Delhi, Angel Cables phone, R K Enterprises contact" />
        <link rel="canonical" href="https://angelcables.com/contact" />
        <meta property="og:title" content="Contact Angel Cables Delhi — Get a Bulk Quote" />
        <meta property="og:description" content="Call +91 9810011248 or message Angel Cables for bulk wire & cable orders, dealer pricing and product enquiries. Based in Delhi." />
        <meta property="og:url" content="https://angelcables.com/contact" />
        <meta property="og:image" content="https://angelcables.com/logo.png" />
      </Helmet>
      {/* Header */}
      <div className="bg-[#0F172A] py-12 md:py-16" data-testid="contact-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Get in Touch</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="contact-page-heading">
            Contact Us
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Have a requirement? Need pricing? We'd love to hear from you. Reach out and our team will respond within 24 hours.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2" data-testid="contact-info-section">
            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: "Chivo" }}>
              Our Details
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Visit our factory in Delhi or reach out via phone, email, or WhatsApp.
            </p>

            <div className="mt-8 space-y-6">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={item.label + i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className="flex items-start gap-4"
                  data-testid={`contact-info-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  <div className="w-10 h-10 bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                    <item.icon size={18} className="text-[#EA580C]" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400">{item.label}</span>
                    {item.phones ? (
                      <p className="text-sm font-semibold text-[#0F172A] mt-0.5">
                        {item.phones.map((p, idx) => (
                          <span key={p.href}>
                            <a href={p.href} className="hover:text-[#EA580C] transition-colors">{p.value}</a>
                            {idx < item.phones.length - 1 && <span className="text-slate-300 mx-2">|</span>}
                          </span>
                        ))}
                      </p>
                    ) : item.href ? (
                      <a href={item.href} target={item.label === "Address" ? "_blank" : undefined} rel="noopener noreferrer" className="block text-sm font-semibold text-[#0F172A] mt-0.5 hover:text-[#EA580C] transition-colors">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://api.whatsapp.com/send?phone=919873816127&text=Hi%2C%20I%20am%20interested%20in%20Angel%20Cables%20products.%20Please%20share%20details."
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-whatsapp-btn"
              className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors"
            >
              Chat on WhatsApp
            </a>

            {/* Map */}
            <div className="mt-8 aspect-[4/3] bg-slate-100 border border-slate-200 overflow-hidden" data-testid="contact-map">
              <iframe
                title="Angel Cables Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.2!2d77.1497!3d28.6775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDQwJzM5LjAiTiA3N8KwMDgnNTkuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(1.1)" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3" data-testid="contact-form-section">
            <div className="bg-[#F8FAFC] border border-slate-200 p-6 md:p-10">
              <h2 className="text-2xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: "Chivo" }}>
                Send us a Message
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Fill in the form below and we'll get back to you within 24 hours.
              </p>

              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-green-50 border border-green-200 text-center"
                  data-testid="contact-success-message"
                >
                  <CheckCircle size={40} className="text-green-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-green-800" style={{ fontFamily: "Chivo" }}>Thank You!</h3>
                  <p className="text-green-600 text-sm mt-1">Your message has been sent. We'll get back to you shortly.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-4 text-sm font-bold text-green-700 underline"
                    data-testid="send-another-message"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-6 space-y-5" data-testid="contact-form">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
                        Name <span className="text-[#EA580C]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        data-testid="contact-name-input"
                        className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
                        Email <span className="text-[#EA580C]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        data-testid="contact-email-input"
                        className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        data-testid="contact-phone-input"
                        className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        data-testid="contact-subject-input"
                        className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors"
                        placeholder="Product enquiry"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase tracking-[0.15em] text-slate-500 mb-1.5 block">
                      Message <span className="text-[#EA580C]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      data-testid="contact-message-input"
                      className="w-full px-4 py-3 bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#EA580C] transition-colors resize-none"
                      placeholder="Tell us about your requirements — product type, quantity, specifications..."
                    />
                  </div>

                  {status === "error" && (
                    <div className="flex items-center gap-2 text-red-600 text-sm" data-testid="contact-error-message">
                      <AlertCircle size={16} />
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    data-testid="contact-submit-btn"
                    className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {status === "sending" ? (
                      <>Sending...</>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
