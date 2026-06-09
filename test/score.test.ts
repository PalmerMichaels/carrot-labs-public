import assert from "node:assert/strict";
import test from "node:test";
import { rankApplications, scoreApplication } from "../src/score";
import { syntheticApplications } from "../src/seed";

test("rankApplications sorts valid synthetic applications by score descending", () => {
  const ranked = rankApplications(syntheticApplications);

  assert.equal(ranked.length, syntheticApplications.length);

  for (let index = 1; index < ranked.length; index += 1) {
    assert.ok(ranked[index - 1].score >= ranked[index].score);
  }
});

test("scoreApplication assigns a priority band to the strongest revenue record", () => {
  const harborKit = syntheticApplications.find((application) => application.name === "HarborKit");

  assert.ok(harborKit);
  const ranked = scoreApplication(harborKit);

  assert.equal(ranked.band, "priority");
  assert.ok(ranked.score >= 75);
  assert.ok(ranked.reasons.some((reason) => reason.includes("revenue stage")));
});

test("scoreApplication surfaces risks for idea-stage records", () => {
  const greenRoute = syntheticApplications.find((application) => application.name === "GreenRoute Lab");

  assert.ok(greenRoute);
  const ranked = scoreApplication(greenRoute);

  assert.equal(ranked.band, "research");
  assert.ok(ranked.risks.includes("idea-stage record needs customer evidence before prioritization"));
});
