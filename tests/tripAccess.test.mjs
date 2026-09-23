import assert from "node:assert/strict";
import { test } from "node:test";

process.env.TRIP_DEV_MEMORY_STORE = "1";
process.env.TRIP_DEMO_PIN = "2468";

const { handleTripApi } = await import("../server/tripApi.ts");
const { createTrip, deleteSessionsForTrip, findTripByTokenHash, getTripDatabaseConfig, getTripStoreMode, updateTrip } = await import("../server/tripStore.ts");
const { hashTripPassword, hashTripToken } = await import("../server/tripSecurity.ts");
const { vietnamProposalTrip } = await import("../src/data/vietnamProposal.ts");

function request(path, body, cookie) {
  return handleTripApi(`/api/trips${path}`, {
    method: "POST",
    headers: { "x-forwarded-for": "198.51.100.22", ...(cookie ? { cookie } : {}) },
    body,
  });
}

function sessionCookie(result) {
  const value = result.headers["Set-Cookie"];
  assert.equal(typeof value, "string");
  return value.split(";", 1)[0];
}

test("private trip access enforces credentials, trip scope, expiry, and revocation", async () => {
  const unauthenticatedDemo = await request("/session", { token: "demo" });
  assert.equal(unauthenticatedDemo.status, 401);
  assert.equal(unauthenticatedDemo.body.trip, undefined);

  const wrong = await request("/access", { token: "demo", password: "not-the-pin" });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.body.trip, undefined);

  const unlocked = await request("/access", { token: "demo", password: "2468" });
  assert.equal(unlocked.status, 200);
  assert.equal(unlocked.body.ok, true);
  assert.equal(unlocked.body.trip.token, undefined);
  const cookie = sessionCookie(unlocked);

  const restored = await request("/session", { token: "demo" }, cookie);
  assert.equal(restored.status, 200);
  assert.equal(restored.body.trip.destinationShort, "Hong Kong");

  const crossTrip = await request("/session", { token: "another-trip-token" }, cookie);
  assert.equal(crossTrip.status, 401);
  assert.equal(crossTrip.body.trip, undefined);

  const demo = await findTripByTokenHash(hashTripToken("demo"));
  assert.ok(demo);
  await updateTrip(demo.id, { revokedAt: new Date().toISOString() });
  const revoked = await request("/session", { token: "demo" }, cookie);
  assert.equal(revoked.status, 410);

  await updateTrip(demo.id, { revokedAt: null, accessExpiresAt: new Date(Date.now() - 60_000).toISOString() });
  const expired = await request("/access", { token: "demo", password: "2468" });
  assert.equal(expired.status, 410);

  await updateTrip(demo.id, { accessExpiresAt: null });
  await deleteSessionsForTrip(demo.id);
});

test("the Vietnam proposal is separately seeded through normal local trip access", async () => {
  const wrong = await request("/access", { token: vietnamProposalTrip.token, password: "not-the-pin" });
  assert.equal(wrong.status, 401);
  assert.equal(wrong.body.trip, undefined);

  const unlocked = await request("/access", { token: vietnamProposalTrip.token, password: process.env.TRIP_DEMO_PIN });
  assert.equal(unlocked.status, 200);
  assert.equal(unlocked.body.trip.token, undefined);
  assert.equal(unlocked.body.trip.destination, "Da Nang and Hoi An, Vietnam");
  assert.equal(unlocked.body.trip.currentStage, "proposal");
  assert.equal(unlocked.body.trip.isDemo, false);
  assert.equal(unlocked.body.trip.quote.options.length, 0);
  assert.equal(unlocked.body.trip.companion.flights.length, 0);
  assert.equal(unlocked.body.trip.companion.expenses.length, 0);
  assert.deepEqual(unlocked.body.trip.proposal.otherInterests.map((interest) => interest.place), ["Da Lat", "Sapa"]);
  assert.deepEqual(unlocked.body.trip.companion.itinerary.map((day) => day.day), [1, 2, 3, 4, 5]);
  assert.equal(JSON.stringify(unlocked.body.trip).includes("₱"), false);

  const seeded = await findTripByTokenHash(hashTripToken(vietnamProposalTrip.token));
  assert.ok(seeded);
  const restored = await request("/session", { token: vietnamProposalTrip.token }, sessionCookie(unlocked));
  assert.equal(restored.status, 200);
  assert.equal(restored.body.trip.currentStage, "proposal");
  await deleteSessionsForTrip(seeded.id);
});

