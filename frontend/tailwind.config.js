/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '55': '13.75rem', // 220px
        '55-safe': '16rem', // 256px - extra spacing for main content
      },
      width: {
        '55': '13.75rem', // 220px
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}