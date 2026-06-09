import type { BudgetPolicy, ProviderAccount, UsageRecord } from "./types";

export const syntheticProviders: ProviderAccount[] = [
  {
    id: "openai-demo",
    displayName: "OpenAI Demo",
    accountLabel: "synthetic-prod-workloads",
    currency: "USD",
    readOnly: true
  },
  {
    id: "anthropic-demo",
    displayName: "Anthropic Demo",
    accountLabel: "synthetic-support-tools",
    currency: "USD",
    readOnly: true
  },
  {
    id: "google-demo",
    displayName: "Google AI Demo",
    accountLabel: "synthetic-search-lab",
    currency: "USD",
    readOnly: true
  },
  {
    id: "mistral-demo",
    displayName: "Mistral Demo",
    accountLabel: "synthetic-dev-sandbox",
    currency: "USD",
    readOnly: true
  }
];

export const syntheticUsageRecords: UsageRecord[] = [
  {
    id: "usage_001",
    providerId: "openai-demo",
    project: "customer-copilot",
    model: "large-reasoning-demo",
    unit: "tokens",
    quantity: 142_000_000,
    costUsd: 2840,
    occurredAt: "2026-05-01T10:00:00.000Z",
    environment: "production"
  },
  {
    id: "usage_002",
    providerId: "openai-demo",
    project: "customer-copilot",
    model: "large-reasoning-demo",
    unit: "tokens",
    quantity: 121_000_000,
    costUsd: 2420,
    occurredAt: "2026-05-12T10:00:00.000Z",
    environment: "production"
  },
  {
    id: "usage_003",
    providerId: "anthropic-demo",
    project: "support-triage",
    model: "long-context-demo",
    unit: "tokens",
    quantity: 88_000_000,
    costUsd: 1760,
    occurredAt: "2026-05-04T08:30:00.000Z",
    environment: "production"
  },
  {
    id: "usage_004",
    providerId: "google-demo",
    project: "search-lab",
    model: "fast-routing-demo",
    unit: "requests",
    quantity: 930_000,
    costUsd: 690,
    occurredAt: "2026-05-07T14:45:00.000Z",
    environment: "production"
  },
  {
    id: "usage_005",
    providerId: "mistral-demo",
    project: "developer-sandbox",
    model: "small-chat-demo",
    unit: "tokens",
    quantity: 64_000_000,
    costUsd: 320,
    occurredAt: "2026-05-11T19:15:00.000Z",
    environment: "development"
  },
  {
    id: "usage_006",
    providerId: "openai-demo",
    project: "image-review",
    model: "vision-demo",
    unit: "images",
    quantity: 34_000,
    costUsd: 1190,
    occurredAt: "2026-05-16T09:10:00.000Z",
    environment: "staging"
  },
  {
    id: "usage_007",
    providerId: "anthropic-demo",
    project: "support-triage",
    model: "long-context-demo",
    unit: "tokens",
    quantity: 73_000_000,
    costUsd: 1460,
    occurredAt: "2026-05-18T11:20:00.000Z",
    environment: "production"
  },
  {
    id: "usage_008",
    providerId: "google-demo",
    project: "search-lab",
    model: "fast-routing-demo",
    unit: "requests",
    quantity: 710_000,
    costUsd: 530,
    occurredAt: "2026-05-21T16:40:00.000Z",
    environment: "production"
  }
];

export const syntheticBudgets: BudgetPolicy[] = [
  {
    id: "budget_overall_ai",
    monthlyLimitUsd: 9500,
    warningThresholdPct: 75,
    criticalThresholdPct: 90
  },
  {
    id: "budget_openai_demo",
    providerId: "openai-demo",
    monthlyLimitUsd: 6200,
    warningThresholdPct: 70,
    criticalThresholdPct: 90
  },
  {
    id: "budget_support_triage",
    project: "support-triage",
    monthlyLimitUsd: 3000,
    warningThresholdPct: 80,
    criticalThresholdPct: 95
  },
  {
    id: "budget_developer_sandbox",
    project: "developer-sandbox",
    monthlyLimitUsd: 400,
    warningThresholdPct: 70,
    criticalThresholdPct: 90
  }
];
