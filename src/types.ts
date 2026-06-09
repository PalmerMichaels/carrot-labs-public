export type Stage = "idea" | "prototype" | "launched" | "revenue";

export type OutreachBand = "priority" | "watch" | "research";

export interface FounderProfile {
  name: string;
  role: string;
  background: string;
  yearsExperience: number;
}

export interface TractionSnapshot {
  monthlyRevenueUsd: number;
  activeUsers: number;
  growthRatePct: number;
  pilots: number;
  waitlist: number;
}

export interface StartupApplication {
  id: string;
  name: string;
  batch: "YC 2026";
  problem: string;
  customer: string;
  stage: Stage;
  founders: FounderProfile[];
  traction: TractionSnapshot;
  tags: string[];
  submittedAt: string;
}

export interface ValidationIssue {
  path: string;
  message: string;
}

export interface RankedApplication {
  application: StartupApplication;
  score: number;
  band: OutreachBand;
  reasons: string[];
  risks: string[];
}
