<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="close"></div>

      <!-- Modal panel -->
      <div class="inline-block w-full max-w-3xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
            @click="close"
          >
            <span class="sr-only">关闭</span>
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <!-- Modal header -->
        <div class="sm:flex sm:items-start">
          <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
            <Icon name="heroicons:clock" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">
              {{ $t('bonus.pointsHistoryTitle') }}
            </h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ $t('bonus.pointsHistoryDesc') }}
            </p>
          </div>
        </div>

        <!-- Filter options -->
        <div class="flex flex-wrap items-center mt-4 space-x-2 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div class="flex items-center mr-4">
            <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('bonus.type') }}:</span>
            <select 
              v-model="filter" 
              class="py-1 pl-2 pr-8 text-sm border border-gray-300 rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">{{ $t('bonus.all') }}</option>
              <option value="earn">{{ $t('bonus.earn') }}</option>
              <option value="spend">{{ $t('bonus.spend') }}</option>
            </select>
          </div>
          
          <div>
            <span class="mr-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('bonus.sort') }}:</span>
            <select 
              v-model="sortOrder" 
              class="py-1 pl-2 pr-8 text-sm border border-gray-300 rounded-md dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">{{ $t('bonus.newestFirst') }}</option>
              <option value="oldest">{{ $t('bonus.oldestFirst') }}</option>
              <option value="amount-high">{{ $t('bonus.highestFirst') }}</option>
              <option value="amount-low">{{ $t('bonus.lowestFirst') }}</option>
            </select>
          </div>
        </div>

        <!-- History items list -->
        <div class="mt-4 mb-4 max-h-[28rem] overflow-y-auto custom-scrollbar">
          <div v-if="pointsStore.isLoading" class="flex items-center justify-center py-12">
            <div class="inline-block w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <span class="ml-3 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</span>
          </div>
          
          <div v-else-if="filteredHistory.length === 0" class="text-center py-12">
            <Icon name="heroicons:clock" class="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p class="text-gray-600 dark:text-gray-400">{{ $t('bonus.noHistory') }}</p>
          </div>
          
          <div v-else>
            <div class="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-2 grid grid-cols-3 text-sm font-medium text-gray-500 dark:text-gray-400">
              <div class="pl-4">{{ $t('bonus.operation') }}</div>
              <div class="text-center">{{ $t('bonus.time') }}</div>
              <div class="text-right pr-4">{{ $t('bonus.points') }}</div>
            </div>
            
            <div class="divide-y divide-gray-200 dark:divide-gray-700">
              <div 
                v-for="item in paginatedHistory" 
                :key="item.id" 
                class="py-4 grid grid-cols-3 items-center hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div class="pl-4">
                  <p class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ item.description }}</p>
                </div>
                
                <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
                  {{ formatTime(item.timestamp) }}
                </div>
                
                <div 
                  class="pr-4 text-right font-medium"
                  :class="item.type === 'earn' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ item.type === 'earn' ? '+' : '-' }}{{ item.amount }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex justify-between flex-1 sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              :class="[
                currentPage === 1 ? 'cursor-not-allowed text-gray-400 dark:text-gray-600' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300',
                'relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
              ]"
            >
              {{ $t('bonus.prevPage') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage >= totalPages"
              :class="[
                currentPage >= totalPages ? 'cursor-not-allowed text-gray-400 dark:text-gray-600' : 'text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300',
                'ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600'
              ]"
            >
              {{ $t('bonus.nextPage') }}
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700 dark:text-gray-300">
                {{ $t('bonus.showing') }} <span class="font-medium">{{ startItem }}</span> {{ $t('bonus.to') }} <span class="font-medium">{{ endItem }}</span> {{ $t('bonus.of') }} <span class="font-medium">{{ filteredHistory.length }}</span> {{ $t('bonus.items') }}
              </p>
            </div>
            <div>
              <nav class="inline-flex -space-x-px rounded-md shadow-sm isolate" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-l-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:z-20 focus:outline-offset-0"
                  :class="currentPage === 1 ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span class="sr-only">{{ $t('bonus.prevPage') }}</span>
                  <Icon name="heroicons:chevron-left" class="w-5 h-5" />
                </button>
                
                <button
                  v-for="page in displayedPages"
                  :key="page"
                  @click="goToPage(page)"
                  :class="[
                    page === currentPage
                      ? 'relative z-10 inline-flex items-center bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'relative inline-flex items-center text-gray-900 dark:text-gray-100 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 focus:z-20 focus:outline-offset-0',
                    'px-4 py-2 text-sm font-semibold'
                  ]"
                >
                  {{ page }}
                </button>
                
                <button
                  @click="nextPage"
                  :disabled="currentPage >= totalPages"
                  class="relative inline-flex items-center px-2 py-2 text-gray-400 rounded-r-md ring-1 ring-inset ring-gray-300 dark:ring-gray-600 focus:z-20 focus:outline-offset-0"
                  :class="currentPage >= totalPages ? 'cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-700'"
                >
                  <span class="sr-only">{{ $t('bonus.nextPage') }}</span>
                  <Icon name="heroicons:chevron-right" class="w-5 h-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { format, isToday, isYesterday } from 'date-fns';
