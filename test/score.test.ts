import assert from "node:assert/strict";
import test from "node:test";
import { buildCostReport, evaluateBudgets, summarizeProviderSpend } from "../src/score";
import { syntheticBudgets, syntheticProviders, syntheticUsageRecords } from "../src/seed";

test("summarizeProviderSpend sorts synthetic providers by spend descending", () => {
  const spend = summarizeProviderSpend(syntheticProviders, syntheticUsageRecords);

  assert.equal(spend.length, syntheticProviders.length);
  for (let index = 1; index < spend.length; index += 1) {
    assert.ok(spend[index - 1].costUsd >= spend[index].costUsd);
  }
});

test("evaluateBudgets creates warning or critical alerts for exceeded synthetic thresholds", () => {
  const alerts = evaluateBudgets(syntheticBudgets, syntheticUsageRecords);

  assert.ok(alerts.length >= 2);
  assert.ok(alerts.some((alert) => alert.budgetId === "budget_overall_ai" && alert.severity === "critical"));
  assert.ok(alerts.some((alert) => alert.scope === "developer-sandbox"));
});

test("buildCostReport includes spend, alerts, and recommendations", () => {
  const report = buildCostReport(syntheticProviders, syntheticUsageRecords, syntheticBudgets);

  assert.ok(report.totalSpendUsd > 0);
  assert.ok(report.providerSpend.some((provider) => provider.providerId === "openai-demo"));
  assert.ok(report.budgetAlerts.length > 0);
  assert.ok(report.insights.some((insight) => insight.id === "large-model-routing"));
});
