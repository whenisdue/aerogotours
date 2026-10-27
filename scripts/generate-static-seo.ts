import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { destinations } from "../src/data/destinations.ts";
import { travelGuides } from "../src/data/travelGuides.ts";
import { getFeaturedTravelUpdate, getHomepageTravelUpdates, travelUpdates } from "../src/data/travelUpdates.ts";
import { createDreamTrip, getDreamDestination } from "../src/utils/dreamTripEngine.ts";
import { buildTravelNewsStructuredData } from "../src/utils/newsSeo.ts";
import { DEFAULT_SOCIAL_IMAGE_ALT, getSocialImageUrl, SITE_ORIGIN } from "../src/utils/siteMetadata.ts";

type Breadcrumb = { label: string; path: string };
type SeoPage = {
  path: string;
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedAt?: string;
  updatedAt?: string;
  robots?: string;
  schema?: Record<string, unknown>;
  breadcrumbs?: Breadcrumb[];
};

const gardenGuide = travelGuides.find((guide) => guide.path === "/guides/singapore/gardens-by-the-bay");
if (!gardenGuide) throw new Error("The published Gardens by the Bay guide is missing from travelGuides.ts");
const japanTaxGuide = travelGuides.find((guide) => guide.path === "/guides/japan/tax-free-refund-system-november-2026");
if (!japanTaxGuide?.publishedAt) throw new Error("The Japan guide publication date is missing from travelGuides.ts");
const japanAutumnGuide = travelGuides.find((guide) => guide.path === "/guides/japan/autumn-leaves-2026");
if (!japanAutumnGuide?.publishedAt || !japanAutumnGuide.imageSrc) throw new Error("The Japan autumn guide publication date or social image is missing from travelGuides.ts");
const cebuUndasGuide = travelGuides.find((guide) => guide.path === "/guides/philippines/cebu-pacific-undas-2026-flight-checklist");
if (!cebuUndasGuide?.sourcesCheckedAt || !cebuUndasGuide.imageSrc) throw new Error("The Cebu Pacific Undas guide metadata is incomplete");
const europeEesGuide = travelGuides.find((guide) => guide.path === "/guides/europe/ees-etias-entry-rules-2026");
if (!europeEesGuide?.publishedAt || !europeEesGuide.sourcesCheckedAt || !europeEesGuide.imageSrc || !europeEesGuide.socialImageSrc) throw new Error("The Europe EES and ETIAS guide metadata is incomplete");

const featuredNews = getFeaturedTravelUpdate();
const siteDescription = "Discover destination stories, timely travel news, practical guides and original AeroGo videos for curious travelers around the world.";
const gardenImage = "/images/gardens-by-the-bay/optimized/S25-1440.jpg";
const socialImageOrigin = process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : SITE_ORIGIN;
const brandEntityId = `${SITE_ORIGIN}/#organization`;

