import {
  japanDreamDayTemplates,
  thailandDreamDayTemplates,
  southKoreaDreamDayTemplates,
  type DreamDayTemplate,
  type DreamDestinationSlug,
  type DreamDuration,
  type DreamGroup,
  type DreamInterest,
  type DreamPace,
  type DreamTripAnswers,
} from "../data/dreamTrips.ts";

export type DreamTripDay = {
  day: number;
  location: string;
  title: string;
  overview: string;
  experiences: string[];
  image: string;
  imageAlt: string;
  practicalNote?: string;
};

export type DreamTripPreview = {
  destination: DreamDestinationSlug;
  destinationName: string;
  title: string;
  subtitle: string;
  intro: string;
  routeLabel: string;
  durationLabel: string;
  days: DreamTripDay[];
  groupLabel: string;
  interestLabel: string;
  paceLabel: string;
};

export type DreamTripHandoff = {
  destination: string;
  travelers: string;
  style: string;
  summary: string;
  personalized: boolean;
};

type DestinationDreamConfig = {
  slug: DreamDestinationSlug;
  name: string;
  templates: DreamDayTemplate[];
  routes: Record<DreamDuration, string[]>;
  routesByInterest?: Partial<Record<DreamInterest, Record<DreamDuration, string[]>>>;
  routeLabels: Record<DreamDuration, string>;
  groupIntroductions: Record<DreamGroup, string>;
  groupNotes: Record<DreamGroup, string>;
  interestLabels: Record<DreamInterest, string>;
  interestDescriptions: Record<DreamInterest, string>;
  budgetGuidance: string;
  stayAreas: { name: string; description: string }[];
};

const groupLabels: Record<DreamGroup, string> = {
  sample: "Sample travel profile",
  solo: "Solo journey",
  couple: "A couple's escape",
  family: "Family adventure",
  friends: "A trip with friends",
};

const paceLabels: Record<DreamPace, string> = {
  slow: "Slow and relaxed",
  balanced: "A comfortable balance",
  full: "See as much as possible",
};

const durationLabels: Record<DreamDuration, string> = {
  3: "3 days / 2 nights",
  4: "4 days / 3 nights",
  5: "5 days / 4 nights",
  7: "7 days / 6 nights",
  10: "10 days / 9 nights",
};

const durationWords: Record<DreamDuration, string> = {
  3: "Three",
  4: "Four",
  5: "Five",
  7: "Seven",
  10: "Ten",
};

const japanRoutes: Record<DreamDuration, string[]> = {
  3: ["tokyo-arrive", "tokyo-neighborhoods", "tokyo-depart"],
  4: ["tokyo-arrive", "tokyo-neighborhoods", "tokyo-highlight", "tokyo-depart"],
  5: ["tokyo-arrive", "tokyo-neighborhoods", "tokyo-highlight", "hakone-pause", "tokyo-depart"],
  7: ["tokyo-arrive", "tokyo-neighborhoods", "tokyo-highlight", "kyoto-arrive", "kyoto-culture", "kyoto-open-day", "kyoto-depart"],
  10: ["tokyo-arrive", "tokyo-neighborhoods", "tokyo-highlight", "hakone-pause", "kyoto-arrive", "kyoto-culture", "kyoto-open-day", "osaka-food", "nara-day", "osaka-close"],
};

const japanNatureRoutes: Record<DreamDuration, string[]> = {
  ...japanRoutes,
  4: ["tokyo-arrive", "tokyo-neighborhoods", "hakone-pause", "tokyo-depart"],
};

const thailandRoutes: Record<DreamDuration, string[]> = {
  3: ["bangkok-arrive", "bangkok-old-city", "bangkok-depart"],
  4: ["bangkok-arrive", "bangkok-old-city", "bangkok-food", "bangkok-depart"],
  5: ["bangkok-arrive", "bangkok-old-city", "ayutthaya-day", "bangkok-food", "bangkok-depart"],
  7: ["bangkok-arrive", "bangkok-old-city", "bangkok-food", "chiangmai-arrive", "chiangmai-old-city", "chiangmai-mountain", "chiangmai-depart"],
  10: ["bangkok-arrive", "bangkok-old-city", "ayutthaya-day", "bangkok-food", "chiangmai-arrive", "chiangmai-old-city", "chiangmai-mountain", "chiangmai-market", "chiangmai-open", "chiangmai-depart"],
};

const thailandNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["phuket-arrive", "phuket-coast", "phuket-depart"],
  4: ["phuket-arrive", "phuket-coast", "phuket-old-town", "phuket-depart"],
  5: ["phuket-arrive", "phuket-coast", "phuket-island", "phuket-open", "phuket-depart"],
  7: ["phuket-arrive", "phuket-coast", "phuket-island", "phuket-old-town", "phuket-scenic", "phuket-open", "phuket-depart"],
  10: ["phuket-arrive", "phuket-coast", "phuket-island", "phuket-scenic", "phuket-open", "chiangmai-arrive", "chiangmai-old-city", "chiangmai-mountain", "chiangmai-open", "chiangmai-depart"],
};

const southKoreaRoutes: Record<DreamDuration, string[]> = {
  3: ["seoul-arrive", "seoul-palace", "seoul-depart"],
  4: ["seoul-arrive", "seoul-palace", "seoul-neighborhoods", "seoul-depart"],
  5: ["seoul-arrive", "seoul-palace", "seoul-neighborhoods", "seoul-namsan", "seoul-depart"],
  7: ["seoul-arrive", "seoul-palace", "seoul-neighborhoods", "busan-arrive", "busan-gamcheon", "busan-haeundae", "busan-depart"],
  10: ["seoul-arrive", "seoul-palace", "seoul-neighborhoods", "seoul-namsan", "busan-arrive", "busan-gamcheon", "busan-haeundae", "gyeongju-day", "busan-open", "busan-depart"],
};

const southKoreaNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["seoul-arrive", "seoul-haneul", "seoul-depart"],
  4: ["seoul-arrive", "seoul-haneul", "seoul-namsan", "seoul-depart"],
  5: ["seoul-arrive", "seoul-haneul", "seoul-namsan", "seoul-open", "seoul-depart"],
  7: ["seoul-arrive", "seoul-haneul", "seoul-namsan", "busan-arrive", "busan-haeundae", "busan-gamcheon", "busan-depart"],
  10: ["seoul-arrive", "seoul-haneul", "seoul-namsan", "busan-arrive", "busan-haeundae", "busan-gamcheon", "gyeongju-day", "busan-open", "busan-coast", "busan-depart"],
};

const japanInterestLabels: Record<DreamInterest, string> = {
  food: "Food and culture",
  nature: "Nature and scenery",
  city: "City adventures",
  mix: "A little of everything",
};

const japanInterestDescriptions: Record<DreamInterest, string> = {
  food: "Markets, neighborhoods and memorable meals.",
  nature: "Gardens, mountains and slower views.",
  city: "Bright streets, design and local rhythm.",
  mix: "A balanced introduction to Japan.",
};

const japanGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced introduction to Japan, with room for memorable meals, neighborhoods and the journey between them.",
  solo: "A thoughtful solo journey with room to follow your curiosity.",
  couple: "A shared escape with memorable meals, beautiful neighborhoods and time to wander together.",
  family: "A family escape filled with discovery, amazing food and moments worth remembering together.",
  friends: "A lively trip with shared discoveries, good food and enough freedom for everyone to enjoy it their way.",
};

const japanGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample keeps a little structure and a little freedom so you can decide what kind of Japan trip feels right.",
  solo: "Keep one flexible pocket of time so you can follow a new idea or favorite neighborhood.",
  couple: "Build in space for a meal or walk that belongs only to the two of you.",
  family: "Leave room for snacks, pauses and a reset before the next discovery.",
  friends: "A little shared planning leaves everyone room to choose their own favorite moment.",
};

const thailandInterestLabels: Record<DreamInterest, string> = {
  food: "Food, markets and culture",
  nature: "Islands and nature",
  city: "City energy",
  mix: "A little of everything",
};

