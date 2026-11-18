# Pre-migration audit and migration map

This document was prepared **before modifying implementation code** for the modular-backend migration. Baseline: the independently running Express backend in `backend/src/` and unchanged Next.js frontend in `frontend/`. The previous two-application ZIP is retained outside this project as a rollback source until the migrated project is verified.

## Actual application inventory

| Area | Current implementation | Persistent data / dependency | Frontend use |
|---|---|---|---|
| Public site | Next.js 14.2.35 App Router, React 18.3.1, 16 `page.js` files, 45 component files, locally served images/fonts | `frontend/app`, `components`, `assets`, `public`; React hooks for local state; no global context or Redux | Catalogue, finder, brands, services, enquiries, home content |
| Frontend/backend boundary | Next rewrites same-origin `/api/:path*` and `/uploads/:path*` to server-only `BACKEND_URL`; `frontend/lib/backend.js` fetches backend for SSR | `next.config.js`, `lib/backend.js` | SSR pages preserve product 404s, check sessions for admin/customer redirects, and request home content/brands |
| Accounts | JWT HS256 with `jti` in `jm_session` HttpOnly/SameSite=Lax cookie (Secure in production); admin 8-hour/customer 7-day server-side sessions; bcrypt password hashing and reset tokens | `users`, `sessions`, `password_resets`; `jose`, `bcryptjs`, `cookie` | Login, registration, profile, logout, reset; admin/customer redirects and role checks |
| Products/tyre finder | MongoDB search, aggregation, exact tyre size, explicitly recorded vehicle mappings only; pagination and stock | `products`; Zod input validation and Mongo indexes | Homepage, catalogue, product details, finder, owner product CRUD |
| Enquiries | Saved enquiry and two notification attempts | `enquiries`, `notification_logs` | Contact/quote form; admin enquiry status |
| Purchase workflow | Request snapshot, owner approve/reject/cancel/complete, transactional stock reserve/restore, low-stock alerts | `purchase_requests`, `products`, `audit_logs`, `notification_logs`; MongoDB replica-set transactions | Customer request/history, owner request dashboard |
| Payments | `PAYMENT_MODE=demo` simulation; optional live Razorpay order, signature + captured-payment check, signed raw-body webhook; demo excluded from real revenue | `payments`, `payment_webhooks`, `purchase_requests`, `audit_logs`; Razorpay HTTP API | Customer checkout; owner payment visibility |
| Images | Sharp validates/resizes/uploads; dev local `backend/public/uploads/products`; production Cloudflare R2 required (503 without config) | `products`, `audit_logs`; `sharp`, `@aws-sdk/client-s3` | Owner multipart upload/delete and customer images via proxy |
| Notifications | MongoDB outbox; SMTP via Nodemailer and optional WhatsApp Business template; fallback honestly logged as demo only | `notification_logs`; `nodemailer`, Meta API | Owner notification list and audit; reset/order/enquiry links |
| CMS/ops | Editable homepage; admin dashboard, customer directory, audit log, 16 opt-in fictional demo products | `site_content`, `users`, `products`, `audit_logs`, `rate_limits` | Home, owner workspace |

**No blogs, Cloudinary, Mongoose documents, frontend `/api` handlers, or frontend MongoDB driver exist.** Do not invent them or substitute mocks for MongoDB data. Current state is native MongoDB driver v6 with existing BSON documents and unique/partial/TTL indexes. Retain native driver and Zod validation rather than migrate stored data to Mongoose. A MongoDB replica set is necessary for transactions. The opt-in DEMO fixture is fictional and clearly labelled; it is not actual stock.

## Complete existing HTTP contract (all currently implemented methods/paths)

Responses are JSON, API replies use `Cache-Control: no-store`, failures normally `{error,code}` (`REQUEST_ERROR`, `VALIDATION_ERROR`, `AUTH_REQUIRED`, `FORBIDDEN`, `NOT_FOUND`, `RATE_LIMITED`) except the existing duplicate-key `{error}`. Default status 200 unless noted. Cookies remain host-only `jm_session`. Anonymous means no auth; customer/admin require exact role.

