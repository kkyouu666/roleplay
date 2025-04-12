// Character card interface
export interface CharacterCard {
  id: string;
  name: string;
  avatar: string;
  description: string;
  greeting?: string;
  category: string;
  tags: string[];
  creator: {
    id: string;
    username: string;
  };
  stats: {
    rating: number;
    chats: number;
    favorites: number;
  };
  createdAt: string;
  updatedAt: string;
  nsfw: boolean;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  content: string;
  timestamp: string;
}

// User profile interface
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
  stats: {
    characters: number;
    chats: number;
    favorites: number;
  };
  settings: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: boolean;
  };
}

// Subscription plan interface
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
    lifetime?: number;
  };
  features: {
    messageLimit: number | 'unlimited';
    historyDays: number | 'unlimited';
    advancedFeatures: boolean;
    customCharacters: number | 'unlimited';
    priority: boolean;
    noAds: boolean;
  };
}