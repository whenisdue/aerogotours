import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (password: string | Buffer, salt: string | Buffer, keyLength: number, options: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;
const SCRYPT_N = 16_384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_MAXMEM = 64 * 1024 * 1024;

export const SESSION_TTL_SECONDS = 8 * 60 * 60;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1_000;
export const MAX_ATTEMPTS_PER_SOURCE = 10;
export const MAX_ATTEMPTS_PER_SOURCE_AND_TRIP = 10;

export function randomToken(byteLength = 32): string {
  return randomBytes(byteLength).toString("base64url");
}

export function hashTripToken(token: string): string {
  return createHash("sha256").update(`trip-token:${token}`).digest("hex");
}

export function hashSessionToken(sessionToken: string): string {
  return createHash("sha256").update(`trip-session:${sessionToken}`).digest("hex");
}

export function hashRateLimitSource(source: string): string {
  const configuredSalt = process.env.TRIP_ACCESS_HASH_SALT?.trim();
  if (!configuredSalt && isProductionRuntime()) throw new Error("TRIP_ACCESS_HASH_SALT is required outside local development.");
  const salt = configuredSalt || "local-development-only";
  return createHash("sha256").update(`trip-source:${salt}:${source}`).digest("hex");
}

export async function hashTripPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, SCRYPT_KEY_LENGTH, {
    N: SCRYPT_N,
    r: SCRYPT_R,
    p: SCRYPT_P,
    maxmem: SCRYPT_MAXMEM,
  }) as Buffer;
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("hex"), derivedKey.toString("hex")].join("$");
}

export async function verifyTripPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, nText, rText, pText, saltHex, expectedHex] = encodedHash.split("$");
  if (algorithm !== "scrypt" || !nText || !rText || !pText || !saltHex || !expectedHex || !/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(expectedHex)) return false;

  const n = Number(nText);
  const r = Number(rText);
  const p = Number(pText);
  const expected = Buffer.from(expectedHex, "hex");
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(r) || !Number.isSafeInteger(p) || expected.length === 0) return false;

  try {
    const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length, { N: n, r, p, maxmem: SCRYPT_MAXMEM }) as Buffer;
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers["x-forwarded-for"];
  const firstForwarded = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  const realIp = headers["x-real-ip"];
  return (firstForwarded || (Array.isArray(realIp) ? realIp[0] : realIp) || "unknown").trim().slice(0, 128);
}

export function isProductionRuntime(): boolean {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}
