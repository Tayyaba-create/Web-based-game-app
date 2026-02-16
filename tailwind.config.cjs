/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0F111A",
        surface: "#1A1C25",
        primary: "#7B61FF",
        secondary: "#3A8DFF",
        textPrimary: "#FFFFFF",
        accent: "#4CC9F0",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px rgba(123, 97, 255, 0.4)",
      },
      borderRadius: {
        card: "16px",
      },
      keyframes: {
        "fade-in-slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "fade-in-slide-down": "fade-in-slide-down 0.5s ease-out forwards",
        "pulse-slow": "pulse-slow 2s ease-in-out infinite",
        "bounce-slow": "bounce-slow 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
