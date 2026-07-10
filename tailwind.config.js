/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'Arial', 'sans-serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        brutal: '6px 6px 0 #000',
        'brutal-sm': '4px 4px 0 #000',
        'brutal-lg': '10px 10px 0 #000',
      },
      colors: {
        ink: '#050505',
        paper: '#fffaf0',
        electric: '#2f6bff',
        punch: '#ff3ea5',
        acid: '#c8ff2e',
        sun: '#ffd62e',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.35) rotate(-6deg)', opacity: '0' },
          '55%': { transform: 'scale(1.18) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        snap: {
          '0%, 100%': { opacity: '0' },
          '35%': { opacity: '0.75' },
        },
      },
      animation: {
        pop: 'pop 360ms steps(3, end)',
        snap: 'snap 180ms linear',
      },
    },
  },
  plugins: [],
};
