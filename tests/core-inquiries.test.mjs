import assert from "node:assert/strict";
import test from "node:test";

import { normalizeInquiryQuery } from "../cms/core-inquiries.ts";

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
