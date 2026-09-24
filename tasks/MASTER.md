# AeroGo Dream Trip — sequential development controller

## Mission and boundaries
Build four **genuine, destination-specific** Dream Trip experiences in this exact order, using the existing AeroGo codebase and shared Dream Trip architecture:

1. `01-bali.txt`
2. `02-singapore.txt`
3. `03-vietnam.txt`
4. `04-malaysia.txt`

Execute **one task at a time**. After each, run its full quality gate, log results in `PROGRESS.md`, and proceed to the next file **only if the gate passes**. Do not claim that a task is complete merely because code was written. Work may pause for access, tool limits, or a decision; record a resumable checkpoint rather than claiming uninterrupted execution.

Project directory requested by the user: `/Users/esguerra/Desktop/aerogotours` on the user's Mac. These instruction files live in that project's `tasks/` directory after the user copies them there. **First confirm you can actually read and edit that local project and run commands in its terminal.** If you only have access to a different cloud workspace, copied snapshot, or GitHub browser, STOP and ask for an explicit supported project-access workflow. Do not claim Mac files were edited if they were not. Do not use an API or a separate Codex session unless the user expressly authorizes it. The existing repository is private; never publish it or its contents.

## Hard stop / safety rules
- Do **not** deploy, commit, push, open a PR, alter Git remotes, or run `vercel --prod`. The user must review and approve Git ACP later. Do not trigger production changes indirectly.
- Do **not** modify the private `/companion`, inquiry API/Resend handling, authentication, Supabase, DNS, Vercel config/environment variables, secrets, or `.env*` values. Do not expose keys in output or logs.
- Do **not** use paid AI APIs, booking engines, web scrapers that violate site terms, or new paid services. Install a dependency only when truly necessary, and explain it.
- Do not run `git reset`, `git clean`, stash/pop, destructive migrations, `git checkout --`, or discard any pre-existing edits. Do not silently overwrite other work.
- Preserve the approved homepage hero layout, dimensions, rail behavior, destination order, and mobile/desktop styling. Only minimum card link/badge/availability updates and necessary shared Dream Trip UI changes are allowed.
- Do not fabricate bookings, hotel availability, departure-city assumptions, precise costs, timetables, visa eligibility, customer reviews, or claims that suggested experiences are confirmed. Always label itineraries **illustrative**. Do not pretend a sample profile was chosen by the visitor.
- No invented sources. If official place/transport information cannot be verified sufficiently for a coherent itinerary, mark the task BLOCKED in `PROGRESS.md` and stop; do not invent geography or logistics to finish the batch.
- If significant unforeseen structural refactoring, scope ambiguity, unresolved baseline failure, security issue, or a decision affecting other product areas arises, STOP and report options to the user.

## Startup: establish actual repository state
1. Read this file, `PROGRESS.md`, and the destination task files; check their presence and readable contents.
2. From the actual AeroGo project root, run `pwd`, `git status --short --branch`, `git remote -v` (do not expose credentials), and inspect the relevant source tree. The latest previously reported deployed commit was `f2391fc`, but **do not assume that is the present HEAD or that Hong Kong was implemented**. Inspect `git log -1 --oneline` and code/tests to determine the real state. Existing changes may already be in progress.
3. Inspect `src/App.tsx`, `src/pages/Homepage.tsx`, `src/pages/DestinationPage.tsx`, `src/pages/DreamTripPage.tsx`, `src/data/destinations.ts`, `src/data/dreamTrips.ts`, `src/utils/dreamTripEngine.ts`, `src/App.css`, relevant tests and inquiry prefill contract, and existing source documentation. Adapt to actual file names and architecture.
4. Record the baseline HEAD, pre-existing modified/untracked paths, currently implemented Dream Trip routes, relevant existing tests, and known issues in `PROGRESS.md`. Do not rewrite existing statuses without evidence. If a task appears fully implemented already, **verify** its functionality and gate instead of duplicating it.
5. Run baseline `npm test`, `npm run lint`, `npm run build`, and `git diff --check`. If baseline fails, diagnose; fix only clearly in-scope pre-existing issues if safe, otherwise mark BLOCKED and stop. Do not confuse existing failures with your changes.
6. Work sequentially; do not launch parallel coding agents or parallel edits against the same files.

