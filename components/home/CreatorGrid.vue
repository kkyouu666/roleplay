<template>
    <div>
        <!-- Loading State -->
        <div v-if="isLoading && page === 1" class="text-center py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">{{ $t('common.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="creators.length === 0" class="text-center py-10">
            <p class="text-gray-600">{{ $t('roleplay.noResults') }}</p>
            <button @click="$emit('reset-filters')"
                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {{ $t('roleplay.resetFilters') }}
            </button>
        </div>

        <!-- Creator Grid -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-for="creator in creators" :key="creator.id"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <!-- Creator Header -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <NuxtLink :to="`/users/${creator.id}`" class="flex-shrink-0">
                                <img :src="creator.avatar" :alt="creator.username"
                                    class="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg" />
                            </NuxtLink>
                            <div class="ml-3">
                                <NuxtLink :to="`/users/${creator.id}`"
                                    class="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    {{ creator.username }}
                                </NuxtLink>
                                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <div class="flex items-center mr-3">
                                        <Icon name="heroicons:user-group" class="w-4 h-4 mr-1" />
                                        <span>{{ creator.stats.characters }}</span>
                                    </div>
                                    <div class="flex items-center">
                                        <Icon name="heroicons:users" class="w-4 h-4 mr-1" />
                                        <span>{{ creator.stats.followers }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button class="px-3 py-1 text-sm rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                            @click.stop="followCreator(creator.id)">
                            {{ isFollowing(creator.id) ? $t('users.following') : $t('users.follow') }}
                        </button>
                    </div>
                </div>

                <!-- Creator Bio -->
                <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                    <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                        {{ creator.bio || $t('users.noBio') }}
                    </p>
                </div>

                <!-- Popular Characters -->
                <div class="p-4">
                    <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                        {{ $t('users.createdCharacters') }}</h3>
                    <div class="grid grid-cols-3 gap-2">
                        <div v-for="(character, index) in getPopularCharacters(creator.id)" :key="index"
                            class="relative rounded-lg overflow-hidden cursor-pointer"
                            @click.stop="viewCharacter(character)">
                            <img :src="character.avatar" :alt="character.name"
                                class="w-full aspect-square object-cover" />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1">
                                <span class="text-[10px] text-white truncate w-full">{{ character.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading More Indicator -->
        <div v-if="isLoading && page > 1" class="text-center py-4">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Intersection Observer Target -->
        <div v-if="hasMore" ref="loadMoreTrigger" class="h-10 -mt-10"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { format } from 'date-fns';
import type { CharacterCard } from '~/types';

// Define props
const props = defineProps<{
    creators: Array<{
        id: string;
        username: string;
        avatar: string;
        bio?: string;
        joinedAt: string;
        stats: {
            characters: number;
            followers: number;
            rating: number;
        };
    }>;
    isLoading: boolean;
    hasMore: boolean;
    page: number;
}>();

// Define emits
const emit = defineEmits<{
    (e: 'reset-filters'): void;
    (e: 'load-more'): void;
    (e: 'view-profile', creator: typeof props.creators[0]): void;
}>();

// State for following creators
const followedCreators = ref<string[]>([]);

// Mock popular characters for each creator
const creatorCharacters = computed(() => {
    const mockCharacters: Record<string, CharacterCard[]> = {};

    // Import characters from mock data
    const allCharacters = ref<CharacterCard[]>([]);

    // Simulate fetching characters
    onMounted(async () => {
        try {
            const response = await import('~/mock/characters.json');
            allCharacters.value = response.default;
        } catch (error) {
            console.error('Failed to load characters', error);
        }
    });

    // Group characters by creator
    props.creators.forEach(creator => {
        mockCharacters[creator.id] = allCharacters.value
            .filter(char => char.creator.id === creator.id || char.creator.username === creator.username)
            .sort((a, b) => b.stats.rating - a.stats.rating)
            .slice(0, 3);

        // If no characters found, add some placeholder characters
        if (mockCharacters[creator.id].length === 0) {
            mockCharacters[creator.id] = [
                {
                    id: `char_${creator.id}_1`,
                    name: 'Character 1',
                    avatar: 'https://pic.re/image?d=1',
                    description: 'A sample character',
                    category: 'original',
                    tags: ['sample'],
                    creator: {
                        id: creator.id,
                        username: creator.username
                    },
                    stats: {
                        rating: 4.5,
                        chats: 100,
                        favorites: 50
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    nsfw: false
                },
                {
                    id: `char_${creator.id}_2`,
                    name: 'Character 2',
                    avatar: 'https://pic.re/image?d=11',
                    description: 'Another sample character',
                    category: 'original',
                    tags: ['sample'],
                    creator: {
                        id: creator.id,
                        username: creator.username
                    },
                    stats: {
                        rating: 4.3,
                        chats: 80,
                        favorites: 40
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    nsfw: false
                },
                {
                    id: `char_${creator.id}_3`,
                    name: 'Character 3',
                    avatar: 'https://pic.re/image?d=111',
                    description: 'Yet another sample character',
                    category: 'original',
                    tags: ['sample'],
                    creator: {
                        id: creator.id,
                        username: creator.username
                    },
                    stats: {
                        rating: 4.1,
                        chats: 60,
                        favorites: 30
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    nsfw: false
                }
            ];
        }
    });

    return mockCharacters;
});

// Get popular characters for a creator
function getPopularCharacters(creatorId: string): CharacterCard[] {
    return creatorCharacters.value[creatorId] || [];
}

// Check if following a creator
function isFollowing(creatorId: string): boolean {
    return followedCreators.value.includes(creatorId);
}

// Follow/unfollow a creator
function followCreator(creatorId: string) {
    if (isFollowing(creatorId)) {
        followedCreators.value = followedCreators.value.filter(id => id !== creatorId);
    } else {
        followedCreators.value.push(creatorId);
    }
}

// View character details
function viewCharacter(character: CharacterCard) {
    // Navigate to character page or show character modal
    navigateTo(`/characters/${character.id}`);
}

// Ref for intersection observer
const loadMoreTrigger = ref<HTMLElement | null>(null);

// Format date
function formatDate(dateString: string) {
    return format(new Date(dateString), 'yyyy-MM-dd');
}

// Set up intersection observer
onMounted(() => {
    if (!loadMoreTrigger.value) return;

    const observer = new IntersectionObserver((entries) => {
        const target = entries[0];
        if (target && target.isIntersecting && !props.isLoading) {
            emit('load-more');
        }
    }, {
        rootMargin: '100px'
    });

    observer.observe(loadMoreTrigger.value);

    // Cleanup observer on component unmount
    onUnmounted(() => {
        observer.disconnect();
    });
});
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>