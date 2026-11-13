# NeoGym — Project Architecture

> Status: **as-found baseline** (audit date 2026-11-05). Sections marked *[Updated]* reflect later changes; see `AUDIT_REPORT.md` for issue status.

## 1. System overview

NeoGym is a three-application JavaScript monorepo (no workspace tooling; each app has its own `package.json` and `package-lock.json`).

```
Neo-Gym-main/
├── backend/    Express 4 + Mongoose 8 REST API (ESM, Node)
├── frontend/   Public website + member portal (React 18, Vite 5, Tailwind 3, react-router-dom 6)
└── admin/      Admin panel (React 18, Vite 5, Tailwind 3, react-router-dom 7, Material Tailwind, ApexCharts)
```

```
 ┌───────────────┐        HTTP/JSON (axios / fetch)        ┌──────────────────┐      Mongoose      ┌──────────┐
 │ frontend (SPA)│ ──────────────────────────────────────▶ │ backend (Express)│ ─────────────────▶ │ MongoDB  │
 │  :5173 (vite) │        base URL hardcoded               │  PORT from .env  │  CONNECTION_STRING └──────────┘
 └───────────────┘        'http://localhost:7002'          └──────────────────┘
 ┌───────────────┐                 ▲
 │ admin (SPA)   │ ────────────────┘   (same base URL; 5 admin files import it from ../../frontend/src)
 └───────────────┘
```

There is **no** shared code package, no API gateway, no reverse proxy config, no Dockerfile, no CI, and no deployment manifest in the repository. Deployment architecture is therefore undefined; both SPAs are expected to be served by Vite in development.

## 2. Technology stack

| Layer | Technology | Notes |
|---|---|---|
| API | Node (tested on v24), Express 4.21, Mongoose 8.8 | ESM modules. `nodemon` used as the `start` script (dev tool in prod path). |
| Auth | `jsonwebtoken` 9, `bcryptjs` 2.4 | JWT issued for members only; admins receive no token (as found). |
| DB | MongoDB (any; URI from `CONNECTION_STRING`) | No migrations, no seed scripts, no indexes beyond `unique`. |
| Frontend | React 18.3, Vite 5.4, Tailwind 3.4, react-router-dom 6.27, axios, framer-motion, AOS, react-toastify, react-icons | `@material-tailwind/react`, `react-apexcharts`, `react-modal` declared but unused. |
| Admin | React 18.3, Vite 5.4, Tailwind 3.4, react-router-dom **7**, @material-tailwind/react, react-apexcharts, react-modal, axios | Uses `framer-motion` without declaring it (resolved transitively via Material Tailwind). Router major version differs from frontend. |
| Testing | none | `backend` `test` script is the npm placeholder. |
| Payments gateway | none | No Razorpay/Stripe/etc. Payments are manual admin records only. |
| Notifications | none | `sendReminder()` is a `console.log` placeholder. |
| File uploads | none | Images are static assets bundled into the frontend. |

## 3. Configuration and environments

| Variable | Used by | Required | Purpose |
|---|---|---|---|
| `PORT` | backend/server.js, config.js | yes (process exits if missing) | Listen port. Frontends assume **7002**. |
| `CONNECTION_STRING` | backend/server.js, database.js | yes | MongoDB URI |
| `JWT_SECRET` | authController | **not validated** — if absent, `jwt.sign` throws at login time | JWT signing key |
| `JWT_EXPIRY` | authController | no (default `1h`) | Member token lifetime |

No `.env.example` exists. Frontend/admin API base URL is a hardcoded constant (`src/constant/const.js` → `http://localhost:7002`) named `FRONTEND_URL` although it is the **backend** URL. No Vite env variables are used.

## 4. Backend architecture

### 4.1 Layering

`server.js` → `routes/*.js` → `controllers/*.js` → `model/*.js` (Mongoose). There is no service layer, no validation layer, **no authentication/authorization middleware**, no request logging, no rate limiting, no security headers. CORS is fully open (`cors()` with defaults). A global error handler exists but most controllers catch errors themselves and return `500` with `error.message` (leaks internals).

