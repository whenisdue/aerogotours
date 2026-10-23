import goldenBridgePhoto from "../assets/vietnam-bana-hills.webp";

export type VideoPlatform = "facebook" | "tiktok" | "youtube";
export type VideoSeries = "Destination Discovery" | "AeroGo Explains" | "Hidden Gems" | "City Escapes" | "Bucket List";

export const videoPlatformLabels: Record<VideoPlatform, string> = { facebook: "Facebook", tiktok: "TikTok", youtube: "YouTube" };

export type PublishedVideo = {
  id: string;
  title: string;
  destination: string;
  destinationSlug: string;
  series: VideoSeries;
  platform: VideoPlatform;
  url: string;
  cover?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    credit: string;
    creditUrl?: string;
  };
};

// Add a record only after the platform post is published and its URL is confirmed.
// Covers are destination photographs, not claimed video frames. A missing cover
// deliberately renders as a type-led card until a matching asset is supplied.
export const publishedVideos: PublishedVideo[] = [
  {
    id: "singapore-first-trip",
    title: "Five places to see on your first trip to Singapore",
    destination: "Singapore",
    destinationSlug: "singapore",
    series: "Destination Discovery",
    platform: "facebook",
    url: "https://www.facebook.com/aerogotours/videos/going-to-singapore-for-the-first-time-these-are-5-places-i-would-definitely-put-/1450245700326560/",
    cover: {
      src: "/images/gardens-by-the-bay/optimized/S25-720.webp",
      alt: "Supertree Grove and the glass conservatories at Gardens by the Bay, Singapore",
      width: 720,
      height: 900,
      credit: "Gardens by the Bay · AeroGo destination photo, not a video frame",
    },
  },
  {
    id: "sentosa-singapore",
    title: "Why Sentosa deserves its own Singapore list",
    destination: "Sentosa, Singapore",
    destinationSlug: "singapore",
    series: "Destination Discovery",
    platform: "facebook",
    url: "https://www.facebook.com/aerogotours/videos/so-many-of-you-asked-why-sentosa-wasnt-in-our-singapore-top-5the-more-we-looked-/1552256189921006/",
  },
  {
    id: "golden-bridge-vietnam",
    title: "See the Golden Bridge at Ba Na Hills",
    destination: "Da Nang, Vietnam",
    destinationSlug: "vietnam",
    series: "Bucket List",
    platform: "facebook",
    url: "https://www.facebook.com/aerogotours/videos/some-places-look-unreal-until-youre-standing-in-them-the-golden-bridge-at-ba-na-/1442020924658774/",
    cover: {
      src: goldenBridgePhoto,
      alt: "The Golden Bridge at Ba Na Hills, held above the mountain landscape by sculpted stone hands",
      width: 1200,
      height: 650,
      credit: "Golden Bridge · destination photo, not a video frame · Unsplash",
      creditUrl: "https://unsplash.com/photos/golden-bridge-held-by-giant-hands-in-vietnam-CsoQ-jm_0vQ",
    },
  },
];

export const getVideosForDestination = (slug: string) =>
  publishedVideos.filter((video) => video.destinationSlug === slug);

export const publishedVideoSeries = [...new Set(publishedVideos.map((video) => video.series))];
