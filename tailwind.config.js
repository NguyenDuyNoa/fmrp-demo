/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./containers/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
  ],
  theme: {
    extend: {
      colors: {
        typo: {
          blue: {
            1: "#11315B",
            2: "#3276FA",
            3: '#4752E6',
            4: '#0375F3'

          },
          gray: {
            1: "#9295A4",
            2: "#667085",
            3: "#3A3E4C"
          },
          black: {
            1: '#141522',
            2: '#101828',
            3: '#17181A'
          },
          green: {
            1: "#1A7526",
            2: "#1FC583"
          }
        },
        border: {
          gray: {
            1: "#D0D5DD",
          },
        },
        background: {
          gray: {
            1: "#D0D5DD",
            2: "#9295A4"
          },
          green: {
            1: "#35BD4B"
          },
          blue: {
            1: '#5B65F5',
            2: '#0375F3',
            3: '#EBF5FF',
            4: '#0F4F9E'
          }
        }
      },
      aspectRatio: {
        '16/9': '16 / 9',
      },
      boxShadow: {
        "hover-button": "0px 1px 2px 0px #1018280D",
      },
      screens: {
        "3xl": "1600px",
        xxl: "1400px",
        std: "1400px",
        xlg: "1366px",
        lgd: { max: "1023px" },
        mdd: { max: "767px" },
        xs: "430px",
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
        17: "repeat(17, minmax(0, 1fr))",
        18: "repeat(18, minmax(0, 1fr))",
        19: "repeat(19, minmax(0, 1fr))",
        20: "repeat(20, minmax(0, 1fr))",
        21: "repeat(21, minmax(0, 1fr))",
        22: "repeat(22, minmax(0, 1fr))",
        23: "repeat(23, minmax(0, 1fr))",
        24: "repeat(24, minmax(0, 1fr))",
        25: "repeat(25, minmax(0, 1fr))",
        26: "repeat(26, minmax(0, 1fr))",
        27: "repeat(27, minmax(0, 1fr))",
        28: "repeat(28, minmax(0, 1fr))",
        29: "repeat(29, minmax(0, 1fr))",
        30: "repeat(30, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
      backgroundImage: {
        logo: "url('/logo_1.png')",
        "linear-bg-green":
          "linear-gradient(to bottom right, #1FC583 0%, #1F9285 100%)",
        "linear-bg-progress-full":
          "linear-gradient(to bottom right, #1FBA83 0%, #1FA484 100%)",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/line-clamp"),
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