import { usePointsStore } from '~/stores/points';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);
const { t } = useI18n();

const pointsStore = usePointsStore();
const isLoading = ref(false);
const filter = ref('all');
const sortOrder = ref('newest');
const itemsPerPage = 10;
const currentPage = ref(1);

// Load more history when modal is opened
watch(() => props.isOpen, async (newVal) => {
  if (newVal && pointsStore.history.length <= 5) {
    isLoading.value = true;
    await pointsStore.fetchMoreHistory();
    isLoading.value = false;
  }
});

// Filter history based on selected filters
const filteredHistory = computed(() => {
  let result = [...pointsStore.history];
  
  // Apply type filter
  if (filter.value !== 'all') {
    result = result.filter(item => item.type === filter.value);
  }
  
  // Apply sorting
  switch (sortOrder.value) {
    case 'newest':
      result = result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      break;
    case 'oldest':
      result = result.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      break;
    case 'amount-high':
      result = result.sort((a, b) => b.amount - a.amount);
      break;
    case 'amount-low':
      result = result.sort((a, b) => a.amount - b.amount);
      break;
  }
  
  return result;
});

// Calculate total pages
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredHistory.value.length / itemsPerPage));
});

// Reset to first page when filters change
watch([filter, sortOrder], () => {
  currentPage.value = 1;
});

// Get paginated history items
const paginatedHistory = computed(() => {
  const startIdx = (currentPage.value - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  return filteredHistory.value.slice(startIdx, endIdx);
});

// Pagination display logic
const displayedPages = computed(() => {
  const range = [];
  const maxPagesToShow = 5;
  
  if (totalPages.value <= maxPagesToShow) {
    // Show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i);
    }
  } else {
    // Always show first page
    range.push(1);
    
    // Determine start and end of page range
    let rangeStart = Math.max(2, currentPage.value - 1);
    let rangeEnd = Math.min(totalPages.value - 1, currentPage.value + 1);
    
    // Adjust to show up to 3 pages
    while (rangeEnd - rangeStart < 2 && rangeEnd < totalPages.value - 1) {
      rangeEnd++;
    }
    while (rangeEnd - rangeStart < 2 && rangeStart > 2) {
      rangeStart--;
    }
    
    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      range.push('...');
    }
    
    // Add range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      range.push(i);
    }
    
    // Add ellipsis after range if needed
    if (rangeEnd < totalPages.value - 1) {
      range.push('...');
    }
    
    // Always show last page
    range.push(totalPages.value);
  }
  
  return range;
});

// Display item range text
const startItem = computed(() => {
  return Math.min(((currentPage.value - 1) * itemsPerPage) + 1, filteredHistory.value.length);
});

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage, filteredHistory.value.length);
});

// Format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  
  if (isToday(date)) {
    return t('bonus.today') + ' ' + format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return t('bonus.yesterday') + ' ' + format(date, 'HH:mm');
  } else {
    return format(date, 'yyyy-MM-dd HH:mm');
  }
}

// Pagination controls
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page) {
  if (typeof page === 'number') {
    currentPage.value = page;
  }
}

// Close modal
function close() {
  emit('close');
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-indigo-500 rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-indigo-600;
}
</style>