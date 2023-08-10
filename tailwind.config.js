/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx}",
        "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
    ],
    theme: {
        extend: {
            screens: {
                "3xl": "1600px",
                xxl: "1400px",
            },
            gridTemplateColumns: {
                13: "repeat(13, minmax(0, 1fr))",
                14: "repeat(14, minmax(0, 1fr))",
                26: "repeat(26, minmax(0, 1fr))",
            },
            backgroundImage: {
                logo: "url('/logo_1.png')",
            },
        },
    },
    plugins: [
        require("@tailwindcss/line-clamp"),
        require("tailwind-scrollbar"),
        require("@tailwindcss/aspect-ratio"),
        function ({ addUtilities }) {
            addUtilities({
                ".font-oblique": {
                    "font-style": "oblique",
                },
            });
        },
    ],
};
