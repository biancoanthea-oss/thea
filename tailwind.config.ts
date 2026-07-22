import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1c2434",
          soft: "#2c3651",
        },
        paper: "#f4f5f2",
        surface: "#ffffff",
        line: "#e2e5df",
        accent: {
          DEFAULT: "#c2703d",
          dark: "#a85c2e",
          soft: "#f3e3d6",
        },
        moss: "#4d6a52",
        mist: "#6b7385",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,36,52,0.04), 0 8px 24px -12px rgba(28,36,52,0.12)",
        lift: "0 8px 30px -10px rgba(28,36,52,0.25)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
