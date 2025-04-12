import { defineStore } from 'pinia';

export const useChatLayoutStore = defineStore('chatLayout', {
  state: () => ({
    showSidebar: true,
    showChatList: true,
    showCharacterInfo: false,
    // Track if the user has manually interacted with the sidebar
    userToggledSidebar: false
  }),
  
  actions: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
      // Mark that the user has manually changed the sidebar state
      this.userToggledSidebar = true;
      
      // Store this preference in localStorage for persistence between sessions
      if (process.client) {
        localStorage.setItem('sidebar_toggled', 'true');
      }
    },
    
    toggleChatList() {
      // If opening chat list and character info is open, close character info
      if (!this.showChatList && this.showCharacterInfo) {
        this.showCharacterInfo = false;
      }
      this.showChatList = !this.showChatList;
    },
    
    toggleCharacterInfo() {
      // If opening character info and chat list is open, close chat list
      if (!this.showCharacterInfo && this.showChatList) {
        this.showChatList = false;
      }
      this.showCharacterInfo = !this.showCharacterInfo;
    },
    
    initLayout(isMobile: boolean, isChatsPage = false) {
      // First visit detection - check if the user has ever toggled the sidebar
      if (process.client && !this.userToggledSidebar) {
        const hasToggledBefore = localStorage.getItem('sidebar_toggled') === 'true';
        this.userToggledSidebar = hasToggledBefore;
      }
      
      // For mobile, sidebar is always collapsed regardless of page
      if (isMobile) {
        this.showSidebar = false;
      } 
      // For desktop on chat pages, sidebar should be collapsed
      else if (isChatsPage) {
        this.showSidebar = false;
      }
      // For first-time visitors on homepage, show expanded sidebar
      else if (process.client && 
              window.location.pathname === '/' && 
              !this.userToggledSidebar) {
        // Only set default expanded sidebar on first visit to homepage
        this.showSidebar = true;
      }
      // For all other cases, maintain current sidebar state
      
      // Chat list is visible by default on desktop
      this.showChatList = !isMobile;
      this.showCharacterInfo = false;
    }
  }
});