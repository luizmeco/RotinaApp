/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Cores base extraídas do seu DESIGN.md
        background: "#0e141a",
        "on-background": "#dde3ec",
        surface: "#0e141a",
        "surface-bright": "#343a41",
        "surface-variant": "#2f353c",
        "on-surface": "#dde3ec",
        "on-surface-variant": "#c0c7d4",
        outline: "#8a919e",
        "outline-variant": "#404752",

        // Cores primárias (Azul)
        primary: "#0078d4", // Ajustado para o Primary Blue do texto
        "on-primary": "#ffffff",
        "on-secondary": "#c0c7d4",
        "primary-container": "#0091ff96",
        "primary-light": "#a3c9ff",

        // Cores de sotaque (Liquid Cyan / Vidro)
        accent: "#50E6FF",
        "glass-white": "rgba(255, 255, 255, 0.08)",
        "glass-border": "rgba(255, 255, 255, 0.1)",

        // Erro
        error: "#ffb4ab",
        "on-error": "#690005",
      },
      fontFamily: {
        light: ["HankenGrotesk_300Light"],
        regular: ["HankenGrotesk_400Regular"],
        semibold: ["HankenGrotesk_600SemiBold"],
        bold: ["HankenGrotesk_700Bold"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px", // Padrão para os cards de vidro
        xl: "24px",
        full: "9999px",
      },
      spacing: {
        base: "4px",
        mobile: "16px",
        desktop: "64px",
        panel: "24px",
      },
    },
  },
  plugins: [],
};
