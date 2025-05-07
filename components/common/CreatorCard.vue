<template>
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
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
                    @click.stop="$emit('follow', creator.id)">
                    {{ isFollowing ? $t('users.following') : $t('users.follow') }}
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
            <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">{{ $t('users.createdCharacters') }}
            </h3>
            <div class="grid grid-cols-3 gap-2">
                <div v-for="(character, index) in popularCharacters" :key="index"
                    class="relative rounded-lg overflow-hidden cursor-pointer"
                    @click.stop="$emit('view-character', character)">
                    <img :src="character.avatar" :alt="character.name" class="w-full aspect-square object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-1">
                        <span class="text-[10px] text-white truncate w-full">{{ character.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { CharacterCard } from '~/types';

const props = defineProps<{
    creator: {
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
    };
    isFollowing: boolean;
    popularCharacters: CharacterCard[];
}>();

const emit = defineEmits<{
    (e: 'follow', creatorId: string): void;
    (e: 'view-character', character: CharacterCard): void;
}>();
</script>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>