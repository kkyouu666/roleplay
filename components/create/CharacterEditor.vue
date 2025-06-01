<template>
  <div class="p-4 space-y-6 divide-y divide-gray-200 dark:divide-gray-700 h-full overflow-y-auto custom-scrollbar">
    <!-- Form sections -->
    <form @submit.prevent="handleSubmit" class="h-full">
      <!-- 基本情報（カード表示用） -->
      <div class="pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.basicInfo') }}</h3>

        <div class="space-y-4">
          <!-- Name -->
          <div>
            <label for="name"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.name') }}
              *</label>
            <input type="text" id="name" v-model="localCharacter.name" class="input" required
              :placeholder="$t('create.editor.placeholder.name')" />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.name') }}</p>
          </div>

          <!-- Full Name -->
          <div>
            <label for="fullname"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.fullname') }}</label>
            <input type="text" id="fullname" v-model="localCharacter.fullname" class="input"
              :placeholder="$t('create.editor.placeholder.fullname')" />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.fullname') }}</p>
          </div>

          <!-- Category -->
          <div>
            <label for="category"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.category') }}
              *</label>
            <select id="category" v-model="localCharacter.category" class="input" required>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ $t(`roleplay.categories.${category.key}`) }}
              </option>
            </select>
          </div>

          <!-- Tags -->
          <div>
            <label for="tags"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.tags') }}</label>
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <span v-for="tag in localCharacter.tags" :key="tag"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                #{{ tag }}
                <button type="button" class="ml-1.5 text-indigo-400 hover:text-indigo-600" @click="removeTag(tag)">
                  <Icon name="heroicons:x-mark" class="w-3 h-3" />
                </button>
              </span>

              <input type="text" v-model="tagInput" @keydown.enter.prevent="addTag" class="input py-1 px-2 text-sm"
                :placeholder="$t('create.editor.placeholder.tags')" />
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.tags') }}</p>
          </div>

          <!-- Age -->
          <div>
            <label for="age"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.age') }}
              *</label>
            <input type="text" id="age" v-model="localCharacter.age" class="input" required
              :placeholder="$t('create.editor.placeholder.age')" />
          </div>
          <!-- Gender -->
          <div>
            <label for="gender"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.gender') }}</label>
            <select id="gender" v-model="localCharacter.gender" class="input" required>
              <option value="">{{ $t('create.editor.selectGender') }}</option>
              <option value="male">{{ $t('create.editor.male') }}</option>
              <option value="female">{{ $t('create.editor.female') }}</option>
              <option value="other">{{ $t('create.editor.other') }}</option>
            </select>
          </div>

          <!-- Short Description -->
          <div>
            <label for="shortDescription"
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.shortDescription') }}
              *</label>
            <textarea id="shortDescription" v-model="localCharacter.description" class="input" rows="3" required
              :placeholder="$t('create.editor.placeholder.shortDescription')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.shortDescription') }}</p>
          </div>

          <!-- Avatar/Character Image -->
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ $t('create.editor.avatar') }}
              *</label>
            <div class="flex justify-center">
              <div class="relative">
                <!-- Empty avatar placeholder -->
                <div v-if="!localCharacter.avatar || localCharacter.avatar === ''"
                  class="w-24 h-24 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <Icon name="heroicons:photo" class="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>

                <!-- Actual avatar when available -->
                <img v-else :src="localCharacter.avatar"
                  class="w-24 h-24 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  :alt="$t('create.editor.avatar')" />

                <button type="button"
                  class="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-1 hover:bg-indigo-700 flex items-center justify-center"
                  @click="avatarInput?.click()">
                  <Icon name="heroicons:camera" class="w-4 h-4" />
                </button>
                <input type="file" ref="avatarInput" accept="image/*" class="hidden" @change="handleAvatarUpload" />
              </div>
            </div>
            <p class="mt-1 text-sm text-center text-gray-500 dark:text-gray-400">{{ $t('create.editor.uploadImage') }}</p>
          </div>

          <!-- NSFW Flag -->
          <div class="flex items-center">
            <input id="nsfw" type="checkbox" v-model="localCharacter.nsfw"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
            <label for="nsfw"
              class="ml-2 block text-sm text-gray-700 dark:text-gray-300">{{ $t('create.editor.nsfwContent') }}</label>
          </div>
        </div>
      </div>

      <!-- AI用詳細設定 -->
      <div class="pt-6 pb-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ $t('create.editor.additionalDetails') }}
          </h3>
          <div class="flex items-center">
            <label class="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="enableFreeMode" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
              </div>
            </label>
            <label for="enableFreeMode" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
              {{ $t('create.editor.freeMode') }}
            </label>
          </div>
        </div>

        <!-- 自由模式：单个文本域 -->
        <div v-if="enableFreeMode" class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="freeFormDetails"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.freeFormDetails') }} *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('freeFormDetails')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="freeFormDetails" v-model="localCharacter.freeFormDetails" class="input" rows="10" required
              :placeholder="getPlaceholder('freeFormDetails')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {{ getHint('freeFormDetails') }}
            </p>
          </div>
        </div>

        <!-- 标准模式：详细表单 -->
        <div v-else class="space-y-4">
          <!-- Meta欄 / AIヒント -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="metaHints"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.metaHints') }}</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('metaHints')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="metaHints" v-model="localCharacter.metaHints" class="input" rows="2"
              :placeholder="$t('create.editor.placeholder.metaHints')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.metaHints') }}</p>
          </div>

          <!-- Personality -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="personality"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.personality') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('personality')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="personality" v-model="localCharacter.personality" class="input" rows="5" required
              :placeholder="$t('create.editor.placeholder.personality')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.personality') }}</p>
          </div>

          <!-- 行動傾向 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="behavior"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.behavior') }}</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('behavior')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="behavior" v-model="localCharacter.behavior" class="input" rows="6"
              :placeholder="$t('create.editor.placeholder.behavior')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.behavior') }}</p>
          </div>

          <!-- 外見 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="appearance"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.appearance') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('appearance')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="appearance" v-model="localCharacter.appearance" class="input" rows="3" required
              :placeholder="$t('create.editor.placeholder.appearance')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.appearance') }}</p>
          </div>

          <!-- 種族特徴 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="raceCharacteristics"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.raceCharacteristics') }}</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('raceCharacteristics')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="raceCharacteristics" v-model="localCharacter.raceCharacteristics" class="input" rows="3"
              :placeholder="$t('create.editor.placeholder.raceCharacteristics')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.raceCharacteristics') }}</p>
          </div>

          <!-- 能力・スキル -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="abilities"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.abilities') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('abilities')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="abilities" v-model="localCharacter.abilities" class="input" rows="3" required
              :placeholder="getPlaceholder('abilities')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ getHint('abilities') }}</p>
          </div>

          <!-- 詳細な説明 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="detailedDescription"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.detailedDescription') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('detailedDescription')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="detailedDescription" v-model="localCharacter.detailedDescription" class="input" rows="6"
              required :placeholder="$t('create.editor.placeholder.detailedDescription')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.detailedDescription') }}</p>
          </div>

          <!-- R18設定 -->
          <div v-if="localCharacter.nsfw">
            <div class="flex items-center justify-between mb-1">
              <label for="r18Settings"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.r18Settings') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('r18Settings')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="r18Settings" v-model="localCharacter.r18Settings" class="input" rows="4" required
              :placeholder="getPlaceholder('r18Settings')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ getHint('r18Settings') }}</p>
          </div>
        </div>
      </div>


      <!-- 対話設定 -->
      <div class="pt-6 pb-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('create.editor.dialogueSettings') }}
        </h3>

        <div class="space-y-4">
          <!-- 自己紹介 -->
          <div v-if="!enableFreeMode">
            <div class="flex items-center justify-between mb-1">
              <label for="selfIntroduction"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.selfIntroduction') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('selfIntroduction')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="selfIntroduction" v-model="localCharacter.selfIntroduction" class="input" rows="3" required
              :placeholder="$t('create.editor.placeholder.selfIntroduction')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.selfIntroduction') }}</p>
          </div>

          <!-- 開始メッセージ -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="greeting"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.greeting') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('greeting')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="greeting" v-model="localCharacter.greeting" class="input" rows="4" required
              :placeholder="$t('create.editor.placeholder.greeting')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.greeting') }}</p>
          </div>

          <!-- 対話例 -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <label for="dialogueExample"
                class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.exampleDialogue') }}
                *</label>
              <button type="button"
                class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                @click="copyExampleContent('dialogueExample')">
                {{ $t('create.editor.copyExample') }}
              </button>
            </div>
            <textarea id="dialogueExample" v-model="localCharacter.dialogueExample" class="input" rows="6" required
              :placeholder="$t('create.editor.placeholder.dialogueExample')"></textarea>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ $t('create.editor.hint.dialogueExample') }}</p>
          </div>

          <!-- ステータスバー設定 -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h4 class="text-base font-medium text-gray-900 dark:text-gray-100">{{ $t('create.editor.statusBarSettings') }}</h4>
              <div class="flex items-center">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="localCharacter.enableStatusBar" class="sr-only peer">
                  <div
                    class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
                  </div>
                </label>
                <label for="enableStatusBar" class="ml-3 block text-sm text-gray-700 dark:text-gray-300">
                  {{ $t('create.editor.enableStatusBar') }}
                </label>
              </div>
            </div>

            <div v-if="localCharacter.enableStatusBar" class="space-y-4">
              <!-- ステータス表示テンプレート -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="statusDisplayTemplate"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.statusDisplayTemplate') }}</label>
                  <button type="button"
                    class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                    @click="copyExampleContent('statusDisplayTemplate')">
                    {{ $t('create.editor.copyExample') }}
                  </button>
                </div>
                <textarea id="statusDisplayTemplate" v-model="localCharacter.statusDisplayTemplate" class="input" rows="10"
                  :placeholder="getPlaceholder('statusDisplayTemplate')"></textarea>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ getHint('statusDisplayTemplate') }}</p>
              </div>

              <!-- 初期ステータス -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="initialStatus"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.initialStatus') }}
                    *</label>
                  <button type="button"
                    class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                    @click="copyExampleContent('initialStatus')">
                    {{ $t('create.editor.copyExample') }}
                  </button>
                </div>
                <textarea id="initialStatus" v-model="localCharacter.initialStatus" class="input" rows="10" required
                  :placeholder="getPlaceholder('initialStatus')"></textarea>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ getHint('initialStatus') }}</p>
              </div>

              <!-- ステータス更新ルール -->
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label for="statusUpdateRules"
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300">{{ $t('create.editor.statusUpdateRules') }}</label>
                  <button type="button"
                    class="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 ml-auto"
                    @click="copyExampleContent('statusUpdateRules')">
                    {{ $t('create.editor.copyExample') }}
                  </button>
                </div>
                <textarea id="statusUpdateRules" v-model="localCharacter.statusUpdateRules" class="input" rows="10"
                  :placeholder="getPlaceholder('statusUpdateRules')"></textarea>
                <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ getHint('statusUpdateRules') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Save Section -->
      <div class="pt-6 pb-6 flex justify-end gap-3">
        <button type="button"
          class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="$emit('cancel')">
          {{ $t('create.editor.cancel') }}
        </button>
        <button type="submit" class="btn btn-primary">
          {{ $t('create.editor.saveCharacter') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
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
      nsfw: false,
      age: '',
      gender: '',
      fullname: '',
      personality: '',
      appearance: '',
      behavior: '',
      raceCharacteristics: '',
      abilities: '',
      r18Settings: '',
      detailedDescription: '',
      metaHints: '',
      dialogueExample: '',
      selfIntroduction: '',
      initialStatus: '',
      statusUpdateRules: '',
      statusDisplayTemplate: '',
      enableStatusBar: false,
      freeFormDetails: ''
    };
    
    // Reset tag input
    tagInput.value = '';
  }
});
// Refs
const avatarInput = ref<HTMLInputElement | null>(null);
const tagInput = ref('');
const formData = ref(new FormData());
const enableFreeMode = ref(false);
const { t, locale } = useI18n();

