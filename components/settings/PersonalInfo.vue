<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.userInfo') }}</h2>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
    </div>

    <form v-else @submit.prevent="savePersonalInfo">
      <div class="mb-6">
        <div class="flex items-center justify-center mb-4">
          <div class="relative">
            <!-- Empty avatar placeholder -->
            <div v-if="!form.avatar"
              class="w-24 h-24 rounded-full border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
              <Icon name="heroicons:user-circle" class="w-12 h-12 text-gray-400 dark:text-gray-500" />
            </div>

            <!-- Actual avatar when available -->
            <img v-else :src="form.avatar" alt="Profile"
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
        <button type="submit" class="btn btn-primary" :disabled="isSaving">
          <span v-if="isSaving" class="inline-flex items-center">
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
            {{ $t('common.saving') }}
          </span>
          <span v-else>{{ $t('common.save') }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useApi } from '~/composables/useApi';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const api = useApi();
const { t } = useI18n();

const avatarInput = ref<HTMLInputElement | null>(null);
const isLoading = ref(false);
const isSaving = ref(false);

const form = reactive({
  username: '',
  email: '',
  bio: '',
  gender: '',
  birthday: '',
  avatar: ''
});

// 在组件挂载时加载用户设置
onMounted(async () => {
  await loadUserSettings();
});

// 加载用户设置数据
async function loadUserSettings() {
  if (!authStore?.user?.id) return;
  
  isLoading.value = true;
  try {
    const response = await api.getUserSettings(authStore.user.id);
    if (response.success) {
      const { personalInfo } = response.settings;
      form.username = personalInfo.username;
      form.email = personalInfo.email;
      form.bio = personalInfo.bio;
      form.gender = personalInfo.gender;
      form.birthday = personalInfo.birthday;
      form.avatar = personalInfo.avatar;
    }
  } catch (error) {
    console.error('Error loading user settings:', error);
    // 回退到使用authStore中的数据
    if (authStore?.user) {
      form.username = authStore.user.username;
      form.email = authStore.user.email;
      form.bio = authStore.user.bio || '';
      form.avatar = authStore.user.avatar || '';
    }
  } finally {
    isLoading.value = false;
  }
}

function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];

    // 检查文件大小（5MB限制）
    if (file.size > 5 * 1024 * 1024) {
      alert(t('settings.fileSizeLimit'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === 'string') {
        form.avatar = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

async function savePersonalInfo() {
  if (!authStore?.user?.id) return;

  isSaving.value = true;
  try {
    const response = await api.updatePersonalInfo({
      userId: authStore.user.id,
      username: form.username,
      bio: form.bio,
      gender: form.gender,
      birthday: form.birthday,
      avatar: form.avatar
    });

    if (response.success) {
      // 更新authStore中的用户信息
      if (authStore && response.user) {
        authStore.user = {
          ...authStore.user,
          username: response.user.username,
          bio: response.user.bio,
          avatar: response.user.avatar
        };
      }
      
      // 显示成功消息
      alert(response.message || t('settings.profileUpdated'));
    }
  } catch (error: any) {
    console.error('Error saving personal info:', error);
    alert(error.data?.message || t('common.error'));
  } finally {
    isSaving.value = false;
  }
}
</script>