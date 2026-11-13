# NeoGym — Audit Report

- **Audit date:** 2026-11-05
- **Scope:** `backend/`, `frontend/`, `admin/`. All source files were read in full.
- **Method:**
  1. Static reading of every file.
  2. `npm ci` and `vite build` for both UIs (both pass).
  3. ESLint (frontend: 42 problems; admin: 63 problems, including 2 `no-undef` runtime bugs).
  4. A live API probe: the original, unmodified backend was booted against a throwaway in-memory MongoDB, and 19 scripted attack and logic scenarios were sent to it.
- **Evidence tags:** **[V]** verified by running code or a build. **[C]** established by code tracing. **[E]** expert judgement (business/UX).
- **Status values:** `Open`, `Fixed (tested)`, `Fixed (untested)`, `Deferred`, `Needs decision`.

## 1. Executive summary

NeoGym looks like a gym management system, but it has **no security boundary**, **no working payment-recording flow** and **no concept of a membership period**.

- Every API endpoint, including admin creation, member deletion and listing of password hashes, is callable anonymously [V].
- The admin UI cannot record a payment [C].
- Members who sign up online can never have a payment recorded, because of a schema constraint [V].
- Members created by an admin can never log in, because their passwords are stored in plaintext [V].
- Several admin screens render hardcoded mock data while looking real [C].

The codebase is small (~100 files), so these problems can be fixed without a rewrite.

## 2. Issue register

Severity: **P0** = security, data corruption or a core flow broken. **P1** = membership/payment logic or an important journey. **P2** = UI/validation/error handling. **P3** = improvement.

### 2.1 Security (P0 unless noted)

| ID | Issue | App | Evidence | Root cause | Status |
|---|---|---|---|---|---|
| SEC-01 | No authentication on any API route. Anyone can list, edit or delete members, staff, payments, equipment and announcements. | backend | [V] probe 3,4,9,13,14 | No auth middleware exists | Fixed (tested) |
| SEC-02 | `GET /api/member/users[/:id]` returns bcrypt password hashes. | backend | [V] probe 3b | Controller returns full documents; no `select:false` | Fixed (tested) |
| SEC-03 | Public admin self-registration: anyone can create an admin account. | backend, admin | [V] probe 5 | `/api/admin/register` is unauthenticated | Fixed (tested) |
| SEC-04 | Admin passwords are stored and compared in plaintext. | backend | [C] adminController L23,L59 | No hashing | Fixed (tested) |
| SEC-05 | Admin login issues no token. The admin UI navigates on HTTP 200 and `/admin/*` has no guard, so the whole admin panel is reachable by URL. | backend, admin | [V] probe 5b + [C] App.jsx | No session/token design | Fixed (tested) |
| SEC-06 | Member route `/Customer/*` has no guard. The member's identity is `localStorage.userId`, so changing it views or edits another member (IDOR). | frontend, backend | [C] Customer.jsx, Modal.jsx | Client-side identity, server trusts the URL id | Fixed (tested) |
| SEC-07 | Mass assignment: `PUT /api/member/users/:id` accepts any field (`status`, `plan`, `amount`, `attendanceCount`, `password`). | backend | [V] probe 4 | `findByIdAndUpdate(id, req.body)` | Fixed (tested) |
| SEC-08 | NoSQL operator injection on login: `{"username":{"$ne":null}}` plus one valid password returns a token. | backend | [V] probe 19 | Request body is not type-checked before the query | Fixed (tested) |
| SEC-09 | Signup trusts a client-supplied `role`. Member has no `role` field, so the JWT `role` is always undefined. | backend | [V] probe 1 | Design gap | Fixed (tested) |
| SEC-10 | `GET /api/contact` publicly exposes all enquiries (names, emails, phones, messages). | backend | [V] probe 12 | No auth | Fixed (tested) |
| SEC-11 (P1) | No rate limiting or lockout on either login. | backend | [V] probe 18 | Missing middleware | Fixed (tested) |
| SEC-12 (P1) | Admin login reveals whether an email exists ("Admin not found" 404 vs 401). | backend | [V] probe 5c | Distinct error messages | Fixed (tested) |
| SEC-13 (P1) | Error responses leak internals (`error.message`, Mongoose cast/validation text). | backend | [V] probe 8,16 | Controllers echo `error.message` | Fixed (tested) |
| SEC-14 (P1) | CORS allows all origins. No security headers. No body size limit set (Express default 100 kB is OK). | backend | [C] | Defaults | Fixed (headers tested; CORS allow-list configurable, untested) |
| SEC-15 (P1) | `JWT_SECRET` is not validated at startup; a missing secret fails only at the first login. | backend | [C] | No config validation | Fixed (verified: server exits when missing) |
| SEC-16 (P2) | JWT stored in `localStorage` (XSS-exposed). React escapes output, so no XSS sink was found; announcement HTML is rendered as text [V probe 14]. | frontend | [C] | Design choice | Deferred (acceptable once the API is protected) |

