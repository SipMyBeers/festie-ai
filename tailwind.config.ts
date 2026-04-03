import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        festie: {
          dark: "#0a0a0f",
          purple: "#7c3aed",
          pink: "#ec4899",
          cyan: "#06b6d4",
          orange: "#f97316",
          gold: "#eab308",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui"],
        body: ["var(--font-body)", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;
