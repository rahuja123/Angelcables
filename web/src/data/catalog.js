import { products } from "./products";
import { categories, getCategory } from "./categories";
import { blogs } from "./blogs";
import imageSizes from "./image-sizes.json";

export { products, categories, blogs };

export function productPath(p) {
  return `/products/${p.categorySlug}/${p.slug}`;
}

export function getProduct(categorySlug, slug) {
  return products.find((p) => p.categorySlug === categorySlug && p.slug === slug);
}

export function productsInCategory(categorySlug) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getBlog(slug) {
  return blogs.find((b) => b.slug === slug);
}

/** Categories a blog post is relevant to (reverse of category.relatedBlogs). */
export function categoriesForBlog(slug) {
  return categories.filter((c) => c.relatedBlogs.includes(slug));
}

/** Guides relevant to a product's category. */
export function blogsForCategory(categorySlug) {
  const cat = getCategory(categorySlug);
  return (cat?.relatedBlogs || []).map(getBlog).filter(Boolean);
}

/** Image src/srcset/size info for a local WebP image name. */
export function img(name) {
  const size = imageSizes[name] || { width: 1000, height: 750 };
  return {
    src: `/images/${name}.webp`,
    srcSet: `/images/${name}-480.webp 480w, /images/${name}.webp ${size.width}w`,
    width: size.width,
    height: size.height,
  };
}

// Blog dates in blogs.js are human strings ("May 12, 2025"); schema needs ISO.
export function isoDate(human) {
  const d = new Date(`${human} 12:00:00 GMT+0530`);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}
