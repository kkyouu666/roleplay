<template>
  <div class="container py-6">
    <!-- Login Required Message -->
    <div v-if="!authStore?.isAuthenticated" class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:user-circle" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('auth.loginRequired') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('auth.loginToAccess') }}</p>
        <div class="flex justify-center">
          <button class="btn btn-primary" @click="openAuthModal">
            {{ $t('auth.login') }}
          </button>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- User Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row items-center">
            <img :src="authStore.user?.profileImage || '/images/avatars/default.jpg'" :alt="authStore.user?.username"
              class="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
            <div class="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ authStore.user?.username }}</h1>
              <p v-if="authStore.user?.bio" class="text-gray-600 dark:text-gray-400 mt-2">{{ authStore.user?.bio }}</p>
              <div
                class="flex items-center justify-center sm:justify-start mt-2 text-gray-500 dark:text-gray-400 text-sm">
                <div class="flex items-center space-x-4">
                  <div class="flex items-center cursor-pointer" @click="activeTab = 'characters'">
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
            <div class="mt-4 sm:mt-0">
              <NuxtLink to="/settings" class="btn btn-primary">
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
            <div v-if="isLoading" class="col-span-full flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
            </div>

            <div v-else-if="!userCharacters.length" class="col-span-full text-center py-12">
              <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noCharacters') }}</p>
              <NuxtLink to="/create" class="mt-4 inline-block btn btn-primary">
                {{ $t('create.title') }}
              </NuxtLink>
            </div>

            <template v-else>
              <CommonCharacterCard v-for="character in userCharacters" :key="character.id" :character="character"
                @view-character="viewCharacter" @start-chat="startChat" />
            </template>
          </div>

          <!-- Characters - Likes -->
          <div v-else-if="mainTabActive === 'characters' && subTabActive === 'likes'">
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
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
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
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
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
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
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
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
            <div v-if="isLoading" class="flex justify-center py-12">
              <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
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
      :is-loading="isLoadingFollowModal" :is-current-user="true" :following-users="followingUsers"
      @close="closeFollowModal" @follow="followUser" @unfollow="unfollowUser" />

    <!-- Character Modal -->
    <CommonCharacterModal v-if="selectedCharacter" :character="selectedCharacter" @close="closeCharacterModal"
      @start-chat="startChat" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();

// Loading states
const isLoading = ref(false);

// Content data
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

// Tab states
const mainTabActive = ref('characters');
const subTabActive = ref('created');

// User stats
const userStats = computed(() => {
  return {
    characters: userCharacters.value.length,
    followers: authStore.user?.stats?.followers || 120,
    following: authStore.user?.stats?.following || 85
  };
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

// Determine what content to load based on active tabs

// Load user data
onMounted(async () => {
  if (authStore?.isAuthenticated) {
    await loadUserContent();
  }
});

// Load user content based on active tabs
async function loadUserContent() {
  isLoading.value = true;

  try {
    // Load content based on active tabs
    if (mainTabActive.value === 'characters') {
      if (subTabActive.value === 'created') await loadUserCharacters();
      else if (subTabActive.value === 'likes') await loadLikedCharacters();
      else if (subTabActive.value === 'favorites') await loadFavoritedCharacters();
    } else if (mainTabActive.value === 'memories') {
      if (subTabActive.value === 'created') await loadUserMemories();
      else if (subTabActive.value === 'likes') await loadLikedMemories();
      else if (subTabActive.value === 'favorites') await loadFavoritedMemories();
    }

  } catch (error) {
    console.error('Error loading user content:', error);
  } finally {
    isLoading.value = false;
  }
}

// Watch for tab changes and load appropriate content
watch([mainTabActive, subTabActive], () => {
  // Reset loading state
  isLoading.value = false;

  // Load content based on current tabs
  if (mainTabActive.value === 'characters') {
    if (subTabActive.value === 'created' && userCharacters.value.length === 0) {
      loadUserCharacters();
    } else if (subTabActive.value === 'likes' && likedCharacters.value.length === 0) {
      loadLikedCharacters();
    } else if (subTabActive.value === 'favorites' && favoritedCharacters.value.length === 0) {
      loadFavoritedCharacters();
    }
  } else if (mainTabActive.value === 'memories') {
    if (subTabActive.value === 'created' && userMemories.value.length === 0) {
      loadUserMemories();
    } else if (subTabActive.value === 'likes' && likedMemories.value.length === 0) {
      loadLikedMemories();
    } else if (subTabActive.value === 'favorites' && favoritedMemories.value.length === 0) {
      loadFavoritedMemories();
    }
  }
});

// Load user's characters
async function loadUserCharacters() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    userCharacters.value = [
      {
        id: 'char_001',
        name: '美杜莎',
        avatar: 'https://pic.re/image?d=1',
        description: '来自希腊神话的蛇发女妖，对视线接触非常敏感。她有着复杂的过去和神秘的力量。',
        category: 'original',
        tags: ['mythology', 'female', 'powerful', 'tragic'],
        creator: {
          id: authStore.user?.id || '',
          username: authStore.user?.username || ''
        },
        stats: {
          rating: 4.8,
          chats: 3250,
          favorites: 1890
        },
        createdAt: '2023-02-15T08:30:00Z',
        updatedAt: '2023-12-10T14:22:00Z',
        nsfw: false
      },
      {
        id: 'char_002',
        name: '赤井秀一',
        avatar: 'https://pic.re/image?d=2',
        description: 'FBI探员，代号"银色子弹"。冷静沉着，精通各种武器和格斗技巧，有着敏锐的观察力和推理能力。',
        category: 'fanwork',
        tags: ['detective', 'male', 'cool', 'intelligent'],
        creator: {
          id: authStore.user?.id || '',
          username: authStore.user?.username || ''
        },
        stats: {
          rating: 4.9,
          chats: 5680,
          favorites: 3450
        },
        createdAt: '2023-03-24T12:45:00Z',
        updatedAt: '2023-11-18T09:33:00Z',
        nsfw: false
      }
    ];
  } catch (error) {
    console.error('Error loading characters:', error);
  }
}