### 4.2 Route map (as found)

| Mount | Method & path | Controller | Auth (as found) | Consumers |
|---|---|---|---|---|
| `/api/auth` | POST `/signup` | authController.signup | none | frontend SignUpPage |
| | POST `/login` | authController.login | none | frontend LoginPage |
| `/api/admin` | POST `/register` | adminController.createAdmin | **none — anyone can create an admin** | admin SignUpPage |
| | POST `/login` | adminController.loginAdmin | none; returns no token | admin LoginPage |
| `/api/member` | POST `/users` | UserConroller.createUser | none | admin MemberEntryForm |
| | GET `/users` | getAllUsers | none (returns password hashes) | admin RegisteredMembers, Dashboard, ChartConfig |
| | GET `/users/:id` | getUserById | none | frontend Customer, Reminder |
| | PUT `/users/:id` | updateUserById | none (mass assignment) | frontend Modal |
| | DELETE `/users/:id` | deleteUserById | none | **no UI** |
| | PUT `/users/:id/reminder` | inline in router | none | admin MemberPaymentTable, frontend Reminder |
| `/api/staff` | POST/GET `/`, GET/PUT/DELETE `/:id` | staffController | none | admin Staff* |
| `/api/announcement` | GET/POST `/`, DELETE `/:id` | announcementController | none | admin + frontend |
| `/api/equipment` | GET/POST `/`, PUT/DELETE `/:id` | equipmentController | none | admin Equipment* |
| `/api/payment` | POST `/` | createPayment | none | **no UI caller** |
| | GET `/` | getAllPayment | none | admin MemberPaymentTable |
| | GET `/:memberId` | getPaymentsForMember | none | **no UI caller** |
| `/api/task` | full CRUD | taskController | none; tasks are **global**, not per member | frontend Todo/Dashboard, admin Dashboard |
| `/api` | POST `/contact` | submitContactForm | none (correct for a public form) | frontend ContactUs |
| | GET `/contact` | getContactForms | none (leaks enquiry PII) | admin Dashboard |
| `/` | GET | health text | none | — |

### 4.3 Response shape inconsistency

| Endpoint group | Success shape |
|---|---|
| member, staff, task | raw document / array |
| announcement | `{ success, data }` |
| equipment | `{ data }` / `{ message, data }` |
| payment | `{ payments }` / `{ message, payment }` |
| contact | `{ success, data }`; **404 when empty** |
| payment list | **404 when empty** |

## 5. Data model (MongoDB / Mongoose)

```
Member (collection: members)  ◀──── ref ──── Payment.member (required ObjectId)
   │  fullName, username (unique), password (bcrypt — or PLAINTEXT if created by admin),
   │  gender, contactNumber (/^\d{10}$/), address{street,city,state,zipCode},
   │  dateOfRegistration, amount, chosenService enum[Fitness,Sauna,Cardio],
   │  plan enum[premium,standard,basic], status enum[Active,Expired,Pending] (manual),
   │  attendanceCount, initial/currentWeight, initial/currentBodyType, progressDate,
   │  reminder (bool), paidDate
   │  post('save') hook → creates a Payment if plan && chosenService
   │
User  (collection: users)   — DEFINED BUT UNUSED. Has `role` enum[admin,customer] and memberDetails ref.
Admin (collection: admins)  — fullname (unique!), email (unique), password (PLAINTEXT)
Staff (collection: staffs)  — fullname, username (unique), email (unique), designation enum[cashier,trainer,manager],
                              address.zipCode (US ZIP regex), contact; no password field, no login
Payment                     — member ref, amountPaid (no min), paymentDate, chosenService (required),
                              plan (required), reminderSent
Announcement                — message (≤500), appliedDate
Equipment                   — name, description, qty, amount (STRING), vendor, address, contact, purchasedDate
Task                        — taskDesc, taskStatus enum[In Progress,Pending]; NO owner reference
ContactUs                   — firstName, lastName, email, phone, message
```