const thailandInterestDescriptions: Record<DreamInterest, string> = {
  food: "Street food, markets and local neighborhoods.",
  nature: "Coastlines, islands and greener horizons.",
  city: "Temples, city streets and everyday rhythm.",
  mix: "A balanced first look at Thailand.",
};

const thailandGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Thailand, with street food, temple neighborhoods, green landscapes and easy pauses.",
  solo: "A flexible Thailand journey with room to follow your curiosity from city streets to quieter corners.",
  couple: "A shared escape built around memorable meals, warm evenings and time to slow down together.",
  family: "A family-friendly rhythm with cultural discoveries, generous meals and space to reset between days out.",
  friends: "A lively Thailand trip with shared food discoveries, colorful neighborhoods and room for everyone's favorite detour.",
};

const thailandGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Thailand story is more about city energy, culture, coast or a little of everything.",
  solo: "Keep transfers simple and leave one flexible pocket of time for a market, café or view that catches your attention.",
  couple: "Build in a slower evening after a day out so the trip has room for meals and moments that belong to both of you.",
  family: "Protect shade, snacks and reset time, especially on hot days or when a region change is part of the route.",
  friends: "Choose a few shared anchors, then leave room for everyone to follow a favorite flavor, market or neighborhood.",
};

const southKoreaInterestLabels: Record<DreamInterest, string> = {
  food: "Food, markets and culture",
  nature: "Parks, coast and open views",
  city: "City neighborhoods and night lights",
  mix: "A little of everything",
};

const southKoreaInterestDescriptions: Record<DreamInterest, string> = {
  food: "Markets, neighborhood meals and cultural texture.",
  nature: "Parks, coastline and quieter outdoor pauses.",
  city: "Lively districts, views and urban discoveries.",
  mix: "A balanced first look at South Korea.",
};

const southKoreaGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at South Korea, with palace neighborhoods, lively food streets, a coastal change of scenery and room to pause.",
  solo: "A flexible South Korea journey with room to follow a favorite neighborhood, market or view.",
  couple: "A shared escape through old lanes, memorable meals and the changing light of Seoul and the coast.",
  family: "A family-friendly rhythm with cultural discoveries, easy food stops and space to reset between city days.",
  friends: "A lively trip with shared markets, colorful neighborhoods and enough freedom for everyone's favorite detour.",
};

const southKoreaGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Korea story is more about Seoul's neighborhoods, Busan's coast or a little of both.",
  solo: "Keep one flexible pocket of time for a market, café or view that catches your attention.",
  couple: "Build in an evening with no fixed stop so a meal or waterfront walk can take its own shape.",
  family: "Protect rest, shade and shorter walking alternatives, especially on palace, hillside or coastal days.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite food street, neighborhood or viewpoint.",
};

const japanConfig: DestinationDreamConfig = {
  slug: "japan",
  name: "Japan",
  templates: japanDreamDayTemplates,
  routes: japanRoutes,
  routesByInterest: { nature: japanNatureRoutes },
  routeLabels: {
    3: "A focused Tokyo introduction, with gentle arrival and departure days",
    4: "One city, with a nearby change of scenery if it suits your interests",
    5: "Tokyo and nearby Hakone, with time for a scenic change of pace",
    7: "Tokyo and Kyoto, with time for the journey between them",
    10: "Tokyo, Kyoto and Osaka, with room for the spaces between",
  },
  groupIntroductions: japanGroupIntroductions,
  groupNotes: japanGroupNotes,
  interestLabels: japanInterestLabels,
  interestDescriptions: japanInterestDescriptions,
  budgetGuidance: "For Japan, compare the cost of airfare, accommodation, city transport, intercity travel, food and experiences. Fewer bases and a slower route can make the framework easier to manage.",
  stayAreas: [
    { name: "Tokyo base", description: "Choose a neighborhood that keeps your first few city days easy to reach and leaves room for a favorite local street." },
    { name: "Kyoto base", description: "A central Kyoto neighborhood can make temple, garden and evening walks feel less rushed." },
  ],
};

