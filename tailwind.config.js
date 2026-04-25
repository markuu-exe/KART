import { colors } from './src/constants/colors.js';
import { fonts, typography } from './src/constants/fonts.js';
import { spacing } from './src/constants/spacing.js';

const camelToKebab = (value) => value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const mapTokenKeysToTailwind = (tokenGroup) => (
  Object.fromEntries(
    Object.entries(tokenGroup).map(([key, value]) => [camelToKebab(key), value]),
  )
);

const tailwindFontSizes = Object.fromEntries(
  Object.entries(typography.textStyles).map(([styleName, style]) => {
    const config = { lineHeight: style.lineHeight };

    if (style.letterSpacing) {
      config.letterSpacing = style.letterSpacing;
    }

    return [camelToKebab(styleName), [style.size, config]];
  }),
);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: mapTokenKeysToTailwind(colors.primary),
        surface: mapTokenKeysToTailwind(colors.surface),
        border: mapTokenKeysToTailwind(colors.border),
        ink: mapTokenKeysToTailwind(colors.ink),
        status: mapTokenKeysToTailwind(colors.status),
      },
      fontFamily: {
        sans: [fonts.content.primary.family, fonts.general.family, fonts.content.primary.fallback],
        heading: [fonts.display.family, fonts.general.family, fonts.display.fallback],
        mono: [fonts.content.mono.family, fonts.content.mono.fallback],
      },
      fontSize: tailwindFontSizes,
      spacing,
      boxShadow: {
        'sm': '0px 1px 3px 0px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}