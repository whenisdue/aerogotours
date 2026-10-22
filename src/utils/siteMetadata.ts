export const SITE_ORIGIN = "https://aerogotours.com";

export const DEFAULT_SOCIAL_IMAGE = "/images/gardens-by-the-bay/optimized/S25-1440.jpg";
export const DEFAULT_SOCIAL_IMAGE_ALT = "Supertree Grove and the glass conservatories at Gardens by the Bay, Singapore";

export function getSocialImageUrl(source: string) {
  const image = new URL(source, SITE_ORIGIN);
  if (image.hostname === "images.unsplash.com") {
    image.searchParams.set("w", "1200");
    image.searchParams.set("q", "80");
  }
  return image.href;
}
