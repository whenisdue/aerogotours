const unsplash = (photoId: string, width: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;

export type DreamGroup = "sample" | "solo" | "couple" | "family" | "friends";
export type DreamDestinationSlug = "japan" | "thailand" | "south-korea";
export type DreamDuration = 3 | 4 | 5 | 7 | 10;
export type DreamInterest = "food" | "nature" | "city" | "mix";
export type DreamPace = "slow" | "balanced" | "full";

export type DreamTripAnswers = {
  group: DreamGroup;
  travelers: number;
  duration: DreamDuration;
  interest: DreamInterest;
  pace: DreamPace;
};

export type DreamDayTemplate = {
  id: string;
  location: string;
  title: string;
  overview: string;
  image: string;
  imageAlt: string;
  experiences: Record<DreamInterest, string[]>;
  practicalNote?: string;
};

export type JapanDreamDayTemplate = DreamDayTemplate;

export const japanDreamImages = {
  hero: {
    image: unsplash("photo-1528360983277-13d401cdc186", 2200),
    alt: "A peaceful Japanese garden with layered green hills",
  },
  arrival: {
    image: unsplash("photo-1493976040374-85c8e12f0c0e", 1200),
    alt: "A quiet traditional street in Kyoto with warm evening light",
  },
  city: {
    image: unsplash("photo-1540959733332-eab4deabeeaf", 1200),
    alt: "Tokyo skyline and city streets under a bright blue sky",
  },
  food: {
    image: unsplash("photo-1554797589-7241bb691973", 1200),
    alt: "Colorful Japanese food stalls glowing in the evening",
  },
  nature: {
    image: unsplash("photo-1528360983277-13d401cdc186", 1200),
    alt: "A peaceful Japanese garden framed by green trees",
  },
  kyoto: {
    image: unsplash("photo-1490806843957-31f4c9a91c65", 1200),
    alt: "A red torii path winding through a Japanese forest",
  },
  osaka: {
    image: unsplash("photo-1590559899731-a382839e5549", 1200),
    alt: "Osaka streets lit up after sunset",
  },
} as const;

export const japanDreamDayTemplates: JapanDreamDayTemplate[] = [
  {
    id: "tokyo-arrive",
    location: "Tokyo",
    title: "Arrive and settle into the rhythm",
    overview: "Keep the first day light: get comfortable, find a nearby meal, and let Japan begin at an easy pace.",
    image: japanDreamImages.city.image,
    imageAlt: japanDreamImages.city.alt,
    experiences: {
      food: ["A first neighborhood meal", "A gentle evening walk"],
      nature: ["A quiet garden close to your stay", "A neighborhood walk at golden hour"],
      city: ["A first look at the city lights", "A simple orientation walk"],
      mix: ["A welcoming local meal", "A relaxed first walk"],
    },
    practicalNote: "Arrival days are intentionally open so a long journey does not set the pace for the whole trip.",
  },
  {
    id: "tokyo-neighborhoods",
    location: "Tokyo",
    title: "Find your favorite Tokyo neighborhood",
    overview: "Choose one part of the city and stay curious. A few well-chosen stops leave room for the details between them.",
    image: japanDreamImages.city.image,
    imageAlt: japanDreamImages.city.alt,
    experiences: {
      food: ["A market or depachika browse", "A small restaurant worth remembering", "A coffee or dessert stop"],
      nature: ["A morning garden walk", "A leafy neighborhood pause", "A riverside or park wander"],
      city: ["A lively shopping street", "A landmark with a view", "An evening district to explore"],
      mix: ["A cultural stop", "A local food discovery", "Time to wander without a checklist"],
    },
  },
  {
    id: "tokyo-highlight",
    location: "Tokyo",
    title: "Make room for one big highlight",
    overview: "Give one experience the time it deserves, then keep the rest of the day flexible around it.",
    image: japanDreamImages.food.image,
    imageAlt: japanDreamImages.food.alt,
    experiences: {
      food: ["A hands-on food experience", "A neighborhood known for its kitchens", "A memorable dinner"],
      nature: ["A nearby nature escape", "A scenic outlook", "A slower return to the city"],
      city: ["A design or pop-culture district", "A city view after dark", "A late evening wander"],
      mix: ["A signature Tokyo experience", "A meal in a new neighborhood", "A little unplanned time"],
    },
  },
  {
    id: "tokyo-depart",
    location: "Tokyo",
    title: "Leave with one last favorite",
    overview: "Keep the final morning simple: revisit a place you loved, then make the onward journey without rushing the ending.",
    image: japanDreamImages.city.image,
    imageAlt: japanDreamImages.city.alt,
    experiences: {
      food: ["A final breakfast favorite", "A small treat for the journey"],
      nature: ["A last garden walk", "A quiet view before heading on"],
      city: ["One last neighborhood loop", "A final city view"],
      mix: ["A favorite revisit", "A final meal or coffee"],
    },
    practicalNote: "Keeping departure day open gives the trip a softer landing and leaves room for the journey home.",
  },
  {
    id: "hakone-pause",
    location: "Tokyo & nearby",
    title: "Take the scenic route out",
    overview: "A nearby escape can add a change of scenery without asking a short trip to cross half the country.",
    image: japanDreamImages.nature.image,
    imageAlt: japanDreamImages.nature.alt,
    experiences: {
      food: ["A regional lunch", "A market or tea stop"],
      nature: ["Lake and mountain views", "A restorative walk", "A warm bath or quiet afternoon"],
      city: ["A different view of the region", "A scenic train journey"],
      mix: ["A change of scenery", "A local meal", "Time to pause and look around"],
    },
    practicalNote: "Nearby excursions work best when the return journey is part of the day, rather than an afterthought.",
  },
  {
    id: "kyoto-arrive",
    location: "Kyoto",
    title: "Change cities, keep the day gentle",
    overview: "The move from Tokyo to Kyoto is part of the journey. Arrive, settle in, and let the first evening stay simple.",
    image: japanDreamImages.arrival.image,
    imageAlt: japanDreamImages.arrival.alt,
    experiences: {
      food: ["A first Kyoto dinner", "A short lantern-lit walk"],
      nature: ["A quiet temple garden nearby", "A calm evening stroll"],
      city: ["A first look at Gion", "A riverside walk after arrival"],
      mix: ["A neighborhood introduction", "A meal close to your stay"],
    },
    practicalNote: "Intercity travel takes a meaningful part of the day, so this is planned as a transition rather than a packed sightseeing day.",
  },
  {
    id: "kyoto-culture",
    location: "Kyoto",
    title: "Walk through Kyoto's quieter layers",
    overview: "Choose a temple, garden, or old lane as an anchor, then let the surrounding streets fill in the rest.",
    image: japanDreamImages.kyoto.image,
    imageAlt: japanDreamImages.kyoto.alt,
    experiences: {
      food: ["A morning market", "A thoughtful tea or sweets stop", "A seasonal lunch"],
      nature: ["A temple garden", "A bamboo or forest walk", "A quiet bench with a view"],
      city: ["Historic lanes", "A craft or design neighborhood", "A riverside evening"],
      mix: ["A temple or garden", "A neighborhood lunch", "Time for a slower discovery"],
    },
  },
  {
    id: "kyoto-open-day",
    location: "Kyoto",
    title: "Leave a little room for wonder",
    overview: "A day without too many fixed points makes it easier to follow the place that catches your attention.",
    image: japanDreamImages.arrival.image,
    imageAlt: japanDreamImages.arrival.alt,
    experiences: {
      food: ["A favorite meal revisited", "A small food discovery", "An unhurried evening"],
      nature: ["A green corner away from the busiest routes", "A scenic walk", "A restful afternoon"],
      city: ["A neighborhood you have not seen yet", "A gallery, shop, or café", "A night walk"],
      mix: ["A second look at a favorite place", "A new side street", "A meal chosen on the day"],
    },
  },
  {
    id: "kyoto-depart",
    location: "Kyoto",
    title: "Say goodbye slowly",
    overview: "Take one last walk through a familiar lane, then leave Japan with a little space around the journey onward.",
    image: japanDreamImages.arrival.image,
    imageAlt: japanDreamImages.arrival.alt,
    experiences: {
      food: ["A final Kyoto breakfast", "A last seasonal sweet"],
      nature: ["A quiet temple garden", "A final green pause"],
      city: ["One last old lane", "A final neighborhood look"],
      mix: ["A favorite morning walk", "A last meal close to your stay"],
    },
    practicalNote: "The return journey is part of the day, so the last moments stay intentionally unhurried.",
  },
  {
    id: "osaka-food",
    location: "Osaka",
    title: "Follow the flavor to Osaka",
    overview: "End a longer journey with a city that knows how to make an evening feel generous, lively, and easy to enjoy.",
    image: japanDreamImages.osaka.image,
    imageAlt: japanDreamImages.osaka.alt,
    experiences: {
      food: ["A street-food neighborhood", "A shared table of local favorites", "One last sweet stop"],
      nature: ["A park or waterfront pause", "A relaxed neighborhood walk"],
      city: ["A bright evening district", "A market and arcade wander", "A view across the city"],
      mix: ["A lively food street", "A city neighborhood", "An easy final evening"],
    },
  },
  {
    id: "nara-day",
    location: "Nara",
    title: "Trade the city lights for open space",
    overview: "A nearby day out offers a gentler counterpoint to the cities, with time to walk, look around and return without changing hotels.",
    image: japanDreamImages.nature.image,
    imageAlt: japanDreamImages.nature.alt,
    experiences: {
      food: ["A local lunch", "A tea or sweets stop"],
      nature: ["A wide park and old trees", "A temple or garden", "A quiet walk before returning"],
      city: ["A different rhythm from Tokyo and Osaka", "A historic neighborhood", "A relaxed return to the city"],
      mix: ["A change of pace", "A cultural stop", "A meal before heading back"],
    },
    practicalNote: "A nearby day trip can add contrast without requiring another hotel change.",
  },
  {
    id: "osaka-close",
    location: "Osaka",
    title: "Finish with a day that feels like yours",
    overview: "Keep the final day open enough for a favorite revisit, a last discovery, and a calm journey home.",
    image: japanDreamImages.osaka.image,
    imageAlt: japanDreamImages.osaka.alt,
    experiences: {
      food: ["A final breakfast favorite", "A last neighborhood meal"],
      nature: ["A slow morning outdoors", "A view to take home with you"],
      city: ["A final city walk", "Time for one last shop or café"],
      mix: ["A favorite place revisited", "A final meal", "A little open time"],
    },
    practicalNote: "Keeping departure day simple gives the trip a softer landing and leaves room for the journey onward.",
  },
];

export const thailandDreamImages = {
  hero: {
    image: unsplash("photo-1528181304800-259b08848526", 2200),
    alt: "Longtail boats resting on a bright tropical beach in Thailand",
  },
  bangkok: {
    image: unsplash("photo-1508009603885-50cf7c579365", 1200),
    alt: "Ornate temple roofs and warm evening light in Bangkok",
  },
  oldCity: {
    image: unsplash("photo-1552465011-b4e21bf6e79a", 1200),
    alt: "A richly detailed Thai temple interior",
  },
  food: {
    image: unsplash("photo-1559847844-5315695dadae", 1200),
    alt: "A colorful Thai street-food spread",
  },
  ayutthaya: {
    image: unsplash("photo-1563492065599-3520f775eeed", 1200),
    alt: "Ancient brick temple ruins surrounded by trees in Thailand",
  },
  chiangMai: {
    image: unsplash("photo-1598935898639-815b9f0e6e1d", 1200),
    alt: "Green northern Thailand hills near Chiang Mai",
  },
  northCulture: {
    image: unsplash("photo-1512553353614-82a7370096dc", 1200),
    alt: "A quiet temple and mountain landscape in northern Thailand",
  },
  phuket: {
    image: unsplash("photo-1539650116574-75c0c6d73f6e", 1200),
    alt: "Turquoise water and limestone coastline near Phuket",
  },
  phuketOldTown: {
    image: unsplash("photo-1589394815804-964ed0be2eb5", 1200),
    alt: "Colorful Sino-Portuguese buildings in Phuket Old Town",
  },
} as const;

export const thailandDreamDayTemplates: DreamDayTemplate[] = [
  {
    id: "bangkok-arrive",
    location: "Bangkok",
    title: "Arrive by the Chao Phraya",
    overview: "Settle in near the river, take a gentle first look around, and let the heat and energy of Bangkok arrive at its own pace.",
    image: thailandDreamImages.bangkok.image,
    imageAlt: thailandDreamImages.bangkok.alt,
    experiences: {
      food: ["A first meal in a riverside neighborhood", "A gentle Chao Phraya walk"],
      nature: ["A shaded park pause", "A quiet view from the river"],
      city: ["A first look at Bangkok's riverfront", "A simple neighborhood orientation"],
      mix: ["A welcoming local meal", "A relaxed first look at the river"],
    },
    practicalNote: "Arrival days stay light so the journey into Thailand does not dictate the pace of the whole trip.",
  },
  {
    id: "bangkok-old-city",
    location: "Bangkok",
    title: "Walk the Old City slowly",
    overview: "Use Bangkok's historic center as an anchor, pairing the Grand Palace and Wat Pho with an unhurried look at the streets around them.",
    image: thailandDreamImages.oldCity.image,
    imageAlt: thailandDreamImages.oldCity.alt,
    experiences: {
      food: ["A breakfast near the Old City", "A riverside lunch after Wat Pho", "A cool-down drink between stops"],
      nature: ["A shaded temple courtyard", "A quiet pause by the Chao Phraya", "A garden break between walks"],
      city: ["The Grand Palace precinct", "Wat Pho's courtyards", "A view toward Wat Arun across the river"],
      mix: ["The Grand Palace precinct", "Wat Pho and its surrounding lanes", "A meal close to the river"],
    },
    practicalNote: "Temple visits are grouped in one area, but opening arrangements and dress guidance should be checked before a real trip.",
  },
  {
    id: "bangkok-food",
    location: "Bangkok",
    title: "Follow the flavor through Yaowarat",
    overview: "Give the city an evening built around Chinatown and Talat Noi, with time to stop for small dishes instead of chasing a long list.",
    image: thailandDreamImages.food.image,
    imageAlt: thailandDreamImages.food.alt,
    experiences: {
      food: ["Street food along Yaowarat Road", "A small-plate dinner in Chinatown", "A sweet stop in Talat Noi"],
      nature: ["A canal-side neighborhood wander", "A shaded pause away from the busiest lanes"],
      city: ["Talat Noi's old shophouses", "Chinatown after dark", "A riverfront evening walk"],
      mix: ["Talat Noi's neighborhood texture", "A street-food wander through Yaowarat", "One memorable shared meal"],
    },
  },
  {
    id: "bangkok-open",
    location: "Bangkok",
    title: "Leave a little room in the city",
    overview: "Keep a flexible Bangkok day for the place that catches your attention, whether that is a museum, market, café, or another turn by the river.",
    image: thailandDreamImages.bangkok.image,
    imageAlt: thailandDreamImages.bangkok.alt,
    experiences: {
      food: ["A market breakfast", "A restaurant chosen on the day", "A long coffee between neighborhoods"],
      nature: ["A green space and a slower afternoon", "A quiet canal or riverside view"],
      city: ["A market or gallery browse", "A neighborhood chosen on the day", "Bangkok from a different angle"],
      mix: ["A local market", "A neighborhood wander", "Time with no fixed destination"],
    },
  },
  {
    id: "ayutthaya-day",
    location: "Ayutthaya",
    title: "A day among Ayutthaya's ruins",
    overview: "Trade the modern city for the historic island of Ayutthaya, where temple remains and wide skies make a thoughtful day away from Bangkok.",
    image: thailandDreamImages.ayutthaya.image,
    imageAlt: thailandDreamImages.ayutthaya.alt,
    experiences: {
      food: ["A regional lunch near the historic park", "A riverside snack before returning"],
      nature: ["A slow walk among ancient trees", "Open space around the ruins", "A quiet river view"],
      city: ["Wat Mahathat and its prang", "The wider Ayutthaya Historical Park", "A glimpse of the old capital's scale"],
      mix: ["The Ayutthaya Historical Park", "A local lunch", "Time to take in the landscape"],
    },
    practicalNote: "Ayutthaya works best as a regional day excursion with transport time protected on both sides; exact routing can be refined later.",
  },
  {
    id: "bangkok-depart",
    location: "Bangkok",
    title: "Leave with one last favorite",
    overview: "Keep the final morning close to your base, revisit a small favorite, and leave space for the journey home.",
    image: thailandDreamImages.bangkok.image,
    imageAlt: thailandDreamImages.bangkok.alt,
    experiences: {
      food: ["A final bowl of noodles", "A small treat for the journey"],
      nature: ["A last riverside pause", "A quiet morning walk"],
      city: ["One final neighborhood loop", "A last city view"],
      mix: ["A favorite revisit", "A final meal or coffee"],
    },
    practicalNote: "Departure day stays intentionally open; airport and onward travel details will shape the final timing.",
  },
  {
    id: "chiangmai-arrive",
    location: "Chiang Mai",
    title: "Arrive in the northern rhythm",
    overview: "After the domestic journey from Bangkok, settle into Chiang Mai's Old City and keep the first northern evening close to home.",
    image: thailandDreamImages.chiangMai.image,
    imageAlt: thailandDreamImages.chiangMai.alt,
    experiences: {
      food: ["A first northern Thai meal", "A short evening walk near Tha Phae Gate"],
      nature: ["A leafy hotel-area stroll", "A quiet view of the hills"],
      city: ["Tha Phae Gate at an easy pace", "A first look at the Old City walls"],
      mix: ["A local meal near the Old City", "A gentle walk after arrival"],
    },
    practicalNote: "The move between regions takes part of the day, so this is planned as a transition rather than a full sightseeing day.",
  },
  {
    id: "chiangmai-old-city",
    location: "Chiang Mai",
    title: "Find the quieter Old City",
    overview: "Move between temple courtyards, old lanes, and a long lunch, letting Chiang Mai's Lanna character reveal itself without a packed route.",
    image: thailandDreamImages.northCulture.image,
    imageAlt: thailandDreamImages.northCulture.alt,
    experiences: {
      food: ["A market breakfast", "A northern curry lunch", "A tea or coffee pause"],
      nature: ["A shaded temple garden", "A slow walk along the moat", "A green corner away from the main lanes"],
      city: ["Wat Chedi Luang", "Old City lanes around Tha Phae", "A craft or design neighborhood"],
      mix: ["Wat Chedi Luang and nearby lanes", "A northern lunch", "Time to browse at your own pace"],
    },
  },
  {
    id: "chiangmai-mountain",
    location: "Chiang Mai",
    title: "Look out from Doi Suthep",
    overview: "Give the day a change of altitude with Wat Phra That Doi Suthep, then return slowly through the city's greener and more contemporary corners.",
    image: thailandDreamImages.northCulture.image,
    imageAlt: thailandDreamImages.northCulture.alt,
    experiences: {
      food: ["A simple meal after the mountain visit", "A Nimman café stop"],
      nature: ["A mountain outlook", "A cool, green pause above the city", "A gentle return through the foothills"],
      city: ["Wat Phra That Doi Suthep", "Nimman neighborhood streets", "A local design or craft stop"],
      mix: ["Wat Phra That Doi Suthep", "A city neighborhood on the way back", "A meal chosen in the moment"],
    },
    practicalNote: "Allow for the road up and down the mountain; the exact transport plan can be chosen around the group's comfort.",
  },
  {
    id: "chiangmai-market",
    location: "Chiang Mai",
    title: "Make an evening of the markets",
    overview: "Let food and local texture lead the evening, with a market wander and enough time to pause at whichever stall or street feels inviting.",
    image: thailandDreamImages.food.image,
    imageAlt: thailandDreamImages.food.alt,
    experiences: {
      food: ["Warorot Market flavors", "A shared northern Thai dinner", "A small dessert discovery"],
      nature: ["A riverside walk after dinner", "A quiet evening pause"],
      city: ["Warorot Market", "The Ping River after dark", "A craft or market lane"],
      mix: ["A market browse", "A shared meal", "A relaxed riverside walk"],
    },
  },
  {
    id: "chiangmai-open",
    location: "Chiang Mai",
    title: "Keep a softer northern day",
    overview: "Leave one day open for a cooking class, a massage, a craft neighborhood, or simply more time in the place that has become a favorite.",
    image: thailandDreamImages.chiangMai.image,
    imageAlt: thailandDreamImages.chiangMai.alt,
    experiences: {
      food: ["A cooking or market-inspired meal", "A café chosen by instinct", "One last northern specialty"],
      nature: ["A slower green-space visit", "A quiet afternoon outside"],
      city: ["Nimman neighborhood browsing", "A craft or gallery stop", "One last Old City walk"],
      mix: ["A favorite neighborhood revisited", "A slow meal", "Time without a checklist"],
    },
  },
  {
    id: "chiangmai-depart",
    location: "Chiang Mai",
    title: "Leave the north gently",
    overview: "Keep the last morning simple, with one final meal or walk before the onward journey begins.",
    image: thailandDreamImages.chiangMai.image,
    imageAlt: thailandDreamImages.chiangMai.alt,
    experiences: {
      food: ["A final khao soi or breakfast", "A small market treat"],
      nature: ["A last garden pause", "A quiet view of the hills"],
      city: ["One last Old City loop", "A final café or craft stop"],
      mix: ["A favorite morning walk", "A last northern meal"],
    },
    practicalNote: "The final day leaves room for airport transfer and onward travel rather than promising a full activity window.",
  },
  {
    id: "phuket-arrive",
    location: "Phuket",
    title: "Arrive to the Andaman light",
    overview: "Settle into a Phuket base, take in the first sea view, and keep the opening evening close enough to feel easy after the journey.",
    image: thailandDreamImages.phuket.image,
    imageAlt: thailandDreamImages.phuket.alt,
    experiences: {
      food: ["A first seafood meal", "A gentle walk near the shore"],
      nature: ["A first look at the Andaman coast", "A sunset pause close to your stay"],
      city: ["A nearby neighborhood introduction", "A first local market browse"],
      mix: ["A welcoming meal by the water", "A short coastal walk"],
    },
    practicalNote: "Arrival day stays open because the best base and airport transfer will shape the first evening.",
  },
  {
    id: "phuket-coast",
    location: "Phuket",
    title: "Let the coast set the pace",
    overview: "Choose one stretch of coast, such as Kata or Karon, and give the day enough room for swimming, shade, and a long meal.",
    image: thailandDreamImages.phuket.image,
    imageAlt: thailandDreamImages.phuket.alt,
    experiences: {
      food: ["A beachside lunch", "Fresh fruit and a cool drink", "A relaxed dinner near the shore"],
      nature: ["Kata or Karon beach time", "A coastal viewpoint", "A slow walk between coves"],
      city: ["A local beach neighborhood", "A market or café near the coast"],
      mix: ["A favorite beach", "A coastal outlook", "A long lunch by the water"],
    },
  },
  {
    id: "phuket-old-town",
    location: "Phuket",
    title: "See the island beyond the beach",
    overview: "Spend part of the day in Phuket Old Town, then follow the island toward a temple or viewpoint without trying to cover every corner.",
    image: thailandDreamImages.phuketOldTown.image,
    imageAlt: thailandDreamImages.phuketOldTown.alt,
    experiences: {
      food: ["Peranakan-influenced flavors in Old Town", "A local dessert stop", "A sunset meal"],
      nature: ["A viewpoint over the bays", "A green pause between stops"],
      city: ["Phuket Old Town's colorful shophouses", "Wat Chalong", "A walk through the old streets"],
      mix: ["Phuket Old Town", "A cultural stop", "A view back toward the coast"],
    },
    practicalNote: "The island's roads can make a short list take longer than expected; keep the final route flexible.",
  },
  {
    id: "phuket-island",
    location: "Phuket",
    title: "Take to the water",
    overview: "Make one boat outing the day's anchor, with time to enjoy the water and return without packing another major stop around it.",
    image: thailandDreamImages.phuket.image,
    imageAlt: thailandDreamImages.phuket.alt,
    experiences: {
      food: ["A simple lunch on the water", "A seafood dinner after returning"],
      nature: ["A nearshore island or bay outing", "Clear water and limestone views", "A quiet swim or shoreline pause"],
      city: ["A harbor-side morning", "A different perspective on Phuket"],
      mix: ["A boat day shaped around the sea", "A local meal", "Time to return slowly"],
    },
    practicalNote: "Boat routes depend on weather, season and the chosen operator; this is an inspiration anchor, not a reserved excursion.",
  },
  {
    id: "phuket-scenic",
    location: "Phuket",
    title: "Stay out for the changing light",
    overview: "Keep the day spacious and let the island's viewpoints, beaches and late light become the experience rather than a checklist.",
    image: thailandDreamImages.phuket.image,
    imageAlt: thailandDreamImages.phuket.alt,
    experiences: {
      food: ["A slow brunch", "A final meal with a sea view"],
      nature: ["Karon Viewpoint or a comparable outlook", "Laem Phromthep at the edge of the day", "A final beach pause"],
      city: ["A favorite neighborhood revisit", "A market or café stop"],
      mix: ["An island viewpoint", "A favorite beach", "A meal chosen on the day"],
    },
  },
  {
    id: "phuket-open",
    location: "Phuket",
    title: "Keep one day wonderfully open",
    overview: "Return to the place that stayed with you, try a new corner, or let the weather decide the shape of the day.",
    image: thailandDreamImages.phuketOldTown.image,
    imageAlt: thailandDreamImages.phuketOldTown.alt,
    experiences: {
      food: ["A favorite local breakfast", "A market lunch", "A last drink by the water"],
      nature: ["A quiet cove or beach", "A restorative afternoon", "One more coastal walk"],
      city: ["A second look at Old Town", "A local craft or café stop"],
      mix: ["A favorite place revisited", "One small new discovery", "Time without a fixed route"],
    },
  },
  {
    id: "phuket-depart",
    location: "Phuket",
    title: "Leave with the sea in mind",
    overview: "Keep the final morning close to your base, with a last look at the water before the journey home.",
    image: thailandDreamImages.phuket.image,
    imageAlt: thailandDreamImages.phuket.alt,
    experiences: {
      food: ["A final beachside breakfast", "A small treat for the journey"],
      nature: ["One last shoreline walk", "A final view of the coast"],
      city: ["A quick local-market browse", "A last neighborhood look"],
      mix: ["A final swim or walk", "A last meal close to your stay"],
    },
    practicalNote: "Departure timing will determine how much of the morning is practical; the ending stays deliberately unhurried.",
  },
];

export const southKoreaDreamImages = {
  hero: {
    image: unsplash("photo-1702738713665-f56f60c0b4b0", 2200),
    alt: "Seoul skyline with hills and the Han River in the distance",
  },
  palace: {
    image: unsplash("photo-1540998145333-e2eef1a9822d", 1200),
    alt: "Traditional Korean palace architecture framed by trees",
  },
  bukchon: {
    image: unsplash("photo-1670735411734-c9725326de3f", 1200),
    alt: "Traditional hanok rooftops in a Seoul neighborhood",
  },
  city: {
    image: unsplash("photo-1617283458655-1ef09d4f17f2", 1200),
    alt: "Seoul streets glowing after dark",
  },
  nature: {
    image: unsplash("photo-1527355903589-ef4e7e0f6421", 1200),
    alt: "A green walking path through a Korean city landscape",
  },
  busan: {
    image: unsplash("photo-1583833008338-31a6657917ab", 1200),
    alt: "A South Korean city skyline rising beyond the water",
  },
  gamcheon: {
    image: unsplash("photo-1579085353237-916e72ecb32d", 1200),
    alt: "Colorful hillside architecture in South Korea",
  },
  gyeongju: {
    image: unsplash("photo-1684134549350-be5fd0d8feaa", 1200),
    alt: "A historic Korean site surrounded by green landscape",
  },
  food: {
    image: unsplash("photo-1605478371310-a9f1e96b4ff4", 1200),
    alt: "A Korean meal set on a traditional table",
  },
} as const;

export const southKoreaDreamDayTemplates: DreamDayTemplate[] = [
  {
    id: "seoul-arrive",
    location: "Seoul",
    title: "Arrive into Seoul's rhythm",
    overview: "Settle in, keep the first walk close to your base, and let the city arrive gently after the international journey.",
    image: southKoreaDreamImages.hero.image,
    imageAlt: southKoreaDreamImages.hero.alt,
    experiences: {
      food: ["A first meal near your Seoul base", "A gentle market or café stop"],
      nature: ["A short Han River or park pause", "A quiet neighborhood walk"],
      city: ["A first look at Seoul's lights", "A simple orientation walk"],
      mix: ["A welcoming Korean meal", "A relaxed first neighborhood look"],
    },
    practicalNote: "Arrival day stays light so the journey into Korea does not dictate the pace of the whole trip.",
  },
  {
    id: "seoul-palace",
    location: "Seoul",
    title: "Gyeongbokgung and the old lanes",
    overview: "Use Gyeongbokgung Palace as the anchor, then continue through Bukchon Hanok Village and Insadong at a walkable, unhurried pace.",
    image: southKoreaDreamImages.palace.image,
    imageAlt: southKoreaDreamImages.palace.alt,
    experiences: {
      food: ["A tea or snack stop in Insadong", "A market meal after the palace"],
      nature: ["Gyeongbokgung's open courtyards", "A slower walk toward Bukchon"],
      city: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "Insadong's traditional streets"],
      mix: ["Gyeongbokgung Palace", "Bukchon Hanok Village", "An Insadong wander"],
    },
    practicalNote: "Bukchon is a lived-in residential neighborhood; check current visitor guidance and keep the walking route considerate and quiet.",
  },
  {
    id: "seoul-neighborhoods",
    location: "Seoul",
    title: "Choose your Seoul neighborhood",
    overview: "Let one district lead the day, whether that means Hongdae's creative energy, Myeongdong's bright streets, or a slower market wander.",
    image: southKoreaDreamImages.bukchon.image,
    imageAlt: southKoreaDreamImages.bukchon.alt,
    experiences: {
      food: ["Gwangjang Market flavors", "A neighborhood barbecue or noodle stop", "A café chosen on the day"],
      nature: ["A green pause beside the Han River", "A slower neighborhood walk", "Time to rest between districts"],
      city: ["Hongdae street life", "Myeongdong's shopping lanes", "An evening district to explore"],
      mix: ["A market or local food stop", "A neighborhood chosen by curiosity", "Time without a checklist"],
    },
  },
  {
    id: "seoul-namsan",
    location: "Seoul",
    title: "See the city from Namsan",
    overview: "Pair a walk through Namsan Park with the view from N Seoul Tower, then come back down for an evening in Itaewon or another favorite district.",
    image: southKoreaDreamImages.city.image,
    imageAlt: southKoreaDreamImages.city.alt,
    experiences: {
      food: ["A warm meal after the hill walk", "A late café or dessert stop"],
      nature: ["Namsan Park's wooded paths", "A city view framed by green slopes"],
      city: ["N Seoul Tower viewpoint", "Itaewon or a nearby evening district", "Seoul after dark"],
      mix: ["A walk through Namsan Park", "N Seoul Tower viewpoint", "An easy evening meal"],
    },
    practicalNote: "The hill and return route add real walking to the day; leave room to adjust around the group's comfort.",
  },
  {
    id: "seoul-haneul",
    location: "Seoul",
    title: "Find a greener side of Seoul",
    overview: "Trade the busiest streets for Haneul Park or a Han River stretch, keeping the day open enough for a slower outdoor rhythm.",
    image: southKoreaDreamImages.nature.image,
    imageAlt: southKoreaDreamImages.nature.alt,
    experiences: {
      food: ["A picnic-style market lunch", "A neighborhood dinner after the park"],
      nature: ["Haneul Park paths and wide views", "A Han River walk", "A quiet green-space pause"],
      city: ["A different view of Seoul's skyline", "A nearby neighborhood café", "An easy evening back in the city"],
      mix: ["A greener city walk", "A Han River pause", "A meal close to your base"],
    },
    practicalNote: "Outdoor routes are weather-dependent, so keep a nearby indoor alternative in mind.",
  },
  {
    id: "seoul-open",
    location: "Seoul",
    title: "Leave a day open in Seoul",
    overview: "Keep one flexible day for the district, museum, café, or market that becomes a favorite once you are there.",
    image: southKoreaDreamImages.city.image,
    imageAlt: southKoreaDreamImages.city.alt,
    experiences: {
      food: ["A second look at Gwangjang Market", "A meal chosen by instinct", "One last dessert stop"],
      nature: ["A favorite park revisited", "A quiet river walk", "An unhurried afternoon"],
      city: ["A new Hongdae or Myeongdong turn", "A gallery, shop, or design stop", "Seoul after dark"],
      mix: ["A favorite neighborhood revisited", "One small new discovery", "Time without a fixed route"],
    },
  },
  {
    id: "seoul-depart",
    location: "Seoul",
    title: "Leave with one last favorite",
    overview: "Keep the final morning near your base, with one last meal or short walk before airport and onward travel.",
    image: southKoreaDreamImages.hero.image,
    imageAlt: southKoreaDreamImages.hero.alt,
    experiences: {
      food: ["A final breakfast favorite", "A small market treat for the journey"],
      nature: ["A last green pause", "A quiet neighborhood walk"],
      city: ["One final street loop", "A last city view"],
      mix: ["A favorite revisit", "A final Korean meal or coffee"],
    },
    practicalNote: "Departure day stays intentionally open; airport timing will determine what is practical.",
  },
  {
    id: "busan-arrive",
    location: "Busan",
    title: "Arrive by the water",
    overview: "After the intercity journey from Seoul, settle near the coast and keep the first Busan evening close to your base.",
    image: southKoreaDreamImages.busan.image,
    imageAlt: southKoreaDreamImages.busan.alt,
    experiences: {
      food: ["A first seafood meal near the coast", "A short market or café stop"],
      nature: ["A first look at Busan's shoreline", "A gentle Haeundae walk"],
      city: ["A simple orientation around your base", "A first coastal neighborhood look"],
      mix: ["A welcoming meal by the water", "A relaxed evening walk"],
    },
    practicalNote: "The Seoul-to-Busan move takes part of the day, so this is a transition rather than a full sightseeing window.",
  },
  {
    id: "busan-gamcheon",
    location: "Busan",
    title: "Color and stories in Gamcheon",
    overview: "Follow the hillside lanes of Gamcheon Culture Village, then continue toward Nampo or Jagalchi for a different view of Busan's port-city character.",
    image: southKoreaDreamImages.gamcheon.image,
    imageAlt: southKoreaDreamImages.gamcheon.alt,
    experiences: {
      food: ["Jagalchi Market seafood flavors", "A snack in Nampo", "A warm meal after the hillside walk"],
      nature: ["A hillside view across the harbor", "A slower coastal pause", "Green space between neighborhoods"],
      city: ["Gamcheon Culture Village lanes", "Nampo's port-side streets", "Jagalchi Market"],
      mix: ["Gamcheon Culture Village", "A harbor-side market", "A meal in Nampo"],
    },
    practicalNote: "Gamcheon is a steep, lived-in hillside neighborhood; comfortable footwear and a flexible route matter.",
  },
  {
    id: "busan-haeundae",
    location: "Busan",
    title: "Let Haeundae set the pace",
    overview: "Give the coast the day: start around Haeundae Beach, add a nearby waterfront walk, and leave the evening open for the sea air.",
    image: southKoreaDreamImages.busan.image,
    imageAlt: southKoreaDreamImages.busan.alt,
    experiences: {
      food: ["A seafood lunch near Haeundae", "A café or dinner with a coastal view"],
      nature: ["Haeundae Beach", "A walk toward Dongbaekseom", "A slower shoreline pause"],
      city: ["Haeundae's lively neighborhood", "A waterfront evening", "A nearby market or café"],
      mix: ["Haeundae Beach", "A coastal walk", "A long meal by the water"],
    },
  },
  {
    id: "busan-open",
    location: "Busan",
    title: "Keep one softer Busan day",
    overview: "Leave room to return to a favorite beach, follow a café street, or choose another harbor view once the city has started to feel familiar.",
    image: southKoreaDreamImages.city.image,
    imageAlt: southKoreaDreamImages.city.alt,
    experiences: {
      food: ["A market breakfast", "A second seafood meal", "A small dessert discovery"],
      nature: ["A favorite shoreline revisited", "A quiet harbor view", "Time to slow down outdoors"],
      city: ["A neighborhood chosen on the day", "A market or gallery browse", "Busan after dark"],
      mix: ["A favorite place revisited", "One new neighborhood turn", "Time without a checklist"],
    },
  },
  {
    id: "busan-coast",
    location: "Busan",
    title: "Follow the coast a little farther",
    overview: "Keep the final full Busan day spacious, with a shoreline walk, a harbor view, and enough time to return to the meal or neighborhood you liked best.",
    image: southKoreaDreamImages.busan.image,
    imageAlt: southKoreaDreamImages.busan.alt,
    experiences: {
      food: ["A seafood lunch near the harbor", "A final café or market stop"],
      nature: ["A coastal walk", "A harbor viewpoint", "A slow late-afternoon pause"],
      city: ["A port-side neighborhood", "A market or waterfront district", "Busan's evening lights"],
      mix: ["A different stretch of coast", "A harbor-side meal", "Time to revisit a favorite"],
    },
    practicalNote: "Keep the route flexible around weather and local transport; this day is a set of anchors, not a fixed schedule.",
  },
  {
    id: "busan-depart",
    location: "Busan",
    title: "Leave the coast gently",
    overview: "Keep the last morning close to your base, with one final look at the water before airport or onward travel.",
    image: southKoreaDreamImages.busan.image,
    imageAlt: southKoreaDreamImages.busan.alt,
    experiences: {
      food: ["A final soup or breakfast", "A small market treat"],
      nature: ["One last shoreline walk", "A final view across the water"],
      city: ["A quick neighborhood loop", "A final café or market look"],
      mix: ["A favorite morning walk", "A last meal by the coast"],
    },
    practicalNote: "The final day leaves room for airport transfer and onward travel rather than promising a full activity window.",
  },
  {
    id: "gyeongju-day",
    location: "Gyeongju",
    title: "A day in ancient Gyeongju",
    overview: "Use a day excursion from Busan to explore a few Silla-era landmarks, grouping the historic sites so the route has space to breathe.",
    image: southKoreaDreamImages.gyeongju.image,
    imageAlt: southKoreaDreamImages.gyeongju.alt,
    experiences: {
      food: ["A regional lunch in Gyeongju", "A tea or sweet pause before returning"],
      nature: ["The open landscape around the historic sites", "A quiet walk near Wolji Pond", "A slower return to Busan"],
      city: ["Bulguksa Temple", "Daereungwon Ancient Tomb Complex", "Donggung Palace and Wolji Pond"],
      mix: ["A Silla-era heritage site", "A local lunch", "A quiet historic landscape"],
    },
    practicalNote: "Gyeongju works as a day excursion when transport time is protected; current connections and site arrangements should be confirmed before travel.",
  },
];
