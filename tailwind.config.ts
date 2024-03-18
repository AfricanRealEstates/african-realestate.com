import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      color: {
        white: "white",
        transparent: "transparent",
        "dark-light": "#ffffff0a",
        primary: "#1890ff",
        red: "#eb6753",
        "heading-color": "#181a20",
        "dark-gray": "#bebdbd",
        "light-gray": "#f7f7f7",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    preflight: false,
  },
};
export default config;
