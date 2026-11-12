import { Download } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import ProductBrowser from "@/components/ProductBrowser";
import JsonLd from "@/components/JsonLd";
import { products, categories, productPath } from "@/data/catalog";
import { pageMetadata, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Electrical Wires & Cables in Delhi — Full Product Range",
  description:
    "Browse 33 ISI-certified wires and cables from Angel Cables, Delhi: armoured, house wire, flexible, CCTV, submersible, copper, CAT6 and telephone cable.",
  path: "/products",
});

const itemListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Angel Cables product range",
  numberOfItems: products.length,
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.name,
    url: absoluteUrl(productPath(p)),
  })),
};

export default function ProductsPage() {
  // Pass only what the client component needs.
  const slim = products.map(({ slug, name, category, categorySlug, description, features, specs, image }) => ({
    slug, name, category, categorySlug, description, features, specs, image,
  }));
  const cats = categories.map(({ slug, name }) => ({ slug, name }));

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <Breadcrumbs items={[{ name: "Products", path: "/products" }]} />
      <PageHeader
        eyebrow="Our Range"
        title="Wires & Cables"
        aside={
          <a
            href="/angel-cables-catalog.pdf"
              download
            className="shrink-0 flex items-center gap-2 border border-slate-600 text-slate-300 px-5 py-2.5 text-sm font-bold hover:bg-slate-800 transition-colors uppercase tracking-wide"
          >
            <Download size={15} aria-hidden="true" /> Download Catalog (PDF)
          </a>
        }
      >
        <p>
          {products.length} ISI-certified products across {categories.length} categories — from armoured cables for underground power to FRLS
          house wire, CCTV and CAT6 network cable. All manufactured or supplied from our Delhi factory.
        </p>
      </PageHeader>
      <ProductBrowser products={slim} categories={cats} />
    </>
  );
}
