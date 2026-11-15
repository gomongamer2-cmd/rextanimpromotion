/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0C0E12",
        surface: "#14171E",
        "surface-elevated": "#1B202A",
        brand: {
          DEFAULT: "#D81F26",
          hover: "#B9151B",
          subtle: "rgba(216, 31, 38, 0.12)",
        },
      },
      borderRadius: {
        container: "16px",
        element: "8px",
      },
    },
  },
  plugins: [],
};
