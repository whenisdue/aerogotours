import { findDestination } from "./destinations.ts";

export type TravelUpdateCategory =
  | "events-experiences"
  | "flights-airports"
  | "travel-requirements"
  | "deals-savings"
  | "destination-tips";

export type TravelUpdateBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

export type TravelUpdateSource = {
  label: string;
  url: string;
  publisher?: string;
  accessedAt?: string;
};

export type TravelUpdate = {
  id: string;
  slug: string;
  headline: string;
  summary: string;
  destination: string;
  country: string;
  category: TravelUpdateCategory;
  publishedAt: string;
  updatedAt?: string;
  image: {
    src: string;
    alt: string;
    credit?: string;
    creditUrl?: string;
  };
  body: TravelUpdateBlock[];
  sources: TravelUpdateSource[];
  eventStartAt?: string;
  eventEndAt?: string;
  expiresAt?: string;
  featured?: boolean;
};

const accessedAt = "2026-09-23";
const todayAccessedAt = "2026-09-24";

const destinationImage = (slug: string) => {
  const destination = findDestination(slug);
  if (!destination) throw new Error(`Missing destination image for ${slug}`);
  return { src: destination.heroImage, alt: destination.imageAlt };
};

export const travelUpdates: TravelUpdate[] = [
  {
    id: "thailand-visa-free-stay-30-days-filipino-passports-2026",
    slug: "thailand-visa-free-stay-30-days-filipino-passports-2026",
    headline: "Thailand visa-free stays for Filipino passport holders are now 30 days",
    summary: "Thailand's updated entry rules took effect on September 15, shortening the visa-free tourism stay for Philippine passport holders from 60 days to up to 30 days.",
    destination: "Thailand",
    country: "Thailand",
    category: "travel-requirements",
    publishedAt: "2026-09-24",
    image: destinationImage("thailand"),
    body: [
      { type: "paragraph", text: "Thailand’s revised visa-exemption arrangements took effect on 15 September 2026, replacing the previous 60-day tourism exemption with new 30-day and 15-day categories." },
      { type: "heading", text: "What this means for Filipino travelers" },
      { type: "paragraph", text: "Philippine passport holders are included among the 60 countries and territories eligible for visa-free tourism entry for up to 30 days. The new framework took effect on 15 September, and the former 60-day exemption ended on the same date." },
      { type: "list", items: ["Philippine passport holders are included in the 30-day tourism-exemption list.", "Travelers already admitted under the previous arrangement before 15 September may remain until the final date shown on their immigration stamp.", "These exemption provisions concern tourism; other travel purposes use different visa categories and rules."] },
      { type: "heading", text: "If you're entering through a land border" },
      { type: "paragraph", text: "Travelers using the 30-day exemption through land-border immigration checkpoints may generally make no more than two such entries per calendar year. The official Thai source lists Malaysia, Brunei Darussalam, Indonesia and Singapore as exceptions; the Philippines is not listed among those exceptions." },
      { type: "heading", text: "Before you travel" },
      { type: "paragraph", text: "Check Thailand’s current official entry conditions again before departure, especially for stays longer than 30 days or travel for purposes other than tourism. Eligibility can depend on the passport and circumstances presented at entry." },
    ],
    sources: [
      { label: "Summary of the Weekly Press Briefing by the Director-General of the Department of Information and MFA Spokesperson on 3 September 2026 at 14:00 hrs.", url: "https://www.mfa.go.th/en/content/pb-summary-03092026-en", publisher: "Ministry of Foreign Affairs, Kingdom of Thailand", accessedAt: todayAccessedAt },
      { label: "Thailand introduces new 30-day and 15-day visa exemption rules from 15 September", url: "https://www.tatnews.org/2026/09/thailand-introduces-new-30-day-and-15-day-visa-exemption-rules-from-15-september/", publisher: "Tourism Authority of Thailand / TAT Newsroom", accessedAt: todayAccessedAt },
    ],
    featured: true,
  },
  {
    id: "japan-chiba-rail-disruptions-typhoon-25-2026",
    slug: "japan-chiba-rail-disruptions-typhoon-25-2026",
    headline: "Japan rail update: Some Chiba train sections could take months to fully reopen",
    summary: "Typhoon 25 is still affecting several JR East routes in Chiba. Some sections could reopen within days, while others may take weeks or months. Tokyo-area trains and the Narita Express are operating normally.",
    destination: "Chiba",
    country: "Japan",
    category: "destination-tips",
    publishedAt: "2026-09-24",
    image: destinationImage("japan"),
    body: [
      { type: "paragraph", text: "Typhoon 25 has left parts of JR East’s Chiba network operating on temporary schedules, with several sections still suspended or running fewer trains. Some damaged sections could reopen within days, while others may require weeks or months of repairs." },
      { type: "paragraph", text: "For most travelers, the impact depends on where they are going. Central Tokyo services are largely operating normally, and the Narita Express is currently operating normally. Travelers heading deeper into Chiba Prefecture should check their exact route before leaving." },
      { type: "heading", text: "Which Chiba routes are still affected?" },
      { type: "paragraph", text: "JR East currently lists several significant disruptions across Chiba Prefecture. The estimates below apply only to the named line sections." },
      { type: "list", items: ["Uchibo Line — Anegasaki to Kisarazu: service suspended; JR East says restoration is expected to take at least three months.", "Uchibo Line — Kisarazu to Awa-Kamogawa: suspended, with service currently expected to resume around September 26.", "Uchibo Line — Chiba to Anegasaki: operating at roughly 20% of the normal number of trains.", "Sobu Main Line — Enokido to Narutō: suspended; JR East estimates restoration at around one month.", "Sobu Main Line — Chiba to Enokido: operating at approximately 60% of normal service.", "Sobu Main Line — Narutō to Choshi: operating at approximately 60% of normal service.", "Narita Line — Sawara to Choshi: suspended, with restoration expected to take around two weeks.", "Narita Line — Narita to Sawara: operating at approximately 80% of normal service.", "Narita Line — Araki to Kioroshi: suspended, with service currently expected to resume around September 26.", "Narita Line — Narita to Kioroshi: operating at approximately 50% of normal service.", "Narita Line — Araki to Abiko: operating at approximately 50% of normal service, with through-running to the Joban Rapid Line currently suspended where noted by JR East.", "Kururi Line — Kisarazu to Kururi: suspended, with restoration expected to take around one week.", "Kururi Line — Kururi to Kazusa-Kameyama: suspended; JR East currently gives no reopening estimate."] },
      { type: "heading", text: "Some sections could reopen soon" },
      { type: "paragraph", text: "JR East currently expects two notable sections to resume around September 26: Uchibo Line from Kisarazu to Awa-Kamogawa, and Narita Line from Araki to Kioroshi. These are current restoration estimates and may change depending on repair progress." },
      { type: "heading", text: "Some repairs may take much longer" },
      { type: "paragraph", text: "The longest current estimate is on the Uchibo Line between Anegasaki and Kisarazu, where JR East says restoration could take at least three months. The Sobu Main Line section between Enokido and Narutō is expected to require around one month, while Sawara to Choshi on the Narita Line is expected to take around two weeks. Kururi to Kazusa-Kameyama currently has no announced reopening estimate. This is why some Chiba train routes could take months to fully reopen, rather than all Chiba train services." },
      { type: "heading", text: "What seems unaffected or is operating normally?" },
      { type: "paragraph", text: "This is not a general Tokyo-area rail shutdown. At the official check on September 24, 2026, JR East listed these services as operating normally:" },
      { type: "list", items: ["Narita Express", "Sobu Rapid Line", "Chuo-Sobu Local Line", "Keiyo Line", "Sotobo Line", "Togane Line", "Kashima Line", "Yamanote Line"] },
      { type: "paragraph", text: "A traveler using the Narita Express between Narita Airport and central Tokyo should not automatically assume that the Chiba regional disruption affects their airport train. These are current conditions, not a promise that services will remain normal later in the day." },
      { type: "heading", text: "What does this mean if you're going to Narita?" },
      { type: "paragraph", text: "If you are simply traveling between Narita Airport and central Tokyo, the situation is currently much less disruptive than the wider Chiba rail update may suggest. The Narita Express is operating normally at the time of writing. The affected Narita Line sections mainly involve other parts of Chiba, including routes toward Sawara, Choshi, Kioroshi and Abiko. If you are staying near Narita and planning side trips deeper into Chiba, check the exact stations involved: one section of a railway line may be operating normally while another is suspended or running fewer trains." },
      { type: "heading", text: "Replacement buses may be introduced" },
      { type: "paragraph", text: "JR East has indicated that replacement bus services are being considered from around September 28 for several longer-term suspended sections. Do not build an itinerary around replacement buses until JR East publishes confirmed operating details." },
      { type: "heading", text: "What travelers should do next" },
      { type: "list", items: ["Check JR East’s live service-status page before leaving your hotel.", "Search using your exact origin and destination stations rather than checking only the line name.", "Allow extra time if your trip uses the Uchibo, Sobu Main, Narita or Kururi lines in Chiba.", "Do not assume replacement buses are already operating unless JR East confirms them.", "If you have a flight from Narita, check the Narita Express status again on the day of travel even though it is currently operating normally.", "If using another operator such as Keisei, check that operator’s official live status separately.", "Travelers spending most of their trip in central Tokyo should not treat this as a Tokyo-wide railway shutdown."] },
      { type: "paragraph", text: "Information checked September 24, 2026. Rail operations and restoration estimates may change as repair work progresses." },
    ],
    sources: [
      { label: "JR East — Kanto Area train status", url: "https://traininfo.jreast.co.jp/train_info/kanto.aspx", publisher: "JR East", accessedAt: todayAccessedAt },
      { label: "JR East — Narita Express service status", url: "https://traininfo.jreast.co.jp/train_info/e/express.aspx?group=nex", publisher: "JR East", accessedAt: todayAccessedAt },
      { label: "Narita International Airport — Train access", url: "https://www.narita-airport.jp/en/access/train/", publisher: "Narita International Airport", accessedAt: todayAccessedAt },
    ],
    featured: false,
  },
  {
    id: "tai-hang-fire-dragon-dance-hong-kong-2026",
    slug: "tai-hang-fire-dragon-dance-hong-kong-2026",
    headline: "Tai Hang Fire Dragon Dance begins tonight in Hong Kong",
    summary: "Hong Kong's three-night Mid-Autumn tradition runs September 24–26 in Tai Hang, with free street viewing and an extended Victoria Park performance on September 25.",
    destination: "Hong Kong",
    country: "Hong Kong",
    category: "events-experiences",
    publishedAt: "2026-09-24",
    image: destinationImage("hong-kong"),
    body: [
      { type: "paragraph", text: "The Tai Hang Fire Dragon Dance begins tonight and runs for three nights as part of Hong Kong’s Mid-Autumn traditions." },
      { type: "heading", text: "When and where" },
      { type: "list", items: ["Thursday, September 24: 7:00 PM to 10:00 PM", "Friday, September 25: 7:00 PM to 11:30 PM", "Saturday, September 26: 7:00 PM to 10:00 PM", "Around Tai Hang on Hong Kong Island", "The Hong Kong Tourism Board identifies Wun Sha Street as the best viewing area", "On September 25, the main performance extends to Victoria Park at 10:30 PM", "Viewing is free"] },
      { type: "heading", text: "What you'll see" },
      { type: "paragraph", text: "The fire dragon is 67 metres long, decorated with about 12,000 burning incense sticks, and paraded by more than 300 performers. It is recognised as National Intangible Cultural Heritage." },
      { type: "heading", text: "Planning your visit" },
      { type: "list", items: ["Arrive early for a better viewing spot.", "Crowd-management measures may be introduced depending on conditions.", "From Causeway Bay, use MTR Exit E and continue toward Wun Sha Street.", "From Tin Hau, use Exit A2 and continue via Fire Dragon Path toward Wun Sha Street.", "Schedules may change, so follow on-site instructions."] },
    ],
    sources: [
      { label: "Tai Hang Fire Dragon Dance", url: "https://www.discoverhongkong.com/eng/events/tai-hang-s-fire-dragon-dance.html", publisher: "Hong Kong Tourism Board", accessedAt: todayAccessedAt },
      { label: "Tai Hang Fire Dragon Dance", url: "https://partnernet.hktb.com/en/destination/events_festivals/index.html?eventID=87582", publisher: "Hong Kong Tourism Board PartnerNet", accessedAt: todayAccessedAt },
    ],
    eventStartAt: "2026-09-24",
    eventEndAt: "2026-09-26",
    expiresAt: "2026-09-27T00:00:00+08:00",
  },
  {
    id: "korea-chuseok-2026-travel-guide",
    slug: "korea-chuseok-2026-travel-guide",
    headline: "Chuseok starts in Korea: free Seoul palaces and holiday schedule changes",
    summary: "Korea's Chuseok holiday runs September 24–26, with some attractions changing schedules while Seoul's four major royal palaces, Jongmyo and the Joseon royal tombs offer free admission through September 27.",
    destination: "Seoul",
    country: "South Korea",
    category: "destination-tips",
    publishedAt: "2026-09-24",
    image: destinationImage("south-korea"),
    body: [
      { type: "paragraph", text: "Korea’s Chuseok holiday begins today. Chuseok Day is Friday, September 25, while the official holiday period runs from Thursday, September 24 through Saturday, September 26." },
      { type: "heading", text: "A useful time to visit Seoul's royal heritage sites" },
      { type: "paragraph", text: "From September 24 through September 27, these sites offer free general admission under the Chuseok programme:" },
      { type: "list", items: ["Gyeongbokgung Palace", "Changdeokgung Palace", "Deoksugung Palace", "Changgyeonggung Palace", "Jongmyo Shrine", "Joseon royal tombs", "Changdeokgung’s Secret Garden is excluded from the free-admission arrangement.", "Jongmyo, which normally operates with reservation and time restrictions, can be viewed freely during this holiday period."] },
      { type: "heading", text: "Expect holiday schedule changes" },
      { type: "paragraph", text: "Operating arrangements vary by venue, so check an attraction’s current schedule before setting out. Seoul Library is closed September 24–26 and reopens on September 27. VISITKOREA also says major national museums and art museums are generally closed on Chuseok Day but open for the rest of the holiday; individual venue schedules can differ." },
      { type: "heading", text: "Getting around late on September 26 and 27" },
      { type: "paragraph", text: "Seoul Metropolitan Government says selected public transportation will run later on September 26–27:" },
      { type: "list", items: ["Subway Lines 1–9, the Ui-Sinseol Line and the Sillim Line are included in extended service.", "Last trains are scheduled to arrive at their terminal stations by 1:00 AM the following day.", "Selected city buses serving five train stations and three bus terminals also have extended service, with last buses passing designated stops at 1:00 AM."] },
      { type: "paragraph", text: "Travelers can also find special Chuseok cultural programmes around Seoul during the holiday, with details varying by venue." },
    ],
    sources: [
      { label: "2026 Chuseok Holiday Travel Guide", url: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=219&vcontsId=1593350", publisher: "Korea Tourism Organization / VISITKOREA", accessedAt: todayAccessedAt },
      { label: "Chuseok palace and royal-tomb free admission notice", url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156782379&pWise=sub&pWiseSub=J1", publisher: "Korea Heritage Service via Republic of Korea policy briefing portal", accessedAt: todayAccessedAt },
      { label: "2026 Chuseok Holiday Information", url: "https://english.seoul.go.kr/2026-chuseok-holiday-information/", publisher: "Seoul Metropolitan Government", accessedAt: todayAccessedAt },
    ],
    eventStartAt: "2026-09-24",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
  },
  {
    id: "singapore-lights-by-the-lake-2026",
    slug: "singapore-lights-by-the-lake-2026",
    headline: "Lights by the Lake returns to Jurong Lake Gardens",
    summary: "Free evening lantern displays, cultural programmes and family activities return to Jurong Lake Gardens this September.",
    destination: "Singapore",
    country: "Singapore",
    category: "events-experiences",
    publishedAt: "2026-09-23",
    image: destinationImage("singapore"),
    body: [
      { type: "paragraph", text: "Lights by the Lake runs at Jurong Lake Gardens from 19–27 September 2026, with the lantern displays continuing until 4 October 2026. The general event time is 6:30 PM–10:30 PM daily." },
      { type: "heading", text: "What visitors can expect" },
      { type: "list", items: ["Large lantern displays", "Cultural performances", "Family activities", "Food market and night programmes", "Legend of the White Snake themed displays"] },
      { type: "paragraph", text: "Admission is free. Some individual programmes may require registration or have separate conditions, so check the official programme details before making a plan." },
    ],
    sources: [
      { label: "Lights by the Lake official site", url: "https://lightsbythelake.nparks.gov.sg/", publisher: "National Parks Board", accessedAt },
      { label: "Jurong Lake Gardens event details", url: "https://juronglakegardens.nparks.gov.sg/lights-by-the-lake/", publisher: "National Parks Board", accessedAt },
    ],
    eventStartAt: "2026-09-19",
    eventEndAt: "2026-10-04",
    expiresAt: "2026-10-05T00:00:00+08:00",
    featured: false,
  },
  {
    id: "hong-kong-mid-autumn-k-festival-2026",
    slug: "hong-kong-mid-autumn-k-festival-2026",
    headline: "Hong Kong’s Central Market hosts a week of Korean food, culture and entertainment",
    summary: "A free seven-day event brings K-Food, K-Beauty, Korean cultural experiences and performances to Central Market from 21–27 September.",
    destination: "Hong Kong",
    country: "Hong Kong",
    category: "events-experiences",
    publishedAt: "2026-09-23",
    image: destinationImage("hong-kong"),
    body: [
      { type: "paragraph", text: "Mid-Autumn K-Festival Week: Taste, Shop & Experience Korea in Central Market runs from 21–27 September 2026, 11:00 AM–9:00 PM, at Central Market, 93 Queen’s Road Central, Hong Kong." },
      { type: "heading", text: "What visitors can expect" },
      { type: "list", items: ["K-Food and K-Beauty", "Korean cultural experiences", "A Korean marketplace", "Performances and chef appearances", "Full Moon Party on 25 September"] },
      { type: "paragraph", text: "Admission is free, making this an easy event to add to a Hong Kong day around Central." },
    ],
    sources: [
      { label: "InvestHK event listing", url: "https://www.investhk.gov.hk/en/events/mid-autumn-k-festival-week-taste-shop-experience-korea-in-central-market/", publisher: "InvestHK", accessedAt },
    ],
    eventStartAt: "2026-09-21",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
  },
  {
    id: "vijit-thailand-lamphun-2026",
    slug: "vijit-thailand-lamphun-2026",
    headline: "VIJIT Thailand lights up Lamphun this September",
    summary: "VIJIT Thailand @ LAMPHUN is listed for 25 September–4 October 2026, giving travelers a possible evening experience to check while planning a Thailand route.",
    destination: "Lamphun",
    country: "Thailand",
    category: "events-experiences",
    publishedAt: "2026-09-23",
    image: destinationImage("thailand"),
    body: [
      { type: "paragraph", text: "The Tourism Authority of Thailand event portal lists VIJIT Thailand @ LAMPHUN from 25 September–4 October 2026, running from 5:00 PM to 12:00 midnight." },
      { type: "paragraph", text: "The official event portal is the best place to check the latest programme details before adding this to a Thailand itinerary." },
    ],
    sources: [
      { label: "Thailand Festival event portal", url: "https://thailandfestival.org/en/", publisher: "Tourism Authority of Thailand", accessedAt },
    ],
    eventStartAt: "2026-09-25",
    eventEndAt: "2026-10-04",
    expiresAt: "2026-10-05T00:00:00+08:00",
  },
];

const isExpired = (update: TravelUpdate, now: Date) =>
  Boolean(update.expiresAt && new Date(update.expiresAt).getTime() <= now.getTime());

export const getActiveTravelUpdates = (now = new Date()) =>
  travelUpdates
    .filter((update) => !isExpired(update, now))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getTravelUpdateBySlug = (slug: string | undefined) =>
  travelUpdates.find((update) => update.slug === slug);

export const getFeaturedTravelUpdate = (now = new Date()) => {
  const active = getActiveTravelUpdates(now);
  return active.find((update) => update.featured) ?? active[0];
};
