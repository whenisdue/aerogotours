import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const MAX_BODY_BYTES = 16 * 1024;
const MIN_FORM_COMPLETION_MS = 1_200;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1_000;

const ALLOWED_FIELDS = new Set(["name", "email", "destination", "dates", "travelers", "style", "notes", "website", "formStartedAt"]);
const TRAVELER_VALUES = new Set(["", "1", "2", "3", "4", "5+"]);
const STYLE_VALUES = new Set(["", "family", "couple", "solo", "work", "other"]);
const LINE_BREAKS = /[\r\n]/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const STYLE_LABELS: Record<string, string> = {
  family: "Family / group",
  couple: "Couple",
  solo: "Solo",
  work: "Work trip",
  other: "Other",
};

export interface Inquiry {
  name: string;
  email: string;
  destination: string;
  dates: string;
  travelers: string;
  style: string;
  notes: string;
}

export type InquiryValidation =
  | { ok: true; value: Inquiry }
  | { ok: false; status: number; error: string };

function invalid(error: string, status = 400): InquiryValidation {
  return { ok: false, status, error };
}

function hasDisallowedControlCharacters(value: string): boolean {
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 8 || code === 11 || code === 12 || (code >= 14 && code <= 31) || code === 127) return true;
  }
  return false;
}

function readTextField(data: Record<string, unknown>, key: string, maxLength: number, required = false, allowLineBreaks = false): string | null {
  const rawValue = data[key];
  if (rawValue === undefined && !required) return "";
  if (typeof rawValue !== "string") return null;

  const value = allowLineBreaks ? rawValue.replace(/\r\n?/g, "\n").trim() : rawValue.trim();
  if (!value && required) return null;
  if (value.length > maxLength || hasDisallowedControlCharacters(value) || (!allowLineBreaks && LINE_BREAKS.test(value))) return null;
  return value;
}

function readFormStartedAt(data: Record<string, unknown>): number | null {
  const rawValue = data.formStartedAt;
  const value = typeof rawValue === "number" ? rawValue : typeof rawValue === "string" && /^\d+$/.test(rawValue.trim()) ? Number(rawValue) : NaN;
  if (!Number.isSafeInteger(value) || value <= 0) return null;
  return value;
}

export function validateInquiry(body: unknown, now = Date.now()): InquiryValidation {
  if (!body || typeof body !== "object" || Array.isArray(body)) return invalid("Please check the inquiry details and try again.");

  const data = body as Record<string, unknown>;
  if (Object.keys(data).some((key) => !ALLOWED_FIELDS.has(key))) return invalid("Please check the inquiry details and try again.");

  const name = readTextField(data, "name", 120, true);
  const email = readTextField(data, "email", 254, true);
  const destination = readTextField(data, "destination", 180, true);
  const dates = readTextField(data, "dates", 180);
  const travelers = readTextField(data, "travelers", 20);
  const style = readTextField(data, "style", 30);
  const notes = readTextField(data, "notes", 2_000, false, true);
  const website = readTextField(data, "website", 100);
  const formStartedAt = readFormStartedAt(data);

  if (!name || !email || !destination || dates === null || travelers === null || style === null || notes === null || website === null || !formStartedAt) {
    return invalid("Please check the inquiry details and try again.");
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 254) return invalid("Please enter a valid email address.");
  if (!TRAVELER_VALUES.has(travelers) || !STYLE_VALUES.has(style)) return invalid("Please check the inquiry details and try again.");
  if (website) return invalid("Please check the inquiry details and try again.");

  const elapsed = now - formStartedAt;
  if (elapsed >= 0 && elapsed < MIN_FORM_COMPLETION_MS) return invalid("Please take a moment to review the inquiry and try again.");
  if (elapsed > MAX_AGE_MS) return invalid("Please refresh the page and try again.");

  return { ok: true, value: { name, email, destination, dates, travelers, style, notes } };
}

export function buildInquiryEmail(inquiry: Inquiry, submittedAt = new Date()): { subject: string; text: string } {
  const optionalLines = [
    inquiry.dates && `Travel dates: ${inquiry.dates}`,
    inquiry.travelers && `Travelers: ${inquiry.travelers === "5+" ? "5 or more" : inquiry.travelers}`,
    inquiry.style && `Trip style: ${STYLE_LABELS[inquiry.style] ?? inquiry.style}`,
    inquiry.notes && `Preferences or message:\n${inquiry.notes}`,
  ].filter(Boolean);

  return {
    subject: `New AeroGo trip inquiry — ${inquiry.destination.replace(LINE_BREAKS, " ")}`,
    text: [
      "New AeroGo trip inquiry",
      "",
      `Customer name: ${inquiry.name}`,
      `Customer email: ${inquiry.email}`,
      `Destination: ${inquiry.destination}`,
      ...optionalLines,
      `Submitted: ${submittedAt.toISOString()}`,
    ].join("\n"),
  };
}

function parseRequestBody(rawBody: unknown): { body?: unknown; status?: number; error?: string } {
  if (typeof rawBody === "string") {
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) return { status: 413, error: "This inquiry is too large." };
    try {
      return { body: JSON.parse(rawBody) };
    } catch {
      return { status: 400, error: "Please send a valid inquiry." };
    }
  }

  if (rawBody === undefined || rawBody === null) return { status: 400, error: "Please send a valid inquiry." };
  try {
    const serialized = JSON.stringify(rawBody);
    if (Buffer.byteLength(serialized, "utf8") > MAX_BODY_BYTES) return { status: 413, error: "This inquiry is too large." };
  } catch {
    return { status: 400, error: "Please send a valid inquiry." };
  }
  return { body: rawBody };
}

function hasLineBreak(value: string): boolean {
  return LINE_BREAKS.test(value);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed." });
  }

  const contentType = req.headers["content-type"];
  if (contentType && !String(contentType).toLowerCase().includes("application/json")) {
    return res.status(415).json({ ok: false, error: "Please send a JSON inquiry." });
  }

  const parsed = parseRequestBody(req.body);
  if (parsed.error || parsed.status) return res.status(parsed.status ?? 400).json({ ok: false, error: parsed.error });

  const validation = validateInquiry(parsed.body);
  if (validation.ok === false) return res.status(validation.status).json({ ok: false, error: validation.error });

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const toEmail = process.env.INQUIRY_TO_EMAIL?.trim();
  const fromEmail = process.env.INQUIRY_FROM_EMAIL?.trim();
  if (!apiKey || !toEmail || !fromEmail || hasLineBreak(toEmail) || hasLineBreak(fromEmail)) {
    return res.status(503).json({ ok: false, error: "Inquiry service is not configured. Please try again later." });
  }

  const email = buildInquiryEmail(validation.value);
  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: validation.value.email,
      subject: email.subject,
      text: email.text,
    });

    if (result.error || !result.data?.id) {
      console.error("Resend rejected an AeroGo inquiry", result.error?.name ?? "unknown provider error");
      return res.status(502).json({ ok: false, error: "We couldn't send your inquiry right now." });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("AeroGo inquiry provider request failed", error instanceof Error ? error.name : "unknown error");
    return res.status(502).json({ ok: false, error: "We couldn't send your inquiry right now." });
  }
}
