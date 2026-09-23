import assert from "node:assert/strict";
import { test } from "node:test";

const { demoHongKongTrip } = await import("../src/data/myTrip.ts");
const { reservationStatusLabel } = await import("../src/data/myTripPresentation.ts");
const { expensePhpEquivalent, expensePerPersonAmount, formatCurrencyAmount, summarizeExpenses } = await import("../src/utils/expensePresentation.ts");
const { formatZonedTime, friendlyTimeZoneName, selectContextualHome, shouldShowPhilippineTime } = await import("../src/utils/nextAction.ts");
const { getWalletCategorySummaries } = await import("../src/utils/walletSummary.ts");
const { safeContactUrl, safeExternalUrl, safeTelephoneUrl } = await import("../src/utils/safeUrl.ts");
const { sanitizeClientTrip } = await import("../server/tripDataSafety.ts");
const { resolveInitialTripStage } = await import("../src/utils/tripEntry.ts");

const tripAt = (moment) => structuredClone(demoHongKongTrip).companion.demoSimulation[moment].now;

test("authenticated entry respects every server stage while demo defaults to Companion", () => {
  for (const stage of ["proposal", "booking", "companion", "completed"]) {
    assert.equal(resolveInitialTripStage(stage, false), stage);
    assert.equal(resolveInitialTripStage("proposal", true, stage), stage);
  }
  assert.equal(resolveInitialTripStage("proposal", true), "companion");
  assert.equal(resolveInitialTripStage("proposal", true, "not-a-stage"), "companion");
});

test("demo moments produce a deterministic contextual state", () => {
  const before = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("before-departure")), momentOverride: "before-departure" });
  assert.equal(before.moment, "before-departure");
  assert.equal(before.nextAction?.title, "Departure flight");
  assert.equal(before.nextAction?.statusLabel, "Not yet booked");

  const departure = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("departure-day")), momentOverride: "departure-day" });
  assert.equal(departure.nextAction?.timeLabel, "9:10 AM");
  assert.equal(departure.nextAction?.leaveByLabel, "6:00 AM");
  assert.equal(departure.nextAction?.statusLabel, "Not yet booked");

  const arrival = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("arrival")), momentOverride: "arrival" });
  assert.equal(arrival.moment, "arrival");
  assert.equal(arrival.nextAction?.title, "Airport transfer & hotel check-in");
  assert.equal(arrival.nextAction?.statusLabel, "Not yet booked");

  const active = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("active-travel-day")), momentOverride: "active-travel-day" });
  assert.equal(active.nextAction?.title, "Central & Mid-Levels");
  assert.equal(active.nextAction?.statusLabel, "Suggested activity");

  const endOfDay = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("end-of-day")), momentOverride: "end-of-day" });
  assert.equal(endOfDay.moment, "end-of-day");
  assert.equal(endOfDay.nextAction, undefined);
  assert.equal(endOfDay.afterThis?.title, "Victoria Peak viewpoint");

  const returnJourney = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("return-journey")), momentOverride: "return-journey" });
  assert.equal(returnJourney.nextAction?.title, "Airport transfer");
  assert.equal(returnJourney.nextAction?.timeLabel, "3:15 PM");
  assert.equal(returnJourney.nextAction?.leaveByLabel, null);
  assert.equal(returnJourney.nextAction?.statusLabel, "Not yet booked");
  assert.equal(returnJourney.afterThis?.title, "Return flight");
  assert.equal(returnJourney.afterThis?.timeLabel, "6:40 PM");
  assert.equal(returnJourney.afterThis?.statusLabel, "Not yet booked");
});

test("customer-facing status labels preserve each booking meaning", () => {
  assert.equal(reservationStatusLabel("confirmed", "flight"), "Booking confirmed");
  assert.equal(reservationStatusLabel("planned", "flight"), "Not yet booked");
  assert.equal(reservationStatusLabel("planned", "activity"), "Suggested activity");
  assert.equal(reservationStatusLabel("planned", "other"), "Plan not final");
  assert.equal(reservationStatusLabel("changed", "transfer"), "Changed — check details");
  assert.equal(reservationStatusLabel("cancelled", "activity"), "Canceled");
  assert.equal(reservationStatusLabel("unknown", "hotel"), "Booking status not available");
});

test("a flight leave-by time is not treated as a separate transfer booking", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.itinerary[4].items = trip.companion.itinerary[4].items.filter((item) => item.id !== "return-transfer");
  const state = selectContextualHome(trip, { now: new Date(tripAt("return-journey")), momentOverride: "return-journey" });
  assert.equal(state.nextAction?.title, "Return flight");
  assert.equal(state.nextAction?.timeLabel, "6:40 PM");
  assert.equal(state.nextAction?.leaveByLabel, "3:15 PM");
  assert.equal(state.afterThis, undefined);
});

