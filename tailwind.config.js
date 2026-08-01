/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0e0d0d",
        surface: "#141313",
        "surface-card": "rgba(22, 21, 21, 0.65)",
        "surface-variant": "#262424",
        primary: "#c3f400", // Неоновый кислотный лайм WIBE Style
        "primary-glow": "rgba(195, 244, 0, 0.25)",
        secondary: "#00f0ff", // Кибер-голубой
        tertiary: "#febf1a",  // Неоновый золотой
        "on-background": "#e5e2e1",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#a3a6a6",
        outline: "#353434",
        "outline-variant": "rgba(195, 244, 0, 0.15)",
        error: "#ff4d4d",
        "error-container": "rgba(255, 77, 77, 0.15)"
      },
      fontFamily: {
        display: ["Syne", "Manrope", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        'acid': '0 0 20px rgba(195, 244, 0, 0.25)',
        'acid-lg': '0 0 35px rgba(195, 244, 0, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)'
      }
    }
  },
  plugins: [],
}
