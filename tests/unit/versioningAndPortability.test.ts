import { describe, it, expect, beforeEach } from "vitest";
import { StorageRepository } from "@/lib/storage/repository";
import { ProjectSchema, DecisionRecord } from "@/types";

describe("Slice 4: Baseline Versioning, Audit Durability & Portability", () => {
  beforeEach(() => {
    const storage: Record<string, string> = {};
    global.window = {
      localStorage: {
        getItem: (k: string) => storage[k] || null,
        setItem: (k: string, v: string) => {
          storage[k] = v;
        },
        removeItem: (k: string) => {
          delete storage[k];
        },
        clear: () => {
          for (const k in storage) delete storage[k];
        },
      },
    } as any;
  });

  it("bumps baseline from v1.0 to v2.0 while keeping historical decisions anchored to v1.0", () => {
    // 1. Initial project with Baseline v1.0
    let project = StorageRepository.createProject("Versioned SaaS");
    project = StorageRepository.commitBaseline(project, "Initial Brief", [
      { id: "item-1", title: "Login", description: "Email/password", userConfirmed: true },
    ]);

    expect(project.baselines).toHaveLength(1);
    const v1 = project.baselines[0];
    expect(v1.versionNumber).toBe("v1.0");

    // 2. Decision #1 recorded under v1.0
    const decisionV1: DecisionRecord = {
      id: "dec-1",
      requestId: "req-1",
      requestText: "Add Stripe checkout",
      status: "POSSIBLE_CHANGE",
      matchedItemIds: [],
      rationale: "Stripe not in v1.0 baseline.",
      action: "ACCEPT",
      note: "Accepted for next baseline iteration.",
      baselineVersionId: v1.id,
      baselineVersionNumber: v1.versionNumber,
      decidedAt: new Date().toISOString(),
    };
    project = StorageRepository.addDecision(project, decisionV1);

    // 3. Evolve baseline to v2.0 (adding Stripe checkout as approved scope)
    project = StorageRepository.commitBaseline(project, "Updated Brief with Stripe", [
      { id: "item-1", title: "Login", description: "Email/password", userConfirmed: true },
      { id: "item-2", title: "Stripe Checkout", description: "Credit card payments", userConfirmed: true },
    ]);

    expect(project.baselines).toHaveLength(2);
    const v2 = project.baselines[1];
    expect(v2.versionNumber).toBe("v2.0");
    expect(project.activeBaselineId).toBe(v2.id);

    // 4. Decision #2 recorded under v2.0
    const decisionV2: DecisionRecord = {
      id: "dec-2",
      requestId: "req-2",
      requestText: "We need a checkout page for Stripe credit card payments.",
      status: "IN_SCOPE",
      matchedItemIds: ["item-2"],
      rationale: "Matches Item #2 in approved v2.0 baseline.",
      action: "ACCEPT",
      baselineVersionId: v2.id,
      baselineVersionNumber: v2.versionNumber,
      decidedAt: new Date().toISOString(),
    };
    project = StorageRepository.addDecision(project, decisionV2);

    // 5. Verify audit immutability:
    // Decision 1 must still point to v1.0, Decision 2 must point to v2.0
    expect(project.decisions).toHaveLength(2);
    const storedV1Dec = project.decisions.find((d) => d.id === "dec-1");
    const storedV2Dec = project.decisions.find((d) => d.id === "dec-2");

    expect(storedV1Dec?.baselineVersionNumber).toBe("v1.0");
    expect(storedV1Dec?.baselineVersionId).toBe(v1.id);

    expect(storedV2Dec?.baselineVersionNumber).toBe("v2.0");
    expect(storedV2Dec?.baselineVersionId).toBe(v2.id);
  });

  it("exports valid schema-conforming JSON and resets cleanly", () => {
    let project = StorageRepository.createProject("Export Test");
    project = StorageRepository.commitBaseline(project, "brief", [
      { id: "1", title: "Item", description: "", userConfirmed: true },
    ]);

    // Test JSON export
    const jsonString = StorageRepository.exportJson(project);
    expect(jsonString).toBeDefined();

    const parsed = JSON.parse(jsonString);
    const validated = ProjectSchema.safeParse(parsed);
    expect(validated.success).toBe(true);

    // Test reset
    StorageRepository.resetProject();
    const result = StorageRepository.getProject();
    expect(result.project).toBeNull();
  });
});