test("return-journey after-this items remain strictly chronological", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.itinerary[4].items[1].startsAt = "2026-11-22T19:15:00+08:00";
  const state = selectContextualHome(trip, { now: new Date(tripAt("return-journey")), momentOverride: "return-journey" });
  assert.equal(state.nextAction?.title, "Return flight");
  assert.equal(state.afterThis?.title, "Airport transfer");
  assert.equal(state.afterThis?.timeLabel, "7:15 PM");
});

test("scheduled arrival does not imply that the flight landed", () => {
  const trip = structuredClone(demoHongKongTrip);
  const state = selectContextualHome(trip, { now: new Date("2026-11-18T12:30:00+08:00") });
  assert.notEqual(state.moment, "arrival");
  assert.equal(state.moment, "neutral");
  assert.equal(state.nextAction, undefined);
});

test("a past unconfirmed item prevents a misleading next action", () => {
  const trip = structuredClone(demoHongKongTrip);
  const state = selectContextualHome(trip, { now: new Date("2026-11-19T10:00:00+08:00") });
  assert.equal(state.moment, "neutral");
  assert.equal(state.nextAction, undefined);
});

test("cancelled items are never selected as the next action", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.itinerary[1].items[0].status = "cancelled";
  const state = selectContextualHome(trip, { now: new Date("2026-11-19T08:30:00+08:00") });
  assert.equal(state.nextAction?.title, "Local lunch pause");
});

test("missing leave-by times remain explicit instead of being fabricated", () => {
  const trip = structuredClone(demoHongKongTrip);
  delete trip.companion.flights[0].leaveByAt;
  const state = selectContextualHome(trip, { now: new Date(tripAt("departure-day")), momentOverride: "departure-day" });
  assert.equal(state.nextAction?.leaveByLabel, "Departure time to be confirmed");
});

test("invalid or missing schedule data falls back to a safe neutral overview", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.flights = [];
  trip.companion.itinerary = trip.companion.itinerary.map((day) => ({ ...day, items: day.items.map((item) => ({ ...item, startsAt: undefined, endsAt: undefined })) }));
  const state = selectContextualHome(trip, { now: new Date("2026-11-19T08:30:00+08:00") });
  assert.equal(state.moment, "neutral");
  assert.equal(state.nextAction, undefined);
});

test("overlapping confirmed activities resolve deterministically", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.itinerary[1].items[0].status = "confirmed";
  trip.companion.itinerary[1].items[0].endsAt = "2026-11-19T11:30:00+08:00";
  trip.companion.itinerary[1].items.push({
    id: "overlap-later",
    time: "Morning",
    title: "Overlapping planned stop",
    location: "Central",
    note: "Illustrative overlap.",
    kind: "experience",
    status: "confirmed",
    startsAt: "2026-11-19T09:30:00+08:00",
    endsAt: "2026-11-19T10:45:00+08:00",
    timeZone: "Asia/Hong_Kong",
  });
  const state = selectContextualHome(trip, { now: new Date("2026-11-19T10:00:00+08:00") });
  assert.equal(state.nextAction?.title, "Central & Mid-Levels");
});

test("destination time formatting uses the supplied IANA zone", () => {
  const instant = "2026-11-18T09:10:00+08:00";
  assert.equal(formatZonedTime(instant, "Asia/Hong_Kong"), "9:10 AM");
  assert.equal(formatZonedTime(instant, "Asia/Tokyo"), "10:10 AM");
  assert.equal(formatZonedTime(instant, "not/a-time-zone"), null);
});

test("wallet summaries keep planning and estimate gaps neutral", () => {
  const summaries = getWalletCategorySummaries(demoHongKongTrip);
  const byId = Object.fromEntries(summaries.map((summary) => [summary.id, summary]));
  assert.deepEqual(summaries.map((summary) => summary.id), ["flights", "hotel", "transfers", "activities", "costs"]);
  assert.deepEqual(Object.fromEntries(summaries.map((summary) => [summary.id, summary.itemCount])), { flights: 2, hotel: 1, transfers: 3, activities: 8, costs: 4 });
  assert.equal(byId.flights.status, "Not yet booked");
  assert.equal(byId.flights.needsAttention, false);
  assert.equal(byId.hotel.status, "Booking confirmed");
  assert.equal(byId.hotel.needsAttention, false);
  assert.equal(byId.transfers.status, "Not yet booked");
  assert.equal(byId.transfers.needsAttention, false);
  assert.equal(byId.activities.status, "Some plans are not final");
  assert.equal(byId.activities.needsAttention, false);
  assert.equal(byId.costs.status, "Some PHP totals are unavailable");
  assert.equal(byId.costs.needsAttention, false);
  assert.equal(summaries.some((summary) => summary.needsAttention), false);
  assert.equal(summaries.every((summary) => Number.isSafeInteger(summary.itemCount) && summary.itemCount >= 0), true);
  assert.equal(demoHongKongTrip.companion.expenses.every((expense) => Number.isFinite(expense.amount)), true);
});