const thailandConfig: DestinationDreamConfig = {
  slug: "thailand",
  name: "Thailand",
  templates: thailandDreamDayTemplates,
  routes: thailandRoutes,
  routesByInterest: { nature: thailandNatureRoutes },
  routeLabels: {
    3: "A focused Bangkok escape, with gentle arrival and departure days",
    4: "Bangkok's old neighborhoods and food streets, without a region change",
    5: "Bangkok with a considered Ayutthaya day excursion",
    7: "Bangkok and Chiang Mai, with the regional journey protected",
    10: "Bangkok and Chiang Mai, with room for Ayutthaya and slower northern days",
  },
  groupIntroductions: thailandGroupIntroductions,
  groupNotes: thailandGroupNotes,
  interestLabels: thailandInterestLabels,
  interestDescriptions: thailandInterestDescriptions,
  budgetGuidance: "For Thailand, consider airfare, accommodation, regional transfers, local transport, food and activities separately. A single-region Phuket route can simplify a nature-led trip; Bangkok and Chiang Mai add a domestic travel day.",
  stayAreas: [
    { name: "Bangkok riverside or Old City", description: "A useful starting area for temple neighborhoods, river walks and an easier first look at Bangkok." },
    { name: "Chiang Mai Old City or Nimman", description: "Choose between historic lanes and a more contemporary café-and-food rhythm, depending on the group's pace." },
    { name: "Phuket: Kata, Karon or Old Town", description: "Pick a coast-led base for beach days or Phuket Old Town for more neighborhood and food texture." },
  ],
};

const southKoreaConfig: DestinationDreamConfig = {
  slug: "south-korea",
  name: "South Korea",
  templates: southKoreaDreamDayTemplates,
  routes: southKoreaRoutes,
  routesByInterest: { nature: southKoreaNatureRoutes },
  routeLabels: {
    3: "A focused Seoul introduction, with gentle arrival and departure days",
    4: "Seoul's palace district and neighborhood energy, without a region change",
    5: "A fuller Seoul stay with time for Namsan and an open city rhythm",
    7: "Seoul and Busan, with the intercity journey protected",
    10: "Seoul, Busan and a considered Gyeongju day, with room for the transitions",
  },
  groupIntroductions: southKoreaGroupIntroductions,
  groupNotes: southKoreaGroupNotes,
  interestLabels: southKoreaInterestLabels,
  interestDescriptions: southKoreaInterestDescriptions,
  budgetGuidance: "For South Korea, consider international airfare, accommodation, intercity transport, local transit, food and attractions separately. Fewer bases and a slower route can make a multi-city trip easier to manage.",
  stayAreas: [
    { name: "Seoul: Jongno or Myeongdong", description: "A central base can keep palace, market and old-neighborhood days relatively close, while Myeongdong adds an easy evening food and shopping rhythm." },
    { name: "Seoul: Hongdae", description: "A lively option for cafés, music and late streets, with a different feel from the historic palace districts." },
    { name: "Busan: Haeundae", description: "A coast-led base for Haeundae Beach, waterfront walks and slower evenings by the sea." },
    { name: "Busan: Nampo or Seomyeon", description: "Consider these for market access, central connections and a more street-level Busan rhythm." },
  ],
};

const dreamConfigs: Record<DreamDestinationSlug, DestinationDreamConfig> = {
  japan: japanConfig,
  thailand: thailandConfig,
  "south-korea": southKoreaConfig,
};

const findTemplate = (config: DestinationDreamConfig, id: string) =>
  config.templates.find((template) => template.id === id) ?? config.templates[0];

export const getDreamDestination = (slug: string | undefined) =>
  slug && slug in dreamConfigs ? dreamConfigs[slug as DreamDestinationSlug] : undefined;

