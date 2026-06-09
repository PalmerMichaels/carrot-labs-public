import type {
  AnomalyFinding,
  BudgetAlert,
  BudgetPolicy,
  CostInsight,
  CostReport,
  ModelComparison,
  ProviderAccount,
  ProviderSpend,
  TeamProject,
  UsageRecord
} from "./types";
import { assertValidDataset } from "./validate";

function roundUsd(value: number): number {
  return Math.round(value * 100) / 100;
}

function roundUnitCost(value: number): number {
  return Math.round(value * 1_000_000_000) / 1_000_000_000;
}

function sumSpend(records: UsageRecord[]): number {
  return roundUsd(records.reduce((sum, record) => sum + record.costUsd, 0));
}

function projectFor(projects: TeamProject[], projectId: string): TeamProject | undefined {
  return projects.find((project) => project.id === projectId);
}

export function summarizeProviderSpend(providers: ProviderAccount[], usageRecords: UsageRecord[]): ProviderSpend[] {
  return providers
    .map((provider) => {
      const records = usageRecords.filter((record) => record.providerId === provider.id);
      return {
        providerId: provider.id,
        displayName: provider.displayName,
        costUsd: sumSpend(records),
        usageRecords: records.length
      };
    })
    .sort((left, right) => right.costUsd - left.costUsd);
}

export function compareProviderModels(providers: ProviderAccount[], usageRecords: UsageRecord[]): ModelComparison[] {
  const providerNames = new Map(providers.map((provider) => [provider.id, provider.displayName]));
  const grouped = new Map<string, UsageRecord[]>();

  for (const record of usageRecords) {
    const key = [record.providerId, record.model, record.unit].join("::");
    grouped.set(key, [...(grouped.get(key) ?? []), record]);
  }

  return [...grouped.entries()]
    .map(([key, records]) => {
      const [providerId, model, unit] = key.split("::") as [ProviderAccount["id"], string, ModelComparison["unit"]];
      const quantity = records.reduce((sum, record) => sum + record.quantity, 0);
      const costUsd = sumSpend(records);

      return {
        providerId,
        providerName: providerNames.get(providerId) ?? providerId,
        model,
        unit,
        quantity,
        costUsd,
        unitCostUsd: roundUnitCost(costUsd / quantity)
      };
    })
    .sort((left, right) => right.costUsd - left.costUsd);
}

function recordsForBudget(budget: BudgetPolicy, projects: TeamProject[], usageRecords: UsageRecord[]): UsageRecord[] {
  return usageRecords.filter((record) => {
    const project = projectFor(projects, record.projectId);

    if (budget.providerId && record.providerId !== budget.providerId) {
      return false;
    }

    if (budget.projectId && record.projectId !== budget.projectId) {
      return false;
    }

    if (budget.team && project?.team !== budget.team) {
      return false;
    }

    return true;
  });
}

function budgetScope(budget: BudgetPolicy): string {
  return budget.providerId ?? budget.projectId ?? budget.team ?? "all providers";
}

export function evaluateBudgets(budgets: BudgetPolicy[], projects: TeamProject[], usageRecords: UsageRecord[]): BudgetAlert[] {
  return budgets.flatMap((budget) => {
    const spendUsd = sumSpend(recordsForBudget(budget, projects, usageRecords));
    const thresholdPct = roundUsd((spendUsd / budget.monthlyLimitUsd) * 100);

    if (thresholdPct < budget.warningThresholdPct) {
      return [];
    }

    const severity = thresholdPct >= budget.criticalThresholdPct ? "critical" : "warning";
    const scope = budgetScope(budget);

    return [
      {
        budgetId: budget.id,
        scope,
        spendUsd,
        monthlyLimitUsd: budget.monthlyLimitUsd,
        thresholdPct,
        severity,
        message: `${scope} is at ${thresholdPct}% of its synthetic monthly budget`
      }
    ];
  });
}

export function detectAnomalies(projects: TeamProject[], usageRecords: UsageRecord[]): AnomalyFinding[] {
  const grouped = new Map<string, UsageRecord[]>();

  for (const record of usageRecords) {
    grouped.set(record.projectId, [...(grouped.get(record.projectId) ?? []), record]);
  }

  return [...grouped.entries()].flatMap(([projectId, records]) => {
    if (records.length < 2) {
      return [];
    }

    const sorted = [...records].sort((left, right) => Date.parse(left.occurredAt) - Date.parse(right.occurredAt));
    const observed = sorted[sorted.length - 1];
    const baselineRecords = sorted.slice(0, -1);
    const baselineCostUsd = roundUsd(sumSpend(baselineRecords) / baselineRecords.length);
    const observedCostUsd = observed.costUsd;
    const changePct = baselineCostUsd > 0 ? roundUsd(((observedCostUsd - baselineCostUsd) / baselineCostUsd) * 100) : 0;
    const project = projectFor(projects, projectId);

    if (changePct < 25 && observedCostUsd < 1000) {
      return [];
    }

    return [
      {
        id: `anomaly_${projectId}`,
        scope: project?.name ?? projectId,
        severity: changePct >= 50 || observedCostUsd >= 1000 ? "warning" : "info",
        baselineCostUsd,
        observedCostUsd,
        changePct,
        message: `${project?.name ?? projectId} latest synthetic spend changed ${changePct}% from its prior average`
      }
    ];
  });
}

