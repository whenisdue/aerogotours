import type { ItineraryItem, MyTripRecord, ReservationState, TravelMoment } from "../data/myTripTypes";
import { reservationStatusLabel } from "../data/myTripPresentation.ts";

type TripForContext = Pick<MyTripRecord, "destination" | "destinationShort" | "currentStage" | "companion">;

export type TravelEventKind = "flight" | "return-flight" | "activity" | "transfer" | "hotel" | "meal";

export type TravelEvent = {
  id: string;
  kind: TravelEventKind;
  title: string;
  location: string;
  note: string;
  status: ReservationState;
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
  checkInUrl?: string;
  airlineStatusUrl?: string;
  transportSummary?: string;
  sourceDate?: string;
};

export type NextAction = TravelEvent & {
  timeLabel: string | null;
  dateLabel: string | null;
  leaveByLabel: string | null;
  statusLabel: string;
};

export type ContextualHomeState = {
  moment: TravelMoment | "neutral";
  heading: string;
  supportingText: string;
  destinationLocalDate: string | null;
  destinationTimeZone?: string;
  freshnessText: string;
  nextAction?: NextAction;
  afterThis?: NextAction;
  preparationTasks: string[];
  neutralReason?: string;
};

export type ContextSelectionOptions = {
  now?: Date;
  momentOverride?: TravelMoment;
};

const kindOrder: Record<TravelEventKind, number> = {
  "return-flight": 0,
  flight: 1,
  transfer: 2,
  hotel: 3,
  activity: 4,
  meal: 5,
};

const hasTimeZone = (timeZone: string | undefined): timeZone is string => {
  if (!timeZone?.trim()) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
};

const philippineTimeZone = "Asia/Manila";

const friendlyTimeZoneNames: Record<string, string> = {
  "Asia/Hong_Kong": "Hong Kong time",
  "Asia/Manila": "Philippine time",
  "Asia/Tokyo": "Japan time",
  "Asia/Seoul": "South Korea time",
  "Asia/Bangkok": "Thailand time",
};

export function friendlyTimeZoneName(timeZone: string | undefined): string | null {
  if (!hasTimeZone(timeZone)) return null;
  return friendlyTimeZoneNames[timeZone] ?? `${timeZone.split("/").pop()?.replaceAll("_", " ") ?? "Local"} time`;
}

function timeZoneOffsetLabel(value: string | Date | undefined, timeZone: string | undefined): string | null {
  const instant = value instanceof Date ? value : parseInstant(value);
  if (!instant || !hasTimeZone(timeZone)) return null;
  const offset = new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "longOffset" })
    .formatToParts(instant)
    .find((part) => part.type === "timeZoneName")?.value;
  return offset === "GMT" ? "GMT+00:00" : offset ?? null;
}

export function shouldShowPhilippineTime(value: string | Date | undefined, destinationTimeZone: string | undefined): boolean {
  const destinationOffset = timeZoneOffsetLabel(value, destinationTimeZone);
  const philippineOffset = timeZoneOffsetLabel(value, philippineTimeZone);
  return Boolean(destinationOffset && philippineOffset && destinationOffset !== philippineOffset);
}

export function parseInstant(value: string | undefined): Date | null {
  if (!value || !/[Tt].*(?:Z|[+-]\d{2}:?\d{2})$/.test(value.trim())) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time) : null;
}

export function formatZonedTime(value: string | Date | undefined, timeZone: string | undefined): string | null {
  const instant = value instanceof Date ? value : parseInstant(value);
  if (!instant || !hasTimeZone(timeZone)) return null;
  return new Intl.DateTimeFormat("en-PH", { timeZone, hour: "numeric", minute: "2-digit" }).format(instant);
}

export function formatZonedDate(value: string | Date | undefined, timeZone: string | undefined): string | null {
  const instant = value instanceof Date ? value : parseInstant(value);
  if (!instant || !hasTimeZone(timeZone)) return null;
  return new Intl.DateTimeFormat("en-PH", { timeZone, weekday: "short", month: "short", day: "numeric" }).format(instant);
}

export function formatZonedDateTime(value: string | Date | undefined, timeZone: string | undefined): string | null {
  const instant = value instanceof Date ? value : parseInstant(value);
  if (!instant || !hasTimeZone(timeZone)) return null;
  return new Intl.DateTimeFormat("en-PH", { timeZone, dateStyle: "medium", timeStyle: "short" }).format(instant);
}

function zonedDateKey(value: string | Date | undefined, timeZone: string | undefined): string | null {
  const instant = value instanceof Date ? value : parseInstant(value);
  if (!instant || !hasTimeZone(timeZone)) return null;
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(instant);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return year && month && day ? `${year}-${month}-${day}` : null;
}

