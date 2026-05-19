import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#d9e1ea",
        background: "#f6f8fb",
        foreground: "#172033",
        primary: "#155eef",
        accent: "#0f766e",
        danger: "#b42318"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(31, 41, 55, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
