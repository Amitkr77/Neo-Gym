// SEC-11: login rate limiting (separate file = separate process, so the limit is isolated).
process.env.LOGIN_RATE_LIMIT = "3";

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { startTestServer, stopTestServer } from "./helpers.js";

let api;
before(async () => { api = await startTestServer(); });
after(stopTestServer);

test("SEC-11: repeated member login attempts are throttled with 429", async () => {
  const statuses = [];
  for (let i = 0; i < 5; i++) {
    statuses.push((await api.post("/api/auth/login").send({ username: "x", password: "y" })).status);
  }
  assert.deepEqual(statuses, [400, 400, 400, 429, 429]);
});

test("SEC-11: admin login is throttled independently", async () => {
  const statuses = [];
  for (let i = 0; i < 4; i++) {
    statuses.push((await api.post("/api/admin/login").send({ email: "a@b.co", password: "y" })).status);
  }
  assert.deepEqual(statuses, [401, 401, 401, 429]);
});
