
import { GoogleGenAI, Type } from "@google/genai";
// Fixed: Imported SocialPost and CampaignData to correctly type the generation output
import { CampaignData, SocialPost, Platform } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';

// Updated return type to specify the generated posts structure
export async function generateSocialCampaign(data: CampaignData): Promise<{ posts: SocialPost[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert social media strategist. 
    Given a core idea and tone, generate tailored content for LinkedIn, Twitter, and Instagram.
    
    Guidelines:
    - LinkedIn: Professional, long-form, networking-focused, value-driven.
    - Twitter: Short (under 280 chars), punchy, engaging, includes tags.
    - Instagram: Visual-first, conversational but concise, heavy on hashtags.
    
    Provide only the text content and hashtags for each platform.
  `;

  const prompt = `
    Generate a social media campaign for the following idea: "${data.idea}".
    The tone should be: ${data.tone}.
  `;

  const response = await ai.models.generateContent({
    model: TEXT_MODEL,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          linkedIn: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["content", "hashtags"]
          },
          twitter: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["content", "hashtags"]
          },
          instagram: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["content", "hashtags"]
          }
        },
        required: ["linkedIn", "twitter", "instagram"]
      }
    }
  });

  const text = response.text;
  if (!text) {
    throw new Error("Empty response from AI model");
  }
  const parsed = JSON.parse(text);
  
  const platforms: { id: Platform; data: any }[] = [
    { id: 'LinkedIn', data: parsed.linkedIn },
    { id: 'Twitter', data: parsed.twitter },
    { id: 'Instagram', data: parsed.instagram }
  ];

  // Fixed: Removed explicit CampaignResult type which was missing mandatory fields like id and timestamp
  // The full CampaignResult is constructed in the calling component
  const results = {
    posts: platforms.map(p => ({
      platform: p.id,
      content: p.data.content,
      hashtags: p.data.hashtags
    }))
  };

  return results;
}