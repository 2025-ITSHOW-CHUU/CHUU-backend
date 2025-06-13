export const env = {
  PORT: parseInt(process.env.PORT || '443'),
  GEMINI: {
    KEY:
      process.env.GEMINI_API_KEY ??
      (() => {
        throw new Error('GEMINI_API_KEY is not set');
      })(),
    PRO_MODEL: process.env.GEMINI_PRO_MODEL || 'gemini-2.0-flash',
  },
};
