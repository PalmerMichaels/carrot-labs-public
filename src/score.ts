import type { OutreachBand, RankedApplication, Stage, StartupApplication } from "./types";
import { assertValidApplications } from "./validate";

const stageWeights: Record<Stage, number> = {
  idea: 8,
  prototype: 18,
  launched: 28,
  revenue: 36
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function bandForScore(score: number): OutreachBand {
  if (score >= 75) {
    return "priority";
  }

  if (score >= 55) {
    return "watch";
  }

  return "research";
}

function founderScore(application: StartupApplication): number {
  const totalExperience = application.founders.reduce((sum, founder) => sum + founder.yearsExperience, 0);
  const roles = new Set(application.founders.map((founder) => founder.role.toLowerCase()));

  return clamp(totalExperience, 0, 16) + clamp((roles.size - 1) * 3, 0, 6);
}

function tractionScore(application: StartupApplication): number {
  const { monthlyRevenueUsd, activeUsers, growthRatePct, pilots, waitlist } = application.traction;

  return (
    clamp(monthlyRevenueUsd / 1000, 0, 18) +
    clamp(activeUsers / 75, 0, 12) +
    clamp(growthRatePct / 3, 0, 12) +
    clamp(pilots * 1.4, 0, 8) +
    clamp(waitlist / 30, 0, 6)
  );
}

function focusScore(application: StartupApplication): number {
  const conciseProblem = application.problem.length <= 140 ? 4 : 2;
  const conciseCustomer = application.customer.length <= 80 ? 4 : 2;
  const tagSignal = clamp(application.tags.length * 1.5, 0, 6);

  return conciseProblem + conciseCustomer + tagSignal;
}

function reasonsFor(application: StartupApplication, score: number): string[] {
  const reasons: string[] = [];

  if (application.stage === "revenue") {
    reasons.push(`revenue stage with $${application.traction.monthlyRevenueUsd.toLocaleString("en-US")}/mo synthetic revenue`);
  }

  if (application.traction.growthRatePct >= 20) {
    reasons.push(`${application.traction.growthRatePct}% month-over-month synthetic growth`);
  }

  if (application.traction.pilots >= 5) {
    reasons.push(`${application.traction.pilots} synthetic pilots indicate reachable design partners`);
  }

  if (application.founders.length > 1) {
    reasons.push("multi-founder team with complementary roles");
  }

  if (score >= 75) {
    reasons.push("high composite outreach score for a non-decisioning workflow");
  }

  return reasons.slice(0, 4);
}

function risksFor(application: StartupApplication): string[] {
  const risks: string[] = [];

  if (application.stage === "idea") {
    risks.push("idea-stage record needs customer evidence before prioritization");
  }

  if (application.traction.monthlyRevenueUsd === 0) {
    risks.push("no synthetic revenue recorded");
  }

  if (application.founders.length === 1) {
    risks.push("single-founder execution capacity should be discussed manually");
  }

  if (application.traction.activeUsers < 50 && application.traction.pilots < 3) {
    risks.push("limited synthetic usage signal");
  }

  return risks;
}

export function scoreApplication(application: StartupApplication): RankedApplication {
  const rawScore =
    stageWeights[application.stage] +
    tractionScore(application) +
    founderScore(application) +
    focusScore(application);
  const score = Math.round(clamp(rawScore, 0, 100));

  return {
    application,
    score,
    band: bandForScore(score),
    reasons: reasonsFor(application, score),
    risks: risksFor(application)
  };
}

export function rankApplications(applications: StartupApplication[]): RankedApplication[] {
  assertValidApplications(applications);

  return applications
    .map(scoreApplication)
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.application.name.localeCompare(right.application.name);
    });
}
