import type { BudgetPolicy, ProviderAccount, UsageRecord } from "./types";

export interface MockBillingSnapshot {
  provider: ProviderAccount;
  usageRecords: UsageRecord[];
  budgets: BudgetPolicy[];
}

export class MockProviderBillingApi {
  constructor(
    private readonly providers: ProviderAccount[],
    private readonly usageRecords: UsageRecord[],
    private readonly budgets: BudgetPolicy[]
  ) {}

  listProviders(): ProviderAccount[] {
    return [...this.providers];
  }

  fetchBillingSnapshot(providerId: string): MockBillingSnapshot {
    const provider = this.providers.find((candidate) => candidate.id === providerId);
    if (!provider) {
      throw new Error(`Unknown synthetic provider id: ${providerId}`);
    }

    return {
      provider,
      usageRecords: this.usageRecords.filter((record) => record.providerId === provider.id),
      budgets: this.budgets.filter((budget) => !budget.providerId || budget.providerId === provider.id)
    };
  }

  mutateProviderAccount(): never {
    throw new Error("Mock provider API is read-only; real provider mutations are intentionally unsupported");
  }
}
