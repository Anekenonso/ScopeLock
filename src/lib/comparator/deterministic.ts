import { ScopeItem, ComparisonResult, ScopeComparator } from "@/types";
import { STOP_WORDS, NOVEL_CAPABILITY_RULES, INQUIRY_PATTERNS, CONCEPT_SYNONYMS } from "./rules";

export class DeterministicComparator implements ScopeComparator {
  evaluate(request: string, baselineItems: ScopeItem[]): ComparisonResult {
    const trimmed = (request || "").trim();

    // Edge Case: Empty or whitespace
    if (!trimmed) {
      return {
        status: "NEEDS_REVIEW",
        matchedItemIds: [],
        rationale: "Request is empty or contains insufficient text to evaluate against the baseline.",
        uncertaintyWarning: "Empty input cannot be compared.",
        confidenceScore: 0,
      };
    }

    // Edge Case: Inquiries / performance questions
    const isInquiry = INQUIRY_PATTERNS.some((pattern) => pattern.test(trimmed));
    if (isInquiry && trimmed.endsWith("?")) {
      const tokens = this.tokenize(trimmed);
      const { bestMatches } = this.calculateOverlap(tokens, baselineItems);
      return {
        status: "NEEDS_REVIEW",
        matchedItemIds: bestMatches.map((m) => m.item.id),
        rationale: "This looks like a question or performance inquiry rather than a direct scope specification.",
        uncertaintyWarning: "Performance questions or general inquiries require discussion with the client.",
        confidenceScore: 0.3,
      };
    }

    const requestTokens = this.tokenize(trimmed);
    const baselineText = baselineItems
      .map((item) => `${item.title} ${item.description} ${item.acceptanceNotes || ""}`)
      .join(" ")
      .toLowerCase();

    // Check for novel capabilities (vendors, platforms, high-impact features)
    const detectedNovelRules = NOVEL_CAPABILITY_RULES.filter((rule) => {
      if (rule.pattern.test(trimmed)) {
        // If the baseline already explicitly includes this term, it's not novel!
        const matchesBaseline = rule.pattern.test(baselineText);
        return !matchesBaseline;
      }
      return false;
    });

    // Special check for OAuth/Social Login: if auth is in baseline, this is an ambiguous partial match (NEEDS_REVIEW)
    const isSocialLoginRule = detectedNovelRules.some(
      (r) => r.label === "OAuth / Social Login"
    );
    const hasAuthInBaseline = baselineItems.some((item) =>
      /\b(auth|login|account|password)\b/i.test(`${item.title} ${item.description}`)
    );

    if (isSocialLoginRule && hasAuthInBaseline) {
      const authItems = baselineItems.filter((item) =>
        /\b(auth|login|account|password)\b/i.test(`${item.title} ${item.description}`)
      );
      return {
        status: "NEEDS_REVIEW",
        matchedItemIds: authItems.map((i) => i.id),
        rationale: `Request touches existing authentication (${authItems.map((i) => i.title).join(", ")}), but introduces third-party OAuth/Social providers (e.g. Google/GitHub) not explicitly scoped.`,
        uncertaintyWarning: "Partial overlap: scope expands auth scope beyond email/password.",
        confidenceScore: 0.5,
      };
    }

    // If novel rules detected that are completely absent from baseline
    if (detectedNovelRules.length > 0) {
      const novelLabels = detectedNovelRules.map((r) => r.label).join(", ");
      const { bestMatches } = this.calculateOverlap(requestTokens, baselineItems);
      const matchedIds = bestMatches.filter((m) => m.score >= 0.1).map((m) => m.item.id);

      if (matchedIds.length > 0) {
        return {
          status: "POSSIBLE_CHANGE",
          matchedItemIds: matchedIds,
          rationale: `Touches existing workflow (${bestMatches.map((m) => m.item.title).join(", ")}), but introduces new capability/vendor not in baseline: ${novelLabels}.`,
          uncertaintyWarning: "Requires change order evaluation for newly introduced vendor or service.",
          confidenceScore: 0.85,
        };
      }

      return {
        status: "POSSIBLE_CHANGE",
        matchedItemIds: [],
        rationale: `Introduces a new capability or platform not present in the approved baseline: ${novelLabels}.`,
        confidenceScore: 0.9,
      };
    }

    // Overlap evaluation
    const { bestMatches, maxScore } = this.calculateOverlap(requestTokens, baselineItems);

    // If request text is very short/subjective and token overlap is vague
    const isVagueSubjective = /\b(look good|looks nice|clean up|make better|check it)\b/i.test(trimmed);
    if (isVagueSubjective || (requestTokens.length <= 3 && maxScore < 0.4)) {
      return {
        status: "NEEDS_REVIEW",
        matchedItemIds: bestMatches.filter((m) => m.score > 0.1).map((m) => m.item.id),
        rationale: "Request language is subjective or ambiguous. Not enough concrete evidence to determine scope boundaries.",
        uncertaintyWarning: "Ask client for specific acceptance criteria.",
        confidenceScore: 0.25,
      };
    }

    // High confidence in-scope match
    if (maxScore >= 0.35 && bestMatches.length > 0) {
      const topMatch = bestMatches[0];
      return {
        status: "IN_SCOPE",
        matchedItemIds: [topMatch.item.id],
        rationale: `Strong match with approved item "${topMatch.item.title}". Key terms and capabilities align with Baseline.`,
        confidenceScore: Math.min(0.95, topMatch.score + 0.3),
      };
    }

    // Moderate/Ambiguous overlap
    if (maxScore >= 0.20 && bestMatches.length > 0) {
      return {
        status: "NEEDS_REVIEW",
        matchedItemIds: bestMatches.map((m) => m.item.id),
        rationale: `Partial term overlap with "${bestMatches[0].item.title}", but specific requirements differ from baseline notes.`,
        uncertaintyWarning: "Ambiguous: Verify whether this is a clarification or a modification of existing work.",
        confidenceScore: 0.5,
      };
    }

    // Default fallback: No substantial overlap and no novel rule matched
    return {
      status: "POSSIBLE_CHANGE",
      matchedItemIds: [],
      rationale: "Request describes functionality that has no clear match in the approved scope baseline.",
      confidenceScore: 0.75,
    };
  }

