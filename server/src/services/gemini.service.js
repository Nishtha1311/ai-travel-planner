
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

const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const extractJson = (text) => {
  const cleanedText = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    console.error("Gemini raw response:", text);

    throw new Error(
      "Gemini returned an invalid itinerary format. Please try again."
    );
  }
};

export const testGeminiConnection = async () => {
  const ai = getAIClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Reply with exactly: Gemini connection successful",
  });

  return response.text;
};

export const generateTripItinerary = async (trip) => {
  const ai = getAIClient();
  const model = "gemini-2.5-flash";

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(`Generating itinerary — attempt ${attempt}/2`);

      const response = await ai.models.generateContent({
        model,
        contents: buildTripPrompt(trip),
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      return extractJson(response.text);
    } catch (error) {
      const status = error?.status;
      const errorMessage = error?.message || "";

      console.error(`Gemini generation error, attempt ${attempt}:`, errorMessage);

      // Quota is exhausted: retrying immediately only wastes requests.
      if (status === 429 || errorMessage.includes("quota")) {
        throw new Error(
          "Gemini quota is temporarily unavailable. Wait about one minute, then try again."
        );
      }

      // High demand: one short retry is useful.
      if (status === 503 && attempt < 2) {
        console.log("Gemini is busy. Retrying in 5 seconds...");
        await wait(5000);
        continue;
      }

      if (status === 503) {
        throw new Error(
          "Gemini is experiencing high demand right now. Please try again in a minute."
        );
      }

      throw error;
    }
  }
};