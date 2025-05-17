export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt', '@nuxtjs/tailwindcss'],
  app: {
    head: {
      meta: [
        { name: 'theme-color', content: '#C3A8F1' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
      ],
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Hidden Timer App',
      short_name: 'TimerApp',
      description: 'A hidden timer with notifications',
      lang: 'ru',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#C3A8F1',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    devOptions: {
      enabled: true,
      type: 'module',
    },
    workbox: {
      cacheId: 'hidden-timer-v6', // Обновляем кэш
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      importScripts: ['/sw.js'],
      runtimeCaching: [
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 30 * 24 * 60 * 60,
            },
          },
        },
        {
          urlPattern: /^https?.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
            networkTimeoutSeconds: 5,
          },
        },
      ],
    },
  },
});