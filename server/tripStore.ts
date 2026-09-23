import { neon } from "@neondatabase/serverless";
import type { MyTripRecord, TripStatus } from "../src/data/myTripTypes.ts";
import { RATE_LIMIT_WINDOW_MS, hashRateLimitSource } from "./tripSecurity.ts";
import { sanitizeClientTrip } from "./tripDataSafety.ts";

export type ClientTripRecord = Omit<MyTripRecord, "token">;

export type StoredTrip = {
  id: string;
  tokenHash: string;
  pinHash: string;
  data: ClientTripRecord;
  status: TripStatus;
  accessExpiresAt: string | null;
  revokedAt: string | null;
  credentialVersion: number;
};

export type StoredSession = {
  sessionHash: string;
  tripId: string;
  tokenHash: string;
  credentialVersion: number;
  expiresAt: string;
};

export type TripPatch = {
  data?: ClientTripRecord;
  status?: TripStatus;
  accessExpiresAt?: string | null;
  revokedAt?: string | null;
  pinHash?: string;
  incrementCredentialVersion?: boolean;
};

type RateLimitRow = { failed_count: number; window_started_at: string };
type StoreMode = "memory" | "neon";
type DatabaseConfigMode = StoreMode | "unconfigured";
type DatabaseVariable = "TRIP_DATABASE_DATABASE_URL" | "TRIP_DATABASE_DATABASE_URL_UNPOOLED" | "TRIP_DATABASE_URL" | "DATABASE_URL";

const memoryTrips = new Map<string, StoredTrip>();
const memorySessions = new Map<string, StoredSession>();
const memoryAttempts = new Map<string, { failedCount: number; windowStartedAt: number }>();

let sql: ReturnType<typeof neon> | null = null;
let migrationSql: ReturnType<typeof neon> | null = null;
let schemaPromise: Promise<void> | null = null;

function readDatabaseVariable(names: DatabaseVariable[]): { name: DatabaseVariable; value: string } | null {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return { name, value };
  }
  return null;
}

function getRuntimeDatabase(): { name: DatabaseVariable; value: string } | null {
  return readDatabaseVariable(["TRIP_DATABASE_DATABASE_URL", "TRIP_DATABASE_URL", "DATABASE_URL"]);
}

function getMigrationDatabase(): { name: DatabaseVariable; value: string } | null {
  return readDatabaseVariable(["TRIP_DATABASE_DATABASE_URL_UNPOOLED", "TRIP_DATABASE_DATABASE_URL", "TRIP_DATABASE_URL", "DATABASE_URL"]);
}

export function getTripDatabaseConfig(): { runtimeVariable: DatabaseVariable | null; migrationVariable: DatabaseVariable | null; mode: DatabaseConfigMode } {
  const runtime = getRuntimeDatabase();
  const localMemory = process.env.TRIP_DEV_MEMORY_STORE === "1" || (!runtime && !process.env.VERCEL && process.env.NODE_ENV !== "production");
  return {
    runtimeVariable: runtime?.name ?? null,
    migrationVariable: getMigrationDatabase()?.name ?? null,
    mode: localMemory ? "memory" : runtime ? "neon" : "unconfigured",
  };
}

export function getTripStoreMode(): StoreMode {
  if (process.env.TRIP_DEV_MEMORY_STORE === "1" || (!process.env.VERCEL && process.env.NODE_ENV !== "production")) return "memory";
  if (getRuntimeDatabase()) return "neon";
  throw new Error("A pooled trip database connection is required outside local development.");
}

function getSql(): ReturnType<typeof neon> {
  const database = getRuntimeDatabase();
  if (!database) throw new Error("A pooled trip database connection is not configured.");
  sql ??= neon(database.value);
  return sql;
}

function getMigrationSql(): ReturnType<typeof neon> {
  const database = getMigrationDatabase();
  if (!database) throw new Error("A migration database connection is not configured.");
  migrationSql ??= neon(database.value);
  return migrationSql;
}

