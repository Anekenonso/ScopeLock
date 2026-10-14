export * from "@/lib/storage/schema";

export interface ComparisonResult {
  status: "IN_SCOPE" | "POSSIBLE_CHANGE" | "NEEDS_REVIEW";
  matchedItemIds: string[];
  rationale: string;
  uncertaintyWarning?: string;
  confidenceScore: number;
}

export interface ScopeComparator {
  evaluate(request: string, baselineItems: import("@/lib/storage/schema").ScopeItem[]): ComparisonResult;
}
