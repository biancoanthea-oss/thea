import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: "#6f7a4f",
        "sage-dark": "#5a6440",
        blush: "#cf857d",
        "blush-dark": "#b96e66",
        cream: "#f6efe2",
      },
      fontFamily: {
        script: ["var(--font-script)", "cursive"],
        body: ["var(--font-body)", "serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1.2s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
