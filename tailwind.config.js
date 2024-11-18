/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all of your component files.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: "#fbfaef",
                secBackground: "#ffa549",
                knap: "#49A3FF",
                border: "#b2623a",
                secKnap: "#D9A76A",
                textPrimary: "#3C2F2F",
                textSecondary: "#756F6D",
                warning: "#C0392B",
                success: "#6ABF69",
            },
        },
    },
    plugins: [],
};
