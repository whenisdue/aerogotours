export type TripStage = "proposal" | "booking" | "companion" | "completed";
export type TripStatus = "active" | "expired" | "archived";

export type TripContact = {
  label: string;
  href: string;
  note: string;
};

export type ProposalOption = {
  id: string;
  name: string;
  description: string;
  amount: number;
  perTraveler: number;
  recommended?: boolean;
  includes: string[];
  excludes: string[];
};

export type ProposalInterest = {
  place: string;
  interest: string;
  note: string;
};

export type ProposalDetails = {
  kind: "illustrative";
  statusLabel: string;
  summary: string;
  pricingNote: string;
  otherInterests: ProposalInterest[];
};

export type QuoteRevision = {
  label: string;
  date: string;
  status: "current" | "superseded";
};

export type BookingProgressItem = {
  label: string;
  detail: string;
  status: "complete" | "current" | "upcoming";
};

export type ReservationState = "confirmed" | "planned" | "changed" | "cancelled" | "unknown";

export type TravelMoment = "before-departure" | "departure-day" | "arrival" | "active-travel-day" | "end-of-day" | "return-journey" | "completed";

export type DemoSimulationPreset = {
  now: string;
  label: string;
  description: string;
};

export type DemoSimulation = Record<TravelMoment, DemoSimulationPreset>;

export type TripLink = {
  label: string;
  url: string;
  lastCheckedAt?: string;
};

export type ExchangeRateInfo = {
  phpPerUnit: number;
  source?: string;
  checkedAt?: string;
};

export type ArrivalGuide = {
  airportName?: string;
  steps?: string[];
  hotelCheckIn?: string;
  officialLinks?: TripLink[];
};

export type TravelControlState = {
  arrivalStatus?: "unknown" | "confirmed";
  completed?: boolean;
  momentOverride?: TravelMoment;
  nextActionOverrideId?: string;
};

export type ItineraryItem = {
  id?: string;
  time: string;
  title: string;
  location: string;
  note: string;
  kind: "flight" | "stay" | "experience" | "transfer" | "meal";
  status?: ReservationState;
  startsAt?: string;
  endsAt?: string;
  timeZone?: string;
  leaveByAt?: string;
  directionsUrl?: string;
  ticketUrl?: string;
  bookingUrl?: string;
  bookingReference?: string;
  meetingPoint?: string;
  providerName?: string;
  providerContact?: string;
  providerPhone?: string;
  dropOffLocation?: string;
  instructions?: string;
  entryTime?: string;
  transportSummary?: string;
};

export type ItineraryDay = {
  day: number;
  date: string;
  dateISO?: string;
  timeZone?: string;
  title: string;
  summary: string;
  items: ItineraryItem[];
};

export type FlightSummary = {
  label: string;
  route: string;
  date: string;
  times: string;
  note: string;
  status: "sample" | "confirmed";
  reservationStatus?: ReservationState;
  airline?: string;
  flightNumber?: string;
  bookingReference?: string;
  bookingUrl?: string;
  departureAt?: string;
  arrivalAt?: string;
  departureTimeZone?: string;
  arrivalTimeZone?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
  leaveByAt?: string;
  checkInUrl?: string;
  airlineStatusUrl?: string;
  directionsUrl?: string;
  ticketUrl?: string;
};

export type HotelSummary = {
  name: string;
  area: string;
  dates: string;
  address: string;
  note: string;
  status: "sample" | "confirmed";
  reservationStatus?: ReservationState;
  bookingReference?: string;
  room?: string;
  phone?: string;
  bookingUrl?: string;
  directionsUrl?: string;
};

export type Attraction = {
  name: string;
  location: string;
  description: string;
  mapUrl?: string;
  image: string;
};

export type ExpenseEstimate = {
  label: string;
  amount: number;
  note: string;
  currency?: string;
  perPersonAmount?: number;
  phpEquivalent?: number;
  exchangeRate?: ExchangeRateInfo;
};

export type MyTripRecord = {
  token: string;
  status: TripStatus;
  currentStage: TripStage;
  isDemo: boolean;
  travelerName: string;
  destination: string;
  destinationShort: string;
  country: string;
  dates: string;
  duration: string;
  travelerCount: number;
  heroImage: { src: string; alt: string };
  quote: {
    status: string;
    validity: string;
    revision: string;
    revisions: QuoteRevision[];
    options: ProposalOption[];
  };
  proposal?: ProposalDetails;
  booking: {
    selectedPackageName: string;
    agreedTotal: number;
    agreedDate: string;
    paymentStatus: string;
    paymentDetail: string;
    acceptedQuoteSnapshot: {
      revision: string;
      packageName: string;
      total: number;
      date: string;
      note: string;
    };
    progress: BookingProgressItem[];
    requirements: { label: string; detail: string; status: "needed" | "received" | "not-yet" }[];
    nextSteps: string[];
  };
  companion: {
    homeTimeZone?: string;
    arrivalInstructions?: string;
    meetingPoint?: string;
    arrivalGuide?: ArrivalGuide;
    controlState?: TravelControlState;
    demoSimulation?: DemoSimulation;
    flights: FlightSummary[];
    hotel: HotelSummary;
    itinerary: ItineraryDay[];
    attractions: Attraction[];
    reminders: string[];
    expenses: ExpenseEstimate[];
  };
  completed: {
    message: string;
    note: string;
    reviewUrl?: string;
    retentionNote: string;
  };
  contact: TripContact;
  archiveDate: string;
};

export type ProposalItineraryItem = Pick<ItineraryItem, "time" | "title" | "location" | "note" | "kind">;

export type ProposalItineraryDay = Pick<ItineraryDay, "day" | "date" | "title" | "summary"> & {
  items: ProposalItineraryItem[];
};

export type ProposalPresentation = Pick<ProposalDetails, "kind" | "statusLabel" | "summary" | "pricingNote">;

export type ProposalTripRecord = {
  currentStage: "proposal";
  travelerName: string;
  destination: string;
  destinationShort: string;
  dates: string;
  duration: string;
  travelerCount: number;
  quote: Pick<MyTripRecord["quote"], "status" | "validity" | "revision" | "revisions" | "options">;
  proposal?: ProposalPresentation;
  companion: { itinerary: ProposalItineraryDay[] };
  contact: TripContact;
};
