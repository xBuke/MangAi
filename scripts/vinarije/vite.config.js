import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/* Demo stranica vinarije Điko: build ide izravno u /ogledno/diko/ u rootu repoa (statični Vercel deploy).
 * Vina Govorko je preseljena u zaseban repo xBuke/govorko (vinagovorko.hr). */
const site = process.env.SITE || 'diko';
const root = resolve(__dirname, 'sites', site);

export default defineConfig({
  root,
  base: './',
  publicDir: resolve(root, 'public'),
  plugins: [react()],
  worker: { format: 'es' }, /* MapLibre worker je ES modul */
  resolve: { alias: { '@shared': resolve(__dirname, 'shared') } },
  build: {
    outDir: resolve(__dirname, '../../ogledno', site),
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: { input: { index: resolve(root, 'index.html') } }
  }
});
