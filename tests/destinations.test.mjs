import test from "node:test";
import assert from "node:assert/strict";
import { destinations, featuredDestinations, findDestination } from "../src/data/destinations.ts";

const featuredSlugs = ["japan", "thailand", "south-korea", "hong-kong", "bali", "singapore", "vietnam", "malaysia"];

test("featured destinations follow the Asia-first order", () => {
  assert.deepEqual(featuredDestinations.map((destination) => destination.slug), featuredSlugs);
  assert.equal(featuredDestinations.length, 8);
});

test("every featured destination has a working inspiration record", () => {
  for (const destination of featuredDestinations) {
    assert.ok(destination.name);
    assert.ok(destination.cardImage);
    assert.ok(destination.heroImage);
    assert.equal(findDestination(destination.slug)?.slug, destination.slug);
  }
});

test("previous non-Asian destination records remain available", () => {
  for (const slug of ["greece", "switzerland", "australia"]) {
    assert.ok(findDestination(slug));
  }
  assert.ok(destinations.length >= 11);
});
