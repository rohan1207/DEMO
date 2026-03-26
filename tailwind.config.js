/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ever: {
          cold: { 1: '#dce2eb', 2: '#95a3ae', 3: '#313e48' },
          warm: { 1: '#dcc5b7', 2: '#ac7e65', 3: '#402020' },
          green: '#293630',
        },
      },
      spacing: {
        'ever-s': 'var(--spacing-s)',
        'ever-l': 'var(--spacing-l)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")], // Add this line
};
