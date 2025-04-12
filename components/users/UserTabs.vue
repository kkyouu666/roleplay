<template>
  <div class="flex border-b border-gray-200 dark:border-gray-700">
    <button 
      v-for="tab in tabs" 
      :key="tab.id"
      @click="$emit('update:activeTab', tab.id)"
      class="px-4 py-3 text-sm font-medium flex-1 sm:flex-initial text-center"
      :class="activeTab === tab.id ? 
        'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 
        'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'"
    >
      {{ $t(tab.label) }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  activeTab: string;
  tabs: Array<{
    id: string;
    label: string;
  }>;
}>();

defineEmits<{
  (e: 'update:activeTab', tab: string): void;
}>();
</script>