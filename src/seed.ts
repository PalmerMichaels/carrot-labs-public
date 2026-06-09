import type { StartupApplication } from "./types";

export const syntheticApplications: StartupApplication[] = [
  {
    id: "app_2026_001",
    name: "HarborKit",
    batch: "YC 2026",
    problem: "Small freight teams reconcile shipment exceptions across email, portals, and spreadsheets.",
    customer: "Regional freight brokers with fewer than 80 employees",
    stage: "revenue",
    founders: [
      {
        name: "Avery Park",
        role: "Product",
        background: "Former logistics operator",
        yearsExperience: 8
      },
      {
        name: "Mina Torres",
        role: "Engineering",
        background: "Workflow automation engineer",
        yearsExperience: 7
      }
    ],
    traction: {
      monthlyRevenueUsd: 18400,
      activeUsers: 214,
      growthRatePct: 17,
      pilots: 6,
      waitlist: 38
    },
    tags: ["operations", "logistics", "automation"],
    submittedAt: "2026-02-17T10:30:00.000Z"
  },
  {
    id: "app_2026_002",
    name: "Northstar Forms",
    batch: "YC 2026",
    problem: "Field service companies lose time converting paper checklists into structured operations data.",
    customer: "Commercial maintenance teams",
    stage: "launched",
    founders: [
      {
        name: "Jon Bell",
        role: "Engineering",
        background: "Mobile data capture lead",
        yearsExperience: 6
      },
      {
        name: "Priya Shah",
        role: "Sales",
        background: "Sold SaaS to field service operators",
        yearsExperience: 9
      }
    ],
    traction: {
      monthlyRevenueUsd: 4200,
      activeUsers: 490,
      growthRatePct: 24,
      pilots: 9,
      waitlist: 71
    },
    tags: ["field-service", "mobile", "workflow"],
    submittedAt: "2026-02-19T16:45:00.000Z"
  },
  {
    id: "app_2026_003",
    name: "PulseLedger",
    batch: "YC 2026",
    problem: "Developer-led finance teams struggle to forecast cloud spend from usage events before invoices arrive.",
    customer: "Infrastructure teams managing multi-cloud budgets",
    stage: "prototype",
    founders: [
      {
        name: "Eli Morgan",
        role: "Engineering",
        background: "Cloud cost observability engineer",
        yearsExperience: 10
      }
    ],
    traction: {
      monthlyRevenueUsd: 0,
      activeUsers: 61,
      growthRatePct: 38,
      pilots: 4,
      waitlist: 180
    },
    tags: ["developer-tools", "infrastructure", "forecasting"],
    submittedAt: "2026-02-21T08:05:00.000Z"
  },
  {
    id: "app_2026_004",
    name: "GreenRoute Lab",
    batch: "YC 2026",
    problem: "Urban delivery dispatchers need practical routing experiments before changing live operations.",
    customer: "Local delivery fleets and operations analysts",
    stage: "idea",
    founders: [
      {
        name: "Sam Rivera",
        role: "Operations",
        background: "Last-mile delivery manager",
        yearsExperience: 11
      },
      {
        name: "Nora Kim",
        role: "Engineering",
        background: "Simulation systems builder",
        yearsExperience: 5
      }
    ],
    traction: {
      monthlyRevenueUsd: 0,
      activeUsers: 0,
      growthRatePct: 0,
      pilots: 2,
      waitlist: 44
    },
    tags: ["sustainability", "simulation", "logistics"],
    submittedAt: "2026-02-23T12:10:00.000Z"
  },
  {
    id: "app_2026_005",
    name: "RelayDesk",
    batch: "YC 2026",
    problem: "B2B support teams cannot reliably detect when high-value accounts are blocked across chat and tickets.",
    customer: "B2B SaaS support and success teams",
    stage: "revenue",
    founders: [
      {
        name: "Talia Nguyen",
        role: "Customer Success",
        background: "Enterprise support leader",
        yearsExperience: 12
      },
      {
        name: "Chris Osei",
        role: "Engineering",
        background: "Support platform integrations engineer",
        yearsExperience: 8
      }
    ],
    traction: {
      monthlyRevenueUsd: 12600,
      activeUsers: 870,
      growthRatePct: 12,
      pilots: 5,
      waitlist: 96
    },
    tags: ["b2b-saas", "support", "integrations"],
    submittedAt: "2026-02-24T09:20:00.000Z"
  }
];
