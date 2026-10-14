import { describe, it, expect, beforeEach } from "vitest";
import { StorageRepository } from "@/lib/storage/repository";
import { ProjectSchema } from "@/lib/storage/schema";

describe("StorageRepository", () => {
  beforeEach(() => {
    // Mock local storage in Node environment
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

  it("creates a valid project conforming to Zod schema", () => {
    const project = StorageRepository.createProject("Client Project A");
    expect(project.name).toBe("Client Project A");
    expect(project.baselines).toHaveLength(0);

    const parsed = ProjectSchema.safeParse(project);
    expect(parsed.success).toBe(true);
  });

  it("commits a baseline and assigns sequential version number v1.0", () => {
    const project = StorageRepository.createProject("SaaS Build");
    const items = [
      { id: "1", title: "Login", description: "Auth flow", userConfirmed: true },
    ];
    const updated = StorageRepository.commitBaseline(project, "raw brief", items);

    expect(updated.baselines).toHaveLength(1);
    expect(updated.baselines[0].versionNumber).toBe("v1.0");
    expect(updated.activeBaselineId).toBe(updated.baselines[0].id);
  });

  it("bumps baseline version sequentially to v2.0 on second commit", () => {
    let project = StorageRepository.createProject("SaaS Build");
    project = StorageRepository.commitBaseline(project, "raw v1", [
      { id: "1", title: "Item 1", description: "", userConfirmed: true },
    ]);
    project = StorageRepository.commitBaseline(project, "raw v2", [
      { id: "1", title: "Item 1", description: "", userConfirmed: true },
      { id: "2", title: "Item 2", description: "", userConfirmed: true },
    ]);

    expect(project.baselines).toHaveLength(2);
    expect(project.baselines[1].versionNumber).toBe("v2.0");
    expect(project.activeBaselineId).toBe(project.baselines[1].id);
  });

  it("handles corrupted storage safely without crashing", () => {
    window.localStorage.setItem("scopelock_project_v1", "{ invalid json corrupt");
    const result = StorageRepository.getProject();
    expect(result.project).toBeNull();
    expect(result.isCorrupted).toBe(true);
  });
});
