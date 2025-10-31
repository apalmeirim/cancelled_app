/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'google-sans-code': ['"Google Sans Code"', 'monospace'],
      },
    },
  },
  plugins: [],
}

