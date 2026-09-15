export type TripEvent = {
  time: string;
  title: string;
  location: string;
  note: string;
  reference?: string;
  kind?: "flight" | "hotel" | "activity" | "transfer" | "meal";
};

export type TripDay = {
  day: number;
  date: string;
  title: string;
  summary: string;
  events: TripEvent[];
};

export const trip = {
  family: "Santos Family",
  destination: "Tokyo, Japan",
  city: "Tokyo",
  country: "Japan",
  day: 3,
  duration: 6,
  dates: "Nov 12–17, 2026",
  hotel: "Maple Stay Shinjuku",
  hotelAddress: "2-8-4 Shinjuku, Tokyo",
  hotelCheckIn: "3:00 PM",
  hotelPhone: "+81 3 5550 0123",
  airportPickup: "Hotel lobby, by the main entrance",
  baggage: "1 cabin bag + 1 checked bag per traveler",
  demoReference: "DEMO ONLY · AG-TK-4821",
};

export const tripDays: TripDay[] = [
  {
    day: 1,
    date: "Thu, Nov 12",
    title: "Arrive in Tokyo",
    summary: "A gentle arrival day and time to settle in.",
    events: [
      { time: "8:45 AM", title: "Flight to Tokyo", location: "Manila (MNL) → Narita (NRT)", note: "Demo Air · sample flight AG 427. Check in at the AeroGo-marked counter area.", reference: "AG-DEMO-427", kind: "flight" },
      { time: "2:10 PM", title: "Meet your airport transfer", location: "Narita Airport, arrival lobby", note: "A sample private transfer. Look for a name card with SANTOS FAMILY.", reference: "AG-DEMO-TR-12", kind: "transfer" },
      { time: "4:00 PM", title: "Check in at Maple Stay Shinjuku", location: "Shinjuku", note: "Rooms are ready from 3:00 PM. Keep your passports handy at reception.", reference: "AG-DEMO-H-308", kind: "hotel" },
    ],
  },
  {
    day: 2,
    date: "Fri, Nov 13",
    title: "Old Tokyo, at your pace",
    summary: "Temple lanes, local snacks, and an easy afternoon.",
    events: [
      { time: "9:30 AM", title: "Senso-ji & Nakamise Street", location: "Asakusa", note: "Go early for a quieter visit. The temple grounds are open-air and free to enter.", kind: "activity" },
      { time: "12:30 PM", title: "Lunch near Ueno Park", location: "Ueno", note: "A relaxed lunch stop; choose from the many family-friendly spots nearby.", kind: "meal" },
      { time: "2:00 PM", title: "Ueno Park wander", location: "Ueno", note: "Keep the afternoon flexible. Head back whenever everyone is ready.", kind: "activity" },
    ],
  },
  {
    day: 3,
    date: "Sat, Nov 14",
    title: "teamLab, Odaiba & Shibuya",
    summary: "An immersive morning, then the city lights.",
    events: [
      { time: "10:30 AM", title: "teamLab Planets", location: "Toyosu, Tokyo", note: "Timed entry for the family. Please arrive 15 minutes early; lockers are available inside.", reference: "AG-DEMO-TL-1030", kind: "activity" },
      { time: "1:00 PM", title: "Odaiba waterfront", location: "DiverCity Tokyo Plaza", note: "Take a break by the bay and enjoy an easy lunch at the mall.", kind: "activity" },
      { time: "6:00 PM", title: "Shibuya Crossing & dinner", location: "Shibuya Station, Hachiko Exit", note: "Meet on the Hachiko side. Dinner is flexible; a few family-friendly ideas are saved in your trip notes.", kind: "meal" },
    ],
  },
  {
    day: 4,
    date: "Sun, Nov 15",
    title: "A day near Mt. Fuji",
    summary: "A guided day out, with an early start.",
    events: [
      { time: "7:15 AM", title: "Mt. Fuji tour pickup", location: "Maple Stay Shinjuku lobby", note: "Please be downstairs by 7:00 AM. The van will wait near the main entrance.", reference: "AG-DEMO-FJ-715", kind: "transfer" },
      { time: "10:00 AM", title: "Lake Kawaguchi", location: "Fujikawaguchiko", note: "The view depends on the weather. Bring a light layer for the lakeside.", kind: "activity" },
      { time: "6:30 PM", title: "Return to Shinjuku", location: "Maple Stay Shinjuku", note: "Arrival time may vary with traffic. Message AeroGo if plans change.", kind: "transfer" },
    ],
  },
  {
    day: 5,
    date: "Mon, Nov 16",
    title: "A free day in the city",
    summary: "No fixed bookings. Make it your own.",
    events: [
      { time: "10:00 AM", title: "Choose your own adventure", location: "Tokyo", note: "Ideas: Meiji Shrine, Harajuku, or a slower morning near the hotel.", kind: "activity" },
      { time: "3:00 PM", title: "Last-minute shopping", location: "Shinjuku", note: "Keep receipts together if you plan to use tax-free shopping.", kind: "activity" },
    ],
  },
  {
    day: 6,
    date: "Tue, Nov 17",
    title: "Time to head home",
    summary: "A smooth check-out and airport transfer.",
    events: [
      { time: "10:00 AM", title: "Check out", location: "Maple Stay Shinjuku", note: "Leave your bags at reception if you have time before pickup.", kind: "hotel" },
      { time: "12:30 PM", title: "Airport transfer", location: "Hotel lobby", note: "Your sample pickup is arranged for the lobby. Please be ready 10 minutes early.", reference: "AG-DEMO-TR-17", kind: "transfer" },
      { time: "6:10 PM", title: "Flight home", location: "Narita (NRT) → Manila (MNL)", note: "Demo Air · sample flight AG 428. Arrive at the airport with time to spare.", reference: "AG-DEMO-428", kind: "flight" },
    ],
  },
];

