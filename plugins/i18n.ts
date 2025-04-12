import { useLanguageStore } from '~/stores/language';

export default defineNuxtPlugin({
  name: 'i18n-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    // Initialize language on page change
    nuxtApp.hook('page:finish', () => {
      if (process.client) {
        // Ensure the language store and i18n are synced after page navigation
        const { $pinia } = nuxtApp;
        if ($pinia) {
          const languageStore = useLanguageStore();
          const { $i18n } = nuxtApp;

          if ($i18n && languageStore.initialized) {
            // Ensure i18n locale matches our store after page navigation
            if ($i18n.locale.value !== languageStore.currentLocale) {
              $i18n.locale.value = languageStore.currentLocale;
            }
          }
        }
      }
    });
  }
});