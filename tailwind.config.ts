import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FFFDF9',
          100: '#FAF6F1',
          200: '#F0EBE3',
          300: '#E5DDD2',
          400: '#D4C9BA',
        },
        coffee: {
          DEFAULT: '#3D2B1F',
          light: '#5C4033',
          muted: '#8B7355',
        },
        dusty: {
          orange: '#C4703F',
          'orange-light': '#D4864F',
          'orange-dark': '#A45E33',
        },
        darkred: {
          DEFAULT: '#8B3A2F',
          light: '#A44A3E',
          dark: '#6E2E25',
        },
        un: {
          blue: '#009EDB',
          'blue-light': '#33B1E2',
          'blue-dark': '#007EB0',
        },
        pillar: {
          data: '#009EDB',
          gis: '#7B4B94',
          climate: '#C4703F',
          cash: '#8B3A2F',
        },
      },
      fontFamily: {
        serif: ['DM Serif Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        reading: ['Source Serif 4', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
