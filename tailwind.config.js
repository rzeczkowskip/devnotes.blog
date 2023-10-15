/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const typographyPlugin = require('@tailwindcss/typography');
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const textFillPlugin = require('tailwindcss-text-fill');

const textColor = colors.slate[900];

const linkStyles = (theme, reverseColors = false) => {
  let linkColor = theme('colors.lead.500');
  let hoverColor = 'inherit';

  if (reverseColors) {
    [linkColor, hoverColor] = [hoverColor, linkColor];
  }

  return {
    color: linkColor,
    '&:hover': {
      color: hoverColor,
      textDecoration: 'underline',
    },
  };
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      ...defaultTheme.screens,
      sm: '680px',
    },
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        lead: {
          200: '#def',
          500: '#258',
          800: '#123',
        },
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            'h1,h2,h3,h4,h5,h6': {
              marginTop: '1.5em',
              marginBottom: '1rem',
              fontWeight: 600,
            },
            color: 'currentColor',
            a: linkStyles(theme),
            strong: {
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
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
        '.content-links-reverse': {
          a: linkStyles(theme, true),
        },
        '.container-lg': {
          maxWidth: theme('screens.lg'),
        },
        '.container-prose': {
          maxWidth: theme('maxWidth.prose'),
        },
        '.text-muted': {
          color: theme('colors.slate.500'),
        },
      });
    }),
    textFillPlugin,
  ],
};
