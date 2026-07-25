import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: {
          DEFAULT: "oklch(0.04 0.005 300)",
          dark: "oklch(0.04 0.005 300)",
          deep: "oklch(0.07 0.008 280)",
          light: "oklch(0.10 0.01 280)",
        },
        gray: {
          900: "oklch(0.18 0.01 280)",
          700: "oklch(0.35 0.015 280)",
          500: "oklch(0.45 0.015 280)",
          400: "oklch(0.55 0.015 280)",
          200: "oklch(0.75 0.01 280)",
          100: "oklch(0.90 0.005 300)",
        },
        white: "oklch(0.93 0.005 300)",
        "white-pure": "oklch(0.98 0.003 300)",
      },
      fontFamily: {
        sans: ["Inter Tight", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        wide: "0.08em",
        wider: "0.12em",
        widest: "0.2em",
      },
      screens: {
        tablet: "768px",
        desktop: "1024px",
      },
    },
  },
  plugins: [],
}

export default config
