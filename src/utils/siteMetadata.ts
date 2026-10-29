export const SITE_ORIGIN = "https://aerogotours.com";

export const DEFAULT_SOCIAL_IMAGE = "/images/gardens-by-the-bay/optimized/S25-1440.jpg";
export const DEFAULT_SOCIAL_IMAGE_ALT = "Supertree Grove and the glass conservatories at Gardens by the Bay, Singapore";

function getRuntimeSocialOrigin() {
  if (typeof window !== "undefined" && (
    window.location.hostname.endsWith(".vercel.app")
    || window.location.hostname === "localhost"
    || window.location.hostname === "127.0.0.1"
  )) {
    return window.location.origin;
  }
  return SITE_ORIGIN;
}

export function getSocialImageUrl(source: string, baseOrigin = getRuntimeSocialOrigin()) {
  const image = new URL(source, baseOrigin);
  if (image.hostname === "images.unsplash.com") {
    image.searchParams.set("w", "1200");
    image.searchParams.set("q", "80");
  }
  return image.href;
}
