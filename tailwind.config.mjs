/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // "Dark Tech Sleek" palette — see CLAUDE.md for rationale.
        ink: {
          950: '#0D0F12', // base background
          900: '#13161B', // panel background
          800: '#1B1F26', // raised panel / card
          700: '#2A2F38', // borders
        },
        paper: {
          100: '#E8E8E6', // primary text
          400: '#9AA0A6', // secondary text
        },
        accent: {
          teal: '#5EEAD4',
          indigo: '#818CF8',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        'grid-glow':
          'radial-gradient(circle at 20% 20%, rgba(94,234,212,0.08), transparent 40%), radial-gradient(circle at 80% 0%, rgba(129,140,248,0.08), transparent 40%)',
      },
    },
  },
  plugins: [],
};
