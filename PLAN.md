# Plan

## Goal

Build a clean-room public TypeScript reimplementation of Carrot Labs as AI cost management across providers. The result is a runnable CLI that analyzes synthetic AI provider usage, spend, budgets, alerts, and recommendations without using real invoices, credentials, accounts, proprietary prices, or provider mutations.

## Scope

- Model synthetic AI provider accounts, usage records, budget policies, and spend summaries.
- Provide mocked read-only billing/provider APIs for local demo behavior.
- Validate all synthetic provider, usage, and budget records before analysis.
- Generate cost insights and recommendations from transparent heuristics.
- Render provider spend, budget alerts, and recommendations as table or JSON output.
- Add tests for validation, mocked APIs, budget alerts, recommendations, and CLI behavior.
- Document install, run, test, assumptions, and clean-room/non-regulated disclaimers.

## Non-Goals

- No real invoices, usage exports, credentials, account access, or provider API calls.
- No proprietary pricing data or claims about actual provider prices.
- No real provider API mutations.
- No financial, accounting, procurement, legal, compliance, or investment advice.
- No GitHub issue or GitHub Project synchronization.
- No sibling repository changes.

## Implementation Steps

1. Revise the existing TypeScript project metadata and docs to Carrot Labs AI cost management.
2. Define synthetic provider, spend, usage, and budget types.
3. Add read-only mocked billing/provider API behavior.
4. Implement validation for provider accounts, usage records, and budgets.
5. Implement spend summaries, budget alerts, and cost recommendations.
6. Update the CLI to print cost reports in table or JSON form.
7. Add tests using Node's built-in test runner.
8. Run install/build/tests, commit on `main`, push to `origin`, and verify local `HEAD` matches `origin/main` with a clean worktree.