export function createDreamTrip(answers: DreamTripAnswers): DreamTripPreview;
export function createDreamTrip(destination: DreamDestinationSlug, answers: DreamTripAnswers): DreamTripPreview;
export function createDreamTrip(destinationOrAnswers: DreamDestinationSlug | DreamTripAnswers, maybeAnswers?: DreamTripAnswers): DreamTripPreview {
  const destination = typeof destinationOrAnswers === "string" ? destinationOrAnswers : "japan";
  const answers = typeof destinationOrAnswers === "string" ? maybeAnswers : destinationOrAnswers;
  if (!answers) throw new Error("Dream Trip answers are required.");

  const config = dreamConfigs[destination];
  const activityCount = answers.pace === "slow" ? 1 : answers.pace === "balanced" ? 2 : 3;
  const routeSource = config.routesByInterest?.[answers.interest] ?? config.routes;
  const route = routeSource[answers.duration];
  const days = route.map((templateId, index) => {
    const template = findTemplate(config, templateId);
    const experiences = template.experiences[answers.interest].slice(0, activityCount);
    const practicalNote = template.practicalNote ?? (answers.group === "family" ? config.groupNotes.family : undefined);

    return {
      day: index + 1,
      location: template.location,
      title: template.title,
      overview: template.overview,
      experiences,
      image: template.image,
      imageAlt: template.imageAlt,
      practicalNote,
    };
  });

  return {
    destination: config.slug,
    destinationName: config.name,
    title: `${durationWords[answers.duration]} unforgettable days in ${config.name}.`,
    subtitle: config.groupIntroductions[answers.group],
    intro: `Shaped around ${config.interestLabels[answers.interest].toLowerCase()} and ${paceLabels[answers.pace].toLowerCase()}, this is one possible way your ${config.name} story could unfold.`,
    routeLabel: config.routeLabels[answers.duration],
    durationLabel: durationLabels[answers.duration],
    days,
    groupLabel: groupLabels[answers.group],
    interestLabel: config.interestLabels[answers.interest],
    paceLabel: paceLabels[answers.pace],
  };
}

export function buildDreamTripHandoff(answers: DreamTripAnswers, preview: DreamTripPreview, personalized: boolean): DreamTripHandoff {
  return {
    destination: preview.destinationName,
    travelers: personalized ? answers.travelers >= 5 ? "5+" : String(answers.travelers) : "",
    style: personalized ? answers.group === "friends" || answers.group === "family" ? "family" : answers.group : "",
    summary: `${personalized ? "Personalized from visitor choices." : "Sample itinerary — preferences not selected."} Destination: ${preview.destinationName}. Duration: ${preview.durationLabel}. ${preview.title} ${preview.subtitle} Interests: ${preview.interestLabel}. Pace: ${preview.paceLabel}. Route: ${preview.routeLabel}.`,
    personalized,
  };
}

export const getGroupLabel = (group: DreamGroup) => groupLabels[group];
export const getInterestLabel = (interest: DreamInterest) => japanInterestLabels[interest];
export const getPaceLabel = (pace: DreamPace) => paceLabels[pace];
export function getGroupNote(group: DreamGroup): string;
export function getGroupNote(destination: DreamDestinationSlug, group: DreamGroup): string;
export function getGroupNote(destinationOrGroup: DreamDestinationSlug | DreamGroup, maybeGroup?: DreamGroup) {
  if (maybeGroup) return dreamConfigs[destinationOrGroup as DreamDestinationSlug].groupNotes[maybeGroup];
  return japanGroupNotes[destinationOrGroup as DreamGroup];
}
export const getDurationLabel = (duration: DreamDuration) => durationLabels[duration];
export const getInterestOptions = (destination: DreamDestinationSlug) => {
  const config = dreamConfigs[destination];
  return (Object.keys(config.interestLabels) as DreamInterest[]).map((value) => ({
    value,
    label: config.interestLabels[value],
    description: config.interestDescriptions[value],
  }));
};
export const getBudgetGuidance = (destination: DreamDestinationSlug) => dreamConfigs[destination].budgetGuidance;
export const getStayAreas = (destination: DreamDestinationSlug) => dreamConfigs[destination].stayAreas;
