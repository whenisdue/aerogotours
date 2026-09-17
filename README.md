# AeroGo Travel & Tours

A responsive React, TypeScript, and Vite prototype for aerogotours.com. It includes a public travel-planning website and a fictional, mobile-first trip companion.

## Run locally

```sh
npm install
npm run dev
```

The public site is available at `/` and the sample Travel Companion is at `/companion`.

## Current scope

- The public inquiry form posts to `/api/inquiry`, which sends a notification through Resend when the server environment is configured. It does not persist inquiries in a database or send an automatic visitor email.
- The Santos family Tokyo itinerary, booking references, hotel, transfers, and activities are fictional sample content.
- Checklists and messages work in local React state and reset when the page reloads.
- There is no authentication, payment processing, live travel data, or AI integration.
- The trip information is organized in `src/data/trip.ts` so a future data service can replace the sample data.

## Dream Trip content references

The Thailand Dream Trip is curated inspiration, not a live booking product. Named places and regional route ideas were checked against these reference sources:

- [Tourism Authority of Thailand: Bangkok](https://www.tourismthailand.org/Destinations/Provinces/bangkok/219) — Bangkok's Grand Palace/Wat Phra Kaew, Wat Pho, Wat Arun, Yaowarat and market areas.
- [Tourism Authority of Thailand: Chiang Mai](https://www.tourismthailand.org/Destinations/North/Chiang-Mai) — Chiang Mai's Old City, Tha Phae Walking Street, Wat Phra That Doi Suthep, Nimman and nearby nature references.
- [Tourism Authority of Thailand: Phuket one-day route](https://www.tourismthailand.org/Trip-Planner/Suggestion-Detail/recommended-route-for-one-day-3) — Phuket Old Town, Wat Chalong, viewpoints and coastal route ideas.
- [UNESCO: Historic City of Ayutthaya](https://whc.unesco.org/en/list/576) — Ayutthaya's historical-city context and heritage-site naming.

The interface intentionally omits live opening hours, journey times, prices, availability, visa guidance and reservations. AeroGo should verify current logistics and quotations before turning an illustrative route into a real trip.

The South Korea Dream Trip was checked on 2026-09-17 against the [Official Travel Guide to Seoul](https://english.visitseoul.net/AboutSeoul), its pages for [Gyeongbokgung Palace](https://english.visitseoul.net/PalaceArea/GyeongbokgungPalace/ENN000608) and [Bukchon Hanok Village](https://english.visitseoul.net/attractions/bukchon-hanok-village/ENP000261), [Visit Busan's Gamcheon Culture Village guide](https://www.visitbusan.net/index.do?lang_cd=en+&menuCd=DOM_000000301001001000&uc_seq=365), [VISITKOREA's Gyeongju course](https://english.visitkorea.or.kr/svc/whereToGo/hdrdslt/hdrdsltView.do?crsSn=534028) and [Bulguksa Temple guide](https://english.visitkorea.or.kr/svc/contents/contentsView.do?vcontsId=94395), and the [Korea Transportation Guide](https://english.visitkorea.or.kr/public/contents/travel/KoreaTransportationGuide_enu.pdf). These support the named Seoul, Busan and Gyeongju places and the use of intercity rail as a planning concept; the app intentionally does not claim current schedules, fares, opening hours or availability.

## Inquiry email setup

The Vercel Function at `api/inquiry.ts` expects these server-side variables:

```sh
RESEND_API_KEY=
INQUIRY_TO_EMAIL=aerogo.inquiry@gmail.com
INQUIRY_FROM_EMAIL=AeroGo Travel & Tours <inquiries@aerogotours.com>
```

1. Create a Resend account at [resend.com](https://resend.com/).
2. In Resend, add `aerogotours.com` as a sending domain and copy the exact DNS records shown in its dashboard into the DNS provider for the domain. Do not invent or replace existing Vercel records; add only the records Resend requests.
3. Wait for Resend to verify the domain, then create an API key with permission to send email.
4. Add the three variables to the existing AeroGo Vercel project. Set them for **Production** (and **Preview** if preview inquiries should work), then redeploy from the connected Git branch.
5. Submit a real inquiry on the deployed site and confirm it arrives at `aerogo.inquiry@gmail.com`. The notification's Reply-To is the visitor's validated email.

The initial workflow is email-based: inquiries are not stored separately and delivery is not guaranteed. The endpoint includes strict validation and a honeypot, but reliable rate limiting and stronger bot protection should be added later with an external service if spam becomes an issue.

For local API testing, use Vercel's local runtime after setting the variables in a local, ignored `.env` file:

```sh
vercel dev
```

The regular Vite server does not execute `api/inquiry.ts`.

## Production build

```sh
npm run build
npm run preview
```

`vercel.json` rewrites client-side routes to the Vite app entry point for Vercel hosting.
