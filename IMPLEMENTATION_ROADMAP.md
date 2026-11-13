# NeoGym — Implementation Roadmap

Principles:
- Fix in small batches and test every batch.
- Preserve all existing data: no destructive migrations, and legacy plaintext passwords are upgraded on login rather than reset.
- Never change a business rule silently. Items that need the owner's input are marked **DECISION**.

## Phase 1 — Critical security and data integrity (P0)

### Batch 1: Backend security core
| Step | Fixes |
|---|---|
| Add `middleware/auth.js`: `requireAuth` (verifies the JWT) and `requireRole('admin'\|'member')`. Tokens carry `{ sub, role }`. | SEC-01, SEC-05, SEC-09 |
| Admin auth: bcrypt hashing. On login, legacy plaintext admin passwords are verified once and transparently re-hashed (no lockout of existing admins). Issue an admin JWT. Use a generic "Invalid credentials" response. | SEC-04, SEC-05, SEC-12 |
| `POST /api/admin/register`: open only while **zero admins exist** (first-run bootstrap); afterwards, admin-only. | SEC-03 |
| Member passwords: hash in admin-created members. Upgrade legacy plaintext on login. Hide `password` from all API responses. | DB-01, SEC-02 |
| Reject non-string credentials (operator injection). Ignore client `role` on signup. | SEC-08, SEC-09 |
| Protect routes. **Admin only:** member list/create/update/delete, staff, equipment, payments, contact list, announcement writes. **Member self-service:** `GET/PUT /api/member/me` with an allow-list of editable fields, own tasks, own payments. **Public:** signup, logins, contact submit, announcement read. | SEC-01, SEC-06, SEC-07, SEC-10 |
| Tasks get an `owner` field and are scoped to the requesting member. Legacy owner-less tasks become invisible to members, not deleted. | BL-07, DB-09 |
| Validation hardening: `runValidators` on updates, ObjectId check (400), Indian PIN + US ZIP accepted for staff, `amountPaid ≥ 0`. | DB-03, DB-04, DB-05, DB-08 |
| `Payment.chosenService/plan` become optional so any member can be billed. Gate the Member post-save hook on `isNew`. | BL-03, DB-06 |
| Payments survive member deletion (financial records are retained). List endpoints return `200 []` when empty, not 404. | DB-02, AD-03 |
| Fix the case-sensitive import. Fail fast if `JWT_SECRET` is missing. CORS allow-list via `CORS_ORIGINS`. Dependency-free in-memory login rate limiter. Generic 500 messages. | DB-10, SEC-11, SEC-13, SEC-14, SEC-15 |
| Add `.env.example`. Add a backend test suite (`node:test` + `supertest` + `mongodb-memory-server`, dev-only). | testing |

**Breaking change:** both UIs must send `Authorization: Bearer <token>`. Batch 2 ships in the same release.

### Batch 2: Wire both UIs to the secured API
| Step | Fixes |
|---|---|
| Shared `api.js` axios instance per app: base URL from `VITE_API_URL` (fallback `http://localhost:7002`), attaches the token, logs out on 401. Remove the cross-app imports. | SEC-05, AD-09 |
| Route guards: `/admin/*` requires an admin token; `/Customer/*` requires a member token. | SEC-05, SEC-06 |
| Member portal uses `/api/member/me`. Reminder uses the logged-in member. Profile modal sends only editable fields. | SEC-06, SEC-07, BL-08, FE-07 |
| Admin: import fix (AD-01), announcements URL (AD-02), contact error path (AD-03), equipment empty state (AD-05), staff edit modal (AD-06), feedback on add forms (AD-07), declare `framer-motion` (AD-10), mount ToastContainer and fix the title (AD-11), honour logout confirm (AD-12/FE-07). | as listed |
| **Record payment:** replace the PHP form with a real form → `POST /api/payment` (amount, date, method, note) → receipt built from the *saved* record, with a persisted invoice number. Remove the copied branding. | BL-02, BL-06, CT-04 |
| Payment table null-safe for deleted members. Reminder toggle initialised from member data. | DB-02, BL-09 |
| "Manage Member": replace mock rows with real data, plus edit and delete. | AD-04 |
| Dashboard: real counts (active members by status, earnings = sum of payments). Remove hardcoded KPI numbers. Charts that have no data source get a "sample data" label until Phase 2. | BL-10 |

## Phase 2 — Core business logic (P1) — **DECISION required**

1. **Membership plans entity.** DECISION: which plans exist, their durations and prices, and whether "service" (Fitness/Sauna/Cardio) is an add-on or the plan itself. Proposed design: a `Plan { name, durationMonths, price, services[] }` collection and a `Membership { member, plan, startDate, endDate, status, payment }` collection. Status is *derived* from dates (Active / Expiring / Expired / Frozen).
2. Renewal: a new Membership starts at max(today, current endDate). Upgrades are pro-rata (DECISION). Freeze extends endDate.
3. Payments link to a Membership. Invoice records get sequential numbers. Optional GST fields (DECISION: is the gym GST-registered?).
4. Daily job: mark expired memberships and queue reminders (replaces the manual `reminder` flag).
5. Member portal: My Membership, payment history, downloadable invoice.
6. Plan durations are currently contradictory (premium = 6 vs 12 months). They stay untouched until the owner decides.

## Phase 3 — User journey, content, UX (P1/P2)

