<template>
  <div class="container py-6">
    <!-- Error State -->
    <div v-if="!user && !isLoading && loadAttempted" class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:exclamation-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('users.notFound') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('users.notFoundDesc') }}</p>
        <NuxtLink to="/" class="btn btn-primary">
          {{ $t('common.back') }}
        </NuxtLink>
      </div>
    </div>

    <div v-else>
      <!-- User Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div v-if="!user && isLoading" class="p-6 text-center py-10">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>
        <div v-else-if="user" class="p-6">
          <div class="flex flex-col sm:flex-row items-center">
            <img :src="user?.avatar || '/images/avatars/default.jpg'" :alt="user?.username || ''"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
            <div class="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ user?.username || '' }}</h1>
              <p v-if="user?.bio && isPublicBio" class="text-gray-600 dark:text-gray-400 mt-2">{{ user.bio }}</p>
              <div
                class="flex items-center justify-center sm:justify-start mt-2 text-gray-500 dark:text-gray-400 text-sm">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center cursor-pointer" @click="mainTabActive = 'characters'; subTabActive = 'created'">
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ userStats.characters }}</span>
                    <span class="ml-1 text-gray-500 dark:text-gray-400">{{ $t('users.characters') }}</span>
                  </div>
                  <div class="flex items-center cursor-pointer" @click="handleStatsClick('followers')">
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ userStats.followers }}</span>
                    <span class="ml-1 text-gray-500 dark:text-gray-400">{{ $t('users.followers') }}</span>
                  </div>
                  <div class="flex items-center cursor-pointer" @click="handleStatsClick('following')">
                    <span class="font-medium text-gray-700 dark:text-gray-300">{{ userStats.following }}</span>
                    <span class="ml-1 text-gray-500 dark:text-gray-400">{{ $t('users.following') }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isCurrentUser" class="mt-4 sm:mt-0 flex items-center space-x-2">
              <button 
                @click="toggleFollow"
                class="px-4 py-2 rounded-md border text-sm font-medium"
                :class="isFollowing ? 
                  'bg-indigo-50 dark:bg-indigo-900 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300' : 
                  'bg-indigo-600 dark:bg-indigo-700 border-indigo-600 dark:border-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600'"
              >
                <span v-if="isFollowing">{{ $t('users.following') }}</span>
                <span v-else>{{ $t('users.follow') }}</span>
              </button>
              <button @click="showReportModal = true" class="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md">
                <Icon name="heroicons:flag" class="w-5 h-5" />
              </button>
            </div>
            <div v-else class="mt-4 sm:mt-0">
              <NuxtLink to="/profile" class="btn btn-primary">
                {{ $t('users.editProfile') }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- User Tabs -->
      <div class="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
        <!-- Main Tabs: Characters / Memories -->
        <div class="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div class="flex-1 flex">
            <button v-for="tab in mainTabs" :key="tab.id" @click="mainTabActive = tab.id"
              class="px-6 py-3 text-sm font-medium text-center" :class="mainTabActive === tab.id ?
                'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 bg-white dark:bg-gray-800' :
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              {{ $t(tab.label) }}
            </button>
          </div>
        </div>

        <!-- Sub Tabs: Created / Likes / Favorites -->
        <div class="p-4 flex items-center">
          <div class="inline-flex bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <button v-for="tab in subTabs" :key="tab.id" @click="subTabActive = tab.id"
              class="px-4 py-1.5 text-sm font-medium rounded-full transition-colors" :class="subTabActive === tab.id ?
                'bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm' :
                'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              {{ $t(tab.label) }}
            </button>
          </div>
        </div>

        <div class="p-4 pt-0">
          <!-- Characters - Created -->
          <div v-if="mainTabActive === 'characters' && subTabActive === 'created'"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-if="isContentLoading" class="col-span-full text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!userCharacters.length" class="col-span-full text-center py-12">
              <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noCharacters') }}</p>
            </div>

            <template v-else>
              <CommonCharacterCard v-for="character in userCharacters" :key="character.id" :character="character"
                @view-character="viewCharacter" @start-chat="startChat" />
            </template>
          </div>

          <!-- Characters - Likes -->
          <div v-else-if="mainTabActive === 'characters' && subTabActive === 'likes'">
            <div v-if="isContentLoading" class="text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!isPublicLikes" class="text-center py-12">
              <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.likesPrivate') }}</p>
            </div>

            <div v-else-if="!likedCharacters.length" class="text-center py-12">
              <Icon name="heroicons:heart" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noLikes') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CommonCharacterCard v-for="character in likedCharacters" :key="character.id" :character="character"
                @view-character="viewCharacter" @start-chat="startChat" />
            </div>
          </div>

          <!-- Characters - Favorites -->
          <div v-else-if="mainTabActive === 'characters' && subTabActive === 'favorites'">
            <div v-if="isContentLoading" class="text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!isPublicFavorites" class="text-center py-12">
              <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.favoritesPrivate') }}</p>
            </div>

            <div v-else-if="!favoritedCharacters.length" class="text-center py-12">
              <Icon name="heroicons:star" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noFavorites') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <CommonCharacterCard v-for="character in favoritedCharacters" :key="character.id" :character="character"
                @view-character="viewCharacter" @start-chat="startChat" />
            </div>
          </div>

          <!-- Memories - Created -->
          <div v-else-if="mainTabActive === 'memories' && subTabActive === 'created'">
            <div v-if="isContentLoading" class="text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!isPublicMemories" class="text-center py-12">
              <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.memoriesPrivate') }}</p>
            </div>

            <div v-else-if="!userMemories.length" class="text-center py-12">
              <Icon name="heroicons:clock" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('characters.noMemories') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CommonMemoryCard v-for="memory in userMemories" :key="memory.id" :memory="memory" />
            </div>
          </div>

          <!-- Memories - Likes -->
          <div v-else-if="mainTabActive === 'memories' && subTabActive === 'likes'">
            <div v-if="isContentLoading" class="text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!isPublicLikes" class="text-center py-12">
              <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.likesPrivate') }}</p>
            </div>

            <div v-else-if="!likedMemories.length" class="text-center py-12">
              <Icon name="heroicons:heart" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noLikes') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CommonMemoryCard v-for="memory in likedMemories" :key="memory.id" :memory="memory" />
            </div>
          </div>

          <!-- Memories - Favorites -->
          <div v-else-if="mainTabActive === 'memories' && subTabActive === 'favorites'">
            <div v-if="isContentLoading" class="text-center py-10">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
            </div>

            <div v-else-if="!isPublicFavorites" class="text-center py-12">
              <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.favoritesPrivate') }}</p>
            </div>

            <div v-else-if="!favoritedMemories.length" class="text-center py-12">
              <Icon name="heroicons:star" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noFavorites') }}</p>
            </div>

            <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <CommonMemoryCard v-for="memory in favoritedMemories" :key="memory.id" :memory="memory" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Follow Modal -->
    <UsersUserFollowModal v-if="showFollowModal" :mode="followModalMode" :users="followModalUsers"
      :is-loading="isLoadingFollowModal" :is-current-user="isCurrentUser" :following-users="followingUsers"
      @close="closeFollowModal" @follow="followUser" @unfollow="unfollowUser" />

    <!-- Character Modal -->
    <CommonCharacterModal v-if="selectedCharacter" :character="selectedCharacter" @close="closeCharacterModal"
      @start-chat="startChat" />

    <!-- Report Modal -->
    <div v-if="showReportModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">{{ $t('users.reportUser') }}</h3>
          <button @click="showReportModal = false" class="text-gray-400 hover:text-gray-500">
            <Icon name="heroicons:x-mark" class="w-5 h-5" />
          </button>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 mb-4">{{ $t('users.reportReason') }}</p>
        
        <div class="space-y-2 mb-4">
          <label v-for="reason in reportReasons" :key="reason.id" class="flex items-center">
            <input type="radio" :value="reason.id" v-model="selectedReportReason" 
                   class="mr-2 text-indigo-600">
            <span class="text-sm text-gray-700 dark:text-gray-300">{{ $t(reason.label) }}</span>
          </label>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button @click="showReportModal = false" 
                  class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            {{ $t('common.cancel') }}
          </button>
          <button @click="submitReport" 
                  class="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  :disabled="!selectedReportReason">
            {{ $t('users.submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useApi, type User } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();
const api = useApi();

// Loading states
const isLoading = ref(false);
const isContentLoading = ref(false);
const loadAttempted = ref(false);

// Content data
const user = ref<User | null>(null);
const userCharacters = ref<CharacterCard[]>([]);
const likedCharacters = ref<CharacterCard[]>([]);
const favoritedCharacters = ref<CharacterCard[]>([]);
const userMemories = ref<any[]>([]);
const likedMemories = ref<any[]>([]);
const favoritedMemories = ref<any[]>([]);

// Modal states
const selectedCharacter = ref<CharacterCard | null>(null);
const followingUsers = ref<string[]>([]);
const showFollowModal = ref(false);
const followModalMode = ref<'followers' | 'following'>('followers');
const followModalUsers = ref<any[]>([]);
const isLoadingFollowModal = ref(false);
const showReportModal = ref(false);

// Tab states
const mainTabActive = ref('characters');
const subTabActive = ref('created');

// Follow states
const isFollowing = ref(false);

// Privacy settings
const isPublicBio = ref(true);
const isPublicLikes = ref(true);
const isPublicFavorites = ref(true);
const isPublicMemories = ref(true);

// Report functionality
const selectedReportReason = ref('');
const reportReasons = [
  { id: 'spam', label: 'users.reportSpam' },
  { id: 'harassment', label: 'users.reportHarassment' },
  { id: 'inappropriate', label: 'users.reportInappropriate' },
  { id: 'other', label: 'users.reportOther' }
];

// User stats
const userStats = computed(() => {
  return {
    characters: user.value?.stats?.characters || 0,
    followers: user.value?.stats?.followers || 0,
    following: user.value?.stats?.following || 0
  };
});

// Check if viewing current user
const isCurrentUser = computed(() => {
  return authStore?.user?.id === user.value?.id;
});

// Main tabs (Characters/Memories)
const mainTabs = [
  { id: 'characters', label: 'home.characters' },
  { id: 'memories', label: 'home.memories' }
];

// Sub tabs (Created/Likes/Favorites)
const subTabs = [
  { id: 'created', label: 'profile.created' },
  { id: 'likes', label: 'users.likes' },
  { id: 'favorites', label: 'users.favorites' }
];

// Load user data
onMounted(async () => {
  await loadUserContent();
});

// Watch for tab changes and load appropriate content
watch([mainTabActive, subTabActive], async () => {
  if (!user.value) return;
  
  // 检查是否需要加载数据
  let needsLoading = false;
  if (mainTabActive.value === 'characters') {
    needsLoading = (subTabActive.value === 'created' && userCharacters.value.length === 0) ||
                   (subTabActive.value === 'likes' && likedCharacters.value.length === 0) ||
                   (subTabActive.value === 'favorites' && favoritedCharacters.value.length === 0);
  } else if (mainTabActive.value === 'memories') {
    needsLoading = (subTabActive.value === 'created' && userMemories.value.length === 0) ||
                   (subTabActive.value === 'likes' && likedMemories.value.length === 0) ||
                   (subTabActive.value === 'favorites' && favoritedMemories.value.length === 0);
  }
  
  if (needsLoading) {
    isContentLoading.value = true;
  }
  
  // 只加载当前tab还没有数据的内容
  try {
    if (mainTabActive.value === 'characters') {
      if (subTabActive.value === 'created' && userCharacters.value.length === 0) {
        await loadUserCharacters();
      } else if (subTabActive.value === 'likes' && likedCharacters.value.length === 0) {
        await loadLikedCharacters();
      } else if (subTabActive.value === 'favorites' && favoritedCharacters.value.length === 0) {
        await loadFavoritedCharacters();
      }
    } else if (mainTabActive.value === 'memories') {
      if (subTabActive.value === 'created' && userMemories.value.length === 0) {
        await loadUserMemories();
      } else if (subTabActive.value === 'likes' && likedMemories.value.length === 0) {
        await loadLikedMemories();
      } else if (subTabActive.value === 'favorites' && favoritedMemories.value.length === 0) {
        await loadFavoritedMemories();
      }
    }
  } catch (error) {
    console.error('Error loading content on tab change:', error);
  } finally {
    if (needsLoading) {
      isContentLoading.value = false;
    }
  }
});

// Load user content based on active tabs
async function loadUserContent() {
  isLoading.value = true;
  loadAttempted.value = true;

  try {
    // Load user basic info
    const userData = await api.getUser(route.params.id as string);
    user.value = userData;
    
    // Update privacy settings
    isPublicBio.value = userData.settings.isPublicBio;
    isPublicLikes.value = userData.settings.isPublicLikes;
    isPublicFavorites.value = userData.settings.isPublicFavorites;
    isPublicMemories.value = userData.settings.isPublicMemories;

    // Load content based on active tabs
    isContentLoading.value = true;
    if (mainTabActive.value === 'characters') {
      if (subTabActive.value === 'created') {
        await loadUserCharacters();
      } else if (subTabActive.value === 'likes') {
        await loadLikedCharacters();
      } else if (subTabActive.value === 'favorites') {
        await loadFavoritedCharacters();
      }
    } else if (mainTabActive.value === 'memories') {
      if (subTabActive.value === 'created') {
        await loadUserMemories();
      } else if (subTabActive.value === 'likes') {
        await loadLikedMemories();
      } else if (subTabActive.value === 'favorites') {
        await loadFavoritedMemories();
      }
    }

  } catch (error) {
    console.error('Error loading user content:', error);
  } finally {
    isLoading.value = false;
    isContentLoading.value = false;
  }
}

// Load user's characters
async function loadUserCharacters() {
  if (!user.value?.id) return;
  
  try {
    const response = await api.getUserCharacters(user.value.id);
    userCharacters.value = response.characters;
  } catch (error) {
    console.error('Error loading characters:', error);
  }
}

// Load liked characters
async function loadLikedCharacters() {
  if (!user.value?.id) return;
  
  try {
    const response = await api.getUserLikedCharacters(user.value.id);
    likedCharacters.value = response.characters;
    
    // Update privacy status if private
    if (response.isPrivate) {
      isPublicLikes.value = false;
    }
  } catch (error) {
    console.error('Error loading liked characters:', error);
  }
}

// Load favorited characters
async function loadFavoritedCharacters() {
  if (!user.value?.id) return;
  
  try {
    const response = await api.getUserFavoritedCharacters(user.value.id);
    favoritedCharacters.value = response.characters;
    
    // Update privacy status if private
    if (response.isPrivate) {
      isPublicFavorites.value = false;
    }
  } catch (error) {
    console.error('Error loading favorited characters:', error);
  }
}

// Load user memories
async function loadUserMemories() {
  if (!user.value?.id) return;
  
  try {
    const response = await api.getUserMemories(user.value.id);
    userMemories.value = response.memories;
    
    // Update privacy status if private
    if (response.isPrivate) {
      isPublicMemories.value = false;
    }
  } catch (error) {
    console.error('Error loading user memories:', error);
  }
}

// Load liked memories - 使用通用的memories API模拟
async function loadLikedMemories() {
  try {
    const response = await api.getMemories({ page: 2, pageSize: 3 });
    likedMemories.value = response.memories;
  } catch (error) {
    console.error('Error loading liked memories:', error);
  }
}

// Load favorited memories - 使用通用的memories API模拟
async function loadFavoritedMemories() {
  try {
    const response = await api.getMemories({ page: 3, pageSize: 3 });
    favoritedMemories.value = response.memories;
  } catch (error) {
    console.error('Error loading favorited memories:', error);
  }
}

// Toggle follow status
async function toggleFollow() {
  if (!authStore?.isAuthenticated) {
    authStore?.setAuthModalVisibility(true);
    return;
  }

  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    isFollowing.value = !isFollowing.value;
    if (user.value) {
      if (isFollowing.value) {
        user.value.stats.followers++;
      } else {
        user.value.stats.followers--;
      }
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
}

// Handle stats click (followers/following)
function handleStatsClick(type: 'followers' | 'following') {
  if (!user.value?.id) return;
  
  followModalMode.value = type;
  showFollowModal.value = true;
  loadFollowModalUsers();
}

// Load users for follow modal
async function loadFollowModalUsers() {
  if (isLoadingFollowModal.value || !user.value) return;

  isLoadingFollowModal.value = true;
  try {
    let response;
    if (followModalMode.value === 'followers') {
      response = await api.getUserFollowers(user.value.id);
      followModalUsers.value = response.followers;
    } else {
      response = await api.getUserFollowing(user.value.id);
      followModalUsers.value = response.following;
    }

    // Mock following data - 在真实应用中应该从当前用户的关注列表获取
    followingUsers.value = followModalUsers.value
      .filter(() => Math.random() > 0.5)
      .map(user => user.id);
  } catch (error) {
    console.error('Error loading users:', error);
  } finally {
    isLoadingFollowModal.value = false;
  }
}

// Follow user
async function followUser(userId: string) {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    followingUsers.value.push(userId);
  } catch (error) {
    console.error('Error following user:', error);
  }
}

// Unfollow user
async function unfollowUser(userId: string) {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));

    followingUsers.value = followingUsers.value.filter(id => id !== userId);
  } catch (error) {
    console.error('Error unfollowing user:', error);
  }
}

// Close follow modal
function closeFollowModal() {
  showFollowModal.value = false;
  followModalUsers.value = [];
}

// Submit report
async function submitReport() {
  if (!selectedReportReason.value || !user.value) return;

  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Show success message
    // In a real app, you might want to show a toast notification
    console.log(`Reported user ${user.value.username} for ${selectedReportReason.value}`);
    
    showReportModal.value = false;
    selectedReportReason.value = '';
  } catch (error) {
    console.error('Error submitting report:', error);
  }
}

// View character
function viewCharacter(character: CharacterCard) {
  selectedCharacter.value = character;
}

// Close character modal
function closeCharacterModal() {
  selectedCharacter.value = null;
}

// Start chat with character
function startChat(character: CharacterCard) {
  // Check if user is logged in
  if (!authStore?.isAuthenticated) {
    authStore?.setAuthModalVisibility(true);
    return;
  }

  // Start chat and navigate to chat page
  roleplayStore.startChat(character);
  navigateTo('/chats');
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
