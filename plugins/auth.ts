export default defineNuxtPlugin({
  name: 'auth-plugin',
  enforce: 'pre',
  setup(nuxtApp) {
    return {
      provide: {
        initAuth: async () => {
          // Only run on client side
          if (process.client) {
            try {
              // Use dynamic import instead of require
              if (nuxtApp.$pinia) {
                const authModule = await import('~/stores/auth');
                const authStore = authModule.useAuthStore();
                if (authStore) {
                  authStore.checkAuth();
                }
              }
            } catch (error) {
              console.error('Failed to initialize auth:', error);
            }
          }
        }
      }
    };
  }
});