test("proposal links are passwordless and return only the proposal-safe projection", async () => {
  const result = await request("/session", { token: vietnamProposalTrip.token });
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);
  assert.equal(result.body.access, "proposal");
  assert.equal(result.body.sessionExpiresAt, undefined);

  const staleSession = await request("/session", { token: vietnamProposalTrip.token }, "aerogo_trip_session=stale-session");
  assert.equal(staleSession.status, 200);
  assert.equal(staleSession.body.access, "proposal");

  const trip = result.body.trip;
  assert.deepEqual(Object.keys(trip).sort(), ["companion", "contact", "currentStage", "dates", "destination", "destinationShort", "duration", "proposal", "quote", "travelerCount", "travelerName"].sort());
  assert.deepEqual(Object.keys(trip.quote).sort(), ["options", "revision", "revisions", "status", "validity"].sort());
  assert.deepEqual(Object.keys(trip.proposal).sort(), ["kind", "pricingNote", "statusLabel", "summary"].sort());
  assert.deepEqual(Object.keys(trip.contact).sort(), ["href", "label", "note"].sort());
  assert.deepEqual(Object.keys(trip.companion).sort(), ["itinerary"]);

  for (const day of trip.companion.itinerary) {
    assert.deepEqual(Object.keys(day).sort(), ["date", "day", "items", "summary", "title"].sort());
    for (const item of day.items) assert.deepEqual(Object.keys(item).sort(), ["kind", "location", "note", "time", "title"].sort());
  }

  assert.equal(trip.booking, undefined);
  assert.equal(trip.companion.flights, undefined);
  assert.equal(trip.companion.hotel, undefined);
  assert.equal(trip.companion.attractions, undefined);
  assert.equal(trip.companion.expenses, undefined);
  assert.equal(trip.proposal.otherInterests, undefined);

  const serialized = JSON.stringify(result.body);
  for (const privateField of ["acceptedQuoteSnapshot", "paymentStatus", "bookingReference", "providerName", "bookingProgress", "requirements", "expenses", "pinHash", "credentialVersion", "sessionHash"]) {
    assert.equal(serialized.includes(`"${privateField}"`), false, `public proposal must omit ${privateField}`);
  }
});

test("changing a proposal to a protected stage closes passwordless access", async () => {
  const seeded = await findTripByTokenHash(hashTripToken(vietnamProposalTrip.token));
  assert.ok(seeded);
  const originalData = structuredClone(seeded.data);

  try {
    for (const stage of ["booking", "companion", "completed"]) {
      await updateTrip(seeded.id, { data: { ...structuredClone(originalData), currentStage: stage } });
      const unauthenticated = await request("/session", { token: vietnamProposalTrip.token });
      assert.equal(unauthenticated.status, 401);
      assert.equal(unauthenticated.body.trip, undefined);

      const authenticated = await request("/access", { token: vietnamProposalTrip.token, password: process.env.TRIP_DEMO_PIN });
      assert.equal(authenticated.status, 200);
      assert.equal(authenticated.body.trip.currentStage, stage);
      await deleteSessionsForTrip(seeded.id);
    }
  } finally {
    await updateTrip(seeded.id, { data: originalData });
    await deleteSessionsForTrip(seeded.id);
  }
});

test("revoked and expired proposal links fail without credentials", async () => {
  const seeded = await findTripByTokenHash(hashTripToken(vietnamProposalTrip.token));
  assert.ok(seeded);

  try {
    await updateTrip(seeded.id, { revokedAt: new Date().toISOString() });
    const revoked = await request("/session", { token: vietnamProposalTrip.token });
    assert.equal(revoked.status, 410);
    assert.equal(revoked.body.trip, undefined);

    await updateTrip(seeded.id, { revokedAt: null, accessExpiresAt: new Date(Date.now() - 60_000).toISOString() });
    const expired = await request("/session", { token: vietnamProposalTrip.token });
    assert.equal(expired.status, 410);
    assert.equal(expired.body.trip, undefined);
  } finally {
    await updateTrip(seeded.id, { revokedAt: null, accessExpiresAt: null });
  }
});

