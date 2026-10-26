export type TravelGuide = {
  path: string;
  destination: string;
  destinationPath?: string;
  title: string;
  summary: string;
  image: string;
  imageSrc?: string;
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
  seoTitle?: string;
  seoDescription?: string;
};

// Only published, publicly routable editorial guides belong in this list.
export const travelGuides: TravelGuide[] = [
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
