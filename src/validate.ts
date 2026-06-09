import type { StartupApplication, ValidationIssue } from "./types";

const allowedStages = new Set(["idea", "prototype", "launched", "revenue"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: Record<string, unknown>, key: string, path: string, issues: ValidationIssue[]): void {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ path: `${path}.${key}`, message: "must be a non-empty string" });
  }
}

function requireNonNegativeNumber(record: Record<string, unknown>, key: string, path: string, issues: ValidationIssue[]): void {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    issues.push({ path: `${path}.${key}`, message: "must be a non-negative finite number" });
  }
}

function validateFounder(founder: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isRecord(founder)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(founder, "name", path, issues);
  requireString(founder, "role", path, issues);
  requireString(founder, "background", path, issues);
  requireNonNegativeNumber(founder, "yearsExperience", path, issues);

  return issues;
}

function validateTraction(traction: unknown, path: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!isRecord(traction)) {
    return [{ path, message: "must be an object" }];
  }

  requireNonNegativeNumber(traction, "monthlyRevenueUsd", path, issues);
  requireNonNegativeNumber(traction, "activeUsers", path, issues);
  requireNonNegativeNumber(traction, "growthRatePct", path, issues);
  requireNonNegativeNumber(traction, "pilots", path, issues);
  requireNonNegativeNumber(traction, "waitlist", path, issues);

  return issues;
}

export function validateApplication(application: unknown, index = 0): ValidationIssue[] {
  const path = `applications[${index}]`;
  const issues: ValidationIssue[] = [];

  if (!isRecord(application)) {
    return [{ path, message: "must be an object" }];
  }

  requireString(application, "id", path, issues);
  requireString(application, "name", path, issues);
  requireString(application, "problem", path, issues);
  requireString(application, "customer", path, issues);

  if (application.batch !== "YC 2026") {
    issues.push({ path: `${path}.batch`, message: "must be exactly 'YC 2026' for this clean-room demo" });
  }

  if (typeof application.stage !== "string" || !allowedStages.has(application.stage)) {
    issues.push({ path: `${path}.stage`, message: "must be one of idea, prototype, launched, revenue" });
  }

  if (!Array.isArray(application.founders) || application.founders.length === 0) {
    issues.push({ path: `${path}.founders`, message: "must include at least one founder" });
  } else {
    application.founders.forEach((founder, founderIndex) => {
      issues.push(...validateFounder(founder, `${path}.founders[${founderIndex}]`));
    });
  }

  issues.push(...validateTraction(application.traction, `${path}.traction`));

  if (!Array.isArray(application.tags) || application.tags.length === 0) {
    issues.push({ path: `${path}.tags`, message: "must include at least one tag" });
  } else {
    application.tags.forEach((tag, tagIndex) => {
      if (typeof tag !== "string" || tag.trim().length === 0) {
        issues.push({ path: `${path}.tags[${tagIndex}]`, message: "must be a non-empty string" });
      }
    });
  }

  if (typeof application.submittedAt !== "string" || Number.isNaN(Date.parse(application.submittedAt))) {
    issues.push({ path: `${path}.submittedAt`, message: "must be an ISO-compatible date string" });
  }

  return issues;
}

export function validateApplications(applications: unknown[]): ValidationIssue[] {
  return applications.flatMap((application, index) => validateApplication(application, index));
}

export function assertValidApplications(applications: StartupApplication[]): void {
  const issues = validateApplications(applications);
  if (issues.length > 0) {
    const details = issues.map((issue) => `${issue.path}: ${issue.message}`).join("\n");
    throw new Error(`Synthetic application data failed validation:\n${details}`);
  }
}
