import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import EnquiryForm from "@/components/EnquiryForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata, localBusinessJsonLd, PHONES, EMAIL, ADDRESS, HOURS, MAPS_URL, whatsappLink } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact Us — Bulk Cable Quotes in Delhi",
  description:
    "Get a bulk wire & cable quote from Angel Cables, Delhi. Call +91 9810011248 or visit us at Lawrence Road Industrial Area. Open 7 days, 10 AM–8 PM.",
  path: "/contact",
});

const fields = [
  { name: "name", label: "Name", required: true, half: true, placeholder: "Your full name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", required: true, half: true, placeholder: "your@email.com", autoComplete: "email" },
  { name: "phone", label: "Phone", type: "tel", half: true, placeholder: "+91 XXXXX XXXXX", autoComplete: "tel" },
  { name: "subject", label: "Subject", half: true, placeholder: "Product enquiry" },
  { name: "message", label: "Message", required: true, rows: 5, placeholder: "Tell us about your requirements — product type, quantity, specifications…" },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
      <PageHeader eyebrow="Get in Touch" title="Contact Angel Cables">
        <p>Have a requirement? Need pricing? Reach out and our team will respond within 24 hours.</p>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-5 gap-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-navy tracking-tight">Our Details</h2>
          <p className="text-slate-500 text-sm mt-2">Visit our factory in Delhi or reach out via phone, email, or WhatsApp.</p>

          <address className="not-italic mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <span className="w-10 h-10 bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                <Phone size={18} aria-hidden="true" className="text-brand" />
              </span>
              <span>
                <span className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 block">Phone</span>
                <span className="text-sm font-semibold text-navy mt-0.5 block">
                  {PHONES.map((p, i) => (
                    <span key={p.tel}>
                      {i > 0 && <span className="text-slate-300 mx-2" aria-hidden="true">|</span>}
                      <a href={`tel:${p.tel}`} className="hover:text-brand transition-colors">{p.display}</a>
                    </span>
                  ))}
                </span>
              </span>
            </div>
            {[
              { icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
              { icon: MapPin, label: "Address", value: ADDRESS.full, href: MAPS_URL, external: true },
              { icon: Clock, label: "Business Hours", value: HOURS },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-4">
                <span className="w-10 h-10 bg-orange-50 flex items-center justify-center shrink-0 border border-orange-100">
                  <item.icon size={18} aria-hidden="true" className="text-brand" />
                </span>
                <span>
                  <span className="text-xs font-mono uppercase tracking-[0.15em] text-slate-400 block">{item.label}</span>
                  {item.href ? (
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="block text-sm font-semibold text-navy mt-0.5 hover:text-brand transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="block text-sm font-semibold text-navy mt-0.5">{item.value}</span>
                  )}
                </span>
              </div>
            ))}
          </address>

          <a
            href={whatsappLink("Hi, I am interested in Angel Cables products. Please share details.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-green-600 transition-colors"
          >
            Chat on WhatsApp
          </a>

          <div className="mt-8 aspect-[4/3] bg-slate-100 border border-slate-200 overflow-hidden">
            <iframe
              title="Map showing Angel Cables, Lawrence Road Industrial Area, Delhi"
              src="https://www.google.com/maps?q=28.6775005,77.14972139999999&z=15&output=embed"
              width="600"
              height="450"
              className="w-full h-full"
              style={{ border: 0, filter: "grayscale(1) contrast(1.1)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-surface border border-slate-200 p-6 md:p-10">
            <h2 className="text-2xl font-black text-navy tracking-tight">Send us a Message</h2>
            <p className="text-slate-500 text-sm mt-1">Fill in the form below and we&apos;ll get back to you within 24 hours.</p>
            <EnquiryForm
              endpoint="contact"
              fields={fields}
              submitLabel="Send Message"
              successTitle="Thank you!"
              successText="Your message has been sent. We'll get back to you shortly."
              errorText={`Something went wrong. Please call us at ${PHONES[0].display} or message us on WhatsApp.`}
            />
          </div>
        </div>
      </div>
    </>
  );
}
