
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

export const regenerateTripDay = async (
  trip,
  dayNumber,
  instruction = "",
  currentItinerary = []
) => {
  const ai = getAIClient();
  const model = "gemini-2.5-flash";

  const existingDay =
    currentItinerary.find(
      (day, index) => (Number(day.day) || index + 1) === dayNumber
    ) || null;

  const prompt = `
You are an expert travel planner.

Regenerate ONLY Day ${dayNumber} for this trip.

Trip details:
- Destination: ${trip.destination}
- Number of days: ${trip.numberOfDays}
- Budget: ${trip.budget}
- Travelers: ${trip.travelers}
- Travel style: ${trip.travelStyle}
- Interests: ${(trip.interests || []).join(", ")}
- Transport preference: ${trip.transportPreference}

Current Day ${dayNumber} plan:
${existingDay ? JSON.stringify(existingDay, null, 2) : "No existing plan"}

User instruction:
${instruction || "Create a balanced and practical plan for this day."}

Return ONLY valid JSON in exactly this format:
{
  "day": ${dayNumber},
  "title": "Short title for the day",
  "activities": [
    "Activity 1",
    "Activity 2",
    "Activity 3"
  ]
}

Rules:
- Return exactly one day object.
- Include 3 to 5 practical activities.
- Keep activities realistic for the destination, travel style, interests, and budget.
- Do not include markdown, explanations, or code fences.
`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log(
        `Regenerating Day ${dayNumber} with Gemini — attempt ${attempt}/2`
      );

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      if (!response.text) {
        throw new Error("Gemini returned an empty response.");
      }

      const regeneratedDay = extractJson(response.text);

      if (
        !regeneratedDay ||
        !Array.isArray(regeneratedDay.activities)
      ) {
        throw new Error("Gemini returned an invalid day itinerary.");
      }

      return {
        day: dayNumber,
        title: regeneratedDay.title || `Day ${dayNumber}`,
        activities: regeneratedDay.activities
          .map((activity) =>
            typeof activity === "string"
              ? activity.trim()
              : activity?.name?.trim() ||
                activity?.description?.trim() ||
                ""
          )
          .filter(Boolean),
      };
    } catch (error) {
      const status = error?.status;
      const errorMessage = error?.message || "";

      console.error(
        `Gemini Day ${dayNumber} regeneration error, attempt ${attempt}:`,
        errorMessage
      );

      if (status === 429 || errorMessage.toLowerCase().includes("quota")) {
        throw new Error(
          "Gemini quota is temporarily unavailable. You can edit this day manually."
        );
      }

      if (status === 503 && attempt < 2) {
        console.log("Gemini is busy. Retrying in 5 seconds...");
        await wait(5000);
        continue;
      }

      if (status === 503) {
        throw new Error(
          "Gemini is experiencing high demand right now. You can edit this day manually."
        );
      }

      throw error;
    }
  }
};