# J.M. Tyres — separate Next.js frontend + Express/MongoDB backend

This folder contains **two independently runnable applications**, not a Next.js API embedded in the frontend:

```text
JM TYRES FULLSTACK/
├── client/               Next.js 14 / React site and owner console
│   ├── app/                Public pages, account, purchase forms, admin UI
│   ├── components/ assets/ public/
│   ├── lib/backend.js      Server-rendered pages fetch the Express API
│   ├── next.config.js      Same-origin /api/* and /uploads/* reverse proxies
│   ├── package.json
│   └── .env.example
├── server/                Standalone Node.js 20 / Express API
│   ├── app.js              Express middleware, static uploads and route mounting
│   ├── server.js           Environment, MongoDB startup and graceful shutdown
│   ├── config/             MongoDB, environment, email, Razorpay and R2
│   ├── models/             One native-Mongo model/repository per existing collection
│   ├── routes/             Thin feature routes (53 preserved method/path contracts)
│   ├── controllers/        Request processing and response envelopes
│   ├── services/           Auth, catalogue, commerce, payments, uploads and outbox
│   ├── middleware/         Cookies/roles, origin, rate limit, body and error handling
│   ├── utils/              Token/cookie, validation, URLs and HTTP helpers
│   ├── tools/ tests/ public/uploads/
│   ├── package.json
│   └── .env.example
└── docs/                   Pre-migration audit, contract evidence and final report
```

**Connection:** Browser → `http://localhost:3000/api/...` → Next.js reverse proxy → `http://127.0.0.1:4000/api/...` → Express → MongoDB. Server-rendered Next.js pages call the same backend with `BACKEND_URL`. The browser never needs the private backend URL and session cookies remain on the frontend origin. Local `/uploads/...` paths proxy to Express; `/demo/...` and site images are served by Next.js. **No database driver, authentication logic, API route, payment logic, or Express code runs inside the frontend.**

The modular backend retains the existing **native MongoDB driver and Zod validation**. Its 12 per-collection model/repository files preserve the BSON document shapes and all 39 observed indexes; no Mongoose schema conversion or database migration is needed. See [`docs/MIGRATION_AUDIT.md`](docs/MIGRATION_AUDIT.md) for the complete original feature/API/data map and [`docs/MIGRATION_REPORT.md`](docs/MIGRATION_REPORT.md) for the verified changes.

## Run locally (Node.js 20+)

A **MongoDB replica set** is required for atomic stock reservations and payment transactions. You can use MongoDB Atlas or a locally configured replica set. A standalone MongoDB Compass connection is supported for local browsing and basic demo use, but multi-document order/payment changes cannot be atomic there; use the included local replica set for workflow and concurrency testing. An optional development-only `mongodb-memory-server` helper is included; it may download a MongoDB binary on its first launch. Never use the helper as production/durable storage.

1. In a terminal, install the backend and configure it:

   ```bash
   cd "JM TYRES FULLSTACK/server"
   npm ci
   cp .env.example .env
   ```

   In `server/.env`, set `MONGODB_URI` to your replica set. Generate a strong `AUTH_SECRET` with `node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"` and paste it in. For local development the example defaults to port **4000**, demo payments, `FRONTEND_ORIGIN=http://localhost:3000` and `TRUSTED_ORIGINS=http://127.0.0.1:3000`.

2. If you **do not already have MongoDB**, in a *separate* terminal from `server/` run:

   ```bash
   npm run db:local
   ```

   Leave it running. Its default URI is `mongodb://127.0.0.1:27017/jmtyres?replicaSet=jmrs`. Downloaded binaries and local test data go into the excluded `server/.local/` directory. Use a managed replica set and backups for real deployment.

3. Create an owner account. Configure ADMIN_EMAIL and ADMIN_PASSWORD (12-72 UTF-8 bytes) in the ignored server/.env file, then run from server/:

   ```bash
   npm run admin:create
   ```

   This command creates the account only when that email is absent. If the account already exists as an admin, it leaves the password and sessions unchanged by default. To intentionally reset an existing admin password to the value in server/.env and revoke sessions/reset links, set ADMIN_RESET_PASSWORD=true for that command. Keep real credentials only in the ignored server/.env; never commit them.

4. Optionally load 16 **clearly labelled fictional DEMO examples** so you can try search, stock and checkout (they are not real shop inventory, prices, or verified fitment):

   ```bash
   npm run db:seed-demo
   ```

   The command is idempotent. Alternatively, sign in at `/admin` and use the demo-seed control. On a fresh database without seeding, catalogue/brand empty states are intentional; the owner can add actual products in the admin UI.

5. Start the backend from `server/`:

   ```bash
   npm run dev
   ```

   `http://localhost:4000/api/health` should return `"ok":true` with `"database":"connected"`. For a long-running production process use `NODE_ENV=production npm run start` after setting production secrets and services.

