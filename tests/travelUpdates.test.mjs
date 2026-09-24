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
  assert.equal(active.length, 9);
  assert.equal(getFeaturedTravelUpdate(beforeAllExpiry)?.slug, "thailand-visa-free-stay-30-days-filipino-passports-2026");
  assert.deepEqual(active.slice(0, 3).map((update) => update.slug), [
    "macao-international-fireworks-september-25-2026",
    "kuala-lumpur-autumn-music-cultural-festival-2026",
    "thailand-visa-free-stay-30-days-filipino-passports-2026",
  ]);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.featured, false);
  assert.equal(getTravelUpdateBySlug("japan-chiba-rail-disruptions-typhoon-25-2026")?.expiresAt, undefined);
  assert.ok(active.some((update) => update.slug === "hong-kong-mid-autumn-k-festival-2026"));
  assert.ok(active.some((update) => update.slug === "macao-international-fireworks-september-25-2026"));
  assert.ok(active.some((update) => update.slug === "kuala-lumpur-autumn-music-cultural-festival-2026"));
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
});
