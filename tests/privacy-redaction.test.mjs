import test from "node:test";
import assert from "node:assert/strict";
import { redactClinicalText } from "../lib/privacy/redact.mjs";

test("removes explicit Korean clinical identifiers", () => {
  const result = redactClinicalText(
    "김테스트 환자 010-1234-5678, test@example.com. 경기도 안성시 공도읍 123 거주.",
    {
      caseId: "CASE-TEST-001",
      names: ["김테스트"],
      locations: ["공도읍"],
    },
  );

  assert.equal(result.caseId, "CASE-TEST-001");
  assert.doesNotMatch(result.redactedText, /김테스트/);
  assert.doesNotMatch(result.redactedText, /010-1234-5678/);
  assert.doesNotMatch(result.redactedText, /test@example.com/);
  assert.match(result.redactedText, /\[NAME\]/);
  assert.match(result.redactedText, /\[PHONE\]/);
  assert.match(result.redactedText, /\[EMAIL\]/);
});

test("flags likely indirect identifiers for manual review", () => {
  const result = redactClinicalText("회사 근무 중 최근 졸림이 심해졌다.");
  assert.equal(result.manualReview, true);
  assert.ok(result.residualFlags.includes("possible_indirect_identifier"));
});
