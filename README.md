# YC 2026 Clean-Room Ranker

A small TypeScript CLI that ranks synthetic YC 2026-style startup applications for outreach planning. It is a clean-room public reimplementation of a generic intake prioritization workflow, not a copy of any proprietary YC, investor, admissions, or third-party product.

## Clean-Room Disclaimer

This repository uses synthetic seed data only. It does not include real applicants, real founders, private datasets, scraped records, YC internal workflows, YC branding, or proprietary behavior from any public or private software product.

## Non-Regulated Disclaimer

This tool is for demonstration and software evaluation only. Do not use it for regulated eligibility, investment, lending, insurance, employment, medical, credit, housing, admissions, or other legally consequential decisions. Scores are deterministic outreach-planning signals over synthetic records, not recommendations to accept, reject, invest in, hire, fund, underwrite, insure, treat, or admit anyone.

## Features

- Runnable TypeScript CLI.
- Synthetic YC 2026-style startup application records.
- Runtime validation for malformed records.
- Deterministic ranking and outreach bands.
- Table and JSON output modes.
- Tests for scoring, validation, and CLI behavior.

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

Limit output:

```bash
node dist/src/cli.js --limit 3
```

## Test

```bash
npm test
```

## How Scoring Works

The score combines synthetic stage, traction, founder experience, and focus signals. The bands are:

- `priority`: high outreach-planning score.
- `watch`: promising but needs more context.
- `research`: requires manual research before prioritization.

The model is intentionally simple and transparent so it can be inspected, tested, and modified. It is not trained on private data and does not perform regulated decisioning.

## Project Structure

- `PLAN.md`: Implementation plan created before the app/tool work.
- `src/seed.ts`: Synthetic seed applications.
- `src/validate.ts`: Data validation.
- `src/score.ts`: Deterministic ranking logic.
- `src/report.ts`: Table and JSON renderers.
- `src/cli.ts`: Command-line entry point.
- `test/*.test.ts`: Node test runner coverage.
