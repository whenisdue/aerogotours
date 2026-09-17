import assert from "node:assert/strict";
import test from "node:test";
import handler from "../api/inquiry.ts";

const originalFetch = globalThis.fetch;
const originalEnvironment = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  INQUIRY_TO_EMAIL: process.env.INQUIRY_TO_EMAIL,
  INQUIRY_FROM_EMAIL: process.env.INQUIRY_FROM_EMAIL,
};

function setConfiguredEnvironment() {
  process.env.RESEND_API_KEY = "re_test_key";
  process.env.INQUIRY_TO_EMAIL = "aerogo.inquiry@gmail.com";
  process.env.INQUIRY_FROM_EMAIL = "AeroGo Travel & Tours <inquiries@aerogotours.com>";
}

function restoreEnvironment() {
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  globalThis.fetch = originalFetch;
}

function makeResponse() {
  return {
    statusCode: 200,
    headers: {},
    payload: null,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    },
  };
}

function validInquiry(overrides = {}) {
  return {
    name: "Maria Santos",
    email: "maria@example.com",
    destination: "Kyoto, Japan",
    dates: "November 2026",
    travelers: "2",
    style: "family",
    notes: "A relaxed pace, please.",
    website: "",
    formStartedAt: String(Date.now() - 5_000),
    ...overrides,
  };
}

async function invoke(body, { method = "POST", contentType = "application/json" } = {}) {
  const response = makeResponse();
  await handler({ method, headers: contentType ? { "content-type": contentType } : {}, body }, response);
  return response;
}

test.afterEach(restoreEnvironment);

test("accepts a valid inquiry when the provider accepts it", async () => {
  setConfiguredEnvironment();
  let providerCalls = 0;
  let providerPayload;
  globalThis.fetch = async (input, init) => {
    providerCalls += 1;
    providerPayload = JSON.parse(await new Request(input, init).text());
    return new Response(JSON.stringify({ id: "email_123" }), { status: 200, headers: { "content-type": "application/json" } });
  };

  const response = await invoke(validInquiry());

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { ok: true });
  assert.equal(providerCalls, 1);
  assert.deepEqual(providerPayload.to, ["aerogo.inquiry@gmail.com"]);
  assert.equal(providerPayload.reply_to, "maria@example.com");
  assert.match(providerPayload.text, /Kyoto, Japan/);
});

test("accepts a sample-trip inquiry without selected traveler or style values", async () => {
  setConfiguredEnvironment();
  globalThis.fetch = async () => new Response(JSON.stringify({ id: "email_sample" }), { status: 200, headers: { "content-type": "application/json" } });

  const response = await invoke(validInquiry({ travelers: "", style: "", notes: "Sample itinerary — preferences not selected." }));

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.payload, { ok: true });
});

test("rejects a missing required field", async () => {
  setConfiguredEnvironment();
  const response = await invoke(validInquiry({ destination: "" }));
  assert.equal(response.statusCode, 400);
  assert.equal(response.payload.ok, false);
});

test("rejects an invalid email address", async () => {
  setConfiguredEnvironment();
  const response = await invoke(validInquiry({ email: "not-an-email" }));
  assert.equal(response.statusCode, 400);
  assert.match(response.payload.error, /valid email/i);
});

test("rejects an oversized request body", async () => {
  setConfiguredEnvironment();
  const response = await invoke(validInquiry({ unexpected: "x".repeat(17_000) }));
  assert.equal(response.statusCode, 413);
});

test("rejects a non-POST request", async () => {
  const response = await invoke(undefined, { method: "GET" });
  assert.equal(response.statusCode, 405);
  assert.equal(response.headers.Allow, "POST");
});

test("rejects a honeypot submission", async () => {
  setConfiguredEnvironment();
  const response = await invoke(validInquiry({ website: "https://spam.example" }));
  assert.equal(response.statusCode, 400);
});

test("fails safely when Resend is not configured", async () => {
  process.env.INQUIRY_TO_EMAIL = "aerogo.inquiry@gmail.com";
  process.env.INQUIRY_FROM_EMAIL = "AeroGo Travel & Tours <inquiries@aerogotours.com>";
  const response = await invoke(validInquiry());
  assert.equal(response.statusCode, 503);
  assert.match(response.payload.error, /not configured/i);
});

test("reports a provider failure without exposing provider details", async () => {
  setConfiguredEnvironment();
  globalThis.fetch = async () => new Response(JSON.stringify({ message: "provider unavailable" }), { status: 500, headers: { "content-type": "application/json" } });
  const response = await invoke(validInquiry());
  assert.equal(response.statusCode, 502);
  assert.equal(response.payload.error, "We couldn't send your inquiry right now.");
});

test("rejects malformed JSON", async () => {
  setConfiguredEnvironment();
  const response = await invoke("{bad json");
  assert.equal(response.statusCode, 400);
});
