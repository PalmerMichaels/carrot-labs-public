import assert from "node:assert/strict";
import test from "node:test";
import { syntheticBudgets, syntheticProjects, syntheticProviders, syntheticUsageRecords } from "../src/seed";
import type { BudgetPolicy, UsageRecord } from "../src/types";
import { validateBudget, validateDataset, validateUsageRecord } from "../src/validate";

test("bundled synthetic cost-management data is valid", () => {
  assert.deepEqual(validateDataset(syntheticProviders, syntheticProjects, syntheticUsageRecords, syntheticBudgets), []);
});

test("validateUsageRecord rejects negative synthetic spend", () => {
  const invalid: UsageRecord = { ...syntheticUsageRecords[0], costUsd: -1 };
  const issues = validateUsageRecord(invalid);

  assert.ok(issues.some((issue) => issue.path === "usageRecords[0].costUsd"));
});

test("validateUsageRecord rejects unsupported provider ids", () => {
  const invalid = { ...syntheticUsageRecords[0], providerId: "real-provider" };
  const issues = validateUsageRecord(invalid);

  assert.ok(issues.some((issue) => issue.path === "usageRecords[0].providerId"));
});

test("validateBudget requires critical threshold above warning threshold", () => {
  const invalid: BudgetPolicy = {
    ...syntheticBudgets[0],
    warningThresholdPct: 90,
    criticalThresholdPct: 80
  };
  const issues = validateBudget(invalid);

  assert.ok(issues.some((issue) => issue.path === "budgets[0].criticalThresholdPct"));
});

test("validateDataset rejects usage records that reference unknown synthetic projects", () => {
  const invalidRecords: UsageRecord[] = [{ ...syntheticUsageRecords[0], projectId: "project_missing" }];
  const issues = validateDataset(syntheticProviders, syntheticProjects, invalidRecords, syntheticBudgets);

  assert.ok(issues.some((issue) => issue.path === "usageRecords[0].projectId"));
});
