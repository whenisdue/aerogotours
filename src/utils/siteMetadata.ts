export const SITE_ORIGIN = "https://aerogotours.com";

export const DEFAULT_SOCIAL_IMAGE = "/images/gardens-by-the-bay/optimized/S25-1440.jpg";
export const DEFAULT_SOCIAL_IMAGE_ALT = "Supertree Grove and the glass conservatories at Gardens by the Bay, Singapore";

export function getSocialImageOrigin() {
  if (typeof window === "undefined") return SITE_ORIGIN;

  const { hostname, origin } = window.location;
  if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.endsWith(".vercel.app")) return origin;
  return SITE_ORIGIN;
}

export function getSocialImageUrl(source: string, origin = SITE_ORIGIN) {
  const image = new URL(source, origin);
  if (image.hostname === "images.unsplash.com") {
    image.searchParams.set("w", "1200");
    image.searchParams.set("q", "80");
  }
  return image.href;
}
