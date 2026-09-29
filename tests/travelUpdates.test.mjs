import test from "node:test";
import assert from "node:assert/strict";
import {
  getActiveTravelUpdates,
  getFeaturedTravelUpdate,
  getTravelUpdateBySlug,
  travelUpdates,
} from "../src/data/travelUpdates.ts";

const validCategories = new Set([
  "events-experiences",
  "food-experiences",
  "flights-airports",
  "travel-requirements",
  "deals-savings",
  "destination-tips",
]);

const beforeAllExpiry = new Date("2026-09-24T12:00:00+08:00");

test("travel update slugs are unique and records have the required fields", () => {
  const slugs = travelUpdates.map((update) => update.slug);
  assert.equal(new Set(slugs).size, slugs.length);

  for (const update of travelUpdates) {
    assert.ok(update.id);
    assert.ok(update.slug);
    assert.ok(update.headline);
    assert.ok(update.summary);
    assert.ok(update.destination);
    assert.ok(update.country);
    assert.ok(validCategories.has(update.category));
    assert.match(update.publishedAt, /^\d{4}-\d{2}-\d{2}/);
    assert.ok(update.image.src);
    assert.ok(update.image.alt);
    assert.ok(update.body.length > 0);
    assert.ok(update.sources.length > 0);
    assert.ok(update.sources.every((source) => source.url.startsWith("https://")));
  }
});

test("active stories remain in current listings and the featured story is active", () => {
  const active = getActiveTravelUpdates(beforeAllExpiry);
  assert.equal(active.length, 22);
  assert.equal(getFeaturedTravelUpdate(beforeAllExpiry)?.slug, "thailand-visa-free-stay-30-days-filipino-passports-2026");
  assert.deepEqual(active.slice(0, 3).map((update) => update.slug), [
    "bangkok-airport-travel-update-september-2026",
    "bangkok-royal-barge-rehearsal-october-2-2026",
    "central-highlands-gong-culture-festival-vietnam-2026",
  ]);
  const featured = getFeaturedTravelUpdate(beforeAllExpiry);
  assert.ok(featured);
  assert.deepEqual([featured.slug, ...active.filter((update) => update.id !== featured.id).slice(0, 2).map((update) => update.slug)], [
    "thailand-visa-free-stay-30-days-filipino-passports-2026",
    "bangkok-airport-travel-update-september-2026",
    "bangkok-royal-barge-rehearsal-october-2-2026",
  ]);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.featured, false);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.expiresAt, undefined);
  assert.ok(active.some((update) => update.slug === "singapore-grand-prix-season-experiences-2026"));
  assert.ok(active.some((update) => update.slug === "bangkok-airport-travel-update-september-2026"));
  assert.ok(active.some((update) => update.slug === "bangkok-royal-barge-rehearsal-october-2-2026"));
  assert.ok(active.some((update) => update.slug === "central-highlands-gong-culture-festival-vietnam-2026"));
  assert.ok(active.some((update) => update.slug === "lapay-bantigue-dance-festival-masbate-2026"));
  assert.ok(active.some((update) => update.slug === "pal-manila-delhi-mumbai-flights-2026"));
  assert.ok(active.some((update) => update.slug === "hong-kong-mid-autumn-k-festival-2026"));
  assert.ok(active.some((update) => update.slug === "korea-chuseok-2026-travel-guide"));
  assert.ok(active.some((update) => update.slug === "seoul-chuseok-free-attractions-holiday-schedule-2026"));
  assert.ok(active.some((update) => update.slug === "macao-international-fireworks-september-25-2026"));
  assert.ok(active.some((update) => update.slug === "kuala-lumpur-autumn-music-cultural-festival-2026"));
  assert.ok(active.some((update) => update.slug === "sandeq-silumba-west-sulawesi-2026"));
  assert.ok(active.some((update) => update.slug === "tourism-expo-japan-public-days-tokyo-2026"));
  assert.ok(active.some((update) => update.slug === "wonderful-indonesia-gastronomy-2026"));
});

