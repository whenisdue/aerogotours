import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import type { ClientTripRecord } from "../server/tripStore.ts";
import type { TripStage } from "../src/data/myTripTypes.ts";
import { createTrip, deleteSessionsForTrip, ensureTripSchema, findTripByTokenHash, getTripStoreMode, updateTrip } from "../server/tripStore.ts";
import { hashTripPassword, hashTripToken, randomToken } from "../server/tripSecurity.ts";

const validStages: TripStage[] = ["proposal", "booking", "companion", "completed"];
const baseUrl = (process.env.TRIP_BASE_URL?.trim() || "https://aerogotours.com").replace(/\/$/, "");

function printUsage(): void {
  console.log(`AeroGo private trip owner workflow

Commands:
  init
      Create the server-side trip tables. Safe to run more than once.
  create <trip-json>
      Store a new trip and print its one-time link and password.
  show <trip-token>
      Print a trip record without its token or password hash.
  update <trip-token> <trip-json>
      Replace editable trip content from a local JSON file.
  stage <trip-token> <proposal|booking|companion|completed>
      Change the customer-facing stage without changing the link.
  rotate <trip-token>
      Generate a new password and invalidate all existing sessions.
  revoke <trip-token>
      Revoke access immediately and invalidate all existing sessions.
  expire <trip-token> <ISO-date>
      Set or replace the access expiration date.
  archive <trip-token>
      Archive the trip and invalidate all existing sessions.

Trip JSON files must contain fictional/non-sensitive travel content only. Passwords are
never read from or written to those files.`);
}

async function readTripJson(filePath: string): Promise<ClientTripRecord> {
  const raw = await readFile(filePath, "utf8");
  const parsed: unknown = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Trip JSON must be an object.");
  const input = { ...(parsed as Record<string, unknown>) };
  for (const secretKey of ["password", "pin", "pinHash", "passwordHash"]) {
    if (secretKey in input) throw new Error(`Trip JSON must not contain ${secretKey}.`);
  }
  delete input.token;
  if (input.isDemo !== false) throw new Error("Real trip records must set isDemo to false. Use /trip/demo for the fictional demo.");
  if (!validStages.includes(input.currentStage as TripStage)) throw new Error(`currentStage must be one of: ${validStages.join(", ")}.`);
  if (typeof input.travelerName !== "string" || typeof input.destination !== "string") throw new Error("Trip JSON needs travelerName and destination.");
  return input as unknown as ClientTripRecord;
}

async function findTrip(token: string) {
  const trip = await findTripByTokenHash(hashTripToken(token));
  if (!trip) throw new Error("Trip not found.");
  return trip;
}

function printOneTimeCredentials(token: string, password: string): void {
  console.log(`Private link: ${baseUrl}/trip/${token}`);
  console.log(`Initial password (shown once): ${password}`);
  console.log("Send these details through AeroGo's approved customer channel. They are not stored in plaintext by AeroGo.");
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help") {
    printUsage();
    return;
  }

  await ensureTripSchema();
  console.log(`Trip store: ${getTripStoreMode()}`);

  if (command === "init") return;

  if (command === "create") {
    const filePath = args[0];
    if (!filePath) throw new Error("Usage: npm run trips -- create <trip-json>");
    const data = await readTripJson(filePath);
    const token = randomToken(32);
    const password = randomToken(18);
    await createTrip({
      id: randomUUID(),
      tokenHash: hashTripToken(token),
      pinHash: await hashTripPassword(password),
      data: { ...data, status: "active" },
      status: "active",
      accessExpiresAt: null,
      revokedAt: null,
      credentialVersion: 1,
    });
    console.log("Trip created.");
    printOneTimeCredentials(token, password);
    return;
  }

  if (command === "show") {
    const trip = await findTrip(args[0] ?? "");
    console.log(JSON.stringify({ id: trip.id, status: trip.status, accessExpiresAt: trip.accessExpiresAt, revokedAt: trip.revokedAt, credentialVersion: trip.credentialVersion, data: trip.data }, null, 2));
    return;
  }

  if (command === "update") {
    const [token, filePath] = args;
    if (!token || !filePath) throw new Error("Usage: npm run trips -- update <trip-token> <trip-json>");
    const trip = await findTrip(token);
    const data = await readTripJson(filePath);
    await updateTrip(trip.id, { data: { ...data, status: trip.status, booking: { ...data.booking, acceptedQuoteSnapshot: trip.data.booking.acceptedQuoteSnapshot } } });
    console.log("Trip content updated. The accepted quotation snapshot was preserved from the server record.");
    return;
  }

  if (command === "stage") {
    const [token, stage] = args;
    if (!token || !validStages.includes(stage as TripStage)) throw new Error(`Usage: npm run trips -- stage <trip-token> ${validStages.join("|")}`);
    const trip = await findTrip(token);
    await updateTrip(trip.id, { data: { ...trip.data, currentStage: stage as TripStage } });
    console.log(`Trip stage changed to ${stage}. The link and password remain unchanged.`);
    return;
  }

  if (command === "rotate") {
    const trip = await findTrip(args[0] ?? "");
    const password = randomToken(18);
    await updateTrip(trip.id, { pinHash: await hashTripPassword(password), incrementCredentialVersion: true });
    await deleteSessionsForTrip(trip.id);
    console.log("Password rotated and existing sessions invalidated.");
    printOneTimeCredentials(args[0] ?? "", password);
    return;
  }

  if (command === "revoke") {
    const trip = await findTrip(args[0] ?? "");
    await updateTrip(trip.id, { revokedAt: new Date().toISOString() });
    await deleteSessionsForTrip(trip.id);
    console.log("Trip access revoked and existing sessions invalidated.");
    return;
  }

  if (command === "expire") {
    const [token, expiration] = args;
    if (!token || !expiration || Number.isNaN(Date.parse(expiration))) throw new Error("Usage: npm run trips -- expire <trip-token> <ISO-date>");
    const trip = await findTrip(token);
    await updateTrip(trip.id, { accessExpiresAt: new Date(expiration).toISOString() });
    console.log(`Access expiration set to ${new Date(expiration).toISOString()}.`);
    return;
  }

  if (command === "archive") {
    const trip = await findTrip(args[0] ?? "");
    await updateTrip(trip.id, { status: "archived", revokedAt: new Date().toISOString() });
    await deleteSessionsForTrip(trip.id);
    console.log("Trip archived and existing sessions invalidated.");
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Trip command failed.");
  process.exitCode = 1;
});
