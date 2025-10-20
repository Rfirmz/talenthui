/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          500: '#0891b2', // Ocean blue
          600: '#0e7490',
          700: '#155e75',
        },
        secondary: {
          500: '#fbbf24', // Sunset gold
          600: '#f59e0b',
        },
        accent: {
          500: '#10b981', // Island green
          600: '#059669',
        },
        neutral: {
          50: '#fafafa',
          100: '#f4f4f5',
          500: '#71717a',
          900: '#18181b',
        }
      },
    },
  },
  plugins: [],
}
