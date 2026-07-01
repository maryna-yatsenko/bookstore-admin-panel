import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, '../DS/src/components'),
      '@tokens':     resolve(__dirname, '../DS/src/tokens'),
      '@styles':     resolve(__dirname, '../DS/src/styles'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});
