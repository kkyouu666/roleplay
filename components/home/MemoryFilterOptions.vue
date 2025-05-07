<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <!-- Top row with dropdowns and filter toggle -->
    <!-- Mobile Layout -->
    <div class="sm:hidden">
      <div class="flex items-center gap-2">
        <!-- Ranking dropdown -->
        <div class="relative flex-1">
          <select v-model="selectedRanking" @change="$emit('set-ranking', selectedRanking)"
            class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full">
            <option value="default">{{ $t('roleplay.filters.ranking.default') }}</option>
            <option value="rating">{{ $t('roleplay.filters.ranking.rating') }}</option>
            <option value="chats">{{ $t('roleplay.filters.ranking.chats') }}</option>
            <option value="newest">{{ $t('roleplay.filters.ranking.newest') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <!-- Gender dropdown -->
        <div class="relative flex-1">
          <select v-model="selectedGender" @change="$emit('set-gender', selectedGender)"
            class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full">
            <option value="all">{{ $t('roleplay.filters.gender.all') }}</option>
            <option value="female">{{ $t('roleplay.filters.gender.female') }}</option>
            <option value="male">{{ $t('roleplay.filters.gender.male') }}</option>
            <option value="other">{{ $t('roleplay.filters.gender.other') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <!-- Toggle More Filters Button -->
        <button @click="showMobileFilters = !showMobileFilters"
          class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-600"
          :class="showMobileFilters ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700' : ''">
          <Icon name="heroicons:adjustments-horizontal" class="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <!-- Mobile Expandable Filters -->
      <div v-show="showMobileFilters" class="space-y-4 transition-all duration-300 mt-4">
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
    </div>

    <!-- Desktop Layout -->
    <div class="hidden sm:block">
      <div class="flex flex-row items-center gap-4">
        <!-- Ranking dropdown -->
        <div class="relative">
          <select v-model="selectedRanking" @change="$emit('set-ranking', selectedRanking)"
            class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="default">{{ $t('roleplay.filters.ranking.default') }}</option>
            <option value="rating">{{ $t('roleplay.filters.ranking.rating') }}</option>
            <option value="chats">{{ $t('roleplay.filters.ranking.chats') }}</option>
            <option value="newest">{{ $t('roleplay.filters.ranking.newest') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <!-- Gender dropdown -->
        <div class="relative">
          <select v-model="selectedGender" @change="$emit('set-gender', selectedGender)"
            class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">{{ $t('roleplay.filters.gender.all') }}</option>
            <option value="female">{{ $t('roleplay.filters.gender.female') }}</option>
            <option value="male">{{ $t('roleplay.filters.gender.male') }}</option>
            <option value="other">{{ $t('roleplay.filters.gender.other') }}</option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
          </div>
        </div>

        <!-- Filter toggle -->
        <div class="flex items-center ml-auto">
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
  initialRanking?: string;
  initialGender?: string;
  initialShowFiltered?: boolean;
}>();

// Define emits
const emit = defineEmits<{
  (e: 'set-ranking', ranking: string): void;
  (e: 'set-gender', gender: string): void;
  (e: 'toggle-filtered', showFiltered: boolean): void;
}>();

// Local state
const selectedRanking = ref(props.initialRanking || 'default');
const selectedGender = ref(props.initialGender || 'all');
const showFiltered = ref(props.initialShowFiltered ?? true);
const showMobileFilters = ref(false);

// Toggle filtered view
function toggleFiltered() {
  showFiltered.value = !showFiltered.value;
  emit('toggle-filtered', showFiltered.value);
}
</script>

<style scoped>
/* Hide scrollbars but keep functionality */
.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari and Opera */
}
</style>