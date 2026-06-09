import assert from "node:assert/strict";
import test from "node:test";
import { MockProviderBillingApi } from "../src/mockProviderApi";
import { syntheticBudgets, syntheticProviders, syntheticUsageRecords } from "../src/seed";

test("MockProviderBillingApi returns read-only synthetic billing snapshots", () => {
  const api = new MockProviderBillingApi(syntheticProviders, syntheticUsageRecords, syntheticBudgets);
  const snapshot = api.fetchBillingSnapshot("openai-demo");

  assert.equal(snapshot.provider.readOnly, true);
  assert.ok(snapshot.usageRecords.length > 0);
  assert.ok(snapshot.usageRecords.every((record) => record.providerId === "openai-demo"));
});

test("MockProviderBillingApi refuses provider mutations", () => {
  const api = new MockProviderBillingApi(syntheticProviders, syntheticUsageRecords, syntheticBudgets);

  assert.throws(() => api.mutateProviderAccount(), /read-only/);
});