Relationship notes:
- The only real relationship is `Payment.member → Member`. Deleting a member leaves **orphaned payments** (no cascade); the admin payment table then dereferences `null`.
- "Membership" is not an entity. Plan, service, price and status are flat fields on `Member` with **no start date, no end/expiry date, and no duration**. Plan durations are contradictory across the UI (PaymentForm: basic=1/standard=3/premium=6 months; PaymentReceipt: basic=1/standard=3/premium=12).
- Trainers exist only as `Staff.designation = 'trainer'`; no trainer–member assignment.
- Attendance exists only as a manually-entered integer (`attendanceCount`).
- `Member` has no `role` and no `email`, so JWT `role` is always `undefined` and email-based password reset is impossible.

## 6. Frontend application (public site + member portal)

```
/                 Home = Navbar + HeroSection + AboutUs + Classes + Testimonials + CTA + Footer
/AboutPage        AboutPage
/contactUs        ContactUs (POST /api/contact)
/login            LoginPage (POST /api/auth/login → localStorage token,userId → /customer)
/Signup           SignUpPage (POST /api/auth/signup)
/ForgotPassword   ForgotPassword (UI only — no API; always shows "OTP sent")
/Customer/*       Customer layout (GET /api/member/users/:userId) — NOT route-guarded
   /dashboard     tasks (global) + announcements
   /Todo          create task
   /Reminder      reminder flag for a HARDCODED member id
   /Annoucements  announcement list
   /Reports       placeholder ("Reports")
```

State management: local `useState` only; identity is `localStorage.userId`. The JWT is stored but **never sent** on any request.

## 7. Admin application

```
/                         LoginPage (POST /api/admin/login → navigate; nothing stored)
/signUp                   SignUpPage (POST /api/admin/register — public)
/admin/*                  Admin layout — NOT route-guarded (any visitor can open it)
  dashboard               counts (members/staff/equipment real; "Active members"=5, "Earnings"=17, "Trainers"=4 HARDCODED);
                          charts hardcoded; enquiries list; announcements via wrong URL /api/announcements (404)
  equipment/{EquipmentList,EquipmentInfoForm,EquipmentManagement}   real CRUD
  payment/{MemberPaymentTable,PaymentForm,PaymentReceipt}           list real; "Make Payment" never calls API
  member/{RegisteredMembers,MemberEntryForm,MemberManagement}       list broken (undefined FRONTEND_URL); management = mock data
  memberProgress                                                    hardcoded PHP-template leftovers; not in sidebar
  annoucement/{MakeAnnouncement,ManageAnnouncement}                 real create/delete
  staffManagement/{StaffList,StaffAdd}                              real; edit modal corrupts address/gender
  reports                                                           same hardcoded charts as dashboard
```

## 8. Cross-application integration map

| Business object | Written by | Read by | Consistent? |
|---|---|---|---|
| Member (self-registered) | frontend signup | admin list, member portal | Missing service/plan → cannot receive a payment record |
| Member (admin-created) | admin entry form | member portal | Password stored plaintext → member **cannot log in** |
| Payment | Member post-save hook only | admin payment table | No manual/online payment creation path in any UI |
| Reminder flag | admin payment table toggle | member Reminder page | Member page reads a hardcoded ID, not the logged-in member |
| Announcement | admin | member dashboard/announcements, admin dashboard | Admin dashboard uses wrong URL |
| Task | member Todo | member dashboard **and admin dashboard** | Global — every member sees/deletes everyone's tasks |
| Contact enquiry | public contact form | admin dashboard | Public GET leaks all enquiries |

## 9. Architectural weaknesses (summary)

