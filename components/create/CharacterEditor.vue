<template>
  <div class="p-4 space-y-6 divide-y divide-gray-200 dark:divide-gray-700 h-full overflow-y-auto custom-scrollbar">
    <!-- Form sections -->
    <form @submit.prevent="saveCharacter" class="h-full">
      <!-- Basic Information -->
      <div class="pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.basicInfo') }}</h3>
        
        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.name') }} *</label>
            <input 
              type="text" 
              id="name"
              v-model="localCharacter.name"
              class="input"
              required
            />
          </div>
          
          <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.category') }} *</label>
            <select 
              id="category"
              v-model="localCharacter.category"
              class="input"
              required
            >
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ $t(`roleplay.categories.${category.key}`) }}
              </option>
            </select>
          </div>
          
          <!-- Avatar/Character Image -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.avatar') }} *</label>
            <div class="flex justify-center">
              <div class="relative">
                <!-- Empty avatar placeholder -->
                <div v-if="!localCharacter.avatar || localCharacter.avatar === ''" 
                     class="w-24 h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Icon name="heroicons:photo" class="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                
                <!-- Actual avatar when available -->
                <img 
                  v-else
                  :src="localCharacter.avatar" 
                  class="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600" 
                  alt="Character avatar"
                />
                
                <button 
                  type="button"
                  class="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700 flex items-center justify-center"
                  @click="avatarInput.click()"
                >
                  <Icon name="heroicons:camera" class="w-4 h-4" />
                </button>
                <input 
                  type="file" 
                  ref="avatarInput"
                  accept="image/*"
                  class="hidden"
                  @change="handleAvatarUpload"
                />
              </div>
            </div>
          </div>
          
          <!-- Age -->
          <div>
            <label for="age" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.age') }}</label>
            <input 
              type="text" 
              id="age"
              v-model="characterDetails.age"
              class="input"
            />
          </div>
          
          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.gender') }}</label>
            <select 
              id="gender"
              v-model="characterDetails.gender"
              class="input"
            >
              <option value="">{{ $t('create.editor.selectGender') }}</option>
              <option value="male">{{ $t('create.editor.male') }}</option>
              <option value="female">{{ $t('create.editor.female') }}</option>
              <option value="other">{{ $t('create.editor.other') }}</option>
            </select>
          </div>
          
          <!-- NSFW Flag -->
          <div class="flex items-center">
            <input 
              id="nsfw" 
              type="checkbox" 
              v-model="localCharacter.nsfw"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="nsfw" class="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              {{ $t('create.editor.nsfwContent') }}
            </label>
          </div>
        </div>
      </div>
      
      <!-- Character Description -->
      <div class="pt-6 pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.description') }}</h3>
        
        <div class="space-y-4">
          <!-- Short Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.shortDescription') }} *</label>
            <textarea 
              id="description"
              v-model="localCharacter.description"
              class="input"
              rows="3"
              required
            ></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.shortDescriptionHint') }}</p>
          </div>
          
          <!-- Greeting Message -->
          <div>
            <label for="greeting" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.greeting') }} *</label>
            <textarea 
              id="greeting"
              v-model="localCharacter.greeting"
              class="input"
              rows="2"
              required
            ></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.greetingHint') }}</p>
          </div>
          
          <!-- Personality -->
          <div>
            <label for="personality" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.personality') }}</label>
            <textarea 
              id="personality"
              v-model="characterDetails.personality"
              class="input"
              rows="3"
            ></textarea>
          </div>
          
          <!-- Appearance -->
          <div>
            <label for="appearance" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.appearance') }}</label>
            <textarea 
              id="appearance"
              v-model="characterDetails.appearance"
              class="input"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- Scenario & Background -->
      <div class="pt-6 pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.scenario') }}</h3>
        
        <div class="space-y-4">
          <!-- Background -->
          <div>
            <label for="background" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.background') }}</label>
            <textarea 
              id="background"
              v-model="characterDetails.background"
              class="input"
              rows="4"
            ></textarea>
          </div>
          
          <!-- Scenario -->
          <div>
            <label for="scenario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.defaultScenario') }}</label>
            <textarea 
              id="scenario"
              v-model="characterDetails.scenario"
              class="input"
              rows="4"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.scenarioHint') }}</p>
          </div>
          
          <!-- Example Dialogue -->
          <div>
            <label for="exampleDialogue" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.exampleDialogue') }}</label>
            <textarea 
              id="exampleDialogue"
              v-model="characterDetails.exampleDialogue"
              class="input"
              rows="6"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.dialogueHint') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Tags -->
      <div class="pt-6 pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.tags') }}</h3>
        
        <div class="space-y-4">
          <!-- Character Tags -->
          <div>
            <label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.characterTags') }}</label>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span 
                v-for="tag in localCharacter.tags" 
                :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200"
              >
                #{{ tag }}
                <button 
                  type="button"
                  class="ml-1.5 text-indigo-400 hover:text-indigo-600"
                  @click="removeTag(tag)"
                >
                  <Icon name="heroicons:x-mark" class="w-3 h-3" />
                </button>
              </span>
              
              <input 
                type="text" 
                v-model="tagInput"
                @keydown.enter.prevent="addTag"
                class="input py-1 px-2 text-sm"
                placeholder="Add tag and press Enter"
              />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.tagsHint') }}</p>
          </div>
        </div>
      </div>
      
      <!-- Save Section -->
      <div class="pt-6 pb-6 flex justify-end gap-3">
        <button 
          type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="$emit('cancel')"
        >
          {{ $t('common.cancel') }}
        </button>
        <button 
          type="submit"
          class="btn btn-primary"
        >
          {{ $t('create.editor.saveCharacter') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { CharacterCard } from '~/types';

// Props and emits
const props = defineProps<{
  character: Partial<CharacterCard>
  shouldReset?: boolean
}>();

const emit = defineEmits<{
  'update:character': [character: Partial<CharacterCard>],
  'save': [],
  'cancel': []
}>();

// Watch for shouldReset prop to clear form fields
watch(() => props.shouldReset, (newValue) => {
  if (newValue) {
    // Reset local character to default values
    localCharacter.value = {
      id: '',
      name: '',
      avatar: '',
      description: '',
      greeting: '',
      category: 'original',
      tags: [],
      creator: {
        id: '',
        username: ''
      },
      stats: {
        rating: 0,
        chats: 0,
        favorites: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nsfw: false
    };
    
    // Reset tag input
    tagInput.value = '';
    
    // Reset character details
    characterDetails.value = {
      age: '',
      gender: '',
      personality: '',
      appearance: '',
      background: '',
      scenario: '',
      exampleDialogue: ''
    };
  }
});
// Refs
const avatarInput = ref<HTMLInputElement | null>(null);
const tagInput = ref('');

// Category options
const categories = [
  { key: 'anime', value: 'anime' },
  { key: 'game', value: 'game' },
  { key: 'movie', value: 'movie' },
  { key: 'original', value: 'original' },
  { key: 'fantasy', value: 'fantasy' },
  { key: 'sci_fi', value: 'sci_fi' },
  { key: 'historical', value: 'historical' },
  { key: 'romance', value: 'romance' },
  { key: 'horror', value: 'horror' },
  { key: 'comedy', value: 'comedy' }
];

// Local copy of character data
const localCharacter = ref<Partial<CharacterCard>>({
  ...props.character
});

// Additional character details not in the base type
const characterDetails = ref({
  age: '',
  gender: '',
  personality: '',
  appearance: '',
  background: '',
  scenario: '',
  exampleDialogue: ''
});

// Watch for changes to local character and emit updates
watch(localCharacter, (newValue) => {
  emit('update:character', newValue);
}, { deep: true });

// Handle avatar upload
function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        localCharacter.value.avatar = e.target.result;
      }
    };
    
    reader.readAsDataURL(file);
  }
}

// Tag management
function addTag() {
  if (!tagInput.value.trim()) return;
  
  // Initialize tags array if it doesn't exist
  if (!localCharacter.value.tags) {
    localCharacter.value.tags = [];
  }
  
  // Add tag if it doesn't already exist
  const newTag = tagInput.value.trim().toLowerCase();
  if (!localCharacter.value.tags.includes(newTag)) {
    localCharacter.value.tags.push(newTag);
  }
  
  // Clear input
  tagInput.value = '';
}

function removeTag(tag: string) {
  if (localCharacter.value.tags) {
    localCharacter.value.tags = localCharacter.value.tags.filter(t => t !== tag);
  }
}

// Save character
function saveCharacter() {
  emit('save');
}
</script>