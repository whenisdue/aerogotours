import { hongKongDreamImages } from "./dreamTrips.ts";
export type * from "./myTripTypes.ts";
import type { MyTripRecord } from "./myTripTypes.ts";

const demoMapUrl = (place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`;

export const demoHongKongTrip: MyTripRecord = {
  token: "demo",
  status: "active",
  currentStage: "proposal",
  isDemo: true,
  travelerName: "Mara & friends",
  destination: "Hong Kong, China",
  destinationShort: "Hong Kong",
  country: "China",
  dates: "18–22 November 2026",
  duration: "5 days / 4 nights",
  travelerCount: 4,
  heroImage: { src: hongKongDreamImages.hero.image, alt: hongKongDreamImages.hero.alt },
  quote: {
    status: "Proposal ready to review",
    validity: "Valid until 27 September 2026",
    revision: "Quote v2",
    revisions: [
      { label: "Quote v2", date: "20 Sep 2026", status: "current" },
      { label: "Quote v1", date: "18 Sep 2026", status: "superseded" },
    ],
    options: [
      {
        id: "city-essentials",
        name: "City Essentials",
        description: "A simple first Hong Kong stay with the city's main highlights.",
        amount: 128000,
        perTraveler: 32000,
        includes: ["4 nights in Kowloon", "Airport transfers", "Half-day city orientation", "Daily breakfast"],
        excludes: ["International airfare", "Lunches and dinners", "Travel insurance"],
      },
      {
        id: "harbour-and-hills",
        name: "Harbour & Hills",
        description: "A fuller plan with skyline views, harbour time and a slower Lantau day.",
        amount: 156000,
        perTraveler: 39000,
        recommended: true,
        includes: ["4 nights in Kowloon", "Airport transfers", "Victoria Peak experience", "Lantau day experience", "Daily breakfast"],
        excludes: ["International airfare", "Lunches and dinners", "Travel insurance"],
      },
      {
        id: "easy-family-pace",
        name: "Easy Family Pace",
        description: "More free time, with flexible afternoons and fewer fixed activities.",
        amount: 111000,
        perTraveler: 27750,
        includes: ["4 nights in Kowloon", "Airport transfers", "One guided city morning", "Daily breakfast"],
        excludes: ["International airfare", "Optional activities", "Travel insurance"],
      },
    ],
  },
  booking: {
    selectedPackageName: "Harbour & Hills",
    agreedTotal: 156000,
    agreedDate: "20 September 2026",
    paymentStatus: "Deposit not recorded yet",
    paymentDetail: "This demo shows where a confirmed payment status will appear.",
    acceptedQuoteSnapshot: {
      revision: "Quote v2",
      packageName: "Harbour & Hills",
      total: 156000,
      date: "20 September 2026",
      note: "This saved quote will stay the same if the proposal is updated.",
    },
    progress: [
      { label: "Proposal accepted", detail: "20 Sep · Selected package saved", status: "complete" },
      { label: "Check traveler details", detail: "Waiting for the required information", status: "current" },
      { label: "Booking confirmation", detail: "AeroGo will confirm availability after the required details are complete", status: "upcoming" },
      { label: "Trip space ready", detail: "Your final trip details", status: "upcoming" },
    ],
    requirements: [
      { label: "Traveler names as on passport", detail: "Needed before AeroGo can confirm availability", status: "needed" },
      { label: "Passport validity check", detail: "AeroGo will confirm the travel requirement", status: "not-yet" },
      { label: "Deposit", detail: "No payment credentials are collected here", status: "needed" },
    ],
    nextSteps: [
      "Review the accepted quote below.",
      "Message AeroGo with name corrections or questions.",
      "AeroGo will confirm availability before any booking is final.",
    ],
  },
  companion: {
    homeTimeZone: "Asia/Hong_Kong",
    arrivalInstructions: "Follow the transfer instructions once they are confirmed. You can find the hotel address in Wallet.",
    meetingPoint: "Hong Kong International Airport arrivals hall",
    demoSimulation: {
      "before-departure": { now: "2026-11-15T09:00:00+08:00", label: "Before departure", description: "See what to prepare before departure." },
      "departure-day": { now: "2026-11-18T05:30:00+08:00", label: "Departure day", description: "See your flight and airport details." },
      arrival: { now: "2026-11-18T12:30:00+08:00", label: "Arrival", description: "See what to do after landing." },
      "active-travel-day": { now: "2026-11-19T08:30:00+08:00", label: "Active sightseeing", description: "See your next activity today." },
      "end-of-day": { now: "2026-11-19T23:00:00+08:00", label: "End of day", description: "See what is complete and what comes next." },
      "return-journey": { now: "2026-11-22T12:00:00+08:00", label: "Return journey", description: "See your airport transfer and return flight." },
      completed: { now: "2026-11-24T12:00:00+08:00", label: "Completed trip", description: "See the completed-trip message." },
    },
    flights: [
      { label: "Departure flight", route: "Manila (MNL) → Hong Kong (HKG)", date: "Wed, 18 Nov", times: "09:10 → 11:45", note: "Example schedule only. This flight is not booked.", status: "sample", airline: "AeroGo Demo Air", flightNumber: "AG 102", departureAt: "2026-11-18T09:10:00+08:00", arrivalAt: "2026-11-18T11:45:00+08:00", departureTimeZone: "Asia/Manila", arrivalTimeZone: "Asia/Hong_Kong", departureAirport: "Manila Ninoy Aquino International Airport (MNL)", arrivalAirport: "Hong Kong International Airport (HKG)", departureTerminal: "3", leaveByAt: "2026-11-18T06:00:00+08:00", directionsUrl: demoMapUrl("Manila Ninoy Aquino International Airport Terminal 3") },
      { label: "Return flight", route: "Hong Kong (HKG) → Manila (MNL)", date: "Sun, 22 Nov", times: "18:40 → 21:05", note: "Example schedule only. This flight is not booked.", status: "sample", airline: "AeroGo Demo Air", flightNumber: "AG 103", departureAt: "2026-11-22T18:40:00+08:00", arrivalAt: "2026-11-22T21:05:00+08:00", departureTimeZone: "Asia/Hong_Kong", arrivalTimeZone: "Asia/Manila", departureAirport: "Hong Kong International Airport (HKG)", arrivalAirport: "Manila Ninoy Aquino International Airport (MNL)", leaveByAt: "2026-11-22T15:15:00+08:00", directionsUrl: demoMapUrl("Hong Kong International Airport") },
    ],
    hotel: {
      name: "Harbour Lane Hotel",
      area: "Jordan, Kowloon",
      dates: "18–22 November · 4 nights",
      address: "Demo address · Jordan, Kowloon",
      note: "Fictional demo booking. This is not a real reservation.",
      status: "confirmed",
      reservationStatus: "confirmed",
      bookingReference: "DEMO-HOTEL-4821",
      room: "Family room · 2 beds",
      directionsUrl: demoMapUrl("Harbour Lane Hotel Jordan Kowloon"),
    },
    arrivalGuide: {
      airportName: "Hong Kong International Airport",
      steps: ["Follow airport arrival signs.", "Complete the arrival procedures that apply to you.", "Collect checked baggage if applicable.", "Follow your confirmed transfer instructions."],
      hotelCheckIn: "From 3:00 PM",
      officialLinks: [{ label: "Hong Kong airport arrival information", url: "https://www.hongkongairport.com/en/passenger-guide/", lastCheckedAt: "20 September 2026" }],
    },
    itinerary: [
      { day: 1, date: "Wed, 18 Nov", dateISO: "2026-11-18", timeZone: "Asia/Hong_Kong", title: "Arrive between harbour and city lights", summary: "A gentle arrival, check-in and a first walk near the water.", items: [
        { id: "arrival-transfer", time: "Afternoon", title: "Airport transfer & hotel check-in", location: "Hong Kong International Airport", dropOffLocation: "Harbour Lane Hotel", note: "A suggested route; final transfer details are not confirmed.", instructions: "Follow the airport arrival signs. The meeting point will be confirmed by AeroGo before travel.", providerName: "AeroGo Demo Transfers", kind: "transfer", startsAt: "2026-11-18T13:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Harbour Lane Hotel Jordan Kowloon"), transportSummary: "Airport arrivals → Jordan" },
        { id: "welcome-walk", time: "Evening", title: "Victoria Harbour welcome walk", location: "Tsim Sha Tsui waterfront", note: "Keep the first evening light and follow the group's energy.", kind: "experience", startsAt: "2026-11-18T18:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Tsim Sha Tsui Promenade Hong Kong") },
      ] },
      { day: 2, date: "Thu, 19 Nov", dateISO: "2026-11-19", timeZone: "Asia/Hong_Kong", title: "Old lanes, high rises and a long lunch", summary: "Central, Sheung Wan and the details between the landmarks.", items: [
        { id: "central-mid-levels", time: "Morning", title: "Central & Mid-Levels", location: "Central / Sheung Wan", note: "Suggested orientation through the city's older streets and vertical layers.", kind: "experience", startsAt: "2026-11-19T09:30:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", leaveByAt: "2026-11-19T08:45:00+08:00", directionsUrl: demoMapUrl("Central Hong Kong") },
        { id: "local-lunch", time: "Lunch", title: "Local lunch pause", location: "Sheung Wan", note: "Choose the table that looks good on the day. Meals are not included in this estimate.", kind: "meal", startsAt: "2026-11-19T12:30:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Sheung Wan Hong Kong") },
        { id: "man-mo-temple", time: "Afternoon", title: "Man Mo Temple & Hollywood Road", location: "Tai Ping Shan Street", note: "Leave room for galleries, small shops and a slower walk back.", kind: "experience", startsAt: "2026-11-19T14:30:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Man Mo Temple Hong Kong") },
      ] },
      { day: 3, date: "Fri, 20 Nov", dateISO: "2026-11-20", timeZone: "Asia/Hong_Kong", title: "See Hong Kong from above", summary: "Make Victoria Peak the anchor, then let the evening stay open.", items: [
        { id: "victoria-peak", time: "Morning", title: "Victoria Peak viewpoint", location: "The Peak, Hong Kong Island", note: "Fictional confirmed activity for this demo. Ticket link is not available.", instructions: "Show the booking reference at the entrance.", bookingReference: "DEMO-PEAK-2026", entryTime: "10:00 AM", kind: "experience", startsAt: "2026-11-20T09:30:00+08:00", timeZone: "Asia/Hong_Kong", status: "confirmed", directionsUrl: demoMapUrl("Victoria Peak Hong Kong") },
        { id: "return-central", time: "Afternoon", title: "Return to Central", location: "Central", note: "A flexible afternoon for a café, rest or a little more city.", kind: "experience", startsAt: "2026-11-20T14:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Central Hong Kong") },
        { id: "dinner", time: "Evening", title: "Dinner at your own pace", location: "Central or Jordan", note: "AeroGo can help with ideas; dining is excluded from the estimate.", kind: "meal", startsAt: "2026-11-20T19:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned" },
      ] },
      { day: 4, date: "Sat, 21 Nov", dateISO: "2026-11-21", timeZone: "Asia/Hong_Kong", title: "Find a quieter side of Hong Kong", summary: "A full island day with mountain air, big views and a softer rhythm.", items: [
        { id: "ngong-ping", time: "Morning", title: "Lantau / Ngong Ping", location: "Lantau Island", note: "Suggested day experience; cable car and attraction arrangements require confirmation.", kind: "experience", startsAt: "2026-11-21T09:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Ngong Ping Hong Kong") },
        { id: "po-lin", time: "Afternoon", title: "Po Lin & Big Buddha area", location: "Ngong Ping", note: "Dress for the weather and allow time between viewpoints.", kind: "experience", startsAt: "2026-11-21T13:30:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Po Lin Monastery Hong Kong") },
        { id: "return-kowloon", time: "Evening", title: "Return to your hotel in Kowloon", location: "Jordan, Kowloon", note: "Suggested return from Lantau after the day trip. The airport transfer is listed separately for 22 Nov.", kind: "transfer", startsAt: "2026-11-21T18:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Jordan Kowloon Hong Kong"), transportSummary: "Lantau Island → Jordan" },
      ] },
      { day: 5, date: "Sun, 22 Nov", dateISO: "2026-11-22", timeZone: "Asia/Hong_Kong", title: "Leave with one last favorite", summary: "A calm final morning, then a simple journey home.", items: [
        { id: "free-morning", time: "Morning", title: "Free morning near the hotel", location: "Jordan / Tsim Sha Tsui", note: "A final breakfast, market browse or a slow coffee close to base.", kind: "experience", startsAt: "2026-11-22T09:00:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Tsim Sha Tsui Hong Kong") },
        { id: "return-transfer", time: "Afternoon", title: "Airport transfer", location: "Jordan → HKG", note: "Allow generous time for check-in and departure formalities.", kind: "transfer", startsAt: "2026-11-22T15:15:00+08:00", timeZone: "Asia/Hong_Kong", status: "planned", directionsUrl: demoMapUrl("Hong Kong International Airport"), transportSummary: "Jordan → HKG" },
      ] },
    ],
    attractions: [
      { name: "Victoria Peak", location: "The Peak", description: "A classic high viewpoint over the harbour and city. Weather can change the view quickly.", mapUrl: demoMapUrl("Victoria Peak Hong Kong"), image: hongKongDreamImages.peak.image },
      { name: "Victoria Harbour", location: "Tsim Sha Tsui", description: "A simple, generous walk for seeing the skyline from the water's edge.", mapUrl: demoMapUrl("Tsim Sha Tsui Promenade Hong Kong"), image: hongKongDreamImages.harbour.image },
      { name: "Ngong Ping", location: "Lantau Island", description: "A slower day beyond the high-rises, with mountain views and open space.", mapUrl: demoMapUrl("Ngong Ping Hong Kong"), image: hongKongDreamImages.lantau.image },
    ],
    reminders: [
      "Carry a small layer for air-conditioned trains, ferries and indoor spaces.",
      "Keep some Hong Kong dollars or a usable transit option for small purchases.",
      "Build in extra time for hills, queues, weather and the pace of your group.",
      "All times and routes here are planning estimates until AeroGo confirms them.",
    ],
    expenses: [
      { label: "Airport transfer", amount: 200, currency: "HKD", perPersonAmount: 50, phpEquivalent: 1500, exchangeRate: { phpPerUnit: 7.5, source: "Illustrative demo rate", checkedAt: "20 September 2026" }, note: "Illustrative estimate for 4 people." },
      { label: "Local transport", amount: 850, currency: "HKD", perPersonAmount: 212.5, phpEquivalent: 6375, exchangeRate: { phpPerUnit: 7.5, source: "Illustrative demo rate", checkedAt: "20 September 2026" }, note: "Illustrative estimate for 4 people." },
      { label: "Attraction tickets", amount: 400, currency: "HKD", perPersonAmount: 100, note: "Illustrative activity estimate. PHP equivalent not provided." },
      { label: "Small extras", amount: 300, currency: "HKD", perPersonAmount: 75, note: "Illustrative estimate for 4 people." },
    ],
  },
  completed: {
    message: "Welcome home, Mara & friends.",
    note: "Thank you for travelling with us. We hope you enjoyed your time in Hong Kong.",
    retentionNote: "For a real completed trip, AeroGo may archive or remove details under its data policy.",
  },
  contact: {
    label: "Message AeroGo",
    href: "/#inquire",
    note: "Questions or changes? Send AeroGo a message.",
  },
  archiveDate: "31 December 2026",
};

/**
 * Phase 1 intentionally returns only the fictional demo record. A real deployment
 * should replace this function with a server-side token lookup before adding customer data.
 */
export function getTripByToken(token: string | undefined): MyTripRecord | null {
  return token === demoHongKongTrip.token ? demoHongKongTrip : null;
}
