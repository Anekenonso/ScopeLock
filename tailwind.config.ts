import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#F4F5F7", // Contribo exact body background
          subtle: "#ECEEF2",
        },
        ink: {
          DEFAULT: "#0A0A0A", // Contribo exact text color
          muted: "#475569",
          faint: "#94A3B8",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          elevated: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0",
          borderHover: "#CBD5E1",
        },
        contribo: {
          sky: "#D0E1ED",       // Contribo blue feature card
          terracotta: "#E59A55", // Contribo orange feature card
          lavender: "#C8B6E2",   // Contribo purple feature card
        },
        brand: {
          DEFAULT: "#0284C7",
          light: "#38BDF8",
          dark: "#0369A1",
          soft: "#E0F2FE",
        },
        status: {
          inScope: "#059669",
          possibleChange: "#EA580C",
          needsReview: "#D97706",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.03)",
        floating: "0 12px 35px -8px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)",
        card: "0 1px 3px rgba(0,0,0,0.05), 0 10px 25px -5px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
