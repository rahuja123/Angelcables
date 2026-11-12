import { img } from "@/data/catalog";

/**
 * Responsive WebP image with intrinsic width/height (prevents layout shift).
 * `priority` marks the page's main (LCP) image: eager load + high fetch priority.
 */
export default function Img({ name, alt, sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw", priority = false, className = "" }) {
  const { src, srcSet, width, height } = img(name);
  return (
    <img
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      width={width}
      height={height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : undefined}
      className={className}
    />
  );
}