test("September 29 updates use the official facts and Manila expiry boundaries", () => {
  const bangkok = getTravelUpdateBySlug("bangkok-airport-travel-update-september-2026");
  assert.ok(bangkok);
  assert.equal(bangkok.headline, "Bangkok airports remain open as some journeys take longer");
  assert.equal(bangkok.publishedAt, "2026-09-29");
  assert.equal(bangkok.category, "destination-tips");
  assert.equal(bangkok.expiresAt, "2026-09-30T00:00:00+08:00");
  const bangkokCopy = [bangkok.summary, ...bangkok.body.map((block) => block.text ?? block.items?.join(" ") ?? "")].join(" ");
  assert.match(bangkokCopy, /remain open and operational/);
  assert.match(bangkokCopy, /Airport Rail Link, SRT Red Line, BTS Skytrain and MRT are operating/);
  assert.match(bangkokCopy, /Some Eastern Line sections remain affected/);
  assert.match(bangkokCopy, /does not give a specific number of extra minutes or hours/);
  assert.doesNotMatch(bangkokCopy, /Lat Krabang|Motorway No\. 7|Burapha Withi|three hours|2–3 hours|locali[sz]ed flooding/i);
  assert.ok(bangkok.sources.some((source) => source.url === "https://www.tatnews.org/2026/09/weather-and-travel-conditions-in-bangkok-and-surrounding-areas-visitor-information/"));

  const barge = getTravelUpdateBySlug("bangkok-royal-barge-rehearsal-october-2-2026");
  assert.ok(barge);
  assert.equal(barge.headline, "Travelers can watch Thailand’s Royal Barges rehearse this Friday");
  assert.equal(barge.eventStartAt, "2026-10-02");
  assert.equal(barge.eventEndAt, "2026-10-02");
  assert.equal(barge.expiresAt, "2026-10-03T00:00:00+08:00");
  const bargeCopy = barge.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(bargeCopy, /This is a rehearsal, not the actual procession/);
  assert.match(bargeCopy, /approximately 14:30/);
  assert.match(bargeCopy, /between Krung Thon Bridge and Wat Arun/);
  assert.match(bargeCopy, /does not list ticket requirements, reserved viewing areas or exact road and riverfront closures/);
  assert.match(bargeCopy, /52 royal barges carrying 2,200 Royal Thai Navy personnel/);

  const gong = getTravelUpdateBySlug("central-highlands-gong-culture-festival-vietnam-2026");
  assert.ok(gong);
  assert.equal(gong.eventStartAt, "2026-10-01");
  assert.equal(gong.eventEndAt, "2026-10-31");
  assert.equal(gong.expiresAt, "2026-11-01T00:00:00+08:00");
  assert.ok(gong.sources.some((source) => source.url === "https://ich.unesco.org/en/RL/space-of-gong-culture-00120"));
  const gongCopy = gong.body.map((block) => block.text ?? block.items?.join(" ") ?? "").join(" ");
  assert.match(gongCopy, /1–31 October/);
  assert.match(gongCopy, /does not say which activities visitors can attend/);
  assert.match(gongCopy, /provide daily schedules/);

  for (const update of [bangkok, barge, gong]) {
    const justBeforeExpiry = new Date(new Date(update.expiresAt).getTime() - 1);
    assert.ok(getActiveTravelUpdates(justBeforeExpiry).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(update.expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }
});

test("September 28 events expire after their covered dates while PAL remains current", () => {
  const grandPrix = getTravelUpdateBySlug("singapore-grand-prix-season-experiences-2026");
  assert.ok(grandPrix);
  assert.equal(grandPrix.eventEndAt, "2026-10-14");
  assert.equal(grandPrix.expiresAt, "2026-10-15T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-14T23:59:59+08:00")).some((update) => update.id === grandPrix.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-15T00:00:00+08:00")).some((update) => update.id === grandPrix.id), false);

  const lapay = getTravelUpdateBySlug("lapay-bantigue-dance-festival-masbate-2026");
  assert.ok(lapay);
  assert.equal(lapay.eventEndAt, "2026-09-28");
  assert.equal(lapay.expiresAt, "2026-09-29T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-09-28T23:59:59+08:00")).some((update) => update.id === lapay.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-09-29T00:00:00+08:00")).some((update) => update.id === lapay.id), false);

  const pal = getTravelUpdateBySlug("pal-manila-delhi-mumbai-flights-2026");
  assert.ok(pal);
  assert.equal(pal.category, "flights-airports");
  assert.equal(pal.expiresAt, undefined);
  assert.equal(pal.eventEndAt, undefined);
  assert.ok(getActiveTravelUpdates(new Date("2027-01-01T00:00:00+08:00")).some((update) => update.id === pal.id));
});

test("September 27 event stories follow their verified expiry boundaries", () => {
  const cases = [
    { slug: "salo-karajae-festival-parepare-2026", eventEndAt: "2026-10-01", expiresAt: "2026-10-02T00:00:00+08:00" },
    { slug: "fukuro-matsuri-ikebukuro-tokyo-2026", eventEndAt: "2026-09-27", expiresAt: "2026-09-28T00:00:00+08:00" },
    { slug: "free-royal-court-parade-hyundai-seoul-2026", eventEndAt: "2026-10-04", expiresAt: "2026-10-05T00:00:00+08:00" },
  ];

  for (const { slug, eventEndAt, expiresAt } of cases) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.eventEndAt, eventEndAt);
    assert.equal(update.expiresAt, expiresAt);
    assert.ok(getActiveTravelUpdates(new Date(new Date(expiresAt).getTime() - 1)).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date(expiresAt)).some((activeUpdate) => activeUpdate.id === update.id), false);
  }
});

