// Composable to provide safe auth access
export function useNuxtAuth() {
  const nuxtApp = useNuxtApp();
  
  // Check if store is available
  const checkAuth = () => {
    try {
      const { useAuthStore } = nuxtApp.$pinia ? require('~/stores/auth') : { useAuthStore: null };
      if (useAuthStore) {
        return useAuthStore();
      }
      return null;
    } catch (error) {
      console.error('Auth store not available', error);
      return null;
    }
  };
  
  return {
    authStore: checkAuth(),
    isAuthenticated: () => checkAuth()?.isAuthenticated || false
  };
}