## Common acceptance criteria for EACH destination
- Clicking its **one existing homepage destination card** opens `/dream/<slug>` directly to a complete **default illustrative 7D6N itinerary**, on click, refresh and direct URL. No intro gate, questionnaire, email, login, or paid action before seeing the journey.
- Preserve the destination's original `/destinations/<slug>` inspiration URL and provide a working reciprocal inspiration link from its Dream Trip. Other existing routes, including non-Asian legacy URLs, must continue to resolve.
- Reuse the shared Dream Trip page, engine, questionnaire, day-card design, Help Me Decide, quick-duration selector, and inquiry handoff. Do **not** copy an entire page or create a country-name-substitution template. Extend destination-specific structured content sensibly.
- Support 3D2N / 4D3N / 5D4N / 7D6N / 10D9N. Each has exactly its selected calendar days, consecutive day numbers, nights = days - 1, an arrival-aware first day, departure-aware final day, and duration-appropriate geographic scope. 10 days must not be padded with generic or repetitive filler; longer stays may include meaningful free or optional days.
- Interest, group and pace variations must produce **materially** different, region-appropriate content, not just a new heading; relaxed pace has fewer scheduled activities. Keep all profile fields synchronized when changing duration, questionnaire answers or Help Me Decide controls.
- Each day has a prominent DAY 01 label, real named place(s) when verifiable, coherent geographic sequence, honest transport/transition note where relevant, a specific experience rather than brochure clichés, useful pacing and appropriate image. Avoid images of the wrong city or country and repeated identical stock images. Optimize hero image and lazy-load below-fold images.
- Explain plausible **areas to stay**, never booked hotels; optional named hotel only if existence/location is verified and phrased as an option. No fabricated rates, operating hours, flight/rail departures, reservations or attractions access.
- Help Me Decide: destination-specific transparent budget **categories, not unverified live amounts**; traveler/group suitability with limitations; shorter-trip regeneration; slower-pace regeneration. Do not make passport/visa promises.
- Inquiry CTA transfers the correct destination, selected duration, explicit traveler selections when actually made, interest/pace when selected, and a coherent itinerary summary into the **existing** form. The visitor reviews and submits manually. No leaked details from another destination; no visitor personal details in the URL; preserve Resend delivery and spam protections.
- Badge/availability labels and featured card route reflect only destinations actually implemented and tested. Do not label the remaining inspiration-only destinations as Dream Trips.
- Document source URLs and actual access/check date for material place/transport facts in `tasks/PROGRESS.md` or existing project documentation; distinguish verified facts, design choices, and unresolved details. Prefer official tourism boards, official attraction sites, official transit operators; cross-check when needed. Avoid copying source prose. If sources cannot be accessed, stop on essential unverified logistics rather than presenting confident specifics.

## Gate after EACH task — do not skip
A. Run `npm test`, `npm run lint`, `npm run build`, `git diff --check`. Record actual exit status and test counts. Tests must cover five durations, sequential days, distinct routes/interests/pace, no cross-destination contamination, correct card routing/availability labels, correct inquiry handoff, and all prior destinations' regressions.
B. Check route behavior for `/`, the new `/dream/<slug>`, corresponding inspiration route, all prior `/dream/*`, `/companion`, and existing other destination routes. **An HTTP 200 from Vite SPA fallback alone does not prove a React route renders**; verify actual rendered route/DOM if browser available, or state this limitation.
C. If browser available, inspect real desktop (~1440x900, 1440x768) and mobile (390px, 360px) interaction, card navigation, duration change, questionnaire, inquiry handoff and no horizontal overflow. Do not claim screenshots or visual checks without actually doing them. If browser unavailable, report that limitation (automated tests still required).
D. Audit `git status --short`, `git diff --stat`, and changed-file list against the baseline; check forbidden files untouched. Check source documentation and no secret leakage.
E. Evaluate quality of 3D2N vs 7D6N vs 10D9N itineraries manually: no teleportation, overpacked travel day, unrelated region, unsupported specificity, or generic filler.
F. Write a checkpoint into `PROGRESS.md`: status = PASS or BLOCKED; files changed; routes; route-by-duration summary; evidence/sources with checked date; commands with real results; any limitation; next task. If BLOCKED, STOP and report exactly what is needed. If PASS, proceed to the next task in this order without asking for routine permission.

## Completion and handoff
After all four PASS: run the full test/lint/build/diff gate AGAIN; inspect cumulative changes and verify no forbidden files changed. Produce a succinct final report with destination-by-destination routes, research citations/source list, tests, file changes, remaining risks, and `git status`. **No automatic commit, push or deployment.** User will review on localhost first and run Git ACP explicitly later.

If session/context limits prevent finishing, stop safely after the latest complete gate, update `PROGRESS.md`, and tell the user the exact next file/status. Resume by reading `MASTER.md` and `PROGRESS.md` first; do not repeat work blindly.
