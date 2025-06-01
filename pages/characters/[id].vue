<template>
  <div class="container py-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="w-8 h-8 border-t-2 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="!character && !isLoading" class="text-center py-12">
      <Icon name="heroicons:exclamation-circle" class="w-16 h-16 mx-auto text-gray-400 mb-4" />
      <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('characters.notFound') }}</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('characters.notFoundDesc') }}</p>
      <NuxtLink to="/" class="btn btn-primary">
        {{ $t('common.back') }}
      </NuxtLink>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Desktop Layout -->
      <div class="hidden lg:grid lg:grid-cols-3 gap-6">
        <!-- Main Content (Left Side - 2/3) -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Character Basic Info -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ character?.name }}</h2>

            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                {{ $t(`roleplay.categories.${character?.category}`) }}
              </span>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
                <span>{{ character?.stats.rating }}</span>
              </div>
              <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 mr-1" />
                <span>{{ character?.stats.chats }}</span>
              </div>
            </div>

            <p class="text-gray-700 dark:text-gray-300 mb-4">{{ character?.description }}</p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span v-for="tag in character?.tags" :key="tag"
                class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
                #{{ tag }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {{ $t('roleplay.characterInfo.created') }}</h3>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.createdAt ? formatDate(character.createdAt) : '' }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">插画家</h3>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.illustrator }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">剧本家</h3>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.scriptwriter }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">声优</h3>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.voiceActor }}</p>
              </div>

              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">系列</h3>
                <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.series }}</p>
              </div>
            </div>

            <div class="flex gap-3 mt-6">
              <button class="flex-1 btn btn-primary" @click="startChat">
                {{ $t('roleplay.characterInfo.startChat') }}
              </button>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('characters.comments') }}</h3>
            </div>

            <CharactersCommentSection :comments="comments" @submit-comment="submitComment" />
          </div>

          <!-- Memories Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('characters.publicMemory') }}</h3>
            </div>
            <CharactersPublicMemory :memories="memories" />
          </div>
        </div>

        <!-- Sidebar (Right Side - 1/3) -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Character Image Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
            <div class="aspect-[3/4] overflow-hidden">
              <img :src="character?.avatar" :alt="character?.name" class="w-full h-full object-cover" />
            </div>

            <!-- Action Buttons -->
            <div class="absolute top-2 right-2 flex flex-col gap-2">
              <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                <Icon name="heroicons:share" class="w-5 h-5" />
              </button>
              <div class="relative">
                <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                  <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <!-- Like/Favorite Buttons -->
            <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <div class="flex justify-between">
                <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                  @click="toggleLike">
                  <Icon :name="isLiked ? 'heroicons:hand-thumb-up-solid' : 'heroicons:hand-thumb-up'" class="w-5 h-5"
                    :class="isLiked ? 'text-blue-500' : 'text-white'" />
                  <span>{{ likeCount }}</span>
                </button>

                <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                  @click="toggleFavorite">
                  <Icon :name="isFavorited ? 'heroicons:star-solid' : 'heroicons:star'" class="w-5 h-5"
                    :class="isFavorited ? 'text-pink-500' : 'text-white'" />
                  <span>{{ character?.stats.favorites }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Creator Info Section -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('characters.creator') }}</h3>
            </div>

            <div class="p-4">
              <div class="flex items-center mb-3">
                <img :src="creator?.avatar" :alt="character?.creator.username"
                  class="w-10 h-10 rounded-full object-cover mr-3" />
                <div class="flex-1 min-w-0">
                  <NuxtLink :to="`/users/${character?.creator.id}`"
                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                    {{ character?.creator.username }}
                  </NuxtLink>
                  <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ creator?.stats.characters }} {{ $t('characters.charactersCreated') }}</span>
                  </div>
                </div>

                <button class="ml-2 px-2 py-1 text-xs rounded-full"
                  :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                  @click="toggleFollow">
                  {{ isFollowing ? '已关注' : '关注' }}
                </button>
              </div>

              <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                {{ creator?.bio }}
              </p>

              <!-- Creator's Other Characters -->
              <div v-if="otherCharacters.length > 0">
              <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">其他角色</h4>
              <div class="space-y-2">
                <div v-for="(otherChar, index) in otherCharacters" :key="index"
                  class="flex p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-100 dark:border-gray-700"
                  @click="navigateToCharacter(otherChar.id)">
                  <div class="flex-shrink-0 w-12 h-12 mr-3">
                    <div class="w-12 h-12 rounded-lg overflow-hidden">
                      <img :src="otherChar.avatar" :alt="otherChar.name" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h5 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ otherChar.name }}</h5>
                    <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ otherChar.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="lg:hidden space-y-6">
        <!-- Character Image Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
          <div class="aspect-[3/4] overflow-hidden">
            <img :src="character?.avatar" :alt="character?.name" class="w-full h-full object-cover" />
          </div>

          <!-- Action Buttons -->
          <div class="absolute top-2 right-2 flex flex-col gap-2">
            <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
              <Icon name="heroicons:share" class="w-5 h-5" />
            </button>
            <div class="relative">
              <button class="p-2 bg-black/50 rounded-full text-white flex items-center justify-center">
                <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Like/Favorite Buttons -->
          <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div class="flex justify-between">
              <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                @click="toggleLike">
                <Icon :name="isLiked ? 'heroicons:hand-thumb-up-solid' : 'heroicons:hand-thumb-up'" class="w-5 h-5"
                  :class="isLiked ? 'text-blue-500' : 'text-white'" />
                <span>{{ likeCount }}</span>
              </button>

              <button class="flex items-center gap-1 px-3 py-1.5 bg-white/20 rounded-full text-white text-sm"
                @click="toggleFavorite">
                <Icon :name="isFavorited ? 'heroicons:star-solid' : 'heroicons:star'" class="w-5 h-5"
                  :class="isFavorited ? 'text-pink-500' : 'text-white'" />
                <span>{{ character?.stats.favorites }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Character Basic Info -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{{ character?.name }}</h2>

          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
              {{ $t(`roleplay.categories.${character?.category}`) }}
            </span>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:star" class="w-4 h-4 text-yellow-400 mr-1" />
              <span>{{ character?.stats.rating }}</span>
            </div>
            <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4 mr-1" />
              <span>{{ character?.stats.chats }}</span>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-4">{{ character?.description }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <span v-for="tag in character?.tags" :key="tag"
              class="inline-block px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
              #{{ tag }}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {{ $t('roleplay.characterInfo.created') }}</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.createdAt ? formatDate(character.createdAt) : '' }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">插画家</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.illustrator }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">剧本家</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.scriptwriter }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">声优</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.voiceActor }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">系列</h3>
              <p class="text-sm text-gray-900 dark:text-gray-100">{{ character?.series }}</p>
            </div>
          </div>

          <div class="flex gap-3 mt-6">
            <button class="flex-1 btn btn-primary" @click="startChat">
              {{ $t('roleplay.characterInfo.startChat') }}
            </button>
          </div>
        </div>

        <!-- Creator Info Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ $t('characters.creator') }}</h3>
          </div>

          <div class="p-4">
            <div class="flex items-center mb-3">
              <img :src="creator?.avatar" :alt="character?.creator.username"
                class="w-10 h-10 rounded-full object-cover mr-3" />
              <div class="flex-1 min-w-0">
                <NuxtLink :to="`/users/${character?.creator.id}`"
                  class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 truncate">
                  {{ character?.creator.username }}
                </NuxtLink>
                <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{{ creator?.stats.characters }} {{ $t('characters.charactersCreated') }}</span>
                </div>
              </div>

              <button class="ml-2 px-2 py-1 text-xs rounded-full"
                :class="isFollowing ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300' : 'bg-indigo-600 text-white'"
                @click="toggleFollow">
                {{ isFollowing ? '已关注' : '关注' }}
              </button>
            </div>

            <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
              {{ creator?.bio }}
            </p>

            <!-- Creator's Other Characters -->
            <div v-if="otherCharacters.length > 0">
            <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 mb-2">其他角色</h4>
            <div class="space-y-2">
              <div v-for="(otherChar, index) in otherCharacters" :key="index"
                class="flex p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border border-gray-100 dark:border-gray-700"
                @click="navigateToCharacter(otherChar.id)">
                <div class="flex-shrink-0 w-12 h-12 mr-3">
                  <div class="w-12 h-12 rounded-lg overflow-hidden">
                    <img :src="otherChar.avatar" :alt="otherChar.name" class="w-full h-full object-cover" />
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h5 class="font-medium text-gray-900 dark:text-gray-100 text-sm">{{ otherChar.name }}</h5>
                  <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ otherChar.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Comments Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('characters.comments') }}</h3>
          </div>

          <CharactersCommentSection :comments="comments" @submit-comment="submitComment" />
        </div>

        <!-- Memories Section -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">{{ $t('characters.publicMemory') }}</h3>
          </div>
          <CharactersPublicMemory :memories="memories" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { onMounted, ref } from 'vue';