6. In another terminal, install and configure the **independent frontend**:

   ```bash
   cd "JM TYRES FULLSTACK/client"
   npm ci
   cp .env.example .env
   npm run dev
   ```

   Open **http://localhost:3000**. `client/.env.example` provides `BACKEND_URL=http://127.0.0.1:4000` and public call/WhatsApp settings. The two apps have their **own package files, dependency locks, environment files and start commands**; run both apps and MongoDB. Use `npm run build && npm run start` from `client/` to run a production Next.js build. Keep `BACKEND_URL` reachable from the Next.js server when building and starting it.

> If you use `http://127.0.0.1:3000` instead of `http://localhost:3000`, the example backend's `TRUSTED_ORIGINS` already includes it. For a hosted frontend preview or a custom domain, set `FRONTEND_ORIGIN` (and/or `TRUSTED_ORIGINS`, full origins separated by commas) on the backend to the **actual browser origin**. Production startup requires one of these configured. Do not rely on client-supplied `X-Forwarded-Host` headers. Rate limits now use the socket IP unless an actual trusted reverse proxy is explicitly listed in `TRUST_PROXY` (for example `loopback` for a local proxy, or your proxy's IP/CIDR); do not trust arbitrary forwarded headers. CORS is intentionally not opened because the frontend uses a same-origin proxy.

## What works / integration boundaries

- **Customer:** database-backed catalogue, category/brand/size filters, exact-size or explicitly saved vehicle fitment finder, accounts, purchase requests, order history, and payment after owner approval.
- **Owner:** role-protected console, products and stock, image uploads, enquiries, customers, content, audit trail, notification outbox, request approval/rejection/cancellation/completion and demo seed.
- **Payments:** default `PAYMENT_MODE=demo` simulates accept and verification; **no real funds move**. Live Razorpay requires real credentials, a webhook secret, owner email and working SMTP; verification is performed by the backend. Webhooks must reach the **backend** at `/api/payments/webhook` with their exact raw signed body (directly or through a proxy that preserves bytes). Do not present demo transactions as revenue.
- **Uploads:** JPEG/PNG/WebP files are validated and converted by the Express backend. Development uploads live in `server/public/uploads/products/`, then route through the frontend `/uploads/*` proxy. Production uploads require Cloudflare R2 configuration; without R2 the API returns **503** rather than pretending an upload worked. Back up persistent media before deploying.
- **Notifications:** email requires SMTP and an owner email; without them, attempts appear in the database-backed demo outbox. WhatsApp is a user-initiated `wa.me` redirect with a prefilled draft; the server never sends WhatsApp messages and needs no WhatsApp API account. `SITE_URL` must be the public HTTPS frontend URL in production so email/reset links work.
- **Site imagery and trademarks:** photos and product examples are labelled illustrative. Manufacturer logos are trademarks; confirm rights before commercial use. Configure actual stock, pricing, fitment, provider accounts and policies before offering real purchases.

## Verification (run against a disposable demo database)

With MongoDB and both apps running, set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your shell for QA, seed the DEMO fixtures, and run:

```bash
cd "JM TYRES FULLSTACK/server"
npm run test:architecture                             # 12 models, 53 routes, imports/cycles
npm run test:api                                      # Direct Express API on :4000
npm run test:contracts                                # 53 existing endpoint method/path checks
npm run test:middleware                               # 10 body/origin/auth/error checks
TEST_URL=http://127.0.0.1:3000 npm run test:api        # Same API through the Next.js proxy
cd ../client
npx playwright install chromium                        # Once per machine
npm run lint:assets
npm run test:browser
npm run test:admin-ui                                   # Development uploads or configured R2
npm run test:visual
npm run build
```

The browser tests accept `CHROME_PATH` if Chromium is already installed. Set your own QA `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the shell before `test:contracts` or `test:middleware`; the contract script can optionally compare two live installations using `BASELINE_URL` (do not target a production database). Tests create clearly labelled demo QA records and should not run against live customer data. The refactored backend passed **37 API assertions direct, 37 via the unchanged frontend proxy, 37 in standalone production mode; 53/53 method/path response comparisons against the pre-migration backend; 10 additional middleware boundary checks; 16 browser feature groups covering 53 route/viewport combinations; five owner CRUD/upload checks; seven visual/content checks; unchanged Mongo indexes, asset lint and a successful Next.js production build.** Real external provider transactions cannot be verified without the shop's own credentials.

### Deployment checklist

- Deploy `client/` and `server/` **as separate Node.js services**; build/run each from its own directory and set a private `BACKEND_URL` on the frontend. Expose the frontend over HTTPS. Restrict direct backend access appropriately; configure `FRONTEND_ORIGIN` to the public HTTPS URL and `SITE_URL` for outbound links.
- Give the backend a real, backed-up MongoDB Atlas/replica-set `MONGODB_URI`, a unique `AUTH_SECRET` of at least 32 random bytes, and distinct admin credentials. Protect `.env`, limit database network access, and do not ship local demo test data as actual stock.
- For live payments, email, and images, configure and validate Razorpay, SMTP, and R2 separately. WhatsApp remains click-to-open only. If the other services are not configured, retain **DEMO** labels and do not claim real payments, email delivery, or production uploads.
- Run health checks against the Express API `/api/health` and the frontend `/`. Test login, purchase approval, stock reservation, webhook verification and email links on your deployed domains before going live.
