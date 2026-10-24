export type TravelGuide = {
  path: string;
  destination: string;
  destinationPath?: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
  topics?: string[];
};

// Only published, publicly routable editorial guides belong in this list.
export const travelGuides: TravelGuide[] = [
  {
    path: "/guides/japan/tax-free-refund-system-november-2026",
    destination: "Japan",
    destinationPath: "/destinations/japan",
    title: "Japan’s tax-free shopping changes November 1: What visitors need to know",
    summary: "Pay tax first, complete customs confirmation before checking your bags, then receive the eligible refund from the shop or its provider. A practical guide for Japan-bound travelers.",
    image: "japan-tax-refund",
    imageAlt: "AeroGo editorial guide graphic showing Japan’s new tax refund procedure starting 1 November 2026",
    topics: ["Effective 1 November", "Airport customs", "Refund checklist"],
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