test("wallet summaries surface truthful changed and canceled booking updates", () => {
  const changed = structuredClone(demoHongKongTrip);
  changed.companion.flights[0].reservationStatus = "changed";
  const changedFlights = Object.fromEntries(getWalletCategorySummaries(changed).map((summary) => [summary.id, summary]));
  assert.equal(changedFlights.flights.status, "Changed — check details");
  assert.equal(changedFlights.flights.needsAttention, true);

  const cancelled = structuredClone(demoHongKongTrip);
  cancelled.companion.itinerary[0].items[0].status = "cancelled";
  const cancelledTransfers = Object.fromEntries(getWalletCategorySummaries(cancelled).map((summary) => [summary.id, summary]));
  assert.equal(cancelledTransfers.transfers.status, "Canceled — check details");
  assert.equal(cancelledTransfers.transfers.needsAttention, true);
});

test("wallet summaries distinguish mixed, unknown, empty and fully confirmed categories", () => {
  const mixed = structuredClone(demoHongKongTrip);
  mixed.companion.flights[0].reservationStatus = "confirmed";
  mixed.companion.flights[1].reservationStatus = "planned";
  mixed.companion.itinerary[0].items[0].status = "unknown";
  mixed.companion.hotel.name = "";
  mixed.companion.hotel.reservationStatus = "confirmed";
  const mixedById = Object.fromEntries(getWalletCategorySummaries(mixed).map((summary) => [summary.id, summary]));
  assert.equal(mixedById.flights.status, "Not yet booked");
  assert.notEqual(mixedById.flights.status, "Booking confirmed");
  assert.equal(mixedById.transfers.status, "Booking status not available");
  assert.equal(mixedById.transfers.needsAttention, false);
  assert.equal(mixedById.hotel.status, "Not available yet");
  assert.equal(mixedById.hotel.needsAttention, false);

  const confirmed = structuredClone(demoHongKongTrip);
  confirmed.companion.flights.forEach((flight) => { flight.reservationStatus = "confirmed"; });
  confirmed.companion.itinerary.forEach((day) => day.items.forEach((item) => { if (item.kind === "transfer" || item.kind === "experience") item.status = "confirmed"; }));
  confirmed.companion.expenses.forEach((expense) => { expense.phpEquivalent = expense.amount * 7.5; });
  const confirmedById = Object.fromEntries(getWalletCategorySummaries(confirmed).map((summary) => [summary.id, summary]));
  assert.equal(confirmedById.flights.status, "Booking confirmed");
  assert.equal(confirmedById.hotel.status, "Booking confirmed");
  assert.equal(confirmedById.transfers.status, "Booking confirmed");
  assert.equal(confirmedById.activities.status, "Booking confirmed");
  assert.equal(confirmedById.costs.status, "Estimates available");
  assert.equal(Object.values(confirmedById).some((summary) => summary.needsAttention), false);
});

test("demo transfer records distinguish the hotel return from the airport transfer", () => {
  const dayFour = demoHongKongTrip.companion.itinerary.find((day) => day.day === 4);
  const dayFive = demoHongKongTrip.companion.itinerary.find((day) => day.day === 5);
  const hotelReturn = dayFour?.items.find((item) => item.id === "return-kowloon");
  const airportTransfer = dayFive?.items.find((item) => item.id === "return-transfer");
  assert.equal(hotelReturn?.location, "Jordan, Kowloon");
  assert.equal(hotelReturn?.transportSummary, "Lantau Island → Jordan");
  assert.equal(airportTransfer?.location, "Jordan → HKG");
  assert.notEqual(hotelReturn?.id, airportTransfer?.id);
});

test("customer-facing timezone labels hide IANA identifiers", () => {
  assert.equal(friendlyTimeZoneName("Asia/Hong_Kong"), "Hong Kong time");
  assert.equal(friendlyTimeZoneName("Asia/Manila"), "Philippine time");
  assert.equal(friendlyTimeZoneName("not/a-time-zone"), null);
  const home = selectContextualHome(demoHongKongTrip, { now: new Date(tripAt("active-travel-day")), momentOverride: "active-travel-day" });
  assert.equal(home.freshnessText, "Trip details · Hong Kong time");
});

