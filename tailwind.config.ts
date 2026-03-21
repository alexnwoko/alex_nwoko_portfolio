import type { Config } from 'tailwindcss'
import path from 'path'

const dir = path.resolve(__dirname)

const config: Config = {
  content: [
    path.join(dir, 'src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(dir, 'src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(dir, 'src/app/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#FFFEFB',
          100: '#FDFBF8',
          200: '#F5F1EB',
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