const pages: SeoPage[] = [
  {
    path: "/",
    title: "Travel Stories, News & Guides · AeroGo",
    description: siteDescription,
    image: gardenImage,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  },
  {
    path: "/travel-updates",
    title: "Travel News · AeroGo",
    description: "AeroGo Travel News: published travel developments, events and destination updates, with dates and original source links.",
    image: featuredNews?.image.src,
    imageAlt: featuredNews?.image.alt,
    schema: { "@type": "CollectionPage", name: "Travel News", url: `${SITE_ORIGIN}/travel-updates` },
    breadcrumbs: [{ label: "Discover", path: "/" }, { label: "Travel News", path: "/travel-updates" }],
  },
  ...travelUpdates.map((update): SeoPage => ({
    path: `/travel-updates/${update.slug}`,
    title: update.seoTitle ?? `${update.headline} · AeroGo Travel News`,
    description: update.seoDescription ?? update.summary,
    image: update.socialImage === false ? undefined : update.socialImage?.src ?? update.image.src,
    imageAlt: update.socialImage === false ? undefined : update.socialImage?.alt ?? update.image.alt,
    type: "article",
    publishedAt: update.publishedAt,
    updatedAt: update.updatedAt,
    schema: buildTravelNewsStructuredData(update, SITE_ORIGIN, socialImageOrigin),
  })),
  {
    path: "/guides",
    title: "Travel Guides · AeroGo",
    description: "Practical travel guides for destinations around the world, from seasonal planning and entry rules to attractions and airport procedures.",
    image: gardenImage,
    imageAlt: gardenGuide.imageAlt,
    schema: { "@type": "CollectionPage", name: "Travel Guides", url: `${SITE_ORIGIN}/guides` },
    breadcrumbs: [{ label: "Discover", path: "/" }, { label: "Travel Guides", path: "/guides" }],
  },
  {
    path: gardenGuide.path,
    title: "Gardens by the Bay Visitor Guide · Singapore · AeroGo",
    description: "A practical visitor guide to Gardens by the Bay in Singapore: free and ticketed areas, Cloud Forest, changing floral displays, Supertrees and planning tips.",
    image: gardenImage,
    imageAlt: gardenGuide.imageAlt,
    type: "article",
    schema: {
      "@type": "Article",
      headline: gardenGuide.title,
      description: gardenGuide.summary,
      image: new URL(gardenImage, SITE_ORIGIN).href,
      mainEntityOfPage: { "@type": "WebPage", "@id": new URL(gardenGuide.path, SITE_ORIGIN).href },
      publisher: { "@id": brandEntityId },
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Guides", path: "/guides" },
      { label: "Singapore", path: "/destinations/singapore" },
      { label: "Gardens by the Bay", path: gardenGuide.path },
    ],
  },
  {
    path: japanAutumnGuide.path,
    title: japanAutumnGuide.seoTitle ?? `${japanAutumnGuide.title} · AeroGo`,
    description: japanAutumnGuide.seoDescription ?? japanAutumnGuide.summary,
    image: japanAutumnGuide.imageSrc,
    imageAlt: japanAutumnGuide.socialImageAlt ?? japanAutumnGuide.imageAlt,
    type: "article",
    publishedAt: japanAutumnGuide.publishedAt,
    schema: {
      "@type": "Article",
      headline: japanAutumnGuide.title,
      description: japanAutumnGuide.seoDescription ?? japanAutumnGuide.summary,
      image: new URL(japanAutumnGuide.imageSrc, SITE_ORIGIN).href,
      datePublished: japanAutumnGuide.publishedAt,
      author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
      publisher: { "@id": brandEntityId },
      mainEntityOfPage: { "@type": "WebPage", "@id": new URL(japanAutumnGuide.path, SITE_ORIGIN).href },
      inLanguage: "en",
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Guides", path: "/guides" },
      { label: "Japan", path: "/destinations/japan" },
      { label: "Autumn leaves 2026", path: japanAutumnGuide.path },
    ],
  },
  {
    path: cebuUndasGuide.path,
    title: cebuUndasGuide.seoTitle ?? `${cebuUndasGuide.title} · AeroGo`,
    description: cebuUndasGuide.seoDescription ?? cebuUndasGuide.summary,
    image: cebuUndasGuide.imageSrc,
    imageAlt: cebuUndasGuide.socialImageAlt ?? cebuUndasGuide.imageAlt,
    type: "article",
    publishedAt: cebuUndasGuide.publishedAt,
    schema: {
      "@type": "Article",
      headline: cebuUndasGuide.title,
      description: cebuUndasGuide.seoDescription ?? cebuUndasGuide.summary,
      image: getSocialImageUrl(cebuUndasGuide.imageSrc, socialImageOrigin),
      ...(cebuUndasGuide.publishedAt ? { datePublished: cebuUndasGuide.publishedAt } : {}),
      author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
      publisher: { "@id": brandEntityId },
      mainEntityOfPage: { "@type": "WebPage", "@id": new URL(cebuUndasGuide.path, SITE_ORIGIN).href },
      inLanguage: "en",
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Guides", path: "/guides" },
      { label: "Cebu Pacific Undas checklist", path: cebuUndasGuide.path },
    ],
  },
  {
    path: europeEesGuide.path,
    title: europeEesGuide.seoTitle ?? `${europeEesGuide.title} | AeroGo`,
    description: europeEesGuide.seoDescription ?? europeEesGuide.summary,
    image: europeEesGuide.socialImageSrc,
    imageAlt: europeEesGuide.socialImageAlt ?? europeEesGuide.imageAlt,
    type: "article",
    publishedAt: europeEesGuide.publishedAt,
    schema: {
      "@type": "Article",
      headline: europeEesGuide.title,
      description: europeEesGuide.seoDescription ?? europeEesGuide.summary,
      image: getSocialImageUrl(europeEesGuide.socialImageSrc, socialImageOrigin),
      datePublished: europeEesGuide.publishedAt,
      author: { "@type": "Organization", name: "AeroGo", url: `${SITE_ORIGIN}/` },
      publisher: { "@id": brandEntityId },
      mainEntityOfPage: { "@type": "WebPage", "@id": new URL(europeEesGuide.path, SITE_ORIGIN).href },
      inLanguage: "en",
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Guides", path: "/guides" },
      { label: "EES vs. ETIAS", path: europeEesGuide.path },
    ],
  },
  {
    path: japanTaxGuide.path,
    title: "Japan Tax-Free Shopping Changes Nov. 1: A Filipino Traveler’s Guide · AeroGo",
    description: "Japan’s tax-free system changes for purchases from November 1, 2026. Learn about paying tax-inclusive prices, customs checks, and how eligible refunds work.",
    type: "article",
    publishedAt: japanTaxGuide.publishedAt,
    schema: {
      "@type": "Article",
      headline: "Japan’s tax-free shopping changes November 1: What visitors need to know",
      description: "Practical steps for Japan’s new tax-free shopping refund method, effective November 1, 2026.",
      datePublished: japanTaxGuide.publishedAt,
      mainEntityOfPage: { "@type": "WebPage", "@id": new URL(japanTaxGuide.path, SITE_ORIGIN).href },
      publisher: { "@id": brandEntityId },
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Guides", path: "/guides" },
      { label: "Japan", path: "/destinations/japan" },
      { label: "Tax-free shopping changes", path: "/guides/japan/tax-free-refund-system-november-2026" },
    ],
  },
  {
    path: "/watch",
    title: "Watch AeroGo · Original Travel Videos",
    description: "Watch published AeroGo travel videos from Singapore and Vietnam, including destination discovery and the Golden Bridge at Ba Na Hills.",
    image: gardenImage,
    imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
    schema: { "@type": "CollectionPage", name: "Watch AeroGo", url: `${SITE_ORIGIN}/watch` },
    breadcrumbs: [{ label: "Discover", path: "/" }, { label: "Watch", path: "/watch" }],
  },
  {
    path: "/trip-planner",
    title: "Free Singapore Trip Planner · AeroGo Travel & Tours",
    description: "Create a free three, four or five day Singapore itinerary with a travel checklist. No account needed; save, share or print your plan.",
    image: gardenImage,
    imageAlt: gardenGuide.imageAlt,
    schema: { "@type": "WebPage", name: "Free Singapore Trip Planner", url: `${SITE_ORIGIN}/trip-planner` },
    breadcrumbs: [{ label: "Discover", path: "/" }, { label: "Free Trip Planner", path: "/trip-planner" }],
  },
  {
    path: "/companion",
    title: "Sample Trip Companion · AeroGo",
    description: "Explore an illustrative AeroGo Trip Companion demo, showing how trip details can be organized in one private travel space.",
    robots: "noindex, follow",
    schema: { "@type": "WebPage", name: "Sample Trip Companion", url: `${SITE_ORIGIN}/companion` },
    breadcrumbs: [{ label: "Discover", path: "/" }, { label: "Sample Trip Companion", path: "/companion" }],
  },
  ...destinations.map((destination): SeoPage => ({
    path: `/destinations/${destination.slug}`,
    title: `${destination.name} inspiration · AeroGo`,
    description: `${destination.intro[0]} Explore AeroGo’s destination inspiration for ${destination.name}.`,
    image: destination.heroImage,
    imageAlt: destination.imageAlt,
    schema: {
      "@type": "WebPage",
      name: `${destination.name} destination inspiration`,
      description: `${destination.intro[0]} Explore AeroGo’s destination inspiration for ${destination.name}.`,
      url: new URL(`/destinations/${destination.slug}`, SITE_ORIGIN).href,
      primaryImageOfPage: { "@type": "ImageObject", contentUrl: destination.heroImage, caption: destination.imageAlt },
    },
    breadcrumbs: [
      { label: "Discover", path: "/" },
      { label: "Destination Stories", path: "/#destinations" },
      { label: destination.name, path: `/destinations/${destination.slug}` },
    ],
  })),
  ...destinations.flatMap((destination): SeoPage[] => {
    const config = getDreamDestination(destination.slug);
    if (!config) return [];
    const preview = createDreamTrip(config.slug, { group: "sample", travelers: 4, duration: 7, interest: "mix", pace: "balanced" });
    const path = `/dream/${destination.slug}`;
    return [{
      path,
      title: `${preview.title} · Dream Trip Preview · AeroGo`,
      description: preview.subtitle,
      image: destination.heroImage,
      imageAlt: destination.imageAlt,
      robots: "noindex, follow",
      schema: { "@type": "WebPage", name: preview.title, description: preview.subtitle, url: new URL(path, SITE_ORIGIN).href },
      breadcrumbs: [{ label: "Discover", path: "/" }, { label: destination.name, path: `/destinations/${destination.slug}` }, { label: "Dream Trip Preview", path }],
    }];
  }),
];

