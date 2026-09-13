/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // "Comic Paper" palette — warm off-white paper + near-black ink,
        // with three accent colors used sparingly as "splashes" (badges,
        // underlines, halftone dots) — never as large fills. See CLAUDE.md.
        paper: {
          50: '#FFFDF8', // page background
          100: '#FFF8EA', // panel background
          200: '#F4E9D0', // panel border tint / pressed states
        },
        ink: {
          900: '#161311', // primary text, borders
          700: '#4A4038', // secondary text
          400: '#8A7F72', // tertiary / meta text
        },
        splash: {
          red: '#F0483E', // primary accent — CTAs, key badges
          blue: '#3A86C8', // secondary accent — links, tags
          yellow: '#F6BE3B', // tertiary accent — highlights, stars
        },
      },
      fontFamily: {
        display: ['"Permanent Marker"', 'cursive'], // big comic headings
        hand: ['"Caveat"', 'cursive'], // handwritten accents/labels
        body: ['"Inter"', 'sans-serif'], // readable body copy
        mono: ['"Space Mono"', 'monospace'], // dates, meta, tags
      },
      boxShadow: {
        comic: '5px 5px 0 0 #161311',
        'comic-sm': '3px 3px 0 0 #161311',
        'comic-lg': '8px 8px 0 0 #161311',
        'comic-red': '5px 5px 0 0 #F0483E',
      },
      keyframes: {
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(16px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'draw-underline': {
          from: { strokeDashoffset: '400' },
          to: { strokeDashoffset: '0' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.8)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg) translateY(-2px)' },
          '25%': { transform: 'rotate(-8deg) translateY(-2px)' },
          '75%': { transform: 'rotate(8deg) translateY(-2px)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
        wiggle: 'wiggle 4s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
        sway: 'sway 3.5s ease-in-out infinite',
        twinkle: 'twinkle 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
