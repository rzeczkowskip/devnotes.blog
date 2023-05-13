/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const typographyPlugin = require('@tailwindcss/typography');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
const textFillPlugin = require('tailwindcss-text-fill');

const textColor = colors.neutral[900];

const linkStyles = (theme) => ({
  color: theme('colors.lead.500'),
  textDecoration: 'underline',
  fontWeight: theme('fontWeight.medium'),
  '&:hover': {
    color: textColor,
  },
});

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        lead: {
          500: '#258',
          800: '#123',
        },
        text: textColor,
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: '74ch',
            'h1,h2,h3,h4,h5,h6': {
              marginTop: '1.5em',
              marginBottom: '1rem',
              fontWeight: 600,
            },
            color: textColor,
            a: linkStyles(theme),
            strong: {
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
    },
    fontFamily: {
      sans: ['var(--font-sans)'],
    },
  },
  plugins: [
    typographyPlugin,
    plugin(({ addBase, addUtilities, theme }) => {
      addBase({
        html: { color: textColor },
      });
      addUtilities({
        '.content-links': {
          a: linkStyles(theme),
        },
        '.container-lg': {
          maxWidth: theme('screens.lg'),
        },
      });
    }),
    textFillPlugin,
  ],
};
