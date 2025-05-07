<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <!-- Mobile Layout -->
    <div class="sm:hidden">
      <div class="flex items-center justify-between">
        <!-- Filter Options -->
        <div class="flex flex-wrap gap-2">
          <button v-for="option in filterOptions" :key="option.value" @click="$emit('set-filter', option.value)"
            class="px-3 py-1 rounded-full text-sm whitespace-nowrap"
            :class="selectedFilter === option.value
              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
            {{ option.label }}
          </button>
        </div>

        <!-- Toggle More Filters Button -->
        <button @click="showMobileFilters = !showMobileFilters"
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600"
          :class="showMobileFilters ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : ''">
          <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
    </div>

    <!-- Mobile Expandable Filters -->
    <div v-show="showMobileFilters" class="sm:hidden space-y-4 transition-all duration-300 mt-4">
      <!-- Filter toggle -->
      <div class="flex items-center justify-between">
        <span class="text-sm text-gray-600 dark:text-gray-400">{{ $t('roleplay.filters.showFiltered') }}</span>
        <button
          class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          :class="showFiltered ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'" @click="toggleFiltered">
          <span class="sr-only">{{ $t('roleplay.filters.toggle') }}</span>
          <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            :class="showFiltered ? 'translate-x-6' : 'translate-x-1'" />
        </button>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden sm:block">
      <div class="flex flex-row items-center justify-between gap-4">
        <!-- Filter Options -->
        <div class="flex gap-2">
          <button v-for="option in filterOptions" :key="option.value" @click="$emit('set-filter', option.value)"
            class="px-3 py-1 rounded-full text-sm whitespace-nowrap"
            :class="selectedFilter === option.value
              ? 'bg-indigo-600 text-white dark:bg-indigo-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'">
            {{ option.label }}
          </button>
        </div>

        <!-- Filter toggle -->
        <div class="flex items-center">
          <span class="text-sm text-gray-600 dark:text-gray-400 mr-2">{{ $t('roleplay.filters.showFiltered') }}</span>
          <button
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            :class="showFiltered ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'" @click="toggleFiltered">
            <span class="sr-only">{{ $t('roleplay.filters.toggle') }}</span>
            <span class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
              :class="showFiltered ? 'translate-x-6' : 'translate-x-1'" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Define props
const props = defineProps<{
  selectedFilter: string;
  initialShowFiltered?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'set-filter', filter: string): void;
  (e: 'toggle-filtered', showFiltered: boolean): void;
}>();

// Local state
const showMobileFilters = ref(false);
// Use computed to keep in sync with props
const selectedFilter = computed(() => props.selectedFilter);
const showFiltered = ref(props.initialShowFiltered ?? true);

// Filter options
const filterOptions = [
  { value: 'popular', label: '流行趋势' },
  { value: 'rising', label: '顶尖新锐' },
  { value: 'editors', label: '编辑推荐' }
];

// Toggle filtered view
function toggleFiltered() {
  showFiltered.value = !showFiltered.value;
  emit('toggle-filtered', showFiltered.value);
}
</script>