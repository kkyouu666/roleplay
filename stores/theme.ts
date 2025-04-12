import { defineStore } from 'pinia';

type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: 'system' as Theme
  }),

  actions: {
    setTheme(newTheme: Theme) {
      this.theme = newTheme;
      
      // Save to localStorage
      if (process.client) {
        localStorage.setItem('theme', newTheme);
      }
      
      // Apply theme
      this.applyTheme();
    },
    
    initTheme() {
      if (process.client) {
        // Get saved theme or default to system
        const savedTheme = localStorage.getItem('theme') as Theme | null;
        this.theme = savedTheme || 'system';
        this.applyTheme();
      }
    },
    
    applyTheme() {
      if (!process.client) return;
      
      const root = window.document.documentElement;
      let isDark = this.theme === 'dark';
      
      if (this.theme === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      
      root.classList.toggle('dark', isDark);
    }
  }
});