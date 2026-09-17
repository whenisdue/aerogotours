const unsplash = (photoId: string, width: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;

export type DestinationMoment = {
  title: string;
  description: string;
};

export type DestinationJourneyDay = {
  day: number;
  title: string;
  description: string;
};

export type Destination = {
  slug: string;
  name: string;
  tagline: string;
  cardImage: string;
  heroImage: string;
  imageAlt: string;
  intro: [string, string];
  moments: [DestinationMoment, DestinationMoment, DestinationMoment];
  journey: [DestinationJourneyDay, DestinationJourneyDay, DestinationJourneyDay, DestinationJourneyDay];
};

export const destinations: Destination[] = [
  {
    slug: "thailand",
    name: "Thailand",
    tagline: "Island escapes and so much more.",
    cardImage: unsplash("photo-1510414842594-a61c69b5ae57", 900),
    heroImage: unsplash("photo-1507525428034-b723cf961d3e", 2200),
    imageAlt: "Warm sunlight over a quiet tropical beach and turquoise water",
    intro: [
      "Thailand can feel like several different trips in one: a slow morning by the sea, a lively market after dark, or a few quiet days surrounded by green hills.",
      "Leave room for the unplanned moments. A favorite meal, a longtail boat crossing, or a pause beneath the palms can become the part you remember longest.",
    ],
    moments: [
      { title: "First light by the water", description: "Let the day begin slowly, with warm air, soft waves, and nowhere you need to be just yet." },
      { title: "A little farther out", description: "Follow the coastline toward small coves and islands, with the view changing around every bend." },
      { title: "Evenings full of flavor", description: "Find a lively street, share a few dishes, and let the evening unfold at its own pace." },
    ],
    journey: [
      { day: 1, title: "Arrive and exhale", description: "Settle in and ease into the warm island rhythm." },
      { day: 2, title: "Follow the coast", description: "Spend the day between a favorite stretch of sand and a nearby village." },
      { day: 3, title: "Take to the water", description: "Make a scenic boat day the centerpiece, with time to linger along the way." },
      { day: 4, title: "Leave space for a favorite", description: "Return to a place you loved or see where the day takes you." },
    ],
  },
  {
    slug: "greece",
    name: "Greece",
    tagline: "Timeless beauty at every turn.",
    cardImage: unsplash("photo-1533105079780-92b9be482077", 900),
    heroImage: unsplash("photo-1533105079780-92b9be482077", 2200),
    imageAlt: "Whitewashed island buildings above a deep blue sea",
    intro: [
      "Greece invites you to take the scenic route: whitewashed lanes, blue horizons, long lunches, and old places that make the present feel wonderfully spacious.",
      "An island stay can be quiet or full of discovery. The best rhythm often leaves room for both: a little wandering, a little swimming, and an evening that stretches out over dinner.",
    ],
    moments: [
      { title: "A morning above the sea", description: "Walk the lanes before the day grows busy and watch the light settle over the water." },
      { title: "A table worth lingering at", description: "Share a slow meal built around local flavors and the people around the table." },
      { title: "The last light of the day", description: "Find a quiet viewpoint and let the island turn gold, then blue, then dark." },
    ],
    journey: [
      { day: 1, title: "Arrive by the water", description: "Settle into your island base and take an easy first walk." },
      { day: 2, title: "Wander the old lanes", description: "Explore at a gentle pace, stopping wherever the view calls you." },
      { day: 3, title: "Make a day of the coast", description: "Balance a swim or boat outing with a long meal nearby." },
      { day: 4, title: "Keep the morning open", description: "Return to a favorite corner before saying goodbye to the island." },
    ],
  },
  {
    slug: "japan",
    name: "Japan",
    tagline: "Culture, cuisine and unforgettable days.",
    cardImage: unsplash("photo-1493976040374-85c8e12f0c0e", 900),
    heroImage: unsplash("photo-1493976040374-85c8e12f0c0e", 2200),
    imageAlt: "Traditional Kyoto street glowing with warm lantern light",
    intro: [
      "Japan can move from quiet temple gardens to bright city streets in a single day. Each neighborhood has its own pace, and small discoveries are often just around the corner.",
      "Build a trip around a few things you are excited to see, then leave breathing room for the rest: a tiny restaurant, a train-window view, or a peaceful walk before the city wakes.",
    ],
    moments: [
      { title: "A quieter start", description: "Step into a garden or side street early, while the day still feels unhurried." },
      { title: "A meal to remember", description: "Choose something new from a small menu and make the meal part of the story." },
      { title: "City lights after dusk", description: "Follow the evening glow through a lively district, then find a calm way back." },
    ],
    journey: [
      { day: 1, title: "Arrive and settle in", description: "Get comfortable, find a nearby meal, and keep the first evening easy." },
      { day: 2, title: "Explore a neighborhood", description: "Pair one planned stop with time to wander nearby streets." },
      { day: 3, title: "Make room for a highlight", description: "Give one special experience the time it deserves." },
      { day: 4, title: "Take the slower route", description: "Choose a favorite place to revisit or discover somewhere new." },
    ],
  },
  {
    slug: "switzerland",
    name: "Switzerland",
    tagline: "Breathtaking views and bigger stories.",
    cardImage: unsplash("photo-1476514525535-07fb3b4ae5f1", 900),
    heroImage: unsplash("photo-1476514525535-07fb3b4ae5f1", 2200),
    imageAlt: "A mountain lake reflecting a dramatic alpine landscape",
    intro: [
      "In Switzerland, the journey between places can be part of the reason to go. Lakes, mountain villages, and wide-open views invite you to slow down and look around.",
      "A trip might center on one region or link a few different landscapes together. Either way, leave time for a lakeside pause and a view that makes everyone reach for a camera.",
    ],
    moments: [
      { title: "The view from the water", description: "Spend a little time by a lake, where the mountains appear to meet the shore." },
      { title: "A village between peaks", description: "Wander a small town and let the surrounding landscape set the pace." },
      { title: "An extra moment outside", description: "Take the longer path to a viewpoint and stay there a little while." },
    ],
    journey: [
      { day: 1, title: "Arrive in a mountain town", description: "Settle in and take a gentle walk to get your bearings." },
      { day: 2, title: "Follow the lake", description: "Spend the day close to the water, with time for a scenic pause." },
      { day: 3, title: "Head toward the heights", description: "Make the surrounding mountains the focus of the day." },
      { day: 4, title: "Slow down before you go", description: "Enjoy one last unhurried morning in your favorite setting." },
    ],
  },
  {
    slug: "south-korea",
    name: "South Korea",
    tagline: "A city pulse, with quieter corners too.",
    cardImage: unsplash("photo-1546874177-9e664107314e", 900),
    heroImage: unsplash("photo-1546874177-9e664107314e", 2200),
    imageAlt: "Colorful city architecture and streets in South Korea",
    intro: [
      "South Korea makes room for contrasts: lively city neighborhoods, thoughtful traditions, mountain scenery, and the small rituals of a good meal.",
      "Spend a few days following your curiosity. One day might be full of street life and design; the next could be quieter, with a slower walk and time to notice the details.",
    ],
    moments: [
      { title: "A neighborhood in motion", description: "Browse a lively street where cafés, shops, and everyday life sit side by side." },
      { title: "A pause with history", description: "Take a slower walk through a traditional setting and notice how old and new meet." },
      { title: "One more shared meal", description: "Gather around a table, try a few unfamiliar flavors, and make an evening of it." },
    ],
    journey: [
      { day: 1, title: "Find your city rhythm", description: "Arrive, settle in, and explore the streets close to your stay." },
      { day: 2, title: "Follow a neighborhood", description: "Spend the day among local shops, cafés, and everyday scenes." },
      { day: 3, title: "Mix old and new", description: "Pair a cultural stop with a lively part of the city." },
      { day: 4, title: "Choose your own encore", description: "Return to a favorite place or let a new discovery lead." },
    ],
  },
  {
    slug: "bali",
    name: "Bali",
    tagline: "Green horizons and gentler mornings.",
    cardImage: unsplash("photo-1537996194471-e657df975ab4", 900),
    heroImage: unsplash("photo-1622833065251-be0d3ceaea04", 2200),
    imageAlt: "Lush green rice terraces unfolding across the Bali countryside",
    intro: [
      "Bali can be a study in slowing down: green landscapes, coastal air, creative corners, and quiet moments woven between days out.",
      "Choose a home base that feels right for your pace, then give yourself the freedom to explore a little. A scenic detour or an open afternoon can become the heart of the trip.",
    ],
    moments: [
      { title: "Morning among the greens", description: "Take in layered rice fields and the soft quiet of the countryside." },
      { title: "A little coastal air", description: "Find a stretch of shore to walk, watch the changing light, and take your time." },
      { title: "An evening close to home", description: "Choose a relaxed meal nearby and let the day come to a gentle close." },
    ],
    journey: [
      { day: 1, title: "Arrive and find your pace", description: "Settle in close to your chosen home base." },
      { day: 2, title: "Explore the green interior", description: "Let the landscape lead you through a slower day." },
      { day: 3, title: "Make time for the coast", description: "Balance a beachside pause with a favorite local meal." },
      { day: 4, title: "Keep the day open", description: "Follow a small discovery or revisit the place that stayed with you." },
    ],
  },
  {
    slug: "hong-kong",
    name: "Hong Kong",
    tagline: "A harbor city with room to wander.",
    cardImage: unsplash("photo-1536599018102-9f803c140fc1", 900),
    heroImage: unsplash("photo-1536599018102-9f803c140fc1", 2200),
    imageAlt: "Hong Kong's dramatic skyline rising above the harbor",
    intro: [
      "Hong Kong is full of movement and perspective: harbor views, hills above the city, tucked-away streets, and food that brings everyone together.",
      "Let the city surprise you between the landmarks. A ferry crossing, a quiet side street, or a favorite snack can offer a different view of the same place.",
    ],
    moments: [
      { title: "The harbor at blue hour", description: "Watch the skyline come alive as the light shifts across the water." },
      { title: "A street worth turning down", description: "Step away from the main route and see what a quieter corner reveals." },
      { title: "A table full of small plates", description: "Share a meal, order one more thing, and let the conversation linger." },
    ],
    journey: [
      { day: 1, title: "Arrive above the harbor", description: "Settle in and take an easy first look at the city." },
      { day: 2, title: "Explore the street-level city", description: "Follow a neighborhood through its shops, markets, and cafés." },
      { day: 3, title: "Find a new perspective", description: "Take in the skyline from the water or a quieter hillside." },
      { day: 4, title: "Return to a favorite flavor", description: "Make room for one last wander and a meal worth remembering." },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    tagline: "Bright coastlines and open-air days.",
    cardImage: unsplash("photo-1506973035872-a4ec16b8e8d9", 900),
    heroImage: unsplash("photo-1506973035872-a4ec16b8e8d9", 2200),
    imageAlt: "Sydney's harbor and waterfront under bright coastal light",
    intro: [
      "Australia offers the kind of scale that makes a trip feel expansive: coastal cities, wide-open landscapes, and plenty of places to spend a day outside.",
      "Rather than trying to see everything, choose a region and let it set the rhythm. A long walk by the water or a day exploring a favorite neighborhood can be enough.",
    ],
    moments: [
      { title: "A walk beside the water", description: "Start outdoors and follow the coastline as the day opens up." },
      { title: "A city with its doors open", description: "Move between a favorite café, a green space, and a lively local street." },
      { title: "Stay out for the color", description: "Find a place to watch the late light settle across the city or shore." },
    ],
    journey: [
      { day: 1, title: "Arrive and take it easy", description: "Get settled and find a welcoming spot close to your stay." },
      { day: 2, title: "Let the coast set the pace", description: "Spend time outside, with room for a swim or a long walk." },
      { day: 3, title: "Explore a favorite neighborhood", description: "Mix local food, a green space, and a little wandering." },
      { day: 4, title: "Keep one last day flexible", description: "Return to the water or follow a new idea before heading home." },
    ],
  },
  {
    slug: "singapore",
    name: "Singapore",
    tagline: "A polished city with green space to spare.",
    cardImage: unsplash("photo-1525625293386-3f8f99389edd", 900),
    heroImage: unsplash("photo-1525625293386-3f8f99389edd", 2200),
    imageAlt: "A bright Southeast Asian city skyline beside the water",
    intro: [
      "Singapore brings together hawker stalls in Chinatown and Tiong Bahru, shaded paths at Gardens by the Bay, and waterfront walks around Marina Bay in a compact city setting.",
      "Choose a few neighborhoods to get to know, then leave room for a slower garden walk or an evening by the bay. The city works best when the route has space between its highlights.",
    ],
    moments: [
      { title: "A table full of flavor", description: "Move between Chinatown hawker favorites and a Tiong Bahru café, letting the meal become part of the route." },
      { title: "Green in the middle of it all", description: "Take a slower walk through Gardens by the Bay or the Botanic Gardens, where the city noise softens for a while." },
      { title: "The bay after dark", description: "Watch the Marina Bay skyline change color, then choose a nearby street for one more taste." },
    ],
    journey: [
      { day: 1, title: "Arrive by the bay", description: "Settle in and take an easy first walk near the water." },
      { day: 2, title: "Follow Chinatown and Tiong Bahru", description: "Pair hawker flavors with colorful streets and small neighborhood discoveries." },
      { day: 3, title: "Make space for the gardens", description: "Balance the city's architecture with a slower afternoon at Gardens by the Bay or the Botanic Gardens." },
      { day: 4, title: "Keep the final morning open", description: "Return to a favorite table or take one last walk before heading home." },
    ],
  },
  {
    slug: "vietnam",
    name: "Vietnam",
    tagline: "Street life, slow meals and stories in between.",
    cardImage: unsplash("photo-1528127269322-539801943592", 900),
    heroImage: unsplash("photo-1528127269322-539801943592", 2200),
    imageAlt: "A peaceful Vietnamese landscape layered with green hills",
    intro: [
      "Vietnam rewards a curious pace: Hanoi's Old Quarter, Hoi An's lantern-lined Ancient Town, and meals that invite you to stay a little longer each offer a different starting point.",
      "Choose one or two places to get to know rather than racing between every highlight. The smaller transitions, from Hoan Kiem to a quiet riverside lane, often carry the best memories.",
    ],
    moments: [
      { title: "A city waking up", description: "Start around Hanoi's Old Quarter or Hoan Kiem with a market or coffee, then let the morning streets set the rhythm." },
      { title: "A slower lane", description: "Follow Hoi An Ancient Town's old façades and riverside paths, or choose a neighborhood where daily life unfolds around you." },
      { title: "Dinner at street level", description: "Share a table, try something unfamiliar, and leave room for one more small dish." },
    ],
    journey: [
      { day: 1, title: "Arrive and find your bearings", description: "Keep the first walk close to your stay and let the city arrive gently." },
      { day: 2, title: "Follow the morning flavors", description: "Pair Hanoi's Old Quarter with a market or café and a neighborhood wander." },
      { day: 3, title: "Take the riverside turn", description: "Spend time in Hoi An Ancient Town, by the water, or in a quieter nearby setting." },
      { day: 4, title: "Leave room for one last meal", description: "Return to a favorite corner before the journey onward." },
    ],
  },
  {
    slug: "malaysia",
    name: "Malaysia",
    tagline: "Many cultures, one generous welcome.",
    cardImage: unsplash("photo-1596422846543-75c6fc197f07", 900),
    heroImage: unsplash("photo-1596422846543-75c6fc197f07", 2200),
    imageAlt: "A Malaysian city skyline glowing in warm evening light",
    intro: [
      "Malaysia makes room for contrasts: Kuala Lumpur's city streets, George Town's layered food traditions, tropical landscapes, and old neighborhoods shaped by many cultures.",
      "A good trip can choose one city base or pair Kuala Lumpur with a slower change of scenery, while keeping the meals, markets, and conversations close to the center of the experience.",
    ],
    moments: [
      { title: "A city from above", description: "Let Kuala Lumpur's skyline orient you, then come back down to the streets where the details live." },
      { title: "A meal with many influences", description: "Follow George Town's food trail through different flavors and let curiosity choose the next bite." },
      { title: "A greener horizon", description: "Make time for a park, coast, or highland pause when the city starts to feel full." },
    ],
    journey: [
      { day: 1, title: "Arrive in the city", description: "Settle in and take a gentle first look around your neighborhood." },
      { day: 2, title: "Follow the food trail", description: "Move between Kuala Lumpur markets, old streets, and a table worth lingering at." },
      { day: 3, title: "Find a different rhythm", description: "Choose a green space, cultural stop, or nearby change of scenery." },
      { day: 4, title: "Keep the ending open", description: "Return to a favorite place or follow one last new idea before departure." },
    ],
  },
];

export const findDestination = (slug: string | undefined) =>
  destinations.find((destination) => destination.slug === slug);

const featuredDestinationSlugs = ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"] as const;

export const featuredDestinations = featuredDestinationSlugs
  .map((slug) => destinations.find((destination) => destination.slug === slug))
  .filter((destination): destination is Destination => Boolean(destination));
