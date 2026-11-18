# JM Tyres codebase audit

**Reviewed:** 19 November 2026

**Scope:** `client/` Next.js storefront/admin, `server/` Express API, local MongoDB, public browser flows and admin workflows.

## Executive status

The storefront and admin are implemented and the exercised flows pass on an isolated QA database. The review fixed homepage layering and page alignment, repaired broken/dead motion behavior, removed WhatsApp API sending, and checked catalogue/product creation through to public visibility. No remaining reproducible broken route or button was found in the flows exercised.

The system is not ready for live commerce without production setup: payment is simulated, email logs instead of sending, images use local development storage, MongoDB is standalone, and the real owner admin account and business data need setup.

## Status by area

| Area | Status | Evidence / follow-up |
|---|---|---|
| Public pages and navigation | Done for exercised pages | Browser suite checked 16 routes at desktop/mobile and seven at 320/768/1080 widths; HTTP page/API sweep and visual checks passed. |
| Admin login and sections | Done for exercised sections | Authenticated temporary QA session; dashboard, products, requests, enquiries, customers, CMS, notification log and activity are implemented. API contracts cover these resources. |
| Product lifecycle | Done | Admin created/edited/archived a product, uploaded/removed an image; browser confirmed a new product appeared in public catalogue; product page and finder checked. |
| Requests and demo payment | Done in demo QA | Request, approval/reservation, stock guard, payment simulation, retry, offline balance, completion, cancellation and history passed acceptance checks. |
| WhatsApp | Done: redirect only | `wa.me` opens a prefilled customer draft. Server makes no WhatsApp API call; no Meta token, phone ID or template credentials are required. Customer must press Send in WhatsApp. |
| API routes/controllers | Done for registered contracts | Architecture audit found 53 method/path routes, 12 models and 63 import-clean acyclic modules; 53 API contract checks passed. |
| Security boundaries | Done for exercised checks | Auth/role guards, origin validation, JSON limits, reset token/session behavior and webhook fail-closed behavior passed middleware/API checks. |
| Production build | Pass | Next.js optimized production build completed in an isolated output directory after stopping the QA preview server; the normal app output was left undisturbed. |
| Live provider integrations | Pending configuration | Razorpay, SMTP and Cloudflare R2 were not tested with real credentials. |

## Changes made during review

- `client/components/sections/Hero.jsx`: fixed image, shade and content stacking; added image/copy fallback.
- `client/app/(others)/layout.js`, public page components and `client/app/globals.css`: consolidated content width/gutters; aligned covers and sections across desktop/mobile.
- `client/components/ui/MotionDirector.jsx`: apply heading motion and reveal state to already-visible items.
- `client/lib/backend.js`: added server-rendered fallback for CMS and brands when the API is unavailable.
- `client/next.config.js`: support a separate optional `NEXT_DIST_DIR` for isolated QA/build output.
- `server/services/notificationService.js`, `server/config/env.js`, `server/config/email.js`, `server/.env.example`: removed WhatsApp API delivery/configuration; report WhatsApp as redirect-only.
- `client/components/admin/Notifications.jsx`: clarify email logging and manual WhatsApp draft behavior.
- `server/tests/test-api.cjs`, `server/tools/verify-architecture.cjs`, `client/tools/test-admin-ui.cjs`: assert redirect-only WhatsApp, exercise product visibility and match current health shape.
- `README.md`, `.env.example` templates and `docs/PROJECT_TODO.md`: align setup instructions with actual folders, storage modes and provider requirements.

## Route and interaction coverage

Public pages exercised: `/`, `/catalogue`, `/tyres/[slug]`, `/find-tyres`, `/brands`, `/services`, `/services/[slug]`, `/gallery`, `/offers`, `/about`, `/contact`, `/login`, `/register`, `/account`, `/account/requests/[id]`, `/admin/login`, `/admin` and admin section URLs. Protected redirects and unknown product/request 404 behavior were also checked. Browser coverage exercised navigation, search/filter/sort/page controls, tyre finder, service tabs, product CTA, contact WhatsApp draft, customer registration/request/history, password reset and the admin approval/demonstration-payment flow.

