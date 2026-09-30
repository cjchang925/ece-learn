/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      // Semantic, appearance-adaptive colors (see CSS variables in src/index.css)
      colors: {
        canvas: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        fill: 'var(--fill)',
        label: 'var(--label)',
        'label-2': 'var(--label-2)',
        'label-3': 'var(--label-3)',
        separator: 'var(--separator)',
        accent: 'var(--accent)',
        'accent-text': 'var(--accent-text)',
        'accent-tint': 'var(--accent-tint)',
        destructive: 'var(--destructive)',
      },
      borderColor: {
        DEFAULT: 'var(--separator)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans TC',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'PingFang TC',
          'Microsoft JhengHei',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
