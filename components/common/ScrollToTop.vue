<template>
    <Transition enter-active-class="transition-opacity duration-300 ease-in-out"
        leave-active-class="transition-opacity duration-300 ease-in-out" enter-from-class="opacity-0"
        leave-to-class="opacity-0">
        <button v-show="showButton" @click="scrollToTop"
            class="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
            aria-label="Scroll to top">
            <Icon name="heroicons:arrow-up" class="w-5 h-5" />
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const props = defineProps({
    scrollThreshold: {
        type: Number,
        default: 300 // Show button after scrolling 300px
    },
    scrollBehavior: {
        type: String,
        default: 'smooth' // 'smooth' or 'auto'
    }
});

const showButton = ref(false);
const mainContentEl = ref<HTMLElement | null>(null);

function checkScroll() {
    if (mainContentEl.value) {
        showButton.value = mainContentEl.value.scrollTop > props.scrollThreshold;
    }
}

function scrollToTop() {
    if (mainContentEl.value) {
        mainContentEl.value.scrollTo({
            top: 0,
            behavior: props.scrollBehavior as ScrollBehavior
        });
    }
}

onMounted(() => {
    // Wait for the DOM to be fully rendered
    nextTick(() => {
        // Find the main content element - this is the scrollable container in your layout
        mainContentEl.value = document.querySelector('main');

        if (mainContentEl.value) {
            mainContentEl.value.addEventListener('scroll', checkScroll);
            checkScroll(); // Check initial scroll position
        } else {
            // Fallback to window if main element not found
            window.addEventListener('scroll', checkScroll);
            checkScroll();
        }
    });
});

onUnmounted(() => {
    if (mainContentEl.value) {
        mainContentEl.value.removeEventListener('scroll', checkScroll);
    } else {
        window.removeEventListener('scroll', checkScroll);
    }
});
</script>