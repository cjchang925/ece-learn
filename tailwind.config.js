/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        accent: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        dark: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-accent': 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
        'gradient-mixed': 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
