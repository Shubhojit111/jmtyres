# Project Completion Todo Register

**Prepared:** 2026-11-18  
**Scope:** Findings currently established by static review and prior validation. This is an actionable register, not a claim that every feature has been exhaustively exercised. Unknown dates and owners are marked TBD rather than assumed.

## Priority and effort guide

- **P0 — Blocking:** required before reliable QA/admin validation or release.
- **P1 — High:** required before production launch when the related integration is in scope.
- **P2 — Medium:** product/deployment decision or follow-up validation.
- **S / M / L:** small (up to one day), medium (roughly 2–5 working days), large (more than 5 working days); estimates are approximate.
- **Assignee:** Project owner for access, credentials, and product decisions; Backend / Frontend developer for implementation; QA for acceptance validation. Assign named people and dates during planning.
- **Due dates:** TBD; no deadlines were provided.

## 1. Identified bugs, defects, and risks

| ID | Priority / severity | Finding and detail | Reproduction / evidence | Assignee | Effort | Due | Verification / done criteria |
|---|---|---|---|---|---|---|---|
| BUG-01 | P0 / High security risk | A MongoDB credential was present in tracked `backend/.env.example`. It was redacted, but removing it from the working tree does not remove it from Git history or copies. | Inspect repository history and prior distributed copies for the old value. Do not reproduce by printing or sharing the secret. | Project owner / DevOps | S | TBD | Rotate/revoke the exposed credential; confirm replacement works via private configuration; verify no live secret is in tracked files and decide whether history cleanup is required. |
| BUG-02 | P1 / High security | Dependency audit reported high-severity advisories in production dependency families Nodemailer, Sharp, and Zod. Breaking major upgrades were proposed, so no automatic force-upgrade was applied. | From backend, run `npm audit --omit=dev`; review advisories and affected locked versions. | Backend developer | M–L | TBD | Apply compatible patched versions or document a risk-approved exception; run backend tests, frontend build, and audit with no unresolved high/critical advisories (or an explicit approved exception). |
| BUG-03 | P2 / Medium validation risk | Earlier clean-install output warned that install scripts for Sharp and `mongodb-memory-server` were not approved. Impact on image processing and DB tests is not yet established. | Perform a clean dependency install in the intended CI/developer environment and run image processing plus memory-server tests. | Backend developer / DevOps | S | TBD | Required package setup completes reproducibly; image and test workflows pass in clean CI without unreviewed install-script warnings. |
| BUG-04 | P2 / Unconfirmed behavior risk | Static review raised possible live-payment failure/retry and admin-cancellation edge cases; no defect has been demonstrated, so treat as unverified rather than confirmed broken behavior. | In provider sandbox and disposable replica-set QA, create a payment, fail it, retry, and separately cancel through admin; inspect request/payment/stock states. | Backend developer + Project owner | M | TBD | Each state transition is consistent and covered by regression tests; fix any confirmed state inconsistency before closing. |

## 2. Missing features, functionality gaps, and incomplete requirements

These entries may be intentional product boundaries rather than defects. Confirm scope with the product owner before implementation.

| ID | Priority | Gap / current behavior | Assignee | Effort | Due | Verification / done criteria |
|---|---|---|---|---|---|---|
| GAP-01 | P0 | Current local DB is connected in standalone mode. Admin CRUD and transactional workflows need isolated authenticated acceptance testing; standalone MongoDB cannot make multi-document operations atomic. | Project owner / DevOps + Backend developer | M | TBD | Use a disposable replica-set QA database, create a temporary QA admin, pass admin/API suites, then remove all QA data. |
| GAP-02 | P1, if live payments are launch scope | Payment mode defaults to demo and does not transfer real funds. Live Razorpay credentials, webhook configuration, and sandbox/production acceptance testing are not in place/verified. | Project owner + Backend developer | M–L | TBD | Confirm live payments are required; if yes, configure credentials privately and pass create/verify/webhook/failure/retry/reconciliation QA; otherwise document demo-only launch scope. |
| GAP-03 | P1, if email is launch scope | Email delivery needs SMTP and owner email credentials. WhatsApp is a client-side redirect with a draft only; the server sends no WhatsApp messages. | Project owner + Backend developer | M | TBD | Configure and test SMTP if required; test `wa.me` links open with the intended draft; no WhatsApp API credentials are needed. |
| GAP-04 | P1, for production image uploads | Production image uploads require Cloudflare R2; missing configuration intentionally fails closed with HTTP 503. | Project owner / DevOps + Backend developer | M | TBD | Configure R2 privately; verify upload, retrieval, and deletion in production-like QA; verify fail-closed behavior without credentials. |
| GAP-05 | P2 / Product decision | Vehicle finder reports staff-entered explicit fitment only; it does not infer compatibility. | Product owner | M–L if inference needed | TBD | Decide whether inference is a requirement. If yes, specify authoritative data source/rules and acceptance cases; otherwise record explicit-fitment limitation as accepted. |
| GAP-06 | P2 / Setup requirement | Fresh databases have empty catalogue/brand results unless demo seed or an import is run; this is by design but the production onboarding path needs confirmation. | Project owner / Product owner | S–M | TBD | Define and test the production catalogue import/seed procedure on a fresh disposable database; ensure demo fixtures cannot accidentally enter production. |

