import { strict as assert } from 'node:assert';
import test from 'node:test';
import { DEFAULT_PREFERENCES } from '../src/catalog.ts';
import { decodeShare, encodeShare, makeItinerary, sanitizePreferences, toSafeInt, validChecks } from '../src/planner.ts';

test('default plan starts with arrival, ends with departure, and has four days', () => {
  const days = makeItinerary(DEFAULT_PREFERENCES);
  assert.equal(days.length, 4);
  assert.equal(days[0].key, 'arrival');
  assert.equal(days[3].key, 'departure');
});

test('supported lengths always match requests', () => {
  for (const length of [3, 4, 5] as const) {
    const days = makeItinerary({ ...DEFAULT_PREFERENCES, days: length });
    assert.equal(days.length, length);
    assert.equal(new Set(days.map(item => item.key)).size, length);
  }
});

test('changing interests changes activities', () => {
  const days = makeItinerary({ ...DEFAULT_PREFERENCES, days: 3, interests: ['food', 'culture'] });
  assert.equal(days[1].key, 'heritage');
});

test('share round-trip and tampered preferences are sanitized', () => {
  assert.deepEqual(decodeShare(encodeShare(DEFAULT_PREFERENCES)), DEFAULT_PREFERENCES);
  assert.equal(decodeShare('not$a$key'), null);
  assert.deepEqual(sanitizePreferences({ days: 42, interests: ['food', 'bogus'], group: 'not-a-group', pace: 'relaxed' }).interests, ['food']);
  assert.equal(sanitizePreferences({ days: 42 }).days, 4);
});

test('checklist keys and counters reject invalid data', () => {
  assert.deepEqual(validChecks(['passport', 'fake', 'passport', null]), ['passport']);
  assert.equal(toSafeInt(Number.NaN), 0);
  assert.equal(toSafeInt(Number.POSITIVE_INFINITY), 0);
  assert.equal(toSafeInt(-15), 0);
  assert.equal(toSafeInt(2300, 0, 12), 12);
});
