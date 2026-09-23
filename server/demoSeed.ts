import { demoHongKongTrip } from "../src/data/myTrip.ts";
import { vietnamProposalTrip } from "../src/data/vietnamProposal.ts";
import { createTrip, findTripByTokenHash, getTripStoreMode, type ClientTripRecord } from "./tripStore.ts";
import { hashTripPassword, hashTripToken } from "./tripSecurity.ts";

let seedPromise: Promise<void> | null = null;

export async function ensureDemoTripSeeded(): Promise<void> {
  if (getTripStoreMode() !== "memory") return;
  seedPromise ??= (async () => {
    const demoPin = process.env.TRIP_DEMO_PIN?.trim() || "2468";
    await seedLocalTrip("demo", demoHongKongTrip, demoPin);
    await seedLocalTrip("vietnam-proposal", vietnamProposalTrip, demoPin);
  })();
  await seedPromise;
}

async function seedLocalTrip(id: string, trip: typeof demoHongKongTrip, demoPin: string): Promise<void> {
  const tokenHash = hashTripToken(trip.token);
  if (await findTripByTokenHash(tokenHash)) return;
  const { token: _token, ...clientData } = trip;
  await createTrip({
    id,
    tokenHash,
    pinHash: await hashTripPassword(demoPin),
    data: clientData as ClientTripRecord,
    status: "active",
    accessExpiresAt: null,
    revokedAt: null,
    credentialVersion: 1,
  });
}
