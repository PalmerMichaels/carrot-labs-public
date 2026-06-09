# Carrot Labs Clean-Room Cost Manager

A TypeScript CLI that reimplements Carrot Labs as AI cost management across providers using synthetic data only. It summarizes AI provider spend, evaluates budgets, detects anomalies, compares provider/model cost buckets, and produces optimization recommendations from transparent heuristics.

## Clean-Room Disclaimer

This repository is a public clean-room demo. It uses synthetic provider accounts, model/API usage records, spend, billing snapshots, project/team ownership, and budgets only. It does not use real invoices, credentials, account access, customer data, proprietary provider pricing data, YC private data, Carrot Labs private data, billing mutations, or real provider changes.

## Non-Regulated Disclaimer

This tool is for demonstration and software evaluation only. Recommendations are synthetic cost-management heuristics, not financial, accounting, procurement, legal, compliance, tax, or investment advice. It must not be used for investment or eligibility scoring, admissions, hiring, lending, insurance, or medical use.

## Features

- Runnable TypeScript CLI.
- Synthetic AI provider, model/API, spend, usage, project/team, and budget data across multiple providers.
- Budget policies and alert evaluation across global, provider, project, and team scopes.
- Anomaly detection over synthetic project spend changes.
- Provider/model comparison with synthetic unit-cost calculations.
- Cost insights and optimization recommendations.
- Mocked read-only billing/provider API class.
- Runtime validation for malformed records.
- Table and JSON output modes.
- Tests for validation, mocked APIs, budgets, anomalies, provider/model comparisons, insights, and CLI behavior.

## Requirements

- Node.js 22 or newer.
- npm 10 or newer.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Run

```bash
npm start
```

Print JSON:

```bash
node dist/src/cli.js --json
```

Limit analysis to one synthetic provider:

```bash
node dist/src/cli.js --provider openai-demo
```

Supported synthetic provider ids:

- `openai-demo`
- `anthropic-demo`
- `google-demo`
- `mistral-demo`

## Test

```bash
npm test
```

## How It Works

The tool validates synthetic providers, projects, usage records, and budgets. It then computes provider spend, compares provider/model cost buckets, evaluates budget thresholds, detects project-level spend anomalies, and generates recommendations such as provider concentration review, non-production spend guardrails, large-model routing opportunities, anomaly review, and low-utilization provider review.

All pricing, usage, unit-cost, and spend values are synthetic examples. Do not treat any numbers in this repository as actual provider pricing, invoices, usage exports, or account data.

## Project Structure

- `PLAN.md`: Implementation plan for the Carrot Labs cost-management reimplementation.
- `src/seed.ts`: Synthetic provider, model/API usage, project/team, and budget data.
- `src/mockProviderApi.ts`: Read-only mocked billing/provider API.
- `src/validate.ts`: Data validation.
- `src/score.ts`: Spend summaries, provider/model comparisons, budget alerts, anomaly detection, and recommendations.
- `src/report.ts`: Table and JSON renderers.
- `src/cli.ts`: Command-line entry point.
- `test/*.test.ts`: Node test runner coverage.