### 2.2 Data integrity and database

| ID | Issue | Evidence | Root cause | Status |
|---|---|---|---|---|
| DB-01 (P0) | Admin-created members have **plaintext passwords** and cannot log in. | [V] probe 6, 6b | `createUser` does not hash | Fixed (tested) |
| DB-02 (P0) | Deleting a member leaves **orphaned payments**. The admin payment table then throws on `payment.member.fullName` and the page crashes. | [V] probe 9b + [C] MemberPaymentTable L108 | No cascade or soft delete | Fixed (tested: API + browser) |
| DB-03 (P1) | Updates skip validators (staff, equipment, task): `gender:"Male"`, `designation:"janitor"` are saved. | [V] probe 11 | Missing `runValidators:true` | Fixed (tested) |
| DB-04 (P1) | Staff ZIP regex is US-only (`^\d{5}(-\d{4})?$`) and rejects Indian 6-digit PIN codes. The product uses ₹ and +91 numbers. | [V] probe 10 | Copied validator | Fixed (tested) |
| DB-05 (P1) | `Payment.amountPaid` has no `min`. `Equipment.amount` is a String. `Member.amount` vs `Payment.amountPaid` are duplicated sources of truth. | [C] | Schema design | Partially fixed (amount ≥ 0 tested; Equipment.amount still a string; Member.amount vs payments still duplicated) |
| DB-06 (P1) | `Member` `post('save')` hook creates a Payment on **every** `.save()`, not just on creation. A latent duplicate-payment bug (current code paths use `findByIdAndUpdate`). | [C] Member.js L235 | Hook not gated on `isNew` | Fixed (tested) |
| DB-07 (P2) | `Admin.fullname` is `unique` (two admins can't share a name). `User` model is unused dead code. `Member.js` contains a 115-line commented duplicate. | [C] | | Partially fixed (unique removed from schema, commented duplicate removed; existing fullname_1 index must be dropped manually; User model still unused) |
| DB-08 (P2) | Invalid ObjectId → 500 instead of 400/404. | [V] probe 16 | No id validation | Fixed (tested) |
| DB-09 (P2) | `Task` has no owner reference (see BL-07). | [C] | Schema | Fixed (tested) |
| DB-10 (P1) | Case-sensitive import `../model/adminModel.js` vs file `AdminModel.js`: works on Windows/macOS, **crashes at startup on Linux** (typical production host). | [C] | Filename mismatch | Fixed (verified: all model imports match filename case) |

### 2.3 Business logic (gym operations)

| ID | Issue | Severity | Evidence | Status |
|---|---|---|---|---|
| BL-01 | **No membership period.** There is no start date, expiry date or duration, so expiry, renewal, freeze, upgrade and access restriction cannot be computed. `status` is set manually. | P1 | [C] | Needs decision |
| BL-02 | **Admin cannot record a payment.** PaymentForm is a PHP leftover (`action="userpay.php"`); "Make Payment" only navigates to a receipt showing the *previous* payment. | P0 | [C] | Fixed (tested in browser) |
| BL-03 | **Self-registered members can never be billed.** `Payment.chosenService/plan` are required, but signup sets neither. | P0 | [V] probe 8 | Fixed (tested) |
| BL-04 | Plan semantics are contradictory. `plan` (basic/standard/premium) is treated as a tier in the services modal, but as a duration in payment screens: premium = 6 months (PaymentForm) vs 12 months (receipt). Prices are per *service*, not per plan. | P1 | [C] | Needs decision |
| BL-05 | Currency is inconsistent: ₹ icons in the dashboard, `$` in member entry/receipt/equipment. | P2 | [C] | Partially fixed (payment screens, receipt, equipment, dashboard use a configurable symbol, default ₹; price hints in the member entry form still say $: needs decision) |
| BL-06 | The invoice number is random on every render and never persisted; there is no invoice record. The receipt carries another business's name and address. | P1 | [C] | Fixed (tested) |
| BL-07 | To-do tasks are global: every member sees and can delete every other member's tasks; the admin dashboard fetches them too. | P1 | [V] probe 13 | Fixed (tested) |
| BL-08 | Member reminder page shows the reminder of a hardcoded member id. | P1 | [C] Reminder.jsx L9 | Fixed (tested in browser) |
| BL-09 | Admin reminder toggle starts from an empty state rather than the member's actual `reminder` value. | P2 | [C] | Fixed (tested in browser) |
| BL-10 | Dashboard KPIs (active members 5, earnings ₹17, trainers 4) and all charts are hardcoded. This misleads business decisions. | P1 | [C] | Fixed (tested in browser) |
| BL-11 | Attendance, trainers/PT, classes, plans catalogue, coupons, refunds, freeze, expenses: not implemented (see Feature Inventory). | P3 (roadmap) | [C] | Deferred |
| BL-12 | Online purchase journey does not exist: a visitor cannot buy a membership. | P1 (product) | [C] | Needs decision |
| BL-13 | Contact enquiries have no status or follow-up (no lead pipeline). | P3 | [C] | Deferred |

### 2.4 Functional bugs — admin app

| ID | Issue | Severity | Evidence | Status |
|---|---|---|---|---|
| AD-01 | `RegisteredMembers.jsx` uses `FRONTEND_URL` without importing it, so the member list never loads. | P0 (core screen) | [V] lint no-undef | Fixed (tested in browser) |
| AD-02 | Dashboard fetches `/api/announcements` (plural), which returns 404. | P2 | [V] probe 15 | Fixed (tested in browser) |
| AD-03 | Dashboard `fetchContactForms` else-branch references undefined `result` (ReferenceError). Also, the API returns 404 when there are no enquiries. | P2 | [V] lint | Fixed (tested) |
| AD-04 | `MemberManagement` (Manage Member) shows hardcoded mock rows; Remove/Edit are fake. | P1 | [C] | Fixed (tested in browser) |
| AD-05 | `EquipmentList` returns early when empty, which hides the "Add Equipment" button. A fresh install can't reach the add form from the list. | P1 | [C] L66 | Fixed (tested in browser) |
| AD-06 | Staff edit modal: gender options are capitalised (invalid enum), and the address object is bound to a text input (`[object Object]`), so saving fails or corrupts data. | P1 | [C] + [V] probe 11 | Fixed (tested in browser) |
| AD-07 | Add member and add staff give no success/error feedback; the forms don't reset reliably. | P2 | [C] | Fixed (tested in browser) |
| AD-08 | Member Progress screens are hardcoded PHP leftovers and unreachable. | P2 | [C] | Open (screens remain unreachable; real progress tracking is roadmap Phase 6) |
| AD-09 | Five files import config from `../../frontend/src/...` (cross-app coupling; Vite dev `fs.strict` may block it). | P2 | [C] | Fixed (build verified) |
| AD-10 | `framer-motion` is used but not declared (resolved transitively). | P2 | [V] build | Fixed (declared) |
| AD-11 | `ToastContainer` is not mounted, so admin toasts never show. Page title is "Vite + React" with an empty favicon. | P3 | [C] | Fixed |
| AD-12 | Logout ignores the `confirm()` result. | P3 | [C] | Fixed (tested in browser) |
| AD-13 | Bundle is 1.5 MB (no code splitting). | P3 | [V] build | Open |

### 2.5 Functional bugs — frontend app

| ID | Issue | Severity | Evidence | Status |
|---|---|---|---|---|
| FE-01 | Login page "forget password" `<Link>` has no `to`. | P2 | [C] | Fixed |
| FE-02 | Forgot-password flow is fake (claims an OTP was sent). | P1 (misleading) | [C] | Fixed (replaced with an honest contact-the-gym page) |
| FE-03 | Mobile menu links point to non-existent anchors; its Login/Sign Up buttons do nothing. | P1 (mobile is the majority of gym traffic) | [C] | Fixed (tested in browser, mobile viewport) |
| FE-04 | Dead CTAs: hero CTA commented out; "Join Now", "Get Started Now" and "Join Us Today" have no action. | P1 (conversion) | [C] | Fixed (tested in browser) |
| FE-05 | Dead links: `/terms`, `/privacy`, `/personal-training`, `/nutrition-plans`, `/membership`; social `#`. | P2 | [C] | Fixed (dead links repointed or removed) |
| FE-06 | Newsletter form submits nowhere and reloads the page. | P2 | [C] | Fixed (non-functional form removed) |
| FE-07 | Customer logout ignores `confirm()`. Profile modal sends the password hash back. Modal `console.log(user)` logs stale state. | P2 | [C] | Fixed (tested in browser) |
| FE-08 | Hero background image is **9.1 MB** (also duplicated in `/public` and `/src/assets`). | P1 (performance) | [V] build | Fixed (verified: 9.1 MB → 152 kB in build output) |
| FE-09 | Signup has no client-side validation (phone must be 10 digits on the server) and no password rules. | P2 | [C] | Fixed (tested in browser) |
| FE-10 | Customer portal sidebar is fixed at `w-64` with no responsive layout; it is unusable on phones. | P2 | [C] | Fixed (layout changed; not visually verified on a phone) |
| FE-11 | No 404 route. | P3 | [C] | Fixed (tested in browser) |
| FE-12 | Contact phone is required in the UI but optional in the API (inconsistent). | P3 | [C] | Fixed |

### 2.6 Content and trust (P1: these affect legal and brand risk)

| ID | Issue | Status |
|---|---|---|
| CT-01 | Unverifiable claims on the About page: "30+ Awards & Recognitions", "5000+ Happy Clients", "98% Client Satisfaction", "10+ Years". | Fixed (claims removed; owner to supply real figures) |
| CT-02 | Testimonials are placeholders ("John Doe", "Jane Smith", "Emily Johnson"). Presenting them as real is misleading. | Fixed (section hidden until real reviews exist) |
| CT-03 | Contact page shows a personal Gmail address and `support@example.com`. | Partially fixed (placeholder support@example.com removed; personal Gmail still shown: needs decision) |
| CT-04 | Invoice/receipt branding: "Perfect GYM Club, 5021 Wetzel Lane, Williamsburg". | Fixed (tested in browser) |
| CT-05 | "Certified trainers", "24/7 access", "unlimited personal training" claims are not backed by data. | Partially fixed ("certified" wording removed; plan claims like "24/7 access" and "unlimited personal training" still need owner confirmation) |
| CT-06 | No pricing, location, opening hours or map on the public site. | Needs decision |

### 2.7 Code quality

- 105 ESLint problems (mostly unused imports). 2 are real `no-undef` runtime bugs (AD-01, AD-03).
- Typos in filenames and identifiers: `UserConroller`, `DashBorad`, `Memebers/`, `SatffList/SatffAdd`, `Annoucement`, `Testinomials`, `equipementRoutes`, `congif`. They are cosmetic; renaming is deferred to avoid churn.
- Duplication: announcement list markup ×3; `formatDate` ×8; dashboard charts reused as "Reports".
- `nodemon` as the production `start` script.
- No tests.

## 3. User-journey audit (persona walkthroughs; code-traced plus API probe)

| Persona | Journey result |
|---|---|
| First-time visitor | Learns the gym exists and sees four class types. **Cannot** find prices, location, hours, trainers or a free trial. The only conversion paths are Sign Up (which leads to a portal with nothing to buy) and the contact form (which works). On mobile, the navigation menu is broken. Trust is undermined by placeholder testimonials. |
| New member | Can register and log in, and lands on a portal containing a shared to-do list and announcements. **Cannot** choose or buy a plan, see a membership, or get an invoice. Is never billable (BL-03). |
| Existing member | No membership status, expiry, payment history, attendance or trainer information. Reminder page shows someone else's flag. Profile edit can escalate their own plan/status. |
| Admin | Can log in (or bypass login), but the member list is broken (AD-01), payment recording is impossible (BL-02) and the KPIs are fake. Equipment and announcements work. Staff edit corrupts data. |
| Trainer | No trainer role or login exists. |
| Edge cases | Expired membership is not enforced anywhere. Duplicate payment clicks are irrelevant (no payment flow). Member deletion crashes the payment page. Another member's data is accessible by changing `userId`. Two admins editing the same record: last write wins (no versioning). |

## 4. Page-by-page audit (summary)

| Area | Exists & working | Exists but defective | Missing (recommended) |
|---|---|---|---|
| Public | Contact | Home, About, Services modal, Login, Signup, Forgot password | **Pricing/Plans**, Trainers, Facilities/Gallery, Location & hours, Free trial booking, FAQ, Privacy, Terms, Refund policy, 404 |
| Member portal | Announcements | Dashboard, To-do, Reminder, Profile modal | **My Membership**, Payment history/invoices, Change password, Attendance, Workout plans |
| Admin | Equipment, Announcements | Dashboard, Members, Payments, Staff, Reports, Progress | **Membership plans**, Payment recording, Enquiry management, Attendance, Trainers/PT, Settings, Audit log |

## 5. Baseline health scores (before remediation)

Scores are expert estimates anchored to the verified findings above. They are not measurements.

| Dimension | Score | Basis |
|---|---|---|
| Frontend quality | 35 | Builds; many dead links/CTAs; broken mobile nav; 9 MB hero; placeholder content |
| Backend quality | 25 | Clean structure, but no auth, inconsistent responses, leaking errors, no validation on updates |
| Admin panel quality | 25 | 2 runtime bugs on core screens; payment flow non-functional; mock data presented as real |
| Database architecture | 30 | Missing membership entity; orphans; plaintext passwords; US-only validator |
| Security | 5 | Every endpoint public; admin self-registration; password hashes exposed; injection [all V] |
| Business logic | 15 | No membership period, no payment recording, unbillable members |
| User experience | 30 | Decent visual style; conversion journey dead-ends |
| Performance | 40 | 9 MB image; 1.5 MB admin bundle; otherwise small app |
| Testing coverage | 0 | No tests |
| **Overall product maturity** | **20** | Prototype / student-project stage |

## 6. Remediation summary (Batches 1–2, 2026-11-05)

### 6.1 Business-rule changes (made deliberately, flagged for review)

| Change | Before | After | Why | How to revert |
|---|---|---|---|---|
| Self-registered members start as **Pending** | `Active` with no payment | `Pending` until an admin records a payment and sets them Active | `Active` without any payment made membership status meaningless and inflated the "active members" KPI | `authController.signup`: change `status: 'Pending'` |
| Admin registration | Open to anyone, forever | Open only while zero admins exist; afterwards admin-only | SEC-03 | `routes/adminRoutes.js` |
| Member self-edit scope | Any field, including plan/status/amount/password | Name, username, contact, address | SEC-07 | `SELF_EDITABLE` in `UserConroller.js` |
| Payments on member deletion | Left as orphans that crashed the payment page | Kept as financial records, shown as "(deleted)" with the stored name | DB-02 | n/a |
| Admin password length (new admins only) | 6 | 8 | Admin accounts control everything | `adminController.createAdmin` |
| Placeholder testimonials, unverified stats, newsletter, social `#` links | Shown | Hidden or removed, with comments in code explaining how to restore | CT-01/02, FE-05/06 | See comments in `Home.jsx`, `AboutPage.jsx`, `Footer.jsx` |

**Existing data is preserved.**
- Legacy plaintext admin and member passwords keep working and are re-hashed on the next successful login (tested).
- Legacy owner-less to-do tasks are not deleted; they simply no longer appear to members.
- Legacy payments without invoice numbers display "—".

### 6.2 New findings during remediation

| ID | Issue | Severity | Status |
|---|---|---|---|
| NEW-01 | Font Awesome classes (`fas fa-*`) are used in ~15 files, but the icon font is never loaded, so those icons are invisible. | P2 | Partially fixed (removed from every screen touched; some remain in untouched files) |
| NEW-02 | Edit-member modal: `<select>` nested inside `<label>` produced unusable accessible names ("Plan Not set Basic…"). Found by the browser tests. | P2 | Fixed (tested in browser) |
| NEW-03 | Announcement with no date picked: the form sends `""`, which bypassed the schema default and failed validation. | P2 | Fixed (tested) |
| NEW-04 | No favicon on either UI (404 in the browser console). | P3 | Open |
| NEW-05 | Member entry form (admin) step 1 is not validated before "Next". The server rejects the record and the error is now shown, but the user must go back. | P3 | Partially fixed (contact and password are checked on submit) |
| NEW-06 | `backend/src/config/config.js` is now unused (the server reads `process.env` directly). | P3 | Open (harmless) |

## 7. Testing report

| Suite | How it was run | Result |
|---|---|---|
| Backend API (`backend/tests/*.test.js`): security, business logic, rate limiting | `npm test` (Node test runner + Supertest + in-memory MongoDB) | **32 / 32 passed** |
| Browser end-to-end: visitor, new member, admin, existing member, edge cases (29 steps) | Playwright driving Microsoft Edge (headless) against production builds of both UIs, the real API and an in-memory MongoDB | **29 / 29 passed**. The first runs failed 7 then 2 steps: 2 were selector bugs in the test script and 1 was a real accessibility defect (NEW-02), which was fixed. |
| Production builds | `vite build` (frontend, admin) | Pass |
| Lint | `eslint .` (frontend, admin) | **0 errors** (was 105). Remaining warnings: apostrophes in JSX text, one fast-refresh hint. `react/prop-types` is disabled because the project doesn't use PropTypes. |
| Startup configuration | `node server.js` without `JWT_SECRET` | Exits with a clear message (verified) |

Browser console during E2E: only `favicon.ico` 404s (NEW-04) and the expected 401s from the deliberate forged-token test.

**Not executed:**
- **Real MongoDB / production deployment.** Only an in-memory MongoDB 7-series binary was used. Run `npm test` against your MongoDB version before release.
- **Visual regression or real-device testing.** Only a 390 px mobile viewport in Edge was used.
- **Cross-browser testing.** Edge (Chromium) only.
- **Load testing.** The in-memory rate limiter is per-process; it is not suitable for multiple API instances.
- **Upgrade of an existing production database.** Migration of legacy plaintext passwords is covered by tests with inserted legacy records, not with a copy of real data.
- **Online payment gateway.** None exists (BL-12).
- **Frontend unit/component tests.** Coverage comes from the E2E journeys only. The E2E script lives outside the repo; adding it under `e2e/` with `@playwright/test` is a roadmap item.

## 8. Decisions needed from the owner

1. **Membership plans (BL-01/BL-04):** which plans exist, their duration (in months) and price, and whether Fitness/Sauna/Cardio are separate products or add-ons. Expiry, renewals and reminders all depend on this.
2. **Currency and prices (BL-05):** confirm INR. The admin "member entry" price hints ($55 / $35 / $40 per month) need real ₹ prices.
3. **Public content (CT-01/03/05/06):** real member count/years/awards (if any), testimonials with consent, a public contact email (currently a personal Gmail), address, opening hours and a map, and confirmation of plan claims ("24/7 access", "unlimited personal training").
4. **Online payments (BL-12):** whether to take payments online (Razorpay/Stripe) or keep front-desk payments only.
5. **Legal pages:** privacy policy, terms, and a refund/cancellation policy.
6. **Database index cleanup (DB-07):** approve dropping the old `fullname_1` unique index on `admins` (`db.admins.dropIndex("fullname_1")`). This is not destructive to data, but it is a production change, so it was not done automatically.

## 9. Updated health scores (after Batches 1–2)

| Dimension | Before | After | Basis for the change |
|---|---|---|---|
| Frontend quality | 35 | 62 | Working CTAs, mobile nav, 404, honest content, 152 kB hero; 0 lint errors. Still no pricing page, trainers or FAQ. |
| Backend quality | 25 | 70 | Auth layer, allow-lists, validation, safe errors, config checks, 32 tests. Still no service layer and inconsistent response shapes. |
| Admin panel quality | 25 | 65 | Payments, member management, staff edit and dashboard all real and browser-tested. Progress screens are still mock; no code splitting. |
| Database architecture | 30 | 50 | Hashing, ownership, invoice sequence, integrity on delete. Membership entity still missing. |
| Security | 5 | 72 | Every finding from the probe is fixed and covered by a test. Remaining: tokens in localStorage, per-process rate limiter, no audit log. |
| Business logic | 15 | 45 | Members are billable, payment recording works, idempotent, invoices are real. No membership period yet (needs decision). |
| User experience | 30 | 55 | Clear next steps for new members; working journeys. Missing pricing, location, trainers. |
| Performance | 40 | 60 | Hero 9.1 MB → 152 kB. Admin bundle still 1.5 MB. |
| Testing coverage | 0 | 55 | 32 API tests + 29 E2E steps (E2E not yet committed to the repo). |
| **Overall product maturity** | **20** | **55** | A secure, working core. Not yet a complete gym-management product: memberships, attendance, trainers and online payments are missing. |

These scores are expert estimates. "Before" scores are anchored to the verified defects in section 2; "after" scores are anchored to the tests in section 7.