const organization = {
  "@type": "Organization",
  "@id": brandEntityId,
  name: "AeroGo",
  url: `${SITE_ORIGIN}/`,
};

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function safeJson(value: unknown) {
  return JSON.stringify(value).replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");
}

function breadcrumbSchema(page: SeoPage) {
  if (!page.breadcrumbs?.length) return undefined;
  return {
    "@type": "BreadcrumbList",
    "@id": `${new URL(page.path, SITE_ORIGIN).href}#breadcrumb`,
    itemListElement: page.breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.path, SITE_ORIGIN).href,
    })),
  };
}

function pageTags(page: SeoPage) {
  const canonical = new URL(page.path, SITE_ORIGIN).href;
  const image = page.image ? getSocialImageUrl(page.image, socialImageOrigin) : undefined;
  const globalGraph: Record<string, unknown>[] = [organization, {
    "@type": "WebSite",
    "@id": `${SITE_ORIGIN}/#website`,
    name: "AeroGo",
    url: `${SITE_ORIGIN}/`,
    description: siteDescription,
    publisher: { "@id": brandEntityId },
  }];
  const breadcrumb = breadcrumbSchema(page);
  const pageGraph = page.schema && Array.isArray(page.schema["@graph"])
    ? page.schema["@graph"] as Record<string, unknown>[]
    : [page.schema, breadcrumb].filter((node): node is Record<string, unknown> => Boolean(node));
  const globalStructuredData = { "@context": "https://schema.org", "@graph": globalGraph };
  const pageStructuredData = pageGraph.length ? { "@context": "https://schema.org", "@graph": pageGraph } : undefined;
  const tags = [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="${escapeHtml(page.robots ?? "index, follow")}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `<meta property="og:site_name" content="AeroGo" />`,
    `<meta property="og:type" content="${page.type ?? "website"}" />`,
    `<meta property="og:title" content="${escapeHtml(page.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(page.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    ...(image ? [`<meta property="og:image" content="${escapeHtml(image)}" />`] : []),
    ...(page.imageAlt ? [`<meta property="og:image:alt" content="${escapeHtml(page.imageAlt)}" />`] : []),
    `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
    `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`,
    ...(image ? [`<meta name="twitter:image" content="${escapeHtml(image)}" />`] : []),
    ...(image && page.imageAlt ? [`<meta name="twitter:image:alt" content="${escapeHtml(page.imageAlt)}" />`] : []),
    ...(page.type === "article" && page.publishedAt ? [`<meta property="article:published_time" content="${escapeHtml(page.publishedAt)}" />`] : []),
    ...(page.type === "article" && page.updatedAt ? [`<meta property="article:modified_time" content="${escapeHtml(page.updatedAt)}" />`] : []),
    `<script type="application/ld+json" data-aerogo-site-schema>${safeJson(globalStructuredData)}</script>`,
    ...(pageStructuredData ? [`<script type="application/ld+json"${page.type === "article" && page.path.startsWith("/travel-updates/") ? " data-aerogo-news-schema" : " data-aerogo-page-schema"}>${safeJson(pageStructuredData)}</script>`] : []),
  ];
  return tags.join("\n    ");
}