- Public site:
  - Pricing section driven by the Plans API.
  - Working hero CTA and Join buttons (→ signup or free-trial enquiry).
  - Fix the mobile menu.
  - Remove or label placeholder testimonials and unverifiable stats (**DECISION:** owner supplies real figures).
  - Location/hours/map, trainers, FAQ.
  - Privacy, Terms and Refund pages (**DECISION:** legal text from the owner).
  - 404 page.
- Compress the hero image (9.1 MB → under 400 KB) and remove the duplicate asset.
- Member portal responsive layout. Remove the fake forgot-password flow: replace it with "contact the front desk" until members have an email address and a mail provider exists (**DECISION**).
- Unified design tokens (one brand colour set across both apps), consistent buttons, loading, empty and error states.

## Phase 4 — Admin improvements (P2)

- Enquiry (lead) management: status, follow-up date, notes, and convert-to-member.
- Attendance: manual and QR check-in, with duplicate-check-in guard and blocking of expired members.
- Trainer profiles, trainer–member assignment, PT packages.
- Staff logins with roles (manager / cashier / trainer) and permission matrix.
- Audit log for financial and member edits. Optimistic concurrency (`__v`) on member edits.
- Expense tracking, so the Earnings vs Expenses chart becomes real.
- Code-split the admin bundle.

## Phase 5 — Business growth

- Online payments via Razorpay (India) or Stripe. Server-side signature verification, idempotency keys, webhooks. **DECISION + credentials**.
- Expiry and renewal reminders via WhatsApp/SMS/email (provider DECISION).
- Coupons and referral codes. Free-trial booking. Abandoned-signup follow-up.

## Phase 6 — Advanced (evaluate feasibility first)

- Digital membership card / QR entry. Progress tracking with body measurements.
- Churn-risk scoring from attendance gaps.
- Class scheduling with capacity and waitlists.
- Multi-branch support.
- AI workout suggestions: only after the core data (attendance, progress) exists.

## Feature recommendations (value × complexity)

| Feature | Business value | User value | Complexity | Priority | Depends on |
|---|---|---|---|---|---|
| Membership plans + expiry | Very high (revenue integrity) | High | M | P1 | DECISION on plans |
| Real payment recording + invoices | Very high | High | S–M | P0/P1 | Batch 1 |
| Expiry reminders (WhatsApp/SMS) | High (retention) | High | M | P1 | Plans, provider |
| Pricing page + working CTAs | High (conversion) | High | S | P1 | Plans |
| Lead/enquiry pipeline | High | — | S–M | P2 | — |
| QR / manual attendance | Medium–high | Medium | M | P2 | Plans |
| Online payments (Razorpay) | High | High | M–L | P2 | Plans, merchant account |
| Trainer assignment / PT | Medium | Medium | M | P3 | Staff roles |
| Coupons / referrals | Medium | Medium | M | P3 | Online payments |
| Churn analytics | Medium | — | L | P4 | Attendance data |
| AI fitness assistant | Low (now) | Medium | L | P5 | Progress data |

## Progress log

| Date | Batch | Result |
|---|---|---|
| 2026-11-05 | Discovery and audit | Docs created. Baseline builds pass. Probe confirmed 19 findings. |
| 2026-11-05 | Batch 1 — backend security core | Done. `npm test`: 32/32 pass (security, business, rate-limit suites). Startup env check verified. |
| 2026-11-05 | Batch 2 — UIs wired to secured API | Done. Both builds pass, lint 0 errors (was 105), browser E2E 29/29 in Edge. Phase 3 items also completed here: CTAs, mobile nav, 404, hero image 9.1 MB → 152 kB, removal of unverified claims, honest forgot-password page, README rewritten. |
| 2026-11-05 | UI/UX redesign: website and member portal | New design system: Archivo (expanded) display type, Instrument Serif italic accents, Inter body; ink / bone / single ember accent, with tokens in `tailwind.config.js` and components in `src/index.css`. All public pages, auth pages and portal screens rebuilt. Services moved from a modal into a page section; new "How joining works" section. Contrast checked against WCAG AA (ink text on ember buttons). Fluid hero type verified to fit from 320 to 1440 px; no horizontal overflow. JS bundle 409 → 274 kB. Lint 0 errors; E2E 29/29. Admin panel not yet restyled. |
| 2026-11-06 | Responsive pass: website and member portal | Automated audit across 12 viewports (320 to 2560 px, plus 844×390 landscape) on 12 pages: 131 issues → 0 real issues (one remaining flag is a deliberate screen-reader-only label). Fixed: tap targets under 44 px, 11.5 px labels → 12 px, tablet layouts (hero buttons, pillars, programs, plans, footer), wider content column on 1536 px+ screens, hero crop on wide screens, landscape hero, portal tabs/stats/payment cards. Also fixed a regression found during the pass: the mobile menu collapsed to 72 px because the header's `backdrop-filter` became its containing block. Browser regression: all visitor and member journeys passed; the admin half of that run was blocked by a CORS misconfiguration in the temporary test server (admin code unchanged in this pass). |

### Next up (in order)
1. **Owner decisions** (AUDIT_REPORT §8): plans/durations/prices, currency, public content, online payments, legal pages.
2. **Phase 2 — memberships:** `Plan` + `Membership` entities, derived status from dates, renewals, an expiry job, and renewal reminders.
3. **Commit the E2E suite** under `e2e/` with `@playwright/test`. Add CI to run `npm test`, lint, builds and E2E.
4. **Phase 4 admin items:** enquiry pipeline, attendance, staff roles, audit log, code-splitting the admin bundle.
5. Remaining P2/P3: Font Awesome icons (NEW-01), favicon (NEW-04), consistent API response shapes, member entry form step validation (NEW-05).