import { useApi, type Character, type Comment, type Creator, type Memory } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';
import { useRoleplayStore } from '~/stores/roleplay';

const route = useRoute();
const authStore = useAuthStore();
const roleplayStore = useRoleplayStore();

const isLoading = ref(true);
const character = ref<Character | null>(null);
const creator = ref<Creator | null>(null);
const comments = ref<Comment[]>([]);
const memories = ref<Memory[]>([]);
const isLiked = ref(false);
const isFavorited = ref(false);
const isFollowing = ref(false);
const likeCount = ref(Math.floor(Math.random() * 1000) + 100);

// Creator's other characters
const otherCharacters = ref<Character[]>([]);

onMounted(async () => {
  await loadCharacter();
  if (character.value) {
    await Promise.all([
      loadCreator(),
      loadComments(),
      loadMemories(),
      loadOtherCharacters()
    ]);
  }
});

async function loadCharacter() {
  try {
    // Use API to load character
    const api = useApi();
    const foundCharacter = await api.getCharacter(route.params.id as string);

    if (foundCharacter) {
      character.value = foundCharacter;
    }
  } catch (error) {
    console.error('Error loading character:', error);
  } finally {
    isLoading.value = false;
  }
}

async function loadCreator() {
  if (!character.value) return;
  
  try {
    const api = useApi();
    const creatorData = await api.getCreator(character.value.creator.id);
    creator.value = creatorData;
  } catch (error) {
    console.error('Error loading creator:', error);
    // 提供默认数据作为fallback
    creator.value = {
      id: character.value.creator.id,
      username: character.value.creator.username,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
      bio: '这是一位充满创造力的角色设计师，擅长打造有深度的AI角色。热爱探索人物性格的多样性，致力于创造能引起共鸣的角色体验。',
      stats: {
        characters: 16,
        totalChats: 0,
        totalFavorites: 0,
        averageRating: 0
      },
      joinedAt: "2023-01-15T10:30:00Z",
      lastActive: new Date().toISOString()
    };
  }
}

