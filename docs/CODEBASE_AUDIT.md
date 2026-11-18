# Codebase audit and validation report

**Audit date:** 2026-11-18  
**Scope:** static inspection of the project source and documentation, dependency installation, frontend build/assets, backend architecture check, syntax checks, and Mongo connectivity prerequisites. This report distinguishes verified findings from unverified provider/database paths.

## Findings

### Fixed in this audit

1. **Architecture check incorrectly counted routes.** `verify-architecture.cjs` seeded its count with the health route but only counted route-module declarations, while its expected count came from the persisted contract report. It reported `1 !== 53` even though the 53 method/path combinations are declared across `routes/` plus `/api/health`. It now counts the API health route plus router declarations using platform-independent path detection. The final `npm run test:architecture` passes with 53 routes, 12 collection models, 63 import-clean acyclic modules, and independently packaged frontend/backend.
2. **Admin bootstrap was not idempotent.** `tools/create-admin.cjs` errored for an already-existing admin unless a reset flag was supplied. It now exits successfully without altering an existing admin's credentials or sessions, and creates one only if absent. The existing unique email index protects concurrent duplicate inserts. A same-email non-admin still fails safely.
3. **Tracked environment example exposed a MongoDB credential.** Replaced the URI/user/password values in `backend/.env.example` with an empty `MONGODB_URI` placeholder. Rotate the exposed Atlas database password immediately; removing it from the current file does not erase prior Git history or copies.
4. Updated the README's admin-bootstrap instructions to match the idempotent behavior.

### Remaining blockers / failed validation

1. **MongoDB host unreachable from this environment.** DNS lookup for `cluster0.wj7jj0q.mongodb.net` failed (`Name resolution ... failed`). No local `backend/.env` exists, and earlier local MongoDB helper execution was stopped while downloading its ~595 MB server binary. Therefore database ping/index initialization, admin insert/existing-admin behavior, API integration tests, and a persistent backend server could not be verified here.
2. **Admin credentials are not present in the current process environment.** `ADMIN_EMAIL` and `ADMIN_PASSWORD` must be supplied privately to execute the bootstrap and admin API acceptance tests; do not add them to tracked files.
3. **Dependency audit reports 3 high-severity vulnerable production dependency families:** Nodemailer, Sharp, and Zod. `npm audit fix --force` proposes breaking major upgrades (Nodemailer 10, Sharp 0.35, Zod 4), so no blind upgrade was applied. Assess compatibility and update/test each deliberately.
4. **Earlier API-contract test invocation could not proceed** because the required admin environment variables were missing. Once MongoDB is reachable and QA credentials are supplied, run the documented backend and frontend integration suites on a disposable QA database.

## Verification performed

- `npm ci` completed for backend and frontend previously; install logs warned that install scripts for `sharp` and `mongodb-memory-server` were not approved in that run.
- Frontend `npm run build` passed: Next.js compiled, lint/type checking passed, and all 15 static pages generated.
- `npm run lint:assets` passed (13 mapped images).
- `node --check server.js` passed before the final edits; `node --check tools/create-admin.cjs` passed after script edits.
- `npm run test:architecture` passes: 53 method/path routes, 12 collection models, and 63 import-clean acyclic modules.
- `npm audit --omit=dev --audit-level=critical` was invoked; it reported the 3 high-severity dependency families above and no critical finding.

## Feature boundaries (not treated as broken code)

- Payment mode defaults to **demo**; it does not move real funds. Live Razorpay payment/webhook verification needs owner credentials and webhook configuration.
- Email and WhatsApp notification delivery require provider credentials; otherwise notifications are retained as demo outbox records.
- Production image uploads require Cloudflare R2; unconfigured production uploads intentionally fail closed with HTTP 503. Local development uploads use backend storage.
- The vehicle finder only reports staff-entered explicit fitment data; it does not infer compatibility.
- A fresh database without opt-in demo seeding has empty catalogue and brand results by design.
- Transactional request/stock/payment flows require a MongoDB replica set.

## Audit coverage and remaining work

This audit is not evidence that every component has passed end-to-end execution. Static review covered backend route registration and service boundaries, existing test scripts, environment/configuration handling, and the migration inventory. Required remaining work to finish dynamic validation:

1. Confirm the Atlas URI is valid, rotate any previously exposed credential, and make the host resolvable/reachable from the machine; provide the URI privately in ignored `backend/.env`.
2. Set `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` (12–72 UTF-8 bytes) privately in the shell.
3. Run `npm run admin:create` twice against a disposable QA replica set; verify first invocation creates an admin, second leaves the stored password/session values unchanged, and login succeeds.
4. Start `npm run dev`; verify `/api/health` reports `ok:true` and `database:connected`.
5. With a disposable database and both services running, run `test:architecture`, `test:api`, `test:contracts`, `test:middleware`, frontend browser/admin/visual suites, asset lint, and production build as documented in `README.md`.
6. Review and schedule compatible security updates for Nodemailer, Sharp, and Zod; re-run all suites after each update.

No further application feature gaps can be exhaustively declared without those dynamic acceptance runs and the owner's actual external provider configuration.
