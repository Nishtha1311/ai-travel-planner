
import { GoogleGenAI } from "@google/genai";
import { buildTripPrompt } from "../prompts/tripPrompt.js";

const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Add it to server/.env and restart the server."
    );
  }

  return new GoogleGenAI({ apiKey });
};

export const testGeminiConnection = async () => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Reply with exactly: Gemini connection successful",
  });

  return response.text;
};

const extractJson = (text) => {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    throw new Error("Gemini returned an invalid itinerary format. Please try again.");
  }
};

export const generateTripItinerary = async (trip) => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildTripPrompt(trip),
    config: {
      responseMimeType: "application/json",
      temperature: 0.7,
    },
  });

  return extractJson(response.text);
};