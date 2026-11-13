// Regression tests for payment, data-integrity and validation findings (BL-*, DB-*).
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  startTestServer, stopTestServer, resetDb, bearer, createAdminAndLogin, signupAndLogin, address,
} from "./helpers.js";

let api;
let adminToken;
before(async () => { api = await startTestServer(); });
after(stopTestServer);
beforeEach(async () => {
  await resetDb();
  adminToken = await createAdminAndLogin(api);
});

const admin = () => bearer(adminToken);
const payments = () => mongoose.connection.collection("payments");

const createMemberAsAdmin = (overrides = {}) =>
  api.post("/api/member/users").set(admin()).send({
    fullName: "Bob B", username: "bob", password: "bobpass1", gender: "male",
    contactNumber: "9876500000", address, status: "Active", plan: "basic",
    chosenService: "Fitness", amount: 1500, ...overrides,
  });

test("BL-03: a self-registered member (no plan/service) can be billed", async () => {
  const alice = await signupAndLogin(api);
  const res = await api.post("/api/payment").set(admin()).send({
    memberId: alice.id, amountPaid: 1500, paymentDate: "2026-11-01", method: "upi",
  });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  assert.match(res.body.payment.invoiceNumber, /^NG-2026-\d{6}$/);
  assert.equal(res.body.payment.memberName, "Alice Example");

  const me = await api.get("/api/member/me").set(bearer(alice.token));
  assert.equal(new Date(me.body.paidDate).toISOString().slice(0, 10), "2026-11-01");
  assert.equal(me.body.status, "Pending", "status must not change unless explicitly requested");
});

test("BL-02: the admin can set the member status explicitly while recording a payment", async () => {
  const alice = await signupAndLogin(api);
  await api.post("/api/payment").set(admin()).send({ memberId: alice.id, amountPaid: 1500, memberStatus: "Active" });
  const me = await api.get("/api/member/me").set(bearer(alice.token));
  assert.equal(me.body.status, "Active");
});

test("DB-05: invalid amounts, members, methods and dates are rejected", async () => {
  const alice = await signupAndLogin(api);
  for (const body of [
    { memberId: alice.id, amountPaid: -5000 },
    { memberId: alice.id, amountPaid: 0 },
    { memberId: alice.id, amountPaid: "abc" },
    { memberId: "not-an-id", amountPaid: 100 },
    { memberId: alice.id, amountPaid: 100, method: "bitcoin" },
    { memberId: alice.id, amountPaid: 100, paymentDate: "not-a-date" },
    { memberId: alice.id, amountPaid: 100, memberStatus: "VIP" },
  ]) {
    const res = await api.post("/api/payment").set(admin()).send(body);
    assert.equal(res.status, 400, `expected 400 for ${JSON.stringify(body)}`);
  }
  const missing = await api.post("/api/payment").set(admin())
    .send({ memberId: new mongoose.Types.ObjectId().toString(), amountPaid: 100 });
  assert.equal(missing.status, 404);
  assert.equal(await payments().countDocuments(), 0);
});

test("Edge case: double-clicking 'Record payment' creates exactly one payment", async () => {
  const alice = await signupAndLogin(api);
  const body = { memberId: alice.id, amountPaid: 1500, idempotencyKey: "click-123" };
  const results = await Promise.all([1, 2, 3].map(() => api.post("/api/payment").set(admin()).send(body)));
  assert.deepEqual(results.map((r) => r.status).sort(), [200, 200, 201]);
  assert.equal(await payments().countDocuments(), 1);
});

test("BL-06: invoice numbers are persistent, sequential and unique", async () => {
  const alice = await signupAndLogin(api);
  const nums = [];
  for (let i = 0; i < 3; i++) {
    const res = await api.post("/api/payment").set(admin()).send({ memberId: alice.id, amountPaid: 100 + i });
    nums.push(res.body.payment.invoiceNumber);
  }
  assert.equal(new Set(nums).size, 3);
  const seqs = nums.map((n) => Number(n.split("-")[2]));
  assert.deepEqual(seqs, [seqs[0], seqs[0] + 1, seqs[0] + 2]);

  const fetched = await api.get(`/api/payment/${(await payments().findOne({ invoiceNumber: nums[1] }))._id}`).set(admin());
  assert.equal(fetched.body.payment.invoiceNumber, nums[1]);
});

