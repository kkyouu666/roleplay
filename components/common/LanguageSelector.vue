<template>
  <div class="relative" ref="languageSelectorRef">
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center space-x-2 px-2 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
    >
      <Icon name="heroicons:language" class="h-5 w-5 text-gray-600 dark:text-gray-400" />
      <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">{{ getCurrentLocaleName }}</span>
      <Icon 
        name="heroicons:chevron-down" 
        class="w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>
    
    <div 
      v-if="isOpen"
      class="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 z-50 py-1"
    >
      <div role="menu">
        <button
          v-for="locale in availableLocales"
          :key="locale.code"
          @click="switchLanguage(locale.code)"
          class="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
          :class="locale.code === currentLocaleCode ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900 font-medium' : 'text-gray-700 dark:text-gray-300'"
        >
          <span class="flex-1">{{ locale.name }}</span>
          <Icon 
            v-if="locale.code === currentLocaleCode"
            name="heroicons:check" 
            class="w-4 h-4 text-indigo-600 dark:text-indigo-400"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { useLanguageStore } from '~/stores/language';

const languageStore = useLanguageStore();
const { $i18n } = useNuxtApp();
const isOpen = ref(false);
const languageSelectorRef = ref(null);

// Access locale using Nuxt's i18n runtime config
const currentLocaleCode = computed(() => {
  return languageStore.currentLocale;
});

const availableLocales = computed(() => [
  { code: 'ja', name: '日本語' },
  { code: 'zh', name: '简体中文' },
  { code: 'en', name: 'English' },
]);

const getCurrentLocaleName = computed(() => {
  const locale = availableLocales.value.find(l => l.code === currentLocaleCode.value);
  return locale?.name || '日本語';
});

function switchLanguage(localeCode) {
  if (localeCode === currentLocaleCode.value) {
    isOpen.value = false;
    return;
  }
  
  // Set the language in our store (which will also update i18n)
  languageStore.setLanguage(localeCode);
  
  // Close the dropdown
  isOpen.value = false;
}

// Initialize language on component mount
onMounted(() => {
  // Initialize on client-side only
  if (process.client) {
    // Initialize our language store
    languageStore.initLanguage();
    
    // Set up click outside handling
    onClickOutside(languageSelectorRef, () => {
      isOpen.value = false;
    });
  }
});
</script>