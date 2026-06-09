import { CLEAN_ROOM_DISCLAIMER, NON_REGULATED_DISCLAIMER } from "./disclaimer";
import type { CostReport } from "./types";

function pad(value: string, width: number): string {
  return value.length >= width ? value.slice(0, width) : value.padEnd(width, " ");
}

function money(value: number): string {
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
}

function truncate(value: string, width: number): string {
  return value.length <= width ? value : `${value.slice(0, width - 3)}...`;
}

export function renderTable(report: CostReport): string {
  const providerRows = report.providerSpend.map((provider) =>
    [pad(provider.displayName, 20), pad(money(provider.costUsd), 14), String(provider.usageRecords)].join("")
  );

  const alertRows = report.budgetAlerts.length > 0
    ? report.budgetAlerts.map((alert) =>
        [pad(alert.severity, 10), pad(truncate(alert.scope, 22), 24), pad(`${alert.thresholdPct}%`, 10), alert.message].join("")
      )
    : ["No synthetic budget alerts triggered."];

  const insightRows = report.insights.length > 0
    ? report.insights.map((insight) =>
        [pad(insight.impact, 8), pad(money(insight.estimatedMonthlySavingsUsd), 14), truncate(insight.title, 28)].join("")
      )
    : ["No synthetic cost insights generated."];

  return [
    CLEAN_ROOM_DISCLAIMER,
    NON_REGULATED_DISCLAIMER,
    "",
    `Total synthetic AI spend: ${money(report.totalSpendUsd)}`,
    "",
    "Provider Spend",
    [pad("Provider", 20), pad("Spend", 14), "Records"].join(""),
    ["------------------  ", "------------  ", "-------"].join(""),
    ...providerRows,
    "",
    "Budget Alerts",
    [pad("Severity", 10), pad("Scope", 24), pad("Usage", 10), "Message"].join(""),
    ["--------  ", "----------------------  ", "--------  ", "-------"].join(""),
    ...alertRows,
    "",
    "Cost Recommendations",
    [pad("Impact", 8), pad("Savings", 14), "Recommendation"].join(""),
    ["------  ", "------------  ", "--------------"].join(""),
    ...insightRows
  ].join("\n");
}

export function renderJson(report: CostReport): string {
  return JSON.stringify(
    {
      disclaimer: CLEAN_ROOM_DISCLAIMER,
      nonRegulatedDisclaimer: NON_REGULATED_DISCLAIMER,
      report
    },
    null,
    2
  );
}
