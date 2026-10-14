export const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself",
  "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then",
  "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those",
  "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're",
  "we've", "were", "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while",
  "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll",
  "you're", "you've", "your", "yours", "yourself", "yourselves",
  // Common polite fillers
  "please", "also", "just", "make", "sure", "want", "like", "need", "could", "would", "can", "someone"
]);

export interface NovelCapabilityRule {
  pattern: RegExp;
  category: "vendor" | "platform" | "feature" | "format";
  label: string;
}

export const NOVEL_CAPABILITY_RULES: NovelCapabilityRule[] = [
  // Vendors & External Services
  { pattern: /\b(twilio|sendgrid|mailgun|postmark|stripe|paypal|braintree|aws|s3|firebase|supabase|algolia)\b/i, category: "vendor", label: "Third-party service" },
  { pattern: /\b(sms|text message|telephony|phone verification)\b/i, category: "vendor", label: "SMS / Telephony" },
  
  // Platform additions
  { pattern: /\b(mobile app|ios|android|react native|flutter|electron|desktop app|chrome extension)\b/i, category: "platform", label: "New platform (Mobile/Desktop)" },
  
  // High-impact feature expansions
  { pattern: /\b(multi-?currency|forex|foreign exchange|currency conversion|live exchange)\b/i, category: "feature", label: "Multi-currency / Forex" },
  { pattern: /\b(pdf|excel|xlsx|spreadsheet|csv export)\b/i, category: "format", label: "File Export (PDF/Excel)" },
  { pattern: /\b(dark mode|theme switcher|light mode)\b/i, category: "feature", label: "Theme system (Dark mode)" },
  { pattern: /\b(social login|oauth|google login|github login|facebook login|apple login|sso)\b/i, category: "feature", label: "OAuth / Social Login" },
  { pattern: /\b(multi-?language|i18n|localization|translation|bilingual)\b/i, category: "feature", label: "Internationalization (i18n)" },
  { pattern: /\b(subscription|recurring|saas billing|stripe billing)\b/i, category: "feature", label: "Subscription billing" },
];

export const INQUIRY_PATTERNS = [
  /\b(is it|is the|how fast|how secure|are we|will it be|can it handle)\b/i,
];

export const CONCEPT_SYNONYMS: Record<string, string[]> = {
  buys: ["buy", "purchase", "order", "checkout", "payment"],
  buy: ["buys", "purchase", "order", "checkout", "payment"],
  buying: ["buys", "buy", "purchase", "order", "checkout", "payment"],
  purchase: ["buy", "buys", "order", "checkout", "payment"],
  purchases: ["buy", "buys", "order", "checkout", "payment"],
  receipt: ["receipts", "invoice", "invoices", "payment", "billing"],
  receipts: ["receipt", "invoice", "invoices", "payment", "billing"],
  report: ["reports", "records", "history", "dashboard"],
  reports: ["report", "records", "history", "dashboard"],
  currency: ["forex", "usd", "exchange", "rate", "rates"],
};
