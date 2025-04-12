// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    'nuxt-icon',
    '@nuxt/image'
  ],

  css: ['~/assets/css/main.css'],

  i18n: {
    langDir: 'locales',
    defaultLocale: 'ja',
    locales: [
      { code: 'zh', file: 'zh.json', name: '简体中文' },
      { code: 'en', file: 'en.json', name: 'English' },
      { code: 'ja', file: 'ja.json', name: '日本語' }
    ],
    strategy: 'no_prefix',
    detectBrowserLanguage: false, // Disable auto-detection, we'll handle it manually
    skipSettingLocaleOnNavigate: true // Prevent auto-setting on navigation
  },

  app: {
    head: {
      title: 'RolePlay Community',
      meta: [
        { name: 'description', content: 'A multi-language role-playing community platform' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  // For production readiness
  nitro: {
    compressPublicAssets: true
  },

  routeRules: {
    // Add prerender for SEO critical pages
    '/': { prerender: true },
    '/pricing': { prerender: true },
  }
})