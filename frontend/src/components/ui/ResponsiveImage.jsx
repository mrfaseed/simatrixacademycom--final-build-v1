import { forwardRef, useState } from "react";
import { cfImageUrl, cfSrcSet } from "../../lib/cloudflareImage";

/**
 * ResponsiveImage Component
 *
 * Automatically generates Cloudflare Image Transformation URLs and responsive srcSet.
 * Features:
 * - Next-gen format negotiation (WebP/AVIF via format=auto)
 * - Localhost dev fallback (never breaks in local Vite dev server)
 * - Graceful fallback on error
 * - Native async decoding and lazy loading by default
 *
 * Usage:
 * <ResponsiveImage
 *   src="/images/banner.webp"
 *   widths={[640, 750, 1080, 1350]}
 *   sizes="100vw"
 *   quality={85}
 *   alt="Banner"
 * />
 */
export const ResponsiveImage = forwardRef(function ResponsiveImage(
  {
    src,
    alt = "",
    widths = [360, 640, 768, 1024, 1280],
    sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw",
    quality = 85,
    format = "auto",
    fit = "cover",
    priority = false,
    fetchPriority,
    loading,
    decoding = "async",
    width,
    height,
    className = "",
    fallbackSrc,
    forceCloudflare = false,
    onError,
    ...props
  },
  ref
) {
  const [hasError, setHasError] = useState(false);

  if (!src) return null;

  const effectiveFetchPriority = fetchPriority || (priority ? "high" : "auto");
  const effectiveLoading = loading || (priority ? "eager" : "lazy");

  // If there was an error loading the Cloudflare transformed URL, fallback gracefully to raw src
  if (hasError) {
    return (
      <img
        ref={ref}
        src={fallbackSrc || src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={effectiveLoading}
        decoding={decoding}
        fetchPriority={effectiveFetchPriority}
        {...props}
      />
    );
  }

  // Calculate default single src width
  const defaultWidth = width || (widths && widths.length ? widths[Math.min(2, widths.length - 1)] : undefined);
  const transformedSrc = cfImageUrl(src, {
    width: defaultWidth,
    quality,
    format,
    fit,
    forceCloudflare,
  });

  const srcSetString = cfSrcSet(src, widths, {
    quality,
    format,
    fit,
    forceCloudflare,
  });

  return (
    <img
      ref={ref}
      src={transformedSrc}
      srcSet={srcSetString}
      sizes={srcSetString ? sizes : undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={effectiveLoading}
      decoding={decoding}
      fetchPriority={effectiveFetchPriority}
      onError={(e) => {
        setHasError(true);
        if (onError) onError(e);
      }}
      {...props}
    />
  );
});

export default ResponsiveImage;
