import test from "node:test";
import assert from "node:assert/strict";
import { DEFAULT_PREFERENCES, PREP_ITEMS } from "../src/features/tripPlanner/catalog.ts";
import {
  decodeShare,
  encodeShare,
  loadPlannerState,
  makeItinerary,
  sanitizePreferences,
  validChecks,
} from "../src/features/tripPlanner/planner.ts";

const choices = (changes = {}) => ({ ...DEFAULT_PREFERENCES, interests: [...DEFAULT_PREFERENCES.interests], ...changes });

test("planner makes a deterministic three, four or five day itinerary", () => {
  for (const days of [3, 4, 5]) {
    const preferences = choices({ days });
    const itinerary = makeItinerary(preferences);
    assert.equal(itinerary.length, days);
    assert.equal(itinerary[0].key, "arrival");
    assert.equal(itinerary.at(-1).key, "departure");
    assert.equal(new Set(itinerary.map(day => day.key)).size, days);
    assert.deepEqual(makeItinerary(preferences), itinerary);
  }
});

test("interests, pace, walking comfort and group affect the plan", () => {
  const culture = makeItinerary(choices({ days: 3, interests: ["culture", "food"] }));
  assert.equal(culture[1].key, "heritage");
  const relaxed = makeItinerary(choices({ pace: "relaxed", mobility: "some" }));
  const balanced = makeItinerary(choices({ pace: "balanced", mobility: "some" }));
  assert.ok(balanced[0].visits.length > relaxed[0].visits.length);
  const minimal = makeItinerary(choices({ pace: "balanced", mobility: "minimal" }));
  assert.ok(minimal[1].visits.length < balanced[1].visits.length);
  assert.ok(minimal[1].visits.every(visit => visit.title !== "Cloud Forest"));
  const family = makeItinerary(choices({ group: "family" }));
  assert.notEqual(family[1].tip, relaxed[1].tip);
});

test("share links contain only validated planner choices", () => {
  const shared = decodeShare(encodeShare(choices({ days: 5, group: "friends", interests: ["food"] })));
  assert.deepEqual(shared, choices({ days: 5, group: "friends", interests: ["food"] }));
  assert.equal(decodeShare("not-a-plan"), null);
  assert.equal(decodeShare(btoa(JSON.stringify({ destination: "elsewhere" }))), null);
  assert.deepEqual(sanitizePreferences({ days: 99, group: "unknown", interests: ["food", "fake"] }).interests, ["food"]);
  assert.ok(!encodeShare(choices()).includes("passport"));
});

test("shared preferences retain local checklist state without sharing it", () => {
  const stored = JSON.stringify({ preferences: choices({ days: 3 }), checks: ["passport", "passport", "not-a-check"], hasPlan: true });
  const imported = choices({ days: 5, group: "solo" });
  const loaded = loadPlannerState(stored, imported);
  assert.deepEqual(loaded.preferences, imported);
  assert.deepEqual(loaded.checks, ["passport"]);
  assert.equal(loaded.shared, true);
  assert.equal(loaded.hasPlan, true);
  assert.equal(loadPlannerState("broken", null).checks.length, 0);
  assert.equal(loadPlannerState(stored, null).hasPlan, true);
  assert.equal(validChecks(PREP_ITEMS.map(item => item.id)).length, PREP_ITEMS.length);
});
