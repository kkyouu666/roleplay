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
  age?: string;
  gender?: string;
  fullname?: string;
  personality?: string;
  appearance?: string;
  behavior?: string;
  raceCharacteristics?: string;
  abilities?: string;
  r18Settings?: string;
  detailedDescription?: string;
  metaHints?: string;
  dialogueExample?: string;
  selfIntroduction?: string;
  initialStatus?: string;
  statusUpdateRules?: string;
  statusDisplayTemplate?: string;
  enableStatusBar?: boolean;
  freeFormDetails?: string;
}

// Chat message interface
export interface ChatMessage {
  id: string;
  sender: 'user' | 'character' | 'system';
  content: string;
  timestamp: string;
}
