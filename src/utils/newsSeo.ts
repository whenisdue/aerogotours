import type { TravelUpdate } from "../data/travelUpdates.ts";
import { getSocialImageUrl } from "./siteMetadata.ts";

export function buildTravelNewsStructuredData(update: TravelUpdate, origin: string) {
  const articleUrl = new URL(`/travel-updates/${update.slug}`, origin).href;
  const newsUrl = new URL("/travel-updates", origin).href;
  const socialImage = update.socialImage === false ? undefined : update.socialImage ?? update.image;
  const imageUrl = socialImage?.src ? getSocialImageUrl(socialImage.src) : undefined;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${articleUrl}#article`,
        mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
        headline: update.headline,
        ...(update.summary ? { description: update.summary } : {}),
        datePublished: update.publishedAt,
        ...(update.updatedAt ? { dateModified: update.updatedAt } : {}),
        ...(imageUrl ? { image: imageUrl } : {}),
        publisher: { "@type": "Organization", name: "AeroGo", url: origin },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${articleUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Discover", item: new URL("/", origin).href },
          { "@type": "ListItem", position: 2, name: "Travel News", item: newsUrl },
          { "@type": "ListItem", position: 3, name: update.headline, item: articleUrl },
        ],
      },
    ],
  };
}