test("expired stories are excluded while remaining retrievable by slug", () => {
  const afterHongKongExpiry = new Date("2026-09-29T12:00:00+08:00");
  const active = getActiveTravelUpdates(afterHongKongExpiry);

  assert.equal(active.some((update) => update.slug === "hong-kong-mid-autumn-k-festival-2026"), false);
  assert.ok(getTravelUpdateBySlug("hong-kong-mid-autumn-k-festival-2026"));
});

test("featured selection ignores expired featured stories", () => {
  const afterAllExpiry = new Date("2026-10-06T12:00:00+08:00");
  assert.deepEqual(getActiveTravelUpdates(afterAllExpiry).map((update) => update.slug), [
    "central-highlands-gong-culture-festival-vietnam-2026",
    "singapore-grand-prix-season-experiences-2026",
    "pal-manila-delhi-mumbai-flights-2026",
    "thailand-visa-free-stay-30-days-filipino-passports-2026",
    "japan-chiba-rail-disruptions-typhoon-25-2026",
  ]);
  assert.equal(getFeaturedTravelUpdate(afterAllExpiry)?.slug, "thailand-visa-free-stay-30-days-filipino-passports-2026");
  assert.equal(getTravelUpdateBySlug("singapore-lights-by-the-lake-2026")?.featured, false);
});

test("event end date and listing expiry can be different", () => {
  const singapore = getTravelUpdateBySlug("singapore-lights-by-the-lake-2026");
  assert.ok(singapore);
  assert.equal(singapore.eventEndAt, "2026-10-04");
  assert.equal(singapore.expiresAt, "2026-10-05T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-04T20:00:00+08:00")).some((update) => update.id === singapore.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-05T00:00:00+08:00")).some((update) => update.id === singapore.id), false);

  for (const slug of ["sandeq-silumba-west-sulawesi-2026", "tourism-expo-japan-public-days-tokyo-2026"]) {
    const update = getTravelUpdateBySlug(slug);
    assert.ok(update);
    assert.equal(update.eventEndAt, "2026-09-27");
    assert.equal(update.expiresAt, "2026-09-28T00:00:00+08:00");
    assert.ok(getActiveTravelUpdates(new Date("2026-09-27T23:59:59+08:00")).some((activeUpdate) => activeUpdate.id === update.id));
    assert.equal(getActiveTravelUpdates(new Date("2026-09-28T00:00:00+08:00")).some((activeUpdate) => activeUpdate.id === update.id), false);
  }

  const gastronomy = getTravelUpdateBySlug("wonderful-indonesia-gastronomy-2026");
  assert.ok(gastronomy);
  assert.equal(gastronomy.eventEndAt, "2026-10-04");
  assert.equal(gastronomy.expiresAt, "2026-10-05T00:00:00+08:00");
  assert.ok(getActiveTravelUpdates(new Date("2026-10-04T23:59:59+08:00")).some((update) => update.id === gastronomy.id));
  assert.equal(getActiveTravelUpdates(new Date("2026-10-05T00:00:00+08:00")).some((update) => update.id === gastronomy.id), false);
});
