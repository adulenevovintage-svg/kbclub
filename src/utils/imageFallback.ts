/**
 * Universal Image Fallback Utilities
 * Ensures that logos and photos never appear broken across browsers or deployments (e.g. Vercel).
 */

export const DEFAULT_KB_LOGO = 'https://user19731.na.imgto.link/public/20261015/5a81947f64c76b222db29ac4-photo-2026-09-19-22-41-46.avif';

export const DEFAULT_CLUB_COVER = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80';

export const DEFAULT_STEM_PHOTO = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80';

export const DEFAULT_AEROSPACE_PHOTO = 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800&auto=format&fit=crop&q=80';

/**
 * Sanitizes URLs that are known to be expired or blocked by Cloudflare (such as phototourl.com)
 */
export function sanitizeImageUrl(url: string | undefined | null, fallback = DEFAULT_KB_LOGO): string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }
  // Remove dead/expired temporary upload links or local svg placeholders
  if (url.includes('phototourl.com') || url.includes('https://...') || url.includes('kb-academy-logo.svg')) {
    return fallback;
  }
  return url;
}

/**
 * Standard image onError handler to prevent broken image icons
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string = DEFAULT_KB_LOGO
) {
  const target = event.currentTarget;
  if (target.src !== fallbackSrc && !target.src.endsWith(fallbackSrc)) {
    target.src = fallbackSrc;
  }
}
