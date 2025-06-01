<template>
    <div class="bg-gradient-to-br from-white/90 to-indigo-100/70 dark:from-gray-900/40 dark:to-indigo-950/50 backdrop-blur-sm border border-indigo-100/40 dark:border-indigo-800/20 rounded-lg shadow-lg overflow-hidden flex flex-col">
        <!-- Memory Card Header with Title and Stats -->
        <div class="p-4 border-b border-indigo-200/40 dark:border-indigo-700/30 bg-gradient-to-br from-white/40 to-indigo-100/50 dark:from-gray-900/30 dark:to-indigo-900/40">
            <div class="flex justify-between items-center mb-2">
                <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ memory.title || 'Chat Memory' }}</h3>
                <div class="flex items-center space-x-2">
                    <div class="flex items-center text-gray-500 dark:text-gray-400">
                        <Icon name="heroicons:heart" class="w-4 h-4 text-pink-500 mr-1" />
                        <span class="text-xs">{{ memory.stats?.likes || 0 }}</span>
                    </div>
                    <div class="flex items-center text-gray-500 dark:text-gray-400">
                        <Icon name="heroicons:chat-bubble-left" class="w-4 h-4 text-indigo-500 mr-1" />
                        <span class="text-xs">{{ memory.stats?.comments || 0 }}</span>
                    </div>
                </div>
            </div>

            <!-- User and Character Info -->
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <NuxtLink :to="`/users/${memory.user.id}`" class="flex items-center">
                        <img :src="memory.user.avatar" :alt="memory.user.username"
                            class="w-6 h-6 rounded-full object-cover" />
                        <span class="ml-1 text-xs text-gray-700 dark:text-gray-300">{{ memory.user.username }}</span>
                    </NuxtLink>
                </div>

                <div class="flex items-center">
                    <span class="text-xs text-gray-700 dark:text-gray-300 mr-1">{{ memory.character?.name }}</span>
                    <img :src="memory.character?.avatar" :alt="memory.character?.name"
                        class="w-6 h-6 rounded-full object-cover" />
                </div>
            </div>
        </div>

        <!-- Memory Content -->
        <div class="p-4 space-y-4 flex-1">
            <!-- User Message -->
            <div class="flex justify-end">
                <div class="max-w-[80%] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-lg rounded-br-none px-3 py-2 text-sm shadow-md">
                    <p class="whitespace-pre-wrap break-words">
                        {{memory.messages.find(m => m.sender === 'user')?.content}}</p>
                </div>
            </div>

            <!-- Character Message -->
            <div class="flex justify-start">
                <div
                    class="max-w-[80%] bg-gradient-to-br from-gray-200/85 to-gray-300/75 dark:from-gray-700/60 dark:to-gray-800/70 text-gray-800 dark:text-gray-100 rounded-lg rounded-bl-none px-3 py-2 text-sm shadow-sm backdrop-blur-sm">
                    <p class="whitespace-pre-wrap break-words">
                        {{memory.messages.find(m => m.sender === 'character')?.content}}</p>
                </div>
            </div>
        </div>

        <!-- Footer with timestamp -->
        <div class="px-4 py-2 border-t border-indigo-200/40 dark:border-indigo-700/30 text-right bg-gradient-to-br from-white/30 to-indigo-100/40 dark:from-gray-900/20 dark:to-indigo-900/30">
            <span class="text-xs text-gray-600 dark:text-gray-300">
                {{ formatTime(memory.timestamp) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

defineProps<{
    memory: {
        id: string;
        title?: string;
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        character?: {
            id?: string;
            name: string;
            avatar: string;
        };
        messages: Array<{
            id: string;
            sender: 'user' | 'character';
            content: string;
        }>;
        timestamp: string;
        stats?: {
            likes?: number;
            comments?: number;
        };
    };
}>();

// Format timestamp
function formatTime(timestamp: string) {
    return format(new Date(timestamp), 'yyyy-MM-dd HH:mm');
}
</script>

<style scoped>
.whitespace-pre-wrap {
    white-space: pre-wrap;
}

.break-words {
    word-break: break-word;
}
</style>