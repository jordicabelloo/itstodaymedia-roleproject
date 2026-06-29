/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#141414",
        card: "#1c1c1c",
        border: "#2a2a2a",
        muted: "#555",
        // shadcn/ui CSS variable tokens
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary:    { DEFAULT: "var(--primary)", foreground: "var(--primary-foreground)" },
        input:      "var(--input)",
        ring:       "var(--ring)",
      },
      fontFamily: {
        sans: ["'Varela Round'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
