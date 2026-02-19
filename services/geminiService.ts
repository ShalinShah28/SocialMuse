
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CampaignData, CampaignResult, Platform, AspectRatio, ImageSize } from "../types";

const TEXT_MODEL = 'gemini-3-pro-preview';
const IMAGE_MODEL = 'gemini-3-pro-image-preview';

export async function generateSocialCampaign(data: CampaignData): Promise<CampaignResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are an expert social media strategist. 
    Given a core idea and tone, generate tailored content for LinkedIn, Twitter, and Instagram.
    
    Guidelines:
    - LinkedIn: Professional, long-form, networking-focused, value-driven.
    - Twitter: Short (under 280 chars), punchy, engaging, includes tags.
    - Instagram: Visual-first, conversational but concise, heavy on hashtags.
    
    For each platform, also provide a specific "visual prompt" for an AI image generator that captures the essence of the post.
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
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              prompt: { type: Type.STRING, description: "Detailed prompt for image generation" }
            },
            required: ["content", "hashtags", "prompt"]
          },
          twitter: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              prompt: { type: Type.STRING, description: "Detailed prompt for image generation" }
            },
            required: ["content", "hashtags", "prompt"]
          },
          instagram: {
            type: Type.OBJECT,
            properties: {
              content: { type: Type.STRING },
              hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
              prompt: { type: Type.STRING, description: "Detailed prompt for image generation" }
            },
            required: ["content", "hashtags", "prompt"]
          }
        },
        required: ["linkedIn", "twitter", "instagram"]
      }
    }
  });

  const parsed = JSON.parse(response.text);
  
  const platforms: { id: Platform; ratio: AspectRatio; data: any }[] = [
    { id: 'LinkedIn', ratio: '4:3', data: parsed.linkedIn },
    { id: 'Twitter', ratio: '16:9', data: parsed.twitter },
    { id: 'Instagram', ratio: '1:1', data: parsed.instagram }
  ];

  const results: CampaignResult = {
    posts: platforms.map(p => ({
      platform: p.id,
      content: p.data.content,
      hashtags: p.data.hashtags,
      suggestedPrompt: p.data.prompt,
      aspectRatio: p.ratio
    }))
  };

  return results;
}

export async function generatePostImage(prompt: string, aspectRatio: AspectRatio, size: ImageSize): Promise<string> {
  // Always create a new instance to ensure we pick up the latest selected key if changed
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: IMAGE_MODEL,
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data returned from Gemini");
}
