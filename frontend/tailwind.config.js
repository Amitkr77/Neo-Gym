/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // NeoGym design tokens
        ink: {
          DEFAULT: "#0B0B0C", // primary dark surface / text
          900: "#0B0B0C",
          800: "#151517",
          700: "#1F1F22",
          600: "#2C2C30",
        },
        bone: {
          DEFAULT: "#F4F1EC", // warm off-white page background
          50: "#FBFAF7",
          100: "#F4F1EC",
          200: "#E8E3DA",
          300: "#D6CFC2",
        },
        stone: {
          400: "#9A958C", // muted text on dark
          500: "#6B675F", // muted text on light: ~5.0:1 on bone, ~5.7:1 on white (AA)
          600: "#57534C",
        },
        ember: {
          DEFAULT: "#FF5B2E", // single accent, evolved from the original #ff7e5f
          400: "#FF7A52",
          500: "#FF5B2E",
          600: "#E6461B",
          700: "#B83510", // accent text on light backgrounds (AA)
        },
      },
      fontFamily: {
        display: ['"Archivo"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.18em",
      },
      maxWidth: {
        content: "76rem",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
