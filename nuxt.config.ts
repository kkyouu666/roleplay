function getLocaleFiles(locale: string) {
  return [
    `${locale}-common.json`,
    `${locale}-navigation.json`,
    `${locale}-auth.json`,
    `${locale}-roleplay.json`,
    `${locale}-home.json`,
    `${locale}-create.json`,
    `${locale}-subscription.json`,
    `${locale}-settings.json`,
    `${locale}-notifications.json`,
    `${locale}-languages.json`,
    `${locale}-bonus.json`,
    `${locale}-users.json`,
    `${locale}-profile.json`,
    `${locale}-characters.json`
  ]
}

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
      {
        code: 'zh',
        files: getLocaleFiles('zh'),
        name: '简体中文'
      },
      {
        code: 'en',
        files: getLocaleFiles('en'),
        name: 'English'
      },
      {
        code: 'ja',
        files: getLocaleFiles('ja'),
        name: '日本語'
      }
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