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
      },
      fontFamily: {
        sans: ["'Varela Round'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
