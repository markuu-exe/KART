/**
 * Typography/Font tokens for the KART application
 * Font families and their intended uses
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
    family: 'Inter',
    fallback: 'sans-serif',
  },
};

export default fonts;