export const checklistItems = [
  { id: "passports", label: "Passports with an adult", detail: "Keep the family’s travel IDs with you" },
  { id: "tickets", label: "teamLab QR tickets", detail: "Show the saved ticket at entry" },
  { id: "charger", label: "Portable charger", detail: "A full battery makes navigation easier" },
  { id: "shoes", label: "Comfortable shoes", detail: "You'll be on your feet most of the day" },
  { id: "umbrella", label: "Compact umbrella", detail: "Handy if the forecast changes" },
];

export const conversationSeed = [
  { id: "m1", sender: "traveler", text: "Hi! Just confirming, what time is our pickup tomorrow?", time: "Yesterday · 6:42 PM" },
  { id: "m2", sender: "aerogo", text: "Your Mt. Fuji tour pickup is at 7:15 AM in the hotel lobby. We recommend being downstairs by 7:00 AM.", time: "Yesterday · 6:48 PM" },
  { id: "m3", sender: "traveler", text: "Perfect, thank you!", time: "Yesterday · 6:50 PM" },
];

export const documents = [
  { category: "Flights", title: "Round-trip flight details", subtitle: "Manila ⇄ Narita · Demo Air", reference: "AG-DEMO-427 / 428", icon: "plane" },
  { category: "Hotel", title: "Hotel confirmation", subtitle: "Maple Stay Shinjuku · 5 nights", reference: "AG-DEMO-H-308", icon: "hotel" },
  { category: "Transfers", title: "Airport transfer plan", subtitle: "Narita Airport ⇄ Shinjuku", reference: "AG-DEMO-TR-12 / 17", icon: "car" },
  { category: "Activities", title: "teamLab Planets tickets", subtitle: "Sat, Nov 14 · 10:30 AM", reference: "AG-DEMO-TL-1030", icon: "ticket" },
  { category: "Activities", title: "Mt. Fuji day tour", subtitle: "Sun, Nov 15 · Pickup 7:15 AM", reference: "AG-DEMO-FJ-715", icon: "ticket" },
];
