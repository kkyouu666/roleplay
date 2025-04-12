<template>
  <div class="container py-6">
    <!-- Pricing Toggle -->
    <div class="flex justify-center mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-1 inline-flex shadow-sm">
        <button class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="billingCycle === 'monthly' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
          @click="billingCycle = 'monthly'">
          {{ $t('subscription.pricing.monthly') }}
        </button>
        <button class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="billingCycle === 'yearly' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'"
          @click="billingCycle = 'yearly'">
          {{ $t('subscription.pricing.yearly') }}
          <span class="ml-1 text-xs font-semibold text-green-600 dark:text-green-400">-20%</span>
        </button>
      </div>
    </div>

    <!-- Pricing Plans -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Free Plan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('subscription.plans.free') }}</h2>
          <div class="mt-4">
            <span class="text-3xl font-bold text-gray-900 dark:text-gray-100">$0</span>
            <span class="text-gray-500 dark:text-gray-400 ml-1">/ {{ $t('subscription.pricing.perMonth') }}</span>
          </div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{{ $t('common.description') }}</p>
        </div>

        <div class="p-6">
          <ul class="space-y-4">
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.messageLimit') }}: 200 /
                {{ $t('subscription.pricing.perMonth') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.historyAccess') }}: 7
                {{ $t('subscription.features.historyAccessDate') }}</span>
            </li>
            <li class="flex items-start text-gray-400 dark:text-gray-500">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-gray-300 dark:text-gray-600 mt-0.5 mr-2" />
              <span>{{ $t('subscription.features.advancedChat') }}</span>
            </li>
            <li class="flex items-start text-gray-400 dark:text-gray-500">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-gray-300 dark:text-gray-600 mt-0.5 mr-2" />
              <span>{{ $t('subscription.features.customCharacters') }}</span>
            </li>
            <li class="flex items-start text-gray-400 dark:text-gray-500">
              <Icon name="heroicons:x-circle" class="h-5 w-5 text-gray-300 dark:text-gray-600 mt-0.5 mr-2" />
              <span>{{ $t('subscription.features.adsRemoval') }}</span>
            </li>
          </ul>

          <div class="mt-6">
            <button
              class="w-full btn border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
              {{ $t('subscription.action.current') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Standard Plan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ring-2 ring-indigo-500">
        <div class="absolute inset-x-0 top-0 transform translate-y-px">
          <div class="flex justify-center transform -translate-y-1/2">
            <span
              class="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white tracking-wider uppercase">
              {{ $t('common.popular') }}
            </span>
          </div>
        </div>

        <div class="p-6 border-b border-gray-200 dark:border-gray-700 relative">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('subscription.plans.standard') }}
          </h2>
          <div class="mt-4">
            <span
              class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ billingCycle === 'monthly' ? '9.99' : '7.99' }}</span>
            <span class="text-gray-500 dark:text-gray-400 ml-1">/ {{ $t('subscription.pricing.perMonth') }}</span>
          </div>
          <p class="mt-2 text-sm">
            <span v-if="billingCycle === 'yearly'" class="text-green-600 dark:text-green-400 font-medium">
              {{ $t('subscription.pricing.save') }} $24 {{ $t('subscription.pricing.perYear') }}
            </span>
            <span v-else class="text-gray-500 dark:text-gray-400">
              {{ $t('common.description') }}
            </span>
          </p>
        </div>

        <div class="p-6">
          <ul class="space-y-4">
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.messageLimit') }}: 2000 /
                {{ $t('subscription.pricing.perMonth') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.historyAccess') }}: 30
                {{ $t('subscription.features.historyAccessDate') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.advancedChat') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.customCharacters') }}:
                5</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.adsRemoval') }}</span>
            </li>
          </ul>

          <div class="mt-6">
            <button class="w-full btn btn-primary" @click="upgradePlan('standard')">
              {{ $t('subscription.action.subscribe') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Premium Plan -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100">{{ $t('subscription.plans.premium') }}</h2>
          <div class="mt-4">
            <span
              class="text-3xl font-bold text-gray-900 dark:text-gray-100">${{ billingCycle === 'monthly' ? '19.99' : '15.99' }}</span>
            <span class="text-gray-500 dark:text-gray-400 ml-1">/ {{ $t('subscription.pricing.perMonth') }}</span>
          </div>
          <p class="mt-2 text-sm">
            <span v-if="billingCycle === 'yearly'" class="text-green-600 dark:text-green-400 font-medium">
              {{ $t('subscription.pricing.save') }} $48 {{ $t('subscription.pricing.perYear') }}
            </span>
            <span v-else class="text-gray-500 dark:text-gray-400">
              {{ $t('common.description') }}
            </span>
          </p>
        </div>

        <div class="p-6">
          <ul class="space-y-4">
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.messageLimit') }}:
                {{ $t('common.unlimited') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.historyAccess') }}:
                {{ $t('common.unlimited') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.advancedChat') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.customCharacters') }}:
                {{ $t('common.unlimited') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.adsRemoval') }}</span>
            </li>
            <li class="flex items-start">
              <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-500 mt-0.5 mr-2" />
              <span class="text-gray-900 dark:text-gray-100">{{ $t('subscription.features.priority') }}</span>
            </li>
          </ul>

          <div class="mt-6">
            <button class="w-full btn btn-secondary" @click="upgradePlan('premium')">
              {{ $t('subscription.action.subscribe') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="mt-16">
      <h2 class="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100">{{ $t('common.faq') }}</h2>

      <div class="space-y-4">
        <div v-for="(item, index) in faqItems" :key="index"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <button class="w-full p-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700"
            @click="toggleFaq(index)">
            <span
              class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`subscription.faq.${item}.question`) }}</span>
            <Icon :name="expandedFaq === index ? 'heroicons:minus-circle' : 'heroicons:plus-circle'"
              class="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div v-if="expandedFaq === index" class="px-4 pb-4">
            <p class="text-gray-600 dark:text-gray-400">{{ $t(`subscription.faq.${item}.answer`) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useI18n } from 'vue-i18n';

const authStore = useAuthStore();
const { t } = useI18n();
const billingCycle = ref('monthly');
const expandedFaq = ref(-1);

const faqItems = [
  'planDifferences',
  'cancellation',
  'changePlan',
  'paymentMethods',
  'autoRenewal'
];

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? -1 : index;
}

function upgradePlan(plan: string) {
  // Check if user is logged in
  if (!authStore?.isAuthenticated) {
    if (authStore) {
      authStore.setAuthModalVisibility(true);
      authStore.setAuthModalMode('login');
    }
    return;
  }

  // In a real app, this would call an API to update the subscription
  alert(`${t('subscription.plans.' + plan)}に${t('subscription.action.upgrade')}しました。`);
}
</script>