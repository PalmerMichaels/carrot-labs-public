import assert from "node:assert/strict";
import test from "node:test";
import { runCli } from "../src/cli";
import { CLEAN_ROOM_DISCLAIMER } from "../src/disclaimer";

test("runCli renders a table with disclaimer and limited rows", () => {
  const output = runCli(["--limit", "2"]);

  assert.ok(output.includes(CLEAN_ROOM_DISCLAIMER));
  assert.ok(output.includes("Rank"));
  assert.ok(output.includes("HarborKit"));
});

test("runCli renders valid JSON", () => {
  const output = runCli(["--json", "--limit", "1"]);
  const parsed = JSON.parse(output) as { disclaimer: string; rankedApplications: unknown[] };

  assert.equal(parsed.disclaimer, CLEAN_ROOM_DISCLAIMER);
  assert.equal(parsed.rankedApplications.length, 1);
});

test("runCli validates limit arguments", () => {
  assert.throws(() => runCli(["--limit", "0"]), /positive integer/);
});
