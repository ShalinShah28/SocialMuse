
export type Tone = 'Professional' | 'Witty' | 'Urgent' | 'Inspirational' | 'Informative';
export type Platform = 'LinkedIn' | 'Twitter' | 'Instagram';

export interface SocialPost {
  platform: Platform;
  content: string;
  hashtags: string[];
}

// Interface for raw campaign input data
export interface CampaignData {
  idea: string;
  tone: Tone;
}

export interface CampaignResult {
  id: string;
  idea: string;
  tone: Tone;
  posts: SocialPost[];
  timestamp: number;
  userId: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export type View = 'home' | 'campaigns' | 'assets';