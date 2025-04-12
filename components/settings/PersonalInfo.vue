<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.userInfo') }}</h2>

    <form @submit.prevent="savePersonalInfo">
      <div class="mb-6">
        <div class="flex items-center justify-center mb-4">
          <div class="relative">
            <!-- Empty avatar placeholder -->
            <div v-if="!form.profileImage"
              class="w-24 h-24 rounded-full border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>

            <!-- Actual avatar when available -->
            <img v-else :src="form.profileImage" alt="Profile"
              class="w-24 h-24 rounded-full object-cover border-4 border-white shadow" />

            <button type="button"
              class="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 flex items-center justify-center"
              @click="avatarInput?.click()">
              <Icon name="heroicons:camera" class="w-5 h-5" />
            </button>
            <input ref="avatarInput" type="file" class="hidden" accept="image/webp,image/png,image/gif,image/jpeg"
              @change="handleAvatarUpload" />
          </div>
        </div>
        <p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center mb-4">
          {{ $t('settings.avatarRequirements') }}
        </p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('auth.username') }}
            </label>
            <input type="text" v-model="form.username" class="input" maxlength="20" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('auth.email') }}
            </label>
            <input type="email" v-model="form.email" class="input" disabled />
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ $t('settings.emailNotEditable') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.gender') }}
            </label>
            <select v-model="form.gender" class="input">
              <option value="">{{ $t('settings.selectGender') }}</option>
              <option value="male">{{ $t('settings.male') }}</option>
              <option value="female">{{ $t('settings.female') }}</option>
              <option value="other">{{ $t('settings.other') }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.birthday') }}
            </label>
            <input type="date" v-model="form.birthday" class="input" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ $t('settings.bio') }}
            </label>
            <textarea v-model="form.bio" rows="4" class="input" maxlength="500"></textarea>
            <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ form.bio ? form.bio.length : 0 }}/500</p>
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">
          {{ $t('common.save') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const avatarInput = ref<HTMLInputElement | null>(null);

const form = reactive({
  username: '',
  email: '',
  bio: '',
  gender: '',
  birthday: '',
  profileImage: ''
});

// Initialize form data when component is mounted
onMounted(() => {
  if (authStore?.user) {
    form.username = authStore.user.username;
    form.email = authStore.user.email;
    form.bio = authStore.user.bio || '';
    form.profileImage = authStore.user.profileImage || '';
  }
});

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        form.profileImage = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

async function savePersonalInfo() {
  if (authStore) {
    // In a real app, you would call an API to update the user's profile
    // For now, just show a success message
    alert(useI18n().t('settings.profileUpdated'));
  }
}
</script>