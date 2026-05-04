/**
 * Typography/Font tokens for the KART application
 * Font families and typography scales.
 */

export const fonts = {
  // Display font - used for headings and prominent text
  display: {
    family: 'Syne',
    fallback: 'sans-serif',
  },

  // Content fonts - used for body text and general content
  content: {
    primary: {
      family: 'DM Sans',
      fallback: 'sans-serif',
    },
    mono: {
      family: 'DM Mono',
      fallback: 'monospace',
    },
  },

  // General purpose font
  general: {
    family: 'Inter Variable',
    fallback: 'sans-serif',
  },
};

export const typography = {
  // Primitive scales
  fontSize: {
    xs: '11px',
    sm: '12px',
    base: '13px',
    body: '15px',
    xl: '18px',
    h1: '24px',
  },
  lineHeight: {
    normal: '1.5',
    body: '1.65',
    heading1: '1.3',
    heading2: '1.4',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
  },

  // Semantic text styles used by utilities/components.
  textStyles: {
    caption: {
      size: '12px',
      lineHeight: '1.5',
    },
    heading1: {
      size: '24px',
      lineHeight: '1.3',
      letterSpacing: '-0.02em',
    },
    heading2: {
      size: '18px',
      lineHeight: '1.4',
    },
    body: {
      size: '15px',
      lineHeight: '1.65',
    },
    mono: {
      size: '13px',
      lineHeight: '1.5',
    },
    monoSm: {
      size: '11px',
      lineHeight: '1.5',
    },
    label: {
      size: '13px',
      lineHeight: '1.5',
    },
  },
};

export default fonts;
