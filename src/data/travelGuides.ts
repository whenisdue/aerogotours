export type TravelGuide = {
  path: string;
  destination: string;
  destinationPath?: string;
  title: string;
  summary: string;
  image: string;
  imageSrc?: string;
  socialImageSrc?: string;
  imageAlt: string;
  socialImageAlt?: string;
  imageCredit?: {
    author: string;
    authorUrl: string;
    sourceName: string;
    sourceUrl: string;
    license: string;
    licenseUrl: string;
    note: string;
  };
  topics?: string[];
  publishedAt?: string;
  sourcesCheckedAt?: string;
  homepageFeaturedThrough?: string;
  seoTitle?: string;
  seoDescription?: string;
};

// Publicly routable guide records used by the directory, homepage and static SEO build.
// Set publishedAt to the article's actual first-production publication date; correct it before release if publication is delayed.
export const travelGuides: TravelGuide[] = [
  {
    path: "/guides/philippines/cebu-pacific-undas-2026-flight-checklist",
    destination: "Philippines",
    title: "Flying Cebu Pacific During Undas 2026? 7 Things to Check Before You Leave",
    summary: "A saveable flight-day checklist for Cebu Pacific passengers: airport arrival, online check-in, baggage, documents, airport steps and what to do if a flight changes.",
    image: "cebu-undas-checklist",
    imageSrc: "/images/guides/philippines/cebu-undas-checklist.jpg",
    imageAlt: "Original AeroGo illustration of an open suitcase, travel essentials and a phone displaying a generic checklist; this is not a photograph of an airport or airline operation",
    socialImageAlt: "Original AeroGo illustration of travel essentials beside a generic checklist phone, created for the Cebu Pacific Undas flight guide; not a documentary airport image",
    topics: ["3 hours domestic · 4 hours international", "48-hour online check-in", "Undas peak-period checklist"],
    publishedAt: "2026-10-26",
    sourcesCheckedAt: "2026-10-26",
    homepageFeaturedThrough: "2026-11-03",
    seoTitle: "Cebu Pacific Undas 2026: 7 Flight-Day Checks | AeroGo",
    seoDescription: "Flying Cebu Pacific during Undas 2026? Check airport arrival times, check-in deadlines, baggage, documents and what to do if your flight changes.",
  },
  {
    path: "/guides/japan/autumn-leaves-2026",
    destination: "Japan",
    destinationPath: "/destinations/japan",
    title: "Japan Autumn Leaves 2026: When to See Fall Colors by City",
    summary: "Compare the latest city forecasts for red maples and yellow ginkgo, see dated foliage reports, and learn what to check before choosing a spot.",
    image: "japan-autumn-kyoto",
    imageSrc: "/images/guides/japan-autumn/kiyomizu-dera-kyoto-2016.jpg",
    imageAlt: "Autumn-colored trees surround Kiyomizu-dera in Kyoto in a November 2016 archival photograph; this is not a 2026 foliage report",
    socialImageAlt: "Archival Kiyomizu-dera autumn photograph by Martin Falbisoner, Wikimedia Commons, CC BY-SA 4.0; photographed 16 November 2016 and resized for display. Not a 2026 foliage report.",
    imageCredit: {
      author: "Martin Falbisoner",
      authorUrl: "https://commons.wikimedia.org/wiki/User:Martin_Falbisoner",
      sourceName: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Kiyomizu-dera,_Kyoto,_November_2016_-01.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      note: "Kiyomizu-dera, Kyoto; photographed 16 November 2016 and resized for display. Archival photograph, not a current foliage observation.",
    },
    topics: ["Forecast dates by city", "Red maple & yellow ginkgo", "Dated field reports"],
    publishedAt: "2026-10-26",
    sourcesCheckedAt: "2026-10-26",
    seoTitle: "Japan Autumn Leaves 2026: Forecast Dates by City | AeroGo",
    seoDescription: "Planning Japan in autumn 2026? Compare red-maple and yellow-ginkgo forecasts for 11 cities, dated foliage reports and practical checks before you go.",
  },
  {
    path: "/guides/europe/ees-etias-entry-rules-2026",
    destination: "Europe",
    title: "Traveling to Europe? EES vs. ETIAS Explained for 2026",
    summary: "EES is operating at participating European borders; ETIAS applications are not open. See who is affected, what to expect at passport control and what to prepare before travel.",
    image: "europe-ees-etias",
    imageSrc: "/images/guides/europe/ees-etias-2026.png",
    socialImageSrc: "/images/guides/europe/ees-etias-2026.png",
    imageAlt: "Original AeroGo editorial illustration comparing EES border registration with the future ETIAS pre-travel authorization; not an official EU graphic or a depiction of an actual border counter",
    socialImageAlt: "Original AeroGo illustration: EES is active at the border; ETIAS applications are not open as checked October 27, 2026",
    topics: ["EES active since 10 April 2026", "ETIAS applications not open", "Rules depend on nationality and travel status"],
    sourcesCheckedAt: "2026-10-27",
    seoTitle: "EES vs. ETIAS in 2026: Europe Entry Rules Explained | AeroGo",
    seoDescription: "EES is operating at Europe’s Schengen borders; ETIAS applications are not open. Learn who may be affected, what happens at passport control and what to prepare.",
  },
  {
    path: "/guides/japan/tax-free-refund-system-november-2026",
    destination: "Japan",
    destinationPath: "/destinations/japan",
    title: "Japan’s tax-free shopping changes November 1: What visitors need to know",
    summary: "Pay tax first, complete customs confirmation before checking your bags, then receive the eligible refund from the shop or its provider. A practical guide for Japan-bound travelers.",
    image: "japan-tax-refund",
    imageAlt: "AeroGo editorial guide graphic showing Japan’s new tax refund procedure starting 1 November 2026",
    topics: ["Effective 1 November", "Airport customs", "Refund checklist"],
    publishedAt: "2026-10-25",
    sourcesCheckedAt: "2026-10-25",
  },
  {
    path: "/guides/singapore/gardens-by-the-bay",
    destination: "Singapore",
    destinationPath: "/destinations/singapore",
    title: "Gardens by the Bay: More Than Just the Supertrees",
    summary: "Step inside the conservatories, linger among the gardens, and stay for the lights. Our visitor guide explains what’s free, what needs a ticket, and how to bring it all together.",
    image: "S4",
    imageAlt: "Cloud Forest’s indoor waterfall cascading down a planted mountain beneath a glass roof",
    topics: ["Free & ticketed areas", "Conservatories", "Day into night"],
  },
];

export function getFeaturedTravelGuide(now = new Date()): TravelGuide {
  const manilaDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return travelGuides.find((guide) => !guide.homepageFeaturedThrough || manilaDate <= guide.homepageFeaturedThrough)
    ?? travelGuides[0];
}
