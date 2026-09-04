import assert from "node:assert/strict";
import test from "node:test";

import { cmsAuthOrigin, websiteOrigin } from "../cms/auth-origin.ts";
import { ensureFirstAdmin } from "../cms/first-admin.ts";
import { adminOrSelf, canAccessCMS, canSetRole, isCMSAdmin } from "../cms/user-access.ts";
import { requestCMSLogout } from "../cms/components/logout-request.mjs";

test("CMS and website origins are separate and validated", () => {
  assert.equal(cmsAuthOrigin({ PAYLOAD_SERVER_URL: "https://cms.sigmacore.id/" }), "https://cms.sigmacore.id");
  assert.equal(websiteOrigin({ WEBSITE_URL: "https://sigmacore.id/" }), "https://sigmacore.id");
  assert.equal(cmsAuthOrigin({}), "http://localhost:3101");
  assert.equal(websiteOrigin({}), "http://localhost:3000");

  for (const value of ["*", "javascript:alert(1)", "https://user:pass@cms.test", "https://cms.test/path"]) {
    assert.throws(() => cmsAuthOrigin({ PAYLOAD_SERVER_URL: value }));
    assert.throws(() => websiteOrigin({ WEBSITE_URL: value }));
  }
});

test("first account becomes admin but later accounts do not", async () => {
  const data = { name: "QA", role: "editor" };
  const req = { user: null, payload: { count: async () => ({ totalDocs: 0 }) } };
  assert.equal((await ensureFirstAdmin({ data, operation: "create", req })).role, "admin");
  req.payload.count = async () => ({ totalDocs: 1 });
  assert.equal((await ensureFirstAdmin({ data, operation: "create", req })).role, "editor");
});

test("editors cannot manage accounts or roles", () => {
  const admin = { req: { user: { id: 1, collection: "users", role: "admin" } } };
  const editor = { req: { user: { id: 2, collection: "users", role: "editor" } } };
  assert.equal(isCMSAdmin(admin), true);
  assert.equal(canSetRole(admin), true);
  assert.equal(adminOrSelf(admin), true);
  assert.equal(canAccessCMS(editor), true);
  assert.equal(isCMSAdmin(editor), false);
  assert.equal(canSetRole(editor), false);
  assert.deepEqual(adminOrSelf(editor), { id: { equals: 2 } });
});

test("logout uses a credentialed POST request", async () => {
  await requestCMSLogout("/api/users", async (url, options) => {
    assert.equal(url, "/api/users/logout");
    assert.deepEqual(options, { method: "POST", credentials: "include", cache: "no-store" });
    return { ok: true };
  });
});
