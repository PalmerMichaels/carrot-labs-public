import type { BudgetPolicy, ProviderAccount, UsageRecord, ValidationIssue } from "./types";

const providerIds = new Set(["openai-demo", "anthropic-demo", "google-demo", "mistral-demo"]);
const usageUnits = new Set(["tokens", "requests", "images"]);
const environments = new Set(["production", "staging", "development"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, path: string, issues: ValidationIssue[]): void {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path: `${path}.${key}`, message: "must be a non-empty string" });
  }
}

function requirePositiveNumber(record: Record<string, unknown>, key: string, path: string, issues: ValidationIssue[]): void {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    issues.push({ path: `${path}.${key}`, message: "must be a positive finite number" });
  }
}

function requirePercent(record: Record<string, unknown>, key: string, path: string, issues: ValidationIssue[]): void {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0 || value > 100) {
    issues.push({ path: `${path}.${key}`, message: "must be a percentage between 1 and 100" });
  }
}

export function validateProvider(provider: unknown, index = 0): ValidationIssue[] {
  const path = `providers[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!isRecord(provider)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(provider, "id", path, issues);
  requireString(provider, "displayName", path, issues);
  requireString(provider, "accountLabel", path, issues);

  if (typeof provider.id !== "string" || !providerIds.has(provider.id)) {
    issues.push({ path: `${path}.id`, message: "must be a supported synthetic provider id" });
  }

  if (provider.currency !== "USD") {
    issues.push({ path: `${path}.currency`, message: "must be USD" });
  }

  if (provider.readOnly !== true) {
    issues.push({ path: `${path}.readOnly`, message: "must be true because mocked APIs are read-only" });
  }

  return issues;
}

export function validateUsageRecord(record: unknown, index = 0): ValidationIssue[] {
  const path = `usageRecords[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!isRecord(record)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(record, "id", path, issues);
  requireString(record, "project", path, issues);
  requireString(record, "model", path, issues);
  requirePositiveNumber(record, "quantity", path, issues);
  requirePositiveNumber(record, "costUsd", path, issues);

  if (typeof record.providerId !== "string" || !providerIds.has(record.providerId)) {
    issues.push({ path: `${path}.providerId`, message: "must reference a supported synthetic provider" });
  }

  if (typeof record.unit !== "string" || !usageUnits.has(record.unit)) {
    issues.push({ path: `${path}.unit`, message: "must be tokens, requests, or images" });
  }

  if (typeof record.environment !== "string" || !environments.has(record.environment)) {
    issues.push({ path: `${path}.environment`, message: "must be production, staging, or development" });
  }

  if (typeof record.occurredAt !== "string" || Number.isNaN(Date.parse(record.occurredAt))) {
    issues.push({ path: `${path}.occurredAt`, message: "must be an ISO-compatible date string" });
  }

  return issues;
}

export function validateBudget(policy: unknown, index = 0): ValidationIssue[] {
  const path = `budgets[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!isRecord(policy)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(policy, "id", path, issues);
  requirePositiveNumber(policy, "monthlyLimitUsd", path, issues);
  requirePercent(policy, "warningThresholdPct", path, issues);
  requirePercent(policy, "criticalThresholdPct", path, issues);

  if (policy.providerId !== undefined && (typeof policy.providerId !== "string" || !providerIds.has(policy.providerId))) {
    issues.push({ path: `${path}.providerId`, message: "must reference a supported synthetic provider when set" });
  }

  if (policy.project !== undefined && (typeof policy.project !== "string" || policy.project.trim().length === 0)) {
    issues.push({ path: `${path}.project`, message: "must be a non-empty string when set" });
  }

  if (
    typeof policy.warningThresholdPct === "number" &&
    typeof policy.criticalThresholdPct === "number" &&
    policy.warningThresholdPct >= policy.criticalThresholdPct
  ) {
    issues.push({ path: `${path}.criticalThresholdPct`, message: "must be greater than warningThresholdPct" });
  }

  return issues;
}

export function validateDataset(providers: ProviderAccount[], usageRecords: UsageRecord[], budgets: BudgetPolicy[]): ValidationIssue[] {
  return [
    ...providers.flatMap((provider, index) => validateProvider(provider, index)),
    ...usageRecords.flatMap((record, index) => validateUsageRecord(record, index)),
    ...budgets.flatMap((budget, index) => validateBudget(budget, index))
  ];
}

export function assertValidDataset(providers: ProviderAccount[], usageRecords: UsageRecord[], budgets: BudgetPolicy[]): void {
  const issues = validateDataset(providers, usageRecords, budgets);
  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Synthetic cost-management data failed validation:\n${details}`);
  }
}
