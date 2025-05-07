<template>
    <div>
        <!-- Loading State -->
        <div v-if="isLoading && page === 1" class="text-center py-10">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            <p class="mt-2 text-gray-600">{{ $t('common.loading') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="memories.length === 0" class="text-center py-10">
            <p class="text-gray-600">{{ $t('roleplay.noResults') }}</p>
            <button @click="$emit('reset-filters')"
                class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                {{ $t('roleplay.resetFilters') }}
            </button>
        </div>

        <!-- Memory Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CommonMemoryCard v-for="memory in memories" :key="memory.id" :memory="memory" />
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
import { ref, onMounted, onUnmounted } from 'vue';

// Define props
const props = defineProps<{
    memories: Array<{
        id: string;
        user: {
            id: string;
            username: string;
            avatar: string;
        };
        messages: Array<{
            id: string;
            sender: 'user' | 'character';
            content: string;
        }>;
        timestamp: string;
    }>;
    isLoading: boolean;
    hasMore: boolean;
    page: number;
}>();

// Define emits
const emit = defineEmits<{
    (e: 'reset-filters'): void;
    (e: 'load-more'): void;
}>();

// Ref for intersection observer
const loadMoreTrigger = ref<HTMLElement | null>(null);

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

<style scoped></style>