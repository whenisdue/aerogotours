import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { handleTripApi, type TripApiRequest } from './server/tripApi.ts'

function localTripApi(): Plugin {
  return {
    name: 'aerogo-local-trip-api',
    configureServer(server) {
      // Local Vite runs are memory-only by default so the fictional demo cannot
      // accidentally read from or write to a Preview/production database.
      // Set TRIP_DEV_MEMORY_STORE=0 when intentionally testing local Neon access.
      if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') process.env.TRIP_DEV_MEMORY_STORE ??= '1';

      server.middlewares.use('/api/trips', (req, res, next) => {
        const requestUrl = req.url ?? '';
        if (!requestUrl.startsWith('/')) return next();

        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', async () => {
          try {
            const rawBody = Buffer.concat(chunks).toString('utf8');
            let body: unknown;
            if (rawBody) {
              try {
                body = JSON.parse(rawBody);
              } catch {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ ok: false, error: 'Please send valid JSON.' }));
                return;
              }
            }
            const request: TripApiRequest = { method: req.method, headers: req.headers, body };
            const result = await handleTripApi(`/api/trips${requestUrl}`, request);
            for (const [name, value] of Object.entries(result.headers) as Array<[string, string | string[]]>) res.setHeader(name, value);
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result.body));
          } catch (error) {
            server.config.logger.error(`Local trip API failed: ${error instanceof Error ? error.message : 'unknown error'}`);
            res.statusCode = 503;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: false, error: 'The private trip service is not configured.' }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [localTripApi(), react()],
})