test("DB-06: the registration payment is created once, not on every save", async () => {
  const created = await createMemberAsAdmin();
  assert.equal(created.status, 201);
  assert.equal(await payments().countDocuments(), 1);

  const Member = mongoose.model("Member");
  const doc = await Member.findById(created.body.user._id);
  doc.currentWeight = 70;
  await doc.save();
  assert.equal(await payments().countDocuments(), 1);
});

test("DB-02 / AD-03: payments survive member deletion and the list never 404s", async () => {
  const empty = await api.get("/api/payment").set(admin());
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.body.payments, []);

  const created = await createMemberAsAdmin();
  await api.delete(`/api/member/users/${created.body.user._id}`).set(admin());
  const list = await api.get("/api/payment").set(admin());
  assert.equal(list.status, 200);
  assert.equal(list.body.payments.length, 1);
  assert.equal(list.body.payments[0].member, null);
  assert.equal(list.body.payments[0].memberName, "Bob B");
});

test("Members see only their own payment history", async () => {
  const alice = await signupAndLogin(api);
  const bob = await signupAndLogin(api, { username: "bob", fullName: "Bob Example" });
  await api.post("/api/payment").set(admin()).send({ memberId: alice.id, amountPaid: 100 });
  await api.post("/api/payment").set(admin()).send({ memberId: bob.id, amountPaid: 200 });
  const mine = await api.get("/api/payment/me").set(bearer(alice.token));
  assert.equal(mine.status, 200);
  assert.deepEqual(mine.body.payments.map((p) => p.amountPaid), [100]);
});

test("Reminder: admin sets it, the member can only dismiss it", async () => {
  const alice = await signupAndLogin(api);
  assert.equal((await api.put(`/api/member/users/${alice.id}/reminder`).set(admin()).send({ reminder: "yes" })).status, 400);
  const on = await api.put(`/api/member/users/${alice.id}/reminder`).set(admin()).send({ reminder: true });
  assert.equal(on.body.reminder, true);
  const off = await api.put("/api/member/me/reminder/dismiss").set(bearer(alice.token));
  assert.equal(off.body.reminder, false);
});

test("DB-04: staff accept Indian PIN codes; DB-03: updates are validated", async () => {
  const staff = await api.post("/api/staff").set(admin()).send({
    fullname: "Trainer One", username: "t1", email: "t1@neogym.test", contact: "9876543210",
    address, designation: "trainer", gender: "male",
  });
  assert.equal(staff.status, 201, JSON.stringify(staff.body));
  const bad = await api.put(`/api/staff/${staff.body._id}`).set(admin()).send({ gender: "Male", designation: "janitor" });
  assert.equal(bad.status, 400);
  const good = await api.put(`/api/staff/${staff.body._id}`).set(admin()).send({ designation: "manager" });
  assert.equal(good.status, 200);
  assert.equal(good.body.designation, "manager");
});

test("Admin member update: allow-listed fields, validated, password re-hashed", async () => {
  const created = await createMemberAsAdmin();
  const id = created.body.user._id;
  const bad = await api.put(`/api/member/users/${id}`).set(admin()).send({ plan: "platinum" });
  assert.equal(bad.status, 400);
  const ok = await api.put(`/api/member/users/${id}`).set(admin()).send({ plan: "premium", password: "newpass99" });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.user.plan, "premium");
  assert.equal((await api.post("/api/auth/login").send({ username: "bob", password: "newpass99" })).status, 200);
});

test("Announcements: public read, admin write, blank date defaults to today", async () => {
  const res = await api.post("/api/announcement").set(admin()).send({ message: "Gym closed on Sunday", appliedDate: "" });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  const list = await api.get("/api/announcement");
  assert.equal(list.status, 200);
  assert.equal(list.body.data.length, 1);
  assert.equal((await api.post("/api/announcement").send({ message: "spam" })).status, 401);
});

test("Duplicate username on signup is rejected cleanly", async () => {
  await signupAndLogin(api);
  const dup = await api.post("/api/auth/signup").send({
    username: "alice", password: "secret12", fullName: "Other", contactNumber: "9876543219", gender: "male", address,
  });
  assert.equal(dup.status, 400);
});
