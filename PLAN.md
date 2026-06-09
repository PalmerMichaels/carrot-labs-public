# Plan

## Goal

Build a clean-room, public, non-regulated TypeScript reimplementation inspired by a YC 2026 startup intake and prioritization workflow. The result will be a runnable CLI tool that works entirely from synthetic data and does not copy proprietary product behavior, data, branding, or regulated decisioning logic.

## Scope

- Create a TypeScript CLI that ranks synthetic startup applications for outreach planning.
- Include deterministic synthetic seed data for founders, startups, traction, and tags.
- Validate input records before scoring so malformed data is rejected with actionable errors.
- Provide tests for validation, scoring, and CLI/report behavior.
- Document installation, running, testing, assumptions, and clean-room/non-regulated disclaimers.

## Non-Goals

- No external API integrations.
- No scraping, importing, or inferring real applicant, investor, medical, financial, employment, or credit data.
- No regulated eligibility, underwriting, lending, insurance, hiring, admissions, or investment decision automation.
- No GitHub issue or GitHub Project synchronization.

## Implementation Steps

1. Scaffold a minimal Node.js + TypeScript project.
2. Define typed domain models for startup applications, traction, founders, and scoring output.
3. Add synthetic seed records only.
4. Implement validation and deterministic outreach scoring.
5. Add a CLI that prints ranked outreach recommendations as a table or JSON.
6. Add unit tests using Node's built-in test runner.
7. Add README instructions and explicit clean-room/non-regulated disclaimers.
8. Run install, tests, build, commit on `main`, push to `origin`, and verify local `HEAD` matches `origin/main` with a clean worktree.
