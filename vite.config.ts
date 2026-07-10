import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/bookstore-admin-panel/' : '/',
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 5176,
    strictPort: false,
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'vendor/DS/src/components'),
      '@tokens':     resolve(__dirname, 'vendor/DS/src/tokens'),
      '@styles':     resolve(__dirname, 'vendor/DS/src/styles'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
