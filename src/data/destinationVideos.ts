// Published AeroGo Facebook videos already linked from the Discovery homepage.
export type DestinationVideo = { title: string; url: string };

export const destinationVideos: Record<string, DestinationVideo[]> = {
  singapore: [
    { title: "Five places to see on your first trip to Singapore", url: "https://www.facebook.com/aerogotours/videos/going-to-singapore-for-the-first-time-these-are-5-places-i-would-definitely-put-/1450245700326560/" },
    { title: "Why Sentosa deserves its own Singapore list", url: "https://www.facebook.com/aerogotours/videos/so-many-of-you-asked-why-sentosa-wasnt-in-our-singapore-top-5the-more-we-looked-/1552256189921006/" },
  ],
  vietnam: [
    { title: "See the Golden Bridge at Ba Na Hills", url: "https://www.facebook.com/aerogotours/videos/some-places-look-unreal-until-youre-standing-in-them-the-golden-bridge-at-ba-na-/1442020924658774/" },
  ],
};
