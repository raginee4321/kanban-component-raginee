import react from '@vitejs/plugin-react';

export default {
  plugins: [
    react({
      jsxImportSource: '@emotion/react', // For Emotion automatic JSX runtime
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ]
};
