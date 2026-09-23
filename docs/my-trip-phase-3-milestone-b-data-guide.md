# AeroGo My Trip — Travel Essentials data guide

Milestone B keeps travel essentials inside the existing trip JSON. All additions are optional, so older trip records continue to render with useful fallback messages. No database migration is required.

## Flights

Add these optional fields to each `companion.flights` item when AeroGo has them:

```json
{
  "airline": "Example Air",
  "flightNumber": "EA 102",
  "bookingReference": "ABC123",
  "bookingUrl": "https://example.com/private-booking"
}
```

Keep `reservationStatus` accurate. Use `confirmed` only after the airline or booking provider confirms the reservation. A missing booking reference is shown as “Not provided yet.”

## Hotel

The existing hotel object accepts optional `reservationStatus`, `bookingReference`, `room`, `phone`, `bookingUrl`, and `directionsUrl` fields. The Wallet shows only fields that are present. A missing phone or booking reference is shown explicitly.

## Transfers and activities

Add optional details to the existing itinerary item instead of maintaining a second copy:

```json
{
  "meetingPoint": "Arrival Hall, Door B",
  "providerName": "Example Transfers",
  "providerContact": "Message the driver through AeroGo",
  "providerPhone": "+852 5555 0123",
  "dropOffLocation": "Example Hotel",
  "bookingReference": "TRF123",
  "bookingUrl": "https://example.com/booking",
  "instructions": "Show the booking reference at pickup.",
  "entryTime": "10:00 AM"
}
```

Use `meetingPoint` only when it is confirmed. Otherwise the interface says “Meeting point not provided yet.” Use `ticketUrl` only for an authorized ticket or voucher destination. The application does not host ticket files in this milestone.

## Arrival Guide

Use `companion.arrivalGuide` for configured airport instructions and official links:

```json
{
  "airportName": "Example International Airport",
  "steps": ["Follow arrival signs.", "Collect baggage if applicable."],
  "hotelCheckIn": "From 3:00 PM",
  "officialLinks": [
    {
      "label": "Official airport arrival information",
      "url": "https://example.com/arrival",
      "lastCheckedAt": "20 September 2026"
    }
  ]
}
```

Only use official links that AeroGo has checked. The last-checked date is displayed to the traveler. Generic procedures are not shown unless AeroGo configures them.

## Expenses

`amount` remains the legacy group estimate. Optional `currency`, `perPersonAmount`, `phpEquivalent`, and `exchangeRate` fields add clarity without changing existing records:

```json
{
  "label": "Airport transfer",
  "amount": 200,
  "currency": "HKD",
  "perPersonAmount": 50,
  "phpEquivalent": 1500,
  "exchangeRate": {
    "phpPerUnit": 7.5,
    "source": "AeroGo configured estimate",
    "checkedAt": "20 September 2026"
  },
  "note": "Estimated total for 4 people."
}
```

Do not enter a PHP equivalent unless the rate is configured or the value is otherwise verified. If any local-currency item lacks a PHP conversion, the Wallet keeps the local total and says that the PHP total is not available.

All booking, ticket, map, official-information, and booking URLs are checked at the server boundary and again before rendering. Unsafe schemes such as `javascript:` and `data:` are removed.

