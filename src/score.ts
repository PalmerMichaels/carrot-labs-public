import type { BudgetAlert, BudgetPolicy, CostInsight, CostReport, ProviderAccount, ProviderSpend, UsageRecord } from "./types";
import { assertValidDataset } from "./validate";

function roundUsd(value: number): number {
  return Math.round(value * 100) / 100;
}

function sumSpend(records: UsageRecord[]): number {
  return roundUsd(records.reduce((sum, record) => sum + record.costUsd, 0));
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

function recordsForBudget(budget: BudgetPolicy, usageRecords: UsageRecord[]): UsageRecord[] {
  return usageRecords.filter((record) => {
    if (budget.providerId && record.providerId !== budget.providerId) {
      return false;
    }

    if (budget.project && record.project !== budget.project) {
      return false;
    }

    return true;
  });
}

export function evaluateBudgets(budgets: BudgetPolicy[], usageRecords: UsageRecord[]): BudgetAlert[] {
  return budgets.flatMap((budget) => {
    const spendUsd = sumSpend(recordsForBudget(budget, usageRecords));
    const thresholdPct = roundUsd((spendUsd / budget.monthlyLimitUsd) * 100);

    if (thresholdPct < budget.warningThresholdPct) {
      return [];
    }

    const severity = thresholdPct >= budget.criticalThresholdPct ? "critical" : "warning";
    const scope = budget.providerId ?? budget.project ?? "all providers";

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

export function generateInsights(providerSpend: ProviderSpend[], usageRecords: UsageRecord[]): CostInsight[] {
  const insights: CostInsight[] = [];
  const totalSpend = sumSpend(usageRecords);
  const topProvider = providerSpend[0];
  const nonProductionSpend = sumSpend(usageRecords.filter((record) => record.environment !== "production"));
  const repeatedExpensiveModel = usageRecords.filter((record) => record.model === "large-reasoning-demo");
  const repeatedExpensiveSpend = sumSpend(repeatedExpensiveModel);

  if (topProvider && totalSpend > 0 && topProvider.costUsd / totalSpend >= 0.45) {
    insights.push({
      id: "provider-concentration",
      title: "Provider spend concentration",
      detail: `${topProvider.displayName} represents ${roundUsd((topProvider.costUsd / totalSpend) * 100)}% of synthetic AI spend. Review routing and fallback policies across providers.`,
      impact: "medium",
      estimatedMonthlySavingsUsd: roundUsd(topProvider.costUsd * 0.08)
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

  if (repeatedExpensiveSpend >= 4000) {
    insights.push({
      id: "large-model-routing",
      title: "Large-model routing opportunity",
      detail: "Repeated synthetic large-model usage is a candidate for prompt caching, smaller model routing, or batch evaluation before production rollout.",
      impact: "high",
      estimatedMonthlySavingsUsd: roundUsd(repeatedExpensiveSpend * 0.18)
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

export function buildCostReport(providers: ProviderAccount[], usageRecords: UsageRecord[], budgets: BudgetPolicy[]): CostReport {
  assertValidDataset(providers, usageRecords, budgets);

  const providerSpend = summarizeProviderSpend(providers, usageRecords);

  return {
    generatedAt: new Date().toISOString(),
    totalSpendUsd: sumSpend(usageRecords),
    providerSpend,
    budgetAlerts: evaluateBudgets(budgets, usageRecords),
    insights: generateInsights(providerSpend, usageRecords)
  };
}