export async function ensureTripSchema(): Promise<void> {
  if (getTripStoreMode() === "memory") return;
  schemaPromise ??= (async () => {
    const query = getMigrationSql();
    await query`CREATE TABLE IF NOT EXISTS aero_go_trips (
      id TEXT PRIMARY KEY,
      token_hash TEXT UNIQUE NOT NULL,
      pin_hash TEXT NOT NULL,
      data JSONB NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('active', 'expired', 'archived')),
      access_expires_at TIMESTAMPTZ NULL,
      revoked_at TIMESTAMPTZ NULL,
      credential_version INTEGER NOT NULL DEFAULT 1,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await query`CREATE INDEX IF NOT EXISTS aero_go_trips_token_hash_idx ON aero_go_trips (token_hash)`;
    await query`CREATE TABLE IF NOT EXISTS aero_go_trip_sessions (
      session_hash TEXT PRIMARY KEY,
      trip_id TEXT NOT NULL REFERENCES aero_go_trips(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL,
      credential_version INTEGER NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;
    await query`CREATE INDEX IF NOT EXISTS aero_go_trip_sessions_trip_idx ON aero_go_trip_sessions (trip_id)`;
    await query`CREATE TABLE IF NOT EXISTS aero_go_trip_attempts (
      scope_hash TEXT PRIMARY KEY,
      failed_count INTEGER NOT NULL DEFAULT 0,
      window_started_at TIMESTAMPTZ NOT NULL
    )`;
  })();
  await schemaPromise;
}

export async function findTripByTokenHash(tokenHash: string): Promise<StoredTrip | null> {
  if (getTripStoreMode() === "memory") return [...memoryTrips.values()].find((trip) => trip.tokenHash === tokenHash) ?? null;
  await ensureTripSchema();
  const rows = await getSql()`SELECT id, token_hash, pin_hash, data, status, access_expires_at, revoked_at, credential_version FROM aero_go_trips WHERE token_hash = ${tokenHash} LIMIT 1` as Array<Record<string, unknown>>;
  return rows[0] ? rowToTrip(rows[0]) : null;
}

export async function createTrip(trip: StoredTrip): Promise<void> {
  if (getTripStoreMode() === "memory") {
    memoryTrips.set(trip.id, trip);
    return;
  }
  await ensureTripSchema();
  await getSql()`INSERT INTO aero_go_trips (id, token_hash, pin_hash, data, status, access_expires_at, revoked_at, credential_version) VALUES (${trip.id}, ${trip.tokenHash}, ${trip.pinHash}, ${JSON.stringify(trip.data)}::jsonb, ${trip.status}, ${trip.accessExpiresAt}, ${trip.revokedAt}, ${trip.credentialVersion})`;
}

export async function updateTrip(tripId: string, patch: TripPatch): Promise<StoredTrip | null> {
  if (getTripStoreMode() === "memory") {
    const current = [...memoryTrips.values()].find((trip) => trip.id === tripId);
    if (!current) return null;
    const updated: StoredTrip = {
      ...current,
      ...(patch.data ? { data: patch.data } : {}),
      ...(patch.status ? { status: patch.status } : {}),
      ...(patch.accessExpiresAt !== undefined ? { accessExpiresAt: patch.accessExpiresAt } : {}),
      ...(patch.revokedAt !== undefined ? { revokedAt: patch.revokedAt } : {}),
      ...(patch.pinHash ? { pinHash: patch.pinHash } : {}),
      ...(patch.incrementCredentialVersion ? { credentialVersion: current.credentialVersion + 1 } : {}),
    };
    memoryTrips.set(tripId, updated);
    return updated;
  }

  await ensureTripSchema();
  const current = await findTripById(tripId);
  if (!current) return null;
  const updated = {
    data: patch.data ?? current.data,
    status: patch.status ?? current.status,
    accessExpiresAt: patch.accessExpiresAt !== undefined ? patch.accessExpiresAt : current.accessExpiresAt,
    revokedAt: patch.revokedAt !== undefined ? patch.revokedAt : current.revokedAt,
    pinHash: patch.pinHash ?? current.pinHash,
    credentialVersion: current.credentialVersion + (patch.incrementCredentialVersion ? 1 : 0),
  };
  const rows = await getSql()`UPDATE aero_go_trips SET data = ${JSON.stringify(updated.data)}::jsonb, status = ${updated.status}, access_expires_at = ${updated.accessExpiresAt}, revoked_at = ${updated.revokedAt}, pin_hash = ${updated.pinHash}, credential_version = ${updated.credentialVersion}, updated_at = NOW() WHERE id = ${tripId} RETURNING id, token_hash, pin_hash, data, status, access_expires_at, revoked_at, credential_version` as Array<Record<string, unknown>>;
  return rows[0] ? rowToTrip(rows[0]) : null;
}

export async function findTripById(tripId: string): Promise<StoredTrip | null> {
  if (getTripStoreMode() === "memory") return memoryTrips.get(tripId) ?? null;
  await ensureTripSchema();
  const rows = await getSql()`SELECT id, token_hash, pin_hash, data, status, access_expires_at, revoked_at, credential_version FROM aero_go_trips WHERE id = ${tripId} LIMIT 1` as Array<Record<string, unknown>>;
  return rows[0] ? rowToTrip(rows[0]) : null;
}

export async function createSession(session: StoredSession): Promise<void> {
  if (getTripStoreMode() === "memory") {
    memorySessions.set(session.sessionHash, session);
    return;
  }
  await ensureTripSchema();
  await getSql()`INSERT INTO aero_go_trip_sessions (session_hash, trip_id, token_hash, credential_version, expires_at) VALUES (${session.sessionHash}, ${session.tripId}, ${session.tokenHash}, ${session.credentialVersion}, ${session.expiresAt})`;
}

export async function findSession(sessionHash: string): Promise<StoredSession | null> {
  if (getTripStoreMode() === "memory") return memorySessions.get(sessionHash) ?? null;
  await ensureTripSchema();
  const rows = await getSql()`SELECT session_hash, trip_id, token_hash, credential_version, expires_at FROM aero_go_trip_sessions WHERE session_hash = ${sessionHash} AND expires_at > NOW() LIMIT 1` as Array<Record<string, unknown>>;
  return rows[0] ? rowToSession(rows[0]) : null;
}

export async function deleteSession(sessionHash: string): Promise<void> {
  if (getTripStoreMode() === "memory") {
    memorySessions.delete(sessionHash);
    return;
  }
  await ensureTripSchema();
  await getSql()`DELETE FROM aero_go_trip_sessions WHERE session_hash = ${sessionHash}`;
}

export async function deleteSessionsForTrip(tripId: string): Promise<void> {
  if (getTripStoreMode() === "memory") {
    for (const [sessionHash, session] of memorySessions) if (session.tripId === tripId) memorySessions.delete(sessionHash);
    return;
  }
  await ensureTripSchema();
  await getSql()`DELETE FROM aero_go_trip_sessions WHERE trip_id = ${tripId}`;
}

export async function isRateLimited(scopes: string[], maxAttempts: number): Promise<boolean> {
  const now = Date.now();
  if (getTripStoreMode() === "memory") return scopes.some((scope) => {
    const entry = memoryAttempts.get(scope);
    return entry ? now - entry.windowStartedAt < RATE_LIMIT_WINDOW_MS && entry.failedCount >= maxAttempts : false;
  });

  await ensureTripSchema();
  const rows = await Promise.all(scopes.map(async (scope) => await getSql()`SELECT failed_count, window_started_at FROM aero_go_trip_attempts WHERE scope_hash = ${scope} LIMIT 1` as unknown as Array<RateLimitRow>));
  return rows.some(([row]) => row && Date.now() - new Date(row.window_started_at).getTime() < RATE_LIMIT_WINDOW_MS && row.failed_count >= maxAttempts);
}

export async function recordFailedAttempt(scopes: string[]): Promise<void> {
  const now = Date.now();
  if (getTripStoreMode() === "memory") {
    for (const scope of scopes) {
      const current = memoryAttempts.get(scope);
      if (!current || now - current.windowStartedAt >= RATE_LIMIT_WINDOW_MS) memoryAttempts.set(scope, { failedCount: 1, windowStartedAt: now });
      else memoryAttempts.set(scope, { ...current, failedCount: current.failedCount + 1 });
    }
    return;
  }

  await ensureTripSchema();
  for (const scope of scopes) {
    await getSql()`INSERT INTO aero_go_trip_attempts (scope_hash, failed_count, window_started_at) VALUES (${scope}, 1, NOW()) ON CONFLICT (scope_hash) DO UPDATE SET failed_count = CASE WHEN aero_go_trip_attempts.window_started_at < NOW() - INTERVAL '10 minutes' THEN 1 ELSE aero_go_trip_attempts.failed_count + 1 END, window_started_at = CASE WHEN aero_go_trip_attempts.window_started_at < NOW() - INTERVAL '10 minutes' THEN NOW() ELSE aero_go_trip_attempts.window_started_at END`;
  }
}

export async function clearFailedAttempts(scopes: string[]): Promise<void> {
  if (getTripStoreMode() === "memory") {
    for (const scope of scopes) memoryAttempts.delete(scope);
    return;
  }
  await ensureTripSchema();
  for (const scope of scopes) await getSql()`DELETE FROM aero_go_trip_attempts WHERE scope_hash = ${scope}`;
}

export function buildRateLimitScopes(ip: string, tokenHash: string): string[] {
  const sourceHash = hashRateLimitSource(ip);
  return [`source:${sourceHash}`, `source-trip:${sourceHash}:${tokenHash}`];
}

export function isTripActive(trip: StoredTrip, now = Date.now()): boolean {
  return trip.status === "active" && !trip.revokedAt && (!trip.accessExpiresAt || new Date(trip.accessExpiresAt).getTime() > now);
}

export function toClientTrip(trip: StoredTrip): ClientTripRecord {
  const { token: _token, ...clientData } = trip.data as ClientTripRecord & { token?: unknown };
  return sanitizeClientTrip({ ...clientData, status: trip.status });
}

function rowToTrip(row: Record<string, unknown>): StoredTrip {
  return {
    id: String(row.id),
    tokenHash: String(row.token_hash),
    pinHash: String(row.pin_hash),
    data: row.data as ClientTripRecord,
    status: row.status as TripStatus,
    accessExpiresAt: row.access_expires_at ? new Date(String(row.access_expires_at)).toISOString() : null,
    revokedAt: row.revoked_at ? new Date(String(row.revoked_at)).toISOString() : null,
    credentialVersion: Number(row.credential_version),
  };
}

function rowToSession(row: Record<string, unknown>): StoredSession {
  return {
    sessionHash: String(row.session_hash),
    tripId: String(row.trip_id),
    tokenHash: String(row.token_hash),
    credentialVersion: Number(row.credential_version),
    expiresAt: new Date(String(row.expires_at)).toISOString(),
  };
}
