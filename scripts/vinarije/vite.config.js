import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/* Jedan izvor, dvije stranice: SITE=govorko | diko
 * Build ide izravno u /ogledno/<site>/ u rootu repoa (statični Vercel deploy). */
const site = process.env.SITE || 'govorko';
const root = resolve(__dirname, 'sites', site);

export default defineConfig({
  root,
  base: './',
  publicDir: resolve(root, 'public'),
  plugins: [react()],
  resolve: { alias: { '@shared': resolve(__dirname, 'shared') } },
  build: {
    outDir: resolve(__dirname, '../../ogledno', site),
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: { index: resolve(root, 'index.html'), checkout: resolve(root, 'checkout.html') }
    }
  }
});
