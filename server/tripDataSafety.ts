import type { ClientTripRecord } from "./tripStore.ts";
import type { ProposalTripRecord } from "../src/data/myTripTypes.ts";

function safeExternalUrl(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function safeContactHref(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) return "/#inquire";
  const trimmed = value.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  return safeExternalUrl(trimmed) ?? "/#inquire";
}

export function sanitizeClientTrip(data: ClientTripRecord): ClientTripRecord {
  const companion = data.companion;
  return {
    ...data,
    contact: { ...data.contact, href: safeContactHref(data.contact.href) },
    companion: {
      ...companion,
      flights: companion.flights.map((flight) => ({
        ...flight,
        bookingUrl: safeExternalUrl(flight.bookingUrl),
        checkInUrl: safeExternalUrl(flight.checkInUrl),
        airlineStatusUrl: safeExternalUrl(flight.airlineStatusUrl),
        directionsUrl: safeExternalUrl(flight.directionsUrl),
        ticketUrl: safeExternalUrl(flight.ticketUrl),
      })),
      hotel: {
        ...companion.hotel,
        bookingUrl: safeExternalUrl(companion.hotel.bookingUrl),
        directionsUrl: safeExternalUrl(companion.hotel.directionsUrl),
      },
      itinerary: companion.itinerary.map((day) => ({
        ...day,
        items: day.items.map((item) => ({
          ...item,
          bookingUrl: safeExternalUrl(item.bookingUrl),
          directionsUrl: safeExternalUrl(item.directionsUrl),
          ticketUrl: safeExternalUrl(item.ticketUrl),
        })),
      })),
      attractions: companion.attractions.map((attraction) => ({ ...attraction, mapUrl: safeExternalUrl(attraction.mapUrl) })),
      arrivalGuide: companion.arrivalGuide ? {
        ...companion.arrivalGuide,
        officialLinks: companion.arrivalGuide.officialLinks?.map((link) => ({ ...link, url: safeExternalUrl(link.url) ?? "" })).filter((link) => link.url),
      } : undefined,
    },
  };
}

export function toProposalTrip(data: ClientTripRecord): ProposalTripRecord {
  const safe = sanitizeClientTrip(data);
  if (safe.currentStage !== "proposal") throw new Error("Only proposal-stage trips can be projected publicly.");

  return {
    currentStage: "proposal",
    travelerName: safe.travelerName,
    destination: safe.destination,
    destinationShort: safe.destinationShort,
    dates: safe.dates,
    duration: safe.duration,
    travelerCount: safe.travelerCount,
    quote: {
      status: safe.quote.status,
      validity: safe.quote.validity,
      revision: safe.quote.revision,
      revisions: safe.quote.revisions.map((revision) => ({ ...revision })),
      options: safe.quote.options.map((option) => ({ ...option, includes: [...option.includes], excludes: [...option.excludes] })),
    },
    proposal: safe.proposal ? {
      kind: safe.proposal.kind,
      statusLabel: safe.proposal.statusLabel,
      summary: safe.proposal.summary,
      pricingNote: safe.proposal.pricingNote,
    } : undefined,
    companion: {
      itinerary: safe.companion.itinerary.map((day) => ({
        day: day.day,
        date: day.date,
        title: day.title,
        summary: day.summary,
        items: day.items.map((item) => ({
          time: item.time,
          title: item.title,
          location: item.location,
          note: item.note,
          kind: item.kind,
        })),
      })),
    },
    contact: { ...safe.contact },
  };
}
