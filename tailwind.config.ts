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
        ink: {
          DEFAULT: "#070B14",
          card: "#0E1526",
          surface: "#131C31",
          elevated: "#18243F",
          border: "rgba(255, 255, 255, 0.08)",
          borderHover: "rgba(255, 255, 255, 0.18)",
        },
        paper: "#F8FAFC",
        terracotta: {
          DEFAULT: "#F97316",
          light: "#FB923C",
          dark: "#EA580C",
          soft: "rgba(249, 115, 22, 0.14)",
        },
        lavender: {
          DEFAULT: "#8B5CF6",
          light: "#A78BFA",
          dark: "#7C3AED",
          soft: "rgba(139, 92, 246, 0.14)",
        },
        brand: {
          DEFAULT: "#38BDF8",
          light: "#7DD3FC",
          dark: "#0284C7",
          soft: "rgba(56, 189, 248, 0.14)",
        },
        status: {
          inScope: "#10B981",
          possibleChange: "#F43F5E",
          needsReview: "#F59E0B",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "var(--font-inter)", "-apple-system", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
        floating: "0 20px 45px -15px rgba(0, 0, 0, 0.6)",
        "glow-brand": "0 0 25px -4px rgba(56, 189, 248, 0.25)",
        "glow-emerald": "0 0 25px -4px rgba(16, 185, 129, 0.25)",
        "glow-rose": "0 0 25px -4px rgba(244, 63, 94, 0.25)",
        "glow-terracotta": "0 0 25px -4px rgba(249, 115, 22, 0.25)",
      },
      keyframes: {
        floatBlob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(15px, -20px) scale(1.05)" },
        },
      },
      animation: {
        floatBlob: "floatBlob 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
