# AeroGo My Trip — Phase 2 owner guide

## Local fictional demo

The local Vite server uses a memory-only trip store when no database URL is present.

```text
npm install
npm run dev
```

Open `http://127.0.0.1:5173/trip/demo` and use PIN `2468`. This record is fictional and is not production security. The memory store disappears when the server restarts.

## Production setup

Phase 2 uses Vercel Functions plus a private Postgres database. Create a Neon database through the Vercel Marketplace or Neon, then configure these server-only variables in Vercel and in the local shell used for owner commands:

```text
TRIP_DATABASE_DATABASE_URL=your-pooled-postgres-connection-string
TRIP_DATABASE_DATABASE_URL_UNPOOLED=your-direct-postgres-connection-string
TRIP_ACCESS_HASH_SALT=a-long-random-secret
TRIP_BASE_URL=https://your-preview.vercel.app
```

Never prefix these variables with `VITE_`, commit them, or put them in a trip JSON file. Initialize the tables once:

```text
npm run trips -- init
```

The runtime uses `TRIP_DATABASE_DATABASE_URL` for pooled queries. Schema initialization uses `TRIP_DATABASE_DATABASE_URL_UNPOOLED` so migrations use the direct connection. The production API fails closed when the pooled database variable or `TRIP_ACCESS_HASH_SALT` is missing. No real trip record is bundled into the frontend.

The standalone owner CLI reads `process.env` directly; it does not automatically load `.env.local` or another dotenv file. For a Preview-only owner session, fill the ignored `.env.preview.local` file with values copied privately from the intended Neon branch, then load it only in the current terminal:

```text
set -a
source .env.preview.local
set +a
```

Before filling that file, select Neon branch `preview/codex/aerogo-my-trip-phase-2`, database `neondb`, and use that branch's Connect dialog to obtain the pooled and direct connection strings. Put them under the AeroGo-specific variable names above. Do not use a connection string from the Neon `main` branch or from Vercel Production.

`TRIP_ACCESS_HASH_SALT` is required by the deployed Preview API for rate-limit hashing, but the owner CLI's create/update/stage/rotate/revoke commands do not read it. Keep the Preview value in the local file if you also run the API locally against the same database, so rate-limit scopes remain consistent. `TRIP_BASE_URL` only controls the link printed by the owner CLI; it is not required by the API.

## Create a client trip

1. Copy `private-trips/template.json` to a new local file such as `private-trips/ana-hong-kong.json`.
2. Replace the fictional values with the approved ordinary travel content. Do not add passport scans, IDs, payment credentials, or other sensitive documents.
3. Run:

```text
npm run trips -- create private-trips/ana-hong-kong.json
```

The prepared fictional Preview test record is `private-trips/preview-test-hong-kong.json`. It is ignored by Git, contains no password, and sets `isDemo` to `false`.

The command stores only a SHA-256 trip-token hash and a scrypt password hash. It prints the private URL and generated password once; send them through the agency’s approved channel and do not save the terminal output in Git.

## Update the trip

Edit the ignored local JSON file and run:

```text
npm run trips -- update <trip-token> private-trips/ana-hong-kong.json
```

Proposal edits do not replace the accepted quotation snapshot stored on the server. Use a new quote revision for new proposal terms.

Change the stage without changing the customer’s URL or password:

```text
npm run trips -- stage <trip-token> proposal
npm run trips -- stage <trip-token> booking
npm run trips -- stage <trip-token> companion
npm run trips -- stage <trip-token> completed
```

## Recover or disable access

After verifying the customer through an appropriate agency channel:

```text
npm run trips -- rotate <trip-token>
npm run trips -- revoke <trip-token>
npm run trips -- expire <trip-token> 2027-01-15T00:00:00+08:00
npm run trips -- archive <trip-token>
```

Rotation, revocation, and archiving invalidate existing sessions. Expired, revoked, and archived trips return a generic unavailable state without revealing whether a token exists.

## Deployment

Commit only source, the template, and configuration names. Keep `.env.local`, client JSON files, database URLs, and command output out of Git. Deploy the branch to a Vercel preview first, verify the complete unlock → stage update → revoke journey, then request approval before promoting it to production.
