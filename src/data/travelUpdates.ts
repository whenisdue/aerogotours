import { findDestination } from "./destinations.ts";

export type TravelUpdateCategory =
  | "events-experiences"
  | "food-experiences"
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
const september25AccessedAt = "2026-09-25";
const september26AccessedAt = "2026-09-26";
const september27AccessedAt = "2026-09-27";
const september28AccessedAt = "2026-09-28";
const september29AccessedAt = "2026-09-29";
const september30AccessedAt = "2026-09-30";

const unsplash = (photoId: string, width: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=85`;

const destinationImage = (slug: string) => {
  const destination = findDestination(slug);
  if (!destination) throw new Error(`Missing destination image for ${slug}`);
  return { src: destination.heroImage, alt: destination.imageAlt };
};

export const travelUpdates: TravelUpdate[] = [
  {
    id: "lego-experience-the-thrill-singapore-2026",
    slug: "lego-experience-the-thrill-singapore-2026",
    headline: "A life-size LEGO race car experience opens in Singapore today",
    summary: "A new race-season LEGO experience opens at Suntec City today with a life-size race car, a huge racing mosaic and hands-on challenges.",
    destination: "Singapore",
    country: "Singapore",
    category: "events-experiences",
    publishedAt: "2026-09-30",
    image: destinationImage("singapore"),
    body: [
      { type: "paragraph", text: "LEGO Experience the Thrill Event 2026 opens today, September 30, at Suntec City. Visit Singapore lists the experience through October 17. This is a race-season attraction opening today, not the Formula 1 race." },
      { type: "heading", text: "What visitors can see and do" },
      { type: "list", items: ["A life-sized LEGO race car", "Singapore’s largest LEGO race-themed mosaic, according to Visit Singapore", "Hands-on challenges and exclusive rewards; the listing does not explain reward eligibility or redemption"] },
      { type: "heading", text: "Part of Singapore’s wider race season" },
      { type: "paragraph", text: "The city’s Grand Prix Season Singapore runs October 2–11. The Formula 1 Singapore Airlines Singapore Grand Prix weekend is October 9–11, so the LEGO experience starts before race season and continues after the race weekend." },
      { type: "heading", text: "Tickets and visiting information" },
      { type: "paragraph", text: "Visit Singapore’s listing does not say whether admission charges apply, what the opening hours are, or whether a Formula 1 race ticket is required. Check the current event information before visiting rather than assuming either way." },
    ],
    sources: [
      { label: "Singapore Grand Prix Season 2026", url: "https://www.visitsingapore.com/whats-happening/all-happenings/events/singapore-grand-prix-season/", publisher: "Singapore Tourism Board / Visit Singapore", accessedAt: september30AccessedAt },
    ],
    eventStartAt: "2026-09-30",
    eventEndAt: "2026-10-17",
    expiresAt: "2026-10-18T00:00:00+08:00",
    featured: false,
  },
  {
    id: "festival-pesona-raja-ampat-2026",
    slug: "festival-pesona-raja-ampat-2026",
    headline: "Raja Ampat’s culture and marine festival begins October 1",
    summary: "Festival Pesona Raja Ampat runs October 1–3, combining local culture, food and marine-conservation activities in one of Indonesia’s most famous island destinations.",
    destination: "Raja Ampat, Southwest Papua",
    country: "Indonesia",
    category: "events-experiences",
    publishedAt: "2026-09-30",
    image: {
      src: "https://www.indonesia.travel/contentassets/9e49531d0c5f4465b2b7393a560e223c/festival-pesona-raja-ampat.jpg",
      alt: "Raja Ampat islands featured on the Wonderful Indonesia festival listing",
      credit: "Wonderful Indonesia",
    },
    body: [
      { type: "paragraph", text: "Festival Pesona Raja Ampat takes place October 1–3 in Raja Ampat Regency, Southwest Papua. The official Wonderful Indonesia listing says the local government organizes the festival and lists its ticket price as free." },
      { type: "heading", text: "What the festival includes" },
      { type: "list", items: ["Traditional art and local cultural performances", "Exhibitions by MSMEs and local businesses", "Local cuisine", "Marine-conservation activities"] },
      { type: "paragraph", text: "The listing describes the program as combining education and entertainment, with interactive experiences that introduce the archipelago’s history, stories and preservation efforts. It does not name specific conservation activities." },
      { type: "heading", text: "What to check before you go" },
      { type: "paragraph", text: "For travelers already planning Raja Ampat, the festival can add a local culture and food event to an island trip. The official listing gives the festival ticket price as free, but does not provide a specific venue, daily schedule or transport arrangements. Confirm those details locally before making plans around an activity." },
    ],
    sources: [
      { label: "Festival Pesona Raja Ampat 2026", url: "https://www.indonesia.travel/fr/fr/events/event-detail/festival-pesona-raja-ampat-2026", publisher: "Ministry of Tourism of the Republic of Indonesia / Wonderful Indonesia", accessedAt: september30AccessedAt },
    ],
    eventStartAt: "2026-10-01",
    eventEndAt: "2026-10-03",
    expiresAt: "2026-10-04T00:00:00+08:00",
    featured: false,
  },
  {
    id: "kasanggayahan-festival-sorsogon-2026",
    slug: "kasanggayahan-festival-sorsogon-2026",
    headline: "Sorsogon’s Kasanggayahan festival month begins October 1",
    summary: "Sorsogon begins its Kasanggayahan festival month on October 1, celebrating provincial history, Bicolano culture, local products and traditions throughout October.",
    destination: "Sorsogon",
    country: "Philippines",
    category: "events-experiences",
    publishedAt: "2026-09-30",
    image: {
      src: unsplash("photo-1500375592092-40eb2168fd21", 2200),
      alt: "Open water along a tropical coastline",
    },
    body: [
      { type: "paragraph", text: "The Tourism Promotions Board (TPB) lists Kasanggayahan Festival for October 1–31, 2026, in Sorsogon. The festival commemorates Sorsogon becoming a province separate from Albay; Kasanggayahan refers to prosperity and the celebration highlights local culture and agricultural products." },
      { type: "heading", text: "October 1 starts the festival month, not the main parade" },
      { type: "paragraph", text: "The TPB’s month-long listing is the broader festival period. Current 2026 announcements from Sorsogon’s Provincial Tourism, Culture and Arts Office place the provincial celebration on October 12–18, with the Grand Opening and Grand Parade scheduled for October 12 at 3:00 PM. The parade is announced to run from Plaza Rizal to the Sorsogon Sports Arena. October 1 is not the parade date." },
      { type: "heading", text: "Culture, dance and local products" },
      { type: "paragraph", text: "TPB says the festival showcases local products including pili-tree products and other agricultural goods. It also identifies Pantomina sa Tinampo as a distinctive feature: a regional courtship dance often called the dance of the doves, performed in the streets." },
      { type: "heading", text: "Check the daily program before traveling" },
      { type: "paragraph", text: "A festival period listed for the whole month does not mean major performances happen every day. The national listing does not provide a day-by-day program. If you are traveling specifically for a parade or performance, check the latest provincial tourism schedule and local event notices for that date, venue and any changes." },
    ],
    sources: [
      { label: "Kasanggayahan Festival", url: "https://tpb.gov.ph/events/kasanggayahan-festival/", publisher: "Tourism Promotions Board Philippines", accessedAt: september30AccessedAt },
      { label: "2026 festival announcements", url: "https://www.facebook.com/sorsogonprovincialtourismoffice/", publisher: "Sorsogon Provincial Tourism, Culture and Arts Office", accessedAt: september30AccessedAt },
      { label: "Sorsogon Provincial Government", url: "https://sorsogon.gov.ph/", publisher: "Provincial Government of Sorsogon", accessedAt: september30AccessedAt },
    ],
    eventStartAt: "2026-10-01",
    eventEndAt: "2026-10-31",
    expiresAt: "2026-11-01T00:00:00+08:00",
    featured: false,
  },
  {
    id: "wayang-jogja-night-carnival-2026",
    slug: "wayang-jogja-night-carnival-2026",
    headline: "Yogyakarta begins WJNC Festival week ahead of its October 7 night carnival",
    summary: "WJNC Festival activities begin October 1 in Yogyakarta, building toward the main Wayang Jogja Night Carnival along Malioboro on October 7.",
    destination: "Yogyakarta",
    country: "Indonesia",
    category: "events-experiences",
    publishedAt: "2026-09-30",
    image: {
      src: "https://hutkota.jogjakota.go.id/assets/instansi/warta/article/20260909172358_thumb.jpg",
      alt: "Wayang Jogja Night Carnival in Yogyakarta",
      credit: "Yogyakarta City Government",
    },
    body: [
      { type: "paragraph", text: "WJNC Festival week begins October 1 and runs through October 7 as part of Yogyakarta’s 270th anniversary celebrations. The week-long festival is a series of activities; the main Wayang Jogja Night Carnival takes place on October 7." },
      { type: "heading", text: "What happens during the week" },
      { type: "paragraph", text: "The city says the wider WJNC Festival combines sports tourism, local-business activities, music, and arts and cultural performances. The week gives visitors more than one day to look for festival events, but the city announcement does not give a full day-by-day program." },
      { type: "heading", text: "The main night carnival on October 7" },
      { type: "list", items: ["The wayang-themed cultural parade is scheduled along Malioboro toward Titik Nol Kilometer, with the main performance at Titik Nol Kilometer.", "The city expects around 2,000 performers representing all 14 kemantren, or districts. Each district brings a connected theme that represents its cultural potential in the city's anniversary celebration.", "The latest city update identifies the 2026 theme as Gana Kalajaya. It says the story will carry messages about cleanliness, waste management and recycling."] },
      { type: "paragraph", text: "For travelers, expect a large street procession built around wayang storytelling and performances from across the city. The city has said traffic measures and parking areas will be prepared, but its current notice does not give exact start times, road closures, parking arrangements or public viewing positions. Check the latest Yogyakarta City or WJNC information before heading to Malioboro." },
    ],
    sources: [
      { label: "HUT ke-270 Kota Yogya Dorong Kolaborasi dan Gerakkan Ekonomi", url: "https://warta.jogjakota.go.id/detail/index/51063", publisher: "Yogyakarta City Government", accessedAt: september30AccessedAt },
      { label: "WJNC Digelar di Malioboro, Ribuan Penampil Siap Bawakan Wayang Gana Kalajaya", url: "https://hutkota.jogjakota.go.id/detail/index/51794/wjnc-digelar-di-malioboro-ribuan-penampil-siap-bawakan-wayang-gana-kalajaya---2026-09-24", publisher: "Yogyakarta City Government", accessedAt: september30AccessedAt },
      { label: "Wayang Jogja Night Carnival", url: "https://wjnc.jogjakota.go.id/", publisher: "Yogyakarta City Government", accessedAt: september30AccessedAt },
    ],
    eventStartAt: "2026-10-01",
    eventEndAt: "2026-10-07",
    expiresAt: "2026-10-08T00:00:00+08:00",
    featured: false,
  },
  {
    id: "bangkok-airport-travel-update-september-2026",
    slug: "bangkok-airport-travel-update-september-2026",
    headline: "Bangkok airports remain open as some journeys take longer",
    summary: "Bangkok’s airports and major visitor areas remain open and accessible, but some road journeys may take longer. Rail services and Don Mueang airport buses are operating.",
    destination: "Bangkok",
    country: "Thailand",
    category: "destination-tips",
    publishedAt: "2026-09-29",
    image: {
      src: "https://www.tatnews.org/wp-content/uploads/2026/09/SituationUpdate_Bangklok-Weather-Travel-Conditions_Update5-28Sep_13.00.jpg",
      alt: "Tourism Authority of Thailand visitor information graphic for Bangkok travel conditions",
      credit: "Tourism Authority of Thailand",
    },
    body: [
      { type: "paragraph", text: "The latest detailed Tourism Authority of Thailand (TAT) travel-conditions notice is marked 28 September 2026, 13:00 Hrs. GMT+7. It says most tourism areas, attractions and visitor facilities across Bangkok continue to operate, while some road journeys in Bangkok and nearby areas may take longer." },
      { type: "heading", text: "Airports, attractions and local transport" },
      { type: "list", items: ["Suvarnabhumi Airport and Don Mueang International Airport remain open and operational.", "Siam, Ratchaprasong, Chinatown, Talat Noi and Song Wat remain accessible, as do the Grand Palace, Temple of the Emerald Buddha, Wat Pho and Wat Arun.", "The Airport Rail Link, SRT Red Line, BTS Skytrain and MRT are operating. BMTA airport buses A1–A4 at Don Mueang are also operating."] },
      { type: "heading", text: "Intercity rail and road journeys" },
      { type: "paragraph", text: "The SRT Northern Line has reopened, and Northeastern and Southern rail lines are operating. Some Eastern Line sections remain affected and services have been adjusted. TAT says some road journeys may take longer, with conditions varying by area." },
      { type: "heading", text: "What to check before leaving your hotel" },
      { type: "list", items: ["Check your flight status with your airline and review current weather, traffic, attraction opening information and public transport conditions.", "Allow sufficient time for the journey. TAT’s latest notice does not give a specific number of extra minutes or hours.", "Check your exact rail, bus or marine service with its operator before travelling; schedules may vary.", "TAT says 28–29 September are special public holidays in Bangkok, Nonthaburi, Pathum Thani and Samut Prakan under a weather-related measure."] },
    ],
    sources: [
      { label: "Weather and travel conditions in Bangkok and surrounding areas – Visitor information", url: "https://www.tatnews.org/2026/09/weather-and-travel-conditions-in-bangkok-and-surrounding-areas-visitor-information/", publisher: "Tourism Authority of Thailand / TAT Newsroom", accessedAt: september29AccessedAt },
      { label: "TAT announces special public holidays on 28–29 September 2026", url: "https://www.tatnews.org/2026/09/tat-announces-special-public-holidays-on-28-29-september-2026/", publisher: "Tourism Authority of Thailand / TAT Newsroom", accessedAt: september29AccessedAt },
    ],
    expiresAt: "2026-09-30T00:00:00+08:00",
    featured: false,
  },
  {
    id: "bangkok-royal-barge-rehearsal-october-2-2026",
    slug: "bangkok-royal-barge-rehearsal-october-2-2026",
    headline: "Travelers can watch Thailand’s Royal Barges rehearse this Friday",
    summary: "A Royal Barge Procession rehearsal is scheduled on Bangkok’s Chao Phraya River on October 2, giving visitors a chance to see Thailand’s historic royal barges before the November ceremony.",
    destination: "Bangkok",
    country: "Thailand",
    category: "events-experiences",
    publishedAt: "2026-09-29",
    image: {
      src: "https://tatnews.org/wp-content/uploads/2026/08/The-Royal-Barge-Procession-2026-and-rehearsals-Cover-scaled.jpg",
      alt: "Royal barges on Bangkok’s Chao Phraya River",
      credit: "Tourism Authority of Thailand",
    },
    body: [
      { type: "paragraph", text: "A minor rehearsal for the Royal Barge Procession is scheduled on Friday, 2 October. This is a rehearsal, not the actual procession, which is planned for 6 November as part of the Royal Kathin Ceremony at Wat Arun." },
      { type: "heading", text: "What visitors can see" },
      { type: "paragraph", text: "The Royal Thai Navy’s rehearsal is expected to begin at approximately 14:30. TAT invites the public and visitors to observe rehearsals along both banks of the Chao Phraya River between Krung Thon Bridge and Wat Arun Ratchawararam. Its notice identifies this stretch but does not recommend a particular viewing point." },
      { type: "paragraph", text: "The official notice does not list ticket requirements, reserved viewing areas or exact road and riverfront closures. Check current event and local transport information before choosing how to reach the river." },
      { type: "heading", text: "Other rehearsal dates and the November ceremony" },
      { type: "list", items: ["Further minor rehearsals: 8 and 15 October", "Full-dress rehearsals: 21 and 28 October", "Royal Kathin Ceremony and Royal Barge Procession: 6 November"] },
      { type: "paragraph", text: "For the 6 November procession, 52 royal barges carrying 2,200 Royal Thai Navy personnel will travel from Wasukri Pier to Wat Arun. The Royal Kathin Ceremony is a Buddhist merit-making tradition after Buddhist Lent, when robes and other offerings are presented to monks; when performed by the monarch, it brings royal and Buddhist traditions together." },
    ],
    sources: [
      { label: "Thailand invites visitors to witness the Royal Barge Procession 2026 and rehearsals on Bangkok’s Chao Phraya River", url: "https://www.tatnews.org/2026/08/thailand-invites-visitors-to-witness-the-royal-barge-procession-2026-and-rehearsals-on-bangkoks-chao-phraya-river/", publisher: "Tourism Authority of Thailand / TAT Newsroom", accessedAt: september29AccessedAt },
    ],
    eventStartAt: "2026-10-02",
    eventEndAt: "2026-10-02",
    expiresAt: "2026-10-03T00:00:00+08:00",
    featured: false,
  },
  {
    id: "central-highlands-gong-culture-festival-vietnam-2026",
    slug: "central-highlands-gong-culture-festival-vietnam-2026",
    headline: "Vietnam’s Central Highlands gong culture festival begins October 1",
    summary: "A festival celebrating the UNESCO-recognised Space of Gong Culture in Vietnam’s Central Highlands begins October 1, with cultural performances and heritage experiences.",
    destination: "Gia Lai / Central Highlands",
    country: "Vietnam",
    category: "events-experiences",
    publishedAt: "2026-09-29",
    image: {
      src: "https://image.vietnam.travel/sites/default/files/2026-03/3066-gia%20lai-nguyen%20van%20hop-0973138897-lua%20thieng%20cao%20nguyen.jpg?v=1789698687",
      alt: "Cultural experience in Gia Lai, Vietnam, featured by Vietnam Tourism",
      credit: "Vietnam National Authority of Tourism",
    },
    body: [
      { type: "paragraph", text: "Vietnam Tourism lists the Central Highlands Gong Culture International Festival for 1–31 October as part of Visit Vietnam Year 2026 – Gia Lai. It says the festival promotes the UNESCO-recognised Space of Gong Culture through performances, rituals and cultural experiences." },
      { type: "heading", text: "A living cultural space" },
      { type: "paragraph", text: "Gia Lai is in Vietnam’s Central Highlands. UNESCO describes the Space of Gong Culture as spanning several provinces and communities, where gongs are closely linked to daily life, seasonal cycles and rituals." },
      { type: "heading", text: "What travelers can plan" },
      { type: "paragraph", text: "The official tourism listing describes performances, rituals and cultural experiences, but does not say which activities visitors can attend or provide daily schedules. It gives no individual venue, performance time, admission details or booking requirements." },
      { type: "paragraph", text: "Before making a special trip, check Vietnam Tourism and Gia Lai’s official tourism or event channels for the exact venue, dates of public activities, access arrangements and transport. The current listing confirms the month-long event window, not a day-by-day program." },
    ],
    sources: [
      { label: "Central Highlands Gong Culture International Festival", url: "https://vietnam.travel/things-to-do/festival-event/central-highlands-gong-culture-international-festival", publisher: "Vietnam National Authority of Tourism / Vietnam Tourism", accessedAt: september29AccessedAt },
      { label: "Space of gong culture", url: "https://ich.unesco.org/en/RL/space-of-gong-culture-00120", publisher: "UNESCO Intangible Cultural Heritage", accessedAt: september29AccessedAt },
      { label: "Gia Lai: A Hidden Highland Gem", url: "https://www.vietnam.travel/things-to-do/gia-lai-hidden-highland-gem", publisher: "Vietnam National Authority of Tourism / Vietnam Tourism", accessedAt: september29AccessedAt },
    ],
    eventStartAt: "2026-10-01",
    eventEndAt: "2026-10-31",
    expiresAt: "2026-11-01T00:00:00+08:00",
    featured: false,
  },
  {
    id: "singapore-grand-prix-season-experiences-2026",
    slug: "singapore-grand-prix-season-experiences-2026",
    headline: "New Singapore Grand Prix Season experiences begin today",
    summary: "New motorsport pop-ups begin in Singapore today, with Formula racing show cars and race-season experiences appearing at Raffles City and Funan.",
    destination: "Singapore",
    country: "Singapore",
    category: "events-experiences",
    publishedAt: "2026-09-28",
    image: destinationImage("singapore"),
    body: [
      { type: "paragraph", text: "The adidas Motorsport pop-ups at Raffles City and Funan begin today, September 28. They are part of the build-up to Grand Prix Season Singapore, scheduled for October 2–11; the Formula 1 Singapore Grand Prix race weekend is October 9–11, not today." },
      { type: "heading", text: "What visitors can see" },
      { type: "paragraph", text: "Visit Singapore lists show-car displays for the Mercedes-AMG PETRONAS F1 Team and Audi Revolut F1 Team, alongside adidas Motorsport collections. The pop-ups are scheduled to run through October 12." },
      { type: "heading", text: "More race-season activities ahead" },
      { type: "list", items: ["Ray-Ban’s Beyond the Track at CQ@Clarke Quay, October 1–14, with race-themed challenges and a Scuderia Ferrari collection display", "Orchard Paddock at Ngee Ann City Civic Plaza, October 8–10, with an outdoor supper experience, live performances and race-film screenings", "The Formula 1 Singapore Grand Prix race weekend, October 9–11"] },
      { type: "heading", text: "Tickets, hours and access" },
      { type: "paragraph", text: "Visit Singapore’s listing does not state the admission price, opening hours or any booking requirement for the Raffles City and Funan pop-ups. It does identify Trackside Toasts at Marina Bay as an offer for race-ticket holders, but that condition is not stated for these mall pop-ups. Check the specific activation and venue details before heading out rather than assuming an F1 race ticket is—or is not—needed." },
    ],
    sources: [
      { label: "Singapore Grand Prix Season 2026", url: "https://www.visitsingapore.com/whats-happening/all-happenings/events/singapore-grand-prix-season/", publisher: "Singapore Tourism Board / Visit Singapore", accessedAt: september28AccessedAt },
    ],
    eventStartAt: "2026-09-28",
    eventEndAt: "2026-10-14",
    expiresAt: "2026-10-15T00:00:00+08:00",
    featured: false,
  },
  {
    id: "lapay-bantigue-dance-festival-masbate-2026",
    slug: "lapay-bantigue-dance-festival-masbate-2026",
    headline: "Masbate celebrates a folk dance inspired by birds in flight today",
    summary: "Masbate’s Lapay Bantigue Dance Festival is observed September 28, celebrating a local folk dance inspired by the graceful movements of lapay seabirds.",
    destination: "Masbate City",
    country: "Philippines",
    category: "events-experiences",
    publishedAt: "2026-09-28",
    image: {
      src: unsplash("photo-1500375592092-40eb2168fd21", 2200),
      alt: "Open water along a tropical coastline",
    },
    body: [
      { type: "paragraph", text: "The Tourism Promotions Board (TPB) lists the Lapay Bantigue Dance Festival on September 28 in Masbate City. Its listing gives the festival date and cultural background, but does not confirm a detailed 2026 program." },
      { type: "heading", text: "A dance inspired by lapay" },
      { type: "paragraph", text: "TPB traces the folk dance to Barangay Bantigue, where lapay—described in its listing as seagulls—were seen hovering and moving in flocks. Their movements inspired local elders to create a folk dance that became an important part of the community’s culture." },
      { type: "heading", text: "What travelers should check" },
      { type: "paragraph", text: "For travelers already in Masbate, the festival offers a way to learn about a local dance tradition and its connection to the birds around Bantigue. TPB does not list 2026 performance times, a specific venue within Masbate City, admission details or confirmed activities. Check with local tourism officials or event organizers before making a special trip." },
    ],
    sources: [
      { label: "Lapay Bantigue Dance Festival", url: "https://tpb.gov.ph/events/lapay-bantigue-dance-festival/", publisher: "Tourism Promotions Board Philippines", accessedAt: september28AccessedAt },
      { label: "Calendar of Philippine Festivals — September", url: "https://tpb.gov.ph/calendar-of-philippine-festivals-and-monthly-observances-theme/?month=09", publisher: "Tourism Promotions Board Philippines", accessedAt: september28AccessedAt },
    ],
    eventStartAt: "2026-09-28",
    eventEndAt: "2026-09-28",
    expiresAt: "2026-09-29T00:00:00+08:00",
    featured: false,
  },
  {
    id: "pal-manila-delhi-mumbai-flights-2026",
    slug: "pal-manila-delhi-mumbai-flights-2026",
    headline: "PAL plans new nonstop Manila flights to Delhi and Mumbai",
    summary: "Philippine Airlines plans to start nonstop Manila services to Delhi and Mumbai in December, subject to Indian government approval.",
    destination: "Manila–Delhi and Mumbai",
    country: "Philippines / India",
    category: "flights-airports",
    publishedAt: "2026-09-28",
    image: {
      src: unsplash("photo-1436491865332-7a61a109cc05", 2200),
      alt: "Passenger aircraft flying above the clouds",
    },
    body: [
      { type: "paragraph", text: "Philippine Airlines announced on September 25 that it plans to launch nonstop Manila–Delhi and Manila–Mumbai services in December 2026. The proposed launch is subject to Indian government approval, so the routes should not be treated as confirmed until PAL announces that approval and launch arrangements are finalized." },
      { type: "heading", text: "Planned Delhi schedule" },
      { type: "list", items: ["Manila to Delhi: Monday, Wednesday and Friday, departing 10:40 PM and arriving 3:00 AM the next day", "Delhi to Manila: Tuesday, Thursday and Saturday, departing 8:15 AM and arriving 5:00 PM"] },
      { type: "heading", text: "Planned Mumbai schedule" },
      { type: "list", items: ["Manila to Mumbai: Tuesday, Thursday, Saturday and Sunday, departing 10:40 PM and arriving 3:05 AM the next day", "Mumbai to Manila: Monday, Wednesday, Friday and Sunday, departing 7:15 AM and arriving 5:00 PM"] },
      { type: "paragraph", text: "PAL says all times are local. The schedules are the airline’s announced plan and remain subject to the stated approval condition." },
      { type: "heading", text: "What this means for Filipino travelers" },
      { type: "paragraph", text: "If approved and launched, the services would give travelers nonstop options from Manila to two major Indian cities. PAL says bookings may be made through its website, mobile app, ticket offices, hotline or accredited travel agents. Before paying or building a trip around these flights, check PAL’s latest announcement and booking channels for approval status, actual operating dates, availability and current schedules." },
    ],
    sources: [
      { label: "PAL to Launch Delhi and Mumbai Services", url: "https://www.philippineairlines.com/us/en/newsevent-listingpage/press-releases-statements/pal-to-launch-delhi-and-mumbai-services.html", publisher: "Philippine Airlines", accessedAt: september28AccessedAt },
    ],
    featured: false,
  },
  {
    id: "salo-karajae-festival-parepare-2026",
    slug: "salo-karajae-festival-parepare-2026",
    headline: "A free coastal cultural festival starts today in South Sulawesi",
    summary: "Salo Karajae Festival begins September 27 along Parepare’s river and coastline, combining cultural activities, traditional fishing, markets and coastal experiences.",
    destination: "Parepare",
    country: "Indonesia",
    category: "events-experiences",
    publishedAt: "2026-09-27",
    image: {
      src: unsplash("photo-1500375592092-40eb2168fd21", 2200),
      alt: "Open water along a tropical coastline",
    },
    body: [
      { type: "paragraph", text: "Salo Karajae Festival begins today, September 27, and runs through October 1 in Parepare City, South Sulawesi. The coastal cultural event coincides with World Tourism Day." },
      { type: "heading", text: "What is Salo Karajae?" },
      { type: "paragraph", text: "The festival brings local culture and coastal life together along the Karajae River and nearby shore. Visitors can see cultural competitions, traditional fishing, local markets, and activities from micro, small and medium enterprises (MSMEs) and the creative economy." },
      { type: "heading", text: "Where it happens" },
      { type: "paragraph", text: "Parepare is a city in South Sulawesi. For 2026, the festival expands across both riverbanks and the beach, so activities are spread across a riverfront and coastal area rather than one single venue." },
      { type: "heading", text: "Cost and planning" },
      { type: "paragraph", text: "The official tourism listing gives the ticket price as free. It does not provide a detailed daily timetable, so check the official event page or local updates for the day’s activities, exact locations and transport arrangements before setting out." },
    ],
    sources: [
      { label: "Festival Salo Karajae 2026", url: "https://www.travelindonesia.cn/th/en/events/event-detail/festival-salo-karajae-2026", publisher: "Ministry of Tourism, Republic of Indonesia / Indonesia Travel", accessedAt: september27AccessedAt },
    ],
    eventStartAt: "2026-09-27",
    eventEndAt: "2026-10-01",
    expiresAt: "2026-10-02T00:00:00+08:00",
    featured: false,
  },
  {
    id: "fukuro-matsuri-ikebukuro-tokyo-2026",
    slug: "fukuro-matsuri-ikebukuro-tokyo-2026",
    headline: "Sixteen mikoshi fill Ikebukuro for Fukuro Matsuri today",
    summary: "Fukuro Matsuri’s free Mikoshi Festival runs through today in Ikebukuro, with 16 portable shrines in the parade and Japanese drumming among the weekend performances.",
    destination: "Ikebukuro",
    country: "Japan",
    category: "events-experiences",
    publishedAt: "2026-09-27",
    image: {
      src: unsplash("photo-1540959733332-eab4deabeeaf", 2200),
      alt: "Tokyo city buildings in daylight",
    },
    body: [
      { type: "paragraph", text: "Fukuro Matsuri’s September Mikoshi Festival runs September 26–27 in Ikebukuro. Today’s program includes a neighborhood mikoshi ceremony and a large portable-shrine parade." },
      { type: "heading", text: "What happens today?" },
      { type: "paragraph", text: "A mikoshi is a portable shrine carried in a festival procession. The national tourism listing identifies 16 mikoshi in today’s parade. Japanese drumming and other performances are also part of the weekend festival." },
      { type: "heading", text: "Where to go and what it costs" },
      { type: "list", items: ["Ikebukuro West Exit Station Square and nearby areas", "About a one-minute walk from JR Ikebukuro Station", "Admission is free"] },
      { type: "heading", text: "Before you head out" },
      { type: "paragraph", text: "The station-square area may be busy during the parade, so allow extra time and follow local staff directions. The tourism listing does not give today’s performance times; check the festival organizer’s latest notice before travelling. The separate dance festival and Tokyo Yosakoi events are scheduled for October 10–11, not today." },
    ],
    sources: [
      { label: "Fukuro Matsuri Festival Mikoshi Festival", url: "https://www.japan47go.travel/en/detail/d2b82e3a-4ef3-49b5-9798-5cc84884ebd4", publisher: "Japan Travel and Tourism Association / JAPAN 47 GO", accessedAt: september27AccessedAt },
      { label: "Fukuro Matsuri official site", url: "https://yosakoitokyo.gr.jp/", publisher: "Fukuro Matsuri Council", accessedAt: september27AccessedAt },
    ],
    eventStartAt: "2026-09-26",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
    featured: false,
  },
  {
    id: "free-royal-court-parade-hyundai-seoul-2026",
    slug: "free-royal-court-parade-hyundai-seoul-2026",
    headline: "Travelers can see a free Korean royal-court parade in Seoul today",
    summary: "A free Korean royal-court ceremony parade runs at The Hyundai Seoul today, with performances scheduled at 2 PM, 3 PM and 4 PM.",
    destination: "Seoul",
    country: "South Korea",
    category: "events-experiences",
    publishedAt: "2026-09-27",
    image: destinationImage("south-korea"),
    body: [
      { type: "paragraph", text: "A free royal-court ceremony parade is scheduled at The Hyundai Seoul today, Sunday, September 27. The parade is a continuing weekend program; the broader HELLO SEOUL shopping festa itself ended on September 20." },
      { type: "heading", text: "Today’s performances" },
      { type: "list", items: ["2:00 PM", "3:00 PM", "4:00 PM", "Each performance lasts about 30 minutes", "The parade takes place around the 1F area"] },
      { type: "heading", text: "Where it is and how to get there" },
      { type: "paragraph", text: "The Hyundai Seoul is at 108 Yeoui-daero, Yeongdeungpo-gu, Seoul. Visit Seoul lists Yeouido Station on Subway Lines 5 and 9, Exit 3, about 500 metres away." },
      { type: "heading", text: "How long does the program continue?" },
      { type: "paragraph", text: "The official listing says the parade continues every Saturday and Sunday through October 4. Check the venue or Visit Seoul’s official page before setting out in case event arrangements change." },
    ],
    sources: [
      { label: "HELLO SEOUL (The Hyundai Seoul Shopping Festa)", url: "https://english.visitseoul.net/events/TheHyundaiSeoulShoppingFesta/ENPaecwqv", publisher: "Seoul Tourism Organization / Visit Seoul", accessedAt: september27AccessedAt },
    ],
    eventStartAt: "2026-09-12",
    eventEndAt: "2026-10-04",
    expiresAt: "2026-10-05T00:00:00+08:00",
    featured: false,
  },
  {
    id: "sandeq-silumba-west-sulawesi-2026",
    slug: "sandeq-silumba-west-sulawesi-2026",
    headline: "Indonesia’s 231-km traditional Sandeq sailboat event starts today",
    summary: "Traditional Sandeq boats race across 231 km of West Sulawesi coastline this weekend, alongside music, dance and a night market.",
    destination: "West Sulawesi",
    country: "Indonesia",
    category: "events-experiences",
    publishedAt: "2026-09-26",
    image: {
      src: unsplash("photo-1500375592092-40eb2168fd21", 2200),
      alt: "Blue ocean water along a tropical coastline",
    },
    body: [
      { type: "paragraph", text: "Sandeq Silumba starts today, September 26, along the West Sulawesi coast. The two-day event combines a 231-kilometre traditional sailboat race with local food and cultural activities." },
      { type: "heading", text: "What is a Sandeq?" },
      { type: "paragraph", text: "A Sandeq is the fast traditional sailboat of the Mandar people. Each boat in Sandeq Silumba carries 14 crew members, known as Pa’sawi." },
      { type: "heading", text: "Where the 231-km route goes" },
      { type: "paragraph", text: "The route crosses three West Sulawesi areas: Polewali Mandar, Majene and Mamuju. It follows the coastline past beaches named by Indonesia Travel including Bahari, Pamboang, Sendana, Deking and Manakarra. Its length makes the event a multi-stop coastal race, rather than a short regatta at one harbor." },
      { type: "heading", text: "More than the sailing race" },
      { type: "list", items: ["Sandeq Night Market", "Traditional dance and music", "Local small businesses and products"] },
      { type: "heading", text: "Cost and practical planning" },
      { type: "paragraph", text: "Indonesia Travel lists the ticket price as free. The listing does not give a detailed daily timetable, route-side viewing plan or transport schedule, so check the official event page and local updates before setting out. If you plan to follow the boats between regencies, confirm local road and coastal transport arrangements rather than assuming the race can be followed from one base." },
    ],
    sources: [
      { label: "Sandeq Silumba 2026", url: "https://www.indonesia.travel/id/en/events/event-detail/sandeq-silumba-2026", publisher: "Ministry of Tourism, Republic of Indonesia / Indonesia Travel", accessedAt: september26AccessedAt },
    ],
    eventStartAt: "2026-09-26",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
    featured: false,
  },
  {
    id: "tourism-expo-japan-public-days-tokyo-2026",
    slug: "tourism-expo-japan-public-days-tokyo-2026",
    headline: "Tourism EXPO Japan opens to the public in Tokyo this weekend",
    summary: "Tourism EXPO Japan’s public days begin September 26 at Tokyo Big Sight, bringing destinations, travel experiences, culture and food together under one roof.",
    destination: "Tokyo",
    country: "Japan",
    category: "events-experiences",
    publishedAt: "2026-09-26",
    image: {
      src: unsplash("photo-1540959733332-eab4deabeeaf", 2200),
      alt: "Tokyo skyline and city streets under a bright blue sky",
    },
    body: [
      { type: "paragraph", text: "Yes. Tourism EXPO Japan opens to general visitors today, Saturday, September 26. The September 24 and 25 dates were for trade and press and were not open to the public." },
      { type: "heading", text: "Public hours and venue" },
      { type: "list", items: ["Saturday, September 26: 10:00 AM–6:00 PM", "Sunday, September 27: 10:00 AM–5:00 PM", "Tokyo Big Sight, 3-11-1 Ariake, Koto-ku, Tokyo"] },
      { type: "heading", text: "What visitors can expect" },
      { type: "paragraph", text: "The 2026 theme is “The Changing Nature of Travel.” The expo brings together travel destinations and organizations from Japan and overseas, with exhibits and ideas for trips, culture and travel experiences. It can be useful if you are already in Tokyo and want to compare places to visit around Japan or discover other destinations in one venue." },
      { type: "paragraph", text: "The organizers are the Japan Travel and Tourism Association, the Japan Association of Travel Agents (JATA), and the Japan National Tourism Organization (JNTO)." },
      { type: "heading", text: "Getting to Tokyo Big Sight" },
      { type: "paragraph", text: "The organizer’s access page lists Kokusai-Tenjijo Station on the Rinkai Line, about a seven-minute walk away, and Tokyo Big Sight Station on the Yurikamome, about a three-minute walk away. Check the official access page and your transport operator for current service information before leaving." },
      { type: "heading", text: "Before you go" },
      { type: "paragraph", text: "The event page links to separate public-day ticket information. Check it for current entry requirements, ticket availability and prices before traveling to the venue." },
    ],
    sources: [
      { label: "Tourism EXPO Japan — For Public", url: "https://www.t-expo.jp/en/public", publisher: "Tourism EXPO Japan", accessedAt: september26AccessedAt },
      { label: "Tourism EXPO Japan 2026 — Event Outline", url: "https://www.t-expo.jp/en/biz/outline", publisher: "Tourism EXPO Japan", accessedAt: september26AccessedAt },
      { label: "Tourism EXPO Japan — About", url: "https://www.t-expo.jp/en/public/about", publisher: "Tourism EXPO Japan", accessedAt: september26AccessedAt },
      { label: "Tourism EXPO Japan — Access", url: "https://www.t-expo.jp/en/access", publisher: "Tourism EXPO Japan", accessedAt: september26AccessedAt },
    ],
    eventStartAt: "2026-09-26",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
    featured: false,
  },
  {
    id: "wonderful-indonesia-gastronomy-2026",
    slug: "wonderful-indonesia-gastronomy-2026",
    headline: "Indonesia begins a nine-day culinary journey across four destinations",
    summary: "Wonderful Indonesia Gastronomy runs September 26–October 4 across Solo, Yogyakarta, Jakarta and Bali, combining food, heritage and local communities.",
    destination: "Indonesia",
    country: "Indonesia",
    category: "food-experiences",
    publishedAt: "2026-09-26",
    image: {
      src: unsplash("photo-1547592180-85f173990554", 2200),
      alt: "A colorful meal served on a table",
    },
    body: [
      { type: "paragraph", text: "Wonderful Indonesia Gastronomy (WIG) 2026 begins today, September 26, and runs through October 4. The Ministry of Tourism describes it as a program about Indonesian cuisine, heritage, ingredients, traditions and the communities connected to them." },
      { type: "heading", text: "Four destinations, one national program" },
      { type: "list", items: ["Solo", "Yogyakarta", "Jakarta", "Bali"] },
      { type: "heading", text: "What begins today in Solo" },
      { type: "paragraph", text: "The official program opens in Solo with a dinner at Pura Mangkunegaran on September 26. The page describes this as part of a Media & KOL Trip, so it does not establish that the dinner is open to general visitors. The itinerary also highlights Kampung Laweyan and Pasar Gede for their local food, producers and heritage." },
      { type: "heading", text: "Food and cultural experiences" },
      { type: "paragraph", text: "Across the program, the organizer lists chef collaborations, culinary festivals, restaurant promotions, heritage-focused experiences and local food traditions. It also identifies a WIG Artisan Market as open to all and free of charge. That detail applies to the market only; the page does not give general public access terms for every dinner, trip or forum." },
      { type: "heading", text: "Planning around WIG" },
      { type: "paragraph", text: "If your Indonesia itinerary already includes one of these cities, WIG may offer ways to connect local dishes with their history and producers. Check the official program for the date, location, booking or access details of the specific activity you want to attend. Do not assume the opening dinner or other listed experiences accept walk-in visitors." },
    ],
    sources: [
      { label: "Wonderful Indonesia Gastronomy 2026", url: "https://www.indonesia.travel/de/en/events/event-detail/wig-2026", publisher: "Ministry of Tourism, Republic of Indonesia / Indonesia Travel", accessedAt: september26AccessedAt },
    ],
    eventStartAt: "2026-09-26",
    eventEndAt: "2026-10-04",
    expiresAt: "2026-10-05T00:00:00+08:00",
    featured: false,
  },
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
      { type: "heading", text: "Getting back after tonight's performance" },
      { type: "paragraph", text: "On September 25, MTR is extending service hours on most local lines by around 1.5 hours, and Light Rail service is also extended. Airport Express and Disneyland Resort Line services are excluded, as are cross-boundary East Rail journeys to or from Lo Wu and Lok Ma Chau. MTR Bus routes 506, K51 and K54A also have extended service. This may help travelers leaving Tai Hang after evening celebrations, but exact last-train times differ by station and line, so check the MTR app or website for your specific journey." },
    ],
    sources: [
      { label: "Tai Hang Fire Dragon Dance", url: "https://www.discoverhongkong.com/eng/events/tai-hang-s-fire-dragon-dance.html", publisher: "Hong Kong Tourism Board", accessedAt: todayAccessedAt },
      { label: "Tai Hang Fire Dragon Dance", url: "https://partnernet.hktb.com/en/destination/events_festivals/index.html?eventID=87582", publisher: "Hong Kong Tourism Board PartnerNet", accessedAt: todayAccessedAt },
      { label: "MTR Enhances Train Service for Mid-Autumn Festival Holidays — Extended Service Hours on Evening of Mid-Autumn Festival to Meet Passengers’ Travel Needs", url: "https://www.mtr.com.hk/archive/corporate/en/press_release/PR-26-063-E.pdf", publisher: "MTR Corporation", accessedAt: september25AccessedAt },
      { label: "Mid-Autumn Festival transport and service information", url: "https://www.td.gov.hk/en/special_news/spnews.htm?id=80562", publisher: "Hong Kong Transport Department", accessedAt: september25AccessedAt },
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
  {
    id: "seoul-chuseok-free-attractions-holiday-schedule-2026",
    slug: "seoul-chuseok-free-attractions-holiday-schedule-2026",
    headline: "Chuseok starts in Korea: free Seoul attractions and holiday schedule changes",
    summary: "Several major Seoul heritage attractions are free during Chuseok, but some museums and venues are adjusting schedules for the holiday.",
    destination: "Seoul",
    country: "South Korea",
    category: "destination-tips",
    publishedAt: "2026-09-25",
    image: destinationImage("south-korea"),
    body: [
      { type: "paragraph", text: "Chuseok is today, Friday, September 25. If you're in Seoul, the holiday is a chance to visit major royal heritage sites without an admission fee. Some museums and regular palace programs have different arrangements today, so check the specific venue before setting out." },
      { type: "heading", text: "What is free during Chuseok" },
      { type: "paragraph", text: "From September 24 through 27, the Korea Heritage Service is opening these sites free to visitors:" },
      { type: "list", items: ["Seoul's four major royal palaces: Gyeongbokgung, Changdeokgung, Deoksugung and Changgyeonggung", "Jongmyo Shrine", "All 40 Joseon royal tombs across South Korea; these are spread around the country, not all in Seoul", "Changdeokgung's Secret Garden is excluded from the free palace admission and remains separately ticketed."] },
      { type: "heading", text: "Places to prioritize in Seoul" },
      { type: "paragraph", text: "For a Seoul day focused on royal history, choose one or two palace grounds and Jongmyo. Admission to the main areas is free during the holiday period, and you can visit without treating the free entry as a nationwide attraction pass: the offer applies to the listed heritage sites." },
      { type: "heading", text: "Holiday schedule changes to watch for" },
      { type: "list", items: ["The Korea Tourism Organization says major national museums and art museums, including the National Museum of Korea and MMCA Seoul, are generally closed on Chuseok Day, September 25. Most reopen during the rest of the holiday, but check the individual museum's current hours.", "At Changdeokgung, the regular guided tours of the palace buildings are suspended during the September 24–27 free-admission period; Secret Garden tours are scheduled separately.", "Changgyeonggung also suspends its regular guided tours during the free-admission period.", "Seoul Library is closed September 24–26. Seoul-run museums have their own holiday opening hours, which can differ from national museums."] },
      { type: "heading", text: "What to check before heading out" },
      { type: "list", items: ["Confirm today's opening and last-entry time on the official page for the specific palace, shrine or museum.", "Check whether a guided tour or special area requires a separate ticket or reservation.", "If a museum is part of your plan, check its Chuseok Day notice before traveling there.", "Allow time for holiday crowds and follow any on-site visitor instructions."] },
      { type: "paragraph", text: "For travelers in Seoul today, the four palace grounds and Jongmyo are the clearest free heritage options. The 40 royal tombs are also included nationwide, while museum openings and guided programs vary by venue." },
    ],
    sources: [
      { label: "2026 Chuseok Holiday Travel Guide", url: "https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=219&vcontsId=1593350", publisher: "Korea Tourism Organization / VISITKOREA", accessedAt: september25AccessedAt },
      { label: "Korea Heritage Service opens palaces, Jongmyo and royal tombs free for Chuseok", url: "https://www.korea.kr/briefing/pressReleaseView.do?newsId=156782379&pWise=sub&pWiseSub=J1", publisher: "Korea Heritage Service via Republic of Korea policy briefing portal", accessedAt: september25AccessedAt },
      { label: "2026 Chuseok Holiday Information", url: "https://english.seoul.go.kr/2026-chuseok-holiday-information/", publisher: "Seoul Metropolitan Government", accessedAt: september25AccessedAt },
      { label: "Changdeokgung Palace Chuseok admission and tour notice", url: "https://royal.khs.go.kr/ROYAL/contents/R403000000.do?id=20260921134912308090&schBcid=notice01&schM=view", publisher: "Korea Heritage Service, Royal Palaces and Tombs Center", accessedAt: september25AccessedAt },
      { label: "Changgyeonggung Palace holiday free admission and tour notice", url: "https://royal.cha.go.kr/ROYAL/contents/R403000000.do?id=20260921132948310017&schBcid=notice01&schM=view", publisher: "Korea Heritage Service, Royal Palaces and Tombs Center", accessedAt: september25AccessedAt },
    ],
    eventStartAt: "2026-09-25",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
    featured: false,
  },
  {
    id: "macao-international-fireworks-september-25-2026",
    slug: "macao-international-fireworks-september-25-2026",
    headline: "Macao fireworks contest returns tonight with Portugal and Korea",
    summary: "Two free waterfront fireworks displays are scheduled in Macao tonight at 9:00 PM and 9:40 PM, with teams from Portugal and South Korea competing near Macau Tower.",
    destination: "Macao",
    country: "Macao",
    category: "events-experiences",
    publishedAt: "2026-09-25",
    image: {
      src: unsplash("photo-1519501025264-65ba15a82390", 2200),
      alt: "City skyline lights reflected across a waterfront at night",
    },
    body: [
      { type: "paragraph", text: "Macao's International Fireworks Display Contest continues tonight with two free performances over the waterfront near Macau Tower. Travelers in Macao this evening can watch teams from Portugal and South Korea compete in the latest round of the annual event." },
      { type: "heading", text: "Tonight's schedule" },
      { type: "list", items: ["9:00 PM — Pirotecnia Duarte, Portugal", "9:40 PM — Faseecom, South Korea", "Each fireworks display lasts approximately 18 minutes.", "Admission and viewing are free."] },
      { type: "heading", text: "Where to watch" },
      { type: "paragraph", text: "The official firing and display area is the waterfront near Macau Tower. The Macao Government Tourism Office also lists several other viewing areas, including:" },
      { type: "list", items: ["Anim'Arte NAM VAN and the Nam Van Lake area", "Avenida de Sagres near Mandarin Oriental Macau", "The waterfront near the Kun Iam Ecumenical Centre and Kun Iam Statue", "Macao Science Center Promenade", "Shoreline areas in Taipa"] },
      { type: "heading", text: "Planning your evening" },
      { type: "list", items: ["Arrive early for a comfortable viewing position.", "Expect larger crowds around popular waterfront viewing areas.", "Check local transport conditions before leaving.", "Event arrangements can still change, so check the official organizer page if weather or local conditions become uncertain."] },
    ],
    sources: [
      { label: "34th Macao International Fireworks Display Contest", url: "https://www.macaotourism.gov.mo/en/events/whatson/13663/", publisher: "Macao Government Tourism Office", accessedAt: september25AccessedAt },
    ],
    eventStartAt: "2026-09-25",
    eventEndAt: "2026-09-25",
    expiresAt: "2026-09-26T00:00:00+08:00",
    featured: false,
  },
  {
    id: "kuala-lumpur-autumn-music-cultural-festival-2026",
    slug: "kuala-lumpur-autumn-music-cultural-festival-2026",
    headline: "Free cultural festival starts today in Bukit Bintang",
    summary: "Kuala Lumpur's Autumn Music & Cultural Festival runs September 25–27 at Sungei Wang Plaza, with cultural performances, food, fashion and a fireworks highlight on Saturday.",
    destination: "Kuala Lumpur",
    country: "Malaysia",
    category: "events-experiences",
    publishedAt: "2026-09-25",
    image: destinationImage("malaysia"),
    body: [
      { type: "paragraph", text: "Travelers in Kuala Lumpur this weekend have a free event to add to their plans. The Autumn Music & Cultural Festival begins today in Bukit Bintang and runs through Sunday, September 27." },
      { type: "heading", text: "When and where" },
      { type: "list", items: ["September 25–27, 2026", "Sungei Wang Plaza / Jalan Sultan Ismail, Bukit Bintang", "Free and open to all"] },
      { type: "heading", text: "What visitors can expect" },
      { type: "list", items: ["Cultural and musical performances", "Malaysian cultural dance", "Cultural fashion showcases", "Local food and bazaar activities", "Arts and interactive cultural activities"] },
      { type: "heading", text: "Saturday's main program" },
      { type: "paragraph", text: "Tourism Malaysia identifies Saturday, September 26, as the festival's main highlight, with music, cultural performances and a fireworks display. Check the official programme if the evening timing matters to your plans." },
      { type: "heading", text: "How it could fit into your Kuala Lumpur trip" },
      { type: "paragraph", text: "The festival is in Bukit Bintang, so it can fit relatively easily into an evening already planned around Kuala Lumpur's central shopping and dining district." },
    ],
    sources: [
      { label: "Autumn Music & Cultural Festival 2026", url: "https://www.malaysia.travel/events/autumn-music-cultural-festival-2026", publisher: "Tourism Malaysia", accessedAt: september25AccessedAt },
    ],
    eventStartAt: "2026-09-25",
    eventEndAt: "2026-09-27",
    expiresAt: "2026-09-28T00:00:00+08:00",
    featured: false,
  },
];

const isExpired = (update: TravelUpdate, now: Date) =>
  Boolean(update.expiresAt && new Date(update.expiresAt).getTime() <= now.getTime());

export const getActiveTravelUpdates = (now = new Date()) =>
  travelUpdates
    .filter((update) => !isExpired(update, now))
    // Stable sort keeps the existing data order when publication dates match.
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const getHomepageTravelUpdates = (now = new Date()) =>
  getActiveTravelUpdates(now).slice(0, 3);

export const filterTravelUpdates = (
  updates: TravelUpdate[],
  destination: string,
  category: TravelUpdateCategory | "all",
) => updates.filter((update) =>
  (destination === "all" || update.destination === destination) &&
  (category === "all" || update.category === category),
);

export const getTravelUpdateBySlug = (slug: string | undefined) =>
  travelUpdates.find((update) => update.slug === slug);

export const getFeaturedTravelUpdate = (now = new Date()) => {
  const active = getActiveTravelUpdates(now);
  return active.find((update) => update.featured) ?? active[0];
};
