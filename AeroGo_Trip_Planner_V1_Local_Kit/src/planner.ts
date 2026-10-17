import {
  ARRIVAL, DAYS, DEFAULT_PREFERENCES, DEPARTURE,
  type DayCount, type Group, type Interest, type ItineraryDay, type Mobility, type Pace, type Preferences
} from './catalog.ts';

export const STORAGE_KEY = 'aerogo-trip-planner-v1';
const interests: Interest[] = ['gardens', 'culture', 'food', 'skyline'];
const groups: Group[] = ['couple', 'solo', 'family', 'friends'];
const paces: Pace[] = ['relaxed', 'balanced'];
const mobilities: Mobility[] = ['minimal', 'some'];
const dayCounts: DayCount[] = [3, 4, 5];

/** Strictly validate imported URLs/local storage. Never trust stored JSON. */
export function sanitizePreferences(raw: unknown): Preferences {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PREFERENCES, interests: [...DEFAULT_PREFERENCES.interests] };
  const value = raw as Record<string, unknown>;
  const chosenInterests: unknown[] | null = Array.isArray(value.interests) ? value.interests : null;
  return {
    destination: 'singapore',
    days: dayCounts.includes(value.days as DayCount) ? (value.days as DayCount) : DEFAULT_PREFERENCES.days,
    group: groups.includes(value.group as Group) ? (value.group as Group) : DEFAULT_PREFERENCES.group,
    pace: paces.includes(value.pace as Pace) ? (value.pace as Pace) : DEFAULT_PREFERENCES.pace,
    mobility: mobilities.includes(value.mobility as Mobility) ? (value.mobility as Mobility) : DEFAULT_PREFERENCES.mobility,
    interests: chosenInterests
      ? interests.filter(item => chosenInterests.includes(item))
      : [...DEFAULT_PREFERENCES.interests]
  };
}

export function makeItinerary(prefs: Preferences): ItineraryDay[] {
  const required = prefs.days - 2;
  const rank = (day: ItineraryDay): number => {
    const preferenceMatches = day.tags.filter(tag => prefs.interests.includes(tag)).length;
    const generalistBonus = day.key === 'gardens' ? 0.3 : 0;
    const comfortBonus = prefs.mobility === 'minimal' && day.key === 'gardens' ? 0.3 : 0;
    return preferenceMatches * 10 + generalistBonus + comfortBonus;
  };
  const selected = DAYS.map((item, index) => ({ item, index, score: rank(item) }))
    .sort((a, b) => (b.score - a.score) || (a.index - b.index))
    .slice(0, required)
    .sort((a, b) => a.index - b.index)
    .map(entry => entry.item);
  return [ARRIVAL, ...selected, DEPARTURE].map(day => {
    const quiet = prefs.pace === 'relaxed' || prefs.mobility === 'minimal';
    const visits = quiet ? day.visits : day.visits.map(visit => ({ ...visit }));
    return { ...day, visits };
  });
}

export function encodeShare(prefs: Preferences): string {
  const safe = sanitizePreferences(prefs);
  return btoa(JSON.stringify(safe));
}

export function decodeShare(encoded: string | null): Preferences | null {
  if (!encoded || encoded.length > 700 || !/^[a-zA-Z0-9+/=]+$/.test(encoded)) return null;
  try {
    const decoded: unknown = JSON.parse(atob(encoded));
    if (!decoded || typeof decoded !== 'object' || (decoded as Record<string, unknown>).destination !== 'singapore') return null;
    return sanitizePreferences(decoded);
  } catch {
    return null;
  }
}

export function validChecks(input: unknown): string[] {
  const ids = new Set(['passport', 'visa', 'flights', 'hotel', 'insurance', 'contact', 'arrivalcard', 'comfortable']);
  return Array.isArray(input) ? [...new Set(input.filter((id): id is string => typeof id === 'string' && ids.has(id)))] : [];
}

export function toSafeInt(value: number, min = 0, max = 1000): number {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.trunc(value)));
}
