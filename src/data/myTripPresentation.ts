import type { ReservationState, TripStage } from "./myTripTypes";

export function formatPhp(amount: number): string {
  if (!Number.isFinite(amount)) return "Amount to be confirmed";
  return new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(amount);
}

export type ReservationLabelContext = "flight" | "return-flight" | "transfer" | "hotel" | "activity" | "meal" | "other";

export function reservationStatusLabel(status: ReservationState, context: ReservationLabelContext = "other"): string {
  if (status === "confirmed") return "Booking confirmed";
  if (status === "cancelled") return "Canceled";
  if (status === "changed") return "Changed — check details";
  if (status === "unknown") return "Booking status not available";
  if (context === "activity") return "Suggested activity";
  if (context === "other" || context === "meal") return "Plan not final";
  return "Not yet booked";
}

export const tripStageLabels: Record<TripStage, { short: string; title: string; description: string }> = {
  proposal: { short: "Proposal", title: "Review your trip plan.", description: "Check the route, hotel and options AeroGo prepared." },
  booking: { short: "Booking", title: "Your booking is being arranged.", description: "Your accepted quote and next steps are shown here." },
  companion: { short: "Companion", title: "Your trip details.", description: "Use your day-by-day plan, bookings and help when you travel." },
  completed: { short: "Completed", title: "Your trip is complete.", description: "Review the trip and share feedback when you are ready." },
};
