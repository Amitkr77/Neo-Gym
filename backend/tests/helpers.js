// Shared test harness: in-memory MongoDB + the real Express app (no network listener).
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";

process.env.JWT_SECRET ||= "test-secret-that-is-long-enough-for-tests-0123456789";
process.env.LOGIN_RATE_LIMIT ||= "1000";
process.env.SIGNUP_RATE_LIMIT ||= "1000";
process.env.CONTACT_RATE_LIMIT ||= "1000";

let mongod;

export const startTestServer = async () => {
  mongod = await MongoMemoryServer.create({ instance: { launchTimeout: 120000 } });
  await mongoose.connect(mongod.getUri());
  const { createApp } = await import("../src/app.js");
  // Ensure unique indexes exist before tests rely on them.
  await Promise.all(Object.values(mongoose.models).map((m) => m.init()));
  return request(createApp());
};

export const stopTestServer = async () => {
  await mongoose.disconnect();
  if (mongod) await mongod.stop();
};

export const resetDb = async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
};

export const address = { street: "1 MG Road", city: "Pune", state: "MH", zipCode: "411001" };

export const memberPayload = (overrides = {}) => ({
  username: "alice",
  password: "secret12",
  fullName: "Alice Example",
  contactNumber: "9876543210",
  gender: "female",
  address,
  ...overrides,
});

export const bearer = (token) => ({ Authorization: `Bearer ${token}` });

// Bootstraps the first admin (open registration) and returns its token.
export const createAdminAndLogin = async (api, email = "owner@neogym.test", password = "ownerpass1") => {
  await api.post("/api/admin/register").send({ fullname: "Gym Owner", email, password });
  const res = await api.post("/api/admin/login").send({ email, password });
  return res.body.token;
};

export const signupAndLogin = async (api, overrides = {}) => {
  const payload = memberPayload(overrides);
  await api.post("/api/auth/signup").send(payload);
  const res = await api.post("/api/auth/login").send({ username: payload.username, password: payload.password });
  return { token: res.body.token, id: res.body.userId };
};