1. No authentication/authorization layer on the API (every endpoint is public).
2. Three different identity concepts (`Member`, unused `User`, `Admin`) and staff with no login.
3. No membership/subscription entity → expiry, renewal, freeze, upgrade impossible.
4. Duplicated UI logic (announcement list rendered in 3 places; `formatDate` copy-pasted ~8 times; dashboard charts duplicated in Reports).
5. Hardcoded API base URL; admin imports config from the frontend app's source tree.
6. Leftover PHP template code (`*.php` form actions/links) and copied branding from another product ("Perfect GYM Club", Williamsburg address) in invoices.
7. No tests, no CI, no deployment definition.

## 10. [Updated 2026-11-05] Architecture after Batches 1–2

### 10.1 Backend structure

```
backend/
├── server.js                 env validation (PORT, CONNECTION_STRING, JWT_SECRET) → db() → listen
├── src/app.js                createApp(): CORS allow-list, security headers, JSON limit, routes, 404, error handler
├── src/middleware/auth.js    signToken / requireAuth / requireRole / requireAdmin / requireMember
├── src/middleware/validate.js validateObjectId, pick (allow-list), in-memory rateLimit
├── src/utils/password.js     bcrypt hash/verify + transparent upgrade of legacy plaintext passwords
├── src/utils/httpError.js    safe error mapping (400 validation / 409 duplicate / generic 500)
├── src/model/Counter.js      atomic sequences → invoice numbers NG-YYYY-000001
└── tests/                    node:test + supertest + mongodb-memory-server
```

### 10.2 Authentication model

- **Member**: `POST /api/auth/login` returns a JWT `{ sub, role: "member" }` (expiry `JWT_EXPIRY`, default 1h). It is stored as `memberToken` in localStorage.
- **Admin**: `POST /api/admin/login` returns a JWT `{ sub, role: "admin" }` (expiry `ADMIN_JWT_EXPIRY`, default 8h). It is stored as `adminToken`. The admin UI validates it on load via `GET /api/admin/me`.
- Both UIs attach the token through a global axios interceptor (`src/lib/session.js`). Any 401 on an authenticated request ends the session.
- Passwords are bcrypt-hashed (`select: false`, stripped by `toJSON`). Legacy plaintext values are verified once and re-hashed.

### 10.3 Route access matrix

| Access | Routes |
|---|---|
| Public | `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/admin/login`, `GET /api/admin/setup-status`, `POST /api/contact`, `GET /api/announcement`, `GET /api/health` |
| First-run, then admin | `POST /api/admin/register` |
| Member (self) | `GET/PUT /api/member/me`, `PUT /api/member/me/reminder/dismiss`, `GET /api/payment/me`, `/api/task/*` (scoped to owner) |
| Admin | `/api/member/users*`, `/api/staff*`, `/api/equipment*`, `POST/GET /api/payment`, `GET /api/payment/:id`, `GET /api/payment/member/:memberId`, `GET /api/contact`, `POST/DELETE /api/announcement`, `GET /api/admin/me` |

Rate limits apply to the logins (default 10 per 15 minutes per IP), signup and the contact form.

### 10.4 Data model changes (additive, no migration needed)

- `Payment`: `chosenService`/`plan` are now optional. Added `memberName`, `method`, `note`, `invoiceNumber` (unique, sparse), `idempotencyKey` (unique, sparse), `recordedBy`; `amountPaid` must be ≥ 0.
- `Task`: added `owner` (ref Member, indexed).
- `Member`/`Admin`: `password` is `select:false`. Member's post-save payment hook now runs only on creation.
- `Staff.address.zipCode` accepts Indian 6-digit PIN codes and US ZIP codes.
- New `counters` collection.

### 10.5 Front-end configuration

| App | Variable | Default |
|---|---|---|
| frontend, admin | `VITE_API_URL` | `http://localhost:7002` |
| admin | `VITE_GYM_NAME` | `NeoGym` |
| admin | `VITE_CURRENCY_SYMBOL` | `₹` |

The admin app no longer imports code from `frontend/`.

### 10.6 Still open architecturally

- No `Membership`/`Plan` entities (needs owner decision).
- Response shapes are still inconsistent between resources.
- The rate limiter is per-process (use Redis or similar if the API is scaled horizontally).
- No CI pipeline or deployment manifests.
