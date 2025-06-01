import { defineStore } from 'pinia';
import { useApi, type AuthUser } from '~/composables/useApi';
import { useRoleplayStore } from '~/stores/roleplay';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
    token: null as string | null,
    showAuthModal: false,
    authModalMode: 'login' as 'login' | 'register' | 'forgotPassword',
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isPremium: (state) => state.user?.subscription === 'premium',
    isStandard: (state) => state.user?.subscription === 'standard',
  },

  actions: {
    setAuthModalVisibility(visible: boolean) {
      this.showAuthModal = visible;

      // Manage body class for preventing scrolling
      if (process.client) {
        if (visible) {
          document.body.classList.add('modal-open');
        } else {
          document.body.classList.remove('modal-open');
        }
      }
    },

    setAuthModalMode(mode: 'login' | 'register' | 'forgotPassword') {
      this.authModalMode = mode;
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.login({ email, password });

        if (response.success) {
          this.user = response.user;
          this.token = response.token;
          this.showAuthModal = false;

          // Store in localStorage
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.user));

          return true;
        } else {
          throw new Error('Login failed');
        }
      } catch (error: any) {
        this.error = error.data?.statusMessage || error.message || 'Login failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.register({ username, email, password });

        if (response.success) {
          this.user = response.user;
          this.token = response.token;
          this.showAuthModal = false;

          // Store in localStorage
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.user));

          return true;
        } else {
          throw new Error('Registration failed');
        }
      } catch (error: any) {
        this.error = error.data?.statusMessage || error.message || 'Registration failed';
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;

      // Remove from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');

      // Also clear the chats when the user logs out
      const roleplayStore = useRoleplayStore();
      if (roleplayStore) {
        roleplayStore.clearChats();
      }
    },

    async checkAuth() {
      const token = localStorage.getItem('auth_token');
      const userStr = localStorage.getItem('auth_user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr) as AuthUser;

          // 验证token是否仍然有效
          const api = useApi();
          const response = await api.getCurrentUser(user.id, token);

          if (response.success) {
            this.token = token;
            this.user = response.user;
          } else {
            this.logout();
          }
        } catch (e) {
          console.error('Auth check failed:', e);
          this.logout();
        }
      }
    },

    async updateProfile(profileData: { username?: string; avatar?: string; bio?: string; settings?: any }) {
      if (!this.user || !this.token) {
        throw new Error('User not authenticated');
      }

      this.loading = true;
      this.error = null;

      try {
        const api = useApi();
        const response = await api.updateProfile(
          {
            userId: this.user.id,
            ...profileData
          },
          this.token
        );

        if (response.success) {
          this.user = response.user;

          // Update localStorage
          localStorage.setItem('auth_user', JSON.stringify(this.user));

          return true;
        } else {
          throw new Error('Profile update failed');
        }
      } catch (error: any) {
        this.error = error.data?.statusMessage || error.message || 'Profile update failed';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
});