import { defineStore } from 'pinia';
import { useRoleplayStore } from '~/stores/roleplay';

interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  role: string;
  subscription: 'free' | 'standard' | 'premium';
  bio?: string;
  stats?: {
    followers: number;
    following: number;
  };
  points?: number;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
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
    },

    setAuthModalMode(mode: 'login' | 'register' | 'forgotPassword') {
      this.authModalMode = mode;
    },

    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        // Mock login functionality for now
        if (email === 'test@example.com' && password === 'Test123456') {
          this.user = {
            id: '1',
            username: 'TestUser',
            email: 'test@example.com',
            profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
            createdAt: new Date().toISOString(),
            role: 'user',
            subscription: 'free',
            bio: 'This is a test user account.',
            stats: {
              followers: 120,
              following: 85
            },
            points: 1500
          };
          this.token = 'mock-jwt-token';
          this.showAuthModal = false;

          // Store in localStorage
          localStorage.setItem('auth_token', this.token);
          localStorage.setItem('auth_user', JSON.stringify(this.user));

          return true;
        } else {
          throw new Error('Invalid email or password');
        }
      } catch (error: any) {
        this.error = error.message;
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register(username: string, email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        // Mock registration
        this.user = {
          id: Date.now().toString(),
          profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          username,
          email,
          createdAt: new Date().toISOString(),
          role: 'user',
          subscription: 'free',
          bio: '',
          stats: {
            followers: 0,
            following: 0
          },
          points: 200 // Starting points for new users
        };
        this.token = 'mock-jwt-token';
        this.showAuthModal = false;

        // Store in localStorage
        localStorage.setItem('auth_token', this.token);
        localStorage.setItem('auth_user', JSON.stringify(this.user));

        return true;
      } catch (error: any) {
        this.error = error.message;
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

    checkAuth() {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('auth_user');

      if (token && user) {
        try {
          this.token = token;
          this.user = JSON.parse(user);
        } catch (e) {
          this.logout();
        }
      }
    }
  }
});