/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#5b21b6',
          700: '#4c1d95',
        },
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
      },
      animation: {
        'progress-fill': 'progressFill 0.3s ease-out',
        'scale-up': 'scaleUp 0.15s ease-out',
        'scale-down': 'scaleDown 0.15s ease-out',
      },
      keyframes: {
        progressFill: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02) translateY(-1px)' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.02) translateY(-1px)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}