import {
  japanDreamDayTemplates,
  thailandDreamDayTemplates,
  southKoreaDreamDayTemplates,
  hongKongDreamDayTemplates,
  baliDreamDayTemplates,
  singaporeDreamDayTemplates,
  vietnamDreamDayTemplates,
  malaysiaDreamDayTemplates,
  type DreamDayTemplate,
  type DreamDestinationSlug,
  type DreamDuration,
  type DreamGroup,
  type DreamInterest,
  type DreamPace,
  type DreamStayBaseId,
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
  /** Explicit overnight base; departure days intentionally omit this. */
  overnightBase?: DreamStayBaseId;
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
  /** Ordered, deduplicated overnight bases represented in the selected route. */
  overnightBases: DreamStayBaseId[];
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

export type DreamStayArea = {
  id: DreamStayBaseId;
  name: string;
  description: string;
};

type DestinationDreamConfig = {
  slug: DreamDestinationSlug;
  name: string;
  templates: DreamDayTemplate[];
  routes: Record<DreamDuration, string[]>;
  routesByInterest?: Partial<Record<DreamInterest, Record<DreamDuration, string[]>>>;
  routesByGroup?: Partial<Record<DreamGroup, Record<DreamDuration, string[]>>>;
  routeLabels: Record<DreamDuration, string>;
  groupIntroductions: Record<DreamGroup, string>;
  groupNotes: Record<DreamGroup, string>;
  interestLabels: Record<DreamInterest, string>;
  interestDescriptions: Record<DreamInterest, string>;
  budgetGuidance: string;
  stayAreas: DreamStayArea[];
  /** Maps each route template to the base where that night would be spent. */
  overnightBaseByTemplate: Record<string, DreamStayBaseId | undefined>;
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

const hongKongRoutes: Record<DreamDuration, string[]> = {
  3: ["hong-kong-arrive", "hong-kong-harbour", "hong-kong-depart"],
  4: ["hong-kong-arrive", "hong-kong-central", "hong-kong-harbour", "hong-kong-depart"],
  5: ["hong-kong-arrive", "hong-kong-central", "hong-kong-peak", "hong-kong-harbour", "hong-kong-depart"],
  7: ["hong-kong-arrive", "hong-kong-central", "hong-kong-peak", "hong-kong-harbour", "hong-kong-kowloon", "hong-kong-lantau", "hong-kong-depart"],
  10: ["hong-kong-arrive", "hong-kong-central", "hong-kong-peak", "hong-kong-harbour", "hong-kong-kowloon", "hong-kong-lantau", "hong-kong-open", "hong-kong-west-kowloon", "hong-kong-island", "hong-kong-depart"],
};

const hongKongFamilyRoutes: Record<DreamDuration, string[]> = {
  ...hongKongRoutes,
  10: ["hong-kong-arrive", "hong-kong-central", "hong-kong-peak", "hong-kong-harbour", "hong-kong-kowloon", "hong-kong-lantau", "hong-kong-open", "hong-kong-theme-option", "hong-kong-island", "hong-kong-depart"],
};

const hongKongNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["hong-kong-arrive", "hong-kong-peak", "hong-kong-depart"],
  4: ["hong-kong-arrive", "hong-kong-peak", "hong-kong-harbour", "hong-kong-depart"],
  5: ["hong-kong-arrive", "hong-kong-peak", "hong-kong-lantau", "hong-kong-harbour", "hong-kong-depart"],
  7: ["hong-kong-arrive", "hong-kong-peak", "hong-kong-lantau", "hong-kong-harbour", "hong-kong-island", "hong-kong-open", "hong-kong-depart"],
  10: ["hong-kong-arrive", "hong-kong-peak", "hong-kong-lantau", "hong-kong-harbour", "hong-kong-island", "hong-kong-open", "hong-kong-kowloon", "hong-kong-central", "hong-kong-nature-pause", "hong-kong-depart"],
};

const baliRoutes: Record<DreamDuration, string[]> = {
  3: ["bali-ubud-arrive", "bali-campuhan", "bali-depart"],
  4: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-depart"],
  5: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-depart"],
  7: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-uluwatu", "bali-depart"],
  10: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-to-sanur", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-nusa-dua", "bali-depart"],
};

const baliNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["bali-ubud-arrive", "bali-campuhan", "bali-depart"],
  4: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-depart"],
  5: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-depart"],
  7: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-south-open", "bali-depart"],
  10: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-to-sanur", "bali-sanur", "bali-south-open", "bali-uluwatu", "bali-nusa-dua", "bali-depart"],
};

