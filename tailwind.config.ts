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
          DEFAULT: "#0B0F19",
          muted: "#111827",
        },
        surface: {
          DEFAULT: "#161E31",
          elevated: "#1E293B",
          border: "rgba(255, 255, 255, 0.08)",
        },
        brand: {
          DEFAULT: "#38BDF8",
          glow: "rgba(56, 189, 248, 0.15)",
        },
        status: {
          inScope: "#10B981",
          possibleChange: "#F43F5E",
          needsReview: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