| Feature | Existing endpoints and methods | Access / input / output | Current files |
|---|---|---|---|
| Health | `GET /api/health` | Anonymous; Mongo ping + payment/notifications/image modes | `api.js`, `db.js` |
| Auth | `GET /api/auth/me`; `POST /api/auth/register` (201); `POST /api/auth/login`; `POST /api/auth/logout`; `PATCH /api/auth/profile`; `POST /api/auth/forgot-password`; `POST /api/auth/reset-password` | Public `me` returns `{user:null}` if unsigned; JSON for mutations except logout; profile customer-only; registration/login set cookie; logout clears; reset revokes sessions; reset outbox links | `api.js`, `auth.js`, `notifications.js` |
| Catalogue | `GET /api/products`, `GET /api/products/search` (same handler), `GET /api/products/:idOrSlug`, `GET /api/categories`, `GET /api/brands` | Anonymous; `q,brand,category,size,minPrice,maxPrice,availability,featured,page,limit,sort`; `{items,total,page,pages,limit}` or `{product}`; brand/category arrays | `api.js`, `catalog.js` |
| CMS | `GET /api/content/home` | Anonymous `{content}` | `api.js`, `content.js` |
| Finder | `POST /api/tyre-finder/search`; `GET /api/tyre-finder/vehicle-options` | Anonymous; JSON `{method:'size'|'vehicle', ...}` -> `{items,total,method,verifiedFitment,alternatives}`; options `{items}` | `api.js`, `catalog.js` |
| Enquiry | `POST /api/enquiries` (201) | Anonymous JSON; `{id,message}`; save first, then log/send notifications | `api.js`, `notifications.js` |
| Customer requests | `GET /api/requests/my`; `POST /api/requests` (201); `GET /api/requests/:idOrCode`; `POST /api/requests/:idOrCode/payment` | Customer; list filters/pagination, JSON request body (`productId,quantity,fulfillment,message,phone`); detail includes payments; start payment after approval | `api.js`, `commerce.js`, `payments.js` |
| Payments | `GET /api/payments/config`; `POST /api/payments/webhook`; `POST /api/payments/create-order`; `POST /api/payments/verify`; `POST /api/payments/demo/accept`; `POST /api/payments/demo/verify`; `POST /api/payments/demo/fail` | Config anonymous; webhook anonymous, raw signed body; all other POST customer-only, JSON (`requestId`, Razorpay proof, or `paymentId`); separate simulated accept/verify/fail | `api.js`, `payments.js` |
| Admin overview | `GET /api/admin/settings`; `POST /api/admin/demo-seed`; `GET /api/admin/dashboard` | Admin-only; runtime modes/phone, opt-in DEMO seed, counts + actual (not demo) revenue | `api.js`, `demoSeed.js` |
| Admin content | `GET /api/admin/content/home`; `PUT /api/admin/content/home` | Admin-only; JSON validated home fields; `{content}` | `api.js`, `content.js` |
| Admin images | `POST /api/admin/products/images` (201); `DELETE /api/admin/products/images?url=...` | Admin-only; multipart field `file`, max 5 MB still JPEG/PNG/WebP; upload `{url,bytes,width,height,storage}`; delete `{deleted:true}` | `api.js`, `storage.js` |
| Admin products | `GET /api/admin/products`; `POST /api/admin/products` (201); `GET /api/admin/products/:id`; `PUT /api/admin/products/:id`; `PATCH /api/admin/products/:id/stock`; `DELETE /api/admin/products/:id` | Admin-only; list `q,status,page,limit`; body validated `productSchema`; create/edit `{product}`; stock `{stockQty}`; delete/archive `{deleted,archived}` | `api.js`, `catalog.js`, `commerce.js` |
| Admin requests | `GET /api/admin/requests`; `GET /api/admin/requests/:idOrCode`; `PATCH /api/admin/requests/:code/approve`; `PATCH /api/admin/requests/:code/reject`; `PATCH /api/admin/requests/:code/cancel`; `PATCH /api/admin/requests/:code/complete` | Admin-only; list `status,q,page,limit`; JSON body payment option, reason, or offline balance; `{request}` | `api.js`, `commerce.js` |
| Admin enquiries | `GET /api/admin/enquiries`; `PATCH /api/admin/enquiries/:id` | Admin-only; `status,page` list -> `{items,total,page,pages}`; update JSON `{status}` -> `{updated:true}` | `api.js` |
| Admin customers | `GET /api/admin/customers`; `GET /api/admin/customers/:id` | Admin-only; `page` -> list; detail `{user,requests}` | `api.js` |
| Admin monitoring | `GET /api/admin/notifications`; `GET /api/admin/audit` | Admin-only; last 70 outbox and last 80 audit records, `{items}` | `api.js` |

**53 method/path combinations** (including `GET /api/products/search` as a separate URL); no existing API endpoint may silently change method, path, request body, status, authentication, or response envelope. `POST /api/payments/webhook` must receive exact raw bytes before JSON parsing; images must remain multipart. Origin checking precedes mutation/auth work (except signed webhook); Mongo rate limits apply to registration (8/h), login (20/h), reset requests (5/h), reset confirmation (8/h), finder (60/h), enquiries (8/h), customer requests (25/h per actor) and images (80/h per admin). The three `rate_limits` fields are `key`, `count`, `expiresAt` (TTL).

