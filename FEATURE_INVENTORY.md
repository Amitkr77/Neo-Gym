# NeoGym — Feature Inventory

Status legend:
- **Working**: traced UI → API → DB and behaves correctly.
- **Partial**: works end-to-end but with significant defects.
- **Broken**: UI exists, but the flow fails.
- **UI-only**: the screen exists but no backend is wired (mock or hardcoded data).
- **API-only**: the endpoint exists but no UI uses it.
- **Missing**: required for a gym business but absent.

"Verified" means it was exercised against a running backend (in-memory MongoDB probe, 2026-11-05) or a build/lint run. "Code-traced" means it was established by reading source.

## A. Public website (frontend)

| Feature | Status | Evidence | Dependencies / notes |
|---|---|---|---|
| Home page (hero, about, classes, testimonials, CTA, footer) | Partial | Code-traced | Hero has no CTA (commented out). "Join Now"/"Get Started" buttons have no handler. Testimonials are placeholders (John Doe/Jane Smith). |
| About page | Partial | Code-traced | Unverifiable claims: "30+ Awards", "5000+ Happy Clients", "98% satisfaction". "Join Us Today" has no handler. |
| Services modal | Partial | Code-traced | "Learn More" links go to `/personal-training`, `/nutrition-plans`, `/membership`, none of which exist. |
| Membership plans / pricing page | Missing | — | Prices exist only inside the admin entry form ($55/$35/$40 per month). |
| Contact form → enquiry | Working | Verified (POST /api/contact 201) | Client requires phone; server does not. Links to `/terms`, `/privacy` (404). Personal Gmail used as public contact. |
| Newsletter subscribe | UI-only | Code-traced | `<form>` without handler; reloads page. |
| Social links | UI-only | Code-traced | All `href="#"`. |
| Mobile navigation | Broken | Code-traced | Anchors to `#home/#services/#about/#contact` that don't exist; Login/Sign Up buttons have no links. |
| Trainers, gallery, FAQ, location/map, free trial, blog, policy pages | Missing | — | |
| SEO (meta description, OG tags, favicon) | Missing | Code-traced | Favicon points to missing `/vite.svg`. |

## B. Member accounts and portal (frontend)

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Sign up | Partial | Verified | Works, but accepts `role` from the client, no password rules, no email field, and creates a member with no plan/service (cannot be billed). |
| Login | Partial | Verified | Returns a JWT that is never used. Vulnerable to NoSQL-operator injection. |
| Forgot password | UI-only | Code-traced | Pretends an OTP was sent. The Member model has no email. |
| "forget password" link on login | Broken | Code-traced | `<Link>` without `to`. |
| Route protection for `/Customer/*` | Missing | Code-traced | Anyone can open it; data loaded by `localStorage.userId`. |
| Profile view/edit modal | Partial | Code-traced | Sends the entire member document (including password hash, status, plan, amount) back to an unauthenticated PUT. |
| To-do list | Partial | Verified | Tasks are global; any member sees and deletes everyone's tasks. Edit is a `console.log`. |
| Payment reminder | Broken | Code-traced | Uses hardcoded member id `672cec3c41b32cfad25fbeb6`. |
| Announcements | Working | Verified | |
| Reports | UI-only | Code-traced | Renders the word "Reports"; hidden from the menu. |
| Logout | Partial | Code-traced | `confirm()` result ignored; it always logs out. |
| My membership (plan, start, expiry) | Missing | — | No expiry data exists. |
| Payment history / invoices | Missing | — | `GET /api/payment/:memberId` exists but is unused and unauthenticated. |
| Online purchase / renewal | Missing | — | No payment gateway. |
| Attendance history, workout plans, trainer info, PT bookings, classes, progress tracking | Missing | — | |
| Change password | Missing | — | |

