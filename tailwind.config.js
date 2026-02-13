/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // المسار ده هو اللي بيعرف Tailwind يدور فين على الـ Classes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}