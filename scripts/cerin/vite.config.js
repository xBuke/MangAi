import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/* fx.js za ogledno/cerin (statična stranica). Build ide u /ogledno/cerin/js/fx/. */
export default defineConfig({
  base: './',
  publicDir: false,
  worker: { format: 'es' },
  build: {
    outDir: resolve(__dirname, '../../ogledno/cerin/js/fx'),
    emptyOutDir: true,
    target: 'es2020',
    assetsDir: '',
    rollupOptions: {
      input: { fx: resolve(__dirname, 'src/fx.js') },
      preserveEntrySignatures: 'allow-extension',
      output: { entryFileNames: '[name].js', chunkFileNames: '[name]-[hash].js', assetFileNames: '[name]-[hash][extname]' }
    }
  }
});