function statusForFlight(status: "sample" | "confirmed", reservationStatus?: ReservationState): ReservationState {
  return reservationStatus ?? (status === "confirmed" ? "confirmed" : "planned");
}

function statusForItem(item: ItineraryItem): ReservationState {
  return item.status ?? "planned";
}

function eventFromItem(dayDate: string, dayTimeZone: string | undefined, item: ItineraryItem, index: number): TravelEvent {
  const kind: TravelEventKind = item.kind === "flight" ? "flight" : item.kind === "stay" ? "hotel" : item.kind === "experience" ? "activity" : item.kind;
  return {
    id: item.id ?? `itinerary:${dayDate}:${index}:${item.title}`,
    kind,
    title: item.title,
    location: item.location,
    note: item.note,
    status: statusForItem(item),
    startsAt: item.startsAt,
    endsAt: item.endsAt,
    timeZone: item.timeZone ?? dayTimeZone,
    leaveByAt: item.leaveByAt,
    directionsUrl: item.directionsUrl,
    ticketUrl: item.ticketUrl,
    bookingUrl: item.bookingUrl,
    bookingReference: item.bookingReference,
    meetingPoint: item.meetingPoint,
    providerName: item.providerName,
    providerContact: item.providerContact,
    providerPhone: item.providerPhone,
    dropOffLocation: item.dropOffLocation,
    instructions: item.instructions,
    entryTime: item.entryTime,
    transportSummary: item.transportSummary,
    sourceDate: dayDate,
  };
}

