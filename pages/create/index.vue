<template>
  <div v-if="!authStore?.isAuthenticated" class="container py-6">
    <div class="text-center py-12">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-md mx-auto">
        <Icon name="heroicons:plus-circle" class="w-16 h-16 mx-auto text-indigo-500 mb-4" />
        <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{{ $t('auth.loginRequired') }}</h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">{{ $t('auth.loginToAccess') }}</p>
        <div class="flex justify-center">
          <button class="btn btn-primary" @click="openAuthModal">
            {{ $t('auth.login') }}
          </button>
          </div>
        </div>
      </div>
    </div>
  <div v-else>
    <div class="w-full">
      <!-- Main Create Options -->
      <div v-if="!selectedOption" class="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <!-- Create Options Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Create From Scratch -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-6"
            @click="startCreating">
            <div class="flex items-center justify-center mb-4">
              <div class="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                <Icon name="heroicons:document-plus" class="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <h2 class="text-xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
              {{ $t('create.fromScratch.title') }}</h2>
            <p class="text-gray-600 dark:text-gray-400 text-center">{{ $t('create.fromScratch.description') }}</p>
            <button class="w-full btn btn-primary mt-4">
              {{ $t('create.fromScratch.button') }}
            </button>
          </div>

          <!-- Upload Existing -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow p-6">
            <div class="flex items-center justify-center mb-4">
              <div class="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center">
                <Icon name="heroicons:arrow-up-tray" class="w-8 h-8 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h2 class="text-xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-2">
              {{ $t('create.fromUpload.title') }}</h2>
            <p class="text-gray-600 dark:text-gray-400 text-center">{{ $t('create.fromUpload.description') }}</p>
            <input type="file" ref="fileInput" class="hidden" accept=".json,.png" @change="handleFileUpload" />
            <button class="w-full btn btn-secondary mt-4" @click="openFileUpload">
              {{ $t('create.fromUpload.button') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Character Editor -->
      <div v-else-if="selectedOption === 'create' || selectedOption === 'edit'"
        class="w-full h-[calc(100dvh-64px)] flex flex-col">
        <!-- Mobile Tab Switcher -->
        <div class="md:hidden bg-white dark:bg-gray-800 shadow-md p-2 sticky top-0 z-10 flex-shrink-0">
          <div class="flex">
            <button class="flex-1 py-2 px-4 rounded-md text-center"
              :class="{ 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400': activeTab === 'editor' }"
              @click="activeTab = 'editor'">
              {{ $t('create.tabs.editor') }}
            </button>
            <button class="flex-1 py-2 px-4 rounded-md text-center"
              :class="{ 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400': activeTab === 'preview' }"
              @click="activeTab = 'preview'">
              {{ $t('create.tabs.preview') }}
            </button>
          </div>
        </div>

        <!-- Desktop Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 flex-grow overflow-hidden">
          <!-- Editor Panel -->
          <div v-if="activeTab === 'editor' || !isMobile"
            class="bg-white dark:bg-gray-800 shadow-md flex flex-col overflow-hidden">
            <div
              class="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
              <!-- Left: Back Button -->
              <div>
                <button class="text-gray-400 hover:text-gray-500" @click="handleBack">
                  <Icon name="heroicons:arrow-left" class="w-5 h-5" />
                </button>
              </div>

              <!-- Center: Title -->
              <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('create.editor.title') }}</h2>

              <!-- Right: Auto Save Indicator and Clear Draft Button -->
              <div class="flex items-center space-x-2">
                <span v-if="autoSaveStatus" class="text-xs text-gray-500 dark:text-gray-400">
                  <span v-if="autoSaveStatus === 'saving'">{{ $t('create.editor.autoSave') }}</span>
                  <span v-else-if="autoSaveStatus === 'saved'">{{ $t('common.autoSaved') }}</span>
                </span>
                <button class="text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  @click="clearDraft" title="Clear draft">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </div>
            </div>

            <div class="flex-grow overflow-auto">
              <CreateCharacterEditor :character="editingCharacter" :should-reset="shouldResetForm"
                @update:character="updateCharacter" @save="handleSave" @cancel="handleBack" />
            </div>
          </div>

          <!-- Preview Panel -->
          <div v-if="activeTab === 'preview' || !isMobile"
            class="bg-white dark:bg-gray-800 shadow-md flex flex-col overflow-hidden">
            <div
              class="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 flex justify-center items-center">
              <h2 class="font-semibold text-gray-900 dark:text-gray-100">{{ $t('create.preview.title') }}</h2>
            </div>

            <div class="flex-grow overflow-auto">
              <CreateCharacterPreview :character="editingCharacter" />
            </div>
          </div>
        </div>
      </div>

      <!-- Loading Indicator -->
      <div v-else-if="selectedOption === 'loading'"
        class="max-w-7xl mx-auto px-4 py-6 flex items-center justify-center h-64">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4">
          </div>
          <p class="text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
        </div>
      </div>

      <!-- Publish Panel -->
      <div v-else-if="selectedOption === 'publish'" class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <CreateCharacterPublish :character="editingCharacter" :is-publishing="isPublishing"
            :publish-success="publishSuccess" @publish="publishCharacter" @back="selectedOption = 'edit'"
            @view-character="viewCharacter" @create-another="createAnother" />
        </div>
      </div>
    </div>

    <!-- Error Message Dialog -->
    <div v-if="errorMessage" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div class="text-center">
          <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{{ errorTitle }}</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">{{ errorMessage }}</p>
          <button class="btn btn-primary" @click="errorMessage = ''">
            {{ $t('common.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '~/stores/auth';
import type { CharacterCard } from '~/types';

// Store access
const authStore = useAuthStore();
const { t } = useI18n();

// Screen size check
const { width } = useWindowSize();
const isMobile = computed(() => width.value < 768);

// Navigation state
const selectedOption = ref<'create' | 'edit' | 'publish' | 'loading' | null>(null);
const activeTab = ref<'editor' | 'preview'>('editor');

// File upload reference
const fileInput = ref<HTMLInputElement | null>(null);

// Publishing state
const isPublishing = ref(false);
const publishSuccess = ref(false);
const publishedCharacterId = ref<string | null>(null);

// Auto-save
const autoSaveStatus = ref<'saving' | 'saved' | null>(null);
const autoSaveInterval = ref<NodeJS.Timeout | null>(null);
const lastSavedData = ref<string>('');

// Error handling
const errorMessage = ref('');
const errorTitle = ref('Error');
const shouldResetForm = ref(false);

// Character being edited
const defaultCharacter = {
  id: '',
  name: '',
  avatar: '',
  description: '',
  greeting: '',
  category: 'original',
  tags: [],
  creator: {
    id: authStore?.user?.id || '',
    username: authStore?.user?.username || ''
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

const editingCharacter = ref<Partial<CharacterCard>>({ ...defaultCharacter });

// Load draft on mount
onMounted(() => {
  loadDraft();
  
  // Set up auto-save
  autoSaveInterval.value = setInterval(() => {
    if (selectedOption.value === 'edit' || selectedOption.value === 'create') {
      autoSaveDraft();
    }
  }, 10000); // Auto-save every 10 seconds
});

// Clean up on unmount
onBeforeUnmount(() => {
  if (autoSaveInterval.value) {
    clearInterval(autoSaveInterval.value);
  }
});

// Start creating from scratch
function startCreating() {
  // Load existing draft if available
  const draft = loadDraft();
  if (draft) {
    editingCharacter.value = draft;
  } else {
    // Create new character with default values
    editingCharacter.value = { ...defaultCharacter };
  }
  selectedOption.value = 'create';
  activeTab.value = 'editor';
}

// Open file upload dialog
function openFileUpload() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Handle file upload
async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    
    // Show loading state
    selectedOption.value = 'loading';
    
    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExtension === 'json') {
        await processJsonFile(file);
      } else if (fileExtension === 'png') {
        await processPngFile(file);
      } else {
        throw new Error(t('create.errors.invalidFormat'));
      }
      
      // Switch to edit mode
      selectedOption.value = 'edit';
      activeTab.value = 'editor';
      
    } catch (error: any) {
      errorTitle.value = t('create.errors.fileProcessing');
      errorMessage.value = error.message || '处理文件时出错，请确保您上传了有效的角色卡文件。';
      selectedOption.value = null;
    } finally {
      // Clear the input value so the same file can be selected again
      if (input) {
        input.value = '';
      }
    }
  }
}

// Process JSON file
async function processJsonFile(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (e.target?.result) {
          const characterData = JSON.parse(e.target.result as string);
          
          // Merge with default structure to ensure all fields exist
          editingCharacter.value = {
            ...defaultCharacter,
            ...characterData,
            creator: {
              id: authStore?.user?.id || '',
              username: authStore?.user?.username || ''
            },
            updatedAt: new Date().toISOString()
          };
          
          // Save as draft automatically
          const newId = `draft_${Date.now()}`;
          editingCharacter.value.id = newId;
          
          // Save draft
          saveDraft();
          lastSavedData.value = JSON.stringify(editingCharacter.value);
          
          resolve();
        }
      } catch (error) {
        reject(new Error(t('create.errors.jsonParseError')));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(t('create.errors.readError')));
    };
    
    reader.readAsText(file);
  });
}

