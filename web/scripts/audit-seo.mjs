// Crawls the static build in ./out and checks the technical-SEO rules this
// site must satisfy. Exits non-zero if any error is found.  Usage: npm run audit:seo
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const OUT = path.join(process.cwd(), "out");
const SITE = "https://angelcables.com";
const NON_INDEXABLE = new Set(["/404", "/_not-found", "/admin"]);

const errors = [];
const warnings = [];
const err = (page, msg) => errors.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function urlPathFor(file) {
  let rel = path.relative(OUT, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (rel === "index") return "/";
  return `/${rel}`;
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"));
  return m ? decode(m[1]) : null;
}

const files = await walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith(".html"));
const staticFiles = new Set(files.map((f) => `/${path.relative(OUT, f).replace(/\\/g, "/")}`));
const pages = new Map(); // path -> { html, size }
for (const f of htmlFiles) {
  const html = await readFile(f, "utf8");
  pages.set(urlPathFor(f), { html, size: (await stat(f)).size });
}

const titles = new Map();
const descriptions = new Map();
const incoming = new Map([...pages.keys()].map((p) => [p, new Set()]));
let imgCount = 0;
let jsonLdCount = 0;
const schemaTypes = new Map();

for (const [page, { html }] of pages) {
  const indexable = !NON_INDEXABLE.has(page);

  // Headings
  const h1s = html.match(/<h1[\s>]/gi) || [];
  if (h1s.length !== 1) err(page, `expected exactly 1 <h1>, found ${h1s.length}`);

  // Title
  const titleTags = [...html.matchAll(/<title>([^<]*)<\/title>/gi)].map((m) => decode(m[1]));
  if (titleTags.length !== 1) err(page, `expected 1 <title>, found ${titleTags.length}`);
  const title = titleTags[0] || "";
  if (indexable) {
    if (title.length > 70) warn(page, `title is ${title.length} chars (may be truncated): "${title}"`);
    if (titles.has(title)) err(page, `duplicate title with ${titles.get(title)}`);
    titles.set(title, page);
  }

  // Meta tags
  const metas = [...html.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]);
  const descTags = metas.filter((t) => attr(t, "name") === "description");
  const robots = metas.filter((t) => attr(t, "name") === "robots").map((t) => attr(t, "content") || "");
  const ogUrl = metas.find((t) => attr(t, "property") === "og:url");
  if (indexable) {
    if (descTags.length !== 1) err(page, `expected 1 meta description, found ${descTags.length}`);
    const desc = descTags[0] ? attr(descTags[0], "content") : "";
    if (desc.length < 70 || desc.length > 160) warn(page, `meta description is ${desc.length} chars`);
    if (descriptions.has(desc)) err(page, `duplicate meta description with ${descriptions.get(desc)}`);
    descriptions.set(desc, page);
    if (robots.some((r) => /noindex/i.test(r))) err(page, "indexable page has noindex");
  } else if (!robots.some((r) => /noindex/i.test(r))) {
    err(page, "non-indexable page is missing noindex");
  }

  // Canonical
  const canonicals = [...html.matchAll(/<link\s[^>]*rel="canonical"[^>]*>/gi)].map((m) => attr(m[0], "href"));
  if (indexable) {
    const expected = page === "/" ? SITE : `${SITE}${page}`;
    if (canonicals.length !== 1) err(page, `expected 1 canonical, found ${canonicals.length}`);
    else if (canonicals[0] !== expected) err(page, `canonical ${canonicals[0]} != ${expected}`);
    if (!ogUrl || attr(ogUrl, "content") !== expected) err(page, "og:url missing or does not match canonical");
  }

  // Images: alt text + intrinsic size (CLS)
  for (const m of html.matchAll(/<img\s[^>]*>/gi)) {
    imgCount++;
    const tag = m[0];
    const alt = attr(tag, "alt");
    const src = attr(tag, "src") || "?";
    if (alt === null) err(page, `<img src=${src}> has no alt attribute`);
    if (!attr(tag, "width") || !attr(tag, "height")) err(page, `<img src=${src}> missing width/height`);
    if (src.startsWith("/") && !staticFiles.has(src)) err(page, `<img src=${src}> file does not exist`);
    if (src.startsWith("/") && !src.endsWith(".webp")) warn(page, `<img src=${src}> is not WebP`);
  }

  // Structured data
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    jsonLdCount++;
    try {
      const data = JSON.parse(m[1]);
      schemaTypes.set(data["@type"], (schemaTypes.get(data["@type"]) || 0) + 1);
    } catch (e) {
      err(page, `invalid JSON-LD: ${e.message}`);
    }
  }

  // Internal links
  for (const m of html.matchAll(/<a\s[^>]*href="([^"]+)"/gi)) {
    let href = decode(m[1]);
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || "/";
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    const target = href.split(/[?#]/)[0].replace(/\/$/, "") || "/";
    if (pages.has(target)) {
      if (target !== page) incoming.get(target).add(page);
    } else if (!staticFiles.has(target)) {
      err(page, `broken internal link -> ${href}`);
    }
  }
}

// Orphans: indexable pages that no other page links to
for (const [page, from] of incoming) {
  if (!NON_INDEXABLE.has(page) && page !== "/" && from.size === 0) err(page, "orphan page (no incoming internal links)");
}

// Sitemap parity
const sitemap = await readFile(path.join(OUT, "sitemap.xml"), "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
const indexablePages = [...pages.keys()].filter((p) => !NON_INDEXABLE.has(p));
for (const loc of locs) if (!pages.has(loc)) err("sitemap.xml", `lists ${loc} which does not exist`);
for (const p of indexablePages) if (!locs.includes(p)) err("sitemap.xml", `missing ${p}`);

// Report
const sizes = [...pages.values()].map((p) => p.size);
console.log(`Pages: ${pages.size} (${indexablePages.length} indexable) · sitemap URLs: ${locs.length}`);
console.log(`Images checked: ${imgCount} · JSON-LD blocks: ${jsonLdCount}`);
console.log(`Schema types: ${[...schemaTypes].map(([t, n]) => `${t}×${n}`).join(", ")}`);
console.log(`HTML size: min ${(Math.min(...sizes) / 1024).toFixed(0)}KB, max ${(Math.max(...sizes) / 1024).toFixed(0)}KB (uncompressed)`);
const minIncoming = Math.min(...indexablePages.filter((p) => p !== "/").map((p) => incoming.get(p).size));
console.log(`Fewest incoming internal links to any page: ${minIncoming}`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ${warnings.join("\n  ")}`);
if (errors.length) {
  console.log(`\n${errors.length} ERROR(S):\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("\n✓ All SEO checks passed");
