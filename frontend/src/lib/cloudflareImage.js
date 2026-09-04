/**
 * Cloudflare Image Transformation Utilities
 * Generates on-the-fly optimized responsive image URLs and srcSets.
 * Works seamlessly in production with Cloudflare in front of Hostinger.
 */

// Determine if we are running in local development
export const isLocalhost = () => {
  if (typeof window === "undefined") return false;
  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.endsWith(".local")
  );
};

/**
 * Builds a Cloudflare Image Transformation URL.
 * Example:
 *   cfImageUrl("/images/banner.webp", { width: 640, quality: 85 })
 *   -> "/cdn-cgi/image/width=640,quality=85,format=auto/images/banner.webp"
 *
 * @param {string} src - Raw image path (e.g. "/images/banner.webp" or "https://...")
 * @param {object} options - Transformation options (width, height, quality, format, fit, etc.)
 * @returns {string} - Transformed URL or raw URL if bypass conditions apply
 */
export function cfImageUrl(src, options = {}) {
  if (!src || typeof src !== "string") return "";

  // Bypass data URIs, blob URLs, and SVGs unless specifically requested
  if (src.startsWith("data:") || src.startsWith("blob:") || (src.endsWith(".svg") && !options.transformSvg)) {
    return src;
  }

  // Prevent double-prefixing if the URL is already a Cloudflare transform URL
  if (src.includes("/cdn-cgi/image/")) {
    const match = src.match(/\/cdn-cgi\/image\/[^/]+?\/(.+)$/);
    if (match) {
      src = match[1];
    } else {
      return src;
    }
  }

  // In local development, return the raw local src so local Vite dev server doesn't 404,
  // UNLESS forceCloudflare is explicitly set (in which case we proxy via live domain)
  const forceCf = options.forceCloudflare ?? (import.meta.env?.VITE_FORCE_CF_IMAGES === "true");
  if (isLocalhost() && !forceCf) {
    return src;
  }

  const {
    width,
    height,
    quality = 85,
    format = "auto",
    fit = "cover",
    metadata = "none",
  } = options;

  const params = [];
  if (width) params.push(`width=${width}`);
  if (height) params.push(`height=${height}`);
  if (quality) params.push(`quality=${quality}`);
  if (format) params.push(`format=${format}`);
  if (fit) params.push(`fit=${fit}`);
  if (metadata) params.push(`metadata=${metadata}`);

  const transformPrefix = `/cdn-cgi/image/${params.join(",")}`;
  const originPrefix = (forceCf && isLocalhost()) ? "https://simatrixacademy.com" : "";

  // If external absolute URL
  if (/^https?:\/\//i.test(src)) {
    try {
      const parsed = new URL(src);
      // If it belongs to simatrixacademy.com, strip domain to use clean relative path
      if (
        parsed.hostname === "simatrixacademy.com" ||
        parsed.hostname.endsWith(".simatrixacademy.com")
      ) {
        const cleanPath = parsed.pathname.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
        return `${originPrefix}${transformPrefix}/${cleanPath}${parsed.search}`;
      }
    } catch {
      // ignore
    }
    return `${originPrefix}${transformPrefix}/${src}`;
  }

  // Clean local relative path
  const cleanPath = src.startsWith("/") ? src.slice(1) : src;
  return `${originPrefix}${transformPrefix}/${cleanPath}`;
}

/**
 * Builds a standard HTML srcSet string for responsive loading.
 * Example:
 *   cfSrcSet("/images/banner.webp", [640, 750, 1080])
 *   -> "/cdn-cgi/image/width=640,... 640w, /cdn-cgi/image/width=750,... 750w, ..."
 *
 * @param {string} src - Raw image path
 * @param {number[]} widths - Array of target pixel widths
 * @param {object} options - Quality, format, fit options
 * @returns {string|undefined}
 */
export function cfSrcSet(src, widths = [360, 640, 768, 1024, 1280], options = {}) {
  if (!src) return undefined;

  // On localhost without forceCloudflare, skip srcSet to let browser load local raw src
  const forceCf = options.forceCloudflare ?? (import.meta.env?.VITE_FORCE_CF_IMAGES === "true");
  if (isLocalhost() && !forceCf) {
    return undefined;
  }

  if (!widths || !widths.length) return undefined;

  return widths
    .map((w) => `${cfImageUrl(src, { ...options, width: w })} ${w}w`)
    .join(", ");
}
