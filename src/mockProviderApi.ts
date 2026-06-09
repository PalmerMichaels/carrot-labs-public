import type { BudgetPolicy, ProviderAccount, TeamProject, UsageRecord } from "./types";

export interface MockBillingSnapshot {
  provider: ProviderAccount;
  projects: TeamProject[];
  usageRecords: UsageRecord[];
  budgets: BudgetPolicy[];
}

export class MockProviderBillingApi {
  constructor(
    private readonly providers: ProviderAccount[],
    private readonly projects: TeamProject[],
    private readonly usageRecords: UsageRecord[],
    private readonly budgets: BudgetPolicy[]
  ) {}

  listProviders(): ProviderAccount[] {
    return [...this.providers];
  }

  listProjects(): TeamProject[] {
    return [...this.projects];
  }

  fetchBillingSnapshot(providerId: string): MockBillingSnapshot {
    const provider = this.providers.find((candidate) => candidate.id === providerId);
    if (!provider) {
      throw new Error(`Unknown synthetic provider id: ${providerId}`);
    }

    const usageRecords = this.usageRecords.filter((record) => record.providerId === provider.id);
    const projectIds = new Set(usageRecords.map((record) => record.projectId));

    const projects = this.projects.filter((project) => projectIds.has(project.id));
    const teams = new Set(projects.map((project) => project.team));

    return {
      provider,
      projects,
      usageRecords,
      budgets: this.budgets.filter((budget) => {
        if (budget.providerId) {
          return budget.providerId === provider.id;
        }

        if (budget.projectId) {
          return projectIds.has(budget.projectId);
        }

        if (budget.team) {
          return teams.has(budget.team);
        }

        return true;
      })
    };
  }

  mutateProviderAccount(): never {
    throw new Error("Mock provider API is read-only; real provider mutations are intentionally unsupported");
  }
}
