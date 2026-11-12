import Link from "next/link";
import { ArrowLeft, CheckCircle, FileDown } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import PrintButton from "@/components/PrintButton";
import Img from "@/components/Img";
import { products, categories, productsInCategory, productPath } from "@/data/catalog";
import { pageMetadata, API_URL, PHONES } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Product Catalog — Download PDF",
  description:
    "Angel Cables catalog: all 33 wires and cables with specs — armoured, house wire, flexible, CCTV, submersible, copper, CAT6 and telephone. Free PDF.",
  path: "/catalog",
});

export default function CatalogPage() {
  return (
    <>
      <div className="print:hidden">
        <Breadcrumbs items={[{ name: "Product Catalog", path: "/catalog" }]} maxWidth="max-w-5xl" />
      </div>
      <PageHeader
        eyebrow="Downloads"
        title="Product Catalog"
        maxWidth="max-w-5xl"
        aside={
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="flex items-center gap-2 border border-slate-600 text-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-800 transition-colors">
              <ArrowLeft size={15} aria-hidden="true" /> Products
            </Link>
            <a
              href={`${API_URL}/api/catalog/pdf`}
              className="flex items-center gap-2 bg-brand text-white px-5 py-2.5 text-sm font-bold uppercase tracking-wide hover:bg-orange-700 transition-colors"
            >
              <FileDown size={15} aria-hidden="true" /> Download PDF
            </a>
            <PrintButton />
          </div>
        }
      >
        <p>Print or save as PDF — every Angel Cables product and its specifications in one place.</p>
      </PageHeader>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 print:py-0 print:px-0 print:max-w-none">
        <div className="hidden print:flex items-center justify-between border-b-2 border-brand pb-6 mb-10">
          <div className="flex items-center gap-4">
            <img src="/logo.webp" alt="Angel Cables" width={360} height={120} className="h-14 w-auto" />
            <div className="text-xs font-mono uppercase tracking-widest text-slate-500">A Unit of R K Enterprises · Est. 2005</div>
          </div>
          <div className="text-right text-xs text-slate-500">
            <div>B-70/32, DSIDC, Lawrence Road Industrial Area</div>
            <div>Delhi – 110035</div>
            <div className="mt-1 font-semibold">{PHONES[1].display} · angelcables.com</div>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-4 mb-10 print:hidden">
          {[
            { value: `${products.length}`, label: "Products" },
            { value: `${categories.length}`, label: "Categories" },
            { value: "ISI", label: "Certified" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-slate-200 p-5 text-center flex flex-col-reverse">
              <dt className="text-xs font-mono uppercase tracking-wider text-slate-400 mt-1">{s.label}</dt>
              <dd className="text-2xl font-black text-navy font-display">{s.value}</dd>
            </div>
          ))}
        </dl>

        {categories.map((cat) => (
          <section key={cat.slug} className="mb-12 print:mb-8">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
              <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-brand px-2">
                <Link href={`/products/${cat.slug}`} className="hover:underline">
                  {cat.name}
                </Link>
              </h2>
              <span className="h-px flex-1 bg-slate-200" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-4">
              {productsInCategory(cat.slug).map((p) => (
                <div key={p.slug} className="border border-slate-200 flex gap-4 p-4 print:break-inside-avoid">
                  <Img name={p.image} alt={p.name} sizes="80px" className="w-20 h-20 object-cover border border-slate-100 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-navy text-sm leading-tight">
                      <Link href={productPath(p)} className="hover:text-brand">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 line-clamp-2">{p.description}</p>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
                      {Object.entries(p.specs)
                        .slice(0, 3)
                        .map(([k, v]) => (
                          <span key={k}>
                            <span className="font-semibold text-slate-600">{k.replace(/_/g, " ")}:</span> {v}
                          </span>
                        ))}
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1">
                      {p.features.slice(0, 3).map((f) => (
                        <li key={f} className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-slate-500 bg-slate-50 px-1.5 py-0.5 border border-slate-100">
                          <CheckCircle size={8} aria-hidden="true" className="text-brand" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <div className="hidden print:flex border-t border-slate-200 pt-6 mt-10 text-xs text-slate-400 justify-between">
          <span>© {new Date().getFullYear()} Angel Cables — R K Enterprises. All rights reserved.</span>
          <span>For enquiries: {PHONES[1].display} · angelcables.com</span>
        </div>
      </div>
    </>
  );
}
