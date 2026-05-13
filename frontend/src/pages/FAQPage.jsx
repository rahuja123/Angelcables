import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

const faqs = [
  {
    category: "Products & Quality",
    items: [
      {
        q: "Are Angel Cables products ISI certified?",
        a: "Yes. All our cables and wires are manufactured under strict quality control and carry ISI (Bureau of Indian Standards) certification. The ISI mark confirms that products meet the relevant Indian Standard specifications for safety and performance.",
      },
      {
        q: "How do I choose the right cable size for my project?",
        a: "Cable size depends on the current load, length of run, and the type of installation (underground, overhead, indoor). As a general guide: 1.5 sq.mm is suitable for lighting circuits, 2.5 sq.mm for power sockets, 4–6 sq.mm for air conditioners and heavy appliances, and 10 sq.mm+ for industrial loads. Contact us with your load requirements and we'll recommend the right specification.",
      },
      {
        q: "What is the difference between armoured and unarmoured cables?",
        a: "Armoured cables have a steel wire or tape armour layer that provides mechanical protection — they're designed for underground burial, outdoor runs, and industrial environments where the cable may be exposed to physical damage. Unarmoured (flexible) cables are for indoor use, control wiring, and applications where the cable is protected by conduit or trunking.",
      },
      {
        q: "What voltage rating do your cables support?",
        a: "Our standard armoured and house wire range is rated up to 1.1 kV (1100V), which covers all residential, commercial, and most industrial applications. For higher voltage requirements, please contact us to discuss your specifications.",
      },
    ],
  },
  {
    category: "Ordering & Delivery",
    items: [
      {
        q: "What is the minimum order quantity?",
        a: "There is no strict minimum order quantity for most products — we supply to both individual contractors and large industrial buyers. However, bulk orders (100m+ per product) receive better pricing. Contact us via WhatsApp or phone for a quote based on your quantity.",
      },
      {
        q: "Do you deliver outside Delhi?",
        a: "Yes. We supply across North India including Delhi NCR, Haryana, Rajasthan, UP, Punjab, and Himachal Pradesh. For other states, we can arrange transport through logistics partners. Delivery time and cost varies by location — contact us for details.",
      },
      {
        q: "How long does delivery take?",
        a: "For orders within Delhi NCR, we typically deliver within 1–3 business days. For other states, delivery is 3–7 business days depending on the location. Large custom orders may require additional lead time.",
      },
      {
        q: "Do you provide GST invoices?",
        a: "Yes, we are GST registered and provide proper tax invoices with HSN codes for all orders. This makes procurement straightforward for contractors, businesses, and project managers who need proper documentation for input tax credit.",
      },
    ],
  },
  {
    category: "Dealership & Bulk",
    items: [
      {
        q: "How can I become an Angel Cables dealer or distributor?",
        a: "We welcome dealers and distributors across India. Fill in our Dealer Enquiry Form and our team will get back to you within 24 hours to discuss margins, territory, and onboarding. We offer competitive pricing, marketing support, and a dedicated relationship manager.",
      },
      {
        q: "Do you offer custom cable manufacturing?",
        a: "Yes. For large volume requirements (typically 500m+), we can manufacture cables to custom specifications — specific core counts, conductor sizes, insulation types, or sheathing colours. Contact our team with your technical requirements and we'll provide a quote.",
      },
    ],
  },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left"
      >
        <span className="text-sm font-bold text-[#0F172A] leading-snug" style={{ fontFamily: "Chivo" }}>{q}</span>
        <ChevronDown
          size={18}
          className={`text-[#EA580C] shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-slate-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { Helmet } from "react-helmet-async";

export default function FAQPage() {
  return (
    <div>
      <Helmet>
        <title>FAQ — Angel Cables Delhi | Cable & Wire Questions Answered</title>
        <meta name="description" content="Answers to frequently asked questions about Angel Cables products, ISI certification, ordering, delivery, bulk pricing and dealership. Cable manufacturer in Delhi since 2005." />
        <meta name="keywords" content="cable FAQ Delhi, ISI certified cable questions, armoured cable FAQ, house wire questions, cable manufacturer FAQ India" />
        <link rel="canonical" href="https://angelcables.com/faq" />
        <meta property="og:title" content="FAQ — Angel Cables Delhi | Wire & Cable Questions" />
        <meta property="og:description" content="Get quick answers about Angel Cables products, ISI certification, delivery, bulk orders and dealership programs." />
        <meta property="og:url" content="https://angelcables.com/faq" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.flatMap(cat => cat.items.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          })))
        })}</script>
      </Helmet>
      {/* Header */}
      <div className="bg-[#0F172A] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Help Center</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
            Frequently Asked
            <br />Questions
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Everything you need to know about our products, ordering, and dealership. Can't find your answer? Call or WhatsApp us.
          </p>
        </div>
      </div>

      {/* FAQ Sections */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">{section.category}</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              <div className="bg-white border border-slate-200 px-6">
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-16 bg-[#0F172A] p-8 md:p-10 text-center">
          <h3 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "Chivo" }}>Still have a question?</h3>
          <p className="text-slate-400 text-sm mt-2">Our team is available Mon–Sat, 10 AM to 8 PM.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://api.whatsapp.com/send?phone=919873816127&text=Hi%2C%20I%20have%20a%20question%20about%20Angel%20Cables."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              to="/contact"
              className="border border-white/30 text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              Contact Form <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
