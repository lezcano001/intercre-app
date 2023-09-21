import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          450: "#ff9100"
        },
        red: {
          450: "#B4140F"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
