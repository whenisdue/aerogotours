import type { ItineraryItem, MyTripRecord, ReservationState } from "../data/myTripTypes";

type TripForWallet = Omit<MyTripRecord, "token">;

export type WalletCategoryId = "flights" | "hotel" | "transfers" | "activities" | "costs";

export type WalletCategorySummary = {
  id: WalletCategoryId;
  label: string;
  itemCount: number;
  summary: string;
  status: string;
  needsAttention: boolean;
};

function reservationStatus(status: ReservationState | undefined, fallback: "confirmed" | "planned" = "planned"): ReservationState {
  return status ?? fallback;
}

function countLabel(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function statusText(statuses: ReservationState[], confirmedText: string, plannedText: string): string {
  if (statuses.length === 0) return "Not available yet";
  if (statuses.some((status) => status === "cancelled")) return "Canceled — check details";
  if (statuses.some((status) => status === "changed")) return "Changed — check details";
  if (statuses.some((status) => status === "unknown")) return "Booking status not available";
  if (statuses.every((status) => status === "confirmed")) return confirmedText;
  return plannedText;
}

function hasBookingUpdate(statuses: ReservationState[]): boolean {
  return statuses.some((status) => status === "changed" || status === "cancelled");
}

function itineraryItems(trip: TripForWallet, kind: ItineraryItem["kind"]): ItineraryItem[] {
  return (trip.companion.itinerary ?? []).flatMap((day) => (day.items ?? []).filter((item) => item.kind === kind));
}

export function getWalletCategorySummaries(trip: TripForWallet): WalletCategorySummary[] {
  const flights = trip.companion.flights ?? [];
  const transfers = itineraryItems(trip, "transfer");
  const activities = itineraryItems(trip, "experience");
  const expenses = trip.companion.expenses ?? [];
  const flightStatuses = flights.map((flight) => reservationStatus(flight.reservationStatus, flight.status === "confirmed" ? "confirmed" : "planned"));
  const transferStatuses = transfers.map((item) => reservationStatus(item.status));
  const activityStatuses = activities.map((item) => reservationStatus(item.status));
  const hotelStatus = reservationStatus(trip.companion.hotel.reservationStatus, trip.companion.hotel.status === "confirmed" ? "confirmed" : "planned");
  const hotelStatuses = trip.companion.hotel.name ? [hotelStatus] : [];
  const missingPhpEstimate = expenses.some((expense) => expense.currency && expense.currency !== "PHP" && expense.phpEquivalent === undefined && expense.exchangeRate?.phpPerUnit === undefined);

  return [
    {
      id: "flights",
      label: "Flights",
      itemCount: flights.length,
      summary: flights.length ? countLabel(flights.length, "flight") : "Not available yet",
      status: statusText(flightStatuses, "Booking confirmed", "Not yet booked"),
      needsAttention: hasBookingUpdate(flightStatuses),
    },
    {
      id: "hotel",
      label: "Hotel",
      itemCount: trip.companion.hotel.name ? 1 : 0,
      summary: trip.companion.hotel.name || "Not available yet",
      status: statusText(hotelStatuses, "Booking confirmed", "Not yet booked"),
      needsAttention: hasBookingUpdate(hotelStatuses),
    },
    {
      id: "transfers",
      label: "Transfers",
      itemCount: transfers.length,
      summary: transfers.length ? countLabel(transfers.length, "transfer") : "Not available yet",
      status: statusText(transferStatuses, "Booking confirmed", "Not yet booked"),
      needsAttention: hasBookingUpdate(transferStatuses),
    },
    {
      id: "activities",
      label: "Activities",
      itemCount: activities.length,
      summary: activities.length ? countLabel(activities.length, "activity", "activities") : "None listed yet",
      status: statusText(activityStatuses, "Booking confirmed", "Some plans are not final"),
      needsAttention: hasBookingUpdate(activityStatuses),
    },
    {
      id: "costs",
      label: "Costs",
      itemCount: expenses.length,
      summary: expenses.length ? countLabel(expenses.length, "estimate") : "None added yet",
      status: expenses.length === 0 ? "Nothing added yet" : missingPhpEstimate ? "Some PHP totals are unavailable" : "Estimates available",
      needsAttention: false,
    },
  ];
}
