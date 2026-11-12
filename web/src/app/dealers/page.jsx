import { TrendingUp, Users, Package, Headphones } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import { pageMetadata, PHONES } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Become a Cable Dealer or Distributor",
  description:
    "Become an Angel Cables dealer: factory-direct pricing on ISI-certified wires and cables, strong margins, marketing support and a dedicated manager.",
  path: "/dealers",
});

const benefits = [
  { icon: TrendingUp, title: "Competitive Margins", desc: "Attractive dealer margins with volume-based pricing tiers. The more you sell, the better your margin." },
  { icon: Package, title: "Direct from Factory", desc: "No middlemen. Get products directly from our Delhi manufacturing facility at factory prices." },
  { icon: Users, title: "Marketing Support", desc: "Branding materials, product brochures and co-marketing support to help grow your business." },
  { icon: Headphones, title: "Dedicated Support", desc: "A dedicated relationship manager for all your orders, logistics and technical queries." },
];

const fields = [
  { name: "name", label: "Your Name", required: true, half: true, placeholder: "Full name", autoComplete: "name" },
  { name: "company", label: "Company / Shop Name", required: true, half: true, placeholder: "Your business name", autoComplete: "organization" },
  { name: "phone", label: "Phone", type: "tel", required: true, half: true, placeholder: "+91 XXXXX XXXXX", autoComplete: "tel" },
  { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "your@email.com", autoComplete: "email" },
  { name: "city", label: "City / Location", required: true, placeholder: "City where you operate", autoComplete: "address-level2" },
  { name: "message", label: "Message (optional)", rows: 4, placeholder: "Tell us about your business, monthly cable requirements or any questions…" },
];

export default function DealersPage() {
  return (
    <>
      <Breadcrumbs items={[{ name: "Become a Dealer", path: "/dealers" }]} />
      <PageHeader eyebrow="Partner with Us" title="Become an Angel Cables Dealer">
        <p>Join our growing network of distributors and dealers across India. Sell ISI-certified cables with strong margins and factory-direct pricing.</p>
      </PageHeader>

      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Why Partner with Us</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight mb-10">Dealer Benefits</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div key={b.title} className="bg-white border border-slate-200 p-7 hover:border-brand transition-colors">
                <b.icon size={28} aria-hidden="true" className="text-brand mb-4" />
                <h3 className="font-bold text-navy text-base">{b.title}</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">Apply Now</p>
            <h2 className="text-3xl md:text-4xl font-black text-navy mt-2 tracking-tight">Dealer Enquiry Form</h2>
            <p className="text-slate-500 mt-3 text-sm">Fill in your details and our team will get back to you within 24 hours.</p>
          </div>
          <div className="bg-surface border border-slate-200 p-6 md:p-10">
            <EnquiryForm
              endpoint="dealer-enquiry"
              fields={fields}
              submitLabel="Submit Enquiry"
              successTitle="Enquiry received!"
              successText="Our team will contact you within 24 hours to discuss the dealership opportunity."
              errorText={`Something went wrong. Please call us directly at ${PHONES[1].display}.`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
