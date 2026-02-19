
export type Tone = 'Professional' | 'Witty' | 'Urgent' | 'Inspirational' | 'Informative';
export type Platform = 'LinkedIn' | 'Twitter' | 'Instagram';
export type ImageSize = '1K' | '2K' | '4K';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';

export interface CampaignData {
  idea: string;
  tone: Tone;
  imageSize: ImageSize;
}

export interface SocialPost {
  platform: Platform;
  content: string;
  hashtags: string[];
  suggestedPrompt: string;
  aspectRatio: AspectRatio;
  imageUrl?: string;
}

export interface CampaignResult {
  posts: SocialPost[];
}

export interface GeminiApiResponse {
  linkedIn: { content: string; hashtags: string[]; prompt: string };
  twitter: { content: string; hashtags: string[]; prompt: string };
  instagram: { content: string; hashtags: string[]; prompt: string };
}
