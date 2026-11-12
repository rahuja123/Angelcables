import Link from "next/link";
import { ChevronRight } from "lucide-react";
import JsonLd from "./JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";

/** Visible breadcrumb trail + matching BreadcrumbList schema.
 *  items: [{ name, path }] — the last item is the current page. */
export default function Breadcrumbs({ items, maxWidth = "max-w-7xl" }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <div className="bg-surface border-b border-slate-200">
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <nav aria-label="Breadcrumb" className={`${maxWidth} mx-auto px-4 md:px-8 py-3`}>
        {/* Single line on every screen size, so late font swaps can never change its height (CLS). */}
        <ol className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider whitespace-nowrap overflow-hidden">
          {trail.map((item, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={item.path} className={`flex items-center gap-2 ${last ? "min-w-0" : "shrink-0"}`}>
                {i > 0 && <ChevronRight size={12} aria-hidden="true" className="shrink-0" />}
                {last ? (
                  <span aria-current="page" className="text-navy font-semibold truncate">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="hover:text-brand transition-colors">
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
