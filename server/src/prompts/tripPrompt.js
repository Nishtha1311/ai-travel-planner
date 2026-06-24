export const buildTripPrompt = (trip) => {
  return `
You are an expert travel planner.

Create a practical, realistic, and detailed travel itinerary in India.

Trip details:
- Destination: ${trip.destination}
- Start date: ${trip.startDate.toISOString().split("T")[0]}
- End date: ${trip.endDate.toISOString().split("T")[0]}
- Number of days: ${trip.numberOfDays}
- Budget level: ${trip.budget}
- Number of travelers: ${trip.travelers}
- Travel style: ${trip.travelStyle}
- Interests: ${trip.interests.join(", ") || "General sightseeing"}
- Transport preference: ${trip.transportPreference}

Return ONLY valid JSON. Do not use markdown, backticks, explanations, or extra text.

Use this exact structure:
{
  "tripTitle": "string",
  "overview": "string",
  "estimatedBudget": {
    "currency": "INR",
    "total": 0,
    "transport": 0,
    "stay": 0,
    "food": 0,
    "activities": 0,
    "miscellaneous": 0
  },
  "hotelRecommendations": [
    {
      "name": "string",
      "area": "string",
      "priceRange": "string",
      "reason": "string"
    }
  ],
  "dailyItinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "string",
      "activities": [
        {
          "time": "string",
          "activity": "string",
          "location": "string",
          "estimatedCost": 0,
          "tips": "string"
        }
      ]
    }
  ]
}

Rules:
- Return exactly ${trip.numberOfDays} daily itinerary objects.
- Keep all estimated costs as numbers, not strings.
- Make the plan realistic for ${trip.budget} budget.
- Include 3 hotel recommendations.
- Use INR.
`;
};