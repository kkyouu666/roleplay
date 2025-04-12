<template>
  <Transition
    enter-active-class="transition-opacity duration-300"
    leave-active-class="transition-opacity duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed inset-0 z-[100] bg-white dark:bg-gray-900 flex items-center justify-center">
      <div class="text-center">
        <div class="inline-block w-8 h-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>