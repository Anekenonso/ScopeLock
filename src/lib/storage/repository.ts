import { Project, ProjectSchema, ScopeItem, BaselineVersion, DecisionRecord } from "@/types";
import { DEMO_PROJECT } from "@/lib/fixtures/demoProject";

const STORAGE_KEY = "scopelock_project_v1";

export class StorageRepository {
  static isAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const testKey = "__scopelock_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  static getProject(): { project: Project | null; isCorrupted: boolean } {
    if (!this.isAvailable()) {
      return { project: null, isCorrupted: false };
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { project: null, isCorrupted: false };

      const parsedJson = JSON.parse(raw);
      const validation = ProjectSchema.safeParse(parsedJson);

      if (validation.success) {
        return { project: validation.data, isCorrupted: false };
      } else {
        console.error("Storage schema validation failed:", validation.error);
        return { project: null, isCorrupted: true };
      }
    } catch (e) {
      console.error("Failed to read from localStorage:", e);
      return { project: null, isCorrupted: true };
    }
  }

  static saveProject(project: Project): boolean {
    if (!this.isAvailable()) return false;
    try {
      const validated = ProjectSchema.parse(project);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
      return true;
    } catch (e) {
      console.error("Failed to save project to localStorage:", e);
      return false;
    }
  }

  static createProject(name: string): Project {
    const project: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim() || "Untitled Project",
      activeBaselineId: null,
      baselines: [],
      draftItems: [],
      decisions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.saveProject(project);
    return project;
  }

  static loadDemoProject(): Project {
    const project = { ...DEMO_PROJECT, id: `demo-${Date.now()}` };
    this.saveProject(project);
    return project;
  }

  static commitBaseline(
    project: Project,
    sourceBrief: string,
    items: ScopeItem[]
  ): Project {
    const versionCount = project.baselines.length + 1;
    const versionNumber = `v${versionCount}.0`;

    const newBaseline: BaselineVersion = {
      id: `baseline-${Date.now()}`,
      versionNumber,
      sourceBrief,
      approvedAt: new Date().toISOString(),
      items: items.map((item, idx) => ({
        ...item,
        id: item.id || `item-${idx + 1}`,
      })),
    };

    const updated: Project = {
      ...project,
      activeBaselineId: newBaseline.id,
      baselines: [...project.baselines, newBaseline],
      draftItems: [],
      updatedAt: new Date().toISOString(),
    };

    this.saveProject(updated);
    return updated;
  }

  static saveDraftItems(project: Project, draftItems: ScopeItem[]): Project {
    const updated: Project = {
      ...project,
      draftItems,
      updatedAt: new Date().toISOString(),
    };
    this.saveProject(updated);
    return updated;
  }

  static addDecision(project: Project, decision: DecisionRecord): Project {
    const updated: Project = {
      ...project,
      decisions: [decision, ...project.decisions],
      updatedAt: new Date().toISOString(),
    };
    this.saveProject(updated);
    return updated;
  }

  static exportJson(project: Project): string {
    return JSON.stringify(project, null, 2);
  }

  static resetProject(): void {
    if (!this.isAvailable()) return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to clear localStorage:", e);
    }
  }
}
