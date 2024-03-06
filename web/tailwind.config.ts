import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        readable: "var(--width-readable)",
      },
      minWidth: {
        supported: "var(--width-min-supported)",
      },
      maxWidth: {
        readable: "var(--width-readable)",
        supported: "var(--width-max-supported)",
      },
      colors: {
        primary: {
          1: "rgb(var(--primary-color-1) / <alpha-value>)",
        },
        "on-primary": {
          1: "rgb(var(--on-primary-color-1) / <alpha-value>)",
        },
        secondary: {
          1: "rgb(var(--secondary-color-1) / <alpha-value>)",
        },
        accent: {
          1: "rgb(var(--accent-color-1) / <alpha-value>)",
        },
        "focused-accent": {
          1: "rgb(var(--focused-accent-color-1) / <alpha-value>)",
        },
      },
      fontSize: {
        xs: "var(--text-xs)",
        sm: "var(--text-sm)",
        base: "var(--text-base)",
        lg: "var(--text-lg)",
        xl: "var(--text-xl)",
        "2xl": "var(--text-2xl)",
        "3xl": "var(--text-3xl)",
        "4xl": "var(--text-4xl)",
      },
      spacing: {
        "3xs": "var(--space-3xs)",
        "2xs": "var(--space-2xs)",
        xs: "var(--space-xs)",
        s: "var(--space-s)",
        m: "var(--space-m)",
        l: "var(--space-l)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "3xs-2xs": "var(--space-3xs-2xs)",
        "2xs-xs": "var(--space-2xs-xs)",
        "xs-s": "var(--space-xs-s)",
        "s-m": "var(--space-s-m)",
        "m-l": "var(--space-m-l)",
        "l-xl": "var(--space-l-xl)",
        "xl-2xl": "var(--space-xl-2xl)",
        "2xl-3xl": "var(--space-2xl-3xl)",
        "s-l": "var(--space-s-l)",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide"), require("tailwindcss-dir")()],
};
export default config;
