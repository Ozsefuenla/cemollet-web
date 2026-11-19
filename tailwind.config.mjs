/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      // Brand tokens. Burgundy sampled from public/logo.jpg. See docs/design-system.md.
      colors: {
        brand: {
          DEFAULT: '#802828',
          50: '#fdf2f2',
          600: '#9a3232',
          700: '#802828',
          800: '#5f1e1e',
        },
        accent: {
          yellow: '#facc15',
          coral: '#fb7185',
          green: '#4ade80',
          sky: '#38bdf8',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'Fredoka', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        blob: '2.5rem',
      },
    },
  },
  plugins: [],
};