const baliCityRoutes: Record<DreamDuration, string[]> = {
  3: ["bali-sanur-arrive", "bali-sanur", "bali-depart"],
  4: ["bali-sanur-arrive", "bali-sanur", "bali-uluwatu", "bali-depart"],
  5: ["bali-sanur-arrive", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-depart"],
  7: ["bali-sanur-arrive", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-nusa-dua", "bali-south-open", "bali-depart"],
  10: ["bali-sanur-arrive", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-nusa-dua", "bali-south-open", "bali-to-ubud", "bali-ubud-open", "bali-campuhan", "bali-depart"],
};

const baliFamilyRoutes: Record<DreamDuration, string[]> = {
  ...baliRoutes,
  5: ["bali-ubud-arrive", "bali-ubud-open", "bali-tegallalang-tirta", "bali-ubud-open", "bali-depart"],
  7: ["bali-ubud-arrive", "bali-ubud-open", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-nusa-dua", "bali-depart"],
  10: ["bali-ubud-arrive", "bali-campuhan", "bali-ubud-open", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-nusa-dua", "bali-south-open", "bali-uluwatu", "bali-depart"],
};

const baliCoupleRoutes: Record<DreamDuration, string[]> = {
  ...baliRoutes,
  7: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-tanah-lot", "bali-depart"],
  10: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-to-sanur", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-nusa-dua", "bali-depart"],
};

const baliFriendsRoutes: Record<DreamDuration, string[]> = {
  ...baliRoutes,
  7: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-to-sanur", "bali-sanur", "bali-tanah-lot", "bali-depart"],
  10: ["bali-ubud-arrive", "bali-campuhan", "bali-tegallalang-tirta", "bali-ubud-open", "bali-to-sanur", "bali-sanur", "bali-tanah-lot", "bali-uluwatu", "bali-south-open", "bali-depart"],
};

const singaporeRoutes: Record<DreamDuration, string[]> = {
  3: ["singapore-arrive", "singapore-civic", "singapore-depart"],
  4: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-depart"],
  5: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-little-india", "singapore-depart"],
  7: ["singapore-arrive", "singapore-chinatown", "singapore-gardens", "singapore-botanic", "singapore-little-india", "singapore-sentosa", "singapore-jewel-depart"],
  10: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-gardens", "singapore-botanic", "singapore-little-india", "singapore-kampong-gelam", "singapore-sentosa", "singapore-open", "singapore-jewel-depart"],
};

const singaporeNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["singapore-arrive", "singapore-botanic", "singapore-depart"],
  4: ["singapore-arrive", "singapore-botanic", "singapore-southern-ridges", "singapore-depart"],
  5: ["singapore-arrive", "singapore-botanic", "singapore-southern-ridges", "singapore-sentosa", "singapore-depart"],
  7: ["singapore-arrive", "singapore-gardens", "singapore-botanic", "singapore-southern-ridges", "singapore-sentosa", "singapore-open", "singapore-jewel-depart"],
  10: ["singapore-arrive", "singapore-gardens", "singapore-botanic", "singapore-southern-ridges", "singapore-sentosa", "singapore-open", "singapore-civic", "singapore-chinatown", "singapore-kampong-gelam", "singapore-jewel-depart"],
};

const singaporeCityRoutes: Record<DreamDuration, string[]> = {
  3: ["singapore-arrive", "singapore-civic", "singapore-depart"],
  4: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-depart"],
  5: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-little-india", "singapore-depart"],
  7: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-gardens", "singapore-little-india", "singapore-kampong-gelam", "singapore-jewel-depart"],
  10: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-gardens", "singapore-little-india", "singapore-kampong-gelam", "singapore-sentosa", "singapore-southern-ridges", "singapore-open", "singapore-jewel-depart"],
};

const singaporeFamilyRoutes: Record<DreamDuration, string[]> = {
  ...singaporeRoutes,
  5: ["singapore-arrive", "singapore-gardens", "singapore-botanic", "singapore-chinatown", "singapore-depart"],
  7: ["singapore-arrive", "singapore-gardens", "singapore-botanic", "singapore-chinatown", "singapore-sentosa", "singapore-open", "singapore-depart"],
  10: ["singapore-arrive", "singapore-gardens", "singapore-botanic", "singapore-chinatown", "singapore-little-india", "singapore-sentosa", "singapore-open", "singapore-kampong-gelam", "singapore-southern-ridges", "singapore-depart"],
};

const singaporeCoupleRoutes: Record<DreamDuration, string[]> = {
  ...singaporeRoutes,
  7: ["singapore-arrive", "singapore-civic", "singapore-gardens", "singapore-kampong-gelam", "singapore-southern-ridges", "singapore-sentosa", "singapore-jewel-depart"],
  10: ["singapore-arrive", "singapore-civic", "singapore-chinatown", "singapore-gardens", "singapore-botanic", "singapore-kampong-gelam", "singapore-southern-ridges", "singapore-sentosa", "singapore-open", "singapore-jewel-depart"],
};

const singaporeFriendsRoutes: Record<DreamDuration, string[]> = {
  ...singaporeRoutes,
  7: ["singapore-arrive", "singapore-chinatown", "singapore-little-india", "singapore-gardens", "singapore-kampong-gelam", "singapore-sentosa", "singapore-jewel-depart"],
  10: ["singapore-arrive", "singapore-chinatown", "singapore-little-india", "singapore-gardens", "singapore-kampong-gelam", "singapore-civic", "singapore-sentosa", "singapore-southern-ridges", "singapore-open", "singapore-jewel-depart"],
};

const vietnamRoutes: Record<DreamDuration, string[]> = {
  3: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-depart"],
  4: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-depart"],
  5: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-ninh-binh-day", "vietnam-hanoi-depart"],
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-to-hanoi", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-open", "vietnam-ninh-binh-to-danang", "vietnam-hoi-an", "vietnam-danang-coast", "vietnam-danang-depart"],
};

const vietnamNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["vietnam-hanoi-arrive", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  4: ["vietnam-hanoi-arrive", "vietnam-ninh-binh-day", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  5: ["vietnam-hanoi-arrive", "vietnam-ninh-binh-day", "vietnam-hanoi-culture", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-open", "vietnam-ninh-binh-to-hanoi", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-open", "vietnam-ninh-binh-to-danang", "vietnam-danang-coast", "vietnam-danang-son-tra", "vietnam-hoi-an-open", "vietnam-danang-depart"],
};

const vietnamCityRoutes: Record<DreamDuration, string[]> = {
  3: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-depart"],
  4: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-depart"],
  5: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-food", "vietnam-hanoi-depart"],
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-food", "vietnam-hanoi-neighborhoods", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-food", "vietnam-hanoi-neighborhoods", "vietnam-hanoi-open", "vietnam-ninh-binh-to-danang", "vietnam-danang-arrive", "vietnam-hoi-an", "vietnam-danang-depart"],
};

const vietnamFamilyRoutes: Record<DreamDuration, string[]> = {
  ...vietnamRoutes,
  5: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-food", "vietnam-hanoi-depart"],
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-ninh-binh-day", "vietnam-hanoi-food", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-open", "vietnam-ninh-binh-to-danang", "vietnam-danang-arrive", "vietnam-hoi-an-open", "vietnam-danang-depart"],
};

const vietnamCoupleRoutes: Record<DreamDuration, string[]> = {
  ...vietnamRoutes,
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-food", "vietnam-hanoi-culture", "vietnam-ninh-binh-day", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-culture", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-open", "vietnam-ninh-binh-to-danang", "vietnam-hoi-an", "vietnam-hoi-an-open", "vietnam-danang-depart"],
};

const vietnamFriendsRoutes: Record<DreamDuration, string[]> = {
  ...vietnamRoutes,
  7: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-food", "vietnam-hanoi-neighborhoods", "vietnam-ninh-binh-day", "vietnam-hanoi-open", "vietnam-hanoi-depart"],
  10: ["vietnam-hanoi-arrive", "vietnam-hanoi-old-quarter", "vietnam-hanoi-food", "vietnam-hanoi-culture", "vietnam-hanoi-to-ninh", "vietnam-ninh-binh-trang-an", "vietnam-ninh-binh-to-danang", "vietnam-danang-coast", "vietnam-hoi-an", "vietnam-danang-depart"],
};

const malaysiaRoutes: Record<DreamDuration, string[]> = {
  3: ["malaysia-kl-arrive", "malaysia-kl-heritage", "malaysia-kl-depart"],
  4: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-kl-depart"],
  5: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-melaka-day", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-kl-heritage", "malaysia-batu-caves", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-hill", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-kl-heritage", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-hill", "malaysia-penang-open", "malaysia-penang-depart"],
};

const malaysiaNatureRoutes: Record<DreamDuration, string[]> = {
  3: ["malaysia-kl-arrive", "malaysia-batu-caves", "malaysia-kl-depart"],
  4: ["malaysia-kl-arrive", "malaysia-batu-caves", "malaysia-kl-open", "malaysia-kl-depart"],
  5: ["malaysia-kl-arrive", "malaysia-batu-caves", "malaysia-kl-open", "malaysia-melaka-day", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-batu-caves", "malaysia-to-penang", "malaysia-penang-hill", "malaysia-penang-open", "malaysia-george-town", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-batu-caves", "malaysia-kl-open", "malaysia-to-penang", "malaysia-penang-hill", "malaysia-penang-open", "malaysia-george-town", "malaysia-penang-food", "malaysia-kl-heritage", "malaysia-penang-depart"],
};

const malaysiaCityRoutes: Record<DreamDuration, string[]> = {
  3: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-depart"],
  4: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-kl-depart"],
  5: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-melaka-day", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-batu-caves", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-open", "malaysia-penang-hill", "malaysia-penang-depart"],
};

const malaysiaFamilyRoutes: Record<DreamDuration, string[]> = {
  ...malaysiaRoutes,
  5: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-kl-open", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-hill", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-kl-open", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-hill", "malaysia-penang-open", "malaysia-penang-food", "malaysia-penang-depart"],
};

