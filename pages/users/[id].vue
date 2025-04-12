<template>
  <div class="container py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="!user && !isLoading" class="text-center py-12">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('users.notFound') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('users.notFoundDesc') }}</p>
      <NuxtLink to="/" class="btn btn-primary">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>

    <div v-else>
      <!-- User Header -->
      <UsersUserHeader
        :user="user"
        :is-following="isFollowing"
        :followers="followers"
        :following="following"
        :is-public-bio="isPublicBio"
        @toggle-follow="toggleFollow"
        @select-tab="activeTab = $event"
        @handle-stats-click="handleStatsClick"
      />
      
      <!-- User Tabs -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <UsersUserTabs
          v-model:active-tab="activeTab"
          :tabs="tabs"
        />
      
        <!-- Tab Content -->
        <div class="p-6">
          <!-- Characters Tab -->
          <div v-if="activeTab === 'characters'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-if="isLoadingCharacters" class="col-span-full flex justify-center py-12">
            <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="!userCharacters.length" class="col-span-full text-center py-12">
            <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noCharacters') }}</p>
          </div>
          
          <template v-else>
            <UsersUserCharacterCard
              v-for="character in userCharacters"
              :key="character.id"
              :character="character"
              @view="viewCharacter"
              @start-chat="startChat"
            />
          </template>
        </div>
        
        <!-- Likes Tab -->
        <div v-else-if="activeTab === 'likes'">
          <div v-if="isLoadingLikes" class="flex justify-center py-12">
            <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="!isPublicLikes" class="text-center py-12">
            <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('users.likesPrivate') }}</p>
          </div>
          
          <div v-else-if="!likedCharacters.length" class="text-center py-12">
            <Icon name="heroicons:heart" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noLikes') }}</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UsersUserCharacterCard
              v-for="character in likedCharacters"
              :key="character.id"
              :character="character"
              :show-creator="true"
              @view="viewCharacter"
              @start-chat="startChat"
            />
          </div>
        </div>
        
        <!-- Favorites Tab -->
        <div v-else-if="activeTab === 'favorites'">
          <div v-if="isLoadingFavorites" class="flex justify-center py-12">
            <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
          
          <div v-else-if="!isPublicFavorites" class="text-center py-12">
            <Icon name="heroicons:lock-closed" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('users.favoritesPrivate') }}</p>
          </div>
          
          <div v-else-if="!favoritedCharacters.length" class="text-center py-12">
            <Icon name="heroicons:star" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p class="text-gray-500 dark:text-gray-400">{{ $t('users.noFavorites') }}</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <UsersUserCharacterCard
              v-for="character in favoritedCharacters"
              :key="character.id"
              :character="character"
              :show-creator="true"
              @view="viewCharacter"
              @start-chat="startChat"
            />
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- Follow Modal -->
    <UsersUserFollowModal
      v-if="showFollowModal"
      :mode="followModalMode"
      :users="followModalUsers"
      :is-loading="isLoadingFollowModal"
      :is-current-user="isCurrentUser"
      :following-users="followingUsers"
      @close="closeFollowModal"
      @follow="followUser"
      @unfollow="unfollowUser"
    />
    
    <!-- Character Modal -->
    <CommonCharacterModal
      v-if="selectedCharacter"
      :character="selectedCharacter"
      @close="closeCharacterModal"
      @start-chat="startChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';
import type { CharacterCard } from '~/types';

const route = useRoute();
const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();

// State
const isLoading = ref(true);
const isLoadingCharacters = ref(false);
const isLoadingLikes = ref(false);
const isLoadingFavorites = ref(false);
const isLoadingFollowModal = ref(false);
const user = ref<any>(null);
const userCharacters = ref<CharacterCard[]>([]);
const likedCharacters = ref<CharacterCard[]>([]);
const favoritedCharacters = ref<CharacterCard[]>([]);
const selectedCharacter = ref<CharacterCard | null>(null);
const activeTab = ref('characters');
const isFollowing = ref(false);
const followers = ref(0);
const following = ref(0);
const followingUsers = ref<string[]>([]);
const showFollowModal = ref(false);
const followModalMode = ref<'followers' | 'following'>('followers');
const followModalUsers = ref<any[]>([]);

