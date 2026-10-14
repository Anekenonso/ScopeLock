import { Project } from "@/types";

export const DEMO_CLIENT_BRIEF = `Project Scope: Modern SaaS Billing & Member Portal

1. User Authentication: Email and password login, signup, password reset, and secure session management.
2. Stripe Checkout Integration: Single payment checkout page processing credit cards via Stripe in USD currency.
3. Order History & Invoices: Customer dashboard showing past purchase records, invoice details, and order dates on screen.
`;

export const DEMO_PROJECT: Project = {
  id: "demo-project-1",
  name: "Acme SaaS Portal",
  activeBaselineId: "baseline-1",
  baselines: [
    {
      id: "baseline-1",
      versionNumber: "v1.0",
      sourceBrief: DEMO_CLIENT_BRIEF,
      approvedAt: "2026-10-14T09:00:00.000Z",
      items: [
        {
          id: "item-1",
          title: "User Authentication",
          description: "Email and password login, signup, password reset, and secure session management.",
          acceptanceNotes: "Users can register with email and secure password, log in, and log out.",
          userConfirmed: true,
        },
        {
          id: "item-2",
          title: "Stripe Checkout Integration",
          description: "Single payment checkout page processing credit cards via Stripe in USD currency.",
          acceptanceNotes: "Single payment checkout page processing credit cards via Stripe.",
          userConfirmed: true,
        },
        {
          id: "item-3",
          title: "Order History & Invoices",
          description: "Customer dashboard showing past purchase records, invoice details, and order dates on screen.",
          acceptanceNotes: "Users can view a list of completed orders and transaction dates.",
          userConfirmed: true,
        },
      ],
    },
  ],
  draftItems: [],
  decisions: [],
  createdAt: "2026-10-14T08:30:00.000Z",
  updatedAt: "2026-10-14T09:00:00.000Z",
};