const outputDirectory = resolve("dist");
const templatePath = resolve(outputDirectory, "index.html");
const template = readFileSync(templatePath, "utf8");
const placeholder = /<!-- AEROGO:SEO:START -->[\s\S]*?<!-- AEROGO:SEO:END -->/;
if (!placeholder.test(template)) throw new Error("SEO metadata marker is missing from dist/index.html");
const homeNewsPlaceholder = /<!-- AEROGO:HOME_NEWS:START -->[\s\S]*?<!-- AEROGO:HOME_NEWS:END -->/;
if (!homeNewsPlaceholder.test(template)) throw new Error("Homepage news data marker is missing from dist/index.html");
const homepageNews = getHomepageTravelUpdates().slice(0, 2).map(({ slug, category, headline, summary, publishedAt }) => ({ slug, category, headline, summary, publishedAt }));
const routeTemplate = template.replace(homeNewsPlaceholder, `<!-- AEROGO:HOME_NEWS:START --><script id="aerogo-homepage-news" type="application/json">${safeJson(homepageNews)}</script><!-- AEROGO:HOME_NEWS:END -->`);

const seen = new Set<string>();
for (const page of pages) {
  if (!page.path.startsWith("/") || page.path.includes("?") || page.path.includes("#")) {
    throw new Error(`Invalid static metadata route: ${page.path}`);
  }
  if (seen.has(page.path)) throw new Error(`Duplicate static metadata route: ${page.path}`);
  seen.add(page.path);
  // Flat .html route files work with Vercel cleanUrls while preserving the
  // published extensionless URL and avoiding directory trailing-slash redirects.
  const filePath = page.path === "/" ? templatePath : resolve(outputDirectory, `${page.path.slice(1)}.html`);
  const html = routeTemplate.replace(placeholder, `<!-- AEROGO:SEO:START -->\n    ${pageTags(page)}\n    <!-- AEROGO:SEO:END -->`);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, html, "utf8");
}

console.log(`Generated initial HTML SEO metadata and JSON-LD for ${pages.length} routes`);
