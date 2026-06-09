import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCostReport,
  compareProviderModels,
  detectAnomalies,
  evaluateBudgets,
  summarizeProviderSpend
} from "../src/score";
import { syntheticBudgets, syntheticProjects, syntheticProviders, syntheticUsageRecords } from "../src/seed";

test("summarizeProviderSpend sorts synthetic providers by spend descending", () => {
  const spend = summarizeProviderSpend(syntheticProviders, syntheticUsageRecords);

  assert.equal(spend.length, syntheticProviders.length);
  for (let index = 1; index < spend.length; index += 1) {
    assert.ok(spend[index - 1].costUsd >= spend[index].costUsd);
  }
});

test("compareProviderModels returns provider/model cost comparison rows", () => {
  const comparisons = compareProviderModels(syntheticProviders, syntheticUsageRecords);

  assert.ok(comparisons.length > 0);
  assert.ok(comparisons.some((comparison) => comparison.model === "large-reasoning-demo"));
  assert.ok(comparisons.every((comparison) => comparison.unitCostUsd > 0));
});

test("evaluateBudgets creates warning or critical alerts for exceeded synthetic thresholds", () => {
  const alerts = evaluateBudgets(syntheticBudgets, syntheticProjects, syntheticUsageRecords);

  assert.ok(alerts.length >= 2);
  assert.ok(alerts.some((alert) => alert.budgetId === "budget_overall_ai" && alert.severity === "critical"));
  assert.ok(alerts.some((alert) => alert.scope === "project_developer_sandbox"));
  assert.ok(alerts.some((alert) => alert.scope === "Platform Engineering"));
});

test("detectAnomalies flags synthetic spend changes", () => {
  const anomalies = detectAnomalies(syntheticProjects, syntheticUsageRecords);

  assert.ok(anomalies.length > 0);
  assert.ok(anomalies.some((anomaly) => anomaly.scope === "Customer Copilot"));
});

test("buildCostReport includes spend, comparisons, alerts, anomalies, and recommendations", () => {
  const report = buildCostReport(syntheticProviders, syntheticProjects, syntheticUsageRecords, syntheticBudgets);

  assert.ok(report.totalSpendUsd > 0);
  assert.ok(report.providerSpend.some((provider) => provider.providerId === "openai-demo"));
  assert.ok(report.modelComparisons.length > 0);
  assert.ok(report.budgetAlerts.length > 0);
  assert.ok(report.anomalies.length > 0);
  assert.ok(report.insights.some((insight) => insight.id === "large-model-routing"));
  assert.ok(report.insights.some((insight) => insight.id === "model-comparison-routing"));
});
