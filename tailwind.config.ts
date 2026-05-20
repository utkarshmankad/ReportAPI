import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        bg:               "var(--color-bg)",
        surface:          "var(--color-surface)",
        "surface-raised": "var(--color-surface-raised)",
        border:           "var(--color-border)",
        "text-primary":   "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-tertiary":  "var(--color-text-tertiary)",
        accent:           "var(--color-accent)",
        "accent-hover":   "var(--color-accent-hover)",
        "accent-subtle":  "var(--color-accent-subtle)",
        "accent-text":    "var(--color-accent-text)",
        success:          "var(--color-success)",
        "success-subtle": "var(--color-success-subtle)",
        error:            "var(--color-error)",
        warning:          "var(--color-warning)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};
export default config;
