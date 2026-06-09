import type { BudgetPolicy, ProviderAccount, TeamProject, UsageRecord, ValidationIssue } from "./types";

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

export function validateProject(project: unknown, index = 0): ValidationIssue[] {
  const path = `projects[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!isRecord(project)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(project, "id", path, issues);
  requireString(project, "name", path, issues);
  requireString(project, "team", path, issues);
  requireString(project, "ownerEmail", path, issues);

  if (typeof project.ownerEmail === "string" && !project.ownerEmail.endsWith(".invalid")) {
    issues.push({ path: `${path}.ownerEmail`, message: "must use a synthetic .invalid email address" });
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
  requireString(record, "projectId", path, issues);
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

  if (policy.projectId !== undefined && (typeof policy.projectId !== "string" || policy.projectId.trim().length === 0)) {
    issues.push({ path: `${path}.projectId`, message: "must be a non-empty string when set" });
  }

  if (policy.team !== undefined && (typeof policy.team !== "string" || policy.team.trim().length === 0)) {
    issues.push({ path: `${path}.team`, message: "must be a non-empty string when set" });
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

export function validateDataset(
  providers: ProviderAccount[],
  projects: TeamProject[],
  usageRecords: UsageRecord[],
  budgets: BudgetPolicy[]
): ValidationIssue[] {
  const providerIdSet = new Set(providers.map((provider) => provider.id));
  const projectIds = new Set(projects.map((project) => project.id));
  const projectTeams = new Set(projects.map((project) => project.team));
  const issues: ValidationIssue[] = [
    ...providers.flatMap((provider, index) => validateProvider(provider, index)),
    ...projects.flatMap((project, index) => validateProject(project, index)),
    ...usageRecords.flatMap((record, index) => validateUsageRecord(record, index)),
    ...budgets.flatMap((budget, index) => validateBudget(budget, index))
  ];

  usageRecords.forEach((record, index) => {
    if (!providerIdSet.has(record.providerId)) {
      issues.push({ path: `usageRecords[${index}].providerId`, message: "must reference a configured synthetic provider" });
    }

    if (!projectIds.has(record.projectId)) {
      issues.push({ path: `usageRecords[${index}].projectId`, message: "must reference a configured synthetic project" });
    }
  });

  budgets.forEach((budget, index) => {
    if (budget.projectId && !projectIds.has(budget.projectId)) {
      issues.push({ path: `budgets[${index}].projectId`, message: "must reference a configured synthetic project" });
    }

    if (budget.team && !projectTeams.has(budget.team)) {
      issues.push({ path: `budgets[${index}].team`, message: "must reference a configured synthetic team" });
    }
  });

  return issues;
}

export function assertValidDataset(
  providers: ProviderAccount[],
  projects: TeamProject[],
  usageRecords: UsageRecord[],
  budgets: BudgetPolicy[]
): void {
  const issues = validateDataset(providers, projects, usageRecords, budgets);
  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Synthetic cost-management data failed validation:\n${details}`);
  }
}
