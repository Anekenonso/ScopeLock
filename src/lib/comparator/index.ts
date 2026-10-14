import { ScopeComparator } from "@/types";
import { DeterministicComparator } from "./deterministic";

export function createComparator(): ScopeComparator {
  return new DeterministicComparator();
}

export * from "./deterministic";
export * from "./rules";
