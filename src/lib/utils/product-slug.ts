const PRODUCT_UPLOAD_SLUG_PATTERN = /\/static\/uploads\/products\/([^/]+)\//i;

export function deriveProductSlug(
  imageUrl: string | null | undefined,
  fallback = "nike-air-force-1-07",
) {
  if (!imageUrl) {
    return fallback;
  }

  const matchedSlug = imageUrl.match(PRODUCT_UPLOAD_SLUG_PATTERN)?.[1];
  return matchedSlug ?? fallback;
}
