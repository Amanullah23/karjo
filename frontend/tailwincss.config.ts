import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream:   "#FAF8F5",
        navy:    "#1B2E4B",
        emerald: { DEFAULT: "#059669", light: "#D1FAE5", dark: "#047857" },
        charcoal:"#2D3748",
        warm:    { gray: "#E8E4DF", muted: "#9B8E85" },
        card:    "#FFFFFF",
      },
      fontFamily: {
        sans:    ["Inter", "sans-serif"],
        display: ["'Plus Jakarta Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;