API coverage exercised public catalogue/categories/brands/finder/CMS/health; auth/session/password reset; admin dashboard/settings/products/uploads/requests/enquiries/customers/content/notifications/activity; customer requests/history; payment demo and fail-closed webhook behavior. Acceptance results: 37 API checks, 53 route-contract checks, 16 browser feature groups and 53 route/viewport combinations passed. Architecture and middleware checks also passed (53 registered contracts; 9 middleware boundaries).

## Files and modules

| Module | Main files | State |
|---|---|---|
| Frontend routes | `client/app/**/page.js`, `client/app/**/layout.js` | Implemented and route-smoke-tested. |
| Storefront UI | `client/components/sections/`, `catalogue/`, `product/`, `account/`, `layout/`, `ui/` | Implemented; visual and interaction checks passed for tested flows. |
| Admin UI | `client/components/admin/AdminConsole.jsx`, `Dashboard.jsx`, `Products.jsx`, `Requests.jsx`, `Enquiries.jsx`, `Customers.jsx`, `Content.jsx`, `Notifications.jsx` | Implemented; product create/edit/upload/visibility and request workflow exercised. |
| Frontend API bridge | `client/lib/backend.js`, `client/next.config.js` | Implemented with API proxy and fallback handling. |
| API routes/controllers | `server/routes/**`, `server/controllers/**` | 53 registered method/path contracts; API suite passed. |
| Business logic | `server/services/**`, `server/models/**` | Implemented; 12 collection models; tested purchase/inventory/payment demo workflows. |
| Runtime/config | `server/server.js`, `server/config/**`, `server/middleware/**` | Standalone API is healthy; middleware checks passed. Production provider config remains. |
| Regression checks | `server/tests/**`, `server/tools/verify-architecture.cjs`, `client/tools/test-*.cjs` | Automated QA suites exercised. |
| Setup/audit docs | `README.md`, `client/.env.example`, `server/.env.example`, `docs/PROJECT_TODO.md`, this audit | Updated. |

## Production checklist: owner credentials and decisions

Provide these privately in deployment secrets/environment, never commit them or paste them into an audit:

1. **Database:** production `MONGODB_URI` and database name. Use a backed-up replica set/managed cluster; standalone MongoDB does not guarantee atomic multi-document workflows.
2. **Application security/domains:** a strong `AUTH_SECRET` (at least 32 random bytes), public `FRONTEND_ORIGIN` / trusted origins, `SITE_URL`, TLS, and trusted proxy configuration as applicable.
3. **Admin:** create the actual owner/admin account securely with the provided admin tool; do not deploy the temporary QA account. Set up a recovery process.
4. **Payments, only if accepting online payment:** Razorpay live key ID/secret, webhook secret and production webhook endpoint; test provider-side webhook configuration before switching from demo mode.
5. **Email, only if sending email:** SMTP host/port/TLS/user/password/from address and `OWNER_EMAIL`. Without these, messages are logged only.
6. **Images, for durable multi-instance hosting:** Cloudflare R2 endpoint, bucket, access key ID, secret and public base URL. Local disk uploads are development-only and not durable across ephemeral hosts.
7. **Business data:** correct WhatsApp/call number, shop address/hours, catalogue and vehicle-fitment information, policies, prices/tax/shipping, and final homepage content. WhatsApp is only a prefilled `wa.me` customer link and requires no API credentials.

## Known limitations and recommended next work

- Use a replica set for production concurrency and verify database backup/restore and operational monitoring.
- Run live Razorpay webhooks, SMTP delivery and R2 upload/read/delete checks after the owner configures their accounts.
- Complete a business owner review of inventory, prices, fitment compatibility, legal terms, tax/shipping and customer messages before launch.
- Add production hosting/deployment, error monitoring, backups, and an operational admin recovery procedure if these are not already supplied externally.

## QA data handling

Admin and workflow verification used fictional data in an isolated `jmtyres_codex_qa` database and a temporary test-only admin identity. The database has been dropped and the temporary identity removed with it. These values are not production credentials and must not be reused; uploaded test media were not part of the real catalogue.
