import type { TripStage } from "../data/myTripTypes";

const tripStages: TripStage[] = ["proposal", "booking", "companion", "completed"];

export function isTripStage(value: string | null): value is TripStage {
  return value !== null && tripStages.includes(value as TripStage);
}

export function resolveInitialTripStage(currentStage: TripStage, isDemo: boolean, requestedStage?: string | null): TripStage {
  if (!isDemo) return currentStage;
  return isTripStage(requestedStage ?? null) ? requestedStage as TripStage : "companion";
}
