/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pre-render every page to static HTML at build time (served from Netlify's CDN).
  output: "export",
  // /about, not /about/ — matches canonical tags and the sitemap exactly.
  trailingSlash: false,
  // Images are pre-converted to WebP by scripts/fetch-images.mjs.
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
