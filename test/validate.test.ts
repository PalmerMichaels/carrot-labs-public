import assert from "node:assert/strict";
import test from "node:test";
import { syntheticApplications } from "../src/seed";
import type { FounderProfile, StartupApplication, TractionSnapshot } from "../src/types";
import { validateApplication, validateApplications } from "../src/validate";

function cloneWithInvalidTraction(application: StartupApplication, traction: Partial<TractionSnapshot>): StartupApplication {
  return {
    ...application,
    traction: {
      ...application.traction,
      ...traction
    }
  };
}

function cloneWithInvalidFounder(application: StartupApplication, founder: Partial<FounderProfile>): StartupApplication {
  return {
    ...application,
    founders: [
      {
        ...application.founders[0],
        ...founder
      }
    ]
  };
}

test("bundled synthetic seed data is valid", () => {
  assert.deepEqual(validateApplications(syntheticApplications), []);
});

test("validateApplication rejects negative traction", () => {
  const invalid = cloneWithInvalidTraction(syntheticApplications[0], { monthlyRevenueUsd: -1 });
  const issues = validateApplication(invalid);

  assert.ok(issues.some((issue) => issue.path === "applications[0].traction.monthlyRevenueUsd"));
});

test("validateApplication rejects empty founder names", () => {
  const invalid = cloneWithInvalidFounder(syntheticApplications[0], { name: "" });
  const issues = validateApplication(invalid);

  assert.ok(issues.some((issue) => issue.path === "applications[0].founders[0].name"));
});
