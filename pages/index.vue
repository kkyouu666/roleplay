<template>
  <div class="container py-6">
    <!-- Desktop Featured Characters Banner (hidden on mobile) -->
    <!-- <div class="hidden md:block">
      <HomeFeaturedCharacterBanner :characters="featuredCharacters"
        :is-loading="roleplayStore.isLoading && roleplayStore.page === 1" @start-chat="startChat"
        @view-details="viewCharacter" />
    </div> -->

    <!-- Mobile Featured Characters Banner (visible only on mobile) -->
    <!-- <div class="block md:hidden">
      <HomeMobileFeaturedCharacterBanner :characters="featuredCharacters"
        :is-loading="roleplayStore.isLoading && roleplayStore.page === 1" @start-chat="startChat"
        @view-details="viewCharacter" />
    </div> -->

    <div class="relative">
      <!-- Tab Buttons -->
      <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="flex border-b border-gray-200 dark:border-gray-700">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
            class="flex-1 py-3 px-4 text-center text-sm font-medium" :class="activeTab === tab.id ?
              'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' :
              'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
            {{ $t(tab.label) }}
          </button>
        </div>

        <!-- Filter Options Component -->
        <HomeCharacterFilterOptions v-if="activeTab === 'characters'"
          :selected-category="roleplayStore.filters.category" :selected-tags="roleplayStore.filters.tags"
          :initial-ranking="roleplayStore.filters.ranking" :initial-gender="roleplayStore.filters.gender"
          :initial-show-filtered="roleplayStore.filters.showFiltered" @set-category="setCategoryFilter"
          @toggle-tag="toggleTagFilter" @set-ranking="setRankingFilter" @set-gender="setGenderFilter"
          @toggle-filtered="toggleFilteredView" />

        <HomeMemoryFilterOptions v-else-if="activeTab === 'memories'" :initial-ranking="roleplayStore.filters.ranking"
          :initial-gender="roleplayStore.filters.gender" :initial-show-filtered="roleplayStore.filters.showFiltered"
          @set-ranking="setRankingFilter" @set-gender="setGenderFilter" @toggle-filtered="toggleFilteredView" />

        <HomeCreatorFilterOptions v-else :selected-filter="roleplayStore.creatorsSort"
          :initial-show-filtered="roleplayStore.filters.showFiltered" @set-filter="handleCreatorFilter"
          @toggle-filtered="toggleFilteredView" />
      </div>

      <!-- Tab Content -->
      <div class="min-w-0">
        <!-- Characters Tab -->
        <HomeCharacterGrid v-if="activeTab === 'characters'" :characters="roleplayStore.filteredCharacters"
          :is-loading="roleplayStore.isLoading" :has-more="roleplayStore.hasMore" :page="roleplayStore.page"
          @view-character="viewCharacter" @start-chat="startChat" @reset-filters="resetFilters" @load-more="loadMore" />

        <!-- Memories Tab -->
        <HomeMemoryGrid v-else-if="activeTab === 'memories'" :memories="roleplayStore.memories" 
          :is-loading="roleplayStore.isLoadingMemories" :has-more="roleplayStore.hasMoreMemories" 
          :page="roleplayStore.memoriesPage" @reset-filters="resetFilters" @load-more="loadMoreMemories" />

        <!-- Creators Tab -->
        <HomeCreatorGrid v-else :creators="roleplayStore.creators" :is-loading="roleplayStore.isLoadingCreators" 
          :has-more="roleplayStore.hasMoreCreators" :page="roleplayStore.creatorsPage" @reset-filters="resetFilters" 
          @load-more="loadMoreCreators" @view-profile="viewCreatorProfile" />
      </div>

      <!-- Character Modal -->
      <CommonCharacterModal v-if="selectedCharacter" :character="selectedCharacter" @close="closeModal"
        @start-chat="startChat" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const roleplayStore = useRoleplayStore();
const authStore = useAuthStore();
const selectedCharacter = ref<CharacterCard | null>(null);

// Tab management
const tabs = [
  { id: 'characters', label: 'home.characters' },
  { id: 'memories', label: 'home.memories' },
  { id: 'creators', label: 'home.creators' }
];
const activeTab = ref('characters');

// Featured characters - select multiple characters for the banner
const featuredCharacters = computed(() => {
  if (roleplayStore.characters.length === 0) return [];

  // First, try to find characters with high ratings
  const highRatedChars = roleplayStore.characters
    .filter(char => char.stats.rating >= 4.7)
    .slice(0, 5);

  // If we don't have enough high-rated characters, add some more characters
  if (highRatedChars.length < 3) {
    const remainingChars = roleplayStore.characters
      .filter(char => char.stats.rating < 4.7)
      .slice(0, 5 - highRatedChars.length);

    return [...highRatedChars, ...remainingChars];
  }

  return highRatedChars;
});

// Load initial data
onMounted(async () => {
  // Initial load of characters
  if (roleplayStore.characters.length === 0) {
    await roleplayStore.loadCharacters();
  }

  // Load memories if memories tab is active
  if (activeTab.value === 'memories') {
    roleplayStore.loadMemories();
  }

  // Load creators if creators tab is active
  if (activeTab.value === 'creators') {
    roleplayStore.loadCreators();
  }
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'memories' && roleplayStore.memories.length === 0) {
    roleplayStore.loadMemories();
  } else if (newTab === 'creators' && roleplayStore.creators.length === 0) {
    roleplayStore.loadCreators();
  }
});

// Load more data based on active tab
function loadMore() {
  if (!roleplayStore.isLoading) {
    roleplayStore.loadCharacters();
  }
}

function loadMoreMemories() {
  roleplayStore.loadMemories();
}

function loadMoreCreators() {
  roleplayStore.loadCreators();
}

// Filter methods
function setCategoryFilter(category: string) {
  roleplayStore.page = 1;
  roleplayStore.setCategoryFilter(category);
}

function toggleTagFilter(tag: string) {
  roleplayStore.page = 1;
  roleplayStore.toggleTagFilter(tag);
}

function setRankingFilter(ranking: string) {
  roleplayStore.page = 1;
  roleplayStore.setRankingFilter(ranking);
}

function setGenderFilter(gender: string) {
  roleplayStore.page = 1;
  roleplayStore.setGenderFilter(gender);
}

function toggleFilteredView(showFiltered: boolean) {
  roleplayStore.page = 1;
  roleplayStore.toggleFilteredView(showFiltered);
}

function handleCreatorFilter(filter: string) {
  roleplayStore.setCreatorsSort(filter);
}

function resetFilters() {
  roleplayStore.page = 1;
  roleplayStore.resetFilters();
}

// Character interaction methods
function viewCharacter(character: CharacterCard) {
  selectedCharacter.value = character;
  // Add class to body to prevent scrolling
  if (process.client) {
    document.body.classList.add('modal-open');
  }
}

function closeModal() {
  selectedCharacter.value = null;
  // Remove class from body to re-enable scrolling
  if (process.client) {
    document.body.classList.remove('modal-open');
  }
}

function startChat(character: CharacterCard) {
  // Check if user is logged in
  if (!authStore?.isAuthenticated) {
    if (authStore) {
      authStore.setAuthModalVisibility(true);
    }
    return;
  }

  // Start chat and navigate to chat page
  roleplayStore.startChat(character);
  navigateTo('/chats');
}

// Creator interaction methods
function viewCreatorProfile(creator: any) {
  navigateTo(`/users/${creator.id}`);
}
</script>