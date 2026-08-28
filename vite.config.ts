import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'site.webmanifest',
      includeAssets: ['brand/rentoura-official-icon-v3.png', 'brand/rentoura-official-icon-v3-16.png', 'brand/rentoura-official-icon-v3-32.png', 'brand/rentoura-official-icon-v3-48.png', 'brand/rentoura-official-icon-v3-180.png', 'brand/rentoura-official-icon-v3-192.png', 'brand/rentoura-official-icon-v3-512.png', 'brand/rentoura-official-icon-v3-maskable-192.png', 'brand/rentoura-official-icon-v3-maskable-512.png'],
      manifest: {
        name: 'RENTOURA.LK', short_name: 'RENTOURA', description: 'Rentals, jobs and services marketplace in Sri Lanka.',
        start_url: '/', scope: '/', display: 'standalone', background_color: '#041C43', theme_color: '#1464F4',
        icons: [
          { src: '/brand/rentoura-official-icon-v3-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/brand/rentoura-official-icon-v3-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/brand/rentoura-official-icon-v3-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: '/brand/rentoura-official-icon-v3-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          { urlPattern: ({ url }) => url.origin === self.location.origin && /\.(?:png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname), handler: 'StaleWhileRevalidate', options: { cacheName: 'rentoura-static-images', expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 } } },
          { urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\//, handler: 'StaleWhileRevalidate', options: { cacheName: 'rentoura-fonts', expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 } } }
        ]
      }
    })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