export function buildTravelEvents(trip: TripForContext): TravelEvent[] {
  const flights = (trip.companion.flights ?? []).map((flight, index): TravelEvent => ({
    id: `flight:${index}`,
    kind: index === (trip.companion.flights?.length ?? 0) - 1 && (trip.companion.flights?.length ?? 0) > 1 ? "return-flight" : "flight",
    title: flight.label,
    location: flight.departureAirport ?? flight.route,
    note: flight.note,
    status: statusForFlight(flight.status, flight.reservationStatus),
    startsAt: flight.departureAt,
    endsAt: flight.arrivalAt,
    timeZone: flight.departureTimeZone,
    leaveByAt: flight.leaveByAt,
    directionsUrl: flight.directionsUrl,
    ticketUrl: flight.ticketUrl,
    bookingUrl: flight.bookingUrl,
    bookingReference: flight.bookingReference,
    checkInUrl: flight.checkInUrl,
    airlineStatusUrl: flight.airlineStatusUrl,
    transportSummary: flight.departureTerminal ? `Terminal ${flight.departureTerminal}` : undefined,
  }));

  const items = (trip.companion.itinerary ?? []).flatMap((day) => (day.items ?? []).map((item, index) => eventFromItem(day.date, day.timeZone ?? trip.companion.homeTimeZone, item, index)));
  return [...flights, ...items].sort((left, right) => {
    const leftTime = parseInstant(left.startsAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    const rightTime = parseInstant(right.startsAt)?.getTime() ?? Number.POSITIVE_INFINITY;
    return leftTime - rightTime || kindOrder[left.kind] - kindOrder[right.kind] || left.id.localeCompare(right.id);
  });
}

function isUsableEvent(event: TravelEvent): boolean {
  return event.status !== "cancelled" && Boolean(parseInstant(event.startsAt));
}

function asNextAction(event: TravelEvent, timeZoneFallback?: string): NextAction {
  const timeZone = event.timeZone ?? timeZoneFallback;
  const timeLabel = formatZonedTime(event.startsAt, timeZone);
  const dateLabel = formatZonedDate(event.startsAt, timeZone);
  const leaveByLabel = event.leaveByAt
    ? formatZonedTime(event.leaveByAt, timeZone) ?? "Departure time to be confirmed"
    : event.kind === "flight" || event.kind === "return-flight"
      ? "Departure time to be confirmed"
      : null;
  return {
    ...event,
    timeLabel,
    dateLabel,
    leaveByLabel,
    statusLabel: reservationStatusLabel(event.status, event.kind),
  };
}

function actionForId(events: TravelEvent[], id: string | undefined, timeZoneFallback?: string): NextAction | undefined {
  const event = events.find((candidate) => candidate.id === id && isUsableEvent(candidate));
  return event ? asNextAction(event, timeZoneFallback) : undefined;
}

function firstFutureEvent(events: TravelEvent[], now: Date, timeZoneFallback?: string): NextAction | undefined {
  const event = events.find((candidate) => isUsableEvent(candidate) && (parseInstant(candidate.startsAt)?.getTime() ?? -1) >= now.getTime());
  return event ? asNextAction(event, timeZoneFallback) : undefined;
}

function firstFutureEventAfter(events: TravelEvent[], now: Date, ignoredId: string | undefined, timeZoneFallback?: string): NextAction | undefined {
  const ignoredEvent = events.find((candidate) => candidate.id === ignoredId);
  const ignoredStart = parseInstant(ignoredEvent?.startsAt)?.getTime() ?? now.getTime();
  const threshold = Math.max(now.getTime(), ignoredStart);
  const event = events.find((candidate) => candidate.id !== ignoredId && isUsableEvent(candidate) && (parseInstant(candidate.startsAt)?.getTime() ?? -1) > threshold);
  return event ? asNextAction(event, timeZoneFallback) : undefined;
}

function firstFutureEventOnDate(events: TravelEvent[], now: Date, date: string | null, timeZoneFallback?: string): NextAction | undefined {
  if (!date) return undefined;
  const event = events.find((candidate) => isUsableEvent(candidate)
    && zonedDateKey(candidate.startsAt, candidate.timeZone ?? timeZoneFallback) === date
    && (parseInstant(candidate.startsAt)?.getTime() ?? -1) >= now.getTime());
  return event ? asNextAction(event, timeZoneFallback) : undefined;
}

function firstEventOfDay(events: TravelEvent[], now: Date, timeZone: string | undefined): NextAction | undefined {
  const today = zonedDateKey(now, timeZone);
  const event = events.find((candidate) => isUsableEvent(candidate) && zonedDateKey(candidate.startsAt, candidate.timeZone ?? timeZone) === today && (parseInstant(candidate.startsAt)?.getTime() ?? -1) > now.getTime());
  return event ? asNextAction(event, timeZone) : undefined;
}

function currentEvent(events: TravelEvent[], now: Date, timeZoneFallback?: string): NextAction | undefined {
  const event = events.find((candidate) => {
    if (!isUsableEvent(candidate)) return false;
    const start = parseInstant(candidate.startsAt)?.getTime();
    const end = parseInstant(candidate.endsAt)?.getTime();
    return start !== undefined && end !== undefined && start <= now.getTime() && now.getTime() < end && candidate.status === "confirmed";
  });
  return event ? asNextAction(event, timeZoneFallback) : undefined;
}

function hasUncertainTodayEvent(events: TravelEvent[], now: Date, timeZoneFallback?: string): boolean {
  const today = zonedDateKey(now, timeZoneFallback);
  return events.some((event) => {
    const start = parseInstant(event.startsAt)?.getTime();
    return isUsableEvent(event) && event.status !== "confirmed" && start !== undefined && start <= now.getTime() && zonedDateKey(event.startsAt, event.timeZone ?? timeZoneFallback) === today;
  });
}

function baseState(trip: TripForContext, now: Date, moment: ContextualHomeState["moment"], nextAction: NextAction | undefined, afterThis: NextAction | undefined, text: string, tasks: string[] = [], neutralReason?: string): ContextualHomeState {
  const timeZone = trip.companion.homeTimeZone ?? nextAction?.timeZone;
  const friendlyTimeZone = friendlyTimeZoneName(timeZone);
  return {
    moment,
    heading: moment === "end-of-day" ? "Today’s plan is complete." : moment === "completed" ? "Welcome home." : nextAction?.title ?? `Your ${trip.destinationShort} plan`,
    supportingText: text,
    destinationLocalDate: formatZonedDate(now, timeZone),
    destinationTimeZone: hasTimeZone(timeZone) ? timeZone : undefined,
    freshnessText: friendlyTimeZone ? `Trip details · ${friendlyTimeZone}` : "Trip details · Local time to be confirmed",
    nextAction,
    afterThis,
    preparationTasks: tasks,
    neutralReason,
  };
}

function stateForMoment(trip: TripForContext, events: TravelEvent[], now: Date, moment: TravelMoment): ContextualHomeState {
  const timeZone = trip.companion.homeTimeZone;
  const outbound = events.find((event) => event.kind === "flight");
  const returnFlight = [...events].reverse().find((event) => event.kind === "return-flight");
  const returnDate = zonedDateKey(returnFlight?.startsAt, returnFlight?.timeZone ?? timeZone);
  const next = moment === "before-departure" || moment === "departure-day"
    ? (actionForId(events, outbound?.id, timeZone) ?? firstFutureEvent(events, now, timeZone))
    : moment === "return-journey"
      ? (firstFutureEventOnDate(events, now, returnDate, timeZone) ?? firstFutureEvent(events, now, timeZone))
      : firstFutureEvent(events, now, timeZone);
  const current = moment === "active-travel-day" ? currentEvent(events, now, timeZone) : undefined;
  const selected = current ?? next;
  const afterThis = moment === "end-of-day" ? firstFutureEvent(events, now, timeZone) : firstFutureEventAfter(events, now, selected?.id, timeZone);
  const taskMap: Record<TravelMoment, string[]> = {
    "before-departure": ["Check traveler names and passport details.", "Keep your flight and hotel details easy to reach.", "Send AeroGo any questions before departure."],
    "departure-day": ["Keep passports and flight details together.", "Check in with the airline when a link is available."],
    arrival: ["Follow the transfer instructions when they are confirmed.", "Keep the hotel address handy for your arrival."],
    "active-travel-day": ["Keep your phone charged for directions and tickets.", "Allow extra time for queues, weather and your group."],
    "end-of-day": ["Check tomorrow’s first activity before you turn in.", "Message AeroGo if the plan needs to change."],
    "return-journey": ["Keep passports and return-flight details together.", "Check airline status when a link is available."],
    completed: [],
  };
  const copy: Record<TravelMoment, string> = {
    "before-departure": "Your trip is coming up. Here is what to prepare first.",
    "departure-day": "Your flight is today. Check the airport and leave-by details first.",
    arrival: "Your arrival plan is next. Flight times alone do not confirm that you have landed.",
    "active-travel-day": "Here is your next activity today. Directions appear when available.",
    "end-of-day": "Today’s plan is complete. Tomorrow’s first activity is shown below when its time is known.",
    "return-journey": "Your return trip is next. Check airline status when a link is available.",
    completed: "Your trip is complete. Thank you for travelling with AeroGo.",
  };
  return baseState(trip, now, moment, moment === "end-of-day" ? undefined : selected, afterThis, copy[moment], taskMap[moment]);
}

export function selectContextualHome(trip: TripForContext, options: ContextSelectionOptions = {}): ContextualHomeState {
  const now = options.now ?? new Date();
  const events = buildTravelEvents(trip);
  const timeZone = trip.companion.homeTimeZone;
  const configuredOverride = options.momentOverride ?? trip.companion.controlState?.momentOverride;
  if (trip.currentStage === "completed" || trip.companion.controlState?.completed) return stateForMoment(trip, events, now, "completed");
  const explicitNextAction = actionForId(events, trip.companion.controlState?.nextActionOverrideId, timeZone);
  if (explicitNextAction && !configuredOverride) return baseState(trip, now, "neutral", explicitNextAction, firstFutureEventAfter(events, now, explicitNextAction.id, timeZone), "AeroGo has highlighted this item as the safest next action based on the latest trip update.");
  if (configuredOverride) return stateForMoment(trip, events, now, configuredOverride);

  const outbound = events.find((event) => event.kind === "flight");
  const returnFlight = [...events].reverse().find((event) => event.kind === "return-flight");
  const outboundAt = parseInstant(outbound?.startsAt);
  const returnAt = parseInstant(returnFlight?.startsAt);
  const arrivalAt = parseInstant(outbound?.endsAt);
  const nowTime = now.getTime();

  if (outboundAt && nowTime < outboundAt.getTime()) {
    const sameDay = zonedDateKey(now, outbound?.timeZone ?? timeZone) === zonedDateKey(outboundAt, outbound?.timeZone ?? timeZone);
    return stateForMoment(trip, events, now, sameDay ? "departure-day" : "before-departure");
  }

  if (trip.companion.controlState?.arrivalStatus === "confirmed" && arrivalAt && nowTime >= arrivalAt.getTime() && nowTime < arrivalAt.getTime() + 12 * 60 * 60 * 1000) {
    return stateForMoment(trip, events, now, "arrival");
  }

  if (returnAt && zonedDateKey(now, returnFlight?.timeZone ?? timeZone) === zonedDateKey(returnAt, returnFlight?.timeZone ?? timeZone) && nowTime <= returnAt.getTime()) {
    return stateForMoment(trip, events, now, "return-journey");
  }

  if (hasUncertainTodayEvent(events, now, timeZone)) {
    return baseState(trip, now, "neutral", undefined, undefined, "AeroGo cannot safely tell whether an earlier scheduled item is complete yet.", [], "Check the latest trip update or contact AeroGo before relying on a new next action.");
  }

  const today = firstEventOfDay(events, now, timeZone);
  if (today || currentEvent(events, now, timeZone)) return stateForMoment(trip, events, now, "active-travel-day");

  const next = firstFutureEvent(events, now, timeZone);
  if (next && zonedDateKey(next.startsAt, next.timeZone ?? timeZone) !== zonedDateKey(now, timeZone)) {
    return stateForMoment(trip, events, now, "end-of-day");
  }

  return baseState(trip, now, "neutral", undefined, undefined, "AeroGo does not have enough reliable timing information to name a next action yet.", [], "Add confirmed dates or times to keep this view safely contextual.");
}
