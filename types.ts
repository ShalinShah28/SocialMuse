
export type Tone = 'Professional' | 'Witty' | 'Urgent' | 'Inspirational' | 'Informative';
export type Platform = 'LinkedIn' | 'Twitter' | 'Instagram';

export interface CampaignData {
  idea: string;
  tone: Tone;
}

export interface SocialPost {
  platform: Platform;
  content: string;
  hashtags: string[];
}

export interface CampaignResult {
  posts: SocialPost[];
}

export interface GeminiApiResponse {
  linkedIn: { content: string; hashtags: string[] };
  twitter: { content: string; hashtags: string[] };
  instagram: { content: string; hashtags: string[] };
}
