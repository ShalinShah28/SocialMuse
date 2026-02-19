
import { GoogleGenAI, Type } from "@google/genai";
import { CampaignData, CampaignResult, Platform } from "../types";

const TEXT_MODEL = 'gemini-3-flash-preview';

export async function generateSocialCampaign(data: CampaignData): Promise<CampaignResult> {
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

  const parsed = JSON.parse(response.text);
  
  const platforms: { id: Platform; data: any }[] = [
    { id: 'LinkedIn', data: parsed.linkedIn },
    { id: 'Twitter', data: parsed.twitter },
    { id: 'Instagram', data: parsed.instagram }
  ];

  const results: CampaignResult = {
    posts: platforms.map(p => ({
      platform: p.id,
      content: p.data.content,
      hashtags: p.data.hashtags
    }))
  };

  return results;
}
