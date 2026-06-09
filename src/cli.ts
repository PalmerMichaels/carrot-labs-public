#!/usr/bin/env node
import { renderJson, renderTable } from "./report";
import { rankApplications } from "./score";
import { syntheticApplications } from "./seed";

interface CliOptions {
  json: boolean;
  limit: number;
  help: boolean;
}

function usage(): string {
  return [
    "Usage: yc2026-clean-room-ranker [--json] [--limit <count>]",
    "",
    "Ranks bundled synthetic YC 2026-style startup outreach records.",
    "",
    "Options:",
    "  --json           Print machine-readable JSON instead of a table.",
    "  --limit <count>  Limit displayed records. Defaults to all records.",
    "  --help           Show this help text."
  ].join("\n");
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    json: false,
    limit: syntheticApplications.length,
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

    if (arg === "--limit") {
      const rawLimit = argv[index + 1];
      const parsedLimit = Number(rawLimit);

      if (!rawLimit || !Number.isInteger(parsedLimit) || parsedLimit < 1) {
        throw new Error("--limit must be followed by a positive integer");
      }

      options.limit = parsedLimit;
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

  const ranked = rankApplications(syntheticApplications).slice(0, options.limit);
  return options.json ? renderJson(ranked) : renderTable(ranked);
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
