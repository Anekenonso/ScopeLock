import { z } from "zod";

export const ScopeItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().default(""),
  acceptanceNotes: z.string().optional(),
  userConfirmed: z.boolean().default(true),
});

export const BaselineVersionSchema = z.object({
  id: z.string(),
  versionNumber: z.string(), // "v1.0", "v2.0"
  items: z.array(ScopeItemSchema),
  sourceBrief: z.string(),
  approvedAt: z.string(), // ISO 8601
});

export const ComparisonStatusSchema = z.enum([
  "IN_SCOPE",
  "POSSIBLE_CHANGE",
  "NEEDS_REVIEW",
]);

export const DecisionActionSchema = z.enum(["ACCEPT", "REJECT", "CLARIFY"]);

export const DecisionRecordSchema = z.object({
  id: z.string(),
  requestId: z.string(),
  requestText: z.string(),
  status: ComparisonStatusSchema,
  matchedItemIds: z.array(z.string()),
  rationale: z.string(),
  uncertaintyWarning: z.string().optional(),
  action: DecisionActionSchema,
  note: z.string().optional(),
  baselineVersionId: z.string(),
  baselineVersionNumber: z.string(),
  decidedAt: z.string(),
});

export const ProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  activeBaselineId: z.string().nullable(),
  baselines: z.array(BaselineVersionSchema),
  draftItems: z.array(ScopeItemSchema).default([]),
  decisions: z.array(DecisionRecordSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ScopeItem = z.infer<typeof ScopeItemSchema>;
export type BaselineVersion = z.infer<typeof BaselineVersionSchema>;
export type ComparisonStatus = z.infer<typeof ComparisonStatusSchema>;
export type DecisionAction = z.infer<typeof DecisionActionSchema>;
export type DecisionRecord = z.infer<typeof DecisionRecordSchema>;
export type Project = z.infer<typeof ProjectSchema>;
