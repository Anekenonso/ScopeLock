import { describe, it, expect, beforeEach } from "vitest";
import { createComparator } from "@/lib/comparator";
import { ScopeComparator } from "@/types";
import {
  SAMPLE_BASELINE_ITEMS,
  KILL_TEST_CASES,
} from "@/lib/fixtures/killTestCases";

describe("ScopeComparator — Gate 1 Synthetic Kill-Tests", () => {
  let comparator: ScopeComparator;

  beforeEach(() => {
    comparator = createComparator();
  });

  KILL_TEST_CASES.forEach((tc) => {
    it(`Case #${tc.id}: ${tc.description}`, () => {
      const result = comparator.evaluate(tc.request, SAMPLE_BASELINE_ITEMS);

      // 1. Verify Status
      expect(
        result.status,
        `Expected status for case ${tc.id} ("${tc.request}") to be ${tc.expectedStatus}, but got ${result.status}. Rationale: ${result.rationale}`
      ).toBe(tc.expectedStatus);

      // 2. Verify Matched Items
      if (tc.expectedMatchedItemIds.length > 0) {
        expect(result.matchedItemIds).toEqual(
          expect.arrayContaining(tc.expectedMatchedItemIds)
        );
      }

      // 3. Verify Plain-Language Rationale
      expect(result.rationale).toBeDefined();
      expect(result.rationale.length).toBeGreaterThan(10);
    });
  });

  it("produces deterministic output for identical inputs across multiple runs", () => {
    const request = "Can we also send SMS receipts via Twilio when someone buys?";
    const run1 = comparator.evaluate(request, SAMPLE_BASELINE_ITEMS);
    const run2 = comparator.evaluate(request, SAMPLE_BASELINE_ITEMS);

    expect(run1).toEqual(run2);
  });
});
