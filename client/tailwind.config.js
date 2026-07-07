/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#d97706',
        background: '#f8fafc',
        surface: '#ffffff',
        text: '#0f172a',
        border: '#e2e8f0',
      },
      spacing: {
        18: '4.5rem',
      },
      borderRadius: {
        xl: '0.75rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
