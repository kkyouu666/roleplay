<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center">
        <Icon name="heroicons:shopping-cart" class="w-5 h-5 text-green-500 mr-2" />
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ $t('bonus.purchasePoints') }}</h2>
      </div>
    </div>
    
    <div class="p-4">
      <div v-if="isLoading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
        <p class="mt-2 text-gray-600 dark:text-gray-400">{{ $t('common.loading') }}</p>
      </div>
      
      <div v-else class="space-y-4">
        <div 
          v-for="purchase in purchases" 
          :key="purchase.id" 
          class="p-4 rounded-lg border-2 relative"
          :class="purchase.popular ? 'border-green-500 dark:border-green-600' : 'border-gray-200 dark:border-gray-700'"
        >
          <div v-if="purchase.popular" class="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
            <span class="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{{ $t('common.popular') }}</span>
          </div>
          
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <div class="mb-3 md:mb-0">
              <h3 class="font-medium text-gray-900 dark:text-gray-100">{{ $t(`bonus.${getPackTitleKey(purchase.title)}`) }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ $t(`bonus.${getPackDescKey(purchase.description)}`) }}</p>
              
              <div class="mt-2 flex items-center">
                <Icon name="heroicons:currency-yen" class="w-5 h-5 text-green-500 mr-1" />
                <span class="text-2xl font-bold text-gray-900 dark:text-gray-100 mr-2">{{ purchase.amount }}</span>
                <span v-if="purchase.discount" class="text-xs px-2 py-0.5 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                  {{ $t('bonus.save') }} {{ (purchase.discount * 100).toFixed(0) }}%
                </span>
              </div>
            </div>
            
            <div class="text-center md:text-right">
              <div class="text-2xl font-bold text-gray-900 dark:text-gray-100">￥{{ purchase.price }}</div>
              <button 
                class="mt-2 btn btn-primary w-full md:w-auto"
                @click="$emit('purchase', purchase.id)"
              >
                {{ $t('bonus.buy') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p class="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        {{ $t('bonus.paymentMethods') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  purchases: Array<{
    id: string;
    title: string;
    description: string;
    amount: number;
    price: number;
    discount?: number;
    popular?: boolean;
  }>;
  isLoading: boolean;
}>();

const emit = defineEmits<{
  (e: 'purchase', purchaseId: string): void;
}>();

function getPackTitleKey(title: string): string {
  const keyMap = {
    '体验礼包': 'starterPack',
    '人气礼包': 'popularPack',
    '至尊礼包': 'premiumPack'
  };
  return keyMap[title] || title;
}

function getPackDescKey(desc: string): string {
  const keyMap = {
    '适合日常使用': 'starterPackDesc',
    '最受欢迎的选择': 'popularPackDesc',
    '长期使用的最佳选择': 'premiumPackDesc'
  };
  return keyMap[desc] || desc;
}
</script>