// Category options
const categories = [
  { key: 'original', value: 'original' },
  { key: 'fanwork', value: 'fanwork' }
];

// Local copy of character data
const localCharacter = ref<Partial<CharacterCard>>({
  ...props.character,
  freeFormDetails: props.character.freeFormDetails || ''
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
function r18(field: string) {
  return localCharacter.value.nsfw &&
    (field === 'r18Settings' ||
      field === 'initialStatus' ||
      field === 'statusDisplayTemplate' ||
      field === 'abilities' ||
      field === 'statusUpdateRules' ||
      field === 'freeFormDetails');
}
// Copy example content to the corresponding field based on current language
function copyExampleContent(field: string) {
  let value: string;
  
  // Check if NSFW is enabled and if the field has NSFW-specific content
  if (r18(field)) {
    // Use NSFW version from placeholder.nsfw
    value = t(`create.editor.exampleContent.nsfw.${field}`);
  } else {
    // Use regular version from placeholder
    value = t(`create.editor.exampleContent.${field}`);
  }
  
  // Assign the value to the appropriate field
  (localCharacter.value as any)[field] = value;
}

// Get placeholder to the corresponding field based on current language
function getPlaceholder(field: string) {
  let value: string;

  // Check if NSFW is enabled and if the field has NSFW-specific content
  if (r18(field)) {
    // Use NSFW version from placeholder.nsfw
    value = t(`create.editor.placeholder.nsfw.${field}`);
  } else {
    // Use regular version from placeholder
    value = t(`create.editor.placeholder.${field}`);
  }

  return value;
}

function getHint(field: string) {
  let value: string;

  // Check if NSFW is enabled and if the field has NSFW-specific content
  if (r18(field)) {
    value = t(`create.editor.hint.nsfw.${field}`);
  } else {
    value = t(`create.editor.hint.${field}`);
  }

  return value;
}

// Handle form submission
function handleSubmit() {
  // Create a complete character object
  const completeCharacter = {
    ...localCharacter.value
  };
  
  // In a real application, you would send this to the backend
  console.log('Submitting character:', completeCharacter);
  
  // For file uploads, you would use FormData
  if (typeof localCharacter.value.avatar === 'string' && localCharacter.value.avatar.startsWith('data:')) {
    // Convert base64 to blob for upload
    const base64Response = fetch(localCharacter.value.avatar);
    base64Response.then(res => res.blob()).then(blob => {
      const formData = new FormData();
      formData.append('avatar', blob, 'avatar.jpg');
      formData.append('characterData', JSON.stringify(completeCharacter));
      
      // Here you would send the formData to your backend
      // Example: await fetch('/api/characters', { method: 'POST', body: formData });
      
      // For now, just emit the save event
      emit('save');
    });
  } else {
    // No new avatar to upload, just emit the save event
    emit('save');
  }
}

// Save character (legacy method kept for compatibility)
function saveCharacter() {
  emit('save');
}
</script>