async function loadComments() {
  if (!character.value) return;
  
  try {
    const api = useApi();
    const response = await api.getCharacterComments(character.value.id, 1, 10);
    comments.value = response.comments;
  } catch (error) {
    console.error('Error loading comments:', error);
    // 保持为空数组，不提供fallback数据
    comments.value = [];
  }
}

async function loadMemories() {
  if (!character.value) return;
  
  try {
    const api = useApi();
    const response = await api.getCharacterMemories(character.value.id, 1, 5);
    memories.value = response.memories;
  } catch (error) {
    console.error('Error loading memories:', error);
    // 保持为空数组，不提供fallback数据
    memories.value = [];
  }
}

// Load other characters by the same creator
async function loadOtherCharacters() {
  if (!character.value) return;
  
  try {
    const api = useApi();
    const response = await api.getCreatorCharacters(
      character.value.creator.id, 
      character.value.id, // 排除当前角色
      3 // 限制3个角色
    );
    otherCharacters.value = response.characters;
  } catch (error) {
    console.error('Error loading other characters:', error);
    // 保持为空数组，不提供fallback数据
    otherCharacters.value = [];
  }
}

function startChat() {
  if (!character.value) return;

  // Check if user is logged in
  if (!authStore?.isAuthenticated) {
    if (authStore) {
      authStore.setAuthModalVisibility(true);
    }
    return;
  }

  // Start chat and navigate to chat page
  roleplayStore.startChat(character.value);
  navigateTo('/chats');
}

async function submitComment(content: string) {
  if (!content.trim()) return;

  // In a real app, this would be an API call
  const newComment: Comment = {
    id: `comment${Date.now()}`,
    characterId: character.value?.id || '',
    user: {
      id: authStore?.user?.id || 'anonymous',
      username: authStore?.user?.username || 'Anonymous',
      avatar: authStore?.user?.profileImage || '/images/avatars/default.jpg'
    },
    content: content,
    rating: 5,
    createdAt: new Date().toISOString()
  };
  
  comments.value.unshift(newComment);
}

// Toggle like
function toggleLike() {
  isLiked.value = !isLiked.value;
  if (isLiked.value) {
    likeCount.value++;
  } else {
    likeCount.value--;
  }
}

// Toggle favorite
function toggleFavorite() {
  isFavorited.value = !isFavorited.value;
  // In a real app, you would update the character's favorites count
}

// Toggle follow
function toggleFollow() {
  isFollowing.value = !isFollowing.value;
  // In a real app, you would update the creator's followers count
}

// Navigate to another character
function navigateToCharacter(characterId: string) {
  navigateTo(`/characters/${characterId}`);
}

function formatDate(dateString: string) {
  return format(new Date(dateString), 'yyyy-MM-dd');
}
</script>