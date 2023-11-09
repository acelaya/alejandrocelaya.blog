import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,md,mdx,ts,tsx}'],
  theme: {
    screens: {
      'sm': '480px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
    },

    extend: {
      colors: {
        main: '#494e57',
        code: '#c7254e',
        primary: {
          dark: '#61931a',
          DEFAULT: '#8dc63f',
        },
        grey: {
          darker: '#24272d',
          dark: '#2a2d36',
          DEFAULT: '#484c50',
          light: '#6a7885'
        },
      },
      fontSize: {
        xs: '14px',
        sm: '16px',
        base: '18px',
        md: '24px',
        lg: '30px',
        xl: '70px',
      },
      backgroundImage: {
        hero: "url('/assets/img/hero_bg.jpg')",
      },
      transitionProperty: {
        appear: 'width, opacity',
      },
    },
  },
  plugins: [],
} satisfies Config;
