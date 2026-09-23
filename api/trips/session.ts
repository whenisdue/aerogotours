import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleTripApi } from "../../server/tripApi.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const result = await handleTripApi("/api/trips/session", { method: req.method, headers: req.headers, body: req.body });
  for (const [name, value] of Object.entries(result.headers) as Array<[string, string | string[]]>) res.setHeader(name, value);
  return res.status(result.status).json(result.body);
}