## C. Admin panel

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Admin sign-up | Partial / **security defect** | Verified | Public; anyone can create an admin. Password stored in plaintext. |
| Admin login | Partial | Verified | Plaintext comparison, no token, no session, user enumeration ("Admin not found"). |
| Admin route guard | Missing | Code-traced | `/admin/*` is reachable without logging in. |
| Dashboard KPIs | Partial | Code-traced | Registered members/staff/equipment counts are real. Active members, earnings and active trainers are hardcoded. Announcements fail (wrong URL → 404). Enquiries list works but a fetch-error path references an undefined variable. |
| Dashboard / Reports charts | UI-only | Code-traced | Every series is hardcoded. |
| Member list + search | Broken | Lint `no-undef` + code-traced | `FRONTEND_URL` is not imported → list shows "FRONTEND_URL is not defined". Edit button does nothing. |
| Add member | Partial | Verified | Saves, but the password is plaintext so the member can never log in. No success/error UI. The amount is in $ while the dashboard uses ₹. |
| Manage member (edit/remove) | UI-only | Code-traced | Hardcoded mock rows; Remove/Edit only alter local state or alert. |
| Delete member | API-only | Verified | Leaves orphaned payments. |
| Payment list | Partial | Verified | Crashes on orphaned payments (`payment.member` is null). Empty list → API 404 → shown as an error. Reminder toggle ignores current state. |
| Record payment | Broken | Code-traced | PaymentForm posts to `userpay.php`; its button only navigates to the receipt. `POST /api/payment` has no caller. |
| Payment receipt / invoice | Partial | Code-traced | Random invoice number on every render. Branding copied from another gym ("Perfect GYM Club", Williamsburg). Validity periods contradict PaymentForm. Not persisted. |
| Equipment list/add/edit/delete | Partial | Verified | When there is no equipment, the list page hides the "Add Equipment" button (early return). `amount` stored as a string; "$" label. |
| Staff list/add/edit/delete | Partial | Verified | Indian 6-digit PIN codes are rejected. Edit modal sets gender to "Male" (bypasses the enum, since updates don't validate) and turns the address into "[object Object]". Password collected but discarded. No error UI on add. |
| Announcements create/list/delete | Working | Verified | No edit. Unauthenticated. |
| Enquiries (contact) list | Partial | Verified | Read-only; no status/follow-up. Public endpoint leaks PII. |
| Member progress | UI-only | Code-traced | Hardcoded names and PHP links; unreachable from the menu. |
| Membership plan management, attendance, trainers, PT, classes, coupons, invoices, expenses, revenue, roles/permissions, audit logs, settings, CMS, branches | Missing | — | |

## D. Backend capabilities

| Capability | Status | Notes |
|---|---|---|
| Authentication middleware | Missing | No endpoint checks a token. |
| Role-based authorization | Missing | |
| Input validation | Partial | Mongoose schema only; updates skip validators (except member PUT). |
| Rate limiting / lockout | Missing | Verified: 30 rapid bad logins were all processed. |
| Security headers / CORS policy | Missing | `cors()` allows all origins. |
| Error handling | Partial | Leaks `error.message`; invalid ObjectId → 500 instead of 400. |
| Notifications (email/SMS/WhatsApp) | Missing | `sendReminder` is a placeholder. |
| Background jobs (expiry, reminders) | Missing | |
| Payment gateway + verification | Missing | |
| Automated tests | Missing | |

## D2. [Updated 2026-11-05] Status after Batches 1–2

"Tested" means covered by `backend/tests` (API) and/or the 29-step browser E2E run (see AUDIT_REPORT §7).

| Feature | Was | Now |
|---|---|---|
| Sign up | Partial | **Working**: role ignored, validated, starts Pending (tested) |
| Login (member/admin) | Partial | **Working**: JWT, hashed passwords, injection-safe, rate-limited (tested) |
| Forgot password | UI-only (fake OTP) | Honest "contact the gym" page; staff can reset from Manage Members |
| Member portal route guard | Missing | **Working** (tested) |
| Profile edit | Partial (mass assignment) | **Working**, limited to safe fields (tested) |
| My Membership + payment history | Missing | **Working**: status, plan, last payment, invoices (tested) |
| To-do list | Partial (global) | **Working**, private per member (tested) |
| Reminder | Broken (hardcoded id) | **Working**, own reminder + dismiss (tested) |
| Home CTAs / mobile nav / 404 | Broken | **Working** (tested) |
| Admin route guard + sessions | Missing | **Working** (tested) |
| Admin first-run setup | Insecure | **Working**: open only until the first admin exists (tested) |
| Dashboard KPIs and charts | Hardcoded | **Working** from live data (tested) |
| Member list | Broken | **Working** (tested) |
| Manage members (edit/delete/reset password) | UI-only (mock) | **Working**, with a concurrent-edit warning (tested) |
| Record payment + receipt | Broken | **Working**: idempotent, persisted invoice numbers, printable (tested) |
| Payment list | Partial | **Working**: search, deleted-member safe, real reminder state (tested) |
| Staff add/edit | Partial | **Working**: Indian PIN, structured address, feedback (tested) |
| Equipment empty state | Partial | **Working** (tested) |
| Enquiries list | Partial (public PII) | **Working**, admin-only (tested) |
| Member progress (admin) | UI-only | Unchanged (deferred) |
| Membership plans/expiry, attendance, trainers/PT, classes, online payments, coupons, expenses | Missing | Missing (roadmap; several need owner decisions) |

## E. Counts (baseline)

| | Working | Partial | Broken | UI-only | API-only | Missing |
|---|---|---|---|---|---|---|
| Public site | 1 | 3 | 1 | 2 | 0 | 3 groups |
| Member portal | 1 | 4 | 3 | 2 | 0 | 6 groups |
| Admin | 1 | 8 | 2 | 3 | 1 | 1 large group |
