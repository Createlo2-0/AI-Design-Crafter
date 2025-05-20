// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#0a0a1a',
        'cyber-bg-darker': '#050510',
        'cyber-primary': '#21213b',
        'cyber-border': '#4f4f7f',
        'neon-pink': '#ff00ff',
        'neon-blue': '#00ffff',
        'neon-green': '#39ff14',
        'neon-yellow': '#ffff00',
        'accent-purple': '#9400d3',
      },
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        cyber: ['Orbitron', 'sans-serif'],
      },
      backgroundImage: theme => ({
        'cyber-backdrop': "url('/cyberpunk-backdrop.jpg')",
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%234f4f7f' stroke-opacity='0.1' stroke-width='1'%3E%3Cpath d='M0 .5H31.5V32'/%3E%3C/svg%3E\")",
        'circuit-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%234f4f7f' fill-opacity='0.06'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }),
      keyframes: {
        glow: { /* ... */ },
        subtlePulse: { /* ... */ },
        glitch: { // Glitch Keyframes
            '0%, 100%': { transform: 'translate(0)', opacity: 1 },
            '20%, 60%': { transform: 'translate(1px, -1px)', opacity: 0.95 },
            '22%, 62%': { transform: 'translate(-1px, 1px)', opacity: 0.85, textShadow: '1px 1px 0px theme(colors.neon-pink / 0.5)' },
            '25%, 65%': { transform: 'translate(1px, 1px)', opacity: 0.9, textShadow: '-1px -1px 0px theme(colors.neon-blue / 0.5)' },
            '28%, 68%': { transform: 'translate(0)', opacity: 1, textShadow: 'none' },
        }
      },
      animation: {
        'neon-glow': 'glow 2.5s ease-in-out infinite',
        'subtle-pulse': 'subtlePulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glitch-hover': 'glitch 0.5s steps(3, jump-none) infinite alternate', // Glitch Animation Utility
      },
      boxShadow: {
        'neon-sm-blue': '0 0 5px theme(colors.neon-blue), 0 0 10px theme(colors.neon-blue / 0.5)',
        'neon-md-pink': '0 0 8px theme(colors.neon-pink), 0 0 15px theme(colors.neon-pink / 0.6)',
        'neon-lg-green': '0 0 15px theme(colors.neon-green), 0 0 30px theme(colors.neon-green / 0.5)',
      }
    },
  },
  plugins: [],
}