// Process PNG file with embedded metadata
async function processPngFile(file: File) {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        if (e.target?.result) {
          // First, set the file as avatar
          const imageDataUrl = e.target.result as string;
          
          // Create a temporary image to extract dimensions
          const img = new Image();
          img.src = imageDataUrl;
          
          await new Promise(imgResolve => {
            img.onload = () => imgResolve(true);
          });
          
          // Try to extract character data from PNG metadata
          // This is a simplified example - in a real app, you would use proper PNG chunk parsing
          // For now, we'll just create a basic character with the image as avatar
          const characterData = {
            name: file.name.replace(/\.[^/.]+$/, ""),
            avatar: imageDataUrl,
            description: t('create.preview.descriptionPlaceholder'),
          };
          
          // Merge with default structure
          editingCharacter.value = {
            ...defaultCharacter,
            ...characterData,
            creator: {
              id: authStore?.user?.id || '',
              username: authStore?.user?.username || ''
            },
            updatedAt: new Date().toISOString()
          };
          
          // Save as draft automatically
          const newId = `draft_${Date.now()}`;
          editingCharacter.value.id = newId;
          
          // Save draft
          saveDraft();
          lastSavedData.value = JSON.stringify(editingCharacter.value);
          
          resolve();
        }
      } catch (error) {
        reject(new Error(t('create.errors.pngProcessError')));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(t('create.errors.readError')));
    };
    
    reader.readAsDataURL(file);
  });
}

