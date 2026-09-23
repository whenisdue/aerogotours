const HTTP_PROTOCOLS = new Set(["http:", "https:"]);
const CONTACT_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function parseUrl(value: unknown, allowedProtocols: Set<string>, allowRelative = false): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return allowRelative ? trimmed : undefined;
  try {
    const url = new URL(trimmed);
    if (!allowedProtocols.has(url.protocol)) return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

export function safeExternalUrl(value: unknown): string | undefined {
  return parseUrl(value, HTTP_PROTOCOLS);
}

export function safeContactUrl(value: unknown): string | undefined {
  return parseUrl(value, CONTACT_PROTOCOLS, true);
}

export function safeTelephoneUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!/^[+0-9][+0-9().\s-]{6,24}$/.test(trimmed)) return undefined;
  const normalized = trimmed.replace(/[().\s-]/g, "");
  return `tel:${normalized}`;
}
