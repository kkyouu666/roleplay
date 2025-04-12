import { defineStore } from 'pinia';

type LocaleCode = 'ja' | 'en' | 'zh';

export const useLanguageStore = defineStore('language', {
  state: () => ({
    currentLocale: 'ja' as LocaleCode,
    initialized: false
  }),
  
  actions: {
    // Set the language and save to storage
    setLanguage(locale: LocaleCode) {
      this.currentLocale = locale;
      
      // Save to localStorage for persistent storage
      if (process.client) {
        localStorage.setItem('user_locale', locale);
      }
      
      // Apply to i18n if we're on the client
      if (process.client) {
        const { $i18n } = useNuxtApp();
        if ($i18n) {
          $i18n.locale.value = locale;
        }
      }
    },
    
    // Initialize language from storage or browser
    initLanguage() {
      if (this.initialized || !process.client) return;
      
      // Try to get from local storage first
      const savedLocale = localStorage.getItem('user_locale') as LocaleCode | null;
      
      // If we have a saved locale, use it
      if (savedLocale && ['ja', 'en', 'zh'].includes(savedLocale)) {
        this.currentLocale = savedLocale;
      } else {
        // Otherwise try to detect from browser
        const browserLocales = navigator.languages || [navigator.language];
        
        // Check if browser language matches any of our supported locales
        for (const browserLocale of browserLocales) {
          const shortLocale = browserLocale.split('-')[0];
          if (shortLocale === 'zh') {
            this.currentLocale = 'zh';
            break;
          } else if (shortLocale === 'en') {
            this.currentLocale = 'en';
            break;
          } else if (shortLocale === 'ja') {
            this.currentLocale = 'ja';
            break;
          }
        }
      }
      
      // Apply the selected locale to i18n
      const { $i18n } = useNuxtApp();
      if ($i18n) {
        $i18n.locale.value = this.currentLocale;
      }
      
      // Mark as initialized
      this.initialized = true;
    }
  }
});