// Load draft from localStorage
function loadDraft() {
  if (!process.client) return null;
  
  try {
    const draftData = localStorage.getItem('character_draft');
    if (draftData) {
      return JSON.parse(draftData);
    }
  } catch (error) {
    console.error('Error loading draft:', error);
  }
  return null;
}

// Save draft to localStorage
function saveDraft() {
  if (!process.client) return;
  
  try {
    localStorage.setItem('character_draft', JSON.stringify(editingCharacter.value));
  } catch (error) {
    console.error('Error saving draft:', error);
  }
}

// Clear the current draft
function clearDraft() {
  if (confirm(t('create.errors.clearDraftConfirm'))) {
    // Reset editing character to default
    shouldResetForm.value = true;
    editingCharacter.value = { ...defaultCharacter };
    
    // Clear from localStorage
    if (process.client) {
      localStorage.removeItem('character_draft');
    }
    
    // Reset lastSavedData
    lastSavedData.value = '';
    
    // Reset the shouldResetForm flag after a short delay
    setTimeout(() => {
      shouldResetForm.value = false;
    }, 100);
    
    // Show confirmation
    alert(t('create.errors.clearDraftSuccess'));
  }
}

// Auto-save current draft
function autoSaveDraft() {
  // Skip if nothing changed
  const currentData = JSON.stringify(editingCharacter.value);
  if (currentData === lastSavedData.value) return;
  
  autoSaveStatus.value = 'saving';
  
  // Save the current draft
  saveDraft();
  lastSavedData.value = currentData;
  
  // Update status
  setTimeout(() => {
    autoSaveStatus.value = 'saved';
    setTimeout(() => {
      autoSaveStatus.value = null;
    }, 2000);
  }, 500);
}

// Update character data
function updateCharacter(updatedCharacter: Partial<CharacterCard>) {
  editingCharacter.value = {
    ...editingCharacter.value,
    ...updatedCharacter,
    updatedAt: new Date().toISOString()
  };
}

// Save character as draft and proceed to publish
function handleSave() {
  // Check if character has an avatar
  if (!editingCharacter.value.avatar || editingCharacter.value.avatar === '') {
    errorTitle.value = t('create.errors.missingAvatar');
    errorMessage.value = t('create.errors.missingAvatarMessage');
    return;
  }
  
  // Check for other required fields
  if (!editingCharacter.value.name || !editingCharacter.value.description || !editingCharacter.value.greeting) {
    errorTitle.value = t('create.errors.incompleteInfo');
    errorMessage.value = t('create.errors.incompleteInfoMessage');
    return;
  }
  
  // Perform auto-save
  autoSaveDraft();
  
  // Show publish page
  selectedOption.value = 'publish';
}

// Handle back button
function handleBack() {
  // Save draft before going back
  saveDraft();
  selectedOption.value = null;
}

// Publish character
async function publishCharacter() {
  isPublishing.value = true;
  
  try {
    // This would be an API call in a real app
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Assign a permanent ID for the published character
    const publishedId = `char_${Date.now()}`;
    publishedCharacterId.value = publishedId;
    
    // Update the character with a published status
    editingCharacter.value = {
      ...editingCharacter.value,
      id: publishedId,
      updatedAt: new Date().toISOString()
    };
    
    // Remove draft after publishing
    if (process.client) {
      localStorage.removeItem('character_draft');
    }
    
    // Show success message
    publishSuccess.value = true;
  } catch (error) {
    console.error('Error publishing character:', error);
    errorTitle.value = t('create.errors.publishFailed');
    errorMessage.value = t('create.errors.publishFailedMessage');
  } finally {
    isPublishing.value = false;
  }
}

// View published character
function viewCharacter() {
  // In a real app, this would navigate to the character page
  navigateTo('/');
}

// Create another character
function createAnother() {
  editingCharacter.value = { ...defaultCharacter };
  selectedOption.value = 'create';
  publishSuccess.value = false;
  publishedCharacterId.value = null;
  lastSavedData.value = '';
}

// Open auth modal
function openAuthModal() {
  if (authStore) {
    authStore.setAuthModalVisibility(true);
    authStore.setAuthModalMode('login');
  }
}
</script>