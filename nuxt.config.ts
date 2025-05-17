export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt', '@nuxtjs/tailwindcss'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Hidden Timer App',
      short_name: 'TimerApp',
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
          purpose: 'any maskable'
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        },
      ],
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: '.*',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'offlineCache',
          },
        },
      ],
    },
  },
})
