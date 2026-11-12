import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import FaqList from "@/components/FaqList";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, faqJsonLd, whatsappLink, HOURS } from "@/lib/site";

export const metadata = pageMetadata({
  title: "FAQ — Cable & Wire Questions Answered",
  description:
    "Answers on ISI certification, cable sizing, armoured vs flexible cable, delivery across North India, GST invoices, bulk orders and dealership.",
  path: "/faq",
});

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

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(faqs.flatMap((s) => s.items))} />
      <Breadcrumbs items={[{ name: "FAQ", path: "/faq" }]} />
      <PageHeader eyebrow="Help Center" title="Frequently Asked Questions">
        <p>Everything you need to know about our products, ordering and dealership. Can&apos;t find your answer? Call or WhatsApp us.</p>
      </PageHeader>

      <section className="max-w-3xl mx-auto px-4 md:px-8 py-14 md:py-20">
        <div className="space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-brand">{section.category}</h2>
                <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              </div>
              <FaqList items={section.items} />
            </div>
          ))}
        </div>

        <div className="mt-16 bg-navy p-8 md:p-10 text-center">
          <h2 className="text-xl font-black text-white tracking-tight">Still have a question?</h2>
          <p className="text-slate-400 text-sm mt-2">Our team is available {HOURS}.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink("Hi, I have a question about Angel Cables.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors"
            >
              WhatsApp Us
            </a>
            <Link
              href="/contact"
              className="border border-white/30 text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-white/10 transition-colors inline-flex items-center gap-2"
            >
              Contact Form <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
