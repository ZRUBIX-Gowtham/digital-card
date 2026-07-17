"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProfileFromPrompt(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert profile generator for a digital business card platform. 
Given the user's prompt, generate a JSON object with the following fields to auto-fill their profile.
DO NOT output any markdown blocks or backticks, just output raw JSON that can be parsed by JSON.parse().

Fields:
{
  "name": "Full Name",
  "title": "Job Title or Role",
  "company": "Company Name",
  "tagline": "A short catchy tagline (under 60 chars)",
  "about": "A professional bio/about section (around 2-3 sentences)",
  "services": [
    { "title": "Service 1", "description": "Short description", "price": "e.g., $100", "icon": "Briefcase" }
  ]
}

User Prompt: ${prompt}`,
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up response if it contains markdown code blocks
    const cleanedText = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    const data = JSON.parse(cleanedText);
    return { ok: true, data };
  } catch (error) {
    console.error("AI Generation Error:", error);
    return { ok: false, error: "Failed to generate profile" };
  }
}

/**
 * Translate the card's narrative text into `targetLanguage`. The input is a
 * JSON string (produced by collectTranslatable) and the output must be JSON of
 * the exact same shape, so it can be stored under card.translations[lang] and
 * overlaid field-for-field. Names, numbers, emails and links are never sent
 * here — only prose — so nothing sensitive leaks and nothing structural breaks.
 */
export async function translateCardContent(
  json: string,
  targetLanguage: string,
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a professional translator for digital business cards.
Translate every string VALUE in the following JSON into ${targetLanguage}.
Rules:
- Keep the JSON structure, keys, and array order EXACTLY the same.
- Translate only the values, never the keys.
- Keep the tone professional and natural for a business audience.
- Do NOT translate brand names, product names, or proper nouns if they are commonly kept in English.
- Preserve any numbers, prices, and symbols as-is.
- Output RAW JSON only — no markdown, no backticks, no commentary.

JSON to translate:
${json}`,
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    return { ok: true, data };
  } catch (error) {
    console.error("AI Translation Error:", error);
    return { ok: false, error: "Failed to translate content" };
  }
}

export async function improveTextWithAI(text: string, context: string = "general text") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert copywriter. Improve the following text for a professional digital business card. 
The text is for: ${context}
Make it more professional, engaging, and clear. Do not add any conversational filler, just return the improved text directly.

Original text:
${text}`,
    });

    const improved = response.text?.trim();
    return { ok: true, data: improved };
  } catch (error) {
    console.error("AI Text Improvement Error:", error);
    return { ok: false, error: "Failed to improve text" };
  }
}
