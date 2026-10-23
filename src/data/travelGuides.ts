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
