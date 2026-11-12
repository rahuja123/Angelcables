import { categories, products, blogs, productPath, isoDate } from "@/data/catalog";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

// Bump when page content meaningfully changes (Google ignores lastmod that always says "now").
const SITE_UPDATED = "2026-11-11";

export default function sitemap() {
  const pages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
    { path: "/catalog", priority: 0.6, changeFrequency: "monthly" },
    { path: "/dealers", priority: 0.6, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  ].map((p) => ({ url: absoluteUrl(p.path), lastModified: SITE_UPDATED, changeFrequency: p.changeFrequency, priority: p.priority }));

  const categoryPages = categories.map((c) => ({
    url: absoluteUrl(`/products/${c.slug}`),
    lastModified: SITE_UPDATED,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const productPages = products.map((p) => ({
    url: absoluteUrl(productPath(p)),
    lastModified: SITE_UPDATED,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogPages = blogs.map((b) => ({
    url: absoluteUrl(`/blog/${b.slug}`),
    lastModified: isoDate(b.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...pages, ...categoryPages, ...productPages, ...blogPages];
}
