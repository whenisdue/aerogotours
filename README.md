# AeroGo Travel & Tours

A responsive React, TypeScript, and Vite prototype for aerogotours.com. It includes a public travel-planning website and a fictional, mobile-first trip companion.

## Run locally

```sh
npm install
npm run dev
```

The public site is available at `/` and the sample Travel Companion is at `/companion`.

## Prototype scope

- The inquiry form is a visual prototype. Submitting it shows an on-screen confirmation; it does not send or store form data.
- The Santos family Tokyo itinerary, booking references, hotel, transfers, and activities are fictional sample content.
- Checklists and messages work in local React state and reset when the page reloads.
- There is no backend, authentication, payment processing, live travel data, or AI integration.
- The trip information is organized in `src/data/trip.ts` so a future data service can replace the sample data.

## Production build

```sh
npm run build
npm run preview
```

`vercel.json` rewrites client-side routes to the Vite app entry point for Vercel hosting.
