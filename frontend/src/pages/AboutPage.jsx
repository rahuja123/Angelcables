import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Users, Factory, Award, ArrowRight, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const timeline = [
  { year: "2005", title: "Founded", desc: "R K Enterprises established in Lawrence Road Industrial Area, Delhi." },
  { year: "2008", title: "Expansion", desc: "Expanded product range to include armoured cables and flexible cables." },
  { year: "2012", title: "Angel Cables Brand", desc: "Launched the Angel Cables brand for our premium wire and cable product line." },
  { year: "2018", title: "Industry Growth", desc: "Became a trusted supplier for major contractors and industrial projects across North India." },
  { year: "2024", title: "Digital Presence", desc: "Expanded our reach with digital platforms to serve customers across India." },
];

const capabilities = [
  "Armoured Cables (Aluminium & Copper)",
  "Multi-Core Flexible Control Cables",
  "Single & Multi-Strand House Wires",
  "CCTV & Security Cables",
  "Submersible Pump Cables",
  "Custom Cable Solutions",
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <div className="bg-[#0F172A] py-12 md:py-16" data-testid="about-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Our Story</span>
          <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }} data-testid="about-page-heading">
            About Angel Cables
          </h1>
          <p className="text-slate-400 mt-3 max-w-xl text-sm md:text-base">
            Two decades of manufacturing excellence in wires and cables — trusted by thousands across India.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-16 md:py-24" data-testid="about-story">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Est. 2005</span>
              <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
                A Legacy of Trust
                <br />
                & Quality
              </h2>
              <p className="text-slate-500 mt-6 leading-relaxed">
                Angel Cables, a unit of R K Enterprises, has been manufacturing premium quality wires and cables since 2005. Based in the heart of Delhi's Lawrence Road Industrial Area, we have built a reputation for delivering products that meet the highest standards of safety and performance.
              </p>
              <p className="text-slate-500 mt-4 leading-relaxed">
                Our state-of-the-art manufacturing facility is equipped with modern machinery and stringent quality control processes. Every cable that leaves our factory undergoes rigorous testing to ensure it meets ISI standards and delivers reliable performance for years.
              </p>
              <p className="text-slate-500 mt-4 leading-relaxed">
                From residential house wiring to heavy-duty industrial armoured cables, we serve a diverse clientele of contractors, builders, electricians, and industrial buyers across North India.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/3] bg-slate-100 overflow-hidden border border-slate-200">
                <img
                  src="https://fpimages.withfloats.com/actual/68e49dda3902000b6a846742.png"
                  alt="Angel Cables Manufacturing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-[#EA580C] text-white p-6 hidden md:block">
                <div className="text-3xl font-black" style={{ fontFamily: "Chivo" }}>19+</div>
                <div className="text-xs font-mono uppercase tracking-wider mt-1">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-[#F8FAFC]" data-testid="about-values">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Our Values</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Quality First", desc: "Every product undergoes rigorous quality testing before dispatch. No compromises." },
              { icon: Users, title: "Customer Focus", desc: "We build long-term relationships. Your success is our success." },
              { icon: Factory, title: "Made in India", desc: "Proudly manufactured in Delhi with Indian raw materials and workforce." },
              { icon: Award, title: "Industry Standards", desc: "All products meet ISI standards and industry-grade specifications." },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white border border-slate-200 p-8 hover:border-[#EA580C] transition-colors"
                data-testid={`value-card-${i}`}
              >
                <value.icon size={28} className="text-[#EA580C] mb-4" />
                <h3 className="font-bold text-[#0F172A] text-lg" style={{ fontFamily: "Chivo" }}>{value.title}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24" data-testid="about-timeline">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="mb-12">
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
              Milestones
            </h2>
          </div>

          <div className="relative">
            {/* Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-slate-200" />

            <div className="space-y-8">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  className={`relative flex flex-col md:flex-row items-start gap-4 md:gap-8 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                  data-testid={`timeline-${item.year}`}
                >
                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-[#EA580C] -translate-x-1/2 mt-2 z-10" />

                  <div className={`ml-10 md:ml-0 md:w-1/2 ${i % 2 === 0 ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <span className="font-mono text-[#EA580C] text-sm font-bold">{item.year}</span>
                    <h3 className="font-bold text-[#0F172A] text-lg mt-1" style={{ fontFamily: "Chivo" }}>{item.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Capabilities */}
      <section className="py-16 md:py-24 bg-[#0F172A]" data-testid="about-capabilities">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">Capabilities</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-2 tracking-tight" style={{ fontFamily: "Chivo" }}>
                What We Manufacture
              </h2>
              <p className="text-slate-400 mt-4 leading-relaxed">
                Our Delhi facility is equipped to produce a comprehensive range of electrical wires and cables for every application.
              </p>
              <ul className="mt-8 space-y-4">
                {capabilities.map((cap) => (
                  <li key={cap} className="flex items-center gap-3 text-white">
                    <CheckCircle size={18} className="text-[#EA580C] shrink-0" />
                    <span className="text-sm font-medium">{cap}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700">
                <img
                  src="https://fpimages.withfloats.com/actual/68b915ab3266bc661dcc5cf9.jpg"
                  alt="Manufacturing"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700 mt-6">
                <img
                  src="https://fpimages.withfloats.com/actual/68b915aa6419ae333fe058c5.jpg"
                  alt="Products"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700 -mt-6">
                <img
                  src="https://fpimages.withfloats.com/actual/68e600010404a0aef863739c.jpg"
                  alt="Cables"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="bg-slate-800 aspect-square overflow-hidden border border-slate-700">
                <img
                  src="https://productimages.withfloats.com/actual/68e49c9aed06f3bbb445df55.jpg"
                  alt="Armoured Cable"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-white" data-testid="about-cta">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] tracking-tight" style={{ fontFamily: "Chivo" }}>
            Partner With Us
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto">
            Looking for a reliable cable supplier for your next project? Let's discuss your requirements.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              data-testid="about-cta-contact"
              className="bg-[#EA580C] text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-all active:scale-95 inline-flex items-center gap-2"
            >
              Contact Us <ArrowRight size={16} />
            </Link>
            <Link
              to="/products"
              data-testid="about-cta-products"
              className="border-2 border-[#0F172A] text-[#0F172A] px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-[#0F172A] hover:text-white transition-all"
            >
              View Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
