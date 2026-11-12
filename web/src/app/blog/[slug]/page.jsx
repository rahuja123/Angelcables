import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import { blogs, getBlog, categoriesForBlog, isoDate } from "@/data/catalog";
import { blogSeo } from "@/data/blog-seo";
import { pageMetadata, absoluteUrl, LEGAL_NAME, SITE_URL } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return {};
  const seo = blogSeo[post.slug] || { title: post.title, description: post.excerpt };
  const meta = pageMetadata({ title: seo.title, description: seo.description, path: `/blog/${post.slug}`, type: "article" });
  meta.openGraph.publishedTime = isoDate(post.date);
  return meta;
}

function Block({ block }) {
  switch (block.type) {
    case "p":
      return <p className="text-slate-600 leading-relaxed text-[15px] mb-4">{block.text}</p>;
    case "h2":
      return <h2 className="text-xl md:text-2xl font-black text-navy mt-10 mb-4 tracking-tight">{block.text}</h2>;
    case "h3":
      return <h3 className="text-lg font-black text-navy mt-6 mb-3 tracking-tight">{block.text}</h3>;
    case "ul":
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-slate-600 text-[15px]">
              <span className="mt-2 w-1.5 h-1.5 bg-brand rounded-full shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3 text-slate-600 text-[15px]">
              <span className="shrink-0 w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center mt-0.5" aria-hidden="true">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <div className="overflow-x-auto mb-6 border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy">
                {block.headers.map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={row.join("|")} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-slate-700 border-t border-slate-100">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <aside className={`border-l-4 ${block.variant === "warning" ? "border-l-orange-500 bg-orange-50" : "border-l-blue-500 bg-blue-50"} p-4 mb-6`}>
          <p className="text-sm leading-relaxed text-slate-700">{block.text}</p>
        </aside>
      );
    case "cta":
      return (
        <div className="my-10 bg-navy p-6 md:p-8">
          <p className="text-xl font-black text-white tracking-tight font-display">{block.heading}</p>
          <p className="text-slate-400 text-sm mt-2 mb-5">{block.text}</p>
          <Link
            href={block.buttonLink}
            className="inline-flex items-center gap-2 bg-brand text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-colors"
          >
            {block.buttonText} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      );
    default:
      return null;
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();

  const others = blogs.filter((b) => b.slug !== slug);
  const relatedCategories = categoriesForBlog(slug);
  const path = `/blog/${post.slug}`;
  const published = isoDate(post.date);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: `${SITE_URL}/og-logo.png`,
    datePublished: published,
    dateModified: published,
    author: { "@type": "Organization", name: LEGAL_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: LEGAL_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}/og-logo.png` } },
    mainEntityOfPage: absoluteUrl(path),
    url: absoluteUrl(path),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Breadcrumbs
        maxWidth="max-w-3xl"
        items={[
          { name: "Wiring Guides", path: "/blog" },
          { name: post.title, path },
        ]}
      />

      <div className="bg-navy py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-brand">{post.category}</p>
          <h1 className="text-2xl md:text-4xl font-black text-white mt-3 leading-tight tracking-tight">{post.title}</h1>
          <div className="mt-4 flex items-center gap-5 text-slate-400 text-xs font-mono">
            <time dateTime={published}>{post.date}</time>
            <span className="flex items-center gap-1.5">
              <Clock size={11} aria-hidden="true" /> {post.readTime}
            </span>
            <span>Angel Cables</span>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
        <p className="text-base md:text-lg text-slate-500 leading-relaxed border-l-4 border-brand pl-5 mb-8 italic">{post.excerpt}</p>
        {post.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}

        {relatedCategories.length > 0 && (
          <section className="mt-12 border border-slate-200 bg-surface p-6">
            <h2 className="text-lg font-black text-navy">Products Mentioned in This Guide</h2>
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedCategories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/products/${c.slug}`}
                    className="flex items-center justify-between gap-3 bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-navy hover:border-brand hover:text-brand transition-colors"
                  >
                    {c.name} <ArrowRight size={14} aria-hidden="true" className="text-brand shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <section className="max-w-3xl mx-auto px-4 md:px-8 pb-14">
        <div className="pt-8 border-t border-slate-200">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand transition-colors mb-8">
            <ArrowLeft size={14} aria-hidden="true" /> Back to all guides
          </Link>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-5">More Guides</h2>
          <div className="space-y-4">
            {others.map((o) => (
              <Link key={o.slug} href={`/blog/${o.slug}`} className="flex items-start justify-between gap-4 p-4 border border-slate-200 hover:border-brand transition-colors group">
                <span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand">{o.category}</span>
                  <span className="block text-sm font-bold text-navy mt-1 group-hover:text-brand transition-colors leading-snug font-display">{o.title}</span>
                </span>
                <ArrowRight size={16} aria-hidden="true" className="shrink-0 mt-1 text-slate-400 group-hover:text-brand transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