## Existing BSON collection/field/index inventory

All indexes below are already present in `src/server/db.js`. **Do not rename collections, alter field shapes, or drop indexes/data.** Native `ObjectId` references join users → sessions/resets/requests; products → purchase_requests; requests → payments; actors → audit/notifications. The UI receives the existing `publicUser`, `publicProduct`, `publicRequest`, `publicPayment` projections, not raw password hashes.

| Collection / target model | Actual persisted fields (principal fields) | Existing indexes |
|---|---|---|
| `users` / `UserModel` | `name,email,phone,passwordHash,role,accountStatus,createdAt,updatedAt` | `email` unique; `(role,createdAt desc)` |
| `sessions` / `SessionModel` | `id,userId,createdAt,expiresAt`; JWT `jti` = `id` | `id` unique; `expiresAt` TTL 0 |
| `password_resets` / `PasswordResetModel` | `tokenHash,userId,expiresAt,createdAt` | `tokenHash` unique; `expiresAt` TTL 0 |
| `products` / `ProductModel` | `slug,sku,name,brand,category,description,pricePaise,stockQty,images[{url,alt}],tyre{width,aspectRatio,rimDiameter,size,loadIndex,speedRating,type},compatibility[{vehicleType,make,model,variant,yearFrom,yearTo}],active,isDemo,featured,lowStockAlerted,lowStockCycle,createdAt,updatedAt`; optional `deletedAt` | `slug` unique, `sku` unique, `(active,createdAt desc)`, `(active,brand,category)`, tyre width/aspect/rim, compatibility vehicleType/make/model |
| `purchase_requests` / `PurchaseRequestModel` | `requestId,customerId,productId,productSnapshot,customerSnapshot,phone,quantity,totalPaise,fulfillment,message,status,paymentStatus,paymentType,paymentDuePaise,paidPaise,offlineBalancePaidPaise,reservedQty,history,approvedBy,approvedAt,rejectionReason,createdAt,updatedAt` (status-dependent fields may be absent) | `requestId` unique, `(customerId,createdAt desc)`, `(status,createdAt desc)`, `productId` |
| `payments` / `PaymentModel` | `requestId,customerId,amountPaise,currency,paymentType,mode,status,gatewayOrderId,gatewayPaymentId,demoAcceptedAt,demoReference,failedGatewayAttempts,verifiedAt,verificationSource,createdAt` (status-dependent fields may be absent) | `(requestId,status)` unique **only when pending**, `gatewayOrderId` unique **string only**, `gatewayPaymentId` unique **string only**, `(requestId,createdAt desc)` |
| `payment_webhooks` / `PaymentWebhookModel` | `eventId,event,receivedAt` | `eventId` unique |
| `enquiries` / `EnquiryModel` | `name,phone,email,vehicleType,requirement,message,status,createdAt,updatedAt` | `createdAt` desc |
| `notification_logs` / `NotificationModel` | `key,channel,recipient,subject,message,link,status,error,providerId,createdAt,updatedAt` | `key` unique; `createdAt` desc |
| `audit_logs` / `AuditLogModel` | Event-dependent `type,actorId,productId,requestId,paymentId,amountPaise,url,bytes,quantity,reason,createdAt`, etc. | `createdAt` desc |
| `rate_limits` / `RateLimitModel` | `key,count,expiresAt` | `key` unique; `expiresAt` TTL 0 |
| `site_content` / `SiteContentModel` | `_id:'home'`, `heroIntroLine1`, `heroIntroLine2`, `heroLocation`, `heroLine1`, `heroLine2`, `heroDescription`, `heroImage`, `catalogueHeading`, `catalogueDescription`, `updatedBy`, `updatedAt` | Mongo default `_id` unique |

Validation is Zod (`src/server/validation.js` and `src/server/content.js`); record-level business invariants/transactions are in auth/commerce/payments. No database migration is needed: models will use **the same Mongo collections, BSON `ObjectId`s, document fields and exact indexes** and will move writable Zod schemas alongside collection accessors.

## Implementation map (source → planned destination)