test("the fictional demo PIN is scoped to the demo token", async () => {
  const demo = await findTripByTokenHash(hashTripToken("demo"));
  assert.ok(demo);

  const realTripId = "real-customer-auth-isolation-test";
  const realToken = "real-customer-auth-isolation-token";
  await createTrip({
    id: realTripId,
    tokenHash: hashTripToken(realToken),
    pinHash: await hashTripPassword("1357"),
    data: { ...structuredClone(demo.data), isDemo: false },
    status: "active",
    accessExpiresAt: null,
    revokedAt: null,
    credentialVersion: 1,
  });

  try {
    const demoAccess = await request("/access", { token: "demo", password: "2468" });
    assert.equal(demoAccess.status, 200);

    const realTripWithDemoPin = await request("/access", { token: realToken, password: "2468" });
    assert.equal(realTripWithDemoPin.status, 401);
    assert.equal(realTripWithDemoPin.body.trip, undefined);

    const realTripWithItsOwnPin = await request("/access", { token: realToken, password: "1357" });
    assert.equal(realTripWithItsOwnPin.status, 200);
  } finally {
    await deleteSessionsForTrip(realTripId);
    await updateTrip(realTripId, { revokedAt: new Date().toISOString() });
  }
});

test("accepted quotation snapshot is independent from proposal edits", async () => {
  const demo = await findTripByTokenHash(hashTripToken("demo"));
  assert.ok(demo);
  const originalSnapshot = structuredClone(demo.data.booking.acceptedQuoteSnapshot);
  const editedData = structuredClone(demo.data);
  editedData.quote.options[0].amount += 1000;
  await updateTrip(demo.id, { data: editedData });
  const refreshed = await findTripByTokenHash(hashTripToken("demo"));
  assert.deepEqual(refreshed?.data.booking.acceptedQuoteSnapshot, originalSnapshot);
  await updateTrip(demo.id, { data: { ...editedData, quote: demo.data.quote } });
});

test("unsupported methods and unknown tokens reveal no private record", async () => {
  const method = await handleTripApi("/api/trips/access", { method: "GET", headers: {} });
  assert.equal(method.status, 405);
  const unknownProposal = await request("/session", { token: "does-not-exist" });
  assert.equal(unknownProposal.status, 401);
  assert.equal(unknownProposal.body.trip, undefined);
  const unknown = await request("/access", { token: "does-not-exist", password: "2468" });
  assert.equal(unknown.status, 401);
  assert.equal(unknown.body.trip, undefined);
});

test("local memory mode can override Neon variables without changing migration selection", () => {
  process.env.TRIP_DATABASE_URL = "legacy-value-not-used";
  process.env.TRIP_DATABASE_DATABASE_URL = "pooled-value-not-used";
  process.env.TRIP_DATABASE_DATABASE_URL_UNPOOLED = "direct-value-not-used";

  process.env.TRIP_DEV_MEMORY_STORE = "1";
  assert.equal(getTripDatabaseConfig().mode, "memory");
  assert.equal(getTripStoreMode(), "memory");

  process.env.TRIP_DEV_MEMORY_STORE = "0";
  assert.deepEqual(getTripDatabaseConfig(), {
    runtimeVariable: "TRIP_DATABASE_DATABASE_URL",
    migrationVariable: "TRIP_DATABASE_DATABASE_URL_UNPOOLED",
    mode: "neon",
  });
  delete process.env.TRIP_DATABASE_URL;
  delete process.env.TRIP_DATABASE_DATABASE_URL;
  delete process.env.TRIP_DATABASE_DATABASE_URL_UNPOOLED;
  process.env.TRIP_DEV_MEMORY_STORE = "1";
});
