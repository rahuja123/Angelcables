import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Clock, ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { blogs } from "@/data/blogs";

function Block({ block }) {
  switch (block.type) {
    case "p":
      return <p className="text-slate-600 leading-relaxed text-[15px] mb-4">{block.text}</p>;

    case "h2":
      return <h2 className="text-xl md:text-2xl font-black text-[#0F172A] mt-10 mb-4 tracking-tight" style={{ fontFamily: "Chivo" }}>{block.text}</h2>;

    case "h3":
      return <h3 className="text-lg font-black text-[#0F172A] mt-6 mb-3 tracking-tight" style={{ fontFamily: "Chivo" }}>{block.text}</h3>;

    case "ul":
      return (
        <ul className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-slate-600 text-[15px]">
              <span className="mt-2 w-1.5 h-1.5 bg-[#EA580C] rounded-full shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="mb-5 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-slate-600 text-[15px]">
              <span className="shrink-0 w-6 h-6 rounded-full bg-[#EA580C] text-white text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
      );

    case "table":
      return (
        <div className="overflow-x-auto mb-6 border border-slate-200 rounded-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0F172A]">
                {block.headers.map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-mono uppercase tracking-wider text-white">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-slate-700 border-t border-slate-100">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      const bgMap = { warning: "bg-orange-50 border-orange-200", info: "bg-blue-50 border-blue-200", tip: "bg-green-50 border-green-200" };
      return (
        <div className={`border-l-4 ${block.variant === "warning" ? "border-l-orange-500 bg-orange-50" : "border-l-blue-500 bg-blue-50"} p-4 mb-6 rounded-r`}>
          <p className="text-sm leading-relaxed text-slate-700">{block.text}</p>
        </div>
      );

    case "cta":
      return (
        <div className="my-10 bg-[#0F172A] p-6 md:p-8">
          <h3 className="text-xl font-black text-white tracking-tight" style={{ fontFamily: "Chivo" }}>{block.heading}</h3>
          <p className="text-slate-400 text-sm mt-2 mb-5">{block.text}</p>
          <Link
            to={block.buttonLink}
            className="inline-flex items-center gap-2 bg-[#EA580C] text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-orange-700 transition-colors"
          >
            {block.buttonText} <ArrowRight size={14} />
          </Link>
        </div>
      );

    default:
      return null;
  }
}

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = blogs.find((b) => b.slug === slug);

  const otherPosts = blogs.filter((b) => b.slug !== slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-black text-[#0F172A]" style={{ fontFamily: "Chivo" }}>Post not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-[#EA580C] font-bold hover:underline">← Back to Blog</Link>
      </div>
    );
  }

  const schemaArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": post.date,
    "author": {
      "@type": "Organization",
      "name": "Angel Cables — R K Enterprises",
      "url": "https://angelcables.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Angel Cables — R K Enterprises",
      "logo": { "@type": "ImageObject", "url": "https://angelcables.com/logo.png" }
    },
    "url": `https://angelcables.com/blog/${post.slug}`,
    "mainEntityOfPage": `https://angelcables.com/blog/${post.slug}`
  };

  return (
    <div>
      <Helmet>
        <title>{post.title} | Angel Cables Delhi</title>
        <meta name="description" content={post.excerpt} />
        <link rel="canonical" href={`https://angelcables.com/blog/${post.slug}`} />
        <meta property="og:title" content={`${post.title} | Angel Cables`} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://angelcables.com/blog/${post.slug}`} />
        <meta property="og:image" content="https://angelcables.com/logo.png" />
        <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://angelcables.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://angelcables.com/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://angelcables.com/blog/${post.slug}` }
          ]
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-[#F8FAFC] border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider flex-wrap">
            <Link to="/" className="hover:text-[#EA580C] transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:text-[#EA580C] transition-colors">Blog</Link>
            <ChevronRight size={12} />
            <span className="text-slate-400 truncate max-w-[200px]">{post.category}</span>
          </nav>
        </div>
      </div>

      {/* Article header */}
      <div className="bg-[#0F172A] py-10 md:py-16">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#EA580C]">{post.category}</span>
          <h1 className="text-2xl md:text-4xl font-black text-white mt-3 leading-tight tracking-tight" style={{ fontFamily: "Chivo" }}>
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-5 text-slate-400 text-xs font-mono">
            <span>{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={11} /> {post.readTime}</span>
            <span>Angel Cables</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-10 md:py-14">
        {/* Lead excerpt */}
        <p className="text-base md:text-lg text-slate-500 leading-relaxed border-l-4 border-[#EA580C] pl-5 mb-8 italic">
          {post.excerpt}
        </p>

        {/* Content blocks */}
        <div>
          {post.content.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>

        {/* Back + other posts */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#EA580C] transition-colors mb-8">
            <ArrowLeft size={14} /> Back to all guides
          </Link>

          {otherPosts.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 mb-5">More Guides</h3>
              <div className="space-y-4">
                {otherPosts.map((other) => (
                  <Link
                    key={other.slug}
                    to={`/blog/${other.slug}`}
                    className="flex items-start justify-between gap-4 p-4 border border-slate-200 hover:border-[#EA580C] transition-colors group"
                  >
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#EA580C]">{other.category}</span>
                      <p className="text-sm font-bold text-[#0F172A] mt-1 group-hover:text-[#EA580C] transition-colors leading-snug" style={{ fontFamily: "Chivo" }}>
                        {other.title}
                      </p>
                    </div>
                    <ArrowRight size={16} className="shrink-0 mt-1 text-slate-400 group-hover:text-[#EA580C] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