  private tokenize(text: string): string[] {
    const rawTokens = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

    const expanded: string[] = [];
    for (const t of rawTokens) {
      expanded.push(t);
      if (t.includes("-")) {
        const parts = t.split("-").filter((p) => p.length > 2 && !STOP_WORDS.has(p));
        expanded.push(...parts);
      }
    }

    return expanded;
  }

  private calculateOverlap(
    requestTokens: string[],
    items: ScopeItem[]
  ): { bestMatches: { item: ScopeItem; score: number }[]; maxScore: number } {
    if (items.length === 0 || requestTokens.length === 0) {
      return { bestMatches: [], maxScore: 0 };
    }

    const matches = items.map((item) => {
      const itemText = `${item.title} ${item.description} ${item.acceptanceNotes || ""}`;
      const itemTokens = new Set(this.tokenize(itemText));

      let sharedCount = 0;
      for (const token of requestTokens) {
        if (itemTokens.has(token)) {
          sharedCount++;
        } else if (CONCEPT_SYNONYMS[token]) {
          const synonymMatch = CONCEPT_SYNONYMS[token].some((syn) => itemTokens.has(syn));
          if (synonymMatch) {
            sharedCount += 0.8;
          }
        }
      }

      // Normalized overlap ratio against unique request tokens
      const uniqueRequestTokens = new Set(requestTokens);
      const score = sharedCount / Math.max(1, uniqueRequestTokens.size);
      return { item, score };
    });

    matches.sort((a, b) => b.score - a.score);
    const maxScore = matches[0]?.score || 0;
    const bestMatches = matches.filter((m) => m.score >= 0.1);

    return { bestMatches, maxScore };
  }
}
