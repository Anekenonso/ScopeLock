import { describe, it, expect, beforeEach } from "vitest";
import { StorageRepository } from "@/lib/storage/repository";
import { createComparator } from "@/lib/comparator";
import { DecisionRecord } from "@/types";

describe("Decision Flow & Audit History", () => {
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

  it("completes the vertical slice: baseline -> comparison -> decision record -> history", () => {
    // 1. Setup project & baseline
    let project = StorageRepository.createProject("Client Project Beta");
    project = StorageRepository.commitBaseline(project, "raw brief", [
      {
        id: "item-1",
        title: "Stripe Checkout",
        description: "Payment flow in USD",
        userConfirmed: true,
      },
    ]);

    const activeBaseline = project.baselines[0];
    expect(activeBaseline.versionNumber).toBe("v1.0");

    // 2. Evaluate incoming request
    const comparator = createComparator();
    const requestText = "Can we also send SMS receipts via Twilio when someone buys?";
    const evalResult = comparator.evaluate(requestText, activeBaseline.items);

    expect(evalResult.status).toBe("POSSIBLE_CHANGE");
    expect(evalResult.matchedItemIds).toContain("item-1");

    // 3. Record decision
    const decision: DecisionRecord = {
      id: "dec-101",
      requestId: "req-101",
      requestText,
      status: evalResult.status,
      matchedItemIds: evalResult.matchedItemIds,
      rationale: evalResult.rationale,
      action: "REJECT",
      note: "Out of scope for V1. Draft Change Order #1 for $500.",
      baselineVersionId: activeBaseline.id,
      baselineVersionNumber: activeBaseline.versionNumber,
      decidedAt: new Date().toISOString(),
    };

    project = StorageRepository.addDecision(project, decision);

    // 4. Verify decision appears in history
    expect(project.decisions).toHaveLength(1);
    expect(project.decisions[0].action).toBe("REJECT");
    expect(project.decisions[0].baselineVersionNumber).toBe("v1.0");
    expect(project.decisions[0].note).toContain("Change Order #1");

    // 5. Verify persistence in localStorage
    const retrieved = StorageRepository.getProject();
    expect(retrieved.project).not.toBeNull();
    expect(retrieved.project?.decisions).toHaveLength(1);
    expect(retrieved.project?.decisions[0].requestText).toBe(requestText);
  });
});
