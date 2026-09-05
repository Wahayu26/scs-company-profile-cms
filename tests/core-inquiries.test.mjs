import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { normalizeInquiryQuery } from "../cms/core-inquiries.ts";
import { isSameCMSOrigin, parseInquiryStatus, validInquiryReference } from "../cms/inquiry-status.ts";

test("consultation filters default to a safe first page", () => {
  assert.deepEqual(normalizeInquiryQuery(undefined), { query: "", status: "", page: 1 });
  assert.deepEqual(normalizeInquiryQuery({ page: "0", status: "unknown" }), { query: "", status: "", page: 1 });
});

test("consultation filters normalize supported input", () => {
  assert.deepEqual(
    normalizeInquiryQuery({ q: ["  ACME  ", "ignored"], status: "contacted", page: "3" }),
    { query: "ACME", status: "CONTACTED", page: 3 },
  );
});

test("consultation search is bounded", () => {
  assert.equal(normalizeInquiryQuery({ q: "x".repeat(200) }).query.length, 120);
});

test("consultation status updates accept only the workflow values", () => {
  assert.equal(parseInquiryStatus("CONTACTED"), "CONTACTED");
  for (const value of ["contacted", "SPAM", "", null, 1]) assert.equal(parseInquiryStatus(value), null);
});

test("consultation references and mutation origins are constrained", () => {
  assert.equal(validInquiryReference("SCS-2026-U27ZK9"), true);
  assert.equal(validInquiryReference("../inquiries"), false);
  assert.equal(
    isSameCMSOrigin(new Request("https://cms.sigmacore.id/api", { headers: { origin: "https://cms.sigmacore.id" } }), "https://cms.sigmacore.id/admin"),
    true,
  );
  assert.equal(
    isSameCMSOrigin(new Request("https://cms.sigmacore.id/api", { headers: { origin: "https://evil.example" } }), "https://cms.sigmacore.id"),
    false,
  );
});

test("consultation audit migration is transactional and idempotent", async () => {
  const sql = await readFile(new URL("../cms/migrations/core/20260905_inquiry_status_audit.sql", import.meta.url), "utf8");
  assert.match(sql, /^BEGIN;/);
  assert.match(sql, /CREATE TABLE IF NOT EXISTS inquiry_status_history/);
  assert.match(sql, /CREATE INDEX IF NOT EXISTS/);
  assert.match(sql, /WHERE NOT EXISTS/);
  assert.match(sql, /changed_by_user_id/);
  assert.match(sql, /changed_by_name/);
  assert.match(sql, /COMMIT;\s*$/);
});
