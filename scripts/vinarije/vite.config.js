import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

/* Jedan izvor, dvije stranice: SITE=govorko | diko
 * Build ide izravno u /ogledno/<site>/ u rootu repoa (statični Vercel deploy).
 * Govorko je višestranični: klijentski build + SSR build (--ssr entry-server.jsx) + prerender.mjs,
 * zato koristi apsolutni base. */
const site = process.env.SITE || 'govorko';
const root = resolve(__dirname, 'sites', site);
const multiPage = site === 'govorko';

export default defineConfig(({ isSsrBuild }) => ({
  root,
  base: multiPage ? '/ogledno/govorko/' : './',
  publicDir: resolve(root, 'public'),
  plugins: [react()],
  worker: { format: 'es' }, /* MapLibre worker je ES modul */
  resolve: { alias: { '@shared': resolve(__dirname, 'shared') } },
  ssr: { noExternal: true },
  build: isSsrBuild
    ? { outDir: resolve(root, '.ssr'), emptyOutDir: true, copyPublicDir: false }
    : {
        outDir: resolve(__dirname, '../../ogledno', site),
        emptyOutDir: true,
        assetsDir: 'assets',
        rollupOptions: { input: { index: resolve(root, 'index.html') } }
      }
}));