// Privacy settings
const isPublicBio = ref(true);
const isPublicLikes = ref(true);
const isPublicFavorites = ref(true);

// Computed
const isCurrentUser = computed(() => {
  return authStore?.user?.id === user.value?.id;
});

// Available tabs
const tabs = [
  { id: 'characters', label: 'users.characters' },
  { id: 'likes', label: 'users.likes' },
  { id: 'favorites', label: 'users.favorites' }
];

// Load user data
onMounted(async () => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    user.value = {
      id: route.params.id,
      username: 'User' + route.params.id,
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: 'This is a sample user bio.',
      createdAt: '2023-01-01T00:00:00Z',
      stats: {
        characters: 5,
        followers: 120,
        following: 80
      }
    };
    
    followers.value = user.value.stats.followers;
    following.value = user.value.stats.following;
    
    // Load characters
    loadUserCharacters();
  } catch (error) {
    console.error('Error loading user:', error);
  } finally {
    isLoading.value = false;
  }
});

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'likes' && likedCharacters.value.length === 0) {
    loadLikedCharacters();
  } else if (newTab === 'favorites' && favoritedCharacters.value.length === 0) {
    loadFavoritedCharacters();
  }
});

// Load user's characters
async function loadUserCharacters() {
  if (isLoadingCharacters.value) return;
  
  isLoadingCharacters.value = true;
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    userCharacters.value = [
      {
        id: 'char_001',
        name: '美杜莎',
        avatar: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        description: '来自希腊神话的蛇发女妖，对视线接触非常敏感。她有着复杂的过去和神秘的力量。',
        category: 'fantasy',
        tags: ['mythology', 'female', 'powerful', 'tragic'],
        creator: {
          id: user.value.id,
          username: user.value.username
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
        avatar: 'https://images.unsplash.com/photo-1564510714747-69c3bc1fab41?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        description: 'FBI探员，代号"银色子弹"。冷静沉着，精通各种武器和格斗技巧，有着敏锐的观察力和推理能力。',
        category: 'anime',
        tags: ['detective', 'male', 'cool', 'intelligent'],
        creator: {
          id: user.value.id,
          username: user.value.username
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
  } finally {
    isLoadingCharacters.value = false;
  }
}

// Load liked characters
async function loadLikedCharacters() {
  if (isLoadingLikes.value) return;
  
  isLoadingLikes.value = true;
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    likedCharacters.value = [
      {
        id: 'char_003',
        name: '夜神月',
        avatar: 'https://images.unsplash.com/photo-1581382575275-97901c2635b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        description: '天才高中生，偶然获得了可以杀人的笔记本，开始以"基拉"的身份清除罪犯，建立新世界秩序。',
        category: 'anime',
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
  } finally {
    isLoadingLikes.value = false;
  }
}

// Load favorited characters
async function loadFavoritedCharacters() {
  if (isLoadingFavorites.value) return;
  
  isLoadingFavorites.value = true;
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    favoritedCharacters.value = [
      {
        id: 'char_004',
        name: '春野樱',
        avatar: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        description: '医疗忍者，拥有超强怪力和卓越的医疗能力。勤奋刻苦，从普通少女成长为优秀的忍者。',
        category: 'anime',
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
  } finally {
    isLoadingFavorites.value = false;
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
    if (isFollowing.value) {
      followers.value++;
    } else {
      followers.value--;
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
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
      profileImage: `https://images.unsplash.com/photo-${1500000000000 + i}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`,
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
  if (!authStore?.isAuthenticated) {
    authStore?.setAuthModalVisibility(true);
    return;
  }
  
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