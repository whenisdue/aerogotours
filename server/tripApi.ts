import { hashTripPassword, randomToken, SESSION_TTL_SECONDS, getClientIp, hashSessionToken, hashTripToken, verifyTripPassword } from "./tripSecurity.ts";
import { buildRateLimitScopes, clearFailedAttempts, deleteSession, findSession, findTripByTokenHash, isRateLimited, isTripActive, recordFailedAttempt, toClientTrip, createSession, findTripById } from "./tripStore.ts";
import { toProposalTrip } from "./tripDataSafety.ts";
import { ensureDemoTripSeeded } from "./demoSeed.ts";

const SESSION_COOKIE = "aerogo_trip_session";
const MAX_TOKEN_LENGTH = 256;
const MAX_PASSWORD_LENGTH = 256;
const GENERIC_UNLOCK_ERROR = "We couldn't open this trip. Check the PIN or contact AeroGo.";
const DUMMY_PASSWORD_HASH_PROMISE = hashTripPassword("aerogo-demo-dummy-password");

export type TripApiRequest = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};

export type TripApiResult = {
  status: number;
  headers: Record<string, string | string[]>;
  body: Record<string, unknown>;
};

export async function handleTripApi(path: string, request: TripApiRequest): Promise<TripApiResult> {
  try {
    if (path.endsWith("/access")) return await unlockTrip(request);
    if (path.endsWith("/session")) return await restoreTripSession(request);
    if (path.endsWith("/logout")) return await logoutTrip(request);
    return response(404, { ok: false, error: "Not found." });
  } catch {
    return response(503, { ok: false, error: "AeroGo cannot open this trip right now. Please try again later." }, privateHeaders());
  }
}

async function unlockTrip(request: TripApiRequest): Promise<TripApiResult> {
  const baseHeaders = privateHeaders();
  if (request.method !== "POST") return response(405, { ok: false, error: "Method not allowed." }, { ...baseHeaders, Allow: "POST" });

  await ensureDemoTripSeeded();
  const input = readCredentials(request.body);
  const token = input.token ?? "";
  const password = input.password ?? "";
  const tokenHash = hashTripToken(token);
  const scopes = buildRateLimitScopes(getClientIp(request.headers), tokenHash);
  const rateLimited = token && password ? await isRateLimited(scopes, 10) : false;
  if (!token || !password || rateLimited) {
    if (token || password) await recordFailedAttempt(scopes);
    return response(rateLimited ? 429 : 401, { ok: false, error: GENERIC_UNLOCK_ERROR }, { ...baseHeaders, ...(rateLimited ? { "Retry-After": "60" } : {}) });
  }

  const trip = await findTripByTokenHash(tokenHash);
  const passwordHash = trip?.pinHash ?? await DUMMY_PASSWORD_HASH_PROMISE;
  const passwordMatches = await verifyTripPassword(password, passwordHash);
  if (!trip || !passwordMatches) {
    await recordFailedAttempt(scopes);
    return response(401, { ok: false, error: GENERIC_UNLOCK_ERROR }, baseHeaders);
  }

  if (!isTripActive(trip)) {
    await clearFailedAttempts(scopes);
    return response(410, { ok: false, error: "This trip link is no longer active.", lifecycle: tripLifecycle(trip) }, { ...baseHeaders, "Set-Cookie": clearSessionCookie() });
  }

  await clearFailedAttempts(scopes);
  const sessionToken = randomToken(32);
  const sessionHash = hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1_000).toISOString();
  await createSession({ sessionHash, tripId: trip.id, tokenHash, credentialVersion: trip.credentialVersion, expiresAt });
  return response(200, { ok: true, trip: toClientTrip(trip), sessionExpiresAt: expiresAt }, { ...baseHeaders, "Set-Cookie": buildSessionCookie(sessionToken) });
}

