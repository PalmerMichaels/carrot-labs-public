export type ProviderKey = "openai-demo" | "anthropic-demo" | "google-demo" | "mistral-demo";

export type UsageUnit = "tokens" | "requests" | "images";

export type AlertSeverity = "info" | "warning" | "critical";

export type RecommendationImpact = "low" | "medium" | "high";

export interface ProviderAccount {
  id: ProviderKey;
  displayName: string;
  accountLabel: string;
  currency: "USD";
  readOnly: true;
}

export interface UsageRecord {
  id: string;
  providerId: ProviderKey;
  project: string;
  model: string;
  unit: UsageUnit;
  quantity: number;
  costUsd: number;
  occurredAt: string;
  environment: "production" | "staging" | "development";
}

export interface BudgetPolicy {
  id: string;
  providerId?: ProviderKey;
  project?: string;
  monthlyLimitUsd: number;
  warningThresholdPct: number;
  criticalThresholdPct: number;
}

export interface ProviderSpend {
  providerId: ProviderKey;
  displayName: string;
  costUsd: number;
  usageRecords: number;
}

export interface BudgetAlert {
  budgetId: string;
  scope: string;
  spendUsd: number;
  monthlyLimitUsd: number;
  thresholdPct: number;
  severity: AlertSeverity;
  message: string;
}

export interface CostInsight {
  id: string;
  title: string;
  detail: string;
  impact: RecommendationImpact;
  estimatedMonthlySavingsUsd: number;
}

export interface CostReport {
  generatedAt: string;
  totalSpendUsd: number;
  providerSpend: ProviderSpend[];
  budgetAlerts: BudgetAlert[];
  insights: CostInsight[];
}

export interface ValidationIssue {
  path: string;
  message: string;
}
