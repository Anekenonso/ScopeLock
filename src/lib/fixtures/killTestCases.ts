import { ScopeItem } from "@/types";

export const SAMPLE_BASELINE_ITEMS: ScopeItem[] = [
  {
    id: "item-1",
    title: "User Authentication",
    description: "Standard email and password login, signup, and session handling.",
    acceptanceNotes: "Users can register with email and secure password, log in, and log out.",
    userConfirmed: true,
  },
  {
    id: "item-2",
    title: "Stripe Checkout Integration",
    description: "Credit card payment flow via Stripe Elements in USD currency.",
    acceptanceNotes: "Single payment checkout page processing credit cards via Stripe.",
    userConfirmed: true,
  },
  {
    id: "item-3",
    title: "Order History & Invoices",
    description: "Customer dashboard showing past purchase records and invoice details on screen.",
    acceptanceNotes: "Users can view a list of completed orders and transaction dates.",
    userConfirmed: true,
  },
];

export interface KillTestCase {
  id: number;
  description: string;
  request: string;
  expectedStatus: "IN_SCOPE" | "POSSIBLE_CHANGE" | "NEEDS_REVIEW";
  expectedMatchedItemIds: string[];
  rationaleKeywordCheck: string[];
}

export const KILL_TEST_CASES: KillTestCase[] = [
  {
    id: 1,
    description: "Clearly in-scope request matching item #1",
    request: "Can you implement user login with email and password?",
    expectedStatus: "IN_SCOPE",
    expectedMatchedItemIds: ["item-1"],
    rationaleKeywordCheck: ["Strong match", "User Authentication"],
  },
  {
    id: 2,
    description: "Clearly in-scope request matching item #2",
    request: "We need a checkout page for Stripe credit card payments.",
    expectedStatus: "IN_SCOPE",
    expectedMatchedItemIds: ["item-2"],
    rationaleKeywordCheck: ["Strong match", "Stripe Checkout"],
  },
  {
    id: 3,
    description: "Clearly in-scope request matching item #3",
    request: "Can users view their past order history and invoices?",
    expectedStatus: "IN_SCOPE",
    expectedMatchedItemIds: ["item-3"],
    rationaleKeywordCheck: ["Strong match", "Order History"],
  },
  {
    id: 4,
    description: "Matches checkout but flags novel vendor (Twilio / SMS)",
    request: "Can we also send SMS receipts via Twilio when someone buys?",
    expectedStatus: "POSSIBLE_CHANGE",
    expectedMatchedItemIds: ["item-2"],
    rationaleKeywordCheck: ["Twilio", "SMS", "new capability/vendor"],
  },
  {
    id: 5,
    description: "Clearly out-of-scope request for a novel platform (mobile app)",
    request: "We'd like to build an iOS and Android mobile app version.",
    expectedStatus: "POSSIBLE_CHANGE",
    expectedMatchedItemIds: [],
    rationaleKeywordCheck: ["platform", "mobile"],
  },
  {
    id: 6,
    description: "Touches checkout but adds novel capability (multi-currency / forex)",
    request: "Please add multi-currency conversion with live forex rates.",
    expectedStatus: "POSSIBLE_CHANGE",
    expectedMatchedItemIds: ["item-2"],
    rationaleKeywordCheck: ["Forex", "Multi-currency"],
  },
  {
    id: 7,
    description: "Touches order history but adds novel export format (Excel / PDF)",
    request: "Could we export monthly reports to Excel or PDF format?",
    expectedStatus: "POSSIBLE_CHANGE",
    expectedMatchedItemIds: ["item-3"],
    rationaleKeywordCheck: ["PDF", "Excel"],
  },
  {
    id: 8,
    description: "Ambiguous subjective request with insufficient concrete evidence",
    request: "Make sure the buttons look good.",
    expectedStatus: "NEEDS_REVIEW",
    expectedMatchedItemIds: [],
    rationaleKeywordCheck: ["subjective", "ambiguous"],
  },
  {
    id: 9,
    description: "Performance inquiry / question rather than a scope feature",
    request: "Is the checkout fast?",
    expectedStatus: "NEEDS_REVIEW",
    expectedMatchedItemIds: ["item-2"],
    rationaleKeywordCheck: ["question", "inquiry"],
  },
  {
    id: 10,
    description: "Partial overlap with Auth, but introduces novel OAuth providers (Google/GitHub)",
    request: "Add social login via Google and GitHub.",
    expectedStatus: "NEEDS_REVIEW",
    expectedMatchedItemIds: ["item-1"],
    rationaleKeywordCheck: ["authentication", "OAuth", "Social"],
  },
  {
    id: 11,
    description: "Out-of-scope system-wide theme capability (Dark Mode)",
    request: "Include dark mode support across all screens.",
    expectedStatus: "POSSIBLE_CHANGE",
    expectedMatchedItemIds: [],
    rationaleKeywordCheck: ["Dark mode", "new capability"],
  },
  {
    id: 12,
    description: "Empty / whitespace input fallback",
    request: "   ",
    expectedStatus: "NEEDS_REVIEW",
    expectedMatchedItemIds: [],
    rationaleKeywordCheck: ["empty"],
  },
];
