// Regression tests for the security findings in AUDIT_REPORT.md (SEC-*, DB-01).
import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  startTestServer, stopTestServer, resetDb, memberPayload, bearer,
  createAdminAndLogin, signupAndLogin, address,
} from "./helpers.js";

let api;
before(async () => { api = await startTestServer(); });
after(stopTestServer);
beforeEach(resetDb);

const raw = (name) => mongoose.connection.collection(name);

test("SEC-01: admin-only endpoints reject anonymous requests", async () => {
  for (const [method, url] of [
    ["get", "/api/member/users"], ["post", "/api/member/users"],
    ["get", "/api/staff"], ["get", "/api/equipment"], ["get", "/api/payment"],
    ["post", "/api/payment"], ["get", "/api/contact"], ["post", "/api/announcement"],
    ["get", "/api/task"],
  ]) {
    const res = await api[method](url).send({});
    assert.equal(res.status, 401, `${method.toUpperCase()} ${url} should be 401`);
  }
});

test("SEC-01: a member token cannot use admin endpoints", async () => {
  const { token } = await signupAndLogin(api);
  for (const url of ["/api/member/users", "/api/staff", "/api/payment", "/api/contact"]) {
    const res = await api.get(url).set(bearer(token));
    assert.equal(res.status, 403, `${url} should be 403 for members`);
  }
});

test("SEC-01: an admin token cannot use member-only endpoints and tampered tokens fail", async () => {
  const adminToken = await createAdminAndLogin(api);
  assert.equal((await api.get("/api/member/me").set(bearer(adminToken))).status, 403);
  assert.equal((await api.get("/api/member/users").set(bearer(adminToken + "x"))).status, 401);
});

test("SEC-02: member records never include the password", async () => {
  const adminToken = await createAdminAndLogin(api);
  const { token } = await signupAndLogin(api);
  const list = await api.get("/api/member/users").set(bearer(adminToken));
  assert.equal(list.status, 200);
  assert.equal(list.body.length, 1);
  assert.equal("password" in list.body[0], false);
  const me = await api.get("/api/member/me").set(bearer(token));
  assert.equal("password" in me.body, false);
});

test("SEC-03: admin registration is open only for the first admin", async () => {
  assert.equal((await api.get("/api/admin/setup-status")).body.registrationOpen, true);
  const ownerToken = await createAdminAndLogin(api);
  assert.equal((await api.get("/api/admin/setup-status")).body.registrationOpen, false);

  const anon = await api.post("/api/admin/register").send({ fullname: "Mallory", email: "m@x.io", password: "malloryPW1" });
  assert.equal(anon.status, 401);

  const byAdmin = await api.post("/api/admin/register").set(bearer(ownerToken))
    .send({ fullname: "Manager", email: "manager@neogym.test", password: "managerPW1" });
  assert.equal(byAdmin.status, 201);
});

test("SEC-04/05: admin passwords are hashed and login returns an admin token", async () => {
  const token = await createAdminAndLogin(api, "owner@neogym.test", "ownerpass1");
  assert.ok(token, "login should return a token");
  const stored = await raw("admins").findOne({ email: "owner@neogym.test" });
  assert.match(stored.password, /^\$2[aby]\$/);
  const me = await api.get("/api/admin/me").set(bearer(token));
  assert.equal(me.status, 200);
  assert.equal(me.body.admin.email, "owner@neogym.test");
});

test("SEC-04: a legacy plaintext admin can still log in and is upgraded to a hash", async () => {
  await raw("admins").insertOne({ fullname: "Legacy Admin", email: "legacy@neogym.test", password: "plainpass" });
  const ok = await api.post("/api/admin/login").send({ email: "legacy@neogym.test", password: "plainpass" });
  assert.equal(ok.status, 200);
  const stored = await raw("admins").findOne({ email: "legacy@neogym.test" });
  assert.match(stored.password, /^\$2[aby]\$/);
  const again = await api.post("/api/admin/login").send({ email: "legacy@neogym.test", password: "plainpass" });
  assert.equal(again.status, 200);
  const wrong = await api.post("/api/admin/login").send({ email: "legacy@neogym.test", password: "nope" });
  assert.equal(wrong.status, 401);
});

test("SEC-12: unknown admin email and wrong password give identical responses", async () => {
  await createAdminAndLogin(api);
  const unknown = await api.post("/api/admin/login").send({ email: "nobody@x.io", password: "whatever1" });
  const wrongPw = await api.post("/api/admin/login").send({ email: "owner@neogym.test", password: "whatever1" });
  assert.equal(unknown.status, 401);
  assert.deepEqual(unknown.body, wrongPw.body);
});

test("SEC-06/07: members only see and edit themselves; protected fields are ignored", async () => {
  const alice = await signupAndLogin(api);
  const bob = await signupAndLogin(api, { username: "bob", fullName: "Bob Example" });

  const me = await api.get("/api/member/me").set(bearer(alice.token));
  assert.equal(me.body.username, "alice");

  // A member can no longer read another member via the admin route.
  assert.equal((await api.get(`/api/member/users/${bob.id}`).set(bearer(alice.token))).status, 403);

  const upd = await api.put("/api/member/me").set(bearer(alice.token)).send({
    fullName: "Alice Renamed", status: "Active", plan: "premium", amount: 0, attendanceCount: 999, password: "hacked1",
  });
  assert.equal(upd.status, 200);
  assert.equal(upd.body.user.fullName, "Alice Renamed");
  assert.equal(upd.body.user.status, "Pending");
  assert.equal(upd.body.user.plan, undefined);
  assert.equal(upd.body.user.attendanceCount, 0);
  // Password unchanged.
  assert.equal((await api.post("/api/auth/login").send({ username: "alice", password: "secret12" })).status, 200);
});

