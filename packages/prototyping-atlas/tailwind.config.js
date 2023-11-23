/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        muted: '#0005119e'
      },
      fontFamily: {
        'sans': ['-apple-system', 'Roboto', 'sans-serif'],
        'dm-display': ['DM Serif Display'],
      },
    },
  },
  plugins: [],
}

