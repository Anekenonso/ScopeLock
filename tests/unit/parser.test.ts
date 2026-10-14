import { describe, it, expect } from "vitest";
import { parseBriefIntoScopeItems } from "@/lib/parser/briefParser";

describe("briefParser", () => {
  it("parses bullet-point lists with titles and descriptions", () => {
    const brief = `
    - User Authentication: Email and password login flow
    - Stripe Checkout: Credit card payment integration
    - Customer Portal: Download invoices and view history
    `;
    const items = parseBriefIntoScopeItems(brief);

    expect(items).toHaveLength(3);
    expect(items[0].title).toBe("User Authentication");
    expect(items[0].description).toBe("Email and password login flow");
    expect(items[1].title).toBe("Stripe Checkout");
    expect(items[2].title).toBe("Customer Portal");
  });

  it("parses numbered lists correctly", () => {
    const brief = `
    1. Analytics Dashboard
    2. Data Export: CSV and JSON formats
    `;
    const items = parseBriefIntoScopeItems(brief);

    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Analytics Dashboard");
    expect(items[1].title).toBe("Data Export");
  });

  it("safely falls back to a single editable card for unstructured text", () => {
    const rawText = "We just want a simple application where customers can buy tickets online.";
    const items = parseBriefIntoScopeItems(rawText);

    expect(items).toHaveLength(1);
    expect(items[0].description).toBe(rawText);
  });

  it("returns empty array for empty or whitespace-only brief", () => {
    expect(parseBriefIntoScopeItems("")).toEqual([]);
    expect(parseBriefIntoScopeItems("    \n\n  ")).toEqual([]);
  });
});
