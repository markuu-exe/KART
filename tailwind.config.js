/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          orange: '#ff5c1a',
          'orange-bg': '#fff3ee',
          'orange-light': '#ff8a5c',
        },
        surface: {
          white: '#ffffff',
          default: '#fafaf8',
        },
        border: {
          rule: '#e8e4e0',
        },
        ink: {
          default: '#12100e',
          mid: '#4a4540',
          light: '#8c8480',
        },
        status: {
          blue: '#1a6eff',
          'blue-bg': '#eef3ff',
          green: '#00c27c',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'Inter Variable', 'sans-serif'],
        heading: ['Syne', 'Inter Variable', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      fontSize: {
        'caption': ['12px', { lineHeight: '1.5' }],
        'heading-1': ['24px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'heading-2': ['18px', { lineHeight: '1.4' }],
        'body': ['15px', { lineHeight: '1.65' }],
        'mono': ['13px', { lineHeight: '1.5' }],
        'mono-sm': ['11px', { lineHeight: '1.5' }],
        'label': ['13px', { lineHeight: '1.5' }],
      },
      boxShadow: {
        'sm': '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}