// Load liked characters
async function loadLikedCharacters() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    likedCharacters.value = [
      {
        id: 'char_003',
        name: '夜神月',
        avatar: 'https://pic.re/image?d=3',
        description: '天才高中生，偶然获得了可以杀人的笔记本，开始以"基拉"的身份清除罪犯，建立新世界秩序。',
        category: 'original',
        tags: ['genius', 'male', 'dark', 'complex'],
        creator: {
          id: 'user_153',
          username: 'AnimeGuru'
        },
        stats: {
          rating: 4.7,
          chats: 7890,
          favorites: 4560
        },
        createdAt: '2023-01-10T15:20:00Z',
        updatedAt: '2023-10-25T11:45:00Z',
        nsfw: false
      }
    ];
  } catch (error) {
    console.error('Error loading liked characters:', error);
  }
}

// Load favorited characters
async function loadFavoritedCharacters() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    favoritedCharacters.value = [
      {
        id: 'char_004',
        name: '春野樱',
        avatar: 'https://pic.re/image?d=4',
        description: '医疗忍者，拥有超强怪力和卓越的医疗能力。勤奋刻苦，从普通少女成长为优秀的忍者。',
        category: 'original',
        tags: ['ninja', 'female', 'medical', 'strong'],
        creator: {
          id: 'user_088',
          username: 'NinjaWorld'
        },
        stats: {
          rating: 4.5,
          chats: 4230,
          favorites: 2340
        },
        createdAt: '2023-04-05T09:15:00Z',
        updatedAt: '2023-12-01T16:20:00Z',
        nsfw: false
      }
    ];
  } catch (error) {
    console.error('Error loading favorited characters:', error);
  }
}

// Load user memories
async function loadUserMemories() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load mock data
    const response = await import('~/mock/memories.json');
    userMemories.value = response.default.slice(0, 3);
  } catch (error) {
    console.error('Error loading user memories:', error);
  }
}

// Load liked memories
async function loadLikedMemories() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load mock data
    const response = await import('~/mock/memories.json');
    likedMemories.value = response.default.slice(3, 6);
  } catch (error) {
    console.error('Error loading liked memories:', error);
  }
}

// Load favorited memories
async function loadFavoritedMemories() {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Load mock data
    const response = await import('~/mock/memories.json');
    favoritedMemories.value = response.default.slice(6, 9);
  } catch (error) {
    console.error('Error loading favorited memories:', error);
  }
}

// Handle stats click (followers/following)
function handleStatsClick(type: 'followers' | 'following') {
  followModalMode.value = type;
  showFollowModal.value = true;
  loadFollowModalUsers();
}

// Load users for follow modal
async function loadFollowModalUsers() {
  if (isLoadingFollowModal.value) return;

  isLoadingFollowModal.value = true;
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock data
    followModalUsers.value = Array.from({ length: 5 }, (_, i) => ({
      id: `user_${i + 1}`,
      username: `User${i + 1}`,
      profileImage: `https://pic.re/image?d=5`,
      stats: {
        characters: Math.floor(Math.random() * 10) + 1
      }
    }));

    // Mock following data
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
  // Start chat and navigate to chat page
  roleplayStore.startChat(character);
  navigateTo('/chats');
}

// Format date
function formatDate(dateString?: string) {
  if (!dateString) return '';
  return format(new Date(dateString), 'yyyy-MM-dd');
}

// Format timestamp
function formatTime(timestamp: string) {
  return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
}

// Open auth modal
function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>

<style scoped>
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>