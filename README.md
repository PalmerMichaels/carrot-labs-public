# Carrot Labs Clean-Room Cost Manager

A TypeScript CLI that reimplements Carrot Labs as AI cost management across providers using synthetic data only. It summarizes AI provider spend, evaluates budgets, raises alerts, and produces cost recommendations from transparent heuristics.

## Clean-Room Disclaimer

This repository is a public clean-room demo. It uses synthetic provider accounts, usage records, spend, billing snapshots, and budgets only. It does not use real invoices, credentials, account access, customer data, proprietary provider pricing data, YC private data, Carrot Labs private data, or real provider API mutations.

## Non-Regulated Disclaimer

This tool is for demonstration and software evaluation only. Recommendations are synthetic cost-management heuristics, not financial, accounting, procurement, legal, compliance, tax, or investment advice.

## Features

- Runnable TypeScript CLI.
- Synthetic AI provider, spend, and usage data across multiple providers.
- Budget policies and alert evaluation.
- Cost insights and savings recommendations.
- Mocked read-only billing/provider API class.
- Runtime validation for malformed records.
- Table and JSON output modes.
- Tests for validation, mocked APIs, budgets, insights, and CLI behavior.

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

The tool validates synthetic providers, usage records, and budgets. It then computes provider spend, evaluates budget thresholds, and generates simple recommendations such as provider concentration review, non-production spend guardrails, large-model routing opportunities, and low-utilization provider reviews.

All pricing and spend values are synthetic examples. Do not treat any numbers in this repository as actual provider pricing or invoices.

## Project Structure

- `PLAN.md`: Implementation plan for the Carrot Labs cost-management reimplementation.
- `src/seed.ts`: Synthetic provider, usage, and budget data.
- `src/mockProviderApi.ts`: Read-only mocked billing/provider API.
- `src/validate.ts`: Data validation.
- `src/score.ts`: Spend summaries, budget alerts, and recommendations.
- `src/report.ts`: Table and JSON renderers.
- `src/cli.ts`: Command-line entry point.
- `test/*.test.ts`: Node test runner coverage.
