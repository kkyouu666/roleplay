<template>
  <CommonLoadingMask :show="isLoading" />
  <div class="flex flex-col">
    <CommonScrollToTop :scroll-threshold="400" />
    <NuxtLoadingIndicator color="#8b5cf6" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useThemeStore } from '~/stores/theme';
import { useLanguageStore } from '~/stores/language';

const isLoading = ref(true);

// Initialize auth and language when app is mounted (only on client-side)
onMounted(async () => {
  const { $initAuth } = useNuxtApp();
  if ($initAuth) {
    await $initAuth();
  }

  // Initialize theme
  const themeStore = useThemeStore();
  themeStore.initTheme();

  // Initialize language
  if (process.client) {
    const languageStore = useLanguageStore();
    languageStore.initLanguage();
  }

  // Watch for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (themeStore.theme === 'system') {
        themeStore.applyTheme();
      }
    });
  }

  // Hide loading mask after initialization
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>