const malaysiaCoupleRoutes: Record<DreamDuration, string[]> = {
  ...malaysiaRoutes,
  5: ["malaysia-kl-arrive", "malaysia-kl-heritage", "malaysia-klcc", "malaysia-melaka-day", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-kl-heritage", "malaysia-kl-open", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-hill", "malaysia-penang-open", "malaysia-penang-depart"],
};

const malaysiaFriendsRoutes: Record<DreamDuration, string[]> = {
  ...malaysiaRoutes,
  5: ["malaysia-kl-arrive", "malaysia-kl-heritage", "malaysia-batu-caves", "malaysia-melaka-day", "malaysia-kl-depart"],
  7: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-depart"],
  10: ["malaysia-kl-arrive", "malaysia-klcc", "malaysia-batu-caves", "malaysia-kl-heritage", "malaysia-to-penang", "malaysia-george-town", "malaysia-penang-food", "malaysia-penang-open", "malaysia-penang-hill", "malaysia-penang-depart"],
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

const hongKongInterestLabels: Record<DreamInterest, string> = {
  food: "Food, markets and harbour flavours",
  nature: "Islands, hills and open views",
  city: "City districts and skyline energy",
  mix: "A little of everything",
};

const hongKongInterestDescriptions: Record<DreamInterest, string> = {
  food: "Markets, local dishes and neighborhood meals.",
  nature: "Hillsides, harbour air and a slower island day.",
  city: "Dense districts, views and street-level discovery.",
  mix: "A balanced first look at Hong Kong.",
};

const hongKongGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Hong Kong, with harbour crossings, old neighborhoods, island air and room to choose what matters most.",
  solo: "A flexible Hong Kong journey with room to follow a market, view or neighborhood that catches your attention.",
  couple: "A shared city escape built around harbour light, memorable meals and time to wander side by side.",
  family: "A family-friendly rhythm with simple city anchors, optional attraction days and space to reset between outings.",
  friends: "A lively Hong Kong trip with shared food discoveries, market streets and enough freedom for everyone's favorite detour.",
};

const hongKongGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Hong Kong story is more about the city, the harbour, the islands or a little of everything.",
  solo: "Keep one flexible pocket of time for a market, café, ferry view or neighborhood you discover on the way.",
  couple: "Build in an evening with no fixed stop so a meal, harbour walk or skyline view can take its own shape.",
  family: "Check walking, weather and attraction access for your group; Hong Kong Disneyland or Ocean Park can be optional full-day anchors rather than assumptions.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite dish, market street or evening view.",
};

const baliInterestLabels: Record<DreamInterest, string> = {
  food: "Food, markets and living culture",
  nature: "Rice fields, forest and coast",
  city: "Towns, coast and local rhythm",
  mix: "A little of everything",
};

const baliInterestDescriptions: Record<DreamInterest, string> = {
  food: "Ubud meals, local markets and culture-led days.",
  nature: "Rice terraces, green walks and open-air pauses.",
  city: "Town life, coastal neighborhoods and viewpoints.",
  mix: "A balanced first look at Bali.",
};

const baliGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Bali, with Ubud's green interior, a considered base change and time by the south coast.",
  solo: "A flexible Bali journey with room to follow a favorite walk, meal or neighborhood at your own pace.",
  couple: "A shared island escape through rice landscapes, temple settings, coastal light and unhurried meals.",
  family: "A family-friendly rhythm with cultural discoveries, easy coastal pauses and room to reset between days out.",
  friends: "A lively Bali trip with shared food discoveries, green landscapes and enough freedom for everyone's favorite detour.",
};

const baliGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Bali story is more about Ubud, the coast, culture or a little of everything.",
  solo: "Keep transfers simple and leave a flexible pocket for the walk, meal or view that catches your attention.",
  couple: "Build in an evening with no fixed stop so a meal, coast walk or temple landscape can take its own shape.",
  family: "Protect shade, snacks and reset time; uneven paths, heat and long road days can change the group's comfort.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite food stop, view or neighborhood.",
};

const singaporeInterestLabels: Record<DreamInterest, string> = {
  food: "Food, hawker centres and neighborhoods",
  nature: "Gardens, coast and green walks",
  city: "City districts and architecture",
  mix: "A little of everything",
};

const singaporeInterestDescriptions: Record<DreamInterest, string> = {
  food: "Hawker centres, heritage streets and neighborhood meals.",
  nature: "Botanic Gardens, green corridors and the coast.",
  city: "Marina Bay, civic spaces and lively districts.",
  mix: "A balanced first look at Singapore.",
};

const singaporeGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Singapore, with city architecture, neighborhood food, tropical gardens and a flexible coast day.",
  solo: "A flexible Singapore journey with room to follow a favorite neighborhood, meal or green corner.",
  couple: "A shared city escape built around evening streets, thoughtful meals, gardens and time to wander together.",
  family: "A family-friendly rhythm with simple transport, green pauses, optional Sentosa choices and room to reset.",
  friends: "A lively Singapore trip with shared food discoveries, colorful districts and enough freedom for everyone's favorite detour.",
};

const singaporeGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Singapore story is more about food, gardens, city life or a little of everything.",
  solo: "Use Singapore's public transport and compact districts to keep the route flexible when a neighborhood catches your attention.",
  couple: "Build in an evening with no fixed stop so a meal, garden walk or waterfront view can take its own shape.",
  family: "Protect shade, water and rest time; Sentosa attractions and longer walks should stay optional for the group.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite hawker area, shop street or evening view.",
};

const vietnamInterestLabels: Record<DreamInterest, string> = {
  food: "Food, markets and local neighborhoods",
  nature: "Karsts, coast and green landscapes",
  city: "City streets and cultural places",
  mix: "A little of everything",
};

const vietnamInterestDescriptions: Record<DreamInterest, string> = {
  food: "Markets, coffee, regional dishes and neighborhood meals.",
  nature: "Ninh Binh karsts, river landscapes and the central coast.",
  city: "Hanoi streets, history and a considered city-to-coast contrast.",
  mix: "A balanced first look at Vietnam without an end-to-end checklist.",
};

const vietnamGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Vietnam, keeping Hanoi and the north coherent before adding Central Vietnam only when the trip has room for it.",
  solo: "A flexible Vietnam journey with room to follow a neighborhood, meal or landscape without forcing every region into one trip.",
  couple: "A shared journey through old streets, memorable meals, karst landscapes and time to slow down together.",
  family: "A family-friendly rhythm with compact city days, optional Ninh Binh scenery and protected transfer time.",
  friends: "A lively Vietnam trip with shared food discoveries, colorful streets and enough freedom for everyone's favorite detour.",
};

const vietnamGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Vietnam story is more about Hanoi, Ninh Binh, Central Vietnam or a little of everything.",
  solo: "Keep longer transfers deliberate and leave one flexible pocket for a food street, museum or view that catches your attention.",
  couple: "Build in an evening with no fixed stop so a meal, river walk or landscape can take its own shape.",
  family: "Protect shade, water and rest time; Ninh Binh steps, heat and regional travel should stay adaptable for the group.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite meal, market street or evening view.",
};

const malaysiaInterestLabels: Record<DreamInterest, string> = {
  food: "Street food, markets and heritage kitchens",
  nature: "Hill views, green pauses and open-air days",
  city: "Kuala Lumpur, heritage streets and urban life",
  mix: "A little of everything",
};

const malaysiaInterestDescriptions: Record<DreamInterest, string> = {
  food: "Hawker streets, Central Market, Melaka and Penang meals.",
  nature: "Batu Caves, Penang Hill and room to slow down outdoors.",
  city: "Kuala Lumpur landmarks, civic places and George Town's living heritage.",
  mix: "A balanced first look at Malaysia without adding a third region.",
};

const malaysiaGroupIntroductions: Record<DreamGroup, string> = {
  sample: "A balanced first look at Malaysia, keeping Kuala Lumpur central before adding Melaka or Penang only when the trip has room for the transfer.",
  solo: "A flexible Malaysia journey with room to follow a street, meal or viewpoint without trying to cover the whole country.",
  couple: "A shared west-coast escape through city lights, layered heritage, memorable meals and greener pauses above Penang.",
  family: "A family-friendly rhythm with compact Kuala Lumpur days, optional Batu Caves and a protected Penang transition.",
  friends: "A lively Malaysia trip with shared food discoveries, colorful streets and enough freedom for everyone's favorite detour.",
};

const malaysiaGroupNotes: Record<DreamGroup, string> = {
  sample: "This sample leaves room to decide whether your Malaysia story is more about Kuala Lumpur, Melaka, Penang or a little of everything.",
  solo: "Keep the regional transfer deliberate and leave one flexible pocket for a food street, gallery, hill view or neighborhood that catches your attention.",
  couple: "Build in an evening with no fixed stop so a meal, river walk or skyline view can take its own shape.",
  family: "Protect shade, water and reset time; Batu Caves steps, heat and long regional days should stay adaptable for the group.",
  friends: "Choose a few shared anchors, then let everyone follow a favorite hawker area, heritage lane or evening view.",
};

/*
 * Overnight bases are deliberately keyed by template id rather than inferred
 * from prose. This keeps accommodation guidance accurate as a route changes.
 * Departure days have no overnight base because the trip is ending.
 */
const japanOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "tokyo-arrive": "tokyo", "tokyo-neighborhoods": "tokyo", "tokyo-highlight": "tokyo", "hakone-pause": "tokyo",
  "tokyo-depart": undefined, "kyoto-arrive": "kyoto", "kyoto-culture": "kyoto", "kyoto-open-day": "kyoto", "kyoto-depart": undefined,
  "osaka-food": "osaka", "nara-day": "osaka", "osaka-close": "osaka",
};

const thailandOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "bangkok-arrive": "bangkok", "bangkok-old-city": "bangkok", "bangkok-food": "bangkok", "bangkok-open": "bangkok", "ayutthaya-day": "bangkok", "bangkok-depart": undefined,
  "chiangmai-arrive": "chiangmai", "chiangmai-old-city": "chiangmai", "chiangmai-mountain": "chiangmai", "chiangmai-market": "chiangmai", "chiangmai-open": "chiangmai", "chiangmai-depart": undefined,
  "phuket-arrive": "phuket", "phuket-coast": "phuket", "phuket-island": "phuket", "phuket-old-town": "phuket", "phuket-scenic": "phuket", "phuket-open": "phuket", "phuket-depart": undefined,
};

const southKoreaOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "seoul-arrive": "seoul", "seoul-palace": "seoul", "seoul-neighborhoods": "seoul", "seoul-namsan": "seoul", "seoul-haneul": "seoul", "seoul-open": "seoul", "seoul-depart": undefined,
  "busan-arrive": "busan", "busan-gamcheon": "busan", "busan-haeundae": "busan", "busan-open": "busan", "busan-coast": "busan", "gyeongju-day": "busan", "busan-depart": undefined,
};

const hongKongOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "hong-kong-arrive": "central", "hong-kong-central": "central", "hong-kong-peak": "central", "hong-kong-island": "central",
  "hong-kong-harbour": "tsim-sha-tsui", "hong-kong-open": "tsim-sha-tsui", "hong-kong-west-kowloon": "tsim-sha-tsui",
  "hong-kong-kowloon": "jordan", "hong-kong-lantau": "lantau", "hong-kong-theme-option": "lantau", "hong-kong-nature-pause": "lantau", "hong-kong-depart": undefined,
};

const baliOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "bali-ubud-arrive": "ubud", "bali-campuhan": "ubud", "bali-tegallalang-tirta": "ubud", "bali-ubud-open": "ubud", "bali-to-ubud": "ubud",
  "bali-to-sanur": "sanur", "bali-sanur-arrive": "sanur", "bali-sanur": "sanur", "bali-tanah-lot": "sanur", "bali-uluwatu": "sanur", "bali-south-open": "sanur",
  "bali-nusa-dua": "nusa-dua", "bali-depart": undefined,
};

const singaporeOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "singapore-arrive": "city", "singapore-civic": "city", "singapore-chinatown": "city", "singapore-gardens": "city", "singapore-botanic": "city", "singapore-little-india": "city", "singapore-kampong-gelam": "city", "singapore-open": "city", "singapore-southern-ridges": "city",
  "singapore-sentosa": "sentosa", "singapore-jewel-depart": undefined, "singapore-depart": undefined,
};

const vietnamOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "vietnam-hanoi-arrive": "hanoi", "vietnam-hanoi-old-quarter": "hanoi", "vietnam-hanoi-culture": "hanoi", "vietnam-hanoi-food": "hanoi", "vietnam-hanoi-neighborhoods": "hanoi", "vietnam-hanoi-open": "hanoi", "vietnam-ninh-binh-day": "hanoi", "vietnam-ninh-binh-to-hanoi": "hanoi", "vietnam-hanoi-depart": undefined,
  "vietnam-hanoi-to-ninh": "ninh-binh", "vietnam-ninh-binh-trang-an": "ninh-binh", "vietnam-ninh-binh-open": "ninh-binh", "vietnam-ninh-binh-to-danang": "da-nang",
  "vietnam-danang-arrive": "da-nang", "vietnam-danang-coast": "da-nang", "vietnam-danang-son-tra": "da-nang", "vietnam-hoi-an": "hoi-an", "vietnam-hoi-an-open": "hoi-an", "vietnam-danang-depart": undefined,
};

