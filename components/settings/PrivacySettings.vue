<template>
  <div>
    <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('settings.privacy') }}</h2>

    <div v-if="isLoading" class="text-center py-10">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
    </div>

    <form v-else @submit.prevent="savePrivacySettings">
      <div class="space-y-6">
        <!-- Profile Information Visibility -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">
            {{ $t('settings.profileInfoVisibility') }}</h3>

          <div class="space-y-4">
            <!-- Gender Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.gender') }}
              </label>
              <select v-model="form.genderVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Birthday Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.birthday') }}
              </label>
              <select v-model="form.birthdayVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Bio Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.bio') }}
              </label>
              <select v-model="form.bioVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="characters">{{ $t('settings.visibilityCharacters') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Content Visibility -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.contentVisibility') }}
          </h3>

          <div class="space-y-4">
            <!-- Favorites Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.favoritesVisibility') }}
              </label>
              <select v-model="form.favoritesVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>

            <!-- Likes Visibility -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ $t('settings.likesVisibility') }}
              </label>
              <select v-model="form.likesVisibility" class="input">
                <option value="public">{{ $t('settings.visibilityPublic') }}</option>
                <option value="private">{{ $t('settings.visibilityPrivate') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- General Privacy Settings -->
        <div>
          <h3 class="text-base font-medium text-gray-900 dark:text-gray-100 mb-4">{{ $t('settings.generalPrivacy') }}
          </h3>

          <div class="space-y-3">
            <div class="flex items-center">
              <input id="data-personalization" type="checkbox" v-model="form.allowPersonalization"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="data-personalization" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.allowPersonalization') }}
              </label>
            </div>

            <div class="flex items-center">
              <input id="data-analytics" type="checkbox" v-model="form.allowAnalytics"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label for="data-analytics" class="ml-3 text-sm text-gray-700 dark:text-gray-300">
                {{ $t('settings.allowAnalytics') }}
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
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

const isLoading = ref(false);
const isSaving = ref(false);

const form = reactive({
  genderVisibility: 'public',
  birthdayVisibility: 'public',
  bioVisibility: 'public',
  favoritesVisibility: 'public',
  likesVisibility: 'public',
  allowPersonalization: true,
  allowAnalytics: true
});

// 在组件挂载时加载用户设置
onMounted(async () => {
  await loadPrivacySettings();
});

// 加载隐私设置数据
async function loadPrivacySettings() {
  if (!authStore?.user?.id) return;
  
  isLoading.value = true;
  try {
    const response = await api.getUserSettings(authStore.user.id);
    if (response.success) {
      const { privacy } = response.settings;
      form.genderVisibility = privacy.genderVisibility;
      form.birthdayVisibility = privacy.birthdayVisibility;
      form.bioVisibility = privacy.bioVisibility;
      form.favoritesVisibility = privacy.favoritesVisibility;
      form.likesVisibility = privacy.likesVisibility;
      form.allowPersonalization = privacy.allowPersonalization;
      form.allowAnalytics = privacy.allowAnalytics;
    }
  } catch (error) {
    console.error('Error loading privacy settings:', error);
  } finally {
    isLoading.value = false;
  }
}

async function savePrivacySettings() {
  if (!authStore?.user?.id) return;

  isSaving.value = true;
  try {
    const response = await api.updatePrivacySettings({
      userId: authStore.user.id,
      genderVisibility: form.genderVisibility,
      birthdayVisibility: form.birthdayVisibility,
      bioVisibility: form.bioVisibility,
      favoritesVisibility: form.favoritesVisibility,
      likesVisibility: form.likesVisibility,
      allowPersonalization: form.allowPersonalization,
      allowAnalytics: form.allowAnalytics
    });

    if (response.success) {
      // 显示成功消息
      alert(response.message || t('settings.privacySettingsUpdated'));
    }
  } catch (error: any) {
    console.error('Error saving privacy settings:', error);
    alert(error.data?.message || t('common.error'));
  } finally {
    isSaving.value = false;
  }
}
</script>