test("SEC-08: object-valued credentials (NoSQL operator injection) are rejected", async () => {
  await signupAndLogin(api);
  const res = await api.post("/api/auth/login").send({ username: { $ne: null }, password: "secret12" });
  assert.equal(res.status, 400);
  assert.equal(res.body.token, undefined);
  const adminRes = await api.post("/api/admin/login").send({ email: { $ne: null }, password: { $ne: null } });
  assert.equal(adminRes.status, 401);
});

test("SEC-09: signup ignores client-supplied role and starts members as Pending", async () => {
  const res = await api.post("/api/auth/signup").send(memberPayload({ role: "admin", status: "Active" }));
  assert.equal(res.status, 201);
  const login = await api.post("/api/auth/login").send({ username: "alice", password: "secret12" });
  assert.equal(login.body.role, "member");
  const stored = await raw("members").findOne({ username: "alice" });
  assert.equal(stored.status, "Pending");
  assert.equal(stored.role, undefined);
  assert.match(stored.password, /^\$2[aby]\$/);
});

test("DB-01: members created by an admin are hashed and can log in", async () => {
  const adminToken = await createAdminAndLogin(api);
  const res = await api.post("/api/member/users").set(bearer(adminToken)).send({
    fullName: "Bob B", username: "bob", password: "bobpass1", gender: "male",
    contactNumber: "9876500000", address, status: "Active", plan: "basic",
    chosenService: "Fitness", amount: 55, dor: "2026-01-15",
  });
  assert.equal(res.status, 201);
  assert.equal("password" in res.body.user, false);
  assert.equal(new Date(res.body.user.dateOfRegistration).toISOString().slice(0, 10), "2026-01-15");
  const stored = await raw("members").findOne({ username: "bob" });
  assert.match(stored.password, /^\$2[aby]\$/);
  assert.equal((await api.post("/api/auth/login").send({ username: "bob", password: "bobpass1" })).status, 200);
});

test("DB-01: a legacy plaintext member can log in once and is upgraded", async () => {
  await raw("members").insertOne({
    fullName: "Old Member", username: "old", password: "oldpass1", gender: "male",
    contactNumber: "9876500001", address, status: "Active",
  });
  assert.equal((await api.post("/api/auth/login").send({ username: "old", password: "oldpass1" })).status, 200);
  const stored = await raw("members").findOne({ username: "old" });
  assert.match(stored.password, /^\$2[aby]\$/);
});

test("BL-07: to-do tasks are private to each member", async () => {
  const alice = await signupAndLogin(api);
  const bob = await signupAndLogin(api, { username: "bob", fullName: "Bob Example" });
  const created = await api.post("/api/task").set(bearer(alice.token)).send({ taskDesc: "Leg day x5", taskStatus: "Pending" });
  assert.equal(created.status, 201);

  assert.equal((await api.get("/api/task").set(bearer(bob.token))).body.length, 0);
  assert.equal((await api.delete(`/api/task/${created.body._id}`).set(bearer(bob.token))).status, 404);
  assert.equal((await api.get("/api/task").set(bearer(alice.token))).body.length, 1);
  assert.equal((await api.delete(`/api/task/${created.body._id}`).set(bearer(alice.token))).status, 200);
});

test("SEC-10: enquiries are public to submit but admin-only to read; empty list is 200", async () => {
  const adminToken = await createAdminAndLogin(api);
  const empty = await api.get("/api/contact").set(bearer(adminToken));
  assert.equal(empty.status, 200);
  assert.deepEqual(empty.body.data, []);
  const sent = await api.post("/api/contact").send({ firstName: "A", lastName: "B", email: "a@b.co", message: "Hi" });
  assert.equal(sent.status, 201);
  assert.equal((await api.get("/api/contact")).status, 401);
  assert.equal((await api.get("/api/contact").set(bearer(adminToken))).body.data.length, 1);
});

test("SEC-13/DB-08: malformed input gets a 400 without leaking internals", async () => {
  const adminToken = await createAdminAndLogin(api);
  const badId = await api.get("/api/member/users/not-an-id").set(bearer(adminToken));
  assert.equal(badId.status, 400);
  assert.equal(JSON.stringify(badId.body).includes("Cast to ObjectId"), false);

  const badJson = await api.post("/api/auth/login").set("Content-Type", "application/json").send("{bad json");
  assert.equal(badJson.status, 400);
});

test("SEC-14: security headers are set and x-powered-by is hidden", async () => {
  const res = await api.get("/api/health");
  assert.equal(res.status, 200);
  assert.equal(res.headers["x-content-type-options"], "nosniff");
  assert.equal(res.headers["x-frame-options"], "DENY");
  assert.equal(res.headers["x-powered-by"], undefined);
});