const malaysiaOvernightBases: Record<string, DreamStayBaseId | undefined> = {
  "malaysia-kl-arrive": "kuala-lumpur", "malaysia-klcc": "kuala-lumpur", "malaysia-kl-heritage": "kuala-lumpur", "malaysia-batu-caves": "kuala-lumpur", "malaysia-kl-open": "kuala-lumpur", "malaysia-melaka-day": "kuala-lumpur", "malaysia-kl-depart": undefined,
  "malaysia-to-penang": "george-town", "malaysia-george-town": "george-town", "malaysia-penang-food": "george-town", "malaysia-penang-open": "george-town", "malaysia-penang-hill": "george-town", "malaysia-penang-depart": undefined,
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
  overnightBaseByTemplate: japanOvernightBases,
  stayAreas: [
    { id: "tokyo", name: "Tokyo base", description: "Choose a neighborhood that keeps your first few city days easy to reach and leaves room for a favorite local street." },
    { id: "kyoto", name: "Kyoto base", description: "A central Kyoto neighborhood can make temple, garden and evening walks feel less rushed." },
    { id: "osaka", name: "Osaka base", description: "A lively Osaka base suits the longer route's food-led finish and keeps Nara as a considered day out." },
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
  overnightBaseByTemplate: thailandOvernightBases,
  stayAreas: [
    { id: "bangkok", name: "Bangkok riverside or Old City", description: "A useful starting area for temple neighborhoods, river walks and an easier first look at Bangkok." },
    { id: "chiangmai", name: "Chiang Mai Old City or Nimman", description: "Choose between historic lanes and a more contemporary café-and-food rhythm, depending on the group's pace." },
    { id: "phuket", name: "Phuket: Kata, Karon or Old Town", description: "Pick a coast-led base for beach days or Phuket Old Town for more neighborhood and food texture." },
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
  overnightBaseByTemplate: southKoreaOvernightBases,
  stayAreas: [
    { id: "seoul", name: "Seoul: Jongno or Myeongdong", description: "A central base can keep palace, market and old-neighborhood days relatively close, while Myeongdong adds an easy evening food and shopping rhythm." },
    { id: "seoul-hongdae", name: "Seoul: Hongdae", description: "A lively option for cafés, music and late streets, with a different feel from the historic palace districts." },
    { id: "busan", name: "Busan: Haeundae", description: "A coast-led base for Haeundae Beach, waterfront walks and slower evenings by the sea." },
    { id: "busan-nampo", name: "Busan: Nampo or Seomyeon", description: "Consider these for market access, central connections and a more street-level Busan rhythm." },
  ],
};

const hongKongConfig: DestinationDreamConfig = {
  slug: "hong-kong",
  name: "Hong Kong",
  templates: hongKongDreamDayTemplates,
  routes: hongKongRoutes,
  routesByInterest: { nature: hongKongNatureRoutes },
  routesByGroup: { family: hongKongFamilyRoutes },
  routeLabels: {
    3: "A focused urban escape with a harbour crossing and gentle travel days",
    4: "Central, Sheung Wan and the harbour, with room to breathe",
    5: "The city's core, Victoria Peak and an evening by the water",
    7: "Hong Kong's neighbourhoods, harbour and a considered Lantau day",
    10: "City districts, islands and optional attractions, with time left open",
  },
  groupIntroductions: hongKongGroupIntroductions,
  groupNotes: hongKongGroupNotes,
  interestLabels: hongKongInterestLabels,
  interestDescriptions: hongKongInterestDescriptions,
  budgetGuidance: "For Hong Kong, consider international airfare, accommodation, airport transfer, MTR and other local transport, food, attractions and any optional theme-park day separately. Live costs depend on dates, departure city, availability and the choices you make.",
  overnightBaseByTemplate: hongKongOvernightBases,
  stayAreas: [
    { id: "central", name: "Central or Sheung Wan", description: "A convenient island-side base for Central, old streets, the Peak and harbour connections, with a lively mix of dining and neighborhood walks." },
    { id: "tsim-sha-tsui", name: "Tsim Sha Tsui", description: "A practical Kowloon base for Victoria Harbour, the Star Ferry, waterfront evenings and easy access to nearby districts." },
    { id: "jordan", name: "Jordan or Yau Ma Tei", description: "A street-level option close to Temple Street, market areas and everyday food, with MTR connections for wider exploring." },
    { id: "lantau", name: "Tung Chung or Lantau", description: "Consider this when a Lantau or Ngong Ping day is central to the trip, while checking how the base fits your city plans." },
  ],
};

const baliConfig: DestinationDreamConfig = {
  slug: "bali",
  name: "Bali",
  templates: baliDreamDayTemplates,
  routes: baliRoutes,
  routesByInterest: { nature: baliNatureRoutes, city: baliCityRoutes },
  routesByGroup: { family: baliFamilyRoutes, couple: baliCoupleRoutes, friends: baliFriendsRoutes },
  routeLabels: {
    3: "A focused Ubud introduction, with gentle arrival and departure days",
    4: "Ubud's green interior and cultural places, without a base change",
    5: "A deeper Ubud stay with one open day to follow your pace",
    7: "Ubud and Sanur, with a real transition day before the south-coast finish",
    10: "Ubud, Sanur and selected south-coast places, with time left open",
  },
  groupIntroductions: baliGroupIntroductions,
  groupNotes: baliGroupNotes,
  interestLabels: baliInterestLabels,
  interestDescriptions: baliInterestDescriptions,
  budgetGuidance: "For Bali, consider international airfare, accommodation by area, licensed ground transport, local travel, food and optional attractions separately. Traffic, weather and the exact base can change the practical cost; this is a planning framework, not a quote.",
  overnightBaseByTemplate: baliOvernightBases,
  stayAreas: [
    { id: "ubud", name: "Ubud town or nearby villages", description: "A useful base for Campuhan, Tegallalang, Tirta Empul and Ubud's food and arts scene; expect green lanes and road time beyond the center." },
    { id: "sanur", name: "Sanur", description: "A calmer east-coast base for a gentler waterfront rhythm and a practical change of scenery after Ubud." },
    { id: "pecatu", name: "Pecatu / Uluwatu", description: "Consider this for cliffside views and south-coast days, while allowing for a less central base and road-dependent outings." },
    { id: "nusa-dua", name: "Nusa Dua", description: "A south-coast area to consider for a slower shoreline finish; check the exact public access and transport fit for your dates." },
  ],
};

const singaporeConfig: DestinationDreamConfig = {
  slug: "singapore",
  name: "Singapore",
  templates: singaporeDreamDayTemplates,
  routes: singaporeRoutes,
  routesByInterest: { nature: singaporeNatureRoutes, city: singaporeCityRoutes },
  routesByGroup: { family: singaporeFamilyRoutes, couple: singaporeCoupleRoutes, friends: singaporeFriendsRoutes },
  routeLabels: {
    3: "A focused city introduction, with gentle arrival and departure days",
    4: "Marina Bay, Chinatown and a compact neighborhood rhythm",
    5: "The civic center, Chinatown and Little India, without overloading the route",
    7: "Singapore's neighborhoods, gardens and a considered coast day",
    10: "City districts, gardens, Sentosa and open time, with no cross-border detour",
  },
  groupIntroductions: singaporeGroupIntroductions,
  groupNotes: singaporeGroupNotes,
  interestLabels: singaporeInterestLabels,
  interestDescriptions: singaporeInterestDescriptions,
  budgetGuidance: "For Singapore, consider international airfare, accommodation, MRT and bus fares, food, museum or garden tickets and any optional Sentosa attractions separately. Live costs depend on dates, availability and the choices you make; this is a planning framework, not a quote.",
  overnightBaseByTemplate: singaporeOvernightBases,
  stayAreas: [
    { id: "city", name: "Marina Bay or City Hall", description: "A central base for Marina Bay, the Civic District, National Gallery Singapore and easy public-transport connections." },
    { id: "chinatown", name: "Chinatown or Clarke Quay", description: "A neighborhood-led option for river walks, hawker areas and an evening mix of heritage streets and city life." },
    { id: "little-india", name: "Little India or Kampong Gelam", description: "Choose this for colorful heritage streets, food discoveries and a more local-feeling evening rhythm." },
    { id: "orchard", name: "Orchard or a nearby central district", description: "A practical base when you want broad MRT access and a quieter place to return to after full city days." },
    { id: "sentosa", name: "Sentosa", description: "Consider this only when a coast or attraction-led stay is central to the trip; check the transport and reservation fit before choosing it as a base." },
  ],
};

const vietnamConfig: DestinationDreamConfig = {
  slug: "vietnam",
  name: "Vietnam",
  templates: vietnamDreamDayTemplates,
  routes: vietnamRoutes,
  routesByInterest: { nature: vietnamNatureRoutes, city: vietnamCityRoutes },
  routesByGroup: { family: vietnamFamilyRoutes, couple: vietnamCoupleRoutes, friends: vietnamFriendsRoutes },
  routeLabels: {
    3: "A compact Hanoi introduction, with gentle arrival and departure days",
    4: "Hanoi's Old Quarter, Hoan Kiem and cultural places without a long transfer",
    5: "Hanoi with one considered Ninh Binh excursion",
    7: "Hanoi and Ninh Binh, with the northern transition days protected",
    10: "Northern Vietnam followed by Da Nang and Hoi An, with the regional move explicit",
  },
  groupIntroductions: vietnamGroupIntroductions,
  groupNotes: vietnamGroupNotes,
  interestLabels: vietnamInterestLabels,
  interestDescriptions: vietnamInterestDescriptions,
  budgetGuidance: "For Vietnam, consider international airfare, accommodation by region, any domestic or intercity transfer, local transport, food, attraction tickets and optional excursions separately. Weather, route choice and the number of bases change the practical cost; this is a planning framework, not a quote.",
  overnightBaseByTemplate: vietnamOvernightBases,
  stayAreas: [
    { id: "hanoi", name: "Hanoi Old Quarter or Hoan Kiem", description: "A central base for Old Quarter lanes, Hoan Kiem Lake, food-led walks and a first cultural look at the capital." },
    { id: "ninh-binh", name: "Ninh Binh or Tam Coc", description: "Consider this when the karst landscape is central to the trip and you want to protect a slower countryside morning or boat day." },
    { id: "da-nang", name: "Da Nang riverfront or beach area", description: "A useful central-coast base for the riverfront, My Khe Beach, Son Tra and road-based outings toward Hoi An." },
    { id: "hoi-an", name: "Hoi An Ancient Town or riverside", description: "Choose this when old-town evenings, food and nearby countryside matter more than a fast-moving central-Vietnam circuit." },
  ],
};

const malaysiaConfig: DestinationDreamConfig = {
  slug: "malaysia",
  name: "Malaysia",
  templates: malaysiaDreamDayTemplates,
  routes: malaysiaRoutes,
  routesByInterest: { nature: malaysiaNatureRoutes, city: malaysiaCityRoutes },
  routesByGroup: { family: malaysiaFamilyRoutes, couple: malaysiaCoupleRoutes, friends: malaysiaFriendsRoutes },
  routeLabels: {
    3: "A focused Kuala Lumpur introduction, with gentle arrival and departure days",
    4: "Kuala Lumpur landmarks with Batu Caves and room to return",
    5: "Kuala Lumpur with a considered Melaka day excursion",
    7: "Kuala Lumpur and George Town, with the regional transfer protected",
    10: "Kuala Lumpur and Penang in depth, with one open day and no third region",
  },
  groupIntroductions: malaysiaGroupIntroductions,
  groupNotes: malaysiaGroupNotes,
  interestLabels: malaysiaInterestLabels,
  interestDescriptions: malaysiaInterestDescriptions,
  budgetGuidance: "For Malaysia, consider international airfare, accommodation by base, the Kuala Lumpur-to-Penang or Melaka transport choice, local transit, food and optional attraction tickets separately. Weather, traffic and the number of bases change the practical cost; this is a planning framework, not a quote.",
  overnightBaseByTemplate: malaysiaOvernightBases,
  stayAreas: [
    { id: "kuala-lumpur", name: "Kuala Lumpur: KLCC or Bukit Bintang", description: "A central base for KLCC, city views, shopping and broad rail or ride connections, with plenty of food nearby." },
    { id: "kuala-lumpur-chinatown", name: "Kuala Lumpur: Chinatown or Central Market", description: "Choose this for older streets, Central Market, Petaling Street and an easier heritage-and-food rhythm." },
    { id: "george-town", name: "George Town heritage core", description: "A walkable Penang base for shophouses, street art, clan jetties, food streets and evening neighborhood life." },
    { id: "penang-air-itam", name: "Penang: Air Itam or a quieter island base", description: "Consider this when Penang Hill or a slower green day matters more than being beside every George Town street." },
  ],
};

const dreamConfigs: Record<DreamDestinationSlug, DestinationDreamConfig> = {
  japan: japanConfig,
  thailand: thailandConfig,
  "south-korea": southKoreaConfig,
  "hong-kong": hongKongConfig,
  bali: baliConfig,
  singapore: singaporeConfig,
  vietnam: vietnamConfig,
  malaysia: malaysiaConfig,
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
  const routeSource = config.routesByInterest?.[answers.interest] ?? config.routesByGroup?.[answers.group] ?? config.routes;
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
      overnightBase: config.overnightBaseByTemplate[template.id],
      practicalNote,
    };
  });

  const overnightBases = days.reduce<DreamStayBaseId[]>((bases, day) => {
    if (day.overnightBase && !bases.includes(day.overnightBase)) bases.push(day.overnightBase);
    return bases;
  }, []);

  return {
    destination: config.slug,
    destinationName: config.name,
    title: `${durationWords[answers.duration]} unforgettable days in ${config.name}.`,
    subtitle: config.groupIntroductions[answers.group],
    intro: `Shaped around ${config.interestLabels[answers.interest].toLowerCase()} and ${paceLabels[answers.pace].toLowerCase()}, this is one possible way your ${config.name} story could unfold.`,
    routeLabel: config.routeLabels[answers.duration],
    durationLabel: durationLabels[answers.duration],
    days,
    overnightBases,
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