test("current time keeps Philippine reference only for a different UTC offset", () => {
  const instant = "2026-11-18T09:10:00+08:00";
  assert.equal(shouldShowPhilippineTime(instant, "Asia/Hong_Kong"), false);
  assert.equal(shouldShowPhilippineTime(instant, "Asia/Tokyo"), true);
  assert.equal(shouldShowPhilippineTime(instant, undefined), false);
  assert.equal(shouldShowPhilippineTime(instant, "not/a-time-zone"), false);
});

test("current time formatting updates when the reactive clock receives a new value", () => {
  const before = new Date("2026-11-18T09:10:00+08:00");
  const after = new Date("2026-11-18T09:11:00+08:00");
  assert.equal(formatZonedTime(before, "Asia/Hong_Kong"), "9:10 AM");
  assert.equal(formatZonedTime(after, "Asia/Hong_Kong"), "9:11 AM");
  assert.notEqual(formatZonedTime(before, "Asia/Hong_Kong"), formatZonedTime(after, "Asia/Hong_Kong"));
});

test("expense presentation keeps per-person and group totals separate", () => {
  const expenses = [
    { label: "Transfer", amount: 200, currency: "HKD", perPersonAmount: 50, phpEquivalent: 1500, note: "Estimate" },
    { label: "Tickets", amount: 400, currency: "HKD", perPersonAmount: 100, note: "PHP rate missing" },
  ];
  assert.equal(expensePerPersonAmount(expenses[0], 4), 50);
  assert.equal(expensePhpEquivalent(expenses[0]), 1500);
  assert.equal(expensePhpEquivalent(expenses[1]), null);
  assert.deepEqual(summarizeExpenses(expenses), { currencyTotals: [{ currency: "HKD", amount: 600 }], phpTotal: null, missingPhpConversion: true });
  assert.equal(formatCurrencyAmount(Number.NaN, "HKD"), "Amount to be confirmed");
});

test("unsafe booking links are rejected and safe actions remain available", () => {
  assert.equal(safeExternalUrl("javascript:alert(1)"), undefined);
  assert.equal(safeExternalUrl("data:text/plain,not-safe"), undefined);
  assert.equal(safeExternalUrl("/internal"), undefined);
  assert.equal(safeExternalUrl("https://www.google.com/maps"), "https://www.google.com/maps");
  assert.equal(safeContactUrl("/#inquire"), "/#inquire");
  assert.equal(safeTelephoneUrl("+852 5555 0123"), "tel:+85255550123");
  assert.equal(safeTelephoneUrl("javascript:bad"), undefined);
});

test("server trip sanitization removes unsafe optional links without changing booking data", () => {
  const trip = structuredClone(demoHongKongTrip);
  trip.companion.flights[0].ticketUrl = "javascript:alert(1)";
  trip.companion.hotel.directionsUrl = "data:text/plain,not-safe";
  trip.companion.itinerary[0].items[0].directionsUrl = "https://maps.google.com/valid";
  trip.companion.arrivalGuide.officialLinks = [{ label: "Unsafe", url: "javascript:alert(1)" }];
  const sanitized = sanitizeClientTrip({ ...trip, token: undefined });
  assert.equal(sanitized.companion.flights[0].ticketUrl, undefined);
  assert.equal(sanitized.companion.hotel.directionsUrl, undefined);
  assert.equal(sanitized.companion.itinerary[0].items[0].directionsUrl, "https://maps.google.com/valid");
  assert.deepEqual(sanitized.companion.arrivalGuide.officialLinks, []);
  assert.equal(sanitized.companion.hotel.bookingReference, "DEMO-HOTEL-4821");
});

test("older trip records without Milestone B fields remain valid", () => {
  const legacy = structuredClone(demoHongKongTrip);
  delete legacy.companion.arrivalGuide;
  delete legacy.companion.hotel.reservationStatus;
  delete legacy.companion.hotel.bookingReference;
  delete legacy.companion.hotel.room;
  delete legacy.companion.expenses[0].currency;
  delete legacy.companion.expenses[0].perPersonAmount;
  delete legacy.companion.expenses[0].phpEquivalent;
  delete legacy.companion.expenses[0].exchangeRate;
  const sanitized = sanitizeClientTrip({ ...legacy, token: undefined });
  assert.equal(sanitized.companion.arrivalGuide, undefined);
  assert.equal(sanitized.companion.hotel.bookingReference, undefined);
  assert.equal(expensePerPersonAmount(sanitized.companion.expenses[0], legacy.travelerCount), 50);
  assert.equal(expensePhpEquivalent(sanitized.companion.expenses[0]), null);
});