| Baseline source / responsibility | Target (within `backend/`) | Migration constraint |
|---|---|---|
| `src/index.js` app + startup + raw Web-Request adapter | `app.js` (Express middleware/routers), `server.js` (dotenv, DB connect, listen, shutdown) | Remove catch-all Web-Request adapter only after parity checks; preserve uploads/static/no-store/error/origin/webhook ordering |
| `src/api.js` ~198-line all-in-one dispatcher | `routes/{auth,catalog,enquiry,request,payment,admin*}Routes.js` + feature-specific `controllers/*Controller.js` | Routes are thin and retain **all 53** path/method contracts; controller owns request processing |
| `src/server/db.js` driver/indexes/transactions | `config/db.js`, `models/*Model.js`, `models/index.js` | No collection names/index options or transaction semantics change |
| `src/server/auth.js` | `services/authService.js`, `utils/token.js`, `middleware/authMiddleware.js`, `models/{User,Session,PasswordReset}Model.js` | JWT/cookie settings, role checks, bcrypt reset and session revocation preserved |
| `src/server/catalog.js` | `services/catalogService.js`, `models/ProductModel.js` | Search and finder projections/filter semantics unchanged |
| `src/server/commerce.js` | `services/commerceService.js`, `models/{PurchaseRequest,Product,...}Model.js` | Transactions, stock and audit/notification behavior unchanged |
| `src/server/payments.js` | `services/paymentService.js`, `config/razorpay.js`, `models/{Payment,PaymentWebhook}Model.js` | Demo/live separation, webhook signed bytes, idempotency and revenue safeguards unchanged |
| `src/server/storage.js` | `services/storageService.js`, `config/storage.js` | Local path must remain `backend/public/uploads/products`; R2 fail-closed in production |
| `src/server/notifications.js` | `services/notificationService.js`, `config/email.js`, `utils/links.js`, `models/NotificationModel.js` | Preserve outbox fallback, URL generation, SMTP/WhatsApp behavior |
| `src/server/content.js` | `services/contentService.js`, `models/SiteContentModel.js` | Preserve default copy, update schema and stored document shape |
| `src/server/demoSeed.js` | `services/demoSeedService.js`, `models/ProductModel.js` | Preserve exactly 16 labelled fictional records, idempotent insert |
| `src/server/validation.js` | `utils/validation.js` plus writable Zod schemas in feature model files | Same validation rules/error text; do not add Mongoose |
| `src/api.js` inline origin/rate/error/reply | `middleware/{origin,rateLimit,validation,error,auth,upload}Middleware.js`, `utils/http.js` | Origin before body/auth for mutations; 32 KiB JSON, signed webhook raw, 6 MiB multipart ceiling |
| `tools/{create-admin,seed-demo,start-local-mongo}`, `tests/test-api.cjs` | Keep and adjust internal imports only | Commands continue working; test uses same paths and expectations |
| `frontend/**` | **No planned changes** | Next rewrites and SSR helper should keep identical APIs, cookies, redirects and UI |

## Migration risks, baseline and rollback

1. **Existing MongoDB data:** never drop/rename collections or change partial/TTL unique indexes; use native Mongo driver and the same BSON types/field names. Safe read/write checks against the existing test replica set; no `dropDatabase` or destructive migration.
2. **Auth:** preserve 8-hour admin and 7-day customer HS256 sessions, `jm_session` cookie attributes (HttpOnly, Lax, Secure production), role 401/403 and reset revocation. New middleware must not parse or swallow protected-route errors.
3. **Proxy and CSRF:** browser uses Next same-origin `/api`; backend must allow configured public origin, reject spoofed `X-Forwarded-Host`, and keep SSR cookie forwarding. No frontend URL/method changes planned.
4. **Body ordering:** use route-specific `express.raw` **before** JSON parsing for Razorpay webhook; enforce JSON content type/size for other mutation routes and multipart size/type for owner uploads. Reject invalid requests with consistent JSON errors.
5. **Payments/stock:** preserve replica-set transactions, unique pending payment and gateway IDs, idempotent webhook behavior; no real Razorpay/SMTP/WhatsApp/R2 credentials are available, so test demo and fail-closed production mode without claiming live provider E2E.
6. **Zero-downtime migration:** leave `backend/src/` and its old port-4000 process untouched while building the candidate modular app on a second port. First validate candidate against API tests; only then switch frontend proxy backend port 4000 to the candidate and rerun browser tests. Keep a rollback copy outside the delivered folder until final ZIP integrity and tests pass.
7. **Baseline verification before implementation:** `backend/tests/test-api.cjs` passed **37/37** against the existing `http://127.0.0.1:4000` Express API and Mongo replica set. Previous build/browser QA is documented in the project's README. New tests will cover missing route/contract/middleware cases and regression across direct Express and frontend proxy.

This mapping is the implementation plan. Any deviation or necessary frontend/API contract change must be recorded in the final migration report.