export function generateInsights(
  providerSpend: ProviderSpend[],
  modelComparisons: ModelComparison[],
  anomalies: AnomalyFinding[],
  usageRecords: UsageRecord[]
): CostInsight[] {
  const insights: CostInsight[] = [];
  const totalSpend = sumSpend(usageRecords);
  const topProvider = providerSpend[0];
  const nonProductionSpend = sumSpend(usageRecords.filter((record) => record.environment !== "production"));
  const largeModelSpend = sumSpend(usageRecords.filter((record) => record.model === "large-reasoning-demo"));
  const topModel = modelComparisons[0];

  if (topProvider && totalSpend > 0 && topProvider.costUsd / totalSpend >= 0.45) {
    insights.push({
      id: "provider-concentration",
      title: "Provider spend concentration",
      detail: `${topProvider.displayName} represents ${roundUsd((topProvider.costUsd / totalSpend) * 100)}% of synthetic AI spend. Review routing and fallback policies across providers.`,
      impact: "medium",
      estimatedMonthlySavingsUsd: roundUsd(topProvider.costUsd * 0.08)
    });
  }

  if (topModel) {
    insights.push({
      id: "model-comparison-routing",
      title: "Provider/model comparison review",
      detail: `${topModel.providerName} ${topModel.model} is the largest synthetic model/API cost bucket. Compare it with lower-cost routes before expanding usage.`,
      impact: "medium",
      estimatedMonthlySavingsUsd: roundUsd(topModel.costUsd * 0.1)
    });
  }

  if (nonProductionSpend >= 1000) {
    insights.push({
      id: "non-production-spend",
      title: "Non-production spend guardrail",
      detail: `Synthetic staging/development workloads account for $${nonProductionSpend.toLocaleString("en-US")}. Add tighter budgets or scheduled shutdowns for non-production projects.`,
      impact: "high",
      estimatedMonthlySavingsUsd: roundUsd(nonProductionSpend * 0.35)
    });
  }

  if (largeModelSpend >= 4000) {
    insights.push({
      id: "large-model-routing",
      title: "Large-model routing opportunity",
      detail: "Repeated synthetic large-model usage is a candidate for prompt caching, smaller model routing, or batch evaluation before production rollout.",
      impact: "high",
      estimatedMonthlySavingsUsd: roundUsd(largeModelSpend * 0.18)
    });
  }

  if (anomalies.length > 0) {
    const anomalySpend = anomalies.reduce((sum, anomaly) => sum + anomaly.observedCostUsd, 0);
    insights.push({
      id: "anomaly-review",
      title: "Anomaly review",
      detail: `${anomalies.length} synthetic spend anomaly finding(s) should be reviewed before the next budget cycle.`,
      impact: "medium",
      estimatedMonthlySavingsUsd: roundUsd(anomalySpend * 0.12)
    });
  }

  const lowUtilizationProviders = providerSpend.filter((provider) => provider.costUsd > 0 && provider.costUsd < 500);
  for (const provider of lowUtilizationProviders) {
    insights.push({
      id: `low-utilization-${provider.providerId}`,
      title: "Low-utilization provider review",
      detail: `${provider.displayName} has low synthetic spend. Confirm whether the account is needed or should have stricter budget caps.`,
      impact: "low",
      estimatedMonthlySavingsUsd: roundUsd(provider.costUsd * 0.2)
    });
  }

  return insights.sort((left, right) => right.estimatedMonthlySavingsUsd - left.estimatedMonthlySavingsUsd);
}

export function buildCostReport(
  providers: ProviderAccount[],
  projects: TeamProject[],
  usageRecords: UsageRecord[],
  budgets: BudgetPolicy[]
): CostReport {
  assertValidDataset(providers, projects, usageRecords, budgets);

  const providerSpend = summarizeProviderSpend(providers, usageRecords);
  const modelComparisons = compareProviderModels(providers, usageRecords);
  const anomalies = detectAnomalies(projects, usageRecords);

  return {
    generatedAt: new Date().toISOString(),
    totalSpendUsd: sumSpend(usageRecords),
    providerSpend,
    modelComparisons,
    budgetAlerts: evaluateBudgets(budgets, projects, usageRecords),
    anomalies,
    insights: generateInsights(providerSpend, modelComparisons, anomalies, usageRecords)
  };
}
