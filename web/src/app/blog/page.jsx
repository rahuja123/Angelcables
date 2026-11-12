import Link from "next/link";
import { Clock, ArrowRight, BookOpen } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { blogs, isoDate } from "@/data/catalog";
import { pageMetadata, absoluteUrl } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Wiring Guides & Cable Buying Tips for India",
  description:
    "Practical wiring guides for India: AC wire size, FR vs FRLS, armoured and submersible cable, and safe house wiring — from Angel Cables, Delhi.",
  path: "/blog",
});

const blogJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Angel Cables Wiring Guides",
  url: absoluteUrl("/blog"),
  blogPost: blogs.map((b) => ({
    "@type": "BlogPosting",
    headline: b.title,
    url: absoluteUrl(`/blog/${b.slug}`),
    datePublished: isoDate(b.date),
  })),
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={blogJsonLd} />
      <Breadcrumbs items={[{ name: "Wiring Guides", path: "/blog" }]} maxWidth="max-w-5xl" />
      <PageHeader eyebrow="Knowledge Base" title="Wiring Guides" maxWidth="max-w-5xl">
        <p>Practical guides on cables, wiring and electrical safety for contractors, builders and homeowners across India.</p>
      </PageHeader>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs.map((post) => (
            <article key={post.slug} className="group border border-slate-200 bg-white hover:border-brand transition-colors duration-200 flex flex-col">
              <div className="bg-surface border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand">{post.category}</span>
                <span className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <Clock size={10} aria-hidden="true" /> {post.readTime}
                </span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <time dateTime={isoDate(post.date)} className="text-xs font-mono text-slate-400 mb-3">
                  {post.date}
                </time>
                <h2 className="text-lg font-black text-navy leading-snug tracking-tight group-hover:text-brand transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-500 text-sm mt-3 leading-relaxed flex-1">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand hover:gap-3 transition-all"
                >
                  Read Guide<span className="sr-only">: {post.title}</span> <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 bg-navy p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <BookOpen size={32} aria-hidden="true" className="text-brand shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Have a specific wiring question?</h2>
              <p className="text-slate-400 text-sm mt-1">Our team in Delhi is happy to advise on wire sizing, specifications and bulk supply.</p>
            </div>
          </div>
          <Link
            href="/contact"
            className="bg-brand text-white px-8 py-4 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-colors flex items-center gap-2 shrink-0"
          >
            Ask Our Team <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
