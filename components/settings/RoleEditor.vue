<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ isEditing ? $t('settings.editRole') : $t('settings.createRole') }}
        </h2>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
        >
          <Icon name="heroicons:x-mark" class="w-6 h-6" />
        </button>
      </div>
      
      <form @submit.prevent="saveRole">
        <div class="space-y-4">
          <!-- Role Avatar -->
          <div class="flex flex-col items-center mb-4">
            <div class="relative">
              <div 
                v-if="!roleForm.avatar" 
                class="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
              >
                <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400" />
              </div>
              <img 
                v-else 
                :src="roleForm.avatar" 
                alt="Role avatar" 
                class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800"
              />
              
              <button 
                type="button"
                class="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 flex items-center justify-center"
                @click="selectAvatar"
              >
                <Icon name="heroicons:camera" class="w-5 h-5" />
              </button>
              <input 
                ref="avatarInput"
                type="file"
                class="hidden"
                accept="image/webp,image/png,image/gif,image/jpeg"
                @change="handleAvatarUpload"
              />
            </div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('settings.roleAvatar') }}</p>
          </div>
          
          <!-- Role Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.roleName') }} *
            </label>
            <input 
              type="text"
              v-model="roleForm.name"
              class="input"
              required
              :placeholder="$t('settings.roleName')"
            />
          </div>
          
          <!-- Age -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.age') }}
            </label>
            <input 
              type="number"
              v-model="roleForm.age"
              class="input"
              :placeholder="$t('settings.age')"
              min="1"
              max="150"
            />
          </div>
          
          <!-- Bio -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.roleBio') }}
            </label>
            <textarea 
              v-model="roleForm.bio"
              class="input"
              rows="4"
              :placeholder="$t('settings.roleBio')"
            ></textarea>
          </div>
          
          <!-- Error Message -->
          <div v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">
            {{ errorMessage }}
          </div>
          
          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-4">
            <button 
              type="button"
              class="btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              @click="$emit('close')"
            >
              {{ $t('common.cancel') }}
            </button>
            <button 
              type="submit"
              class="btn btn-primary"
            >
              {{ $t('common.save') }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { UserRole } from '~/composables/useApi';

const props = defineProps<{
  role?: UserRole | null
}>();

const emit = defineEmits<{
  save: [role: any]
  close: []
}>();

const { t } = useI18n();
const avatarInput = ref<HTMLInputElement | null>(null);
const errorMessage = ref('');

const isEditing = computed(() => !!props.role);

const roleForm = reactive({
  id: props.role?.id || '',
  name: props.role?.name || '',
  age: props.role?.age || null,
  bio: props.role?.bio || '',
  avatar: props.role?.avatar || '',
  isDefault: props.role?.isDefault || false
});

function selectAvatar() {
  avatarInput.value?.click();
}

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = t('settings.fileSizeLimit');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      roleForm.avatar = e.target.result as string;
    }
  };
  reader.readAsDataURL(file);
}

function saveRole() {
  if (!roleForm.name.trim()) {
    errorMessage.value = t('settings.roleNameRequired');
    return;
  }
  
  errorMessage.value = '';
  emit('save', {
    id: roleForm.id || `role_${Date.now()}`,
    name: roleForm.name,
    age: roleForm.age,
    bio: roleForm.bio,
    avatar: roleForm.avatar,
    isDefault: roleForm.isDefault
  });
}
</script>