#!/usr/bin/env node
import { renderJson, renderTable } from "./report";
import { buildCostReport } from "./score";
import { syntheticBudgets, syntheticProjects, syntheticProviders, syntheticUsageRecords } from "./seed";

interface CliOptions {
  json: boolean;
  provider?: string;
  help: boolean;
}

function usage(): string {
  return [
    "Usage: carrot-labs-costs [--json] [--provider <provider-id>]",
    "",
    "Analyzes synthetic AI provider usage, spend, projects, teams, budgets, anomalies, provider/model comparisons, and cost recommendations.",
    "",
    "Options:",
    "  --json                    Print machine-readable JSON instead of a table.",
    "  --provider <provider-id>  Limit synthetic usage to one provider id.",
    "  --help                    Show this help text.",
    "",
    "Synthetic provider ids: openai-demo, anthropic-demo, google-demo, mistral-demo"
  ].join("\n");
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    json: false,
    help: false
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--json") {
      options.json = true;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      options.help = true;
      continue;
    }

    if (arg === "--provider") {
      const providerId = argv[index + 1];
      if (!providerId) {
        throw new Error("--provider must be followed by a synthetic provider id");
      }
      options.provider = providerId;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

export function runCli(argv = process.argv.slice(2)): string {
  const options = parseArgs(argv);

  if (options.help) {
    return usage();
  }

  const providers = options.provider
    ? syntheticProviders.filter((provider) => provider.id === options.provider)
    : syntheticProviders;
  const usageRecords = options.provider
    ? syntheticUsageRecords.filter((record) => record.providerId === options.provider)
    : syntheticUsageRecords;
  const activeProjectIds = new Set(usageRecords.map((record) => record.projectId));
  const projects = syntheticProjects.filter((project) => activeProjectIds.has(project.id));
  const activeTeams = new Set(projects.map((project) => project.team));
  const budgets = options.provider
    ? syntheticBudgets.filter((budget) => {
        if (budget.providerId) {
          return budget.providerId === options.provider;
        }

        if (budget.projectId) {
          return activeProjectIds.has(budget.projectId);
        }

        if (budget.team) {
          return activeTeams.has(budget.team);
        }

        return true;
      })
    : syntheticBudgets;

  if (options.provider && providers.length === 0) {
    throw new Error(`Unknown synthetic provider id: ${options.provider}`);
  }

  const report = buildCostReport(providers, projects, usageRecords, budgets);
  return options.json ? renderJson(report) : renderTable(report);
}

if (require.main === module) {
  try {
    process.stdout.write(`${runCli()}\n`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  }
}
