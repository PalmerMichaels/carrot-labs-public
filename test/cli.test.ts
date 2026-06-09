import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "../src/cli";
import { CLEAN_ROOM_DISCLAIMER } from "../src/disclaimer";

test("runCli renders a cost table with disclaimer and provider spend", () => {
  const output = runCli([]);

  assert.ok(output.includes(CLEAN_ROOM_DISCLAIMER));
  assert.ok(output.includes("Provider Spend"));
  assert.ok(output.includes("OpenAI Demo"));
  assert.ok(output.includes("Budget Alerts"));
});

test("runCli renders valid JSON for one synthetic provider", () => {
  const output = runCli(["--json", "--provider", "openai-demo"]);
  const parsed = JSON.parse(output) as { report: { providerSpend: unknown[] } };

  assert.equal(parsed.report.providerSpend.length, 1);
});

test("runCli rejects unknown provider ids", () => {
  assert.throws(() => runCli(["--provider", "unknown-demo"]), /Unknown synthetic provider id/);
});
