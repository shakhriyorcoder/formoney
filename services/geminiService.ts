
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface StructuredProduct {
  title: string;
  price: number;
  currency: string;
  marketplace: string;
  link: string;
  imageUrl: string;
}

export const geminiService = {
  /**
   * Extremely Fast Image Recognition
   */
  async extractProductFromImage(base64Image: string): Promise<string> {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: {
          parts: [
            { text: "Identify this product. Return ONLY the brand and model name." },
            { inlineData: { data: base64Image, mimeType: 'image/jpeg' } }
          ]
        },
        config: { 
          thinkingConfig: { thinkingBudget: 0 },
          temperature: 0.1 
        }
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Gemini OCR Error:", error);
      throw error;
    }
  },

  /**
   * High-speed search with precise image URL extraction requirements
   */
  async findProductsViaSearch(query: string): Promise<StructuredProduct[]> {
    try {
      // We instruct the model to find REAL, direct image URLs from the product listings
      const prompt = `URGENT SEARCH: Find "${query}" listings on uzum.uz, wildberries.uz, and yandex.uz. 
      For each store, provide the specific product name, price in UZS, direct link, and the REAL product image URL found on the page.
      
      Return ONLY a raw JSON array. 
      Schema: [{"title": string, "price": number, "currency": "so'm", "marketplace": string, "link": string, "imageUrl": string}].
      
      IMAGE RULES:
      - The "imageUrl" MUST be a direct link to the product photo (ends in .jpg, .png, .webp, or is a valid CDN URL).
      - Do NOT use base64 strings or tiny thumbnails.
      - If multiple images exist, pick the primary one.
      
      No introduction, no markdown blocks, just the raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview", 
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
          temperature: 0.1,
          thinkingConfig: { thinkingBudget: 0 }
        },
      });

      const text = response.text || "[]";
      // Sanitize potential markdown code blocks if the model ignored "raw JSON" instruction
      const jsonStr = text.replace(/```json|```/g, "").trim();
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as StructuredProduct[];
      }
      return [];
    } catch (error) {
      console.error("Gemini Search Error:", error);
      return [];
    }
  }
};