async function restoreTripSession(request: TripApiRequest): Promise<TripApiResult> {
  const baseHeaders = privateHeaders();
  if (request.method !== "POST") return response(405, { ok: false, error: "Method not allowed." }, { ...baseHeaders, Allow: "POST" });

  await ensureDemoTripSeeded();
  const { token } = readCredentials(request.body);
  const sessionToken = readCookie(request.headers.cookie, SESSION_COOKIE);
  if (!token) return response(401, { ok: false, error: GENERIC_UNLOCK_ERROR }, baseHeaders);

  const tokenHash = hashTripToken(token);
  if (!sessionToken) {
    return await publicProposalAccess(tokenHash, baseHeaders) ?? response(401, { ok: false, error: GENERIC_UNLOCK_ERROR }, baseHeaders);
  }

  const session = await findSession(hashSessionToken(sessionToken));
  if (!session || session.tokenHash !== tokenHash) return await publicProposalAccess(tokenHash, baseHeaders) ?? response(401, { ok: false, error: GENERIC_UNLOCK_ERROR }, baseHeaders);

  const trip = await findTripById(session.tripId);
  if (!trip || session.credentialVersion !== trip.credentialVersion) {
    await deleteSession(session.sessionHash);
    return response(401, { ok: false, error: GENERIC_UNLOCK_ERROR }, { ...baseHeaders, "Set-Cookie": clearSessionCookie() });
  }
  if (!isTripActive(trip)) {
    await deleteSession(session.sessionHash);
    return response(410, { ok: false, error: "This trip link is no longer active.", lifecycle: tripLifecycle(trip) }, { ...baseHeaders, "Set-Cookie": clearSessionCookie() });
  }
  return response(200, { ok: true, trip: toClientTrip(trip), sessionExpiresAt: session.expiresAt }, baseHeaders);
}

async function publicProposalAccess(tokenHash: string, baseHeaders: Record<string, string>): Promise<TripApiResult | null> {
  const proposalTrip = await findTripByTokenHash(tokenHash);
  if (!proposalTrip) return null;
  if (!isTripActive(proposalTrip)) return response(410, { ok: false, error: "This trip link is no longer active.", lifecycle: tripLifecycle(proposalTrip) }, { ...baseHeaders, "Set-Cookie": clearSessionCookie() });
  if (proposalTrip.data.currentStage !== "proposal" || proposalTrip.data.isDemo) return null;
  return response(200, { ok: true, access: "proposal", trip: toProposalTrip(proposalTrip.data) }, { ...baseHeaders, "Set-Cookie": clearSessionCookie() });
}

async function logoutTrip(request: TripApiRequest): Promise<TripApiResult> {
  const sessionToken = readCookie(request.headers.cookie, SESSION_COOKIE);
  if (sessionToken) await deleteSession(hashSessionToken(sessionToken));
  return response(200, { ok: true }, { ...privateHeaders(), "Set-Cookie": clearSessionCookie() });
}

function readCredentials(body: unknown): { token?: string; password?: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) return {};
  const data = body as Record<string, unknown>;
  const token = typeof data.token === "string" && data.token.length <= MAX_TOKEN_LENGTH ? data.token.trim() : undefined;
  const passwordValue = typeof data.password === "string" ? data.password : typeof data.pin === "string" ? data.pin : undefined;
  const password = passwordValue && passwordValue.length <= MAX_PASSWORD_LENGTH ? passwordValue : undefined;
  return { token, password };
}

function readCookie(header: string | string[] | undefined, name: string): string | undefined {
  const value = Array.isArray(header) ? header.join(";") : header;
  return value?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}

function buildSessionCookie(sessionToken: string): string {
  const secure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${sessionToken}; Max-Age=${SESSION_TTL_SECONDS}; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function clearSessionCookie(): string {
  const secure = process.env.VERCEL === "1" || process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax${secure}`;
}

function tripLifecycle(trip: { status: string; revokedAt: string | null }): "expired" | "archived" | "revoked" {
  if (trip.revokedAt) return "revoked";
  return trip.status === "archived" ? "archived" : "expired";
}

function privateHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store, private",
    Vary: "Cookie",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Referrer-Policy": "no-referrer",
  };
}

function response(status: number, body: Record<string, unknown>, headers: Record<string, string | string[]> = {}): TripApiResult {
  return { status, headers, body };
}
