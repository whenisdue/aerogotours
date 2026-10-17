# AeroGo Trip Planner · Singapore V1 (local prototype)

This is a **fully client-side** React + TypeScript, Vite-compatible prototype. No databases, paid maps, generative-AI calls, payments, tracking or external backends. Intended to be merged into the existing AeroGo codebase by Codex **after inspecting the actual repository**. Do NOT deploy from this starter kit.

## Local preview

```bash
npm install
npm run dev
```

Run automated pure planner tests with `npm test`; run `npm run build` for TypeScript validation and production bundling. This kit does not contain your current AeroGo homepage, existing navigation, or existing photo assets.

## Included
- Singapore-only curated 3, 4, or 5-day planner; group, relaxed/balanced, walking preference, and attraction-interest questions.
- Itineraries assembled deterministically from a vetted static catalog. Arrival and departure days contain explicit flexibility warnings.
- Paid and free attraction distinctions, official attraction/immigration links, transport tips, accessible prompts.
- Local-only checklist (localStorage); shareable plan-preferences URL (does not share checklist or personal details); browser print/save as PDF.
- Statically constrained input; no personal information collected.
- Mobile-first AeroGo colors and large targets. Source review date displayed.

## Integration notes for Codex

1. Inspect the **actual** AeroGo repo first, its router, design system, metadata, tests, analytics, nav, and performance budgets. Do not replace existing site or add a separate public microsite.
2. Reuse only the `src/TripPlanner.tsx`, `src/planner.css`, `src/catalog.ts`, and `src/planner.ts` feature code as needed; import the component into the existing app route `/trip-planner` using the current routing system.
3. Make `planner.css` scoped to the feature and check global CSS collision. Adapt standalone header/footer to AeroGo's shared header/footer and link it unobtrusively from existing menu or footer.
4. Reuse optimized AeroGo travel images only if already in repository and properly licensed; do not add giant remote image files. The local kit uses a CSS illustration as a dependency-free fallback.
5. If current navigation already uses the label “Plan my trip” for travel inquiries, keep that CTA unchanged; introduce the free tool under a distinct, explicit “Free Trip Planner” label.
6. Review destination copy and source links before publish. Do not make legal, visa, exact fares, station routes or accessibility guarantees. The tool MUST NOT claim itinerary is a booked reservation.
7. Do not add AI APIs, paid maps, third-party tracking, credentials, servers, or a database. Do not deploy, git commit, open PR, or modify production in this task without further explicit approval.
8. Run the repo's existing test suite, lint and build and manually check 320, 390, 768, 1024 and 1280px screen widths. Verify public routes and no overflow, no regression.

## Privacy and usability
- No user account or form submission. Preferences, checklist progress stored ONLY in the browser in `localStorage` (`aerogo-trip-planner-v1`).
- Share links contain planner choices, not checklist progress or passport/booking details.
- Printing uses built-in browser print-to-PDF and incurs no server cost.
- `localStorage` can be deleted by the user or the browser; it is not cloud sync.
- All times are indicative and must be checked against trip dates, actual hotel and flights.

## Official sources (reviewed 15 October 2026)
- Singapore ICA: https://www.ica.gov.sg/enter-transit-depart/entering-singapore
- SG Arrival Card: https://eservices.ica.gov.sg/sgarrivalcard/
- Gardens by the Bay: https://www.gardensbythebay.com.sg/en.html
- SimplyGo contactless cards: https://www.simplygo.com.sg/faqs/cards-and-charms/simplygo/contactless-bank-cards/
- Jewel Rain Vortex: https://www.jewelchangiairport.com/en/attractions/rain-vortex.html

## Scope limitations
- Singapore only; 3–5 days only; no exact bookings, live hours, currency conversion, maps routing, or hotel recommendations.
- Rules-based itinerary is not AI or a personalized accessibility assessment.
- No code has been modified in the original AeroGo repository and nothing was deployed.
