import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/**'],
      manifest: {
        name: 'ColorVision – Farberkennung',
        short_name: 'ColorVision',
        description: 'Farben in Bildern erkennen und vorlesen lassen – für Menschen mit Farbenfehlsichtigkeit',
        start_url: '/',
        display: 'standalone',
        background_color: '#f4f5f8',
        theme_color: '#6d4aff',
        lang: 'de',
        scope: '/',
        orientation: 'any',
        icons: [
          { src: '/icons/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-167.png', sizes: '167x167', type: 'image/png' },
          { src: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'gstatic-fonts-cache', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } },
          },
        ],
      },
      // Disable service worker minification to avoid Node 18 crypto issue
      // The CI/CD uses Node 20 where this works correctly
      devOptions: {
        enabled: false,
      },
    }),
  ],
  build: {
    rollupOptions: {
      // Avoid terser (uses crypto) on Node 18 - use esbuild minification instead
      output: {},
    },
  },
})
