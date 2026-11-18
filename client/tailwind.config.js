/* tailwind.config.js — restrained palette sampled from the supplied tyre-site screenshot. */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'Arial', 'sans-serif'] },
      colors: {
        ink: '#111713',
        forest: '#102c1d',
        moss: '#4a6747',
        canvas: '#e7e9eb',
        mist: '#f1f2f0',
        line: '#e8ebe7',
      },
      keyframes: {
        rise: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        drift: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { rise: 'rise .7s ease both', drift: 'drift var(--duration, 35s) linear infinite' },
    },
  },
  plugins: [],
};
