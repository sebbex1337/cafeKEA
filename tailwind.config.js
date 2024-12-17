/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#FFF",
        secBackground: "#D9CAB3",
        primary: "#8B5E3C",
        secondary: "#C19A6B",
        accent: "#F4E3D7",
        border: "#A67858",
        textPrimary: "#3C2F2F",
        textSecondary: "#7E7054",
        warning: "#D9534F",
        success: "#5CB85C",
      },
    },
  },
  plugins: [],
};
