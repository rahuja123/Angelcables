import { ChevronDown } from "lucide-react";

/** Accordion built on native <details>: zero JS, and every answer is in the HTML. */
export default function FaqList({ items, headingLevel = "h3" }) {
  const Heading = headingLevel;
  return (
    <div className="bg-white border border-slate-200 px-6">
      {items.map((item) => (
        <details key={item.q} className="border-b border-slate-200 last:border-b-0 group">
          <summary className="flex items-start justify-between gap-4 py-5 text-left">
            <Heading className="text-sm font-bold text-navy leading-snug">{item.q}</Heading>
            <ChevronDown size={18} aria-hidden="true" className="faq-chevron text-brand shrink-0 mt-0.5 transition-transform duration-200" />
          </summary>
          <p className="pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
