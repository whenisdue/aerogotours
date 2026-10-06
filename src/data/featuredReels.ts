export type FeaturedReel = {
  id: string;
  destination: string;
  title: string;
  thumbnail: string | null;
  url: string | null;
  label?: string;
  accessibilityText?: string;
};

// Add the exact Reel URL and its matching poster when they are supplied.
// Incomplete entries stay out of the homepage until all three are ready.
export const featuredReels: FeaturedReel[] = [
  {
    id: "singapore-surprise",
    destination: "Singapore",
    title: "What surprised us most about Singapore",
    thumbnail: null,
    url: null,
  },
  {
    id: "sentosa-video",
    destination: "Sentosa",
    title: "Why Sentosa needed its own video",
    thumbnail: null,
    url: null,
  },
  {
    id: "taipei-first-trip",
    destination: "Taipei",
    title: "5 places worth visiting on your first trip to Taipei",
    thumbnail: null,
    url: null,
  },
];