## 3. Pending tasks, actions, and deliverables

| ID | Priority | Action / deliverable | Assignee | Effort | Due | Verification / done criteria |
|---|---|---|---|---|---|---|
| TASK-01 | P0 | Supply a valid private replica-set URI through ignored `backend/.env`; confirm DNS/network access and database permissions. Never put credentials in tracked files or chat. | Project owner / DevOps | S | TBD | Connection and index initialization succeed; logs and tracked files contain no secret values. |
| TASK-02 | P0 | Rotate the previously exposed Mongo credential and assess repository-history cleanup/distributed copies. | Project owner / DevOps | S | TBD | Old credential is revoked; new one is least-privilege and privately configured; exposure remediation decision is recorded. |
| TASK-03 | P0 | Set QA `ADMIN_EMAIL` and a unique `ADMIN_PASSWORD` privately; run `npm run admin:create` twice against a disposable QA replica set. | Project owner + Backend developer | S | TBD | First run inserts the admin; second run is a no-op and does not modify stored password/session data; same-email non-admin fails safely; login works. |
| TASK-04 | P0 | Start the backend and verify DB health. | Backend developer | S | TBD | `npm run dev` remains running; `GET /api/health` returns `ok: true` and `database: connected`; no startup errors. |
| TASK-05 | P1 | Run backend API, contracts, and middleware suites against QA services and disposable data. | Backend developer + QA | M | TBD | `test:api`, `test:contracts`, and `test:middleware` pass; failures have reproducible cases and tracked fixes. |
| TASK-06 | P1 | Run frontend browser/admin/visual acceptance tests against the QA backend. | Frontend developer + QA | M | TBD | Core customer flows and admin-panel access/actions pass in supported browsers; visual regressions are triaged and resolved/accepted. |
| TASK-07 | P1 | Review and remediate Nodemailer, Sharp, and Zod advisories without blind breaking upgrades. | Backend developer | M–L | TBD | Chosen versions are compatible; required tests/build pass; audit is clean or exceptions are formally accepted. |
| TASK-08 | P1 | Complete sandbox acceptance for any launch-required external integrations (payments, notifications, R2). | Project owner + Backend developer / DevOps | M–L | TBD | Each enabled integration passes its documented success/failure scenarios; secrets are only in private environment configuration. |
| TASK-09 | P2 | Decide whether fitment inference and any other product capability beyond explicitly entered fitment are in scope. | Product owner | S for decision; M–L implementation | TBD | Decision and acceptance criteria are recorded; implement only if required, then tests cover representative compatible/incompatible cases. |
| TASK-10 | P2 | Define and validate fresh-database catalogue onboarding/import. | Product owner + Backend developer | S–M | TBD | A clean QA database can be populated through the approved documented workflow; production/demo data are separated. |
| TASK-11 | P2 | Re-run final builds, asset lint, architecture check, and complete regression suites after fixes/upgrades; update the audit report. | QA + Backend / Frontend developers | M | TBD | Architecture check remains at 53 routes/12 models/63 acyclic modules; frontend build and asset lint pass; audit reflects verified results and remaining exceptions. |

## Current verified status

- Architecture check passes: 53 method/path routes, 12 collection models, and 63 import-clean acyclic modules.
- Earlier frontend production build and asset lint passed.
- Syntax checks passed for `server.js` and `tools/create-admin.cjs` during the latest validation run.
- Mongo connection, backend server startup, admin creation/login, and full integration tests are **not verified** because the required private DB configuration/host reachability and admin credentials were unavailable.

## Completion rule

Close each item only when its verification criteria are met and evidence (test output, configuration check without secret disclosure, or owner-approved scope decision) is recorded. Reclassify unconfirmed risks as confirmed defects only after reproducing them. Add any additional issues discovered by runtime testing to the appropriate category with owner, priority, effort, due date, and acceptance criteria.
